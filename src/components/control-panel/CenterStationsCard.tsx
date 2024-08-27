'use client'

import useAppStore from '@/stores/app'
import useMapStore from '@/stores/map'
import { createCircleGeometry } from '@/utils'
import { Station } from '@/types'

export default function CenterStationsCard() {
  const { map, centerStations, setCenterStations, centerMarker } = useMapStore()
  const { setLoading } = useAppStore()
  const isCurrentMarker = useMapStore(({ centerMarker }) => centerMarker !== null)

  const drawCenterRange = (lng: number, lat: number) => {
    if (map === null) return

    map.addSource('center-range-source', {
      type: 'geojson',
      data: { type: 'Feature', geometry: createCircleGeometry(lng, lat, 500) } as GeoJSON.GeoJSON,
    })

    map.addLayer({
      id: 'center-range-layer',
      type: 'fill',
      source: 'center-range-source',
      paint: {
        'fill-color': '#888888',
        'fill-opacity': 0.2,
      },
    })
  }

  const drawBusStationsPoints = (busStations: Station[]) => {
    if (map === null) return

    const features: GeoJSON.Feature<GeoJSON.Point>[] = busStations.map((station) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(station.gpsX), Number(station.gpsY)],
      },
      properties: null,
    }))

    map.addSource('center-bus-stations-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    })

    map.addLayer({
      id: 'center-bus-stations-layer',
      type: 'circle',
      source: 'center-bus-stations-source',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 1, 15, 10],
        'circle-color': '#8b5cf6',
        'circle-opacity': 0.6,
      },
    })
  }

  const onClickGetStationsByPosition = async () => {
    if (centerMarker === null || map === null) {
      console.log('Error')
      return
    }

    const { lng, lat } = centerMarker.getLngLat()

    setLoading(true)

    const params = new URLSearchParams()
    params.append('tmX', lng.toString())
    params.append('tmY', lat.toString())
    params.append('radius', '500')

    drawCenterRange(lng, lat)
    map.flyTo({ center: [lng, lat], zoom: 15 })

    try {
      const response = await fetch(`/api/bus-stations/by-position?${params.toString()}`, { method: 'GET' })
      const json = await response.json()

      const centerStations = json.msgBody.itemList
      setCenterStations(centerStations)
      drawBusStationsPoints(centerStations)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    isCurrentMarker && (
      <div className="control-panel-card h-2/5 flex-col gap-2">
        <div className="flex justify-between items-centers">
          <span className="text-base">주변 버스 정류장 ({centerStations.length})</span>
          <button className="btn-primary" onClick={onClickGetStationsByPosition}>
            조회하기
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {centerStations.map((station) => (
            <span key={station.stationId} className="text-sm">
              {station.stationNm}
            </span>
          ))}
        </div>
      </div>
    )
  )
}
