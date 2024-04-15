import { useSocketStore } from '../../store/socket'

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
  const { currentChat, setCurrentChat } = useSocketStore()
  const isCurrentChat = currentChat === user.name

  const openChat = () => {
    if (isCurrentChat) return

    setCurrentChat(user.name)
  }

  return (
    <li
      className={`flex items-center space-x-2  border border-transparent border-b-gray-300 cursor-pointer p-1 py-2 w-full ${
        isCurrentChat
          ? 'bg-gray-300 rounded-md'
          : 'rounded-sm hover:bg-gray-200 hover:rounded-md'
      }`}
      onClick={openChat}
    >
      <img
        src={user.avatar}
        width='50'
        height='50'
        alt={`Chat avatar of ${user.name}`}
        className='rounded-full'
        style={{ aspectRatio: 50 / 50, objectFit: 'cover' }}
      />
      <article className='items-center text-left w-full'>
        <div className='flex overflow-hidden text-left flex-grow w-full justify-between'>
          <h2 className='text-base font-medium inline-flex overflow-hidden items-center'>
            {user.name}
          </h2>
          <small className='text-xs text-gray-500 text-right inline-flex mt-1'>
            {lastMessageDate}
          </small>
        </div>
        <aside className='flex items-center text-left overflow-hidden flex-grow w-full justify-between'>
          <p className='text-sm text-gray-500 inline-flex overflow-hidden items-center'>
            {lastMessage}
          </p>
          <span className='inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border border-input bg-background h-5 w-5 px-1 py-2 rounded-full'>
            {unreadMessages}
          </span>
        </aside>
      </article>
    </li>
  )
}
