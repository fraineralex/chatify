import { useSocketStore } from '../../store/socket'
import { Profile } from '../auth/profile'
import { ChatItem } from '../chat/chat-item'

export function Sidebar () {
  const { chats } = useSocketStore()

  const sortedChats = chats.sort(
    (a, b) =>
      (b.lastMessage?.createdAt.getTime() || b.createdAt.getTime()) -
      (a.lastMessage?.createdAt.getTime() || a.createdAt.getTime())
  )

  return (
    <div className='border-r h-screen'>
      <nav className='py-4 px-1 space-y-4 h-[90%]'>
        <ul className='space-y-1'>
          {sortedChats.map((chat, index) => (
            <ChatItem key={index} {...chat} />
          ))}
        </ul>
      </nav>
      <Profile />
    </div>
  )
}
