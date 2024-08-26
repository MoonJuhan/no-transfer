'use client'

import useMapStore from '@/stores/map'

export default function CenterStationsCard() {
  const { centerStations } = useMapStore()

  return (
    centerStations.length > 0 && (
      <div className="control-panel-card flex-col gap-2">
        <span className="text-base">조회된 버스 정류장</span>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
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
