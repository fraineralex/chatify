import { CheckCheck } from 'lucide-react'
import { User } from '@auth0/auth0-react'
import { Message } from '../../types/chat'

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
    <aside className='flex items-center text-left overflow-hidden flex-grow w-full justify-between'>
      <p className='text-sm text-gray-500 inline-flex overflow-hidden items-center'>
        {loggedUser?.sub === lastMessage?.senderId && (
          <CheckCheck
            className={`w-4 h-4 text-[10px] ms-1 me-1 inline ${
              lastMessage?.isRead ? 'text-blue-500' : 'text-gray-500'
            }`}
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
