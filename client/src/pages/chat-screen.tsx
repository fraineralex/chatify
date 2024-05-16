import { Chat } from '../components/chat'
import { Sidebar } from '../components/layout/sidebar'
import { useUserMetadata } from '../hooks/useUserMetadata'

export function ChatScreen () {
  useUserMetadata()
  return (
    <section className='grid grid-cols-7 h-screen border rounded-lg overflow-hidden font-inter'>
      <Sidebar />
      <Chat />
    </section>
  )
}
