import { create } from 'zustand'

type State = {
  isLoading: boolean
  map: any
  marker: any
}

type Action = {
  setLoading: (isLoading: State['isLoading']) => void
  setMap: (map: State['map']) => void
  setMarker: (marker: State['marker']) => void
  removeMarker: () => void
}

const useStore = create<State & Action>((set, get) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
  map: null,
  setMap: (map: any) => set({ map }),
  marker: null,
  setMarker: (marker: any) => set({ marker }),
  removeMarker: () => {
    const currentMarker = get().marker
    if (currentMarker === null) return

    currentMarker.remove()

    return set({ marker: null })
  },
}))

export default useStore
