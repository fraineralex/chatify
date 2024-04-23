/* eslint-disable no-extra-semi */
import { useEffect } from 'react'
import { useSocketStore } from '../store/socket'
import { SOCKET_EVENTS } from '../constants'
import { useAuth0 } from '@auth0/auth0-react'
import { io } from 'socket.io-client'
import { Chat, Message, ServerMessageDB } from '../types/chat'

const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:3000'

export const useChatMessage = () => {
  const {
    setMessage,
    setServerOffset,
    messages,
    replaceMessage,
    setChat,
    setSocket,
    chats,
    replaceChat,
  } = useSocketStore()

  const { user: loggedUser } = useAuth0()

  useEffect(() => {
    const newsocket = io(SERVER_DOMAIN, {
      auth: {
        serverOffset: 0,
        userId: loggedUser?.sub
      }
    })

    setSocket(newsocket)

    newsocket.on(SOCKET_EVENTS.CHAT_MESSAGE, (message: ServerMessageDB) => {
      const newMessage: Message = {
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

      setMessage(newMessage)
      setServerOffset(message.created_at)

      const chat = chats.find(c => c.uuid === newMessage.chatId)
      if (!chat) return

      const unreadMessages = loggedUser?.sub === newMessage?.receiverId 
        ? chat.unreadMessages + 1 
        : 0

      const newChat: Chat = {
        uuid: chat.uuid,
        lastMessage: newMessage,
        user: chat.user,
        createdAt: chat.createdAt,
        unreadMessages
      }

      replaceChat(newChat)
    })

    newsocket.on(SOCKET_EVENTS.READ_MESSAGE, (message: ServerMessageDB) => {
      const newMessage = messages.find(m => m.uuid === message.uuid)
      if (!newMessage) return
      replaceMessage({
        ...newMessage,
        isRead: true
      })
    })

    return () => {
      newsocket.off(SOCKET_EVENTS.CHAT_MESSAGE)
      newsocket.off(SOCKET_EVENTS.READ_MESSAGE)
    }
  }, [loggedUser])

  useEffect(() => {
    ;(async () => {
      const response = await fetch(
        `${SERVER_DOMAIN}/chats?user_id=${loggedUser?.sub}`
      )
      const chats: Chat[] = await response.json()

      chats.forEach(chat => {
        setChat(chat)
      })
    })()
  }, [loggedUser])
}
