import Repository from '@/lib/repository'
import { User } from '@/domains/entities/user'
import { IUserRepository } from '@/domains/repositories/user.repo'
import { MongoClient, WithId } from 'mongodb'

class UserRepository extends Repository<User> implements IUserRepository {
  constructor(client: MongoClient) {
    super(client, 'user', [
      {
        key: { email: 1 },
        unique: true,
        name: 'uniq_email',
      },
    ])
  }

  toEntity(data: WithId<User>): User {
    return new User({
      id: data._id.toString(),
      name: data.name,
      email: data.email,
      emailVerified: data.emailVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}

export default UserRepository
