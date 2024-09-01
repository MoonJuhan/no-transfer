'use client'

import useMapStore from '@/stores/map'
import { Route } from '@/types'

export default function RouteRow({ route }: { route: Route }) {
  const { map } = useMapStore()

  const onMouseEnterRoute = (route: Route) => {
    if (map === null) return

    map.addLayer({
      id: 'route-paths-highlighted-layer',
      type: 'line',
      source: 'route-paths-source',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#e11d48',
        'line-width': 2,
      },
      filter: ['==', ['get', 'id'], `route-paths-${route.id}`],
    })
  }
  const onMouseLeaveRoute = () => {
    if (map === null) return

    const layerId = 'route-paths-highlighted-layer'
    if (map.getLayer(layerId)) map.removeLayer(layerId)
  }

  const onClickRoute = ({ stations }: Route) => {
    const [sumLng, sumLat] = (stations || []).reduce(
      (acc, station) => [acc[0] + Number(station.gpsX), acc[1] + Number(station.gpsY)],
      [0, 0],
    )
    const stationsLength = stations?.length || 1

    map?.flyTo({ center: [sumLng / stationsLength, sumLat / stationsLength], zoom: 9 })
  }

  return (
    <span
      key={route.id}
      className="text-sm cursor-pointer px-0.5 rounded transition-colors hover:bg-gray-200"
      onMouseEnter={() => {
        onMouseEnterRoute(route)
      }}
      onMouseLeave={onMouseLeaveRoute}
      onClick={() => {
        onClickRoute(route)
      }}
    >
      {route.busRouteName}
    </span>
  )
}
