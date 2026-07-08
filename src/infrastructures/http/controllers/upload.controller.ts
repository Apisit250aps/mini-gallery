import Controller from '@/lib/applications/controller'
import { uploadService } from '@/infrastructures'
import { HonoHandler, RequestSchema } from '@/lib/applications/response'
import { ValidationError } from '@/lib/applications'

class UploadController extends Controller {
  upload(): HonoHandler<RequestSchema> {
    return async (c) => {
      const body = await c.req.parseBody()
      const file = body['file']
      const slug = c.req.query('slug')

      if (!file || !(file instanceof File)) {
        throw new ValidationError('Please upload a valid file under "file" field')
      }

      if (!file.type.startsWith('image/')) {
        throw new ValidationError('Uploaded file must be an image')
      }

      // Convert Web API File object to Node.js Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload and convert to WebP, storing in folder named after the slug
      const url = await uploadService.uploadImage(buffer, file.name, slug)

      return this.success(c, 'File uploaded successfully', { url })
    }
  }
}

export default UploadController
