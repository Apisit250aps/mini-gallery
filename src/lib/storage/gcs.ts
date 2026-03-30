import { Bucket, Storage } from '@google-cloud/storage'
import path from 'path'
import { StorageService } from '.'

export class GCSStorageService extends StorageService {
  private bucket: Bucket

  constructor() {
    super()

    const envKeyFile = process.env.GCS_KEYFILE_PATH
    const bucketName = process.env.GCS_BUCKET_NAME

    if (!envKeyFile || !bucketName) {
      throw new Error('GCS Environment variables are not fully defined')
    }

    const keyFilename = path.join(process.cwd(), envKeyFile)
    const storage = new Storage({ keyFilename })
    this.bucket = storage.bucket(bucketName)
  }

  async save(
    buffer: Buffer,
    fileName: string,
    destination: string,
  ): Promise<string> {
    try {
      const filePath = path.posix.join(destination, fileName)
      const file = this.bucket.file(filePath)

      await file.save(buffer)

      // คืนค่า path หรือ URL สำหรับเข้าถึงไฟล์
      return filePath
    } catch (error) {
      throw new Error(
        `GCS Upload Error: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  async remove(fileUrl: string): Promise<boolean> {
    try {
      const filePath = fileUrl.replace(/^\/+/, '')
      const file = this.bucket.file(filePath)

      await file.delete()
      return true
    } catch (error) {
      console.error('Error deleting from GCS:', error)
      return false
    }
  }
}
