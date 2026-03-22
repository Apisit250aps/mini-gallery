import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import router from './routers'

const app = new Hono()

app.use(cors())
app.use(logger())
app.route('/api', router)

export default handle(app)
