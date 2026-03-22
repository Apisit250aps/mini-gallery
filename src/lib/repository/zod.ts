import z from 'zod'

import { slug, uuid } from './libs'

export const zodModel = <T extends z.ZodRawShape>(schema: T) => {
  return z.object({
    id: zodAutoUuid,
    ...schema,
    createdAt: zodTimeStamp,
    updatedAt: zodTimeStamp,
  })
}

export const zodTimeStamp = z.date().default(() => new Date())
export const zodTimeNullable = z.date().nullable().default(null)
// 
export const zodAutoUuid = z.uuid().default(() => uuid())
export const zodUrl = z.url()
export const zodUuid = z.uuid()
export const zodSlug = z.string().min(1).transform(slug)
// string
export const zodStringTrim = z.string().trim()
export const zodStringOrNumber = z.union([z.string(), z.number()])
export const zodStringOrDate = z.union([z.string(), z.date()])
export const zodStringRequired = z.string().min(1)
export const zodStringOptional = z.string().min(1).optional()
export const zodStringNullable = z.string().min(1).nullable()
//
export const zodNumberRequired = z.number()
export const zodNumberOptional = z.number().optional()
export const zodNumberNullable = z.number().nullable()
export const zodPositiveNumber = z.number().positive()
// 
export const zodBoolean = z.boolean()