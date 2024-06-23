import { Ban } from 'lucide-react'
import { Message } from '../../../types/chat'
import { MessageState } from './message-state'
import { QuotedMessage } from './quoted-message'
import { isOnlyOneEmoji } from '../../../utils/isOneEmoji'
import { MESSAGES_TYPES } from '../../../constants'
import { FileInfo } from './file-info'
import DisplayImage from './display-image'
import { extractUrlsFromText } from '../../../utils/chat'

interface Props {
  message: Message
  messageListRef?: React.RefObject<HTMLUListElement>
  isMe?: boolean
  setShowMsgDropdown?: (show: boolean) => void
}

export function MessageArticle({
  message,
  messageListRef,
  isMe = true
}: Props) {
  const isAnEmoji = isOnlyOneEmoji(message.content)

  let reactions: Record<string, number> | null = null
  const messageReactions: { [key: string]: string } = JSON.parse(message.reactions ?? '{}')

  if (Object.keys(messageReactions).length > 0) {
    reactions = Object.entries(messageReactions)
      .map(([, value]) => {
        return value
      })
      .reduce<Record<string, number>>((acc, reaction) => {
        if (Object.keys(acc).includes(reaction)) {
          acc[reaction]++
        } else {
          acc[reaction] = 1
        }
        return acc
      }, {})
  }

  const contentMessage = extractUrlsFromText(message.content)

  return (
    <div className='relative mt-1 max-w-full'>
      <article
        className={`items-center rounded-lg max-w-xs md:max-w-xl whitespace-normal break-words border border-transparent ${isMe ? 'bg-gray-300' : 'bg-gray-100'
          } ${(message.type !== MESSAGES_TYPES.STICKER || !!message.isDeleted) &&
          'pt-1 pb-1 px-1 ps-1'
          }`}
      >
        {!message.isDeleted && message.replyToId && (
          <QuotedMessage
            quotedMessageId={message.replyToId}
            messageListRef={messageListRef}
          />
        )}

        {!message.isDeleted &&
          message.type === MESSAGES_TYPES.IMAGE &&
          message.file && (
            <DisplayImage chatId={message.chatId} imageUrl={message.file.url} />
          )}

        {!message.isDeleted &&
          message.type === MESSAGES_TYPES.STICKER &&
          message.file?.url && (
            <img
              src={message.file?.url}
              alt='Image of the message'
              className='md:max-w-80 max-h-[640px] w-auto h-auto rounded-lg'
            />
          )}

        {!message.isDeleted &&
          message.type === MESSAGES_TYPES.VIDEO &&
          message.file && (
            <video
              src={message.file.url}
              controls
              className='max-w-80 max-h-[640px] w-auto h-auto rounded-lg'
            />
          )}

        {!message.isDeleted &&
          message.type === MESSAGES_TYPES.DOCUMENT &&
          message.file && (
            <FileInfo fileMsg={message.file} msgId={message.uuid} />
          )}

        <div
          className={`${!isAnEmoji && 'flex justify-between h-full ps-1'}`}
        >
          {!message.isDeleted && (
            <p
              className={`w-full md:w-100 inline align-middle font-medium ${message.type === MESSAGES_TYPES.DOCUMENT ? 'ms-2' : ''
                } ${isAnEmoji ? 'text-5xl' : 'text-sm'} ${message.type !== MESSAGES_TYPES.TEXT
                  ? message.content ? 'mt-1 pb-1' : 'my-0'
                  : ''
                }`}
            >
              {contentMessage.map((word, index) =>
                typeof word === 'string' ? (
                  <span key={index}>{word} </span>
                ) : (
                  <a
                    href={
                      !word.link.includes('http')
                        ? word.link.includes('@')
                          ? `mailto:${word.link}`
                          : `https://${word.link}`
                        : word.link
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    key={index}
                    className='text-blue-600 me-1 hover:underline underline-offset-[3px] hover:text-blue-800'
                  >
                    {word.link}
                  </a>
                )
              )}

              <span
                className={`text-gray-500 items-end float-end inline-flex space-x-1 ms-2 whitespace-nowrap font-normal text-xs ${message.type === MESSAGES_TYPES.TEXT ||
                  message.type === MESSAGES_TYPES.DOCUMENT ||
                  !!message.isDeleted
                  ? isAnEmoji
                    ? 'mt-1'
                    : 'mt-2'
                  : `absolute bottom-1 right-2 ${!message.content ? 'text-white' : ''}`
                  }`}
              >
                {!!message.isEdited && !message.isDeleted && (
                  <small className='italic text-[10px]'>Edited</small>
                )}
                <time className='text-[10px]'>
                  {new Date(message.createdAt)
                    .toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    .toLowerCase()}
                </time>
                {!message.isDeleted && isMe && (
                  <MessageState
                    isSent={!!message.isSent}
                    isDelivered={!!message.isDelivered}
                    isRead={!!message.isRead}
                  />
                )}
              </span>
            </p>
          )}
          {!!message.isDeleted && (
            <p className='text-sm font-light w-100 inline text-gray-400 italic'>
              <Ban className='w-4 h-4 text-gray-400 inline me-2 align-middle' />
              {isMe ? 'You deleted this message.' : 'This message was deleted.'}
            </p>
          )}
        </div>
      </article>
      <span
        className={`${isMe ? 'justify-end me-2' : 'justify-start ms-2'
          }   flex z-20 m-0`}
      >
        {reactions &&
          Object.entries(reactions).map(([reaction, count]) => (
            <span
              key={reaction}
              className={`${isMe
                ? 'bg-gray-100 border border-gray-200'
                : 'bg-gray-200 border border-gray-100'
                } py-[1px] px-[5px] rounded-full text-sm -mt-2 mb-0`}
            >
              {reaction}
              {count > 1 && (
                <small className='text-xs font-medium'>{count}</small>
              )}
            </span>
          ))}
      </span>
    </div>
  )
}
