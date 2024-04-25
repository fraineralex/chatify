import { useSocketStore } from '../../store/socket'
import { Chat, uuid } from '../../types/chat'
import { ChatItem } from '../chat/chat-item'
import { Header } from './header'

export function Sidebar () {
  const { chats } = useSocketStore()
  const uniqueChats = Object.values(
    chats.reduce((acc: { [key: uuid]: Chat }, chat) => {
      acc[chat.uuid] = chat
      return acc
    }, {})
  )

  return (
    <div className='border-r h-screen'>
      <Header />
      <nav className='py-4 px-1 space-y-4 h-[90%]'>
        <ul className='space-y-1'>
          {uniqueChats
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
