import { Message, ServerMessage } from './../types/chat.d'
import { useEffect } from 'react'
import { useSocketStore } from '../store/socket'

export const useChatMessage = () => {
  const { setMessage, socket, setServerOffset } = useSocketStore()

  useEffect(() => {
    socket?.on('chat message', (message: ServerMessage) => {
      const newMessages: Message = {
        uuid: message.uuid,
        content: message.content,
        createdAt: new Date(message.created_at),
        sender_id: {
          username: message.sender_id,
          avatar: `/${message.sender_id}.webp`
        },
        receiver_id: {
          username: message.receiver_id,
          avatar: `/${message.receiver_id}.webp`
        }
      }

      setMessage(newMessages)
      setServerOffset(message.created_at)
    })

    return () => {
      socket?.off('chat message')
    }
  }, [])
}
