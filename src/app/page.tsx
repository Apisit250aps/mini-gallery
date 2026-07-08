import { listProjectsUseCase } from '@/infrastructures'
import ProjectGallery, { ProjectItem } from '@/components/app/projects/project-gallery'

export default async function Home() {
  let projectsData: ProjectItem[] = []
  try {
    const dbProjects = await listProjectsUseCase.execute()
    projectsData = dbProjects
      .filter((p) => p.isActive)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        tags: p.tags,
        creator: p.creator,
        description: p.description,
        images: p.images,
        createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
      }))
  } catch (error) {
    console.error('Error loading projects for SSR:', error)
  }

  return (
    <ProjectGallery projects={projectsData} />
  )
}
