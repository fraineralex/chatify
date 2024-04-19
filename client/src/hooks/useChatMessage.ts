import { Message, ServerMessageDB } from './../types/chat.d'
import { useEffect } from 'react'
import { useSocketStore } from '../store/socket'
import { SOCKET_EVENTS } from '../constants'

export const useChatMessage = () => {
  const {
    setMessage,
    socket,
    setServerOffset,
    currentChat,
    messages,
    replaceMessage
  } = useSocketStore()

  useEffect(() => {
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (message: ServerMessageDB) => {
      const newMessages: Message = {
        uuid: message.uuid,
        content: message.content,
        createdAt: new Date(message.created_at),
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        type: message.type,
        isDeleted: !!message.is_deleted,
        isEdited: !!message.is_edited,
        isRead: currentChat.name === message.receiver_id || !!message.is_read,
        replyToId: message.reply_to_id,
        resourceUrl: message.resource_url
      }

      setMessage(newMessages)
      setServerOffset(message.created_at)
    })

    socket.on(SOCKET_EVENTS.READ_MESSAGE, (message: ServerMessageDB) => {
      const newMessage = messages.find(m => m.uuid === message.uuid)
      if (!newMessage) return
      replaceMessage({
        ...newMessage,
        isRead: true
      })
    })

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE)
      socket.off(SOCKET_EVENTS.READ_MESSAGE)
    }
  }, [])
}
