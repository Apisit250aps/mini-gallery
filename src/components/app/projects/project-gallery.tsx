'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export interface ProjectItem {
  id: string
  name: string
  slug: string
  tags: string[]
  creator: string
  description: string | null
  images: string[]
  createdAt: string // ISO string or date string
  updatedAt?: string | null
}

interface ProjectGalleryProps {
  className?: string
  projects?: ProjectItem[]
}

const ProjectGallery = ({ className, projects = [] }: ProjectGalleryProps) => {
  const displayProjects = projects

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Header Section */}
      <header className="container mx-auto px-6 pt-24 pb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">
            Creative Portfolio
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight uppercase mb-4 bg-linear-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent sm:text-6xl">
            Mini Gallery
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A beautiful curated space showcasing modern concrete pavilions,
            glasshouses in nature, and minimalist spatial designs.
          </p>
        </div>
      </header>

      {/* Projects Grid Section */}
      <section className={cn('py-12 pb-24', className)}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project, index) => {
              const coverImage =
                project.images && project.images.length > 0
                  ? project.images[0]
                  : 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modern Architectural Elegance at Twilight.png'

              const year = project.createdAt
                ? new Date(project.createdAt).getFullYear().toString()
                : '2025'

              const primaryTag =
                project.tags && project.tags.length > 0
                  ? project.tags[0]
                  : 'Architecture'

              return (
                <Link
                  href={`/projects/${project.slug}`}
                  key={project.id}
                  className="block group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(index * 0.1, 0.4),
                    }}
                    viewport={{ once: true }}
                    className="overflow-hidden bg-card hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
                  >
                    <div className="overflow-hidden relative aspect-video bg-muted">
                      <Image
                        src={coverImage}
                        alt={project.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        priority={index < 3}
                      />
                      {project.images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs px-2 py-1 rounded text-[10px] text-white font-medium z-10">
                          {project.images.length} Photos
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between flex-grow px-5 py-4">
                      <div>
                        <h2 className="text-lg font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                          {project.name}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {project.description || 'No description provided.'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                        <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                          {primaryTag}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {year}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export { ProjectGallery }
export default ProjectGallery
