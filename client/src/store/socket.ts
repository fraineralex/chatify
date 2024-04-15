import { create } from 'zustand'
import { Message, Messages } from '../types/chat'
import { io, Socket } from 'socket.io-client'

type SocketState = {
  socket: Socket
  setServerOffset: (serverOffset: string) => void
  messages: Messages
  setMessage: (message: Message) => void
  loggedUser: string
  currentChat?: string
  setCurrentChat: (chat: string) => void
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
  loggedUser: 'fraineralex',
  currentChat: undefined,

  setServerOffset: (serverOffset: string) => {
    const newSocket = get().socket
    newSocket.auth = {
      ...newSocket.auth,
      serverOffset
    }
    set({ socket: newSocket })
  },

  setMessage: message => {
    const messages = get().messages
    messages.push(message)
    set({ messages })
  },

  setCurrentChat: chat => set({ currentChat: chat })
}))
