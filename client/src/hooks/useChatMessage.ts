import { ServerMessage } from './../types/chat.d'
import { useEffect } from 'react'
import { useSocketStore } from '../store/socket'

export const useChatMessage = () => {
  const { setMessage, socket, setServerOffset } = useSocketStore()

  useEffect(() => {
    socket?.on('chat message', (message: ServerMessage) => {
      const newMessages = {
        content: message.content,
        createdAt: new Date(message.created_at),
        isMe: false,
        user: {
          name: message.username,
          avatar: '/frainer.jpeg'
        }
      }

      setMessage(newMessages)
      setServerOffset(message.id)
    })

    return () => {
      socket?.off('chat message')
    }
  }, [])
}
