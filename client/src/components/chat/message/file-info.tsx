import { useState } from 'react'
import { FILE_ICONS } from '../../../constants'
import { getSignedUrls } from '../../../services/chat'
import { StaticFile, uuid } from '../../../types/chat'
import { FileMetadata } from './file-metadata'

export function FileInfo ({
  fileMsg,
  msgId
}: {
  fileMsg: StaticFile
  msgId: uuid
}) {
  const [file, setFile] = useState<StaticFile>(fileMsg)

  const fileExtension =
    file.filename?.split('.').pop()?.toLowerCase() ?? 'unknown'
  const Icon = FILE_ICONS[fileExtension] ?? FILE_ICONS.unknown

  const updateSignedFile = async () => {
    if (new Date().getTime() < new Date(file.expiresAt).getTime()) return file

    const updatedSignedUrls = await getSignedUrls([msgId])
    if (updatedSignedUrls.length > 0) {
      setFile(updatedSignedUrls[0].file)
      return updatedSignedUrls[0].file
    }

  }

  const handleOpenClick = async (event: React.MouseEvent) => {
    event.preventDefault()
    const updatedFile = await updateSignedFile()
    if(!updatedFile) return 
    window.open(updatedFile.url, '_blank')
  }

  const handleDownloadClick = async (event: React.MouseEvent) => {
    event.preventDefault()
    const updatedFile = await updateSignedFile()
    if(!updatedFile) return 
    const response = await fetch(updatedFile.url)
    const blob = await response.blob()
    const url = URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', updatedFile.filename ?? 'file')
    document.body.appendChild(link)
    link.click()
    document.body?.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

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
