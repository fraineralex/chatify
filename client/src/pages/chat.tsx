export function Chat () {
  return (
    <>
      <header>
        <h1 className='capitalize font-extrabold text-2xl text-black'>
          Chatify
        </h1>
      </header>
      <section className='border-2 border-black rounded-md overflow-hidden w-96 h-full relative'>
        <form>
          <input
            type='text'
            name='message'
            id='input'
            placeholder='Type a message'
            className='w-full h-12 px-4'
            autoComplete='off'
          />
          <button
            type='submit'
            className='absolute right-0 top-0 h-12 w-12 bg-black text-white'
          >
            Send
          </button>
        </form>
      </section>
    </>
  )
}
