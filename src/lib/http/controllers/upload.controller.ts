import { slug, uuid } from '@/lib/repository/libs'
import { getBucket } from '@/lib/storage/gcs'
import { convertToWebP } from '@/lib/storage/webp-image'
import { Context } from 'hono'
import path from 'path'

function buildPublicUrl(bucketName: string, filePath: string): string {
  return `https://storage.googleapis.com/${bucketName}/${encodeURI(filePath)}`
}

export async function uploadImage(context: Context) {
  try {
    const formData = await context.req.formData()

    const folder = formData.get('folder')
    if (typeof folder !== 'string' || !folder.trim()) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'Folder is required',
          error: 'folder is required and must be a non-empty string',
        },
        400,
      )
    }

    const file = formData.get('file')
    if (!(file instanceof File)) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'File is required',
          error: 'file is required and must be a valid file',
        },
        400,
      )
    }

    const normalizedFolder = slug(folder.trim())
    if (!normalizedFolder) {
      return context.json<ApiResponse>(
        {
          success: false,
          message: 'Folder is invalid',
          error: 'folder is invalid and must be a valid string',
        },
        400,
      )
    }

    const originalArrayBuffer = await file.arrayBuffer()
    const originalBuffer = Buffer.from(originalArrayBuffer)
    const webpBuffer = Buffer.from(await convertToWebP(originalArrayBuffer, 85))

    const parsed = path.parse(file.name)
    const ext = (parsed.ext || '').toLowerCase()
    const safeBaseName = slug(parsed.name) || uuid()

    const originalFileName = `${safeBaseName}${ext}`
    const webpFileName = `${safeBaseName}.webp`

    const originalPath = path.posix.join(
      'images',
      normalizedFolder,
      originalFileName,
    )
    const webpPath = path.posix.join('projects', normalizedFolder, webpFileName)

    const bucket = getBucket()
    const originalFile = bucket.file(originalPath)
    const webpFile = bucket.file(webpPath)

    await Promise.all([
      originalFile.save(originalBuffer, {
        metadata: {
          contentType: file.type || 'application/octet-stream',
        },
      }),
      webpFile.save(webpBuffer, {
        metadata: {
          contentType: 'image/webp',
        },
      }),
    ])

    const response: UploadResult = {
      folder: normalizedFolder,
      original: {
        path: originalPath,
        contentType: file.type || 'application/octet-stream',
        url: buildPublicUrl(bucket.name, originalPath),
      },
      webp: {
        path: webpPath,
        contentType: 'image/webp',
        url: buildPublicUrl(bucket.name, webpPath),
      },
    }

    return context.json<ApiResponse<UploadResult>>(
      {
        success: true,
        message: 'Image uploaded successfully',
        data: response,
      },
      200,
    )
  } catch (error) {
    return context.json<ApiResponse>(
      {
        success: false,
        message: 'Image upload failed',
        error: (error as Error).message,
      },
      500,
    )
  }
}
