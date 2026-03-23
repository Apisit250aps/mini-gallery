'use client'

import ImageFrame from '@/components/share/gallery/ImageFrame'
import { useProjectContext } from '@/hooks/contexts/project-provider'

export default function Home() {
  const projects = useProjectContext().projects || []

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-10 lg:gap-15">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <ImageFrame
              key={`${project.id}-${index}`}
              slug={project.slug}
              coverImage={project.galleries?.[0] || '/placeholder.png'}
              title={project.title}
              location={project.location || 'Unknown Location'}
              loading={index === 0 ? 'eager' : 'lazy'}
              priority={index === 0}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-lg font-light">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
