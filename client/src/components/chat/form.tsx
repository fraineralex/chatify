import { useSocketStore } from '../../store/socket'
import { AttachFile, Emoji, Send } from '../general/svg-icons'

export function Form () {
  const socket = useSocketStore(state => state.socket)

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const content = formData.get('content') as string
    if (!content) return
    socket?.emit('chat message', content)
    form.reset()
  }

  return (
    <form
      className='flex items-center p-2 border-t w-full'
      onSubmit={sendMessage}
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
