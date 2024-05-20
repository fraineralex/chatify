import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { AttachFile, Emoji } from '../../common/svg-icons'
import {
  EmojiEvent,
  Message,
  ReplyMessage,
  ServerMessage,
  FileMessage,
  ResourceData,
  StaticFile
} from '../../../types/chat'
import { MESSAGES_TYPES, SOCKET_EVENTS } from '../../../constants'
import { useSocketStore } from '../../../store/socket'
import { useAuth0 } from '@auth0/auth0-react'
import { useChatStore } from '../../../store/currenChat'
import { ReplyingMessage } from './replying-message'
import { LockKeyholeOpen, SendHorizontal, Image, FileText } from 'lucide-react'
import { toggleChatBlock } from '../../../services/chat'
import EmojiPicker from 'emoji-picker-react'
import { Dropdown } from '../../common/dropdown'
import './form.css'
import { FilePreview } from './file-preview'
import { readFileAsBase64 } from '../../../utils/chat'

export function Form ({
  replyingMessage,
  handleReplyMessage
}: {
  replyingMessage: ReplyMessage | null
  handleReplyMessage: (message: ReplyMessage | null) => void
}) {
  const { socket, addMessage, replaceChat } = useSocketStore()
  const { currentChat, setCurrentChat } = useChatStore()
  const { user: loggedUser } = useAuth0()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const showEmojiPickerRef = useRef(showEmojiPicker)
  const formRef = useRef<HTMLFormElement>(null)
  const [contentMessage, setContentMessage] = useState<string>(
    currentChat?.draft ?? ''
  )
  const [fileMessages, setFileMessages] = useState<Array<FileMessage>>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)

  if (!currentChat) return null

  useEffect(() => {
    showEmojiPickerRef.current = showEmojiPicker
  }, [showEmojiPicker])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        showEmojiPickerRef.current &&
        !target.closest('div[id="emoji-selector"]') &&
        !target.closest('button[name="emoji"]')
      ) {
        setShowEmojiPicker(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const input = formRef.current?.querySelector(
      'input[name="content"]'
    ) as HTMLInputElement
    input.focus()
  }, [replyingMessage])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if ((!contentMessage && fileMessages.length === 0) || !currentChat) return
    if (fileMessages.length > 0) {
      for (const fileMsg of fileMessages) {
        const base64File = await readFileAsBase64(fileMsg.file)
        const fileData: ResourceData = {
          file: base64File,
          filename: fileMsg.file.name,
          fileType: fileMsg.file.type
        }
        console.log(fileData)

        const message: ServerMessage = {
          uuid: crypto.randomUUID(),
          content: fileMsg.caption ?? '',
          sender_id: loggedUser?.sub || '',
          receiver_id: currentChat.user.id,
          chat_id: currentChat.uuid,
          type: fileMsg.file.type.startsWith('image')
            ? MESSAGES_TYPES.IMAGE
            : fileMsg.file.type.startsWith('video')
            ? MESSAGES_TYPES.VIDEO
            : fileMsg.file.type.startsWith('application') ||
              fileMsg.file.type.startsWith('text')
            ? MESSAGES_TYPES.DOCUMENT
            : MESSAGES_TYPES.TEXT,
          is_deleted: false,
          is_edited: false,
          is_delivered: false,
          is_read: false,
          reply_to_id: replyingMessage?.uuid || null,
          file: null,
          reactions: null,
          created_at: new Date().toISOString()
        }

        socket?.emit(SOCKET_EVENTS.NEW_MESSAGE, message, fileData)
      }

      setFileMessages([])
      setSelectedFileIndex(0)
    } else {
      const message: ServerMessage = {
        uuid: crypto.randomUUID(),
        content: currentChat.draft || '',
        sender_id: loggedUser?.sub || '',
        receiver_id: currentChat.user.id,
        chat_id: currentChat.uuid,
        type: MESSAGES_TYPES.TEXT,
        is_deleted: false,
        is_edited: false,
        is_delivered: false,
        is_read: false,
        reply_to_id: replyingMessage?.uuid || null,
        file: null,
        reactions: null,
        created_at: new Date().toISOString()
      }
      const newMessage: Message = {
        uuid: message.uuid,
        content: message.content,
        createdAt: new Date(),
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        chatId: message.chat_id,
        type: message.type,
        isDeleted: message.is_deleted,
        isEdited: message.is_edited,
        isSent: false,
        isDelivered: message.is_delivered,
        isRead: message.is_read,
        replyToId: message.reply_to_id,
        reactions: null,
        file: message.file as StaticFile
      }

      addMessage(newMessage)
      const chatUpdated = { ...currentChat, lastMessage: newMessage, draft: '' }
      replaceChat(chatUpdated)
      setCurrentChat(chatUpdated)

      socket?.emit(SOCKET_EVENTS.NEW_MESSAGE, message)
    }

    setContentMessage('')
    if (replyingMessage) handleReplyMessage(null)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentMessage(event.target.value)
    if (!currentChat) return
    if (fileMessages.length > 0) {
      const updatedFileMessage = fileMessages[selectedFileIndex ?? 0]
      updatedFileMessage.caption = event.target.value
      setFileMessages(
        fileMessages.map((fileMsg, index) =>
          index === selectedFileIndex ?? 0 ? updatedFileMessage : fileMsg
        )
      )
    } else {
      setCurrentChat({ ...currentChat, draft: event.target.value })
      replaceChat({ ...currentChat, draft: event.target.value })
    }
  }

  const handleEmojiSelect = (emojiEvent: EmojiEvent) => {
    const unicodeSymbols = emojiEvent.unified.split('_')
    const codePoints: number[] = []
    unicodeSymbols.forEach(symbol => codePoints.push(parseInt('0x' + symbol)))
    const emojiChar = String.fromCodePoint(...codePoints)

    const updatedContentMessage = contentMessage + emojiChar
    setContentMessage(updatedContentMessage)
    if (!currentChat) return
    setCurrentChat({ ...currentChat, draft: updatedContentMessage })
    replaceChat({ ...currentChat, draft: updatedContentMessage })
  }

  const handleBlur = () => {
    if (!contentMessage || !currentChat) return
    replaceChat({ ...currentChat, draft: contentMessage })
    setCurrentChat({ ...currentChat, draft: contentMessage })
  }

  const handleEmojiClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    setShowEmojiPicker(!showEmojiPicker)
    const input = formRef.current?.querySelector(
      'input[name="content"]'
    ) as HTMLInputElement
    input.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      const form = event.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  const handleUnblockChat = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()

    replaceChat({
      ...currentChat,
      blockedBy: null
    })

    setCurrentChat({
      ...currentChat,
      blockedBy: null
    })

    const response = await toggleChatBlock(currentChat.uuid, undefined)

    if (response.status !== 200) {
      replaceChat({ ...currentChat })
      setCurrentChat(currentChat)

      return console.error(response.statusText)
    }
  }

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFiles: Array<FileMessage> = Array.from(
        event.target.files
      ).map(file => ({
        file: file,
        caption: ''
      }))
      const newFiles = fileMessages
        ? fileMessages.concat(uploadedFiles)
        : uploadedFiles
      if (newFiles.length >= 10)
        return alert('You can only send 10 files at once')
      const maximumSize = 100 * 1024 * 1024 // 100MB
      const totalSize = newFiles.reduce(
        (acc, fileMsg) => acc + fileMsg.file.size,
        0
      )
      if (totalSize > maximumSize) {
        alert('The total size of the files exceeds the limit of 100MB')
        return
      }
      setFileMessages(newFiles)
      const dropdownButton = formRef.current?.querySelector(
        'button[name="options"]'
      ) as HTMLButtonElement
      dropdownButton.click()

      const input = formRef.current?.querySelector(
        'input[name="content"]'
      ) as HTMLInputElement
      input.focus()
    }
  }

  return (
    <form className='p-2 border-t w-full' onSubmit={handleSubmit} ref={formRef}>
      {!currentChat?.blockedBy && (
        <>
          <ReplyingMessage
            replyingMessage={replyingMessage}
            handleReplyMessage={handleReplyMessage}
          />
          <FilePreview
            fileMessages={fileMessages}
            selectedFileIndex={selectedFileIndex}
            setSelectedFileIndex={setSelectedFileIndex}
            setFileMessages={setFileMessages}
            formRef={formRef}
          />
          <aside className='flex items-center space-x-3 text-gray-600'>
            {showEmojiPicker && (
              <div id='emoji-selector' className='fixed bottom-20'>
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
            <button
              name='emoji'
              className={`hover:scale-125 ease-out duration-100 ${
                showEmojiPicker ? 'text-blue-500' : 'text-gray-600'
              }`}
              onClick={handleEmojiClick}
            >
              <Emoji className='w-6 h-6' />
              <span className='sr-only'>Insert emoji</span>
            </button>

            <Dropdown
              Icon={<AttachFile className='w-6 h-6' />}
              buttonClassName='hover:scale-125 ease-out duration-100 hover:text-gray-700 align-middle'
              dropdownClassName='bottom-20'
            >
              <ul
                className='py-2 text-sm text-gray-700 dark:text-gray-200'
                aria-labelledby='dropdownDefaultButton'
              >
                <li>
                  <button
                    className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                    onClick={event => {
                      event.preventDefault()
                      const input = formRef.current?.querySelector(
                        'input[name="file-media"]'
                      ) as HTMLInputElement
                      input.click()
                    }}
                  >
                    <Image className='w-5 h-5 inline me-2' />
                    Photos & Videos
                  </button>
                  <input
                    name='file-media'
                    type='file'
                    accept='image/*, video/*'
                    multiple
                    className='hidden'
                    onChange={handleFileInputChange}
                  />
                </li>
                <li>
                  <button
                    className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                    onClick={event => {
                      event.preventDefault()
                      const input = formRef.current?.querySelector(
                        'input[name="file-document"]'
                      ) as HTMLInputElement
                      input.click()
                    }}
                  >
                    <FileText className='w-5 h-5 inline me-2' />
                    Document
                  </button>
                  <input
                    name='file-document'
                    type='file'
                    accept='doccument/*'
                    className='hidden'
                    onChange={handleFileInputChange}
                  />
                </li>
              </ul>
            </Dropdown>
            <input
              className='flex h-10 w-full border-input bg-background px-3 mx-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-full border-0 flex-1'
              placeholder='Type a message'
              name='content'
              autoFocus
              onChange={handleChange}
              value={
                fileMessages.length > 0
                  ? fileMessages[selectedFileIndex ?? 0]?.caption ?? ''
                  : currentChat?.draft ?? ''
              }
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            <button
              type='submit'
              className='hover:scale-125 ease-out duration-100 hover:text-gray-700'
            >
              <SendHorizontal className='w-6 h-6' />
              <span className='sr-only'>Send</span>
            </button>
          </aside>
        </>
      )}
      {currentChat?.blockedBy && (
        <div className='flex place-content-center p-3 pt-6'>
          <h2 className='text-muted-foreground text-center'>
            {currentChat.blockedBy === loggedUser?.sub ? (
              <>
                <span className='block'>
                  You can't send messages to blocked user
                  <i className='font-medium not-italic'>
                    {' '}
                    {currentChat.user.name}
                  </i>
                </span>
                <button
                  className='px-3 text-sm py-2 hover:bg-blue-700 w-full text-center max-w-max mt-2 rounded-md bg-blue-600 text-white font-small hover:scale-105 ease-in-out duration-100'
                  onClick={handleUnblockChat}
                >
                  <LockKeyholeOpen className='w-4 h-4 inline me-2' />
                  Unblock user
                </button>
              </>
            ) : (
              <span>
                You can't send messages to
                <i className='font-medium not-italic'>
                  {' '}
                  {currentChat.user.name}
                </i>
              </span>
            )}
          </h2>
        </div>
      )}
    </form>
  )
}
