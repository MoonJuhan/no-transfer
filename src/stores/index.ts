import { create } from 'zustand'

type State = {
  map: any
  marker: any
}

type Action = {
  setMap: (map: State['map']) => void
  setMarker: (marker: State['marker']) => void
}

const useStore = create<State & Action>((set) => ({
  map: null,
  setMap: (map: any) => set({ map }),
  marker: null,
  setMarker: (marker: any) => set({ marker }),
}))

export default useStore
