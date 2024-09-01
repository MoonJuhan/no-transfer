'use client'

import useMapStore from '@/stores/map'
import useCenterStations from '@/hooks/useCenterStations'
import { Station } from '@/types'

export default function CenterStationRow({ station }: { station: Station }) {
  const { map } = useMapStore()

  const { highlightBusStationPoint, dehighlightBusStationPoint } = useCenterStations()

  const onMouseEnterStation = (station: Station) => {
    highlightBusStationPoint(`center-bus-station-${station.id}`)
  }

  const onMouseLeaveStation = () => {
    dehighlightBusStationPoint()
  }

  const onClickStation = ({ gpsX, gpsY }: Station) => {
    map?.flyTo({ center: [Number(gpsX), Number(gpsY)], zoom: 17 })
  }

  return (
    <span
      key={station.id}
      className="text-sm cursor-pointer px-0.5 rounded transition-colors hover:bg-gray-200"
      onMouseEnter={() => {
        onMouseEnterStation(station)
      }}
      onMouseLeave={onMouseLeaveStation}
      onClick={() => {
        onClickStation(station)
      }}
    >
      {station.stationName}
    </span>
  )
}
