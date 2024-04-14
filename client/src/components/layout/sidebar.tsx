import { ChatItem } from '../chat/chat-item'

const chats = [
  {
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    },
    lastMessage: 'Last message here',
    lastMessageDate: '10:07 AM',
    unreadMessages: 1
  },
  {
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    },
    lastMessage: 'Last message here',
    lastMessageDate: '10:07 AM',
    unreadMessages: 3
  },
  {
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    },
    lastMessage: 'Last message here',
    lastMessageDate: '10:07 AM',
    unreadMessages: 4
  },
  {
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    },
    lastMessage: 'Last message here',
    lastMessageDate: '10:07 AM',
    unreadMessages: 2
  }
]

export function Sidebar () {
  return (
    <div className='flex flex-col border-r'>
      <nav className='p-4 space-y-4'>
        <ul className='space-y-4'>
          {chats.map((chat, index) => (
            <ChatItem key={index} {...chat} />
          ))}
        </ul>
      </nav>
    </div>
  )
}
