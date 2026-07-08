import { Hono } from 'hono'
import { requireAuth } from '../middlewares/auth.middleware'
import ProjectController from '../controllers/project.controller'
import { onApiError } from '@/lib/applications/response'

const projectController = new ProjectController()

const projectRouter = new Hono()

// ─── Error handling ───────────────────────────────────────────────────────────
projectRouter.onError(onApiError)

// ─── Public routes ────────────────────────────────────────────────────────────

/** GET /projects — list all projects */
projectRouter.get('/', projectController.list())

/** GET /projects/:projectId — get a single project */
projectRouter.get('/:projectId', projectController.getById())

// ─── Protected routes (require authentication) ────────────────────────────────

/** POST /projects — create a project */
projectRouter.post('/', requireAuth, projectController.create())

/** PUT /projects/:projectId — update a project */
projectRouter.put('/:projectId', requireAuth, projectController.update())

/** DELETE /projects/:projectId — delete a project */
projectRouter.delete('/:projectId', requireAuth, projectController.delete())

export default projectRouter
