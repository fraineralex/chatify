import { Chat } from '../components/chat'
import { Sidebar } from '../components/layout/sidebar'
import { useChatMessage } from '../hooks/useChatMessage'

export function ChatScreen () {
  const { areChatsLoaded } = useChatMessage()
  return (
    <section className='grid grid-cols-4 h-screen border rounded-lg overflow-hidden font-inter'>
      <Sidebar areChatsLoaded={areChatsLoaded} />
      <Chat />
    </section>
  )
}
