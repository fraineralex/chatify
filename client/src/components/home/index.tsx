import { GitHubStars } from './github-stars'
import { Header } from './header'
import { Hero } from './hero'

export default function Home () {
  return (
    <main className='pt-12 min-h-screen flex gap-y-20 flex-col justify-between px-8 relative'>
      <section className='absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f5f5f5,transparent_1px),linear-gradient(to_bottom,#f5f5f5,transparent_1px)] bg-[size:6rem_4rem]'>
      <div className='absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#d1ecff,transparent)]'></div>
      <GitHubStars />
      <Header />
      <Hero />
      {/* <h1 className='text-center text-2xl font-bold'>Welcome to Chatify!</h1>
      <p className='text-center mt-5'>Log in to start chatting!</p> */}
      </section>
    </main>
  )
}
