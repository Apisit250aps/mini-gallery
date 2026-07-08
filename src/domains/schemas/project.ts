import {
  BaseEntity,
  BooleanField,
  StringField,
  ObjectIdField,
} from '@/lib/repository/entity'
import z from 'zod'

export const projectSchema = BaseEntity({
  name: StringField({ required: true }),
  slug: StringField({ required: true }),
  tags: z
    .array(StringField({ required: true }))
    .optional()
    .default([]).unwrap(),
  creator: ObjectIdField({ required: true }),
  description: StringField({ nullable: true }),
  isActive: BooleanField({ required: true }),
  images: z
    .array(StringField({ required: true }))
    .optional()
    .default([]).unwrap(),
})

export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateProjectSchema = createProjectSchema.omit({ slug: true }).partial()

export type ProjectEntity = z.infer<typeof projectSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
