import type { BaseRepository } from '@/lib/repository'
import type { User } from '../entities/user'

type IUserRepository = BaseRepository<
  User,
  Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
>

export type { IUserRepository }
