import { create } from 'zustand'

type imageSlider = {
  visible: boolean
  setVisible: (visible: boolean) => void
  index: number
  setIndex: (index: number) => void
}

export const useImageSliderStore = create<imageSlider>(set => ({
  visible: false,
  index: 0,

  setVisible: visible => set({ visible }),
  setIndex: index => set({ index })
}))
