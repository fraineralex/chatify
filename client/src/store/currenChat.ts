import { create } from 'zustand'
import { Chat } from '../types/chat'

type ChatState = {
	currentChat: Chat | null | undefined
	getCurrentChat: () => Chat | null | undefined
	setCurrentChat: (chat: Chat | null | undefined) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
	currentChat: undefined,

	getCurrentChat: () => get()?.currentChat,
	setCurrentChat: chat => {
		set({ currentChat: chat ?? null })
	}
}))
