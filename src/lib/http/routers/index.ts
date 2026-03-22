import { Hono } from 'hono'
import users from './user.route'
import categories from './category.route'
import projects from './project.route'

const router = new Hono()
router.route('/users', users)
router.route('/categories', categories)
router.route('/projects', projects)

export default router
