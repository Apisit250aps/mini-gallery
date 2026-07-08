import client from '@/lib/client'

import ProjectRepository from './repositories/project.repo'

import {
  CreateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectUseCase,
  ListProjectsUseCase,
  UpdateProjectUseCase,
} from './applications/project.usecase'

const projectRepository = new ProjectRepository(client)

export const getProjectUseCase = new GetProjectUseCase(projectRepository)
export const listProjectsUseCase = new ListProjectsUseCase(projectRepository)
export const createProjectUseCase = new CreateProjectUseCase(projectRepository)
export const updateProjectUseCase = new UpdateProjectUseCase(projectRepository)
export const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository)
