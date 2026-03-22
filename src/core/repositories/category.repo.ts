import BaseRepo, { CreateInput, Entity, UpdateInput } from '@/lib/repository'
import { CategoryEntity } from '../entities/category.entity'

type Category = Entity<typeof CategoryEntity>
type CategoryCreate = CreateInput<typeof CategoryEntity>
type CategoryUpdate = UpdateInput<typeof CategoryEntity>

class CategoryRepository extends BaseRepo<typeof CategoryEntity> {
  constructor() {
    super({
      collectionName: 'categories',
      schema: CategoryEntity,
      indexes: [
        { key: { slug: 1 }, options: { unique: true, name: 'uniq_slug' } },
      ],
    })
  }

  async create(data: Omit<CategoryCreate, 'slug'>) {
    const validate = await super.validate({
      name: data.name,
      slug: data.name,
    })

    const existingCategory = await this.findOne({ slug: validate.slug })
    if (existingCategory) {
      throw new Error('Category with the same slug already exists')
    }

    return super.create(validate)
  }
}

export type { Category, CategoryCreate, CategoryUpdate }
export default CategoryRepository
