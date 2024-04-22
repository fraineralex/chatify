import { useSocketStore } from '../../store/socket'
import { Profile } from '../auth/profile'
import { ChatItem } from '../chat/chat-item'

export function Sidebar () {
  const { chats } = useSocketStore()

  /*   messages
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
    }) */

  return (
    <div className='border-r h-screen'>
      <nav className='py-4 px-1 space-y-4 h-[90%]'>
        <ul className='space-y-1'>
          {chats.map((chat, index) => (
            <ChatItem key={index} {...chat} />
          ))}
        </ul>
      </nav>
      <Profile />
    </div>
  )
}
