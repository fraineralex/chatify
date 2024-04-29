/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useAuth0 } from '@auth0/auth0-react'
import { useChatStore } from '../store/currenChat'
import { useSocketStore } from '../store/socket'
import { Chat, ChatItem, MessagesToUpdate } from '../types/chat'
import { SOCKET_EVENTS } from '../constants'
import { useNewChatModalStore } from '../store/newChatModal'
import { createChat } from '../services/chat'

export function useChatItem ({
  uuid,
  user,
  unreadMessages,
  isNewChat
}: ChatItem) {
  const { socket, addChat: setChat, chats, removeChat } = useSocketStore()
  const { currentChat, setCurrentChat } = useChatStore()
  const { user: loggedUser } = useAuth0()
  const isCurrentChat =
    currentChat?.uuid === uuid ||
    (isNewChat && currentChat?.user.id === user.id)
  const chatExists = chats.some(chat => chat.user.id === user.id)
  const closeModal = useNewChatModalStore(state => state.closeModal)

  const handleOpenChat = async () => {
    if (isCurrentChat || !socket) return
    const newCurrentChat = chats.find(chat => chat.user.id === user.id)
    if (!newCurrentChat) return
    setCurrentChat(newCurrentChat)

    if (isNewChat) closeModal()

    if (unreadMessages !== undefined && unreadMessages > 0) {
      const messagesToRead: MessagesToUpdate = {
        chat_id: newCurrentChat.uuid,
        sender_id: user.id,
        receiver_id: loggedUser?.sub
      }

      socket.emit(SOCKET_EVENTS.READ_MESSAGE, messagesToRead)
    }
  }

  const handleCreateChat = async () => {
    if (!isNewChat || chatExists) return
    const newChat: Chat = {
      uuid: crypto.randomUUID(),
      user,
      lastMessage: undefined,
      createdAt: new Date(),
      unreadMessages: 0
    }

    setChat(newChat)
    setCurrentChat(newChat)
    closeModal()

    const newChatDB = await createChat(loggedUser?.sub, user.id, newChat.uuid)
    if (!newChatDB) {
      alert('Failed to create chat')
      removeChat(newChat.uuid)
      setCurrentChat(currentChat ?? null)
    }
  }

  return {
    handleOpenChat,
    isCurrentChat,
    loggedUser,
    chatExists,
    handleCreateChat
  }
}
