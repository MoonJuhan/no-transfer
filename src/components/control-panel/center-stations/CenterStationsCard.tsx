'use client'

import { useEffect, useState } from 'react'
import useAppStore from '@/stores/app'
import useMapStore from '@/stores/map'
import useCenterStations from '@/hooks/useCenterStations'
import { createCircleGeometry } from '@/utils'
import ModalBasic from '@/components/modal/ModalBasic'
import CenterStationRow from './CenterStationRow'

export default function CenterStationsCard() {
  const { map, centerStations, setCenterStations, centerMarker, clearAllObjects } = useMapStore()
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

  const { drawBusStationPoints, addBusStationPointsEventListeners, highlightedPointIds, updateHighlightedPoints } =
    useCenterStations()

  const onClickGetStationsByPosition = async () => {
    if (centerMarker === null || map === null) return

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
      const { data } = await response.json()

      if (data === null) {
        setShowModal(true)
        return
      }

      setCenterStations(data)
      drawBusStationPoints(data)
      addBusStationPointsEventListeners()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    updateHighlightedPoints()
  }, [highlightedPointIds])

  const [showModal, setShowModal] = useState(false)
  const onClickConfirm = () => {
    setShowModal(false)
  }
  useEffect(() => {
    if (showModal) return
    clearAllObjects()
  }, [showModal])

  return (
    isCurrentMarker && (
      <>
        <div className="control-panel-card h-80 flex-col gap-2">
          <div className="flex justify-between items-centers">
            <span className="text-base">주변 버스 정류장 ({centerStations.length})</span>
            <button className="btn-primary" onClick={onClickGetStationsByPosition} disabled={centerStations.length > 0}>
              조회하기
            </button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto">
            {centerStations.map((station) => (
              <CenterStationRow key={station.id} station={station} />
            ))}
          </div>
        </div>

        <ModalBasic
          show={showModal}
          setShow={setShowModal}
          title="조회오류"
          buttons={[{ text: '확인', className: 'btn-primary', onClick: onClickConfirm }]}
        >
          선택한 위치 주변에 정류장이 없습니다.
        </ModalBasic>
      </>
    )
  )
}
