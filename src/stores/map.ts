import { create } from 'zustand'
import { Station, Route } from '@/types'

type State = {
  map: mapboxgl.Map | null

  centerMarker: mapboxgl.Marker | null

  centerStations: Station[]

  routes: Route[]
}

type Action = {
  setMap: (map: State['map']) => void

  setCenterMarker: (centerMarker: State['centerMarker']) => void
  removeCenterMarker: () => void

  setCenterStations: (centerStations: State['centerStations']) => void
  removeCenterStations: () => void

  setRoutes: (routes: State['routes']) => void
  removeRoutes: () => void

  clearAllObjects: () => void
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
  removeCenterStations: () => set({ centerStations: [] }),

  routes: [],
  setRoutes: (routes: any) => set({ routes }),
  removeRoutes: () => set({ routes: [] }),

  clearAllObjects: () => {
    get().removeCenterMarker()
    get().removeCenterStations()
    get().removeRoutes()

    const map = get().map

    if (map === null) return

    const layerIds = [
      'center-range-layer',
      'center-bus-stations-layer',
      'center-bus-stations-highlighted-layer',
      'route-bus-stations-layer',
      'route-paths-layer',
      'route-paths-highlighted-layer',
    ]
    layerIds.forEach((layerId) => {
      if (map.getLayer(layerId)) map.removeLayer(layerId)
    })

    const sourceIds = [
      'center-range-source',
      'center-bus-stations-source',
      'route-bus-stations-source',
      'route-paths-source',
    ]
    sourceIds.forEach((sourceId) => {
      if (map.getSource(sourceId)) map.removeSource(sourceId)
    })
  },
}))

export default useMapStore
