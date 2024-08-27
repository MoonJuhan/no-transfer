'use client'

import useAppStore from '@/stores/app'
import useMapStore from '@/stores/map'

export default function CenterStationsCard() {
  const { map, centerStations } = useMapStore()
  const { setLoading } = useAppStore()
  const isCenterStations = useMapStore(({ centerStations }) => centerStations.length > 0)

  const onClickGetRoutesByStation = async () => {
    if (centerStations.length === 0 || map === null) return

    setLoading(true)

    const arsIds = centerStations.map((station) => station.arsId)

    const params = new URLSearchParams()
    params.append('arsIds', arsIds.join(','))

    try {
      const response = await fetch(`/api/bus-routes/by-stations?${params.toString()}`, { method: 'GET' })
      const json = await response.json()
      console.log(json)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

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
