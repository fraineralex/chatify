import { create } from 'zustand'
import { Chat, Chats, Message, Messages, uuid } from '../types/chat'
import { Socket } from 'socket.io-client'

type SocketState = {
  socket: Socket | undefined
  setSocket: (socket: Socket) => void
  setServerOffset: (serverOffset: Date) => void
  messages: Messages
  addMessage: (message: Message) => Promise<void>
  replaceMessage: (message: Message) => void
  chats: Chats
  addChat: (chat: Chat) => void
  replaceChat: (chat: Chat) => void
  removeChat: (chatUuid: uuid) => void
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: undefined,
  messages: [],
  chats: [],

  setSocket: socket => set({ socket }),
  setServerOffset: (serverOffset: Date) => {
    const newSocket = get().socket
    if (!newSocket) return

    newSocket.auth = {
      ...newSocket.auth,
      serverOffset
    }
    set({ socket: newSocket })
  },

  addMessage: async message => {
    const messages = get().messages
    if (messages.some(m => m.uuid === message.uuid)) return
    messages.push(message)
    set({ messages })
  },

  replaceMessage: message => {
    const messages = get().messages
    const index = messages.findIndex(m => m.uuid === message.uuid)
    if (index === -1) return
    messages[index] = message
    set({ messages })
  },

  addChat: chat => {
    const chats = get().chats
    if (chats.some(c => c.uuid === chat.uuid)) return
    chats.push(chat)
    set({ chats })
  },

  replaceChat: chat => {
    const chats = get().chats
    const index = chats.findIndex(c => c.uuid === chat.uuid)
    if (index === -1) return
    chats[index] = chat
    set({ chats })
  },

  removeChat: chatUuid => {
    const chats = get().chats
    const index = chats.findIndex(c => c.uuid === chatUuid)
    if (index === -1) return
    chats.splice(index, 1)
    set({ chats })
  }
}))
