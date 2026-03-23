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
import { toast } from 'sonner'

export default function NewProjectPage() {
  const router = useRouter()
  const { createdProject } = useProjectQueries()

  const onSubmit = useCallback(
    async (data: ProjectFormValue) => {
      const files = data.galleries.filter(
        (item): item is File => item instanceof File,
      )

      if (files.length > 0) {
        toast.error('Please upload images first and submit using URL values.')
        return
      }

      const galleryUrls = data.galleries.filter(
        (item): item is string => typeof item === 'string',
      )

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
          galleries: galleryUrls,
          displayOrder: data.displayOrder,
        },
      })

      router.push('/admin')
    },
    [createdProject, router],
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
              <Link href="/admin">Back to Project List</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
