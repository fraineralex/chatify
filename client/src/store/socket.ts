import { create } from 'zustand'
import { CurrentChat, Message, Messages } from '../types/chat'
import { io, Socket } from 'socket.io-client'

type SocketState = {
  socket: Socket
  setServerOffset: (serverOffset: string) => void
  messages: Messages
  setMessage: (message: Message) => void
  replaceMessage: (message: Message) => void
  loggedUser: string
  currentChat: CurrentChat
  setCurrentChatName: (name: string) => void
  setCurrentChatDraft: (draft: string) => void
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
  currentChat: { name: '', draft: '' },

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

  replaceMessage: message => {
    const messages = get().messages
    const index = messages.findIndex(m => m.uuid === message.uuid)
    messages[index] = message
    set({ messages })
  },

  setCurrentChatName: name => {
    const currentChat = get().currentChat
    currentChat.name = name
    currentChat.draft = localStorage.getItem(name) || ''
    set({ currentChat })
  },
  setCurrentChatDraft: draft => {
    const currentChat = get().currentChat
    currentChat.draft = draft
    set({ currentChat })
  }
}))
