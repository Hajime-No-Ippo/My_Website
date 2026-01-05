import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { readFile } from "node:fs/promises"
import path from "node:path"
import ReactMarkdown from "react-markdown"
import { projects } from "@/data/projects"

async function loadProjectContent(contentPath: string) {
  const normalized = contentPath.replace(/^\/+/, "")
  const fullPath = path.join(process.cwd(), normalized)
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

  return (
    <div className="pb-12">
      <div className="container pt-8 sm:pt-12">
        <div className="mb-6">
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to projects
          </Link>
        </div>
      </div>

      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
        <div className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh]">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="absolute inset-0 object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 flex h-full items-end p-6 sm:p-10 text-white">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">{project.category}</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold font-saffron">{project.title}</h1>
              <p className="mt-3 text-sm sm:text-base text-white/80">{project.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-8 sm:mt-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 space-y-6 lg:order-1">
            {project.additionalImages.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {project.additionalImages.map((image, index) => (
                  <div
                    key={image + index}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/70"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${project.title} preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="order-1 space-y-6 lg:order-2">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4 sm:p-5">
              <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#E77421]/80">Category</p>
                  <p className="mt-1 text-foreground">{project.category}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#E77421]/80">Duration</p>
                  <p className="mt-1 text-foreground">{project.duration}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#E77421]/80">Technologies</p>
                  <p className="mt-1 text-foreground">{project.technologies}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold font-saffron">Project Overview</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{project.detailedDescription}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold font-saffron">Key Features</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground sm:text-base">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold font-saffron">Project Writeup</h2>
              <div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
                {mdxSource ? (
                  <div className="space-y-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_p]:leading-relaxed">
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
