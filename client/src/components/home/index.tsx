import LoginButton from '../auth/login-button'

export default function Home () {
  return (
    <section className='flex flex-col h-screen place-items-center justify-center'>
      <h1 className='text-center text-2xl font-bold'>Welcome to Chatify!</h1>
      <p className='text-center mt-5'>Log in to start chatting!</p>
      <LoginButton />
    </section>
  )
}
