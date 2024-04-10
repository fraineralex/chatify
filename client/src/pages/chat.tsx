import { io } from 'socket.io-client'

export function Chat () {
  const socket = io('http://localhost:3000')
  return (
    <>
      <header>
        <h1 className='capitalize font-extrabold text-2xl text-black'>
          Chatify
        </h1>
      </header>
      <section className='border-2 border-black rounded-md overflow-hidden w-96 h-full relative'>
        <form className='bottom-0 flex h-12 left-0 p-1 absolute right-0'>
          <input
            type='text'
            name='message'
            id='input'
            placeholder='Type a message'
            className='border-2 border-black rounded-md flex m-1 pt-0 pr-2 focus:outline-none'
            autoComplete='off'
          />
          <button
            type='submit'
            className='border-0 absolute right-0 top-0 h-12 w-12 bg-black text-white rounded-md'
          >
            Send
          </button>
        </form>
      </section>
    </>
  )
}
