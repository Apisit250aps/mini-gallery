import { BaseEntity, BooleanField, EmailField, StringField } from '@/lib/repository'

export const userSchema = BaseEntity({
  name: StringField({ required: true }),
  email: EmailField({ required: true }),
  emailVerified: BooleanField({ nullable: true }),
})
