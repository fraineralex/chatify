import { create } from 'zustand'
import {
  Chat,
  Chats,
  CurrentChat,
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
  currentChat: CurrentChat | null
  setCurrentChat: (chat: Chat) => void
  replaceChat: (chat: Chat) => void
  setCurrentChatDraft: (draft: string) => void
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: undefined,
  messages: [],
  chats: [],
  currentChat: null,

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

  setCurrentChat: chat => {
    const draft = localStorage.getItem(chat.uuid) || ''
    const currentChat: CurrentChat = {
      ...chat,
      draft: draft
    }

    set({ currentChat })
  },

  replaceChat: chat => {
    const chats = get().chats
    const index = chats.findIndex(c => c.uuid === chat.uuid)
    chats[index] = chat
    set({ chats })
  },

  setCurrentChatDraft: draft => {
    const currentChat = get().currentChat
    if (!currentChat) return
    currentChat.draft = draft
    set({ currentChat })
  }
}))
