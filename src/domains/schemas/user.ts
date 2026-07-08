import {
  BaseEntity,
  BooleanField,
  EmailField,
  StringField,
} from '@/lib/repository/entity'
import z from 'zod'

export const userSchema = BaseEntity({
  name: StringField({ required: true }),
  email: EmailField({ required: true }),
  emailVerified: BooleanField({ nullable: true }),
})

export type UserEntity = z.infer<typeof userSchema>
