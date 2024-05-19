import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
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
  const getObjectParams = {
    Bucket: s3BucketName,
    Key: key
  }
  const command = new GetObjectCommand(getObjectParams)
  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
    return url
  } catch (error) {
    console.error(error)
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
