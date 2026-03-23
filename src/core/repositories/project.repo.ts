import BaseRepo, { CreateInput, Entity, UpdateInput } from '@/lib/repository'
import { ProjectEntity } from '../entities/project.entity'
import { Filter } from 'mongodb'

type Project = Entity<typeof ProjectEntity>
type ProjectCreate = CreateInput<typeof ProjectEntity>
type ProjectUpdate = UpdateInput<typeof ProjectEntity>

class ProjectRepository extends BaseRepo<typeof ProjectEntity> {
  constructor() {
    super({
      collectionName: 'projects',
      schema: ProjectEntity,
      indexes: [
        { key: { slug: 1 }, options: { unique: true, name: 'uniq_slug' } },
      ],
    })
  }

  async create(data: Omit<ProjectCreate, 'slug'>) {
    const validate = await super.validate({
      ...data,
      title: data.title,
      slug: data.title,
    })

    const existingProject = await this.findOne({ slug: validate.slug })
    if (existingProject) {
      throw new Error('Project with the same slug already exists')
    }

    return super.create(validate)
  }

  async findAllWithCategory(filter: Filter<Project> = {}) {
    const collection = await this.getCollection()
    return collection
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: 'id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      ])
      .toArray()
  }
}

export type { Project, ProjectCreate, ProjectUpdate }
export default ProjectRepository
