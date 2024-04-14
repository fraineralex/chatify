interface Props {
  user: {
    name: string
    avatar: string
  }
  lastMessage: string
  lastMessageDate: string
  unreadMessages: number
}

export function ChatItem ({
  user,
  lastMessage,
  lastMessageDate,
  unreadMessages
}: Props) {
  return (
    <li className='flex items-center space-x-2 hover:bg-gray-300 border-2 border-transparent rounded-md cursor-pointer'>
      <img
        src={user.avatar}
        width='36'
        height='36'
        alt={`Chat avatar of ${name}`}
        className='rounded-full'
        style={{ aspectRatio: 36 / 36, objectFit: 'cover' }}
      />
      <article className='grid grid-cols-6'>
        <div className='col-span-5'>
          <h2 className='text-base font-bold'>{user.name}</h2>
          <p className='text-sm text-gray-500'>{lastMessage}</p>
        </div>
        <aside>
          <small className='text-xs text-gray-500'>{lastMessageDate}</small>
          <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full ms-8'>
            {unreadMessages}
          </span>
        </aside>
      </article>
    </li>
  )
}
