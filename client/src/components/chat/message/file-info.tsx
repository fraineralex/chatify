import { useState } from 'react'
import { FILE_ICONS } from '../../../constants'
import { StaticFile, uuid } from '../../../types/chat'
import { FileMetadata } from './file-metadata'
import { downloadFile, openFile } from '../../../services/message'
import { useAuth0 } from '@auth0/auth0-react'

export function FileInfo ({
  fileMsg,
  msgId
}: {
  fileMsg: StaticFile
  msgId: uuid
}) {
  const [file, setFile] = useState<StaticFile>(fileMsg)
  const { getAccessTokenSilently } = useAuth0()

  const fileExtension =
    file.filename?.split('.').pop()?.toLowerCase() ?? 'unknown'
  const Icon = FILE_ICONS[fileExtension] ?? FILE_ICONS.unknown

  const handleOpenClick = async (event: React.MouseEvent) => {
    event.preventDefault()
    const updatedFile = await openFile(
      file,
      msgId,
      await getAccessTokenSilently()
    )
    if (updatedFile && updatedFile.url !== file.url) {
      setFile(updatedFile)
    }
  }

  const handleDownloadClick = async (event: React.MouseEvent) => {
    event.preventDefault()
    const updatedFile = await downloadFile(
      file,
      msgId,
      await getAccessTokenSilently()
    )
    if (updatedFile && updatedFile.url !== file.url) {
      setFile(updatedFile)
    }
  }

  return (
    <figure className='rounded-md bg-gray-200 mx-2 mt-2'>
      <div className='flex space-x-2 border-b p-2 border-gray-400'>
        <Icon className='w-12 h-12 align-middle' />
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
        <a
          className='w-full py-1 rounded-md bg-gray-400/40 font-normal text-base hover:bg-gray-400/60 text-center'
          onClick={handleOpenClick}
          href={file.url}
          target='_blank'
        >
          View
        </a>
        <a
          className='w-full py-1 rounded-md bg-gray-400/40 font-normal text-base hover:bg-gray-400/60 text-center'
          onClick={handleDownloadClick}
          href={file.url}
        >
          Download
        </a>
      </span>
    </figure>
  )
}
