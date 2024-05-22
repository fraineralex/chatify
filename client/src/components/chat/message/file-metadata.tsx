import { MIME_TYPE_MAP } from '../../../constants'

interface Props {
  contentType?: string
  contentLength?: number
  fileExtension: string
}

export function FileMetadata ({
  contentType = 'unknown',
  contentLength = 0,
  fileExtension
}: Props) {
  const fileType = contentType
    ? MIME_TYPE_MAP[contentType]
    : `${fileExtension.toUpperCase()} File`

  let fileWeight = ''
  if (contentLength || contentLength === 0) {
    const bytes = contentLength
    const kilobytes = bytes / 1024
    const megabytes = kilobytes / 1024

    switch (true) {
      case bytes < 1024:
        fileWeight = `${bytes.toFixed(1)} B,`
        break
      case kilobytes < 1024:
        fileWeight = `${kilobytes.toFixed(1)} KB,`
        break
      default:
        fileWeight = `${megabytes.toFixed(1)} MB,`
    }
  }
  return (
    <small className='block not-italic font-medium'>
      {fileWeight} {fileType}
    </small>
  )
}
