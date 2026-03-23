import sharp from 'sharp'

export async function convertToWebP(
  imageData: ArrayBuffer,
  quality = 80,
): Promise<ArrayBuffer> {
  const buffer = Buffer.from(imageData)
  const webpBuffer = await sharp(buffer).webp({ quality }).toBuffer()
  return webpBuffer.buffer.slice(
    webpBuffer.byteOffset,
    webpBuffer.byteOffset + webpBuffer.byteLength,
  ) as ArrayBuffer
}
