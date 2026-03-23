'use client'

import ProjectForm, {
  ProjectFormValue,
} from '@/components/app/project/project-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useProjectQueries } from '@/hooks/queries/project-query'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

export default function ProjectEditView() {
  const params = useParams<{ projectId: string }>()
  const router = useRouter()
  const { projects, updatedProject } = useProjectQueries()

  const projectId = params?.projectId
  const project = (projects.data || []).find((item) => item.id === projectId)

  const onSubmit = useCallback(
    async (data: ProjectFormValue) => {
      if (!projectId) return

      await updatedProject.mutateAsync({
        params: {
          path: {
            id: projectId,
          },
        },
        body: {
          title: data.title,
          slug: data.title,
          category: data.category,
          location: data.location,
          type: data.type,
          program: data.program,
          client: data.client,
          siteArea: data.siteArea,
          builtArea: data.builtArea,
          design: data.design,
          completion: data.completion,
          description: data.description,
          tags: data.tags,
          galleries: data.galleries as string[],
        },
      })

      router.push('/admin/projects')
    },
    [projectId, updatedProject, router],
  )

  if (projects.isPending) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading project...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Project not found</CardTitle>
            <CardDescription>
              The project may have been deleted or this URL is invalid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/admin/projects">Back to Project List</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
          <CardDescription>
            Update the project information and reorder gallery images.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm
            value={{
              title: project.title,
              category: project.category?.id || '',
              location: project.location,
              type: project.type,
              program: project.program,
              client: project.client,
              siteArea: project.siteArea,
              builtArea: project.builtArea,
              design: project.design,
              completion: project.completion,
              description: project.description,
              tags: project.tags,
              galleries: project.galleries as string[],
            }}
            onSubmit={onSubmit}
            isLoading={updatedProject.isPending}
          />
          <div className="mt-4 flex justify-end">
            <Button
              asChild
              variant="outline"
              disabled={updatedProject.isPending}
            >
              <Link href="/admin/projects">Back to Project List</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
