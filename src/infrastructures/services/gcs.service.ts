import { Storage } from '@google-cloud/storage'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { IImageUploadService } from '@/domains/services/upload.service'

export class GCSService implements IImageUploadService {
  private storage: Storage | null = null
  private bucketName: string | null = null

  private init() {
    if (this.storage) return

    const bucketName = process.env.GCS_BUCKET_NAME

    if (!bucketName) {
      console.warn('⚠️ GCS_BUCKET_NAME is not configured. Uploads will fail.')
      return
    }

    this.bucketName = bucketName

    const credentialsPath = path.join(process.cwd(), 'credentials.json')
    if (fs.existsSync(credentialsPath)) {
      this.storage = new Storage({ keyFilename: credentialsPath })
    } else {
      const projectId = process.env.GCS_PROJECT_ID
      const clientEmail = process.env.GCS_CLIENT_EMAIL
      const privateKey = process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n')

      if (projectId && clientEmail && privateKey) {
        this.storage = new Storage({
          projectId,
          credentials: {
            client_email: clientEmail,
            private_key: privateKey,
          },
        })
      } else {
        // Fallback to Application Default Credentials (ADC)
        this.storage = new Storage()
      }
    }
  }

  async uploadImage(buffer: Buffer, originalName?: string, folder?: string): Promise<string> {
    this.init()

    if (!this.storage || !this.bucketName) {
      throw new Error('GCS is not configured. Please set GCS_BUCKET_NAME.')
    }

    // 1. Convert to WebP using sharp
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer()

    // 2. Generate unique filename (optionally nested inside a folder)
    const folderPrefix = folder ? `${folder.trim().replace(/\/+$/, '')}/` : ''
    const filename = `${folderPrefix}${uuidv4()}.webp`
    const file = this.storage.bucket(this.bucketName).file(filename)

    // 3. Upload to GCS
    await file.save(webpBuffer, {
      contentType: 'image/webp',
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    })

    // 4. Return public URL
    return `https://storage.googleapis.com/${this.bucketName}/${filename}`
  }

  async processAndUploadImages(images: string[]): Promise<string[]> {
    if (!images || images.length === 0) return []

    const uploadPromises = images.map(async (img) => {
      // Check if image is a base64 string
      const base64Regex = /^data:image\/([a-zA-Z]*);base64,(.*)$/
      const match = img.match(base64Regex)

      if (match) {
        const [, format, base64Data] = match
        const buffer = Buffer.from(base64Data, 'base64')
        return await this.uploadImage(buffer, `upload.${format}`)
      }

      // If it's already a URL, return it as-is
      return img
    })

    return Promise.all(uploadPromises)
  }
}
