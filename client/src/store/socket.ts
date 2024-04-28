import { create } from 'zustand'
import { Chat, Chats, Message, Messages, uuid } from '../types/chat'
import { Socket } from 'socket.io-client'
import { db } from '../database/db'

type SocketState = {
  socket: Socket | undefined
  setSocket: (socket: Socket) => void
  setServerOffset: (serverOffset: Date) => void
  messages: Messages
  addMessage: (message: Message) => Promise<void>
  replaceMessage: (message: Message) => Promise<void>
  chats: Chats
  addChat: (chat: Chat) => void
  replaceChat: (chat: Chat) => void
  removeChat: (chatUuid: uuid) => void
}

const initialMessages = (await db.messages.toArray()) ?? []
const initialChats = (await db.chats.toArray()) ?? []

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: undefined,
  messages: initialMessages,
  chats: initialChats,

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
    if (messages.some(m => m.uuid === message.uuid && !m.isSent)) {
      get().replaceMessage(message)
      return
    }
    messages.push(message)
    await db.messages.add(message)
    set({ messages })
  },

  replaceMessage: async message => {
    const messages = get().messages
    const index = messages.findIndex(m => m.uuid === message.uuid)
    if (index === -1) return
    messages[index] = message
    await db.messages.put(message)
    set({ messages })
  },

  addChat: async chat => {
    const chats = get().chats
    if (chats.some(c => c.uuid === chat.uuid)) return
    chats.push(chat)
    await db.chats.add(chat)
    set({ chats })
  },

  replaceChat: async chat => {
    const chats = get().chats
    const index = chats.findIndex(c => c.uuid === chat.uuid)
    if (index === -1) return
    chats[index] = chat
    await db.chats.put(chat)
    set({ chats })
  },

  removeChat: async chatUuid => {
    const chats = get().chats
    const index = chats.findIndex(c => c.uuid === chatUuid)
    if (index === -1) return
    chats.splice(index, 1)
    await db.chats.delete(chatUuid)
    set({ chats })
  }
}))
