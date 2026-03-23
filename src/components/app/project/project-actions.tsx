'use client'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import ProjectForm from './project-form'
import { Button } from '@/components/ui/button'
import { useProjectQueries } from '@/hooks/queries/project-query'
import { useCallback } from 'react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { components } from '@/lib/client/api/v1'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Pen01Icon, Trash2 } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'

export const ProjectCreateAction = () => {
  const { createdProject } = useProjectQueries()
  const { closeAll } = useOverlay()

  const onSubmit = useCallback(
    async (data: {
      title: string
      category: string
      displayOrder: number
      tags: string[]
      galleries: string[]
    }) => {
      await createdProject.mutateAsync({
        body: {
          title: data.title,
          slug: data.title,
          category: data.category,
          displayOrder: data.displayOrder,
          tags: data.tags,
          galleries: data.galleries,
        },
      })
      closeAll()
    },
    [createdProject, closeAll],
  )

  return (
    <ModalDialog
      title="Create New Project"
      description="Fill in the details to create a new project."
      trigger={<Button className="btn">Create Project</Button>}
    >
      <ProjectForm onSubmit={onSubmit} isLoading={createdProject.isPending} />
    </ModalDialog>
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
    async (data: {
      title: string
      category: string
      displayOrder: number
      tags: string[]
      galleries: string[]
    }) => {
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
          displayOrder: data.displayOrder,
          tags: data.tags,
          galleries: data.galleries,
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
          category: project.category,
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
