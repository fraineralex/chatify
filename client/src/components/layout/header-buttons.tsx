import {
  EllipsisVertical,
  MegaphoneOff,
  MessageSquareDot,
  SquarePlus,
  LogOut,
  Settings,
  EyeOff,
  Lock
} from 'lucide-react'
import Modal from '../common/modal'
import { useEffect, useState } from 'react'
import { User } from '../../types/chat'
import { ChatItem } from '../chat/chat-item'
import { useAuth0 } from '@auth0/auth0-react'
import { useNewChatModalStore } from '../../store/newChatModal'
import { getAllUsers } from '../../services/user'
import { useSocketStore } from '../../store/socket'
import { Dropdown } from '../common/dropdown'

export function HeaderButtons () {
  const { isOpen, closeModal, openModal } = useNewChatModalStore()
  const [users, setUsers] = useState<User[]>([])
  const { user: loggedUser, logout } = useAuth0()

  const { chats, setChatFilterState, chatFilterState } = useSocketStore()

  const toggleBlockedChats = () => {
    chatFilterState === 'blocked'
      ? setChatFilterState('all')
      : setChatFilterState('blocked')
  }

  const toggleArchivedChats = () => {
    chatFilterState === 'archived'
      ? setChatFilterState('all')
      : setChatFilterState('archived')
  }

  const toggleMutedChats = () => {
    chatFilterState === 'muted'
      ? setChatFilterState('all')
      : setChatFilterState('muted')
  }

  const toggleUnreadChats = () => {
    chatFilterState === 'unread'
      ? setChatFilterState('all')
      : setChatFilterState('unread')
  }

  useEffect(() => {
    if (!open) return
    ;(async () => {
      const users = await getAllUsers()
      setUsers(users ?? [])
    })()
  }, [open])

  return (
    <>
      <aside className='flex items-center justify-between px-3 py-2 flex-row-reverse text-gray-700 space-x-7'>
        <Dropdown
          Icon={<EllipsisVertical className='w-5 h-5' />}
          buttonClassName='hover:scale-110 hover:contrast-200 align-middle ps-6'
        >
          <ul
            className='py-2 text-sm text-gray-700 dark:text-gray-200'
            aria-labelledby='dropdownDefaultButton'
          >
            <li>
              <button
                className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                title='Blocked Chats'
                aria-label='Blocked Chats'
                onClick={toggleBlockedChats}
              >
                <Lock className='w-5 h-5 inline me-2' /> Blocked Chats
              </button>
            </li>
            <li>
              <button
                title='Log out'
                aria-label='Log out'
                className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                onClick={() => logout()}
              >
                <LogOut className='w-5 h-5 inline me-2' /> Log out
              </button>
            </li>
            <li>
              <button
                title='Settings'
                aria-label='Settings'
                className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
              >
                <Settings className='w-5 h-5 inline me-2' /> Settings
              </button>
            </li>
          </ul>
        </Dropdown>
        <button
          title='New Chat'
          aria-label='New Chat'
          className={`hover:scale-110 hover:contrast-200 ${
            chats.length === 0
              ? 'text-blue-700 animate-pulse duration-300 ease-in-out'
              : 'text-gray-700'
          }`}
        >
          <SquarePlus className='w-5 h-5' onClick={openModal} />
        </button>
        <button
          className={`hover:scale-110 hover:contrast-200 ${
            chatFilterState === 'unread' ? 'text-blue-700' : 'text-gray-700'
          }`}
          title='Unread Chats'
          aria-label='Unread Chats'
          onClick={toggleUnreadChats}
        >
          <MessageSquareDot className='w-5 h-5' />
        </button>
        <button
          className={`hover:scale-110 hover:contrast-200 ${
            chatFilterState === 'archived' ? 'text-blue-700' : 'text-gray-700'
          }`}
          title='Hidden Chats'
          aria-label='Hidden Chats'
          onClick={toggleArchivedChats}
        >
          <EyeOff className='w-5 h-5' />
        </button>
        <button
          className={`hover:scale-110 hover:contrast-200 ${
            chatFilterState === 'muted' ? 'text-blue-700' : 'text-gray-700'
          }`}
          title='Muted Chats'
          aria-label='Muted Chats'
          onClick={toggleMutedChats}
        >
          <MegaphoneOff className='w-5 h-5' />
        </button>
      </aside>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <article className='fixed left-60 top-0 z-50 mx-2 mt-14 max-w-[400px] flex-col items-center overflow-hidden rounded-md px-4 py-6 shadow-2xl border bg-gray-200 lg:w-3/4 xl:w-2/3 md:max-h-50 max-h-132 flex'>
          <h2 className='font-bold self-start mb-1'>New Chat</h2>
          <div className='relative mb-2 w-full md:mb-4'>
            <input
              autoFocus
              type='text'
              className='w-full placeholder-gray-700 bg-transparent border outline-none disabled:bg-gray-400 text-gray-800 border-gray-500 focus:bg-gray-300 focus:border-gray-300  focus:border-2 rounded-xl px-3 py-1'
              placeholder='Start typing to search'
            />
          </div>
          <nav className='self-start w-full'>
            <ul className='space-y-1'>
              {users
                .filter(user => user.id !== loggedUser?.sub)
                .map((user, index) => (
                  <ChatItem key={index} user={user} isNewChat />
                ))}
            </ul>
          </nav>
        </article>
      </Modal>
    </>
  )
}
