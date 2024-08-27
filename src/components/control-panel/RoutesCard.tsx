'use client'

import useAppStore from '@/stores/app'
import useMapStore from '@/stores/map'
import { Route, Station } from '@/types'

export default function CenterStationsCard() {
  const { map, centerStations, routes, setRoutes, centerMarker } = useMapStore()
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
        id: `route-bus-station-${station.id}`,
      },
    }))

    map.addSource('route-bus-stations-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    })

    map.addLayer({
      id: 'route-bus-stations-layer',
      type: 'circle',
      source: 'route-bus-stations-source',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 4, 15, 10],
        'circle-color': '#eab308',
        'circle-opacity': 0.8,
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

      setRoutes(data)

      const routeStations = data
        .map((route: Route) => route.stations)
        .flat()
        .filter((station: any, index: number, arr: any[]) => {
          const stationId = station.id

          if (centerStations.findIndex((s) => s.id === stationId) !== -1) return false

          return arr.findIndex((s) => s.id === stationId) === index
        })

      drawBusStationsPoints(routeStations)

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
          <span className="text-base">버스 경로 ({routes.length})</span>
          <button className="btn-primary" onClick={onClickGetRoutesByStation} disabled={routes.length > 0}>
            조회하기
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {routes.map((route) => (
            <span key={route.id} className="text-sm cursor-pointer px-0.5 rounded transition-colors hover:bg-gray-200 ">
              {route.busRouteName}
            </span>
          ))}
        </div>
      </div>
    )
  )
}
