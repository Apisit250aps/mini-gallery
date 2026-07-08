import type { BaseRepository } from '@/lib/repository'
import type { Project } from '../entities/project'
import type { CreateProjectInput, UpdateProjectInput } from '../schemas/project'

interface IProjectRepository extends BaseRepository<
  Project,
  CreateProjectInput,
  UpdateProjectInput
> {
  findOneBySlug(slug: string): Promise<Project | null>
}

export type { IProjectRepository }
