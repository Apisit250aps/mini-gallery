'use client'
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

export const ProjectCreateAction = () => {
  return (
    <Button asChild className="btn">
      <Link href="/admin/projects/new">Create Project</Link>
    </Button>
  )
}

export const ProjectEditAction = ({
  project,
}: {
  project: components['schemas']['Project']
}) => {
  return (
    <DropdownMenuItem asChild>
      <Link href={`/admin/projects/${project.id}`}>
        <HugeiconsIcon icon={Pen01Icon} className="size-4" />
        แก้ไข
      </Link>
    </DropdownMenuItem>
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
