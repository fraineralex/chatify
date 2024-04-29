import { create } from 'zustand'
import { Chat } from '../types/chat'

type ChatState = {
  currentChat: Chat | null
  getCurrentChat: () => Chat | null
  setCurrentChat: (chat: Chat | null) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentChat: null,

  getCurrentChat: () => get().currentChat,
  setCurrentChat: chat => {
    set({ currentChat: chat ?? null })
  }
}))
