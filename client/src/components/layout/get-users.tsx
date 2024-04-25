import { EllipsisVertical, SquarePen } from 'lucide-react'
import Modal from '../common/modal'
import { useEffect, useState } from 'react'
import { User } from '../../types/chat'
import { ChatItem } from '../chat/chat-item'
import { useAuth0 } from '@auth0/auth0-react'

const SERVER_DOMAIN =
  import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:3000'

export function GetUsersModal () {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const loggedUser = useAuth0().user

  useEffect(() => {
    if (!open) return
    ;(async () => {
      const response = await fetch(`${SERVER_DOMAIN}/users`)
      setUsers(await response.json())
    })()
  }, [open])

  return (
    <>
      <aside className='flex items-center justify-between px-3 py-2'>
        <button className='px-2 text-gray-700'>
          <SquarePen className='w-5 h-5' onClick={() => setOpen(!open)} />
        </button>
        <button className='ps-2 text-gray-700'>
          <EllipsisVertical className='w-5 h-5' />
        </button>
      </aside>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
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
