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
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

export default function ProjectNewView() {
  const router = useRouter()
  const { createdProject, projects } = useProjectQueries()

  const onSubmit = useCallback(
    async (data: ProjectFormValue) => {
      const maxDisplayOrder = (projects.data || []).reduce((max, project) => {
        return Math.max(max, project.displayOrder || 0)
      }, 0)

      await createdProject.mutateAsync({
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
          displayOrder: maxDisplayOrder + 1,
        },
      })

      router.push('/admin/projects')
    },
    [createdProject, projects.data, router],
  )

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>
            Fill all fields and manage gallery images before creating the
            project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm
            onSubmit={onSubmit}
            isLoading={createdProject.isPending}
          />
          <div className="mt-4 flex justify-end">
            <Button
              asChild
              variant="outline"
              disabled={createdProject.isPending}
            >
              <Link href="/admin/projects">Back to Project List</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
