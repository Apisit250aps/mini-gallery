'use client'

import { Category } from '@/core/repositories/category.repo'
import {  ProjectWithCategory } from '@/core/repositories/project.repo'
import { createContext, useContext, useState } from 'react'

type ProjectContextValue = {
  projects: ProjectWithCategory[]
  categories: Category[]
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

  return (
    <ProjectContext.Provider value={{ projects, categories }}>
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
