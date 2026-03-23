'use client'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import CategoryForm from './category-form'
import { Button } from '@/components/ui/button'
import { useProjectQueries } from '@/hooks/queries/project-query'
import { useCallback } from 'react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { components } from '@/lib/client/api/v1'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Pen01Icon, Trash2 } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'

export const CategoryCreateAction = () => {
  const { createdCategory } = useProjectQueries()
  const { closeAll } = useOverlay()
  const onSubmit = useCallback(
    async (data: { name: string }) => {
      await createdCategory.mutateAsync({
        body: {
          name: data.name,
        },
      })
      closeAll()
    },
    [createdCategory, closeAll],
  )
  return (
    <ModalDialog
      title="Create New Category"
      description="Fill in the details to create a new category."
      trigger={<Button className="btn">Create Category</Button>}
    >
      <CategoryForm onSubmit={onSubmit} isLoading={createdCategory.isPending} />
    </ModalDialog>
  )
}

export const CategoryEditAction = ({
  category,
}: {
  category: components['schemas']['Category']
}) => {
  const { updatedCategory } = useProjectQueries()
  const { closeAll } = useOverlay()
  const onSubmit = useCallback(
    async (data: { name: string }) => {
      await updatedCategory.mutateAsync({
        params: {
          path: {
            id: category.id,
          },
        },
        body: {
          name: data.name,
        },
      })
      closeAll()
    },
    [updatedCategory, closeAll, category.id],
  )

  return (
    <ModalDialog
      title="Edit Category"
      description="Update the details of the category."
      trigger={
        <DropdownMenuItem>
          <HugeiconsIcon icon={Pen01Icon} className="size-4" />
          แก้ไข
        </DropdownMenuItem>
      }
    >
      <CategoryForm onSubmit={onSubmit} isLoading={updatedCategory.isPending} />
    </ModalDialog>
  )
}

export const CategoryDeleteAction = ({
  categoryId,
}: {
  categoryId: string
}) => {
  const { deletedCategory } = useProjectQueries()
  const { closeAll } = useOverlay()
  const handleDelete = useCallback(async () => {
    await deletedCategory.mutateAsync({
      params: {
        path: {
          id: categoryId,
        },
      },
    })
    closeAll()
  }, [deletedCategory, closeAll, categoryId])

  return (
    <ConfirmDialog
      dialogKey={`CATEGORY_DELETE_ACTION_${categoryId}`}
      onConfirm={handleDelete}
      title="ยืนยันการลบห้องเรียน"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียนนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      trigger={
        <DropdownMenuItem variant="destructive" className="text-destructive">
          <HugeiconsIcon icon={Trash2} className="size-4" />
          ลบ
        </DropdownMenuItem>
      }
    />
  )
}
