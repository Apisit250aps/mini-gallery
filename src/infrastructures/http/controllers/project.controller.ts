import Controller from '@/lib/applications/controller'
import {
  createProjectSchema,
  updateProjectSchema,
} from '@/domains/schemas/project'
import {
  createProjectUseCase,
  updateProjectUseCase,
  deleteProjectUseCase,
  getProjectUseCase,
  listProjectsUseCase,
} from '@/infrastructures'
import { HonoHandler, RequestSchema } from '@/lib/applications/response'
import z from 'zod'

const paramsSchema = z.object({
  projectId: z.string(),
})

class ProjectController extends Controller {
  /**
   * GET /projects
   * Returns a list of all projects.
   */
  list(): HonoHandler<RequestSchema> {
    return async (c) => {
      const projects = await listProjectsUseCase.execute()
      return this.success(c, 'Projects fetched successfully', projects)
    }
  }

  /**
   * GET /projects/:projectId
   * Returns a single project by ID.
   */
  getById() {
    return this.validator({ params: paramsSchema }, async (c) => {
      const { projectId } = c.var.params
      const project = await getProjectUseCase.execute({ projectId })
      return this.success(c, 'Project fetched successfully', project)
    })
  }

  /**
   * POST /projects
   * Creates a new project.
   */
  create() {
    return this.validator({ body: createProjectSchema }, async (c) => {
      const data = c.var.body
      const project = await createProjectUseCase.execute({ data })
      return this.created(c, 'Project created successfully', project)
    })
  }

  /**
   * PUT /projects/:projectId
   * Updates an existing project.
   */
  update() {
    return this.validator(
      { params: paramsSchema, body: updateProjectSchema },
      async (c) => {
        const { projectId } = c.var.params
        const data = c.var.body
        const project = await updateProjectUseCase.execute({ projectId, data })
        return this.success(c, 'Project updated successfully', project)
      },
    )
  }

  /**
   * DELETE /projects/:projectId
   * Deletes a project by ID.
   */
  delete() {
    return this.validator({ params: paramsSchema }, async (c) => {
      const { projectId } = c.var.params
      await deleteProjectUseCase.execute({ projectId })
      return this.success(c, 'Project deleted successfully')
    })
  }
}

export default ProjectController
