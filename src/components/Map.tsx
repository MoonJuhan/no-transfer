'use client'

import { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import useStore from '@/stores'

export default function Map() {
  const { map, setMap } = useStore()

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

  return <div id="map" className="w-screen h-screen" />
}
