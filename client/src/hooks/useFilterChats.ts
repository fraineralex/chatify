import { useState, useEffect } from 'react'
import { useSocketStore } from '../store/socket'
import { Chat } from '../types/chat'

export function useFilterChats () {
  const { chats } = useSocketStore()
  const [filteredChats, setFilteredChats] = useState<Array<Chat>>([])

  useEffect(() => {
    setFilteredChats(
      chats.filter(
        chat => !chat.isDeleted && !chat.blockedBy && !chat.isArchived
      )
    )
  }, [chats])

  const showBlockedChats = () => {
    setFilteredChats(chats.filter(chat => !chat.isDeleted && chat.blockedBy))
  }

  const showArchivedChats = () => {
    setFilteredChats(chats.filter(chat => !chat.isDeleted && chat.isArchived))
  }

  const showMutedChats = () => {
    setFilteredChats(chats.filter(chat => !chat.isDeleted && chat.isMuted))
  }

  const showUnreadChats = () => {
    setFilteredChats(
      chats.filter(
        chat => !chat.isDeleted && (chat.unreadMessages > 0 || chat.isUnread)
      )
    )
  }

  const showAllChats = () => {
    setFilteredChats(
      chats.filter(
        chat => !chat.isDeleted && !chat.isArchived && !chat.blockedBy
      )
    )
  }

  return {
    filteredChats,
    showBlockedChats,
    showArchivedChats,
    showMutedChats,
    showUnreadChats,
    showAllChats
  }
}
