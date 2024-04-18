import { useState } from 'react'
import { AttachFile, Emoji, Send } from '../general/svg-icons'
import { ServerMessage } from '../../types/chat'
import { MESSAGES_TYPES, SOCKET_EVENTS } from '../../constants'
import { useSocketStore } from '../../store/socket'

export function Form () {
  const { socket, loggedUser, currentChat, setCurrentChatDraft } =
    useSocketStore()

  const [contentMessage, setContentMessage] = useState<string>(currentChat.draft)
  console.log(currentChat, contentMessage)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!contentMessage) return
    const message: ServerMessage = {
      content: currentChat.draft,
      sender_id: loggedUser,
      receiver_id: currentChat.name!,
      type: MESSAGES_TYPES.TEXT,
      is_deleted: false,
      is_edited: false,
      is_read: false,
      reply_to_id: null,
      resource_url: null
    }

    socket?.emit(SOCKET_EVENTS.NEW_MESSAGE, message)
    setContentMessage('')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentMessage(event.target.value)
    setCurrentChatDraft(event.target.value)
  }

  return (
    <form
      className='flex items-center p-2 border-t w-full'
      onSubmit={handleSubmit}
    >
      <button className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground p-4 rounded-full'>
        <Emoji className='w-4 h-4' />
        <span className='sr-only'>Insert emoji</span>
      </button>
      <button className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground p-4 rounded-full mx-2'>
        <AttachFile className='w-4 h-4' />
        <span className='sr-only'>Attach file</span>
      </button>
      <input
        className='flex h-10 w-full border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-full border-0 flex-1'
        placeholder='Type a message'
        name='content'
        autoFocus
        onChange={handleChange}
        value={currentChat.draft}
      />
      <button
        type='submit'
        className='ms-2 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full w-6 h-6'
      >
        <Send className='w-5 h-5' />
        <span className='sr-only'>Send</span>
      </button>
    </form>
  )
}
