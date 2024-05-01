import { User } from '@auth0/auth0-react'
import { Message } from '../../types/chat'
import { MessageState } from './message-state'

interface Props {
  loggedUser: User | undefined
  lastMessage?: Message
  unreadMessages: number
}

export function LastMessage ({
  loggedUser,
  lastMessage,
  unreadMessages
}: Props) {
  return (
    <aside className='flex items-center text-left  flex-grow w-full justify-between'>
      <p className='text-sm text-gray-500 items-center truncate  max-w-full inline-block'>
        {lastMessage && loggedUser?.sub === lastMessage?.senderId && (
          <MessageState
            isDelivered={lastMessage.isDelivered}
            isSent={lastMessage.isSent}
            isRead={lastMessage.isRead}
            isChatItem
          />
        )}
        {lastMessage?.content || 'No messages yet'}
      </p>
      {unreadMessages > 0 && (
        <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full'>
          {unreadMessages}
        </span>
      )}
    </aside>
  )
}
