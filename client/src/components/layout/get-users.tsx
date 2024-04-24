import { EllipsisVertical, SquarePen } from 'lucide-react'
import Modal from '../common/modal'
import { useEffect, useState } from 'react'
import { useChatStore } from '../../store/currenChat'
import { User } from '../../types/chat'

const SERVER_DOMAIN =
  import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:3000'

export function GetUsersModal () {
  const currentChat = useChatStore(state => state.currentChat)
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])

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
              {users.map((user, index) => (
                <li
                  key={index}
                  className={`flex items-center space-x-2  border border-transparent border-b-gray-300 cursor-pointer px-2 py-2 w-full ${
                    currentChat?.user.id === user.id
                      ? 'bg-gray-300 rounded-md'
                      : 'rounded-sm hover:bg-gray-200 hover:rounded-md'
                  }`}
                  onClick={() => {}}
                >
                  <img
                    src={user.picture}
                    width='50'
                    height='50'
                    alt={`Chat avatar of ${user.name}`}
                    className='rounded-full'
                    style={{ aspectRatio: 50 / 50, objectFit: 'cover' }}
                  />
                  <article className='items-center text-left w-full'>
                    <div className='flex overflow-hidden text-left flex-grow w-full justify-between'>
                      <h2 className='text-base font-medium inline-flex overflow-hidden items-center'>
                        {user.name}
                      </h2>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </Modal>
    </>
  )
}
