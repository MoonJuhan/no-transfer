'use client'

import useAppStore from '@/stores/app'
import useMapStore from '@/stores/map'

export default function CenterStationsCard() {
  const { centerStations } = useMapStore()
  const { setLoading } = useAppStore()
  const isCenterStations = useMapStore(({ centerStations }) => centerStations.length > 0)

  const onClickGetRoutesByStation = async () => {}

  return (
    isCenterStations && (
      <div className="control-panel-card h-80 flex-col gap-2">
        <div className="flex justify-between items-centers">
          <span className="text-base">버스 경로 ({centerStations.length})</span>
          <button className="btn-primary" onClick={onClickGetRoutesByStation}>
            조회하기
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          <span>Hello</span>
        </div>
      </div>
    )
  )
}
