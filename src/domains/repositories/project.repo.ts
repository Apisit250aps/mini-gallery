import type { BaseRepository } from '@/lib/repository'
import type { Project } from '../entities/project'

type IProjectRepository = BaseRepository<
  Project,
  Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>
>

export type { IProjectRepository }
