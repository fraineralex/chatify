import { CircleCheck, X } from 'lucide-react'
import { Message } from '../../types/chat'
import Modal from '../common/modal'
import { MessageArticle } from './message-article'
import { Emoji } from '../common/svg-icons'
import { useSocketStore } from '../../store/socket'
import { useState } from 'react'

interface Props {
  isOpen: boolean
  closeModal: () => void
  message: Message
}

export function UpdateMessageModal ({ isOpen, closeModal, message }: Props) {
  const { replaceMessage } = useSocketStore()
  const [newContent, setNewContent] = useState<string>(message.content)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    replaceMessage({ ...message, content: newContent })
    closeModal()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className='bg-gray-900/70'>
      <article className='fixed inset-0 m-auto z-50 max-w-xl flex-col items-center overflow-hidden rounded-md ps-4 pe-2 py-2 shadow-2xl border bg-gray-200 lg:w-3/4 xl:w-2/3 flex h-fit'>
        <button
          className='self-end cursor-pointer hover:scale-125 ease-in-out duration-100'
          onClick={closeModal}
        >
          <X className='w-5 h-5' />
        </button>
        <h2 className='font-bold mb-5 text-xl'>Edit Message</h2>

        <MessageArticle message={message} />
        <form
          className='py-2 border-t w-full mt-5 me-2'
          onSubmit={handleSubmit}
        >
          <aside className='flex items-center space-x-3'>
            <button className='hover:scale-125 ease-in-out duration-100'>
              <Emoji className='w-5 h-5' />
              <span className='sr-only'>Insert emoji</span>
            </button>
            <input
              className='flex h-10 w-full border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-full border-0 flex-1'
              placeholder='Type a message'
              name='content'
              value={newContent ?? ''}
              onChange={e => setNewContent(e.target.value)}
              autoFocus
            />
            <button type='submit' className='hover:scale-110'>
              <CircleCheck
                className='w-10 h-10 text-gray-200'
                fill='blue'
                strokeWidth='1.5px'
              />
              <span className='sr-only'>Send</span>
            </button>
          </aside>
        </form>
      </article>
    </Modal>
  )
}
