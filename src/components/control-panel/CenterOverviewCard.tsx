'use client'

import useMapStore from '@/stores/map'

export default function CenterOverviewCard() {
  const { clearAllObjects } = useMapStore()
  const isCurrentMarker = useMapStore(({ centerMarker }) => centerMarker !== null)
  const currentMarkerPosition = useMapStore(({ centerMarker }) => centerMarker?.getLngLat() || { lng: null, lat: null })

  const onClickClear = () => {
    clearAllObjects()
  }

  return (
    <div className="control-panel-card justify-between items-center gap-2">
      {isCurrentMarker ? (
        <>
          <div className="flex flex-col">
            <span className="text-base">위도: {currentMarkerPosition.lat}</span>
            <span className="text-base">경도: {currentMarkerPosition.lng}</span>
          </div>

          <button className="btn-secondary" onClick={onClickClear}>
            초기화
          </button>
        </>
      ) : (
        <span className="text-base m-auto">지도를 클릭하여 마커를 지정하세요.</span>
      )}
    </div>
  )
}
