import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3'
import { CloudfrontSignInput, getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { ResourceData } from '../types/chat.js'

const s3BucketName = process.env.S3_BUCKET_NAME ?? ''
const s3BucketRegion = process.env.S3_BUCKET_REGION ?? ''
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID ?? ''
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY ?? ''

const cloudfrontUrl = process.env.CLOUDFRONT_URL ?? ''
const cloudfrontPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY ?? ''
const cloudfrontKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID ?? ''

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

  const expirationTime = 60 * 60 * 24 // 24 hours

  const cloudfrontSignParams: CloudfrontSignInput = {
    url: `${cloudfrontUrl}/${key}`,
    privateKey: cloudfrontPrivateKey,
    keyPairId: cloudfrontKeyPairId,
    policy: JSON.stringify({
      Statement: [
        {
          Resource: `${cloudfrontUrl}/${key}`,
          Condition: {
            DateLessThan: {
              'AWS:EpochTime': Math.floor(Date.now() / 1000 + expirationTime)
            }
          }
        }
      ]
    })
  }

  let contentType = ''
  let contentLength = 0
  let filename = key
  try {
    const isDocument = key.split('.').length > 2
    if (isDocument) {
      const metadata = await s3.send(new HeadObjectCommand(objectParams))

      contentType = metadata.ContentType ?? ''
      contentLength = metadata.ContentLength ?? 0
      filename = `${key.split('.')[0]}.${key.split('.').pop()}`
    }
    const url = getSignedUrl(cloudfrontSignParams)
    console.log(url)

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
