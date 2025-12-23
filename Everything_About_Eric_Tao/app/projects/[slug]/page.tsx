import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { projects } from "@/data/projects"

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="pb-12">
      <div className="container pt-12">
        <div className="mb-8">
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to projects
          </Link>
        </div>
      </div>

      <div className="relative h-screen w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="absolute inset-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full items-end p-8 text-white">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">{project.category}</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold font-saffron">{project.title}</h1>
            <p className="mt-3 text-sm md:text-base text-white/80">{project.description}</p>
          </div>
        </div>
      </div>

      <div className="container mt-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {project.additionalImages.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {project.additionalImages.map((image, index) => (
                <div key={image + index} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/70">
                  <Image src={image || "/placeholder.svg"} alt={`${project.title} preview ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#E77421]/80">{project.category}</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold font-saffron">{project.title}</h1>
            <p className="mt-3 text-muted-foreground">{project.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold font-saffron">Project Overview</h2>
              <p className="mt-2 text-muted-foreground">{project.detailedDescription}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold font-saffron">Technologies</h2>
              <p className="mt-2 text-muted-foreground">{project.technologies}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold font-saffron">Duration</h2>
              <p className="mt-2 text-muted-foreground">{project.duration}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold font-saffron">Key Features</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
              Content source: {project.contentPath}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
