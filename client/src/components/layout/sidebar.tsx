import { useChatMessage } from '../../hooks/useChatMessage'
import { useFilterChats } from '../../hooks/useFilterChats'
import { ChatItem } from '../chat/chat-item'
import { Header } from './header'

export function Sidebar () {
  const { areChatsLoaded } = useChatMessage()
  const { filteredChats } = useFilterChats()

  return (
    <div className='border-r h-screen'>
      <Header />
      <nav className='py-4 px-1 space-y-4 h-[90%]'>
        <ul className='space-y-1'>
          {filteredChats
            .sort(
              (a, b) =>
                new Date(b.lastMessage?.createdAt || b.createdAt).getTime() -
                (b.isPinned ? Number.MAX_SAFE_INTEGER : 0) -
                new Date(a.lastMessage?.createdAt || a.createdAt).getTime() -
                (a.isPinned ? Number.MAX_SAFE_INTEGER : 0)
            )
            .map((chat, index) => (
              <ChatItem key={index} {...chat} />
            ))}
          {filteredChats.length === 0 && (
            <p className='text-center font-medium'>
              {areChatsLoaded
                ? "🚨 You don't have any chat yet"
                : 'Loading chats...'}
            </p>
          )}
        </ul>
      </nav>
    </div>
  )
}
