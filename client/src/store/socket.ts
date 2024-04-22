import { create } from 'zustand'
import {
  Chat,
  Chats,
  CurrentChat,
  Message,
  Messages,
  uuid
} from '../types/chat'
import { io, Socket } from 'socket.io-client'

const SERVER_DOMAIN =
  import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:3000'

type SocketState = {
  socket: Socket
  setSocket: (socket: Socket) => void
  setServerOffset: (serverOffset: string) => void
  messages: Messages
  setMessage: (message: Message) => void
  replaceMessage: (message: Message) => void
  chats: Chats
  setChat: (chat: Chat) => void
  currentChat: CurrentChat | null
  setCurrentChat: (uuid: uuid) => void
  setCurrentChatDraft: (draft: string) => void
}

const defaultSocket = io(SERVER_DOMAIN, {
  auth: {
    serverOffset: 0
  }
})

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: defaultSocket,
  messages: [],
  chats: [],
  currentChat: null,

  setSocket: socket => set({ socket }),
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

  setChat: chat => {
    const chats = get().chats
    chats.push(chat)
    set({ chats })
  },

  setCurrentChat: uuid => {
    const draft = localStorage.getItem(uuid) || ''
    const currentChat = {
      uuid,
      draft: draft
    }

    set({ currentChat })
  },
  setCurrentChatDraft: draft => {
    const currentChat = get().currentChat
    if (!currentChat) return
    currentChat.draft = draft
    set({ currentChat })
  }
}))
