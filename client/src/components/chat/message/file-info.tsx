import { FILE_ICONS } from '../../../constants'
import { StaticFile } from '../../../types/chat'
import { FileMetadata } from './file-metadata'

export function FileInfo ({ file }: { file: StaticFile }) {
  const fileExtension =
    file.filename?.split('.').pop()?.toLowerCase() ?? 'unknown'
  const Icon = FILE_ICONS[fileExtension] ?? FILE_ICONS.unknown
  return (
    <figure className='rounded-md bg-gray-200 mx-1 mt-1'>
      <div className='flex space-x-2 border-b p-2 border-gray-400'>
        <Icon className='w-12 h-12' />
        <span className='text-gray-500'>
          <h6 className='font-medium text-base w-64 truncate block text-gray-800'>
            {file.filename}
          </h6>
          <FileMetadata
            contentLength={file.contentLength}
            contentType={file.contentType}
            fileExtension={fileExtension}
          />
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
