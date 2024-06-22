import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth0 } from '@auth0/auth0-react'
import { useSocketStore } from '../store/socket'
import { MESSAGES_TYPES, SOCKET_EVENTS } from '../constants'
import { Chats, Message, MessagesToUpdate, uuid } from '../types/chat'
import { useChatStore } from '../store/currenChat'
import {
  getAllChats,
  getChatById,
  getSignedUrls,
  updateChatLastMessage
} from '../services/chat'

const SERVER_URL =
  (import.meta.env.VITE_SERVER_URL as string) ?? 'http://localhost:3000'

export const useChatMessage = () => {
  const { getCurrentChat, setCurrentChat, currentChat } = useChatStore()
  const { user: loggedUser, getAccessTokenSilently } = useAuth0()

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
  const lastMsgOffset = messages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const serverOffset = new Date(lastMsgOffset[0]?.createdAt ?? 0)

  useEffect(() => {
    if (!userMetadata || currentChat === null) return
    ;(async () => {
      const newSocket = io(SERVER_URL, {
        auth: {
          serverOffset,
          token: await getAccessTokenSilently()
        }
      })

      setSocket(newSocket)
      const loadedChats: Chats | undefined = chats
      const allChats = (await getAllChats(await getAccessTokenSilently())) ?? []

      if (allChats.length > 0 && loadedChats.length !== allChats?.length) {
        for (const chat of allChats) {
          if (!loadedChats.find(c => c.uuid === chat.uuid))
            loadedChats.push(chat)
          addChat(chat)
        }
      }

      setAreChatsLoaded(true)

      newSocket.on(SOCKET_EVENTS.CHAT_MESSAGE, async (message: Message) => {
        if (messages.find(m => m.uuid === message.uuid && m.isSent)) return

        message.isSent = true

        addMessage(message)
        setServerOffset(new Date(message.createdAt))

        let chat = loadedChats.find(c => c.uuid === message.chatId)
        let isChatFromApi = false
        if (!chat) {

          chat = await getChatById(
            message.chatId,
            await getAccessTokenSilently()
          )
          if (!chat) return
          isChatFromApi = true
          addChat(chat)
        }

        let unreadMessages = 0
        if (loggedUser?.sub === message?.receiverId) {
          const messagesToUpdate: MessagesToUpdate = {
            chatId: chat.uuid,
            senderId: message.senderId,
            receiverId: message.receiverId
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
            new Date(chat.lastMessage.createdAt).getTime() >
              new Date(message.createdAt).getTime()
              ? chat.lastMessage
              : message

          const newChat = {
            ...chat,
            unreadMessages: unreadMessages,
            lastMessage: lastMessage
          }
          replaceChat(newChat)
          if (newChat.uuid === getCurrentChat()?.uuid) setCurrentChat(newChat)
        }
      })

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
            await getAccessTokenSilently()
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
              await getAccessTokenSilently()
            )
            if (!updatedChat) return
            replaceChat(updatedChat)
            if (updatedChat.uuid === getCurrentChat()?.uuid)
              setCurrentChat(updatedChat)
          })
        }
      )

      newSocket.on(SOCKET_EVENTS.CONNECT_ERROR, async error => {
        if (error.message === 'unauthorized') {
          newSocket.auth = {
            ...newSocket.auth,
            token: await getAccessTokenSilently()
          }
          newSocket.connect()
        } else {
          console.log(error.message)
          alert(error)
        }
      })

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
        newSocket.off(SOCKET_EVENTS.CONNECT_ERROR)
      }
    })()
  }, [loggedUser, userMetadata, getAccessTokenSilently])

  useEffect(() => {
    if (!currentChat) return
    ;(async () => {
      const isFileExpired = (msg: Message) =>
        msg.chatId === currentChat.uuid &&
        !msg.isDeleted &&
        msg.file &&
        msg.file.expiresAt &&
        new Date(msg.file?.expiresAt).getTime() <= new Date().getTime()

				console.log(messages.filter(m => m.type === MESSAGES_TYPES.IMAGE))
      if (messages.some(msg => isFileExpired(msg))) {
        const expiredFileUUIDs = messages
          .filter(msg => isFileExpired(msg))
          .map(msg => msg.uuid)

        const updatedSignedUrls = await getSignedUrls(
          expiredFileUUIDs,
          await getAccessTokenSilently()
        )

        for (const signedFile of updatedSignedUrls) {
          const message = messages.find(msg => msg.uuid === signedFile.uuid)
          if (!message) return
          message.file = signedFile.file
          replaceMessage(message)
        }
      }
    })()
  }, [currentChat])

  return { areChatsLoaded }
}
