import { useAuth0 } from '@auth0/auth0-react'
import { Message as MessageType, ReplyMessage, User } from '../../types/chat'
import { useSocketStore } from '../../store/socket'
import { MessageState } from './message-state'
import { Pencil, Reply, SmilePlus, Trash2 } from 'lucide-react'
import { QuotedMessage } from './quoted-message'

interface Props extends MessageType {
  setReplyingMessage: (message: ReplyMessage) => void
  messageListRef?: React.RefObject<HTMLUListElement>
}

export function Message ({
  uuid,
  content,
  createdAt,
  senderId,
  isSent,
  isDelivered,
  isRead,
  resourceUrl,
  type,
  replyToId,
  messageListRef,
  setReplyingMessage
}: Props) {
  const { user: loggedUser } = useAuth0()
  if (!loggedUser) return null
  const { chats } = useSocketStore()
  const isMe = senderId === loggedUser?.sub
  const user = isMe
    ? loggedUser
    : chats.find(chat => chat.user.id === senderId)?.user

  if (!user) return null

  const time = createdAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

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
          <article
            className={`items-center rounded-lg pt-1 px-1 ps-2 max-w-3xl whitespace-normal break-words border border-transparent ${
              isMe ? 'bg-gray-300' : 'bg-gray-100'
            }`}
          >
            {replyToId && (
              <QuotedMessage
                quotedMessageId={replyToId}
                messageListRef={messageListRef}
              />
            )}

            <p className={`text-sm w-100 inline`}>{content}</p>

            {isMe && (
              <MessageState
                isSent={isSent}
                isDelivered={isDelivered}
                isRead={isRead}
              />
            )}
            <time
              className={`text-gray-500 float-end align-bottom text-[10px] mt-4 ms-5 inline`}
            >
              {time}
            </time>
          </article>

          <span className='absolute -top-11 invisible group-hover:visible ease-in-out duration-150 backdrop-blur-3xl border-1 rounded-md p-2 flex items-center space-x-2'>
            <button className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-blue-500'>
              <SmilePlus className='w-4 h-4' />
            </button>
            <button
              className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-blue-500'
              onClick={handleReplyMessage}
            >
              <Reply className='w-4 h-4' />
            </button>
            <button className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-blue-500'>
              <Pencil className='w-4 h-4' />
            </button>
            <button className='text-gray-800 cursor-pointer ease-linear duration-100 hover:scale-150 hover:text-red-500'>
              <Trash2 className='w-4 h-4' />
            </button>
          </span>
        </aside>
      </div>
    </li>
  )
}
