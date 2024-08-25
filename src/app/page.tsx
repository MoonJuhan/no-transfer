'use client'

import { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import useStore from '@/stores'
import Map from '@/components/Map'
import ControlPanel from '@/components/ControlPanel'

export default function App() {
  const { map, marker, setMarker } = useStore()

  const onClickMap = ({ lngLat }: mapboxgl.MapMouseEvent) => {
    if (marker !== null) marker.remove()

    const newMarker = new mapboxgl.Marker().setLngLat([lngLat.lng, lngLat.lat]).addTo(map)
    setMarker(newMarker)
  }

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
    <>
      <Map />
      <ControlPanel />
    </>
  )
}
