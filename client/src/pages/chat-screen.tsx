import { useState, useEffect } from 'react'
import { Chat } from '../components/chat'
import { Sidebar } from '../components/layout/sidebar'
import { useUserMetadata } from '../hooks/useUserMetadata'
import { useChatStore } from '../store/currenChat'

export function ChatScreen () {
  useUserMetadata()
  const [isMobile, setIsMobile] = useState(false)
  const currentChat = useChatStore(state => state.currentChat)

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768)
    console.log('handleResize', window.innerWidth, window.innerWidth <= 768)
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section
      className={`h-screen border rounded-lg overflow-hidden font-inter w-full ${
        !isMobile && 'grid grid-cols-7'
      }`}
    >
      {!isMobile && (
        <>
          <Sidebar />
          <Chat />
        </>
      )}
      {isMobile && (currentChat ? <Chat /> : <Sidebar />)}
    </section>
  )
}
