/* eslint-disable no-extra-semi */
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth0 } from '@auth0/auth0-react'
import { useSocketStore } from '../store/socket'
import { SOCKET_EVENTS } from '../constants'
import {
  Chats,
  Message,
  MessagesToUpdate,
  ServerMessage,
  StaticFile,
  uuid
} from '../types/chat'
import { useChatStore } from '../store/currenChat'
import {
  getAllChats,
  getChatById,
  updateChatLastMessage
} from '../services/chat'

const SERVER_DOMAIN =
  (import.meta.env.VITE_SERVER_DOMAIN as string) ?? 'http://localhost:3000'

export const useChatMessage = () => {
  const { getCurrentChat, setCurrentChat, currentChat } = useChatStore()
  const { user: loggedUser } = useAuth0()

  const {
    addMessage,
    setServerOffset,
    messages,
    replaceMessage,
    chats,
    addChat,
    setSocket,
    replaceChat,
    userMetadata
  } = useSocketStore()

  const [areChatsLoaded, setAreChatsLoaded] = useState(false)
  const serverOffset =
    messages.sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime())[0]
      ?.createdAt ?? 0

  useEffect(() => {
    if (!userMetadata) return
    ;(async () => {
      const newSocket = io(SERVER_DOMAIN, {
        auth: {
          serverOffset,
          userId: loggedUser?.sub
        }
      })

      setSocket(newSocket)
      const loadedChats: Chats | undefined = chats
      const allChats = (await getAllChats(loggedUser?.sub)) ?? []

      if (allChats.length > 0 && loadedChats.length !== allChats?.length) {
        for (const chat of allChats) {
          if (!loadedChats.find(c => c.uuid === chat.uuid))
            loadedChats.push(chat)
          addChat(chat)
        }
      }

      setAreChatsLoaded(true)

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
            isSent: true,
            isDelivered: !!message.is_delivered,
            isRead: !!message.is_read,
            replyToId: message.reply_to_id,
            file: message.file as StaticFile,
            reactions: message.reactions ? JSON.parse(message.reactions) : null
          }

          addMessage(newMessage)
          setServerOffset(new Date(message.created_at))

          let chat = loadedChats.find(c => c.uuid === newMessage.chatId)
          let isChatFromApi = false
          if (!chat) {
            chat = await getChatById(newMessage.chatId, loggedUser?.sub)
            if (!chat) return
            isChatFromApi = true
            addChat(chat)
          }

          let unreadMessages = 0
          if (loggedUser?.sub === newMessage?.receiverId) {
            const messagesToUpdate: MessagesToUpdate = {
              chat_id: chat.uuid,
              sender_id: newMessage.senderId,
              receiver_id: newMessage.receiverId
            }
            if (getCurrentChat()?.uuid === chat.uuid) {
              newSocket.emit(SOCKET_EVENTS.READ_MESSAGE, messagesToUpdate)
            } else {
              unreadMessages = messages.filter(
                message =>
                  message.chatId === chat.uuid &&
                  !message.isRead &&
                  message.receiverId === loggedUser?.sub
              ).length
              newSocket.emit(SOCKET_EVENTS.DELIVERED_MESSAGE, messagesToUpdate)
            }
          }

          if (!isChatFromApi || chat.unreadMessages !== unreadMessages) {
            const lastMessage =
              chat.lastMessage &&
              chat.lastMessage.createdAt.getTime() >
                newMessage.createdAt.getTime()
                ? chat.lastMessage
                : newMessage

            const newChat = {
              ...chat,
              unreadMessages: unreadMessages,
              lastMessage: lastMessage
            }
            replaceChat(newChat)
            if (newChat.uuid === getCurrentChat()?.uuid) setCurrentChat(newChat)
          }
        }
      )

      newSocket.on(SOCKET_EVENTS.READ_MESSAGE, async (messagesUuid: uuid[]) => {
        if (messagesUuid.length === 0) return
        messagesUuid.forEach(async uuid => {
          const message = messages.find(m => m.uuid === uuid)
          if (!message) return
          replaceMessage({
            ...message,
            isDelivered: true,
            isRead: true
          })

          const updatedChat = await updateChatLastMessage(
            loadedChats,
            message,
            loggedUser
          )
          if (!updatedChat) return
          const unreadMessages = messages.filter(
            message =>
              message.chatId === updatedChat.uuid &&
              !message.isRead &&
              message.receiverId === loggedUser?.sub &&
              !messagesUuid.includes(message.uuid)
          ).length

          updatedChat.unreadMessages = unreadMessages
          replaceChat(updatedChat)
          if (updatedChat.uuid === getCurrentChat()?.uuid)
            setCurrentChat(updatedChat)
        })
      })

      newSocket.on(SOCKET_EVENTS.UPDATE_MESSAGE, async (message: Message) => {
        if (message.receiverId === loggedUser?.sub) replaceMessage(message)
      })

      newSocket.on(
        SOCKET_EVENTS.DELIVERED_MESSAGE,
        async (messagesUuid: uuid[]) => {
          if (messagesUuid.length === 0) return
          messagesUuid.forEach(async uuid => {
            const message = messages.find(m => m.uuid === uuid)
            if (!message) return
            message.isDelivered = true
            replaceMessage(message)

            const updatedChat = await updateChatLastMessage(
              loadedChats,
              message,
              loggedUser
            )
            if (!updatedChat) return
            replaceChat(updatedChat)
            if (updatedChat.uuid === getCurrentChat()?.uuid)
              setCurrentChat(updatedChat)
          })
        }
      )

      if (
        loadedChats.length > 0 &&
        (messages.length === 0 || serverOffset < new Date())
      ) {
        newSocket?.emit(SOCKET_EVENTS.RECOVER_MESSAGES)
      }

      return () => {
        newSocket.off(SOCKET_EVENTS.CHAT_MESSAGE)
        newSocket.off(SOCKET_EVENTS.READ_MESSAGE)
        newSocket.off(SOCKET_EVENTS.UPDATE_MESSAGE)
        newSocket.off(SOCKET_EVENTS.DELIVERED_MESSAGE)
      }
    })()
  }, [loggedUser, userMetadata])

  useEffect(() => {
    const isFileExpired = (msg: Message) =>
      msg.file && new Date(msg.file?.expiresAt).getTime() > new Date().getTime()

    if (messages.some(msg => !isFileExpired(msg))) {
      const expiredFileMsgs = messages.find(msg => isFileExpired(msg))
      console.log(expiredFileMsgs)

    }
  }, [currentChat])

  return { areChatsLoaded }
}
