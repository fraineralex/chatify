import { useState } from 'react'
import { useSocketStore } from '../store/socket'

export function useFilterChats () {
  const { chats } = useSocketStore()
  const [filteredChats, setFilteredChats] = useState(
    chats.filter(chat => !chat.isDeleted && !chat.blockedBy && !chat.isArchived)
  )

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
