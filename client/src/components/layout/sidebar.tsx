import { useSocketStore } from '../../store/socket'
import { ChatItem } from '../chat/chat-item'
import { Header } from './header'

export function Sidebar () {
  const { chats } = useSocketStore()

  return (
    <div className='border-r h-screen'>
      <Header />
      <nav className='py-4 px-1 space-y-4 h-[90%]'>
        <ul className='space-y-1'>
          {chats
            .sort(
              (a, b) =>
                new Date(b.lastMessage?.createdAt || b.createdAt).getTime() -
                new Date(a.lastMessage?.createdAt || a.createdAt).getTime()
            )
            .map((chat, index) => (
              <ChatItem key={index} {...chat} />
            ))}
        </ul>
      </nav>
    </div>
  )
}
