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
      const lastMessage = {
        lastMessage: message.content,
        lastMessageDate: message.createdAt.toLocaleString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }

      if (!chats.find(chat => chat.user.name === message.senderId.username)) {
        chats.push({
          user: {
            name: message.senderId.username,
            avatar: message.senderId.avatar
          },
          unreadMessages: messages.filter(
            msg =>
              msg.isRead === false &&
              msg.senderId.username === message.senderId.username &&
              msg.receiverId.username === loggedUser
          ).length,
          ...lastMessage
        })
      }

      if (!chats.find(chat => chat.user.name === message.receiverId.username)) {
        chats.push({
          user: {
            name: message.receiverId.username,
            avatar: message.receiverId.avatar
          },
          unreadMessages: messages.filter(
            msg =>
              msg.isRead === false &&
              msg.senderId.username === message.receiverId.username &&
              msg.receiverId.username === loggedUser
          ).length,
          ...lastMessage
        })
      }
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
