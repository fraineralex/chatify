import { useAuth0 } from '@auth0/auth0-react'
import { useSocketStore } from '../../../store/socket'
import { uuid } from '../../../types/chat'

export function QuotedMessage ({
  quotedMessageId,
  messageListRef
}: {
  quotedMessageId: uuid
  messageListRef?: React.RefObject<HTMLUListElement>
}) {
  const { messages, chats } = useSocketStore()
  const message = messages.find(message => message.uuid === quotedMessageId)
  if (!message) return null
  const { user: loggedUser } = useAuth0()
  const isMe = message.senderId === loggedUser?.sub

  const accentColor = isMe
    ? 'border-blue-500 text-blue-500'
    : 'border-green-500 text-green-500'

  const handleClickQuotedMessage = () => {
    const $message = messageListRef?.current?.querySelector(
      `[data-uuid="${quotedMessageId}"]`
    )

    $message?.scrollIntoView({ behavior: 'smooth' })
    const $article = $message?.querySelector('article')
    $article?.animate(
      [{ opacity: 0.3, border: 'blue 1px solid' }, { opacity: 1 }],
      {
        duration: 2000,
        easing: 'ease-in-out'
      }
    )
  }
  return (
    <span
      className={`flex flex-col bg-gray-100 px-2 mb-1 rounded-lg border-l-4 whitespace-normal break-words cursor-pointer ${accentColor}`}
      onClick={handleClickQuotedMessage}
    >
      <p className='font-medium text-xs my-1'>
        {isMe
          ? 'You'
          : chats.find(chat => chat.user.id === message.senderId)?.user.name.split('@')[0]}
      </p>
      <p className='text-gray-600 text-xs pb-2 line-clamp-2 max-w-md truncate inline-block pr-10'>
        {message.content}
      </p>
    </span>
  )
}
