import { Form } from './form'
import { Header } from './header'
import { Message } from './message'
import './chat.css'
import { useSocketStore } from '../../store/socket'

export function Chat () {
  const { messages, currentChat } = useSocketStore()
  const currentChatMessages = messages
    .filter(
      message =>
        message.sender_id.username === currentChat ||
        message.receiver_id.username === currentChat
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  return (
    <main className='flex flex-col h-screen p-4 pr-1 pt-0 border-b col-span-3'>
      {currentChat !== undefined ? (
        <>
          <Header name={currentChat} image={`/${currentChat}.webp`} />
          <div className='flex-1 p-4 space-y-4 overflow-y-auto my-5'>
            {currentChatMessages.map((message, index) => (
              <Message
                key={message.uuid ?? index}
                content={message.content}
                createdAt={message.createdAt}
                sender_id={message.sender_id}
                receiver_id={message.receiver_id}
              />
            ))}
          </div>
          <Form />
        </>
      ) : (
        <p className='text-center text-muted-foreground mt-10'>
          Select a chat to start messaging
        </p>
      )}
    </main>
  )
}
