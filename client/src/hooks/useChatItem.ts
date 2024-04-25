/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useAuth0 } from "@auth0/auth0-react"
import { useChatStore } from "../store/currenChat"
import { useSocketStore } from "../store/socket"
import { ChatItem, MessagesToRead, Chat } from "../types/chat"
import { SOCKET_EVENTS } from "../constants"
import { useNewChatModalStore } from "../store/newChatModal"

const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:3000'

export function useChatItem ({ uuid, user, lastMessage, unreadMessages, createdAt, isNewChat }: ChatItem) {
    const { socket, setChat, chats } = useSocketStore()
    const { currentChat, setCurrentChat, currentChatDraft } = useChatStore()
    const { user: loggedUser } = useAuth0()
    const isCurrentChat = currentChat?.uuid === uuid
    const lastMessageDate = lastMessage?.createdAt || createdAt
    const chatExists = chats.some(chat => chat.user.id === user.id)
    const closeModal = useNewChatModalStore(state => state.closeModal)
  
    const openChat = () => {
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

    const createChat = async () => {
        if (!isNewChat || chatExists) return
        try {

            const response = await fetch(`${SERVER_DOMAIN}/chats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user1_id: loggedUser?.sub!, user2_id: user.id })
            })
        
            const newChat: Chat = await response.json()
            newChat.user = user
            
            setChat(newChat)
            setCurrentChat(newChat)
            closeModal()
        } catch (error) {
            console.log(error)
        }
    }

    return { openChat, isCurrentChat, lastMessageDate, loggedUser, chatExists, createChat}
}
