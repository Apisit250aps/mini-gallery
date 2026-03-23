import BaseRepo, { CreateInput, Entity, UpdateInput } from '@/lib/repository'
import { ProjectEntity } from '../entities/project.entity'
import { Filter } from 'mongodb'
import { Category } from './category.repo'

type Project = Entity<typeof ProjectEntity>
type ProjectCreate = CreateInput<typeof ProjectEntity>
type ProjectUpdate = UpdateInput<typeof ProjectEntity>
type ProjectWithCategory = Project & { category: Category | null }
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

  async findAllWithCategory(
    filter: Filter<Project> = {},
  ): Promise<ProjectWithCategory[]> {
    const collection = await this.getCollection()
    return collection
      .aggregate<ProjectWithCategory>([
        { $match: filter },
        { $sort: { displayOrder: 1, createdAt: 1 } },
        { $project: { _id: 0 } },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: 'id',
            as: 'category',
            pipeline: [{ $project: { _id: 0 } }],
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      ])
      .toArray()
  }

  async sortByDisplayOrder(projectIds: string[]) {
    if (!projectIds.length) {
      return 0
    }

    const collection = await this.getCollection()
    const now = new Date()

    const result = await collection.bulkWrite(
      projectIds.map((id, index) => ({
        updateOne: {
          filter: { id } as Filter<Project>,
          update: {
            $set: {
              displayOrder: index + 1,
              updatedAt: now,
            },
          },
        },
      })),
    )

    return result.modifiedCount
  }
}

export type { Project, ProjectCreate, ProjectUpdate, ProjectWithCategory }
export default ProjectRepository
