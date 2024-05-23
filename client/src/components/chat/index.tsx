import { Form } from './message/form'
import { Header } from './header'
import { Message } from './message/message'
import './chat.css'
import { useSocketStore } from '../../store/socket'
import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../store/currenChat'
import { ReplyMessage, uuid } from '../../types/chat'
import { PhotoSlider } from 'react-photo-view'
import { useImageSliderStore } from '../../store/imageSlider'
import 'react-photo-view/dist/react-photo-view.css'
import { MESSAGES_TYPES } from '../../constants'

export function Chat () {
  const { messages } = useSocketStore()
  const currentChat = useChatStore(state => state.currentChat)
  const messageListRef = useRef<HTMLUListElement>(null)
  const [replyingMessage, setReplyingMessage] = useState<ReplyMessage | null>(
    null
  )
  const [showEmojiPicker, setShowEmojiPicker] = useState<uuid | null>(null)
  const showEmojiPickerRef = useRef(showEmojiPicker)
  const [emojiPickerPosition, setEmojiPickerPosition] =
    useState('absolute -top-12')
  const { visible, index, setVisible, setIndex } = useImageSliderStore()
  const chatImageMessages = useSocketStore(state => state.messages)
    .filter(
      c =>
        c.chatId === currentChat?.uuid &&
        c.type === MESSAGES_TYPES.IMAGE &&
        !!c.file
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map(message => message.file?.url ?? '')
    .filter(Boolean)

  useEffect(() => {
    showEmojiPickerRef.current = showEmojiPicker
  }, [showEmojiPicker])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showEmojiPicker) return
      const target = event.target as HTMLElement
      if (
        showEmojiPickerRef.current &&
        !target.closest('div[id="emoji-selector"]') &&
        !target.closest('button[name="emoji"]') &&
        !target.closest('button[title="Show all Emojis"]')
      ) {
        setShowEmojiPicker(prevState => (prevState === null ? prevState : null))
      }

      if (
        showEmojiPickerRef.current &&
        target.closest('button[title="Show all Emojis"]')
      )
        setEmojiPickerPosition('fixed top-1/2 transform -translate-y-1/2')
    }

    window.addEventListener('click', handleClickOutside)

    return () => window.removeEventListener('click', handleClickOutside)
  }, [showEmojiPicker])

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
    <main className='flex flex-col h-screen p-4 pr-1 pt-0 border-b col-span-5'>
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
              .filter(
                message =>
                  message.chatId === currentChat?.uuid &&
                  new Date(message.createdAt).getTime() >
                    (new Date(currentChat.cleaned ?? 0).getTime() ?? 0)
              )
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .map((message, index) => (
                <Message
                  key={message.uuid ?? index}
                  message={message}
                  setReplyingMessage={setReplyingMessage}
                  messageListRef={messageListRef}
                  showEmojiPicker={showEmojiPicker}
                  setShowEmojiPicker={setShowEmojiPicker}
                  emojiPickerPosition={emojiPickerPosition}
                />
              ))}
          </ul>

          <Form
            replyingMessage={replyingMessage}
            handleReplyMessage={handleReplyMessage}
          />

          <PhotoSlider
            images={chatImageMessages.map(url => ({ src: url, key: url }))}
            visible={visible}
            onClose={() => setVisible(false)}
            index={index}
            onIndexChange={setIndex}
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
