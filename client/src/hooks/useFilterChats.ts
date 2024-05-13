import { useState, useEffect } from 'react'
import { useSocketStore } from '../store/socket'
import { Chat } from '../types/chat'

export function useFilterChats () {
  const { chats, chatFilterState } = useSocketStore()
  const [filteredChats, setFilteredChats] = useState<Chat[]>([])

  useEffect(() => {
    switch (chatFilterState) {
      case 'all':
        setFilteredChats(
          chats.filter(
            chat => !chat.isDeleted && !chat.isArchived && !chat.blockedBy
          )
        )
        break
      case 'blocked':
        setFilteredChats(
          chats.filter(chat => !chat.isDeleted && chat.blockedBy)
        )
        break
      case 'archived':
        setFilteredChats(
          chats.filter(chat => !chat.isDeleted && chat.isArchived)
        )
        break
      case 'muted':
        setFilteredChats(chats.filter(chat => !chat.isDeleted && chat.isMuted))
        console.log(chats.filter(chat => !chat.isDeleted && chat.isMuted))
        break
      case 'unread':
        setFilteredChats(
          chats.filter(
            chat =>
              !chat.isDeleted && (chat.unreadMessages > 0 || chat.isUnread)
          )
        )
        break
    }
  }, [chats, chatFilterState])

  return { filteredChats }
}
