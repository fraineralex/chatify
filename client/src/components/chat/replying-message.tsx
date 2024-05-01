import { useAuth0 } from '@auth0/auth0-react'
import { ReplyMessage } from '../../types/chat'
import { X } from 'lucide-react'

export function ReplyingMessage ({
  replyingMessage,
  handleReplyMessage
}: {
  replyingMessage: ReplyMessage | null
  handleReplyMessage: (message: ReplyMessage | null) => void
}) {
  const { user: loggedUser } = useAuth0()
  if (!replyingMessage || !loggedUser) return null

  const accentColor =
    replyingMessage.user.id === loggedUser.sub
      ? 'border-blue-500 text-blue-500'
      : 'border-green-500 text-green-500'
  return (
    <span
      className={`flex flex-col bg-gray-100 mx-5 mb-3 py-5 px-4 rounded-lg border-l-[5px] relative whitespace-normal break-words ${accentColor}`}
    >
      <button
        className='absolute top-0 right-0 m-2 text-gray-500 hover:scale-110 ease-in-out duration-100 hover:text-black'
        onClick={() => handleReplyMessage(null)}
      >
        <X className='w-5 h-5' />
      </button>
      <p className='font-medium text-xs'>{`Replying to ${replyingMessage.user.name}`}</p>
      <p className='text-gray-600 text-xs mt-1 line-clamp-2 max-w-full pr-10'>
        {replyingMessage.content}
      </p>
    </span>
  )
}
