import { useAuth0 } from '@auth0/auth0-react'
import { Message as MessageType, ReplyMessage, User } from '../../types/chat'
import { useSocketStore } from '../../store/socket'

import { Pencil, Reply, SmilePlus, Trash2 } from 'lucide-react'

import { useState } from 'react'
import { UpdateMessageModal } from './update-message-modal'
import { MessageArticle } from './message-article'

interface Props {
  message: MessageType
  setReplyingMessage: (message: ReplyMessage) => void
  messageListRef?: React.RefObject<HTMLUListElement>
}

export function Message ({
  setReplyingMessage,
  messageListRef,
  message
}: Props) {
  const { user: loggedUser } = useAuth0()
  if (!loggedUser) return null
  const { uuid, content, senderId, resourceUrl, type, isDeleted } = message
  const { chats, replaceMessage } = useSocketStore()
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
    replaceMessage({ ...message, isDeleted: true })
  }

  return (
    <li
      className={`flex flex-col space-y-2 relative  ${
        isMe ? 'items-end' : 'items-start'
      }`}
      data-uuid={uuid}
    >
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

          {!isDeleted && (
            <span className='absolute -top-11 invisible group-hover:visible ease-in-out duration-150 backdrop-blur-3xl border-1 rounded-md p-2 flex items-center space-x-2'>
              <button className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-blue-500'>
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
  )
}
