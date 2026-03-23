'use client'
import ModalDialog from '@/components/share/overlay/modal-dialog'
import UserForm from './user-form'
import { Button } from '@/components/ui/button'
import { useUserQueries } from '@/hooks/queries/user-query'
import { useCallback } from 'react'
import { useOverlay } from '@/hooks/contexts/use-overlay'
import { components } from '@/lib/client/api/v1'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Pen01Icon, Trash2 } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ConfirmDialog } from '@/components/share/overlay/confirm-dialog'

export const UserCreateAction = () => {
  const { createdUser } = useUserQueries()
  const { closeAll } = useOverlay()

  const onSubmit = useCallback(
    async (data: {
      name: string
      password?: string
      isAdmin: boolean
      isActive: boolean
    }) => {
      await createdUser.mutateAsync({
        body: {
          name: data.name,
          password: data.password,
          isAdmin: data.isAdmin,
          isActive: data.isActive,
        } as never,
      })
      closeAll()
    },
    [createdUser, closeAll],
  )

  return (
    <ModalDialog
      title="Create New User"
      description="Fill in the details to create a new user."
      trigger={<Button className="btn">Create User</Button>}
    >
      <UserForm
        onSubmit={onSubmit}
        isLoading={createdUser.isPending}
        requirePassword
      />
    </ModalDialog>
  )
}

export const UserEditAction = ({
  user,
}: {
  user: components['schemas']['User']
}) => {
  const { updatedUser } = useUserQueries()
  const { closeAll } = useOverlay()

  const onSubmit = useCallback(
    async (data: { name: string; isAdmin: boolean; isActive: boolean }) => {
      await updatedUser.mutateAsync({
        params: {
          path: {
            id: user.id,
          },
        },
        body: {
          name: data.name,
          isAdmin: data.isAdmin,
          isActive: data.isActive,
        },
      })
      closeAll()
    },
    [updatedUser, closeAll, user.id],
  )

  return (
    <ModalDialog
      title="Edit User"
      description="Update the details of the user."
      trigger={
        <DropdownMenuItem>
          <HugeiconsIcon icon={Pen01Icon} className="size-4" />
          แก้ไข
        </DropdownMenuItem>
      }
    >
      <UserForm
        value={{
          name: user.name,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
        }}
        onSubmit={onSubmit}
        isLoading={updatedUser.isPending}
      />
    </ModalDialog>
  )
}

export const UserDeleteAction = ({ userId }: { userId: string }) => {
  const { deletedUser } = useUserQueries()
  const { closeAll } = useOverlay()

  const handleDelete = useCallback(async () => {
    await deletedUser.mutateAsync({
      params: {
        path: {
          id: userId,
        },
      },
    })
    closeAll()
  }, [deletedUser, closeAll, userId])

  return (
    <ConfirmDialog
      dialogKey={`USER_DELETE_ACTION_${userId}`}
      onConfirm={handleDelete}
      title="ยืนยันการลบผู้ใช้งาน"
      description="คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
      trigger={
        <DropdownMenuItem variant="destructive" className="text-destructive">
          <HugeiconsIcon icon={Trash2} className="size-4" />
          ลบ
        </DropdownMenuItem>
      }
    />
  )
}
