import { $api } from '@/lib/client'
import { toast } from 'sonner'

export const useUserQueries = () => {
  const users = $api.useQuery('get', '/users', undefined, {
    select: (res) => res.data || [],
  })
  const createdUser = $api.useMutation('post', '/users', {
    onSettled(data, error) {
      if (data) {
        toast.success('User created successfully!')
        users.refetch()
        return
      }
      if (error) {
        toast.error(
          `Failed to create user: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })
  const updatedUser = $api.useMutation('put', '/users/{id}', {
    onSettled(data, error) {
      if (data) {
        toast.success('User updated successfully!')
        users.refetch()
        return
      }
      if (error) {
        toast.error(
          `Failed to update user: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })
  const deletedUser = $api.useMutation('delete', '/users/{id}', {
    onSettled(data, error) {
      if (data) {
        toast.success('User deleted successfully!')
        users.refetch()
        return
      }
      if (error) {
        toast.error(
          `Failed to delete user: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })

  return {
    users,
    createdUser,
    updatedUser,
    deletedUser,
  }
}
