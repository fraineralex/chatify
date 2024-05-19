import { CircleX, FileQuestion, FileText } from 'lucide-react'
import { FileMessage } from '../../../types/chat'

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
  const handleRemoveFile =
    (index: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.preventDefault()
      setFileMessages(fileMessages.filter((_, i) => i !== index))
      if (selectedFileIndex !== 0) setSelectedFileIndex(selectedFileIndex - 1)
    }

  const handleSelectFile =
    (index: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.preventDefault()
      setSelectedFileIndex(index)
      const contentInput = formRef.current?.querySelector(
        'input[name="content"]'
      ) as HTMLInputElement
      contentInput.focus()
    }

  return (
    <div className='flex mb-3 overflow-x-auto max-w-full space-x-2 form-slider py-2 text-gray-700 place-content-center'>
      {fileMessages?.map((fileMsg, index) =>
        fileMsg.file.type.startsWith('image') ? (
          <figure
            className={`self-center relative rounded-md cursor-pointer border-[3px] flex-shrink-0 ${
              selectedFileIndex === index
                ? 'border-blue-500'
                : 'border-transparent'
            }`}
            onClick={handleSelectFile(index)}
            key={index}
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
                ? 'border-blue-500'
                : 'border-transparent'
            }`}
            onClick={handleSelectFile(index)}
            key={index}
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
        ) : fileMsg.file.type.startsWith('application') ||
          fileMsg.file.type.startsWith('text') ? (
          <figure
            className={`flex-shrink-0 self-center text-center relative mx-2 max-w-72 rounded-md cursor-pointer border-[3px] ${
              selectedFileIndex === index
                ? 'border-blue-500'
                : 'border-transparent'
            }`}
            onClick={() => setSelectedFileIndex(index)}
            key={index}
          >
            <button
              className='absolute top-1 right-1 p-1 text-red-400 hover:text-red-600 hover:scale-105'
              onClick={handleRemoveFile(index)}
            >
              <CircleX className='w-7 h-7' />
            </button>
            <FileText className='h-64 w-64 text-gray-600' strokeWidth={1.1} />
            <h3 className='font-semibold text-base text-gray-500 -mt-2 px-2'>
              {fileMsg.file.name}
            </h3>
            <p className='text-gray-400 font-medium text-sm'>
              {(fileMsg.file.size / 1024).toFixed(1)} KB
            </p>
          </figure>
        ) : (
          <figure
            className={`flex-shrink-0 self-center text-center relative mx-2 max-w-72 rounded-md cursor-pointer border-[3px] ${
              selectedFileIndex === index
                ? 'border-blue-500'
                : 'border-transparent'
            }`}
            onClick={handleSelectFile(index)}
            key={index}
          >
            <button
              className='absolute top-1 right-1 p-1 text-red-400 hover:text-red-600 hover:scale-105'
              onClick={handleRemoveFile(index)}
            >
              <CircleX className='w-7 h-7' />
            </button>
            <FileQuestion
              className='h-64 w-64 text-gray-600'
              strokeWidth={1.1}
            />
            <h3 className='font-semibold text-base text-gray-500 -mt-2 px-2'>
              {fileMsg.file.name}
            </h3>
            <p className='text-gray-400 font-medium text-sm'>
              {(fileMsg.file.size / 1024).toFixed(1)} KB
            </p>
          </figure>
        )
      )}
    </div>
  )
}
