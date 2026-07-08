export interface IImageUploadService {
  uploadImage(buffer: Buffer, originalName?: string, folder?: string): Promise<string>
  processAndUploadImages(images: string[]): Promise<string[]>
}
