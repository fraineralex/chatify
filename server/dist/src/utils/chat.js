import sharp from 'sharp';
import crypto from 'crypto';
export async function optimizeImage(file) {
    try {
        const fileBuffer = await sharp(Buffer.from(file.file, 'base64'))
            .resize({
            height: 800,
            width: 800,
            fit: 'inside'
        })
            .webp({ quality: 80 })
            .toBuffer();
        file.file = fileBuffer;
        file.fileType = 'image/webp';
        return file;
    }
    catch (error) {
        console.error(error);
        return file;
    }
}
export function generateRandomFileName(file, bytes = 32) {
    const fileExtension = file.fileType.startsWith('image') && !file.fileType.includes('svg')
        ? 'webp'
        : file.filename.split('.').pop() ?? '';
    return `${crypto.randomBytes(bytes).toString('hex')}.${fileExtension}`;
}
