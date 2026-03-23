import { Bucket, Storage } from '@google-cloud/storage'
import path from 'path'

const envKeyFile = process.env.GCS_KEYFILE_PATH
if (!envKeyFile) {
  throw new Error('GCS_KEYFILE_PATH environment variable is not defined')
}
const keyFilename = path.join(process.cwd(), envKeyFile)
// storage
// bucket
const bucketName = process.env.GCS_BUCKET_NAME
if (!bucketName) {
  throw new Error('GCS_BUCKET_NAME environment variable is not defined')
}
//
export const storage = new Storage({ keyFilename })
export const getBucket = (): Bucket => storage.bucket(bucketName)
