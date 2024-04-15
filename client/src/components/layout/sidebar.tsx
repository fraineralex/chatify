import { useSocketStore } from '../../store/socket'
import { Chats } from '../../types/chat'
import { ChatItem } from '../chat/chat-item'

export function Sidebar () {
  const messages = useSocketStore(state => state.messages)
  const loggedUser = useSocketStore(state => state.loggedUser)

  const chats: Chats = []

  messages
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .forEach(message => {
      if (chats.find(chat => chat.user.name === message.sender_id.username))
        return

      const chat = {
        user: {
          name: message.sender_id.username,
          avatar: message.sender_id.avatar
        },
        lastMessage: message.content,
        lastMessageDate: message.createdAt.toLocaleString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        unreadMessages: 1
      }

      chats.push(chat)
    })

  return (
    <div className='flex flex-col border-r'>
      <nav className='py-4 px-1 space-y-4'>
        <ul className='space-y-4'>
          {chats
            .filter(chat => chat.user.name !== loggedUser)
            .map((chat, index) => (
              <ChatItem key={index} {...chat} />
            ))}
        </ul>
      </nav>
    </div>
  )
}
