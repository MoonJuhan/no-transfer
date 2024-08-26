import { create } from 'zustand'

type State = {
  map: mapboxgl.Map | null
  centerMarker: mapboxgl.Marker | null
}

type Action = {
  setMap: (map: State['map']) => void
  setCenterMarker: (centerMarker: State['centerMarker']) => void
  removeCenterMarker: () => void
}

const useMapStore = create<State & Action>((set, get) => ({
  map: null,
  setMap: (map: any) => set({ map }),
  centerMarker: null,
  setCenterMarker: (centerMarker: any) => set({ centerMarker }),
  removeCenterMarker: () => {
    const currentMarker = get().centerMarker
    if (currentMarker === null) return

    currentMarker.remove()

    return set({ centerMarker: null })
  },
}))

export default useMapStore
