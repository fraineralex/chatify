/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useAuth0 } from "@auth0/auth0-react"
import { useChatStore } from "../store/currenChat"
import { useSocketStore } from "../store/socket"
import { ChatItem, MessagesToRead, Chat, ChatDB } from "../types/chat"
import { SOCKET_EVENTS } from "../constants"

export function useChatItem ({ uuid, user, lastMessage, unreadMessages, createdAt, isNewChat }: ChatItem) {
    const { socket, setChat, chats } = useSocketStore()
    const { currentChat, setCurrentChat, currentChatDraft } = useChatStore()
    const { user: loggedUser } = useAuth0()
    const isCurrentChat = currentChat?.uuid === uuid
    const lastMessageDate = lastMessage?.createdAt || createdAt
    const chatExists = chats.some(chat => chat.user.id === user.id)
  
    const openChat = () => {
        console.log('openChat')
      if (isCurrentChat || !socket || !uuid || !createdAt) return
  
      if (currentChat) localStorage.setItem(currentChat.uuid, currentChatDraft || '')
      
      const newCurrentChat: Chat = {
        uuid,
        user,
        lastMessage,
        createdAt,
        unreadMessages: unreadMessages ?? 0
      }
      setCurrentChat(newCurrentChat)
  
      if (unreadMessages !== undefined && unreadMessages > 0) {
        const messagesToRead: MessagesToRead = {
          chat_id: uuid,
          sender_id: user.id,
          receiver_id: loggedUser?.sub
        }
        socket.emit(SOCKET_EVENTS.READ_MESSAGE, messagesToRead)
      }
    }

    const createChat = () => {
        console.log('createChat')
        if (!isNewChat || chatExists) return

        const newChatDB: ChatDB = {
            uuid: crypto.randomUUID(),
            user1_id: loggedUser?.sub!,
            user2_id: user.id,
            created_at: new Date().toISOString()
        }

        const newChat: Chat = {
            uuid: newChatDB.uuid,
            user,
            createdAt: new Date(newChatDB.created_at),
            unreadMessages: 0
        }

        setChat(newChat)
        setCurrentChat(newChat)
    }

    return { openChat, isCurrentChat, lastMessageDate, loggedUser, chatExists, createChat}
}
