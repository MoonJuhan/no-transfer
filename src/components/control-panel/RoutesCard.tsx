'use client'

import useAppStore from '@/stores/app'
import useMapStore from '@/stores/map'
import { Route, Station } from '@/types'

export default function CenterStationsCard() {
  const { map, centerStations, routes, setRoutes } = useMapStore()
  const { setLoading } = useAppStore()
  const isCenterStations = useMapStore(({ centerStations }) => centerStations.length > 0)

  const onClickGetRoutesByStation = async () => {
    if (centerStations.length === 0 || map === null) return

    setLoading(true)

    try {
      const arsIds = centerStations.map((station) => station.id)
      const busRoutesParams = new URLSearchParams()
      busRoutesParams.append('arsIds', arsIds.join(','))

      const busRoutesResponse = await fetch(`/api/bus-routes/by-stations?${busRoutesParams.toString()}`, {
        method: 'GET',
      })
      const { data } = await busRoutesResponse.json()

      setRoutes(data)
      console.log(data)

      const routeStations = data
        .map((route: Route) => route.stations)
        .flat()
        .filter((station: any, index: number, arr: any[]) => arr.findIndex((s) => s.id === station.id) === index)

      console.log(routeStations)
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
          <span className="text-base">버스 경로 ({routes.length})</span>
          <button className="btn-primary" onClick={onClickGetRoutesByStation} disabled={routes.length > 0}>
            조회하기
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto">
          {routes.map((route) => (
            <span key={route.id} className="text-sm cursor-pointer px-0.5 rounded transition-colors hover:bg-gray-200 ">
              {route.busRouteName}
            </span>
          ))}
        </div>
      </div>
    )
  )
}
