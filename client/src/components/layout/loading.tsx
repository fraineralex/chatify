export default function Loading() {
  return (
    <section className='min-h-screen max-w-6xl md:max-w-5xl mx-auto px-4 md:px-8 text-zinc-300 animate-pulse'>
      <header className='mx-auto text-center mb-8 w-full'>
        <article className='flex items-center justify-center min-h-screen p-5 min-w-screen'>
          <div className='flex space-x-4'>
            <span className='block w-10 h-10 bg-gradient-to-tr from-indigo-500 to-teal-300 rounded-full ' />
            <span className='block w-10 h-10 bg-gradient-to-tr from-indigo-500 to-teal-300 rounded-full ' />
            <span className='block w-10 h-10 bg-gradient-to-tr from-indigo-500 to-teal-300 rounded-full ' />
          </div>
        </article>
      </header>
    </section>
  )
}