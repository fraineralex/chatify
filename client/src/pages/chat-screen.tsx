import { Chat } from '../components/chat'
import { Sidebar } from '../components/layout/sidebar'

export function ChatScreen () {
  return (
    <section className='grid grid-cols-4 h-screen border rounded-lg overflow-hidden font-inter'>
      <Sidebar />
      <Chat />
    </section>
  )
}
