import { zodModel, zodSlug, zodStringTrim } from '@/lib/repository/zod'

export const CategoryEntity = zodModel({
  name: zodStringTrim,
  slug: zodSlug,
})
