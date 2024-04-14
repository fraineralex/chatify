//import { io } from 'socket.io-client'

import { Chat } from '../components/chat'
import { Sidebar } from '../components/layout/sidebar'

export function Home () {
  //const socket = io('http://localhost:3000')
  return (
    <section className='grid grid-cols-4 h-screen border rounded-lg overflow-hidden font-inter'>
      <Sidebar />
      <Chat />
    </section>
  )
}
