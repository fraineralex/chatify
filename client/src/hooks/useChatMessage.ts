/* eslint-disable no-extra-semi */
import { useEffect, useState } from 'react'
import { useSocketStore } from '../store/socket'
import { SOCKET_EVENTS } from '../constants'
import { useAuth0 } from '@auth0/auth0-react'
import { io } from 'socket.io-client'
import { Chat, Message, MessagesToRead, ServerMessageDB } from '../types/chat'
import { useChatStore } from '../store/currenChat'
import { getAllChats, getChatById } from '../services/chat'

const SERVER_DOMAIN =
  (import.meta.env.VITE_SERVER_DOMAIN as string) ?? 'http://localhost:3000'

export const useChatMessage = () => {
  const { getCurrentChat } = useChatStore()
  const { user: loggedUser } = useAuth0()

  const {
    addMessage,
    setServerOffset,
    messages,
    replaceMessage,
    addChat: setChat,
    setSocket,
    socket,
    chats,
    replaceChat
  } = useSocketStore()

  const [areChatsLoaded, setAreChatsLoaded] = useState(false)
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  useEffect(() => {
    const newSocket = io(SERVER_DOMAIN, {
      auth: {
        serverOffset:
          (socket?.auth as { serverOffset?: number })?.serverOffset ?? 0,
        userId: loggedUser?.sub
      }
    })

    setSocket(newSocket)
    setIsSocketConnected(true)
    ;(async () => {
      const chats = await getAllChats(loggedUser?.sub)
      if (!chats) return

      chats.forEach(chat => {
        if (chat.lastMessage) {
          chat.lastMessage = {
            ...chat.lastMessage,
            createdAt: new Date(chat.lastMessage.createdAt)
          }
        }
        setChat({
          ...chat,
          createdAt: new Date(chat.createdAt)
        })
      })

      setAreChatsLoaded(true)
    })()
  }, [loggedUser])

  useEffect(() => {
    if (!areChatsLoaded || !isSocketConnected || !socket) return
    console.log('use Effect executed')
    ;(async () => {
      socket.on(
        SOCKET_EVENTS.CHAT_MESSAGE,
        async (message: ServerMessageDB) => {
          if (messages.find(m => m.uuid === message.uuid)) return
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

          addMessage(newMessage)
          setServerOffset(new Date(message.created_at))

          let chat = chats.find(c => c.uuid === newMessage.chatId)
          if (!chat) {
            chat = await getChatById(newMessage.chatId, loggedUser?.sub)
            if (!chat) return
          }

          const lastMessage =
            chat.lastMessage &&
            chat.lastMessage.createdAt.getTime() >
              newMessage.createdAt.getTime()
              ? chat.lastMessage
              : newMessage

          chat.lastMessage = lastMessage

          let unreadMessages = 0
          if (loggedUser?.sub === newMessage?.receiverId) {
            if (getCurrentChat()?.uuid === chat.uuid) {
              const messagesToRead: MessagesToRead = {
                chat_id: chat.uuid,
                sender_id: newMessage.senderId,
                receiver_id: newMessage.receiverId
              }

              socket.emit(SOCKET_EVENTS.READ_MESSAGE, messagesToRead)
            } else {
              unreadMessages = !newMessage.isRead
                ? chat.unreadMessages + 1
                : unreadMessages
            }
          }

          const newChat: Chat = {
            uuid: chat.uuid,
            lastMessage,
            user: chat.user,
            createdAt: chat.createdAt,
            unreadMessages
          }

          replaceChat(newChat)
        }
      )

      socket.on(
        SOCKET_EVENTS.READ_MESSAGE,
        async (message: ServerMessageDB) => {
          const messageToReplace = messages.find(m => m.uuid === message.uuid)
          if (!messageToReplace) return
          messageToReplace.isRead = true
          replaceMessage(messageToReplace)

          let chat = chats.find(c => c.uuid === messageToReplace.chatId)
          if (!chat) {
            chat = await getChatById(messageToReplace.chatId, loggedUser?.sub)
          }

          if (!chat || chat.lastMessage?.uuid !== messageToReplace.uuid) return

          const newChat: Chat = {
            uuid: chat.uuid,
            lastMessage:
              chat.lastMessage &&
              chat.lastMessage.createdAt.getTime() >
                messageToReplace.createdAt.getTime()
                ? chat.lastMessage
                : messageToReplace,
            user: chat.user,
            createdAt: chat.createdAt,
            unreadMessages: chat.unreadMessages - 1
          }

          replaceChat(newChat)
        }
      )

      return () => {
        socket.off(SOCKET_EVENTS.CHAT_MESSAGE)
        socket.off(SOCKET_EVENTS.READ_MESSAGE)
      }
    })()
  }, [areChatsLoaded])

  useEffect(() => {
    if (!socket || !areChatsLoaded) return

    socket.emit(SOCKET_EVENTS.RECOVER_MESSAGES)
  }, [areChatsLoaded])

  return { areChatsLoaded }
}
