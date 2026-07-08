import { Hono } from 'hono'
import { auth } from './auth'
import { handle } from 'hono/vercel'
import { onApiError } from './applications/response'
import projectRouter from '@/infrastructures/http/routes/project.routes'

const app = new Hono().basePath('/api')

// ─── Global error handler ─────────────────────────────────────────────────────
app.onError(onApiError)

// ─── Auth routes (Better-Auth) ────────────────────────────────────────────────
app.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

// ─── Feature routes ───────────────────────────────────────────────────────────
app.route('/projects', projectRouter)

export default handle(app)
