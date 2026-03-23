import { $api } from '@/lib/client'

export const useUserQueries = () => {
  const list = $api.useQuery('get', '/users', undefined, {
    select: (res) => res.data || [],
  })
  const created = $api.useMutation('post', '/users', {})
  const updated = $api.useMutation('put', '/users/{id}')
  const deleted = $api.useMutation('delete', '/users/{id}')

  return {
    list,
    created,
    updated,
    deleted,
  }
}
