import { Hono } from 'hono'
import { requireAuth } from '../middlewares/auth.middleware'
import UploadController from '../controllers/upload.controller'
import { onApiError } from '@/lib/applications/response'

const uploadController = new UploadController()

const uploadRouter = new Hono()

uploadRouter.onError(onApiError)

/** POST /upload - upload an image file */
uploadRouter.post('/', requireAuth, uploadController.upload())

export default uploadRouter
