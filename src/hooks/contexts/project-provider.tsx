'use client'

import { Category } from '@/core/repositories/category.repo'
import { ProjectWithCategory } from '@/core/repositories/project.repo'
import { usePathname, useSearchParams } from 'next/navigation'
import { createContext, useContext, useMemo, useState } from 'react'

type ProjectContextValue = {
  projects: ProjectWithCategory[]
  categories: Category[]
  activeCategorySlug: string
  filteredProjects: ProjectWithCategory[]
  getCategoryHref: (slug: string) => string
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export const ProjectProvider = ({
  children,
  initProjects = [],
  initCategories = [],
}: {
  children: React.ReactNode
  initProjects?: ProjectWithCategory[]
  initCategories?: Category[]
}) => {
  const [projects] = useState<ProjectWithCategory[]>(initProjects)
  const [categories] = useState<Category[]>(initCategories)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeCategorySlug = searchParams.get('category') || ''

  const filteredProjects = useMemo(() => {
    if (!activeCategorySlug) {
      return projects
    }

    return projects.filter(
      (project) => project.category?.slug === activeCategorySlug,
    )
  }, [projects, activeCategorySlug])

  const getCategoryHref = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        categories,
        activeCategorySlug,
        filteredProjects,
        getCategoryHref,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjectContext = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider')
  }
  return context
}
