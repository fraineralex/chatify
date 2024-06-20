import { User } from '@auth0/auth0-react'
import { Message, uuid } from '../../types/chat'
import { MessageState } from './message/message-state'
import { Ban, Pin, ShieldQuestion } from 'lucide-react'
import { ChatDropdown } from './chat-dropdown'
import { MESSAGE_TYPE_ICONS, MESSAGES_TYPES } from '../../constants'

interface Props {
  loggedUser: User | undefined
  lastMessage?: Message
  unreadMessages: number
  uuid?: uuid
  isPinned?: boolean
  isUnread?: boolean
  isCleaned?: boolean
}

export function LastMessage({
  loggedUser,
  lastMessage,
  unreadMessages,
  uuid,
  isPinned,
  isUnread,
  isCleaned,
}: Props) {
  const isMe = loggedUser?.sub === lastMessage?.senderId

  const lastMessageContent =
    lastMessage?.content ||
    MESSAGES_TYPES[
      lastMessage?.type.toUpperCase() as keyof typeof MESSAGES_TYPES
    ]

  const Icon =
    lastMessage && MESSAGE_TYPE_ICONS[lastMessage.type]
      ? MESSAGE_TYPE_ICONS[lastMessage?.type]
      : ShieldQuestion

  return (
    <aside className="flex items-center text-left  flex-grow w-full justify-between text-gray-500">
      <p className="text-sm truncate max-w-full inline-block">
        {lastMessage && isMe && !isCleaned && (
          <MessageState
            isDelivered={lastMessage.isDelivered}
            isSent={lastMessage.isSent}
            isRead={lastMessage.isRead}
            isChatItem
          />
        )}
        {lastMessage && !lastMessage.isDeleted && !isCleaned && (
          <>
            {lastMessage.type !== MESSAGES_TYPES.TEXT && (
              <Icon className="w-4 h-4 inline me-1 align-middle" />
            )}
            <span
              className={`align-middle font-medium ${
                !lastMessage.content && 'capitalize'
              }`}
            >
              {lastMessage && lastMessageContent}
            </span>
          </>
        )}
        {!!lastMessage?.isDeleted && !isCleaned && (
          <>
            <Ban className="w-4 h-4 inline me-1 align-middle" />
            <span className="align-middle">
              {isMe ? 'You deleted this message.' : 'This message was deleted.'}
            </span>
          </>
        )}
      </p>
      <span className="flex space-x-2">
        {isPinned && <Pin className="w-4 h-4 rotate-45" />}
        {(unreadMessages > 0 || isUnread) && !isCleaned && (
          <span className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full border-blue-500 bg-blue-600 text-white">
            {isUnread ? undefined : unreadMessages}
          </span>
        )}
        {uuid && <ChatDropdown uuid={uuid} />}
      </span>
    </aside>
  )
}
