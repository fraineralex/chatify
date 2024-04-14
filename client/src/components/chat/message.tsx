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
        className={`flex items-start rounded-lg pl-2 px-4 py-2 max-w-3xl ${
          isMe ? 'bg-gray-300' : 'bg-gray-100'
        }`}
      >
        <img
          src={user.avatar}
          width='28'
          height='28'
          alt={`Avatar of the user ${user.name} in the chat`}
          className='rounded-full align-top'
          style={{ aspectRatio: 28 / 28, objectFit: 'cover' }}
        />
        <span className={`items-center ms-2`}>
          <p className={`text-sm w-100 inline`}>{content}</p>
          <p
            className={`text-gray-400 float-end align-bottom text-[10px] mt-4 ms-5 inline`}
          >
            {time}
          </p>
        </span>
      </aside>
    </article>
  )
}
