import { $api } from '@/lib/client'

export const useUserQueries = () => {
  const users = $api.useQuery('get', '/users', undefined, {
    select: (res) => res.data || [],
  })
  const createdUser = $api.useMutation('post', '/users', {})
  const updatedUser = $api.useMutation('put', '/users/{id}')
  const deletedUser = $api.useMutation('delete', '/users/{id}')

  return {
    users,
    createdUser,
    updatedUser,
    deletedUser,
  }
}
