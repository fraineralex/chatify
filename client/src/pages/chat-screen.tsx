import { useState, useEffect } from 'react'
import { Chat } from '../components/chat'
import { Sidebar } from '../components/layout/sidebar'
import { useUserMetadata } from '../hooks/useUserMetadata'
import { useChatStore } from '../store/currenChat'

export function ChatScreen() {
  useUserMetadata()
  const [isMobile, setIsMobile] = useState(false)
  const currentChat = useChatStore(state => state.currentChat)

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 768px)')
    const handleResize = () => setIsMobile(mobileMediaQuery.matches)

    handleResize()
    mobileMediaQuery.addEventListener('change', handleResize)
    
    return () => mobileMediaQuery.removeEventListener('change', handleResize)
  }, [])

  return (
    <section
      className={`h-dvh border rounded-lg overflow-hidden font-inter w-full ${!isMobile && 'grid grid-cols-7'
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
