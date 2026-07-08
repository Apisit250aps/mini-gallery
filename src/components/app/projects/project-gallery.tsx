import { Project } from '@/domains/entities/project'
import ProjectImage from './project-image'
import { shuffle } from 'lodash';

interface ProjectGalleryProps {
  projects?: Project[]
}

function ProjectGallery({ projects = [] }: ProjectGalleryProps) {
  const displayProjects = shuffle(projects)
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
      <section className="py-12 pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {displayProjects.map((project, index) => {
              return (
                <ProjectImage
                  project={project}
                  index={index}
                  key={project.id}
                />
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProjectGallery
