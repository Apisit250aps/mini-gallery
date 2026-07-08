import Repository from '@/lib/repository'
import { MongoClient, ObjectId, WithId } from 'mongodb'

import { Project } from '@/domains/entities/project'
import { IProjectRepository } from '@/domains/repositories/project.repo'

class ProjectRepository
  extends Repository<Project>
  implements IProjectRepository
{
  constructor(client: MongoClient) {
    super(client, 'project', [
      {
        key: { slug: 1 },
        unique: true,
        name: 'uniq_slug',
      },
    ])
  }

  toEntity(data: WithId<Project & { creator: ObjectId }>): Project {
    return new Project({
      id: data._id.toString(),
      description: data.description,
      isActive: data.isActive,
      images: data.images,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      name: data.name,
      slug: data.slug,
      tags: data.tags,
      creator: data.creator.toString(),
    })
  }

  async findOneBySlug(slug: string): Promise<Project | null> {
    const col = await this.collection
    const data = await col.findOne({ slug })
    if (!data) {
      return null
    }
    return data
  }
}

export default ProjectRepository
