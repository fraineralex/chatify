import { Ban } from 'lucide-react'
import { Message } from '../../types/chat'
import { MessageState } from './message-state'
import { QuotedMessage } from './quoted-message'

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
  console.log(message.content.length)
  return (
    <article
      className={`items-center rounded-lg pt-1 px-1 ps-2 max-w-3xl whitespace-normal break-words border border-transparent ${
        isMe ? 'bg-gray-300' : 'bg-gray-100'
      }`}
    >
      {!message.isDeleted && message.replyToId && (
        <QuotedMessage
          quotedMessageId={message.replyToId}
          messageListRef={messageListRef}
        />
      )}

      {!message.isDeleted && (
        <p className={`text-sm w-100 inline`}>{message.content}</p>
      )}
      {message.isDeleted && (
        <p className='text-sm font-light w-100 inline text-gray-400 italic'>
          <Ban className='w-4 h-4 text-gray-400 inline me-2 align-middle' />
          {isMe ? 'You deleted this message.' : 'This message was deleted.'}
        </p>
      )}

      {!message.isDeleted && isMe && (
        <MessageState
          isSent={message.isSent}
          isDelivered={message.isDelivered}
          isRead={message.isRead}
        />
      )}
      <span className='text-gray-500 float-end align-bottom mt-4 ms-2 flex space-x-1'>
        {message.isEdited && !message.isDeleted && (
          <small className='italic text-[10px]'>Edited</small>
        )}
        <time className='text-[10px]'>
          {message.createdAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </time>
      </span>
    </article>
  )
}
