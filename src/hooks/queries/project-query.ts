import { $api } from '@/lib/client'
import { toast } from 'sonner'

export const useProjectQueries = () => {
  const projects = $api.useQuery('get', '/projects', undefined, {
    select: (res) => res.data || [],
  })
  const categories = $api.useQuery('get', '/categories', undefined, {
    select: (res) => res.data || [],
  })
  const createdProject = $api.useMutation('post', '/projects', {
    onSettled(data, error) {
      if (data) {
        toast.success('Project created successfully!')
        projects.refetch()
        return
      }
      if (error) {
        toast.error(
          `Failed to create project: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })
  const updatedProject = $api.useMutation('put', '/projects/{id}', {
    onSettled(data, error) {
      if (data) {
        toast.success('Project updated successfully!')
        projects.refetch()
        return
      }
      if (error) {
        toast.error(
          `Failed to update project: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })
  const deletedProject = $api.useMutation('delete', '/projects/{id}', {
    onSettled(data, error) {
      if (data) {
        toast.success('Project deleted successfully!')
        projects.refetch()
        return
      }
      if (error) {
        toast.error(
          `Failed to delete project: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })
  const uploadImage = $api.useMutation('post', '/upload/image', {
    onSettled(data, error) {
      if (error) {
        toast.error(
          `Failed to upload image: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })
  const createdCategory = $api.useMutation('post', '/categories', {
    onSettled(data, error) {
      if (data) {
        toast.success('Category created successfully!')
        categories.refetch()
        return
      }
      if (error) {
        toast.error(
          `Failed to create category: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })
  const updatedCategory = $api.useMutation('put', '/categories/{id}', {
    onSettled(data, error) {
      if (data) {
        toast.success('Category updated successfully!')
        categories.refetch()
        return
      }
      if (error) {
        toast.error(
          `Failed to update category: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })
  const deletedCategory = $api.useMutation('delete', '/categories/{id}', {
    onSettled(data, error) {
      if (data) {
        toast.success('Category deleted successfully!')
        categories.refetch()
        return
      }
      if (error) {
        toast.error(
          `Failed to delete category: ${error.message || 'Unknown error'}`,
        )
      }
    },
  })

  return {
    projects,
    createdProject,
    updatedProject,
    deletedProject,
    uploadImage,
    //
    categories,
    createdCategory,
    updatedCategory,
    deletedCategory,
  }
}
