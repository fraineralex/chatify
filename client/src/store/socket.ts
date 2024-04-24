import { create } from 'zustand'
import {
  Chat,
  Chats,
  Message,
  Messages,
} from '../types/chat'
import { Socket } from 'socket.io-client'

type SocketState = {
  socket: Socket | undefined
  setSocket: (socket: Socket) => void
  setServerOffset: (serverOffset: string) => void
  messages: Messages
  setMessage: (message: Message) => void
  replaceMessage: (message: Message) => void
  chats: Chats
  setChat: (chat: Chat) => void
  replaceChat: (chat: Chat) => void
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: undefined,
  messages: [],
  chats: [],

  setSocket: socket => set({ socket }),
  setServerOffset: (serverOffset: string) => {
    const newSocket = get().socket
    if (!newSocket) return
    
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

  setChat: chat => {
    const chats = get().chats
    chats.push(chat)
    set({ chats })
  },

  replaceChat: chat => {
    const chats = get().chats
    const index = chats.findIndex(c => c.uuid === chat.uuid)
    chats[index] = chat
    set({ chats })
  },

}))
