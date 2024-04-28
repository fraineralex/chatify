/* eslint-disable no-extra-semi */
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth0 } from '@auth0/auth0-react'
import { useSocketStore } from '../store/socket'
import { SOCKET_EVENTS } from '../constants'
import {
  Chat,
  Chats,
  Message,
  MessagesToRead,
  ServerMessage,
  uuid
} from '../types/chat'
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
    chats,
    addChat,
    setSocket,
    replaceChat
  } = useSocketStore()

  const [areChatsLoaded, setAreChatsLoaded] = useState(false)
  const serverOffset =
    messages.sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime())[0]
      ?.createdAt ?? 0

  useEffect(() => {
    ;(async () => {
      const newSocket = io(SERVER_DOMAIN, {
        auth: {
          serverOffset,
          userId: loggedUser?.sub
        }
      })

      setSocket(newSocket)
      let loadedChats: Chats | undefined = chats

      if (loadedChats.length === 0) {
        loadedChats = await getAllChats(loggedUser?.sub)
        if (!loadedChats) return

        loadedChats.forEach(chat => {
          if (chat.lastMessage) {
            chat.lastMessage = {
              ...chat.lastMessage,
              createdAt: new Date(chat.lastMessage.createdAt)
            }
          }

          addChat({
            ...chat,
            createdAt: new Date(chat.createdAt)
          })
        })

        setAreChatsLoaded(true)
      }

      newSocket.on(
        SOCKET_EVENTS.CHAT_MESSAGE,
        async (message: ServerMessage) => {
          if (messages.find(m => m.uuid === message.uuid && m.isSent)) return

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
            isSent: true,
            replyToId: message.reply_to_id,
            resourceUrl: message.resource_url
          }

          addMessage(newMessage)
          setServerOffset(new Date(message.created_at))

          let chat = loadedChats.find(c => c.uuid === newMessage.chatId)
          if (!chat) {
            chat = await getChatById(newMessage.chatId, loggedUser?.sub)
            if (!chat) return
          }

          const lastMessage =
            chat.lastMessage &&
            chat.lastMessage.createdAt.getTime() >=
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

              newSocket.emit(SOCKET_EVENTS.READ_MESSAGE, messagesToRead)
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

      newSocket.on(SOCKET_EVENTS.READ_MESSAGE, async (messagesUuid: uuid[]) => {
        if (messagesUuid.length === 0) return
        messagesUuid.forEach(async uuid => {
          const messageToReplace = messages.find(m => m.uuid === uuid)
          if (!messageToReplace) return
          messageToReplace.isRead = true
          replaceMessage(messageToReplace)

          let chat = loadedChats.find(c => c.uuid === messageToReplace.chatId)
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
        })
      })

      if (loadedChats.length > 0 && messages.length === 0) {
        newSocket?.emit(SOCKET_EVENTS.RECOVER_MESSAGES)
      }

      return () => {
        newSocket.off(SOCKET_EVENTS.CHAT_MESSAGE)
        newSocket.off(SOCKET_EVENTS.READ_MESSAGE)
      }
    })()
  }, [loggedUser])

  return { areChatsLoaded }
}
