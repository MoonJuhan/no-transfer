'use client'

import useAppStore from '@/stores/app'
import useMapStore from '@/stores/map'
import { createCircleGeometry } from '@/utils'
import { Station } from '@/types'

export default function CenterOverview() {
  const { map, removeCenterMarker, setCenterStations, clearAllObjects } = useMapStore()
  const { setLoading } = useAppStore()
  const isCurrentMarker = useMapStore(({ centerMarker }) => centerMarker !== null)
  const currentMarkerPosition = useMapStore(({ centerMarker }) => centerMarker?.getLngLat() || { lng: null, lat: null })

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
    const { lng, lat } = currentMarkerPosition

    if (lng === null || lat === null || map === null) {
      console.log('Error')
      return
    }

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

  const onClickClear = () => {
    removeCenterMarker()
    clearAllObjects()
  }

  return (
    <div className="control-panel-card items-center gap-2">
      {isCurrentMarker ? (
        <>
          <div className="flex flex-col">
            <span className="text-base">위도: {currentMarkerPosition.lat}</span>
            <span className="text-base">경도: {currentMarkerPosition.lng}</span>
          </div>
          <button className="btn-primary" onClick={onClickGetStationsByPosition}>
            조회하기
          </button>
          <button className="btn-secondary" onClick={onClickClear}>
            초기화
          </button>
        </>
      ) : (
        <span className="text-base">지도를 클릭하여 마커를 지정하세요.</span>
      )}
    </div>
  )
}
