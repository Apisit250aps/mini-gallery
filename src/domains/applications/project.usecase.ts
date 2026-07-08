
import { Project } from '../entities/project';
import { CreateProjectInput, UpdateProjectInput } from '../schemas/project'
import { BaseUseCase } from '@/lib/applications'
type CreateContext = {
  data: CreateProjectInput
}

type UpdateContext = {
  projectId: string
  data: UpdateProjectInput
}

type UniqueContext = {
  projectId: string
}

type ICreateProjectUseCase = BaseUseCase<CreateContext, Project>
type IUpdateProjectUseCase = BaseUseCase<UpdateContext, Project>
type IDeleteProjectUseCase = BaseUseCase<UniqueContext, boolean>
type IGetProjectUseCase = BaseUseCase<UniqueContext, Project>
type IListProjectsUseCase = BaseUseCase<undefined, Project[]>

export type {
  CreateContext,
  UpdateContext,
  UniqueContext,
  //
  ICreateProjectUseCase,
  IUpdateProjectUseCase,
  IDeleteProjectUseCase,
  IGetProjectUseCase,
  IListProjectsUseCase,
}
