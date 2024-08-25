'use client'

import { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import ControlPanel from '@/components/ControlPanel'
import useStore from '@/stores'

export default function App() {
  const { map, setMap, marker, setMarker } = useStore()

  const onClickMap = ({ lngLat }: mapboxgl.MapMouseEvent) => {
    if (marker !== null) marker.remove()

    const newMarker = new mapboxgl.Marker().setLngLat([lngLat.lng, lngLat.lat]).addTo(map)
    setMarker(newMarker)
  }

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

  const addMapClickHandler = () => {
    if (map !== null) map.on('click', onClickMap)
  }

  const removeMapClickHandler = () => {
    if (map !== null) map.off('click', onClickMap)
  }

  useEffect(() => {
    addMapClickHandler()

    return () => {
      removeMapClickHandler()
    }
  }, [map, marker])

  const onClickGetStationsByPosition = async () => {
    const { lng, lat } = marker?.getLngLat() || { lng: 0, lat: 0 }

    if (lng === 0 || lat === 0) {
      console.log('Error')
      return
    }

    const params = new URLSearchParams()
    params.append('tmX', lng.toString())
    params.append('tmY', lat.toString())
    params.append('radius', '500')

    try {
      const response = await fetch(`/api/bus-stations/by-position?${params.toString()}`, { method: 'GET' })
      const json = await response.json()

      console.log(json)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main id="map" className="w-screen h-screen">
      <ControlPanel onClickGetStationsByPosition={onClickGetStationsByPosition} />
    </main>
  )
}
