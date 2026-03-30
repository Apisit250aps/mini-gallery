export abstract class StorageService {
  abstract save(
    buffer: Buffer,
    destination: string,
    name: string,
  ): Promise<string>
  abstract remove(fileUrl: string): Promise<boolean>
}
