import { User } from '@auth0/auth0-react'
import { Message, uuid } from '../../types/chat'
import { MessageState } from './message-state'
import { Ban } from 'lucide-react'
import { ChatDropdown } from './chat-dropdown'

interface Props {
  loggedUser: User | undefined
  lastMessage?: Message
  unreadMessages: number
  uuid?: uuid
}

export function LastMessage ({
  loggedUser,
  lastMessage,
  unreadMessages,
  uuid
}: Props) {
  const isMe = loggedUser?.sub === lastMessage?.senderId

  return (
    <aside className='flex items-center text-left  flex-grow w-full justify-between text-gray-500'>
      <p className='text-sm truncate max-w-full inline-block'>
        {lastMessage && isMe && (
          <MessageState
            isDelivered={lastMessage.isDelivered}
            isSent={lastMessage.isSent}
            isRead={lastMessage.isRead}
            isChatItem
          />
        )}
        {!lastMessage?.isDeleted && lastMessage?.content}
        {lastMessage?.isDeleted && (
          <>
            <Ban className='w-4 h-4 inline me-1 align-middle' />
            <span className='align-middle'>
              {isMe ? 'You deleted this message.' : 'This message was deleted.'}
            </span>
          </>
        )}
      </p>
      <span className='flex space-x-2'>
        {unreadMessages > 0 && (
          <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full border-blue-500 bg-blue-600 text-white'>
            {unreadMessages}
          </span>
        )}
        {uuid && <ChatDropdown uuid={uuid} />}
      </span>
    </aside>
  )
}
