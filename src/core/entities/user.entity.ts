import {
  zodModel,
  zodStringRequired,
  zodStringTrim,
  zodBoolean,
  zodTimeNullable,
} from '@/lib/repository/zod'

export const UserEntity = zodModel({
  name: zodStringTrim,
  password: zodStringRequired,
  isAdmin: zodBoolean.default(false),
  isActive: zodBoolean.default(true),
  //
  lastLogin: zodTimeNullable,
})
