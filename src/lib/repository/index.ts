import client from '@/lib/db/client'
import {
  Collection,
  Filter,
  MongoClient,
  OptionalUnlessRequiredId,
  WithId,
} from 'mongodb'

import type {
  AnyZodObject,
  BaseRepoConfig,
  CreateInput,
  Entity,
  IndexDefinition,
  UpdateInput,
} from './types'
import { uuid } from './libs'
export type { AnyZodObject, Entity, IndexDefinition } from './types'
export type { CreateInput, UpdateInput, BaseRepoConfig } from './types'

export default abstract class BaseRepo<TSchema extends AnyZodObject> {
  protected readonly schema: TSchema
  protected readonly client: MongoClient
  protected readonly collectionName: string
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

  protected generateUuid(): string {
    return uuid()
  }

  private toPublicEntity(document: WithId<Entity<TSchema>>): Entity<TSchema> {
    const { _id, ...rest } = document
    void _id
    return rest as Entity<TSchema>
  }

  public async validate(
    data: unknown,
    { partial = false }: { partial?: boolean } = {},
  ): Promise<Entity<TSchema>> {
    const result = partial
      ? this.schema.partial().parse(data)
      : this.schema.parse(data)
    if (!result.success) {
      throw new Error(`Validation failed: ${result.message}`)
    }
    return result as Entity<TSchema>
  }

  async create(data: CreateInput<TSchema>): Promise<Entity<TSchema>> {
    const collection = await this.getCollection()
    const document = await this.validate({
      ...data,
      id: this.generateUuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await collection.insertOne(
      document as OptionalUnlessRequiredId<Entity<TSchema>>,
    )

    const createdDocument = await this.findById(document.id as string)

    if (!createdDocument) {
      throw new Error(`Created document not found: ${result.insertedId}`)
    }

    return createdDocument
  }

  async findById(id: string): Promise<Entity<TSchema> | null> {
    const collection = await this.getCollection()
    const document = await collection.findOne({
      id,
    } as unknown as Filter<Entity<TSchema>>)
    return document ? this.toPublicEntity(document) : null
  }

  async findOne(
    filter: Filter<Entity<TSchema>>,
  ): Promise<Entity<TSchema> | null> {
    const collection = await this.getCollection()
    const document = await collection.findOne(filter)
    return document ? this.toPublicEntity(document) : null
  }

  async findMany(
    filter: Filter<Entity<TSchema>> = {},
  ): Promise<Entity<TSchema>[]> {
    const collection = await this.getCollection()
    const documents = await collection.find(filter).toArray()
    return documents.map((document) => this.toPublicEntity(document))
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

    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({
      id,
    } as unknown as Filter<Entity<TSchema>>)
    return result.deletedCount > 0
  }

  async exists(filter: Filter<Entity<TSchema>>): Promise<boolean> {
    const collection = await this.getCollection()
    const document = await collection.findOne(filter)
    return document !== null
  }

  async count(filter: Filter<Entity<TSchema>> = {}): Promise<number> {
    const collection = await this.getCollection()
    return collection.countDocuments(filter)
  }
}
