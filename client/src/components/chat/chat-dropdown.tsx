import {
  LockKeyhole,
  LockKeyholeOpen,
  ChevronDown,
  Eye,
  EyeOff,
  Megaphone,
  MegaphoneOff,
  MessageSquare,
  MessageSquareDot,
  Pin,
  PinOff,
  Trash2
} from 'lucide-react'
import { Dropdown } from '../common/dropdown'
import { MessagesToUpdate, uuid } from '../../types/chat'
import { useSocketStore } from '../../store/socket'
import { useChatStore } from '../../store/currenChat'
import React from 'react'
import { toggleChatBlock } from '../../services/chat'
import { useAuth0 } from '@auth0/auth0-react'
import { SOCKET_EVENTS } from '../../constants'
import { updateUserMetadata } from '../../services/user'

export function ChatDropdown ({ uuid }: { uuid: uuid }) {
  const { chats, replaceChat, socket, userMetadata, setUserMetadata } =
    useSocketStore()
  const { currentChat, setCurrentChat } = useChatStore()
  const { user } = useAuth0()
  const chat = chats.find(chat => chat.uuid === uuid)
  if (!chat || !userMetadata || !user) return null

  const handleDeleteChat = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()
    replaceChat({
      ...chat,
      isDeleted: !chat.isDeleted,
      cleaned: new Date(),
      isPinned: false,
      isMuted: false,
      isArchived: false,
      isUnread: false
    })

    if (currentChat?.uuid === uuid) setCurrentChat(null)

    const deleteChats = chat.isDeleted
      ? userMetadata.chat_preferences.deleted.filter(uuid => uuid !== chat.uuid)
      : [...userMetadata.chat_preferences.deleted, chat.uuid]

    const newChatPreferences = {
      ...userMetadata.chat_preferences,
      deleted: deleteChats,
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
      user.sub ?? ''
    )

    if (response.status !== 200) {
      setUserMetadata({ chat_preferences: userMetadata.chat_preferences })
      replaceChat({ ...chat })
      if (currentChat?.uuid === uuid) setCurrentChat(currentChat)

      return console.log(response.statusText)
    }
  }

  const handleTogglePinChat = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()

    replaceChat({
      ...chat,
      isPinned: !chat.isPinned
    })

    const pinnedChats = chat.isPinned
      ? userMetadata.chat_preferences.pinned.filter(uuid => uuid !== chat.uuid)
      : [...userMetadata.chat_preferences.pinned, chat.uuid]

    setUserMetadata({
      chat_preferences: {
        ...userMetadata.chat_preferences,
        pinned: pinnedChats
      }
    })

    const response = await updateUserMetadata(
      {
        chat_preferences: {
          ...userMetadata.chat_preferences,
          pinned: pinnedChats
        }
      },
      user.sub ?? ''
    )

    if (response.status !== 200) {
      setUserMetadata({ chat_preferences: userMetadata.chat_preferences })
      replaceChat({ ...chat })
      if (currentChat?.uuid === uuid) setCurrentChat(currentChat)

      return console.log(response.statusText)
    }
  }

  const handleToggleHideChat = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()
    replaceChat({
      ...chat,
      isArchived: !chat.isArchived
    })

    const hiddenChats = chat.isArchived
      ? userMetadata.chat_preferences.archived.filter(
          uuid => uuid !== chat.uuid
        )
      : [...userMetadata.chat_preferences.archived, chat.uuid]

    setUserMetadata({
      chat_preferences: {
        ...userMetadata.chat_preferences,
        archived: hiddenChats
      }
    })

    const response = await updateUserMetadata(
      {
        chat_preferences: {
          ...userMetadata.chat_preferences,
          archived: hiddenChats
        }
      },
      user.sub ?? ''
    )

    if (response.status !== 200) {
      setUserMetadata({ chat_preferences: userMetadata.chat_preferences })
      replaceChat({ ...chat })
      if (currentChat?.uuid === uuid) setCurrentChat(currentChat)

      return console.log(response.statusText)
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
      user.sub ?? ''
    )

    if (response.status !== 200) {
      setUserMetadata({ chat_preferences: userMetadata.chat_preferences })
      replaceChat({ ...chat })
      if (currentChat?.uuid === uuid) setCurrentChat(currentChat)

      return console.log(response.statusText)
    }
  }

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

    if (currentChat?.uuid === uuid) setCurrentChat(null)

    const response = await toggleChatBlock(
      chat.uuid,
      chat.blockedBy ? undefined : user?.sub
    )

    if (response.status !== 200) {
      replaceChat({ ...chat })
      if (currentChat?.uuid === uuid) setCurrentChat(currentChat)

      return console.error(response.statusText)
    }
  }

  const handleToggleReadChat = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()
    if (!user) return

    if (chat.unreadMessages > 0) {
      const messagesToUpdate: MessagesToUpdate = {
        chat_id: chat.uuid,
        sender_id: user.sub!,
        receiver_id: chat.user.id
      }
      return socket?.emit(SOCKET_EVENTS.READ_MESSAGE, messagesToUpdate)
    }

    replaceChat({
      ...chat,
      isUnread: !chat.isUnread
    })
  }

  return (
    <Dropdown Icon={<ChevronDown className='w-5 h-5' />}>
      <ul
        className='py-2 text-sm text-gray-700 dark:text-gray-200'
        aria-labelledby='dropdownDefaultButton'
      >
        <li>
          <button
            className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
            onClick={handleToggleHideChat}
          >
            {chat.isArchived ? (
              <>
                <Eye className='w-5 h-5 inline me-2' />
                Show
              </>
            ) : (
              <>
                <EyeOff className='w-5 h-5 inline me-2' />
                Hide
              </>
            )}
          </button>
        </li>
        <li>
          <button
            className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
            onClick={handleToggleMuteChat}
          >
            {chat.isMuted ? (
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
            className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
            onClick={handleDeleteChat}
          >
            <Trash2 className='w-5 h-5 inline me-2' /> Delete chat
          </button>
        </li>
        <li>
          <button
            className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
            onClick={handleTogglePinChat}
          >
            {chat.isPinned ? (
              <>
                <PinOff className='w-5 h-5 inline me-2' />
                Unpin chat
              </>
            ) : (
              <>
                <Pin className='w-5 h-5 inline me-2' /> Pin chat
              </>
            )}
          </button>
        </li>
        <li>
          <button
            className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
            onClick={handleToggleReadChat}
          >
            {chat.unreadMessages > 0 || chat.isUnread ? (
              <>
                <MessageSquare className='w-5 h-5 inline me-2' />
                Mark as read
              </>
            ) : (
              <>
                <MessageSquareDot className='w-5 h-5 inline me-2' />
                Mark as unread
              </>
            )}
          </button>
        </li>
        <li>
          <button
            className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'
            onClick={handleToggleBlockChat}
          >
            {chat.blockedBy === user?.sub ? (
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
  )
}
