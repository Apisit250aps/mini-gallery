import type {
  CreateContext,
  UpdateContext,
  UniqueContext,
  ICreateProjectUseCase,
  IDeleteProjectUseCase,
  IGetProjectUseCase,
  IListProjectsUseCase,
  IUpdateProjectUseCase,
} from '@/domains/applications/project.usecase'
import { Project } from '@/domains/entities/project'
import { IProjectRepository } from '@/domains/repositories/project.repo'
import { createProjectSchema } from '@/domains/schemas/project'
import {
  DuplicateError,
  NotFoundError,
  throwAppError,
  ValidationError,
} from '@/lib/applications'

class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}
  async execute(input: CreateContext): Promise<Project> {
    try {
      const parsed = await createProjectSchema.safeParseAsync(input.data)
      console.log('Parsed data:', parsed)
      if (!parsed.success) {
        throw new ValidationError(parsed.error.message)
      }
      const project = await this.projectRepository.findOneBySlug(
        parsed.data.slug,
      )
      if (project) {
        throw new DuplicateError('Project with this slug already exists')
      }
      const createdProject = await this.projectRepository.create(parsed.data)
      return createdProject
    } catch (error) {
      return throwAppError(error)
    }
  }
}

class UpdateProjectUseCase implements IUpdateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}
  async execute(input: UpdateContext): Promise<Project> {
    try {
      const project = await this.projectRepository.findById(input.projectId)
      if (!project) {
        throw new NotFoundError('Project not found')
      }
      const updatedProject = await this.projectRepository.update(
        input.projectId,
        { ...project, ...input.data },
      )
      return updatedProject
    } catch (error) {
      return throwAppError(error)
    }
  }
}

class DeleteProjectUseCase implements IDeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}
  async execute(input: UniqueContext): Promise<boolean> {
    try {
      const project = await this.projectRepository.findById(input.projectId)
      if (!project) {
        throw new NotFoundError('Project not found')
      }
      await this.projectRepository.delete(input.projectId)
      return true
    } catch (error) {
      return throwAppError(error)
    }
  }
}

class GetProjectUseCase implements IGetProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}
  async execute(input: UniqueContext): Promise<Project> {
    try {
      const project = await this.projectRepository.findById(input.projectId)
      if (!project) {
        throw new NotFoundError('Project not found')
      }
      return project
    } catch (error) {
      return throwAppError(error)
    }
  }
}

class ListProjectsUseCase implements IListProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}
  async execute(): Promise<Project[]> {
    try {
      const projects = await this.projectRepository.findAll()
      return projects
    } catch (error) {
      return throwAppError(error)
    }
  }
}

export {
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectUseCase,
  ListProjectsUseCase,
}
