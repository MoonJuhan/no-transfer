'use client'

import useStore from '@/stores'

export default function ControlPanel() {
  const { removeMarker, setLoading } = useStore()
  const isCurrentMarker = useStore(({ marker }) => marker !== null)
  const currentMarkerPosition = useStore(({ marker }) => marker?.getLngLat() || { lng: null, lat: null })

  const onClickGetStationsByPosition = async () => {
    const { lng, lat } = currentMarkerPosition

    if (lng === null || lat === null) {
      console.log('Error')
      return
    }

    const params = new URLSearchParams()
    params.append('tmX', lng.toString())
    params.append('tmY', lat.toString())
    params.append('radius', '500')

    try {
      setLoading(true)
      const response = await fetch(`/api/bus-stations/by-position?${params.toString()}`, { method: 'GET' })
      const json = await response.json()

      console.log(json)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed left-4 top-4 z-10 bg-slate-100 rounded shadow-lg text-slate-900 flex items-center gap-2 px-2 py-0.5">
      {isCurrentMarker ? (
        <>
          <div className="flex flex-col">
            <span className="text-base">위도: {currentMarkerPosition.lat}</span>
            <span className="text-base">경도: {currentMarkerPosition.lng}</span>
          </div>
          <button className="btn-primary" onClick={onClickGetStationsByPosition}>
            조회하기
          </button>
          <button className="btn-secondary" onClick={removeMarker}>
            초기화
          </button>
        </>
      ) : (
        <span className="text-base">지도를 클릭하여 마커를 지정하세요.</span>
      )}
    </div>
  )
}
