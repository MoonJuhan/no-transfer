'use client'

import useAppStore from '@/stores/app'
import useMapStore from '@/stores/map'
import { PublicTransportationRoute, Station } from '@/types'
import PublicTransportationRouteRow from './PublicTransportationRouteRow'

export default function PublicTransportationRoutesCard() {
  const { map, centerStations, publicTransportationRoutes, setPublicTransportationRoutes, centerMarker } = useMapStore()
  const { setLoading } = useAppStore()
  const isCenterStations = useMapStore(({ centerStations }) => centerStations.length > 0)

  const drawBusStationsPoints = (busStations: Station[]) => {
    if (map === null) return

    const features: GeoJSON.Feature<GeoJSON.Point>[] = busStations.map((station) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(station.gpsX), Number(station.gpsY)],
      },
      properties: {
        id: `public-transportation-route-bus-station-${station.id}`,
      },
    }))

    map.addSource('public-transportation-route-bus-stations-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    })

    map.addLayer({
      id: 'public-transportation-route-bus-stations-layer',
      type: 'circle',
      source: 'public-transportation-route-bus-stations-source',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 4, 15, 10],
        'circle-color': '#f43f5e',
        'circle-opacity': 0.8,
      },
    })
  }

  const drawRouteLines = (routes: PublicTransportationRoute[]) => {
    if (map === null) return

    const features: GeoJSON.Feature<GeoJSON.LineString>[] = routes.map((route) => {
      const stations = route.stations || []

      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: stations.map((station) => [Number(station.gpsX), Number(station.gpsY)]),
        },
        properties: {
          id: `public-transportation-route-paths-${route.id}`,
        },
      }
    })

    map.addSource('public-transportation-route-paths-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    })

    map.addLayer({
      id: 'public-transportation-route-paths-layer',
      type: 'line',
      source: 'public-transportation-route-paths-source',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#fb7185',
        'line-width': 2,
      },
    })
  }

  const onClickGetRoutesByStation = async () => {
    if (centerStations.length === 0 || map === null || centerMarker === null) return

    setLoading(true)

    try {
      const arsIds = centerStations.map((station) => station.id)
      const busRoutesParams = new URLSearchParams()
      busRoutesParams.append('arsIds', arsIds.join(','))

      const busRoutesResponse = await fetch(`/api/bus-routes/by-stations?${busRoutesParams.toString()}`, {
        method: 'GET',
      })
      const { data } = await busRoutesResponse.json()

      setPublicTransportationRoutes(data)

      const publicTransportationRouteStations = data
        .map(({ stations }: PublicTransportationRoute) => stations)
        .flat()
        .filter((station: any, index: number, arr: any[]) => {
          const stationId = station.id

          if (centerStations.findIndex((s) => s.id === stationId) !== -1) return false

          return arr.findIndex((s) => s.id === stationId) === index
        })

      drawBusStationsPoints(publicTransportationRouteStations)
      drawRouteLines(data)

      const { lng, lat } = centerMarker.getLngLat()
      map.flyTo({ center: [lng, lat], zoom: 9 })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    isCenterStations && (
      <div className="control-panel-card h-80 flex-col gap-2">
        <div className="flex justify-between items-centers">
          <span className="text-base">버스 경로 ({publicTransportationRoutes.length})</span>
          <button
            className="btn-primary"
            onClick={onClickGetRoutesByStation}
            disabled={publicTransportationRoutes.length > 0}
          >
            조회하기
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {publicTransportationRoutes.map((publicTransportationRoute) => (
            <PublicTransportationRouteRow
              key={publicTransportationRoute.id}
              publicTransportationRoute={publicTransportationRoute}
            />
          ))}
        </div>
      </div>
    )
  )
}
