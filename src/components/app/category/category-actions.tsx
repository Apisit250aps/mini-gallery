'use client'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import CategoryForm from './category-form'
import { Button } from '@/components/ui/button'
import { useProjectQueries } from '@/hooks/queries/project-query'
import { useCallback } from 'react'
import { useOverlay } from '@/hooks/contexts/use-overlay'

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
