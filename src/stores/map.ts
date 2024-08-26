import { create } from 'zustand'
import { Station } from '@/types'

type State = {
  map: mapboxgl.Map | null
  centerMarker: mapboxgl.Marker | null
  centerStations: Station[]
}

type Action = {
  setMap: (map: State['map']) => void
  setCenterMarker: (centerMarker: State['centerMarker']) => void
  removeCenterMarker: () => void
  setCenterStations: (centerStations: State['centerStations']) => void
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
  centerStations: [],
  setCenterStations: (centerStations: any) => set({ centerStations }),
}))

export default useMapStore
