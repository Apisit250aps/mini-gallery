import ProjectGallery from '@/components/app/projects/project-gallery'
import { listProjectsUseCase } from '@/infrastructures'

export default async function Home() {
  const projects = await listProjectsUseCase.execute()
  return (
    <ProjectGallery projects={projects.map((project) => ({ ...project }))} />
  )
}
