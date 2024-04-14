import { ChatItem } from '../chat/chat-item'

export function Sidebar () {
  return (
    <div className='flex flex-col border-r'>
      <nav className='p-4 space-y-4'>
        <ul className='space-y-4'>
          <ChatItem
            image='/frainer.jpeg'
            name='Frainer'
            lastMessage='Last message here'
            lastMessageDate='10:07 AM'
            unreadMessages={1}
          />
          <ChatItem
            image='/frainer.jpeg'
            name='Frainer'
            lastMessage='Last message here'
            lastMessageDate='10:07 AM'
            unreadMessages={3}
          />
          <ChatItem
            image='/frainer.jpeg'
            name='Frainer'
            lastMessage='Last message here'
            lastMessageDate='10:07 AM'
            unreadMessages={4}
          />
          <ChatItem
            image='/frainer.jpeg'
            name='Frainer'
            lastMessage='Last message here'
            lastMessageDate='10:07 AM'
            unreadMessages={2}
          />
        </ul>
      </nav>
    </div>
  )
}
