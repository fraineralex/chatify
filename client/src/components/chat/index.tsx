import { Socket, io } from 'socket.io-client'
import { Form } from './form'
import { Header } from './header'
import { Message } from './message'
import './chat.css'
import { Messages } from '../../types/chat'
import { useEffect, useState } from 'react'

export function Chat () {
  const [messages, setMessages] = useState<Messages>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      auth: {
        serverOffset: 0,
        username: 'fraineralex'
      }
    })

    newSocket?.on('chat message', message => {
      setMessages(messages => [
        ...messages,
        {
          content: message.content,
          created_at: new Date(message.created_at),
          isMe: false,
          user: {
            name: message.username,
            avatar: '/frainer.jpeg'
          }
        }
      ])

      newSocket.auth.serverOffset = message.id
    })

    setSocket(newSocket)

    return () => {
      newSocket?.off('chat message')
    }
  }, [])

  return (
    <main className='flex flex-col h-screen p-4 pr-1 pt-0 border-b col-span-3'>
      <Header name='Frainer' image='/frainer.jpeg' />
      <div className='flex-1 p-4 space-y-4 overflow-y-auto my-5'>
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            created_at={message.created_at}
            isMe={message.isMe}
            user={message.user}
          />
        ))}
      </div>
      <Form socket={socket} />
    </main>
  )
}
