import { create } from 'zustand'
import { Message, Messages } from '../types/chat'
import { io, Socket } from 'socket.io-client'

type SocketState = {
  socket: Socket
  setServerOffset: (serverOffset: number) => void
  messages: Messages
  setMessage: (message: Message) => void
}

const defaultSocket = io('http://localhost:3000', {
  auth: {
    serverOffset: 0,
    username: 'fraineralex'
  }
})

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: defaultSocket,
  messages: [],

  setServerOffset: (serverOffset: number) => {
    const newSocket = get().socket
    newSocket.auth = {
      ...newSocket.auth,
      serverOffset
    }
    console.log(serverOffset)
    set({ socket: newSocket })
  },

  setMessage: message => {
    const messages = get().messages
    messages.push(message)
    set({ messages })
  }
}))
