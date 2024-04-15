import { Form } from './form'
import { Header } from './header'
import { Message } from './message'
import './chat.css'
import { useSocketStore } from '../../store/socket'

export function Chat () {
  const messages = useSocketStore(state => state.messages)

  return (
    <main className='flex flex-col h-screen p-4 pr-1 pt-0 border-b col-span-3'>
      <Header name='Frainer' image='/frainer.jpeg' />
      <div className='flex-1 p-4 space-y-4 overflow-y-auto my-5'>
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            createdAt={message.createdAt}
            isMe={message.isMe}
            user={message.user}
          />
        ))}
      </div>
      <Form />
    </main>
  )
}
