import sharp from 'sharp'
import { ResourceData } from '../types/chat.js'
import crypto from 'crypto'

export async function optimizeImage (file: ResourceData) {
  try {
    const fileBuffer = await sharp(Buffer.from(file.file as string, 'base64'))
      .resize({
        height: 1920,
        width: 1080,
        fit: 'inside'
      })
      .webp({ quality: 80 })
      .toBuffer()

    file.file = fileBuffer
    file.fileType = 'image/webp'
    return file
  } catch (error) {
    console.error(error)
    return file
  }
}

export function generateRandomFileName (file: ResourceData, bytes = 32) {
  const fileExtension = file.fileType.startsWith('image')
    ? 'webp'
    : file.filename.split('.').pop() ?? ''
  return `${crypto.randomBytes(bytes).toString('hex')}.${fileExtension}`
}
