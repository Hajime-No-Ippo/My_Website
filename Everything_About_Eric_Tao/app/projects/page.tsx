import React from "react"
import Image from "next/image"
import Link from "next/link"
import { projects, type Project } from "@/data/projects"
import { CurtainLink, curtainFor } from "@/components/curtain"

const page = () => {
  return (
    <div className="container py-12">
      <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-black via-background to-[#0f0f0f] p-6 md:p-10 shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(231,116,33,0.25),_transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#E77421]/80">Selected work</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold font-saffron">Projects & Experiments</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Explore recent frontend, product, and full-stack builds. Filter by craft or search by keywords to jump
              into specifics.
            </p>
          </div>
        </div>
      </div>

      <div className="grid mt-10 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            className="group overflow-hidden rounded-xl border border-border/70 bg-card shadow-lg transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                {project.category}
              </span>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <h2 className="text-xl font-semibold font-saffron">{project.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
              </div>

              <div className="pt-2">
                <ProjectLink project={project} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

/**
 * One link per card. Projects with a registered curtain open through it; the
 * rest navigate normally. Lives inside the map's scope by taking the project as
 * a prop — `projects` is the array, so `slug` only exists on an element of it.
 */
function ProjectLink({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`
  const visual = curtainFor(href)
  const className = "inline-flex items-center text-sm font-medium text-[#E77421] hover:text-[#E77421]/80"
  const label = "View project content →"

  if (visual && project.accent) {
    return (
      <CurtainLink href={href} accent={project.accent} word={project.title} visual={visual} className={className}>
        {label}
      </CurtainLink>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

export default page
