import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { projects, accentOf, textOn } from "@/data/projects"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { readFile } from "node:fs/promises"
import { globSync } from "node:fs"
import path from "node:path"

const CONTENT_DIR = path.join(process.cwd(), "content", "projects")
async function loadProjectContent(contentPath: string) {
  const fullPath = path.join(CONTENT_DIR, path.basename(contentPath))
  const source = await readFile(fullPath, "utf8")
  return source.replace(/^---[\s\S]*?---\s*/, "")
}

const GALLERY_DIR = path.join(process.cwd(), "public", "projects")
function loadKWeeklyGallery(): string[] {
  const videos = globSync("kweekly-*.mp4", { cwd: GALLERY_DIR }).sort()
  const images = globSync("kweekly-[0-9]*.{jpg,jpeg,png,webp}", { cwd: GALLERY_DIR })
  const num = (f: string) => {
    const match = f.match(/kweekly-(\d+)/)
    return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY
  }
  images.sort((a, b) => num(a) - num(b))
  return [...videos, ...images].map((file) => `/projects/${file}`)
}

export default async function KWeeklyPage() {
  const project = projects.find((item) => item.slug === "kweekly")!

  const mdxSource = await loadProjectContent(project.contentPath).catch(() => null)
  const galleryImages = loadKWeeklyGallery()
  const accent = accentOf(project)
  const onAccent = textOn(accent)

  return (
    <div className="bg-black pb-16 text-white">
      <div className="grid grid-cols-1 border-l border-t border-white/25 lg:grid-cols-2">
        <div
          className="flex flex-col justify-center gap-4 border-b border-r border-white/25 p-6 sm:p-10 lg:p-14"
          style={{ backgroundColor: accent, color: onAccent }}
        >
          <Link href="/projects" className="mb-4 inline-flex w-fit items-center gap-2 text-sm opacity-80 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: `${onAccent}99` }}>
            {project.category}
          </p>
          <h1 className="text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl">{project.title}</h1>
          <p className="max-w-md text-base leading-relaxed sm:text-lg" style={{ color: `${onAccent}cc` }}>
            {project.description}
          </p>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="group mt-2 inline-flex w-fit items-center gap-2 text-sm font-medium">
              Visit live site
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>
        <div className="relative min-h-[18rem] border-b border-r border-white/25 sm:min-h-[24rem] lg:min-h-0">
          <Image src={project.image || "/placeholder.svg"} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
        </div>
      </div>

      <div className="grid grid-cols-1 border-l border-t border-white/25 sm:grid-cols-3">
        <div className="border-b border-r border-white/25 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/45">Category</p>
          <p className="mt-2 text-2xl text-white sm:text-3xl">{project.category}</p>
        </div>
        <div className="border-b border-r border-white/25 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/45">Duration</p>
          <p className="mt-2 text-2xl text-white sm:text-3xl">{project.duration}</p>
        </div>
        <div className="border-b border-r border-white/25 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/45">Technologies</p>
          <p className="mt-2 text-2xl text-white sm:text-3xl">{project.technologies}</p>
        </div>
      </div>

      <div className="mt-0 w-full">
        <div className="relative aspect-video w-full">
          <video src={galleryImages[0]} className="h-full w-full object-cover" controls playsInline />
        </div>
      </div>

      <div className="pr-6 sm:pr-10 lg:pr-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="w-full">
            {galleryImages.slice(1).map((image, index) => {
              const isVideo = typeof image === "string" && image.endsWith(".mp4")
              return (
                <div key={image + index} className="group relative aspect-[4/3] w-full overflow-hidden border border-white/25">
                  {isVideo ? (
                    <video src={image} className="h-full w-full object-cover" controls playsInline />
                  ) : (
                    <Image src={image || "/placeholder.svg"} alt={`${project.title} preview ${index + 2}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  )}
                </div>
              )
            })}
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-normal text-white sm:text-2xl">Project Overview</h2>
              <p className="mt-2 text-white/70">{project.detailedDescription}</p>
            </div>
            <div>
              <h2 className="text-xl font-normal text-white sm:text-2xl">Key Features</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-white/70">
                {project.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-normal text-white sm:text-2xl">Project Writeup</h2>
              <div className="border border-white/25 p-4 text-white/70">
                {mdxSource ? (
                  <div className="space-y-4 [&_h2]:text-lg [&_h2]:font-normal [&_h2]:text-white [&_h3]:text-base [&_h3]:font-normal [&_h3]:text-white [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5">
                    <ReactMarkdown>{mdxSource}</ReactMarkdown>
                  </div>
                ) : <p>Project content is not available yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
