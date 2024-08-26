'use client'

import Map from '@/components/Map'
import ControlPanel from '@/components/ControlPanel'

export default function App() {
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
