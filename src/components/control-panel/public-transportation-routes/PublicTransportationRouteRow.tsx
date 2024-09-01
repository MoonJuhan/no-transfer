'use client'

import useMapStore from '@/stores/map'
import { PublicTransportationRoute } from '@/types'

type PublicTransportationRouteRowProps = {
  publicTransportationRoute: PublicTransportationRoute
}

export default function PublicTransportationRouteRow({ publicTransportationRoute }: PublicTransportationRouteRowProps) {
  const { map } = useMapStore()

  const onMouseEnterRow = ({ id }: PublicTransportationRoute) => {
    if (map === null) return

    map.addLayer({
      id: 'public-transportation-route-paths-highlighted-layer',
      type: 'line',
      source: 'public-transportation-route-paths-source',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#e11d48',
        'line-width': 2,
      },
      filter: ['==', ['get', 'id'], `public-transportation-route-paths-${id}`],
    })
  }
  const onMouseLeaveRow = () => {
    if (map === null) return

    const layerId = 'public-transportation-route-paths-highlighted-layer'
    if (map.getLayer(layerId)) map.removeLayer(layerId)
  }

  const onClickRow = ({ stations }: PublicTransportationRoute) => {
    const [sumLng, sumLat] = (stations || []).reduce(
      (acc, station) => [acc[0] + Number(station.gpsX), acc[1] + Number(station.gpsY)],
      [0, 0],
    )
    const stationsLength = stations?.length || 1

    map?.flyTo({ center: [sumLng / stationsLength, sumLat / stationsLength], zoom: 9 })
  }

  return (
    <span
      key={publicTransportationRoute.id}
      className="text-sm cursor-pointer px-0.5 rounded transition-colors hover:bg-gray-200"
      onMouseEnter={() => {
        onMouseEnterRow(publicTransportationRoute)
      }}
      onMouseLeave={onMouseLeaveRow}
      onClick={() => {
        onClickRow(publicTransportationRoute)
      }}
    >
      {publicTransportationRoute.name}
    </span>
  )
}
