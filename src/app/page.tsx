import ProjectGallery from '@/components/app/projects/project-gallery'
import { listProjectsUseCase } from '@/infrastructures'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const projects = await listProjectsUseCase.execute()
  return (
    <ProjectGallery projects={projects.map((project) => ({ ...project }))} />
  )
}
