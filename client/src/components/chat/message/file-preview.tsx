import { CircleX } from 'lucide-react'
import { FileMessage } from '../../../types/chat'
import { FILE_ICONS } from '../../../constants'
import { FileMetadata } from './file-metadata'
import { useRef } from 'react'

interface Props {
  fileMessages: Array<FileMessage>
  setSelectedFileIndex: React.Dispatch<React.SetStateAction<number>>
  selectedFileIndex: number
  setFileMessages: React.Dispatch<React.SetStateAction<Array<FileMessage>>>
  formRef: React.RefObject<HTMLFormElement>
}

export function FilePreview ({
  fileMessages,
  setSelectedFileIndex,
  selectedFileIndex,
  setFileMessages,
  formRef
}: Props) {
  const fileRefs = useRef<(HTMLElement | null)[]>([])

  const handleRemoveFile =
    (index: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.preventDefault()
      setFileMessages(fileMessages.filter((_, i) => i !== index))
      if (selectedFileIndex !== 0) setSelectedFileIndex(selectedFileIndex - 1)
    }

  const handleSelectFile =
    (index: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.preventDefault()
      fileRefs.current[index]?.scrollIntoView({
        behavior: 'instant',
        block: 'center',
        inline: 'center'
      })
      setSelectedFileIndex(index)
      const contentInput = formRef.current?.querySelector(
        'input[name="content"]'
      ) as HTMLInputElement
      contentInput.focus()
    }

  const getFileIcon = (filename: string) => {
    const fileExtension = filename?.split('.').pop()?.toLowerCase() ?? 'unknown'
    const Icon = FILE_ICONS[fileExtension] ?? FILE_ICONS.unknown
    return <Icon className='h-64 w-64 text-gray-600' />
  }

  return (
    <div className='flex mb-3 overflow-x-auto max-w-full space-x-2 form-slider py-2 text-gray-700 place-content-stretch'>
      {fileMessages?.map((fileMsg, index) =>
        fileMsg.file.type.startsWith('image') &&
        !fileMsg.file.type.includes('svg') ? (
          <figure
            className={`self-center relative rounded-md cursor-pointer border-[3px] flex-shrink-0 ${
              selectedFileIndex === index
                ? 'contrast-125 text-gray-800'
                : 'contrast-50 text-gray-500'
            }`}
            onClick={handleSelectFile(index)}
            key={index}
            ref={element => (fileRefs.current[index] = element)}
          >
            <button
              className='absolute top-1 right-1 p-1 text-white hover:text-red-500 hover:scale-105'
              onClick={handleRemoveFile(index)}
            >
              <CircleX className='w-7 h-7' />
            </button>
            <img
              key={index}
              src={URL.createObjectURL(fileMsg.file)}
              alt='preview of the image'
              className='h-80 w-auto rounded-sm'
            />
          </figure>
        ) : fileMsg.file.type.startsWith('video') ? (
          <figure
            className={`self-center relative rounded-md cursor-pointer border-[3px] flex-shrink-0 ${
              selectedFileIndex === index
                ? 'contrast-125 text-gray-800'
                : 'contrast-50 text-gray-500'
            }`}
            onClick={handleSelectFile(index)}
            key={index}
            ref={element => (fileRefs.current[index] = element)}
          >
            <button
              className='absolute top-1 right-1 p-1 text-white hover:text-red-500 hover:scale-105 z-10'
              onClick={handleRemoveFile(index)}
            >
              <CircleX className='w-7 h-7' />
            </button>
            <video
              key={index}
              src={URL.createObjectURL(fileMsg.file)}
              controls
              className='h-80 w-auto rounded-sm'
            />
          </figure>
        ) : (
          <figure
            className={`flex-shrink-0 self-center text-center relative max-w-72 rounded-md cursor-pointer ${
              selectedFileIndex === index
                ? 'contrast-125 text-gray-800'
                : 'contrast-50 text-gray-500'
            }`}
            onClick={() => setSelectedFileIndex(index)}
            key={index}
            ref={element => (fileRefs.current[index] = element)}
          >
            <button
              className={`absolute top-1 right-1 p-1 hover:text-red-500 hover:scale-105 ${
                selectedFileIndex === index ? 'text-gray-500' : 'text-gray-300'
              }`}
              onClick={handleRemoveFile(index)}
            >
              <CircleX className='w-7 h-7' />
            </button>
            {getFileIcon(fileMsg.file.name)}
            <h3 className='font-semibold text-base mt-1 px-2'>
              {fileMsg.file.name}
            </h3>
            <FileMetadata
              contentLength={fileMsg.file.size}
              contentType={fileMsg.file.type}
              fileExtension={
                fileMsg.file.name.split('.').pop()?.toLowerCase() ?? 'unknown'
              }
            />
          </figure>
        )
      )}
    </div>
  )
}
