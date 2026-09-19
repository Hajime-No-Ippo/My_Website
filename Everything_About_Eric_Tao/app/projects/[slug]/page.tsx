import Image from "next/image"
import { notFound } from "next/navigation"
import { readFile } from "node:fs/promises"
import path from "node:path"
import ReactMarkdown from "react-markdown"
import { ArrowUpRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { accentOf, projects, textOn } from "@/data/projects"
import { cn } from "@/lib/utils"

export function generateStaticParams() {
  // Projects with a hand-built page own their path via a static segment. Next
  // prefers that segment at runtime, but prerendering it from here too would
  // produce two routes resolving to the same URL.
  return projects.filter((project) => !project.hasCustomPage).map((project) => ({ slug: project.slug }))
}

// Statically scoped: Next traces `path.join(process.cwd(), <dynamic>)` as
// filesystem access to the whole project and bundles every source file — the
// public folder included — into the server output. Pinning the directory and
// taking only the basename keeps the trace to content/projects, and blocks
// path traversal for free.
const CONTENT_DIR = path.join(process.cwd(), "content", "projects")
async function loadProjectContent(contentPath: string) {
  const fullPath = path.join(CONTENT_DIR, path.basename(contentPath))
  const source = await readFile(fullPath, "utf8")
  return source.replace(/^---[\s\S]*?---\s*/, "")
}

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  const mdxSource = await loadProjectContent(project.contentPath).catch(() => null)

  // Placeholder art is not worth a grid slot — drop it so the layout collapses
  // to a single column instead of rendering empty grey boxes.
  const galleryImages = project.additionalImages.filter((image) => !image.startsWith("/placeholder"))
  const hasGallery = galleryImages.length > 0

  const accent = accentOf(project)
  const onAccent = textOn(accent)

  return (
    // Same Swiss/full-bleed grid language as the project gallery: black
    // ground, square corners, a colour panel carrying the project's own
    // accent paired with its hero image.
    <div className="bg-black pb-16 text-white">
      <div className="grid grid-cols-1 border-l border-t border-white/25 lg:grid-cols-2">
        <div
          className="flex flex-col justify-center gap-4 border-b border-r border-white/25 p-6 sm:p-10 lg:p-14"
          style={{ backgroundColor: accent, color: onAccent }}
        >
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: `${onAccent}99` }}>
            {project.category}
          </p>
          <h1 className="text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl">{project.title}</h1>
          <p className="max-w-md text-base leading-relaxed sm:text-lg" style={{ color: `${onAccent}cc` }}>
            {project.description}
          </p>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-2 inline-flex w-fit items-center gap-2 text-sm font-medium"
            >
              Visit live site
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>

        <div className="relative min-h-[18rem] border-b border-r border-white/25 sm:min-h-[24rem] lg:min-h-0">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Full-bleed, same convention as the hero grid above — no `container`
          here — with noticeably bigger type than a typical meta strip. */}
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

      <div className="container mt-10 sm:mt-14">
        <div className={cn("grid gap-10 lg:gap-14", hasGallery && "lg:grid-cols-[0.9fr_1.1fr]")}>
          <div className="order-2 space-y-4 lg:order-1">
            {hasGallery && (
              <div className="grid grid-cols-1 border-l border-t border-white/25 sm:grid-cols-2">
                {galleryImages.map((image, index) => (
                  <Dialog key={image + index}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="group relative aspect-[4/3] overflow-hidden border-b border-r border-white/25 text-left"
                        aria-label={`Open ${project.title} preview ${index + 1}`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${project.title} preview ${index + 1}`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-4xl overflow-hidden rounded-none border-white/25 bg-black p-0">
                      <DialogTitle className="sr-only">{`${project.title} preview ${index + 1}`}</DialogTitle>
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${project.title} preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </div>

          <div className={cn("order-1 space-y-8 lg:order-2", hasGallery && "lg:border-l lg:border-white/25 lg:pl-10")}>
            <div>
              <h2 className="text-xl font-normal text-white sm:text-2xl">Project Overview</h2>
              <p className="mt-2 text-white/70">{project.detailedDescription}</p>
            </div>

            <div>
              <h2 className="text-xl font-normal text-white sm:text-2xl">Key Features</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-white/70">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-normal text-white sm:text-2xl">Project Writeup</h2>
              <div className="border border-white/25 p-4 text-white/70">
                {mdxSource ? (
                  <div className="space-y-4 [&_h2]:text-lg [&_h2]:font-normal [&_h2]:text-white [&_h3]:text-base [&_h3]:font-normal [&_h3]:text-white [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5">
                    <ReactMarkdown>{mdxSource}</ReactMarkdown>
                  </div>
                ) : (
                  <p>Project content is not available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
