import BaseRepo, { CreateInput, Entity, UpdateInput } from '@/lib/repository'
import { UserEntity } from '../entities/user.entity'
import { hash, verify } from '@/lib/encryptions/password'

type User = Entity<typeof UserEntity>
type UserCreate = CreateInput<typeof UserEntity>
type UserUpdate = UpdateInput<typeof UserEntity>

class UserRepository extends BaseRepo<typeof UserEntity> {
  constructor() {
    super({
      collectionName: 'users',
      schema: UserEntity,
      indexes: [
        { key: { name: 1 }, options: { unique: true, name: 'uniq_name' } },
      ],
    })
  }

  async create(data: UserCreate) {
    const existingUser = await this.findOne({ name: data.name })
    if (existingUser) {
      throw new Error('User with the same name already exists')
    }
    const hashedPassword = await hash(data.password)
    return super.create({
      ...data,
      password: hashedPassword,
    })
  }

  async createAdmin(data: Omit<UserCreate, 'isAdmin'>) {
    return this.create({
      ...data,
      isAdmin: true,
    })
  }

  public async login(credentials: { name: string; password: string }) {
    const collection = await this.getCollection()
    const user = await collection.findOne({ name: credentials.name })
    if (!user) {
      throw new Error('Invalid credentials')
    }
    const isValid = await verify(user.password, credentials.password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }
    if (!user.isActive) {
      throw new Error('User account is inactive')
    }
    await this.update(user.id, { lastLogin: new Date() })
    return user
  }
}

export type { User, UserCreate, UserUpdate }

export default UserRepository
