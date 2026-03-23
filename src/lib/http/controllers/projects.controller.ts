import { Context } from 'hono'
import type { Project } from '../../../core/repositories/project.repo'
import { projectRepository } from '../../../core/repositories'

export async function getProjects(context: Context) {
  try {
    const projects = await projectRepository.findAllWithCategory({})

    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Projects fetched successfully',
        data: projects,
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to fetch projects',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function createProject(context: Context) {
  try {
    const body = await context.req.json()
    const count = await projectRepository.count()
    const nextDisplayOrder = count + 1

    const {
      title,
      location,
      type,
      category,
      program,
      client,
      siteArea,
      builtArea,
      design,
      completion,
      description,
      tags,
      galleries,
      orderDisplay,
      displayOrder = nextDisplayOrder,
    } = body

    const normalizedDisplayOrder = orderDisplay || displayOrder

    const validate = await projectRepository.validate({
      title,
      slug: title,
      location,
      type,
      category,
      program,
      client,
      siteArea,
      builtArea,
      design,
      completion,
      description,
      tags,
      galleries,
      displayOrder: normalizedDisplayOrder,
    })

    if (!validate) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed',
          error: 'Invalid project data',
        },
        400,
      )
    }

    const project = await projectRepository.create({
      title: validate.title,
      location: validate.location,
      type: validate.type,
      category: validate.category,
      program: validate.program,
      client: validate.client,
      siteArea: validate.siteArea,
      builtArea: validate.builtArea,
      design: validate.design,
      completion: validate.completion,
      description: validate.description,
      tags: validate.tags,
      galleries: validate.galleries,
      displayOrder: validate.displayOrder || nextDisplayOrder,
    })

    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Project created successfully',
        data: project,
      },
      201,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to create project',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function sortProjects(context: Context) {
  try {
    const body = await context.req.json()
    const projectIds = Array.isArray(body?.projectIds)
      ? body.projectIds.filter(
          (id: unknown): id is string => typeof id === 'string',
        )
      : []

    if (!projectIds.length) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed',
          error: 'projectIds is required',
        },
        400,
      )
    }

    await projectRepository.sortByDisplayOrder(projectIds)
    const projects = await projectRepository.findAllWithCategory({})

    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Projects sorted successfully',
        data: projects,
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to sort projects',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function updateProject(context: Context) {
  try {
    const { id } = context.req.param()
    const body = await context.req.json()
    const {
      title,
      location,
      type,
      category,
      program,
      client,
      siteArea,
      builtArea,
      design,
      completion,
      description,
      tags,
      galleries,
      displayOrder,
    } = body

    const validate = await projectRepository.validate(
      {
        title,
        slug: title,
        location,
        type,
        category,
        program,
        client,
        siteArea,
        builtArea,
        design,
        completion,
        description,
        tags,
        galleries,
        displayOrder,
      },
      { partial: true },
    )

    if (!validate) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'Validation failed',
          error: 'Invalid project data',
        },
        400,
      )
    }

    const project = await projectRepository.update(id, {
      title: validate.title,
      location: validate.location,
      type: validate.type,
      category: validate.category,
      program: validate.program,
      client: validate.client,
      siteArea: validate.siteArea,
      builtArea: validate.builtArea,
      design: validate.design,
      completion: validate.completion,
      description: validate.description,
      tags: validate.tags,
      galleries: validate.galleries,
      displayOrder: validate.displayOrder,
    })

    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Project updated successfully',
        data: project,
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to update project',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}

export async function deleteProject(context: Context) {
  try {
    const { id } = context.req.param()
    await projectRepository.delete(id)
    return context.json<ApiResponse>(
      {
        success: true,
        message: 'Project deleted successfully',
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Failed to delete project',
        error: (error as Error).message || 'Unknown error',
      },
      500,
    )
  }
}
