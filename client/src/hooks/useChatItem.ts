/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useAuth0 } from "@auth0/auth0-react"
import { useChatStore } from "../store/currenChat"
import { useSocketStore } from "../store/socket"
import { ChatItem, MessagesToRead } from "../types/chat"
import { SOCKET_EVENTS } from "../constants"
import { useNewChatModalStore } from "../store/newChatModal"
import { createChat } from "../services/chat"

export function useChatItem ({ uuid, user, lastMessage, unreadMessages, createdAt, isNewChat }: ChatItem) {
    const { socket, setChat, chats } = useSocketStore()
    const { currentChat, setCurrentChat, currentChatDraft } = useChatStore()
    const { user: loggedUser } = useAuth0()
    const isCurrentChat = currentChat?.uuid === uuid || (isNewChat && currentChat?.user.id === user.id)
    const lastMessageDate = lastMessage?.createdAt || createdAt
    const chatExists = chats.some(chat => chat.user.id === user.id)
    const closeModal = useNewChatModalStore(state => state.closeModal)
  
    const handleOpenChat = () => {
      console.log('openChat')
      if (isCurrentChat || !socket) return
      
      if (currentChat) localStorage.setItem(currentChat.uuid, currentChatDraft || '')
      const newCurrentChat = chats.find(chat => chat.user.id === user.id)
      if (!newCurrentChat) return
      setCurrentChat(newCurrentChat)

      if (isNewChat) closeModal()
  
      if (unreadMessages !== undefined && unreadMessages > 0) {
        const messagesToRead: MessagesToRead = {
          chat_id: newCurrentChat.uuid,
          sender_id: user.id,
          receiver_id: loggedUser?.sub
        }
        socket.emit(SOCKET_EVENTS.READ_MESSAGE, messagesToRead)
      }
    }

    const handleCreateChat = async () => {
        if (!isNewChat || chatExists ) return
        const newChat = await createChat(loggedUser?.sub, user.id)
        if (!newChat) return

        newChat.user = user
        setChat(newChat)
        setCurrentChat(newChat)
        closeModal()
    }

    return { openChat: handleOpenChat, isCurrentChat, lastMessageDate, loggedUser, chatExists, createChat: handleCreateChat}
}
