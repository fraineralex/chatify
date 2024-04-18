import { Form } from './form'
import { Header } from './header'
import { Message } from './message'
import './chat.css'
import { useSocketStore } from '../../store/socket'
import { useRef } from 'react'

export function Chat () {
  const { messages, currentChat } = useSocketStore()
  const currentChatMessages = messages
    .filter(
      message =>
        message.senderId.username === currentChat.name ||
        message.receiverId.username === currentChat.name
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const messagesEndRef = useRef<HTMLDivElement>(null)
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className='flex flex-col h-screen p-4 pr-1 pt-0 border-b col-span-3'>
      {currentChat.name ? (
        <>
          <Header name={currentChat.name} image={`/${currentChat.name}.webp`} />
          <div
            className='flex-1 p-4 space-y-4 overflow-y-auto my-5 scroll-smooth'
            ref={messagesEndRef}
          >
            {currentChatMessages.map((message, index) => (
              <Message key={message.uuid ?? index} {...message} />
            ))}
          </div>
          <Form />
        </>
      ) : (
        <div className='flex-1 flex items-center justify-center'>
          <h2 className='text-center text-muted-foreground'>
            Select a chat to start messaging
          </h2>
        </div>
      )}
    </main>
  )
}
