import { Ban } from 'lucide-react'
import { Message } from '../../../types/chat'
import { MessageState } from './message-state'
import { QuotedMessage } from './quoted-message'
import { isOnlyOneEmoji } from '../../../utils/isOneEmoji'

interface Props {
  message: Message
  messageListRef?: React.RefObject<HTMLUListElement>
  isMe?: boolean
}

export function MessageArticle ({
  message,
  messageListRef,
  isMe = true
}: Props) {
  const isAnEmoji = isOnlyOneEmoji(message.content)
  return (
    <article
      className={`items-center rounded-lg pt-2 pb-1 px-1 ps-2 max-w-3xl whitespace-normal break-words border border-transparent ${
        isMe ? 'bg-gray-300' : 'bg-gray-100'
      }`}
    >
      {!message.isDeleted && message.replyToId && (
        <QuotedMessage
          quotedMessageId={message.replyToId}
          messageListRef={messageListRef}
        />
      )}

      <div
        className={`${
          !isAnEmoji ? 'flex justify-between h-full' : undefined
        }  `}
      >
        {!message.isDeleted && (
          <p
            className={`w-100 inline align-middle ${
              isAnEmoji ? 'text-5xl' : 'text-sm'
            }`}
          >
            {message.content}
          </p>
        )}
        {message.isDeleted && (
          <p className='text-sm font-light w-100 inline text-gray-400 italic'>
            <Ban className='w-4 h-4 text-gray-400 inline me-2 align-middle' />
            {isMe ? 'You deleted this message.' : 'This message was deleted.'}
          </p>
        )}

        <span
          className={`text-gray-500 items-end ms-2 flex space-x-1 self-end ${
            isAnEmoji ? 'mt-1' : 'mt-2'
          }`}
        >
          {message.isEdited && !message.isDeleted && (
            <small className='italic text-[10px]'>Edited</small>
          )}
          <time className='text-[10px]'>
            {message.createdAt
              .toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
              .toLowerCase()}
          </time>
          {!message.isDeleted && isMe && (
            <MessageState
              isSent={message.isSent}
              isDelivered={message.isDelivered}
              isRead={message.isRead}
            />
          )}
        </span>
      </div>
    </article>
  )
}
