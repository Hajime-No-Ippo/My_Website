#!/usr/bin/env node
/**
 * Rasterise a PDF deck into web-ready page images plus a manifest.
 *
 *   node scripts/build-deck.mjs <input.pdf> <slug> [--out public/decks]
 *
 * Requires poppler (`pdftoppm`, `pdfinfo`) and `cwebp` on PATH:
 *   brew install poppler webp
 *
 * Why pre-rasterise instead of rendering the PDF in the browser: it keeps
 * pdfjs (~1MB) out of the bundle, lets each page lazy-load independently, and
 * gives us page 1 as a thumbnail/OG image for free.
 */
import { execFile } from "node:child_process"
import { mkdir, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"

const run = promisify(execFile)

// Desktop gets the wide render; phones never need more than ~900px.
const WIDTHS = [1600, 900]
const QUALITY = 82

function parseArgs(argv) {
  const positional = []
  let outRoot = "public/decks"

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--out") {
      outRoot = argv[i + 1]
      i += 1
    } else {
      positional.push(argv[i])
    }
  }

  const [pdfPath, slug] = positional
  if (!pdfPath || !slug) {
    console.error("usage: node scripts/build-deck.mjs <input.pdf> <slug> [--out public/decks]")
    process.exit(1)
  }
  return { pdfPath, slug, outRoot }
}

async function assertTooling() {
  for (const tool of ["pdfinfo", "pdftoppm", "cwebp"]) {
    try {
      await run("which", [tool])
    } catch {
      console.error(`Missing \`${tool}\`. Install with: brew install poppler webp`)
      process.exit(1)
    }
  }
}

/** Per-page point dimensions, so the viewer can letterbox odd pages correctly. */
async function readPageSizes(pdfPath) {
  const { stdout } = await run("pdfinfo", ["-l", "9999", pdfPath])
  const sizes = []

  for (const line of stdout.split("\n")) {
    const match = line.match(/^Page\s+(\d+)\s+size:\s+([\d.]+)\s+x\s+([\d.]+)\s+pts/)
    if (match) {
      sizes.push({ page: Number(match[1]), width: Number(match[2]), height: Number(match[3]) })
    }
  }

  if (sizes.length === 0) {
    throw new Error("pdfinfo reported no pages — is the file a valid PDF?")
  }
  return sizes
}

/**
 * The aspect the viewer sizes its page cells to. Pages that differ (a cover
 * exported at a different size, say) get letterboxed into this box rather than
 * stretched, so nothing distorts and the spread never jitters mid-flip.
 */
function dominantAspect(sizes) {
  const tally = new Map()

  for (const { width, height } of sizes) {
    // Round hard: exports drift by fractions of a point between pages.
    const key = (width / height).toFixed(2)
    const entry = tally.get(key) ?? { ratio: width / height, count: 0 }
    entry.count += 1
    tally.set(key, entry)
  }

  return [...tally.values()].sort((a, b) => b.count - a.count)[0].ratio
}

async function main() {
  const { pdfPath, slug, outRoot } = parseArgs(process.argv.slice(2))
  await assertTooling()

  const sizes = await readPageSizes(pdfPath)
  const aspect = dominantAspect(sizes)
  const outDir = path.join(outRoot, slug)

  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  console.log(`${slug}: ${sizes.length} pages, page aspect ${aspect.toFixed(4)}`)

  for (const width of WIDTHS) {
    // pdftoppm keeps the aspect when only one axis is pinned.
    await run("pdftoppm", ["-png", "-scale-to-x", String(width), "-scale-to-y", "-1", pdfPath, path.join(outDir, `w${width}`)])

    const pngs = (await readdir(outDir)).filter((file) => file.startsWith(`w${width}-`) && file.endsWith(".png")).sort()

    await Promise.all(
      pngs.map(async (file) => {
        const pageNumber = Number(file.match(/-(\d+)\.png$/)[1])
        const source = path.join(outDir, file)
        const target = path.join(outDir, `${String(pageNumber).padStart(2, "0")}-${width}.webp`)
        await run("cwebp", ["-quiet", "-q", String(QUALITY), source, "-o", target])
        await rm(source)
      }),
    )

    console.log(`  ${width}px → ${pngs.length} webp`)
  }

  const manifest = {
    slug,
    pageCount: sizes.length,
    aspect: Number(aspect.toFixed(4)),
    widths: WIDTHS,
    // Relative to the deck base URL so the same manifest works whether pages
    // are served from /public or from Blob.
    pages: sizes.map(({ page, width, height }) => ({
      page,
      aspect: Number((width / height).toFixed(4)),
      files: Object.fromEntries(WIDTHS.map((w) => [w, `${String(page).padStart(2, "0")}-${w}.webp`])),
    })),
  }

  const manifestPath = path.join("data", "decks", `${slug}.json`)
  await mkdir(path.dirname(manifestPath), { recursive: true })
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  console.log(`manifest → ${manifestPath}`)
  console.log(`pages    → ${outDir}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
