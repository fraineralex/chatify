import { User } from '@auth0/auth0-react'
import { Message } from '../../types/chat'
import { MessageState } from './message-state'
import { Ban } from 'lucide-react'

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
      <p className='text-sm text-gray-500 truncate max-w-full inline-block'>
        {lastMessage && loggedUser?.sub === lastMessage?.senderId && (
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
              {loggedUser?.sub === lastMessage?.senderId
                ? 'You deleted this message.'
                : 'This message was deleted.'}
            </span>
          </>
        )}
      </p>
      {unreadMessages > 0 && (
        <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full'>
          {unreadMessages}
        </span>
      )}
    </aside>
  )
}
