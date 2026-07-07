import { Hono } from 'hono'
import { auth } from './auth'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

export default handle(app)
