import { ProjectEntity } from '../schemas/project'

class Project implements ProjectEntity {
  id: string
  name: string
  slug: string
  tags: string[]
  creator: string
  description: string | null
  isActive: boolean
  images: string[]
  createdAt: Date
  updatedAt: Date

  constructor(data: ProjectEntity) {
    this.id = data.id
    this.name = data.name
    this.slug = data.slug
    this.tags = data.tags
    this.creator = data.creator
    this.description = data.description
    this.isActive = data.isActive
    this.images = data.images
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}

export { Project }
