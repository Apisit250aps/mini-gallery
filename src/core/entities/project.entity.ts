import {
  zodModel,
  zodPositiveNumber,
  zodSlug,
  zodStringOptional,
  zodStringRequired,
  zodUrl,
  zodUuid,
} from '@/lib/repository/zod'
import z from 'zod'

export const ProjectEntity = zodModel({
  title: zodStringRequired,
  slug: zodSlug,
  location: zodStringOptional,
  type: zodStringOptional,
  category: zodUuid,
  program: zodStringOptional,
  client: zodStringOptional,
  siteArea: zodStringOptional,
  builtArea: zodStringOptional,
  design: zodStringOptional,
  completion: zodStringOptional,
  description: zodStringOptional,
  tags: z.array(zodStringOptional).default([]),
  galleries: z.array(zodUrl).default([]),
  displayOrder: zodPositiveNumber,
})

export type Project = z.infer<typeof ProjectEntity>
