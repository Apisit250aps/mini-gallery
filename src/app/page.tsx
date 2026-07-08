import { listProjectsUseCase } from '@/infrastructures'
import Projects5, { ProjectItem } from '@/components/projects5'

export default async function Home() {
  let projectsData: ProjectItem[] = []
  try {
    const dbProjects = await listProjectsUseCase.execute()
    projectsData = dbProjects
      .filter((p) => p.isActive)
      .map((p) => ({
        id: p.id,
        title: p.name,
        slug: p.slug,
        img: p.images && p.images.length > 0 ? p.images[0] : 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modern Architectural Elegance at Twilight.png',
        year: p.createdAt ? new Date(p.createdAt).getFullYear().toString() : '2025',
        type: p.tags && p.tags.length > 0 ? p.tags[0] : 'Architecture',
        description: p.description,
        images: p.images && p.images.length > 0 ? p.images : ['https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/Modern Architectural Elegance at Twilight.png'],
      }))
  } catch (error) {
    console.error('Error loading projects for SSR:', error)
  }

  return (
    <Projects5 projects={projectsData} />
  )
}
