import { create } from 'zustand'
import { Chat } from '../types/chat'

type ChatState = {
  currentChat: Chat | null
  currentChatDraft: string
  setCurrentChat: (chat: Chat | null) => void
  setCurrentChatDraft: (draft: string) => void
}

export const useChatStore = create<ChatState>(set => ({
  currentChat: null,
  currentChatDraft: '',

  setCurrentChat: chat => {
    if (!chat) return set({ currentChat: null })
    const draft = localStorage.getItem(chat.uuid) || ''

    set({ currentChatDraft: draft })
    set({ currentChat: chat })
  },

  setCurrentChatDraft: draft => set({ currentChatDraft: draft })
}))
