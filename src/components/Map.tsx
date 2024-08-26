'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import useMapStore from '@/stores/map'
import ModalBasic from './modal/ModalBasic'

export default function Map() {
  const { map, setMap, marker, setMarker } = useMapStore()

  const initMap = () => {
    if (map !== null) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string

    setMap(
      new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [127.0276476, 37.498025],
        zoom: 9,
        language: 'ko',
      }),
    )
  }

  useEffect(() => {
    initMap()
  }, [])

  const onClickMap = ({ lngLat }: mapboxgl.MapMouseEvent) => {
    if (marker !== null) {
      setClickedPoint(lngLat)
      setShowModal(true)
      return
    }

    const newMarker = new mapboxgl.Marker().setLngLat([lngLat.lng, lngLat.lat]).addTo(map)
    setMarker(newMarker)
  }

  useEffect(() => {
    if (map !== null) map.on('click', onClickMap)

    return () => {
      if (map !== null) map.off('click', onClickMap)
    }
  }, [map, marker])

  const [clickedPoint, setClickedPoint] = useState<mapboxgl.LngLat | null>(null)
  const [showModal, setShowModal] = useState(false)
  const onClickConfirm = () => {
    setShowModal(false)

    if (clickedPoint === null) return

    marker.remove()

    const newMarker = new mapboxgl.Marker().setLngLat([clickedPoint.lng, clickedPoint.lat]).addTo(map)
    setMarker(newMarker)
  }

  return (
    <>
      <div id="map" className="w-screen h-screen" />
      {typeof window === 'undefined' ? (
        <></>
      ) : (
        createPortal(
          <ModalBasic
            show={showModal}
            setShow={setShowModal}
            title="확인하기"
            buttons={[{ text: '확인', className: 'btn-primary', onClick: onClickConfirm }]}
          >
            새로운 위치를 지정하시겠습니까?
          </ModalBasic>,
          document.body,
        )
      )}
    </>
  )
}
