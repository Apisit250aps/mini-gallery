import { UserEntity } from '@/domains/schemas/user'

export class User implements UserEntity {
  id: string
  name: string
  email: string
  emailVerified: boolean | null
  createdAt: Date
  updatedAt: Date

  constructor(data: UserEntity) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.emailVerified = data.emailVerified ?? null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
