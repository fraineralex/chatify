/* eslint-disable no-extra-semi */
import { Chat, Message, ServerMessageDB } from './../types/chat.d'
import { useEffect } from 'react'
import { useSocketStore } from '../store/socket'
import { SOCKET_EVENTS } from '../constants'
import { useAuth0 } from '@auth0/auth0-react'

const API_URL = import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:3000'

export const useChatMessage = () => {
  const {
    setMessage,
    socket,
    setServerOffset,
    messages,
    replaceMessage,
    setChat
  } = useSocketStore()

  const { user: loggedUser } = useAuth0()

  useEffect(() => {
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (message: ServerMessageDB) => {
      const newMessages: Message = {
        uuid: message.uuid,
        content: message.content,
        createdAt: new Date(message.created_at),
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        chatId: message.chat_id,
        type: message.type,
        isDeleted: !!message.is_deleted,
        isEdited: !!message.is_edited,
        isRead: !!message.is_read,
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
  }, [socket])

  useEffect(() => {
    ;(async () => {
      const response = await fetch(
        `${API_URL}/chats?user_id=${loggedUser?.sub}`
      )
      const chats: Chat[] = await response.json()

      chats.forEach(chat => {
        setChat(chat)
      })
    })()
  }, [socket])
}
