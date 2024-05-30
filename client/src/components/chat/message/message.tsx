import { useAuth0 } from '@auth0/auth0-react'
import {
  EmojiEvent,
  Message as MessageType,
  ReplyMessage,
  User,
  uuid
} from '../../../types/chat'
import { useSocketStore } from '../../../store/socket'

import { Download, Pencil, Reply, SmilePlus, Trash2 } from 'lucide-react'

import { useState } from 'react'
import { UpdateMessageModal } from './update-message-modal'
import { MessageArticle } from './message-article'
import { MESSAGES_TYPES, SOCKET_EVENTS } from '../../../constants'
import EmojiPicker from 'emoji-picker-react'
import { downloadFile } from '../../../services/message'

interface Props {
  message: MessageType
  setReplyingMessage: (message: ReplyMessage) => void
  messageListRef?: React.RefObject<HTMLUListElement>
  emojiPickerPosition: string
  showEmojiPicker: uuid | null
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<uuid | null>>
}

export function Message ({
  setReplyingMessage,
  messageListRef,
  message,
  emojiPickerPosition,
  showEmojiPicker,
  setShowEmojiPicker
}: Props) {
  const { user: loggedUser } = useAuth0()
  if (!loggedUser) return null
  const {
    uuid,
    content,
    senderId,
    file: resourceUrl,
    type,
    isDeleted
  } = message
  const { chats, replaceMessage, socket } = useSocketStore()
  const isMe = senderId === loggedUser?.sub
  const user = isMe
    ? loggedUser
    : chats.find(chat => chat.user.id === senderId)?.user
  const [openUpdateModal, setOpenUpdateModal] = useState(false)

  if (!user) return null

  const handleReplyMessage = () => {
    let senderUser = user
    if (isMe) {
      senderUser = {
        id: loggedUser?.sub,
        name: 'yourself',
        picture: loggedUser?.picture
      }
    }
    setReplyingMessage({
      uuid,
      content,
      resourceUrl,
      type,
      user: senderUser as User
    })
  }

  const handleDeleteMessage = () => {
    const newMessage = { ...message, isDeleted: true }
    replaceMessage(newMessage)
    socket?.emit(SOCKET_EVENTS.DELETE_MESSAGE, newMessage)
  }

  const handleReactMessage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    setShowEmojiPicker(showEmojiPicker === uuid ? null : uuid)
  }

  const handleEmojiSelect = (emojiEvent: EmojiEvent) => {
    setShowEmojiPicker(null)
    const unicodeSymbols = emojiEvent.unified.split('_')
    const codePoints: Array<number> = []
    unicodeSymbols.forEach(symbol => codePoints.push(parseInt('0x' + symbol)))
    const emojiChar = String.fromCodePoint(...codePoints)
    if (
      message.reactions &&
      message.reactions[loggedUser?.sub as string] === emojiChar
    )
      return
    const newMessage = {
      ...message,
      reactions: {
        ...message.reactions,
        [loggedUser?.sub as string]: emojiChar
      }
    }
    replaceMessage(newMessage)
    socket?.emit(SOCKET_EVENTS.EDIT_MESSAGE, newMessage)
  }

  const handleDownloadFile = async () => {
    if (!message.file) return
    const updatedFile = await downloadFile(message.file, message.uuid)
    if (updatedFile && updatedFile.url !== message.file.url)
      replaceMessage({ ...message, file: updatedFile })
  }

  return (
    <>
      <li
        className={`flex flex-col space-y-2 relative max-w-full  ${
          isMe ? 'items-end' : 'items-start'
        }`}
        data-uuid={uuid}
      >
        {showEmojiPicker === uuid && (
          <div id='emoji-selector' className={`${emojiPickerPosition} z-50`}>
            <EmojiPicker
              onEmojiClick={handleEmojiSelect}
              reactionsDefaultOpen
              reactions={[
                '1f44d',
                '1f525',
                '1f602',
                '1f62e',
                '1f622',
                '1f64f',
                '1f621'
              ]}
            />
          </div>
        )}
        <div
          className={`flex items-start gap-2 ${
            isMe ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <img
            src={user?.picture}
            width='50'
            height='50'
            alt={`Avatar of the user ${user?.name} in the chat`}
            className='rounded-full align-top h-7 w-7 mt-2'
            style={{ aspectRatio: 50 / 50, objectFit: 'cover' }}
          />
          <aside
            className={`group flex items-center ${
              isMe ? 'place-content-start' : 'place-content-end'
            }`}
          >
            <MessageArticle
              message={message}
              messageListRef={messageListRef}
              isMe={isMe}
            />
            {!isDeleted && !showEmojiPicker && (
              <span className='absolute -top-11 invisible group-hover:visible ease-in-out duration-150 backdrop-blur-3xl border-1 rounded-md p-2 flex items-center space-x-2'>
                <button
                  name='emoji'
                  className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-blue-500'
                  onClick={handleReactMessage}
                >
                  <SmilePlus className='w-4 h-4' />
                </button>
                <button
                  className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-blue-500'
                  onClick={handleReplyMessage}
                >
                  <Reply className='w-5 h-5' />
                </button>
                <button
                  className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-blue-500'
                  onClick={() => setOpenUpdateModal(true)}
                >
                  <Pencil className='w-4 h-4' />
                </button>
                <button
                  className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-red-500'
                  onClick={handleDeleteMessage}
                >
                  <Trash2 className='w-4 h-4' />
                </button>
                {(message.type === MESSAGES_TYPES.IMAGE ||
                  message.type === MESSAGES_TYPES.VIDEO ||
                  message.type === MESSAGES_TYPES.STICKER) &&
                  message.file && (
                    <button
                      className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-blue-500'
                      onClick={handleDownloadFile}
                    >
                      <Download className='w-4 h-4' />
                    </button>
                  )}
              </span>
            )}
          </aside>
        </div>
        <UpdateMessageModal
          isOpen={openUpdateModal}
          closeModal={() => setOpenUpdateModal(false)}
          message={message}
        />
      </li>
    </>
  )
}
