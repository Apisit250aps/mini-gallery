import { projectRepository, userRepository } from '@/infrastructures'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/app/projects/project-detail'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params

  const dbProject = await projectRepository.findOneBySlug(slug)
  if (!dbProject) {
    notFound()
  }

  const creator = await userRepository.findById(dbProject.creator)
  if (!creator) {
    notFound()
  }

  return (
    <ProjectDetail
      project={JSON.parse(
        JSON.stringify({
          ...dbProject,
          creator: creator.name || creator.email,
        }),
      )}
    />
  )
}
