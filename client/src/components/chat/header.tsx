import {
  EllipsisVertical,
  Eraser,
  FileText,
  Image,
  ListFilter,
  LockKeyhole,
  LockKeyholeOpen,
  Megaphone,
  MegaphoneOff,
  Search,
  X
} from 'lucide-react'
import { Dropdown } from '../common/dropdown'
import { useChatStore } from '../../store/currenChat'
import { useAuth0 } from '@auth0/auth0-react'
import { useSocketStore } from '../../store/socket'
import { toggleChatBlock } from '../../services/chat'
import { updateUserMetadata } from '../../services/user'
import { MessageFilter } from '../../types/chat'

interface Props {
  name: string
  picture: string
  messageFilter: MessageFilter
  setMessageFilter: (state: MessageFilter) => void
}

export function Header ({
  name,
  picture,
  messageFilter,
  setMessageFilter
}: Props) {
  const { currentChat, setCurrentChat } = useChatStore()
  const { replaceChat, chats, userMetadata, setUserMetadata } = useSocketStore()
  const chat = chats.find(chat => chat.uuid === currentChat?.uuid)
  if (!chat || !userMetadata) return null
  const user = useAuth0().user

  const handleToggleBlockChat = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()

    replaceChat({
      ...chat,
      blockedBy: chat.blockedBy ? null : user?.sub,
      isMuted: false,
      isArchived: false,
      isPinned: false,
      isUnread: false,
      isDeleted: false
    })

    setCurrentChat(null)

    const response = await toggleChatBlock(
      chat.uuid,
      chat.blockedBy ? undefined : user?.sub
    )

    if (response.status !== 200) {
      replaceChat({ ...chat })
      setCurrentChat(currentChat)

      return console.error(response.statusText)
    }
  }

  const handleToggleMuteChat = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()

    replaceChat({
      ...chat,
      isMuted: !chat.isMuted
    })

    const muttedChats = chat.isMuted
      ? userMetadata.chat_preferences.muted.filter(uuid => uuid !== chat.uuid)
      : [...userMetadata.chat_preferences.muted, chat.uuid]

    setUserMetadata({
      chat_preferences: {
        ...userMetadata.chat_preferences,
        muted: muttedChats
      }
    })

    const response = await updateUserMetadata(
      {
        chat_preferences: {
          ...userMetadata.chat_preferences,
          muted: muttedChats
        }
      },
      user?.sub ?? ''
    )

    if (response.status !== 200) {
      setUserMetadata({ chat_preferences: userMetadata.chat_preferences })
      replaceChat({ ...chat })
      setCurrentChat(currentChat)

      return console.log(response.statusText)
    }
  }

  const handleClearChat = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()
    replaceChat({
      ...chat,
      cleaned: new Date()
    })

    const newChatPreferences = {
      ...userMetadata.chat_preferences,
      cleaned: {
        ...userMetadata.chat_preferences.cleaned,
        [chat.uuid]: new Date().toISOString()
      }
    }

    setUserMetadata({
      chat_preferences: newChatPreferences
    })
    const response = await updateUserMetadata(
      {
        chat_preferences: newChatPreferences
      },
      user?.sub ?? ''
    )

    if (response.status !== 200) {
      setUserMetadata({ chat_preferences: userMetadata.chat_preferences })
      replaceChat({ ...chat })

      return console.log(response.statusText)
    }
  }

  const updateMessageFilter = (filter: 'media' | 'files' | null) => () => {
    if (!filter) return setMessageFilter(null)
    if (!messageFilter) return setMessageFilter([filter])

    if (messageFilter?.includes(filter))
      return setMessageFilter(messageFilter.filter(f => f !== filter))

    setMessageFilter([...messageFilter, filter])
  }

  return (
    <header className='flex border-b py-3 justify-between'>
      <article className='flex gap-2'>
        <img
          src={picture}
          width='40'
          height='40'
          alt={`Contact avatar of ${name}`}
          className='rounded-full'
          style={{ aspectRatio: 36 / 36, objectFit: 'cover' }}
        />
        <h2 className='text-base font-bold my-auto'>{name}</h2>
      </article>
      <aside className='flex'>
        <Search className='w-5 h-5 mt-3' />
        <Dropdown
          Icon={<ListFilter className='w-5 h-5 mt-3' />}
          buttonClassName='hover:scale-110 hover:contrast-200 align-middle ps-6'
          dropdownClassName='right-16 mt-2'
        >
          <ul
            className='py-2 text-sm text-gray-700 dark:text-gray-200'
            aria-labelledby='dropdownDefaultButton'
          >
            <li>
              <button
                className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                title='Shared photos & videos'
                aria-label='Shared photos & videos'
                onClick={updateMessageFilter('media')}
                disabled={messageFilter?.includes('media')}
              >
                <Image className='w-5 h-5 inline me-2' /> Photos & videos
              </button>
            </li>
            <li>
              <button
                title='Shared files'
                aria-label='Shared files'
                className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                onClick={updateMessageFilter('files')}
                disabled={messageFilter?.includes('files')}
              >
                <FileText className='w-5 h-5 inline me-2' /> Shared files
              </button>
            </li>
          </ul>
        </Dropdown>
        <Dropdown
          Icon={<EllipsisVertical className='w-5 h-5 mt-3 me-5' />}
          buttonClassName='hover:scale-110 hover:contrast-200 align-middle ps-6'
          dropdownClassName='right-9 mt-2'
        >
          <ul
            className='py-2 text-sm text-gray-700 dark:text-gray-200'
            aria-labelledby='dropdownDefaultButton'
          >
            <li>
              <button
                className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                title='Close chat'
                aria-label='Close chat'
                onClick={() => setCurrentChat(null)}
              >
                <X className='w-5 h-5 inline me-2' /> Close chat
              </button>
            </li>
            <li>
              <button
                title='Clear chat'
                aria-label='Clear chat'
                className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                onClick={handleClearChat}
              >
                <Eraser className='w-5 h-5 inline me-2' /> Clear chat
              </button>
            </li>
            <li>
              <button
                title={`${chat?.isMuted ? 'Unmute' : 'Mute'} chat`}
                aria-label={`${chat?.isMuted ? 'Unmute' : 'Mute'} chat`}
                className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                onClick={handleToggleMuteChat}
              >
                {chat?.isMuted ? (
                  <>
                    <Megaphone className='w-5 h-5 inline me-2' />
                    Unmute
                  </>
                ) : (
                  <>
                    <MegaphoneOff className='w-5 h-5 inline me-2' />
                    Mute
                  </>
                )}
              </button>
            </li>
            <li>
              <button
                title='Block/Unblock chat'
                aria-label='Block/Unblock chat'
                className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
                onClick={handleToggleBlockChat}
              >
                {chat?.blockedBy === user?.sub ? (
                  <>
                    <LockKeyholeOpen className='w-5 h-5 inline me-2' />
                    Unblock user
                  </>
                ) : (
                  <>
                    <LockKeyhole className='w-5 h-5 inline me-2' />
                    Block user
                  </>
                )}
              </button>
            </li>
          </ul>
        </Dropdown>
      </aside>
    </header>
  )
}
