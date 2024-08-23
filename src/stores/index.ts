import { create } from 'zustand'

type State = {
  map: any
  marker: any
}

type Action = {
  setMap: (map: State['map']) => void
  setMarker: (marker: State['marker']) => void
  removeMarker: () => void
}

const useStore = create<State & Action>((set, get) => ({
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
