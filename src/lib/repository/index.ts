import client from '@/lib/db/client'
import {
  Collection,
  Filter,
  MongoClient,
  OptionalUnlessRequiredId,
} from 'mongodb'

import type {
  AnyZodObject,
  BaseRepoConfig,
  CreateInput,
  Entity,
  IndexDefinition,
  UpdateInput,
} from './types'
import { uuid_v7 } from './uuid'

export type { AnyZodObject, Entity, IndexDefinition } from './types'
export type { CreateInput, UpdateInput, BaseRepoConfig } from './types'

export default abstract class BaseRepo<TSchema extends AnyZodObject> {
  protected readonly client: MongoClient
  protected readonly collectionName: string
  protected readonly schema: TSchema
  private readonly indexes: IndexDefinition[]
  private _collection: Collection<Entity<TSchema>> | null = null

  constructor(config: BaseRepoConfig<TSchema>) {
    this.client = config.client ?? client
    this.collectionName = config.collectionName
    this.schema = config.schema
    this.indexes = config.indexes ?? []
  }

  protected async getCollection(): Promise<Collection<Entity<TSchema>>> {
    if (this._collection) return this._collection

    await this.client.connect()
    const db = this.client.db()
    const collection = db.collection<Entity<TSchema>>(this.collectionName)

    const allIndexes: IndexDefinition[] = [
      { key: { id: 1 }, options: { unique: true, name: 'uniq_id' } },
      ...this.indexes,
    ]

    await collection.createIndexes(
      allIndexes.map(({ key, options }) => ({ key, ...options })),
    )

    this._collection = collection
    return this._collection
  }

  protected uuid(): string {
    return uuid_v7()
  }

  public async validate(
    data: unknown,
    { partial = false }: { partial?: boolean } = {},
  ): Promise<Entity<TSchema>> {
    const result = partial
      ? await this.schema.partial().safeParseAsync(data)
      : await this.schema.safeParseAsync(data)
    if (!result.success) {
      throw new Error(`Validation failed: ${result.error.message}`)
    }
    return result.data as Entity<TSchema>
  }

  async create(data: CreateInput<TSchema>): Promise<Entity<TSchema>> {
    const collection = await this.getCollection()
    const document = await this.validate({
      ...data,
      id: this.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await collection.insertOne(
      document as OptionalUnlessRequiredId<Entity<TSchema>>,
    )
    return document
  }

  async findById(id: string): Promise<Entity<TSchema> | null> {
    const collection = await this.getCollection()
    const document = await collection.findOne({ id } as unknown as Filter<
      Entity<TSchema>
    >)
    return document ? (document as Entity<TSchema>) : null
  }

  async findOne(
    filter: Filter<Entity<TSchema>>,
  ): Promise<Entity<TSchema> | null> {
    const collection = await this.getCollection()
    const document = await collection.findOne(filter)
    return document ? (document as Entity<TSchema>) : null
  }

  async findMany(
    filter: Filter<Entity<TSchema>> = {},
  ): Promise<Entity<TSchema>[]> {
    const collection = await this.getCollection()
    const documents = await collection.find(filter).toArray()
    return documents as Entity<TSchema>[]
  }

  async update(
    id: string,
    data: UpdateInput<TSchema>,
  ): Promise<Entity<TSchema> | null> {
    const current = await this.findById(id)
    if (!current) return null

    const nextDocument = await this.validate({
      ...current,
      ...data,
      id,
      createdAt: current.createdAt,
      updatedAt: new Date(),
    })

    const collection = await this.getCollection()
    await collection.updateOne({ id } as unknown as Filter<Entity<TSchema>>, {
      $set: nextDocument,
    })

    return nextDocument
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ id } as unknown as Filter<
      Entity<TSchema>
    >)
    return result.deletedCount > 0
  }

  async exists(filter: Filter<Entity<TSchema>>): Promise<boolean> {
    const collection = await this.getCollection()
    const document = await collection.findOne(filter)
    return document !== null
  }
}
