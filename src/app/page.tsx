'use client'

import { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

export default function App() {
  let map: any = null
  let marker: any = null

  const onClickMap = ({ lngLat }: mapboxgl.MapMouseEvent) => {
    if (marker !== null) marker.remove()

    marker = new mapboxgl.Marker().setLngLat([lngLat.lng, lngLat.lat]).addTo(map)
  }

  const initMap = () => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string

    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [127.0276476, 37.498025],
      zoom: 9,
      language: 'ko',
    })

    map.on('click', onClickMap)
  }

  useEffect(() => {
    if (map === null) {
      initMap()
    }
  }, [])

  return <main id="map" className="w-screen h-screen" />
}
