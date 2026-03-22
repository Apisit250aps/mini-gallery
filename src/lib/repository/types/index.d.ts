import { CreateIndexesOptions, IndexDirection, MongoClient } from 'mongodb'
import z from 'zod'

export type AnyZodObject = z.ZodObject<z.ZodRawShape>

export type Entity<TSchema extends AnyZodObject> = z.infer<TSchema>

export type CreateInput<TSchema extends AnyZodObject> = Omit<
  Entity<TSchema>,
  'id' | 'createdAt' | 'updatedAt'
>

export type UpdateInput<TSchema extends AnyZodObject> = Partial<
  CreateInput<TSchema>
>

export type IndexDefinition = {
  key: Record<string, IndexDirection>
  options?: CreateIndexesOptions
}

export type BaseRepoConfig<TSchema extends AnyZodObject> = {
  collectionName: string
  schema: TSchema
  indexes?: IndexDefinition[]
  client?: MongoClient
}
