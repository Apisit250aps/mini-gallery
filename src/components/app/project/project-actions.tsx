'use client'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import ProjectForm, { ProjectFormValue } from './project-form'
import { Button } from '@/components/ui/button'
import { useProjectQueries } from '@/hooks/queries/project-query'
import { useCallback } from 'react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { components } from '@/lib/client/api/v1'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Pen01Icon, Trash2 } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'
import Link from 'next/link'
import { toast } from 'sonner'

export const ProjectCreateAction = () => {
  return (
    <Button asChild className="btn">
      <Link href="/admin/project/new">Create Project</Link>
    </Button>
  )
}

export const ProjectEditAction = ({
  project,
}: {
  project: components['schemas']['Project']
}) => {
  const { updatedProject } = useProjectQueries()
  const { closeAll } = useOverlay()

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

      await updatedProject.mutateAsync({
        params: {
          path: {
            id: project.id,
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
          displayOrder: data.displayOrder,
          tags: data.tags,
          galleries: galleryUrls,
        },
      })
      closeAll()
    },
    [updatedProject, closeAll, project.id],
  )

  return (
    <ModalDialog
      title="Edit Project"
      description="Update the details of the project."
      trigger={
        <DropdownMenuItem>
          <HugeiconsIcon icon={Pen01Icon} className="size-4" />
          แก้ไข
        </DropdownMenuItem>
      }
    >
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
          displayOrder: project.displayOrder,
          tags: project.tags,
          galleries: project.galleries,
        }}
        onSubmit={onSubmit}
        isLoading={updatedProject.isPending}
      />
    </ModalDialog>
  )
}

export const ProjectDeleteAction = ({ projectId }: { projectId: string }) => {
  const { deletedProject } = useProjectQueries()
  const { closeAll } = useOverlay()

  const handleDelete = useCallback(async () => {
    await deletedProject.mutateAsync({
      params: {
        path: {
          id: projectId,
        },
      },
    })
    closeAll()
  }, [deletedProject, closeAll, projectId])

  return (
    <ConfirmDialog
      dialogKey={`PROJECT_DELETE_ACTION_${projectId}`}
      onConfirm={handleDelete}
      title="ยืนยันการลบโปรเจกต์"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจกต์นี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      trigger={
        <DropdownMenuItem variant="destructive" className="text-destructive">
          <HugeiconsIcon icon={Trash2} className="size-4" />
          ลบ
        </DropdownMenuItem>
      }
    />
  )
}
