import { mkdir, writeFile, unlink, access } from 'fs/promises'
import { constants } from 'fs'
import path from 'path'
import { StorageService } from '.'

export class LocalStorageService extends StorageService {
  public readonly dir: string

  constructor() {
    super()
    const baseDir = process.env.LOCAL_STORAGE_DIR || 'storage'
    this.dir = path.isAbsolute(baseDir)
      ? baseDir
      : path.join(process.cwd(), baseDir)
  }

  async save(
    buffer: Buffer,
    destination: string,
    name: string,
  ): Promise<string> {
    try {
      const targetDir = path.join(this.dir, destination)
      const filePath = path.join(targetDir, name)

      await mkdir(targetDir, { recursive: true })
      await writeFile(filePath, buffer)

      return path.join(destination, name).replace(/\\/g, '/')
    } catch (error) {
      throw new Error(
        `Error uploading file: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  async remove(fileUrl: string): Promise<boolean> {
    try {
      const relativePath = fileUrl.replace(/^\/+/, '')
      const filePath = path.join(this.dir, relativePath)

      await access(filePath, constants.F_OK)
      await unlink(filePath)
      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      return false
    }
  }
}
