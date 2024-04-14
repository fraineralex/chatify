interface Props {
  content: string
  time: string
  isMe?: boolean
  user: {
    name: string
    avatar: string
  }
}

export function Message ({ content, time, isMe = true, user }: Props) {
  return (
    <article
      className={`flex flex-col space-y-2 ${
        isMe ? 'items-end' : 'items-start'
      }`}
    >
      <aside
        className={`flex-col items-center rounded-lg px-4 py-2 ${
          isMe ? 'bg-gray-300' : 'bg-gray-100'
        }`}
      >
        <span
          className={`flex space-x-2 items-center ${
            !isMe ? 'flex-row-reverse' : undefined
          }`}
        >
          <p className={`text-sm w-100 ${!isMe ? 'ms-2' : undefined}`}>
            {content}
          </p>
          <img
            src={user.avatar}
            width='28'
            height='28'
            alt={`Avatar of the user ${user.name} in the chat`}
            className='rounded-full'
            style={{ aspectRatio: 28 / 28, objectFit: 'cover' }}
          />
        </span>
        <p
          className={`text-xs text-gray-500 float-end ${
            isMe ? 'mt-1' : undefined
          }`}
        >
          {time}
        </p>
      </aside>
    </article>
  )
}
