import {
  Ban,
  ChevronDown,
  EyeOff,
  MegaphoneOff,
  MessageSquareDot,
  Pin,
  Trash2
} from 'lucide-react'
import { Dropdown } from '../common/dropdown'
import { uuid } from '../../types/chat'
import { useSocketStore } from '../../store/socket'
import { useChatStore } from '../../store/currenChat'

export function ChatDropdown ({ uuid }: { uuid: uuid }) {
  const { removeChat } = useSocketStore()
  const { currentChat, setCurrentChat } = useChatStore()

  const handleDeleteChat = () => {
    removeChat(uuid)
    if (currentChat?.uuid === uuid) setCurrentChat(null)
  }

  return (
    <Dropdown Icon={<ChevronDown className='w-5 h-5' />}>
      <ul
        className='py-2 text-sm text-gray-700 dark:text-gray-200'
        aria-labelledby='dropdownDefaultButton'
      >
        <li>
          <button className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'>
            <EyeOff className='w-5 h-5 inline me-2' /> Hide chat
          </button>
        </li>
        <li>
          <button className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'>
            <MegaphoneOff className='w-5 h-5 inline me-2' /> Mute
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
          <button className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'>
            <Pin className='w-5 h-5 inline me-2' /> Pin chat
          </button>
        </li>
        <li>
          <button className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'>
            <MessageSquareDot className='w-5 h-5 inline me-2' /> Mark as unread
          </button>
        </li>
        <li>
          <button className='flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left align-middle'>
            <Ban className='w-5 h-5 inline me-2' /> Block
          </button>
        </li>
      </ul>
    </Dropdown>
  )
}
