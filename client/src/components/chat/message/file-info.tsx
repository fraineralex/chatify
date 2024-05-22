import { FILE_ICONS, MIME_TYPE_MAP } from '../../../constants'
import { StaticFile } from '../../../types/chat'

export function FileInfo ({ file }: { file: StaticFile }) {
  console.log(file)
  const fileExtension =
    file.filename?.split('.').pop()?.toLowerCase() ?? 'unknown'
  const Icon = FILE_ICONS[fileExtension] || FILE_ICONS.unknown
  const fileType = file.contentType
    ? MIME_TYPE_MAP[file.contentType]
    : `${fileExtension.toUpperCase()} File`

  let fileWeight = ''
  if (file.contentLength) {
    const bytes = file.contentLength
    const kilobytes = bytes / 1024
    const megabytes = kilobytes / 1024

    switch (true) {
      case bytes < 1024:
        fileWeight = `${bytes.toFixed(2)} B,`
        break
      case kilobytes < 1024:
        fileWeight = `${kilobytes.toFixed(2)} KB,`
        break
      default:
        fileWeight = `${megabytes.toFixed(2)} MB,`
    }
  }
  return (
    <figure className='rounded-md bg-gray-200 mx-1 mt-1'>
      <div className='flex space-x-2 border-b p-2 border-gray-400'>
        <Icon className='w-12 h-12' />
        <span>
          <h6 className='font-medium text-base w-64 truncate block'>
            {file.filename}
          </h6>
          <small className='block not-italic text-gray-500 font-medium'>
            {fileWeight} {fileType}
          </small>
        </span>
      </div>
      <span className='flex place-content-center justify-around p-2 space-x-3 mt-1'>
        <button className='w-full py-1 rounded-md bg-gray-400/40 font-normal text-base'>
          View
        </button>
        <button className='w-full py-1 rounded-md bg-gray-400/40 font-normal text-base'>
          Download
        </button>
      </span>
    </figure>
  )
}
