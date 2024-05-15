import { useState, useEffect } from 'react'
import { useSocketStore } from '../store/socket'
import { Chat, Chats } from '../types/chat'

export function useFilterChats () {
  const { chats, chatFilterState } = useSocketStore()
  const [filteredChats, setFilteredChats] = useState<Chats>([])

  useEffect(() => {
    const filters: {
      [key: string]: (chat: Chat) => boolean | string | undefined | null
    } = {
      all: chat => !chat.isDeleted && !chat.isArchived && !chat.blockedBy,
      blocked: chat => !chat.isDeleted && chat.blockedBy,
      archived: chat => !chat.isDeleted && chat.isArchived,
      muted: chat => !chat.isDeleted && chat.isMuted,
      unread: chat =>
        !chat.isDeleted && (chat.unreadMessages > 0 || chat.isUnread)
    }

    if (filters[chatFilterState]) {
      setFilteredChats(chats.filter(filters[chatFilterState]))
    }
  }, [chats, chatFilterState])

  return { filteredChats }
}
