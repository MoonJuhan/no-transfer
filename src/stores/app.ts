import { create } from 'zustand'

type State = {
  isLoading: boolean
}

type Action = {
  setLoading: (isLoading: State['isLoading']) => void
}

const useAppStore = create<State & Action>((set, get) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
}))

export default useAppStore
