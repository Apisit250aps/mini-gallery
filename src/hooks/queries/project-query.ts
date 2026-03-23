import { $api } from '@/lib/client'

export const useProjectQueries = () => {
  const projects = $api.useQuery('get', '/projects', undefined, {
    select: (res) => res.data || [],
  })
  const createdProject = $api.useMutation('post', '/projects', {})
  const updatedProject = $api.useMutation('put', '/projects/{id}')
  const deletedProject = $api.useMutation('delete', '/projects/{id}')
  //
  const categories = $api.useQuery('get', '/categories', undefined, {
    select: (res) => res.data || [],
  })
  const createdCategory = $api.useMutation('post', '/categories', {})
  const updatedCategory = $api.useMutation('put', '/categories/{id}')
  const deletedCategory = $api.useMutation('delete', '/categories/{id}')

  return {
    projects,
    createdProject,
    updatedProject,
    deletedProject,
    //
    categories,
    createdCategory,
    updatedCategory,
    deletedCategory,
  }
}
