import { useEffect, useRef, useState } from 'react'
import { AttachFile, Emoji } from '../../common/svg-icons'
import {
  EmojiEvent,
  Message,
  ReplyMessage,
  ServerMessage
} from '../../../types/chat'
import { MESSAGES_TYPES, SOCKET_EVENTS } from '../../../constants'
import { useSocketStore } from '../../../store/socket'
import { useAuth0 } from '@auth0/auth0-react'
import { useChatStore } from '../../../store/currenChat'
import { ReplyingMessage } from './replying-message'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { SendHorizontal } from 'lucide-react'

export function Form ({
  replyingMessage,
  handleReplyMessage
}: {
  replyingMessage: ReplyMessage | null
  handleReplyMessage: (message: ReplyMessage | null) => void
}) {
  const { socket, addMessage, replaceChat } = useSocketStore()
  const { currentChat, setCurrentChat } = useChatStore()
  const { user: loggedUser } = useAuth0()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const showEmojiPickerRef = useRef(showEmojiPicker)
  const formRef = useRef<HTMLFormElement>(null)
  const [contentMessage, setContentMessage] = useState<string>(
    currentChat?.draft ?? ''
  )

  useEffect(() => {
    showEmojiPickerRef.current = showEmojiPicker
  }, [showEmojiPicker])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        showEmojiPickerRef.current &&
        !target.closest('div[id="emoji-mart"]') &&
        !target.closest('button[name="emoji"]')
      ) {
        setShowEmojiPicker(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!contentMessage || !currentChat) return
    const message: ServerMessage = {
      uuid: crypto.randomUUID(),
      content: currentChat.draft || '',
      sender_id: loggedUser?.sub || '',
      receiver_id: currentChat.user.id,
      chat_id: currentChat.uuid,
      type: MESSAGES_TYPES.TEXT,
      is_deleted: false,
      is_edited: false,
      is_delivered: false,
      is_read: false,
      reply_to_id: replyingMessage?.uuid || null,
      resource_url: null,
      created_at: new Date().toISOString()
    }
    const newMessage: Message = {
      uuid: message.uuid,
      content: message.content,
      createdAt: new Date(),
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      chatId: message.chat_id,
      type: message.type,
      isDeleted: message.is_deleted,
      isEdited: message.is_edited,
      isSent: false,
      isDelivered: message.is_delivered,
      isRead: message.is_read,
      replyToId: message.reply_to_id,
      resourceUrl: message.resource_url
    }

    addMessage(newMessage)
    const chatUpdated = { ...currentChat, lastMessage: newMessage, draft: '' }
    replaceChat(chatUpdated)
    setCurrentChat(chatUpdated)

    socket?.emit(SOCKET_EVENTS.NEW_MESSAGE, message)
    setContentMessage('')

    if (replyingMessage) handleReplyMessage(null)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentMessage(event.target.value)
    if (!currentChat) return
    setCurrentChat({ ...currentChat, draft: event.target.value })
    replaceChat({ ...currentChat, draft: event.target.value })
  }

  const handleEmojiSelect = (emojiEvent: EmojiEvent) => {
    const unicodeSymbols = emojiEvent.unified.split('_')
    const codePoints: number[] = []
    unicodeSymbols.forEach(symbol => codePoints.push(parseInt('0x' + symbol)))
    const emojiChar = String.fromCodePoint(...codePoints)

    const updatedContentMessage = contentMessage + emojiChar
    setContentMessage(updatedContentMessage)
    if (!currentChat) return
    setCurrentChat({ ...currentChat, draft: updatedContentMessage })
    replaceChat({ ...currentChat, draft: updatedContentMessage })
  }

  const handleBlur = () => {
    if (!contentMessage || !currentChat) return
    replaceChat({ ...currentChat, draft: contentMessage })
    setCurrentChat({ ...currentChat, draft: contentMessage })
  }

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker)
    formRef.current?.querySelector('input')?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      const form = event.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  return (
    <form className='p-2 border-t w-full' onSubmit={handleSubmit} ref={formRef}>
      <ReplyingMessage
        replyingMessage={replyingMessage}
        handleReplyMessage={handleReplyMessage}
      />
      <aside className='flex items-center space-x-3 text-gray-600'>
        {showEmojiPicker && (
          <div id='emoji-mart' className='fixed bottom-20'>
            <Picker
              theme='light'
              data={data}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>
        )}
        <button
          name='emoji'
          className={`hover:scale-125 ease-out duration-100 ${
            showEmojiPicker ? 'text-blue-500' : 'text-gray-600'
          }`}
          onClick={handleEmojiClick}
        >
          <Emoji className='w-6 h-6' />
          <span className='sr-only'>Insert emoji</span>
        </button>
        <button className='hover:scale-125 ease-out duration-100 hover:text-gray-700'>
          <AttachFile className='w-6 h-6' />
          <span className='sr-only'>Attach file</span>
        </button>
        <input
          className='flex h-10 w-full border-input bg-background px-3 mx-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-full border-0 flex-1'
          placeholder='Type a message'
          name='content'
          autoFocus
          onChange={handleChange}
          value={currentChat?.draft ?? ''}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        <button
          type='submit'
          className='hover:scale-125 ease-out duration-100 hover:text-gray-700'
        >
          <SendHorizontal className='w-6 h-6' />
          <span className='sr-only'>Send</span>
        </button>
      </aside>
    </form>
  )
}
