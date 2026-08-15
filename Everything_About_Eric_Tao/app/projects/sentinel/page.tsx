import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { readFile } from "node:fs/promises"
import path from "node:path"
import ReactMarkdown from "react-markdown"
import FluidLens from "@/components/sentinel-headings/fluid-lens"
import SpecimenScene from "@/components/sentinel-headings/specimen-scene"
import SentinelCanvas from "@/components/sentinel-canvas/SentinelCanvas"
import { CurtainOnArrival } from "@/components/curtain"
import { accentOf, projects } from "@/data/projects"

// Hand-built page. Next resolves this static segment ahead of /projects/[slug],
// and the [slug] route skips prerendering it via `hasCustomPage`.
const project = projects.find((item) => item.slug === "sentinel")

export const metadata: Metadata = {
  title: "SENTINEL — Eric Tao",
  description: project?.description,
}

// Statically scoped: Next traces `path.join(process.cwd(), <dynamic>)` as
// filesystem access to the whole project and bundles every source file — the
// public folder included — into the server output. Pinning the directory and
// taking only the basename keeps the trace to content/projects, and blocks
// path traversal for free.
const CONTENT_DIR = path.join(process.cwd(), "content", "projects")
async function loadWriteup(contentPath: string) {
  const fullPath = path.join(CONTENT_DIR, path.basename(contentPath))
  const source = await readFile(fullPath, "utf8")
  return source.replace(/^---[\s\S]*?---\s*/, "")
}

export default async function SentinelPage() {
  if (!project) notFound()

  const writeup = await loadWriteup(project.contentPath).catch(() => null)
  const gallery = project.additionalImages.filter((image) => !image.startsWith("/placeholder"))

  return (
    // The project's own colour is scoped here, so everything below reads green
    // without touching the site accent used by the nav, footer and other pages.
    <div className="pb-16" style={{ ["--accent" as string]: accentOf(project) }}>
      {/* Only fires for a direct/pasted URL — a click from the gallery has
          already drawn the curtain, and the provider skips a second run. */}
      <CurtainOnArrival href="/projects/sentinel" accent={accentOf(project)} word={project.title} />

      {/* The type specimen as scene content, refracted by a real glass lens.
          Everything inside the canvas is GPU-drawn, so the wordmark and its
          registration lines come from troika glyph bounds rather than DOM. */}
      <FluidLens className="h-[80vh] w-full" material={{ ior: 1.09, chromaticAberration: 0.03, roughness: 0.05, thickness: 1.2, temporalDistortion: 0.2 }}>
        <SpecimenScene />
      </FluidLens>

      <div className="container pt-10">
        <Link href="/projects" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          ← Back to projects
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{project.category}</p>
          <h1 className="mt-3 font-saffron text-4xl font-bold sm:text-5xl">{project.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>
        </div>

        <dl className="mt-10 grid gap-6 border-y border-border/70 py-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Duration</dt>
            <dd className="mt-2 text-foreground">{project.duration}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Technologies</dt>
            <dd className="mt-2 text-foreground">{project.technologies}</dd>
          </div>
        </dl>
      </div>

      {/* The workbench canvas from the actual product, embedded live with one
          canned mapping — not a screenshot. Full-bleed so the cards get room. */}
      <section className="mt-12">
        <div className="container">
          <h2 className="font-saffron text-2xl font-semibold">The workbench, live</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            SENTINEL&apos;s canvas migrated straight out of the product: drag the cards, wire the
            nodes, leave a note, or reply in the session thread. The data is one canned mapping
            (Singapore · Electronic Transactions Act 2010); the interaction is the real thing.
          </p>
        </div>
        <div className="container mt-5">
          <SentinelCanvas className="h-[72vh] min-h-[480px] w-full overflow-hidden border border-border/70" />
        </div>
      </section>

      <div className="container mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-10">
          <section>
            <h2 className="font-saffron text-2xl font-semibold">Overview</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{project.detailedDescription}</p>
          </section>

          <section>
            <h2 className="font-saffron text-2xl font-semibold">What it does</h2>
            <ul className="mt-4 space-y-3">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-muted-foreground">
                  <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-[var(--accent)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {writeup && (
            <section>
              <h2 className="font-saffron text-2xl font-semibold">Writeup</h2>
              <div className="mt-4 space-y-4 text-muted-foreground [&_h2]:mt-8 [&_h2]:font-saffron [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:leading-relaxed [&_p]:leading-relaxed [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                <ReactMarkdown>{writeup}</ReactMarkdown>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          {gallery.map((image, index) => (
            <figure key={image} className="border border-border/70">
              <div className="relative aspect-[16/10]">
                <Image
                  src={image}
                  alt={`${project.title} interface ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
