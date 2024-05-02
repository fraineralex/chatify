import { Form } from './form'
import { Header } from './header'
import { Message } from './message'
import './chat.css'
import { useSocketStore } from '../../store/socket'
import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../store/currenChat'
import { ReplyMessage } from '../../types/chat'

export function Chat () {
  const { messages } = useSocketStore()
  const currentChat = useChatStore(state => state.currentChat)
  const messageListRef = useRef<HTMLUListElement>(null)
  const [replyingMessage, setReplyingMessage] = useState<ReplyMessage | null>(
    null
  )
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
      messageListRef.current.nextElementSibling?.querySelector('input')?.focus()
    }
  }, [messages, currentChat])

  const handleReplyMessage = (replyingMessage: ReplyMessage | null) => {
    setReplyingMessage(replyingMessage)
    messageListRef.current?.nextElementSibling?.querySelector('input')?.focus()
  }

  return (
    <main className='flex flex-col h-screen p-4 pr-1 pt-0 border-b col-span-3'>
      {currentChat ? (
        <>
          <Header
            name={currentChat.user.name}
            picture={`${currentChat.user.picture}`}
          />
          <ul
            className='flex-1 p-4 space-y-4 overflow-y-auto my-5 scroll-smooth'
            ref={messageListRef}
          >
            {messages
              .filter(message => message.chatId === currentChat?.uuid)
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .map((message, index) => (
                <Message
                  key={message.uuid ?? index}
                  message={message}
                  setReplyingMessage={setReplyingMessage}
                  messageListRef={messageListRef}
                />
              ))}
          </ul>
          <Form
            replyingMessage={replyingMessage}
            handleReplyMessage={handleReplyMessage}
          />
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
