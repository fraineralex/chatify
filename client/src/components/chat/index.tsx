import { io } from 'socket.io-client'

import { Form } from './form'
import { Header } from './header'
import { Message } from './message'

const messages = [
  {
    content: "Hey! What's up? Did you see the new Star Wars trailer?",
    time: '10:01 AM',
    isMe: true,
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    }
  },
  {
    content:
      "Yeah! I'm good. And yes, I did. It looks amazing! I can't wait to see it.",
    time: '10:03 AM',
    isMe: false,
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    }
  },
  {
    content: "Hey! What's up? Did you see the new Star Wars trailer?",
    time: '10:01 AM',
    isMe: true,
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    }
  },
  {
    content:
      "Yeah! I'm good. And yes, I did. It looks amazing! I can't wait to see it.",
    time: '10:03 AM',
    isMe: false,
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    }
  },
  {
    content: "Hey! What's up? Did you see the new Star Wars trailer?",
    time: '10:01 AM',
    isMe: true,
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    }
  },
  {
    content: "Hey! What's up? Did you see the new Star Wars trailer?",
    time: '10:01 AM',
    isMe: false,
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    }
  },
  {
    content: "Hey! What's up? Did you see the new Star Wars trailer?",
    time: '10:01 AM',
    isMe: false,
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    }
  },
  {
    content: "Hey! What's up? Did you see the new Star Wars trailer?",
    time: '10:01 AM',
    isMe: true,
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    }
  },
  {
    content: "Hey! What's up? Did you see the new Star Wars trailer?",
    time: '10:01 AM',
    isMe: true,
    user: {
      name: 'Frainer',
      avatar: '/frainer.jpeg'
    }
  }
]

export function Chat () {
  const socket = io('http://localhost:3000')
  return (
    <section className='flex flex-col h-screen p-4 border-b col-span-3'>
      <Header name='Frainer' image='/frainer.jpeg' />
      <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            time={message.time}
            isMe={message.isMe}
            user={message.user}
          />
        ))}
      </div>
      <Form socket={socket} />
    </section>
  )
}
