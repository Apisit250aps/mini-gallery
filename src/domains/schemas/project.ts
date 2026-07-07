import {
  BaseEntity,
  BooleanField,
  StringField,
  ObjectIdField,
} from '@/lib/repository'
import z from 'zod'

export const projectSchema = BaseEntity({
  name: StringField({ required: true }),
  slug: StringField({ required: true }),
  tags: z
    .array(StringField({ required: true }))
    .optional()
    .default([]),
  creator: ObjectIdField({ required: true }),
  description: StringField({ nullable: true }),
  isActive: BooleanField({ required: true }),
  images: z
    .array(StringField({ required: true }))
    .optional()
    .default([]),
})

export type ProjectEntity = z.infer<typeof projectSchema>
