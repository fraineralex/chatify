import { useChatMessage } from '../../hooks/useChatMessage'
import { useSocketStore } from '../../store/socket'
import { ChatItem } from '../chat/chat-item'
import { Header } from './header'
import { Chat } from '../../types/chat'
import { useState } from 'react'
import Loading from '../chat/loading'

export function Sidebar() {
  const { areChatsLoaded } = useChatMessage()
  const { chatFilterState, setChatFilterState, chats } = useSocketStore()
  const [search, setSearch] = useState('')

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

  const notChatsText =
    chatFilterState === 'all'
      ? "🚨 You don't have any chat yet"
      : `🚨 You don't have ${chatFilterState} chat yet`

  const filteredChats = chats
    .filter(chat => chat.user.name.toLowerCase().includes(search.toLowerCase()))
    .filter(filters[chatFilterState])
    .sort((a, b) => {
      const dateA = a.lastMessage
        ? new Date(a.lastMessage.createdAt)
        : new Date(a.createdAt)
      const dateB = b.lastMessage
        ? new Date(b.lastMessage.createdAt)
        : new Date(b.createdAt)

      if (a.isPinned !== b.isPinned) {
        return b.isPinned ? 1 : -1
      }

      if (a.isPinned && b.isPinned) {
        return dateB.getTime() - dateA.getTime()
      }

      return dateB.getTime() - dateA.getTime()
    })

  return (
    <div className='border-r h-dvh md:col-span-2'>
      <Header />
      <div className='relative mb-2 w-full px-3 mt-2'>
        <input
          autoFocus
          type='text'
          className='w-full placeholder-gray-700 bg-gray-200 outline-none text-sm text-gray-800 focus:border-gray-300 rounded-lg px-2 py-2'
          placeholder='Search'
          onChange={({ target }) => setSearch(target.value)}
          value={search}
        />
        {chatFilterState !== 'all' && (
          <span className='flex place-content-center space-x-4 mt-2 text-gray-800'>
            <button
              className='bg-gray-200 py-2 px-3 rounded-full text-xs hover:bg-gray-300'
              onClick={() => setChatFilterState('all')}
            >
              Show all chats
            </button>
            <span className='bg-blue-200 py-2 px-3 rounded-full text-xs text-blue-800'>
              Showing {chatFilterState} chats
            </span>
          </span>
        )}
      </div>
      <nav className='pb-2 px-1 space-y-4 h-[90%]'>
        <ul className='overflow-y-auto scroll-smooth h-full pb-12'>
          {filteredChats.length > 0
            ? filteredChats.map((chat, index) => (
              <ChatItem key={index} {...chat} />
            ))
            : search && (
              <p className='text-center font-medium'>Chat not found</p>
            )}
          {chats.length === 0 && (
            <p className='text-center font-medium'>
              {areChatsLoaded ? notChatsText : <Loading />}
            </p>
          )}
        </ul>
      </nav>
    </div>
  )
}
