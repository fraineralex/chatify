import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ResourceData } from '../types/chat.js'

const s3BucketName = process.env.S3_BUCKET_NAME ?? ''
const s3BucketRegion = process.env.S3_BUCKET_REGION ?? ''
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID ?? ''
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY ?? ''

const s3 = new S3Client({
  region: s3BucketRegion,
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey
  }
})

export async function uploadFile (file: ResourceData) {
  const params = {
    Bucket: s3BucketName,
    Key: file.filename,
    Body: file.file,
    ContentType: file.fileType
  }

  const command = new PutObjectCommand(params)
  try {
    await s3.send(command)
  } catch (error) {
    console.error(error)
    return
  }
}

export async function getObjectSignedUrl (key: string) {
  const objectParams = {
    Bucket: s3BucketName,
    Key: key
  }
  const getObjectCommand = new GetObjectCommand(objectParams)
  let contentType = ''
  let contentLength = 0
  let filename = ''
  try {
    const isDocument = key.split('.').length > 2
    if (isDocument) {
      const headObjectCommand = new HeadObjectCommand(objectParams)
      const metadata = await s3.send(headObjectCommand)

      contentType = metadata.ContentType ?? ''
      contentLength = metadata.ContentLength ?? 0
      filename = `${key.split('.')[0]}.${key.split('.').pop()}`
      console.log(contentLength, contentType, filename)
    }
    const expirationTime = 3600 // seconds
    const url = await getSignedUrl(s3, getObjectCommand, {
      expiresIn: expirationTime
    })

    return {
      url,
      expiresAt: new Date(Date.now() + expirationTime * 1000).toISOString(),
      filename,
      contentType,
      contentLength
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteObject (key: string) {
  const params = {
    Bucket: s3BucketName,
    Key: key
  }
  try {
    await s3.send(new DeleteObjectCommand(params))
  } catch (error) {
    console.error(error)
  }
}
