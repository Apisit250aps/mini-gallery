import z from 'zod'
import uuid from './uuid'
import slugify from 'slugify'

export const zodModel = <T extends z.ZodRawShape>(schema: T) => {
  return z.object({
    id: z
      .string()
      .uuid()
      .default(() => uuid()),
    ...schema,
    createdAt: zodTimeStamp,
    updatedAt: zodTimeStamp,
  })
}

export const zodTimeStamp = z.date().default(() => new Date())
export const zodSlug = z
  .string()
  .min(1)
  .transform((str) =>
    slugify(str, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    }),
  )
// string
export const zodStringOrNumber = z.union([z.string(), z.number()])
export const zodStringOrDate = z.union([z.string(), z.date()])
export const zodStringRequired = z.string().min(1)
export const zodStringOptional = z.string().min(1).optional()
export const zodStringNullable = z.string().min(1).nullable()
//
