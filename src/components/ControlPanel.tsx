'use client'

import useStore from '@/stores'

export default function ControlPanel() {
  const { removeMarker } = useStore()
  const isCurrentMarker = useStore(({ marker }) => marker !== null)
  const currentMarkerPosition = useStore(({ marker }) => marker?.getLngLat() || {})

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 bg-slate-100 rounded shadow-lg text-slate-900 flex items-center gap-2 px-2 py-0.5">
      {isCurrentMarker ? (
        <>
          <div className="flex flex-col">
            <span>위도: {currentMarkerPosition.lat}</span>
            <span>경도: {currentMarkerPosition.lng}</span>
          </div>
          <button className="btn-primary">조회하기</button>
          <button className="btn-secondary" onClick={removeMarker}>
            초기화
          </button>
        </>
      ) : (
        <span className="text-xs">지도를 클릭하여 마커를 지정하세요.</span>
      )}
    </div>
  )
}
