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

  public async login(credentials: { name: string; password: string }) {
    const collection = await this.getCollection()
    const user = await collection.findOne({ name: credentials.name })
    console.log('Found user for login:', user)
    if (!user) {
      throw new Error('Invalid credentials')
    }
    const isPasswordValid = await verify(user.password, credentials.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    if (!user.isActive) {
      throw new Error('User account is inactive')
    }

    return user
  }
}

export type { User, UserCreate, UserUpdate }

export default UserRepository
