import { create } from 'zustand'

type newModalState = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useNewChatModalStore = create<newModalState>(set => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false })
}))
