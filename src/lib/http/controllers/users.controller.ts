import { Context } from 'hono'
import type { User } from '../../../core/repositories/user.repo'
import { userRepository } from '../../../core/repositories'

export async function getUsers(context: Context) {
  try {
    const users: User[] = await userRepository.findAll({})

    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Users fetched successfully',
        data: users,
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to fetch users',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function createUser(context: Context) {
  try {
    const body = await context.req.json()
    const { name, password, isAdmin, isActive, lastLogin } = body

    const validate = await userRepository.validate({
      name,
      password,
      isAdmin,
      isActive,
      lastLogin,
    })

    if (!validate) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed',
          error: 'Invalid user data',
        },
        400,
      )
    }

    const user = await userRepository.create({
      name: validate.name,
      password: validate.password,
      isAdmin: validate.isAdmin,
      isActive: validate.isActive,
      lastLogin: validate.lastLogin,
    })

    return context.json<ApiResponse>(
      {
        success: true,
        message: 'User created successfully',
        data: user,
      },
      201,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to create user',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function updateUser(context: Context) {
  try {
    const { id } = context.req.param()
    const body = await context.req.json()
    const { name, password, isAdmin, isActive, lastLogin } = body

    const validate = await userRepository.validate(
      { name, password, isAdmin, isActive, lastLogin },
      { partial: true },
    )

    if (!validate) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed',
          error: 'Invalid user data',
        },
        400,
      )
    }

    const user = await userRepository.update(id, {
      name: validate.name,
      password: validate.password,
      isAdmin: validate.isAdmin,
      isActive: validate.isActive,
      lastLogin: validate.lastLogin,
    })

    return context.json<ApiResponse>(
      {
        success: true,
        message: 'User updated successfully',
        data: user,
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to update user',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function deleteUser(context: Context) {
  try {
    const { id } = context.req.param()
    await userRepository.delete(id)
    return context.json<ApiResponse>(
      {
        success: true,
        message: 'User deleted successfully',
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to delete user',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}
