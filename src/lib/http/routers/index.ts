import { Hono } from 'hono'
import users from './user.route'
import categories from './category.route'
import projects from './project.route'
import { uploadImage } from '../controllers/upload.controller'

const router = new Hono()
router.route('/users', users)
router.route('/categories', categories)
router.route('/projects', projects)
router.post('/upload/image', uploadImage)

export default router
