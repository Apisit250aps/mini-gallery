import { Context } from 'hono'
import type { Category } from '../../../core/repositories/category.repo'
import { categoryRepository } from '../../../core/repositories'

export async function getCategories(context: Context) {
  try {
    const categories: Category[] = await categoryRepository.findAll({})

    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Categories fetched successfully',
        data: categories,
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to fetch categories',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function createCategory(context: Context) {
  try {
    const body = await context.req.json()
    const { name } = body

    const validate = await categoryRepository.validate({ name, slug: name })

    if (!validate) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed',
          error: 'Invalid category data',
        },
        400,
      )
    }

    const category = await categoryRepository.create({ name })

    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Category created successfully',
        data: category,
      },
      201,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to create category',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function updateCategory(context: Context) {
  try {
    const { id } = context.req.param()
    const body = await context.req.json()
    const { name } = body

    const validate = await categoryRepository.validate(
      { name, slug: name },
      { partial: true },
    )

    if (!validate) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed',
          error: 'Invalid category data',
        },
        400,
      )
    }

    const category = await categoryRepository.update(id, { name })
    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Category updated successfully',
        data: category,
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to update category',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function deleteCategory(context: Context) {
  try {
    const { id } = context.req.param()
    await categoryRepository.delete(id)
    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Category deleted successfully',
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to delete category',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}
