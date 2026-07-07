import { User } from '@/domains/entities/user'
import { IUserRepository } from '@/domains/repositories/user.repo'
// import client from '@/lib/client'
import Repository from '@/lib/repository'
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

const main = async () => {
  const client = new MongoClient('mongodb://localhost:27017/mini-gallery')
  const userRepo = new UserRepository(client)

  const user = await userRepo.findAll()
  console.log(user)
}

main().catch(console.error)
