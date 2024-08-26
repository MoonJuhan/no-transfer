'use client'

import CenterOverviewCard from './CenterOverviewCard'
import CenterStationsCard from './CenterStationsCard'

export default function ControlPanel() {
  return (
    <div className="fixed left-4 top-4 bottom-4 z-10 flex flex-col gap-2">
      <CenterOverviewCard />
      <CenterStationsCard />
    </div>
  )
}
