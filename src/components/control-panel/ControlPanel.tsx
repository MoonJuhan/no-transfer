'use client'

import CenterOverviewCard from './CenterOverviewCard'
import CenterStationsCard from './center-stations/CenterStationsCard'
import RoutesCard from './routes/RoutesCard'

export default function ControlPanel() {
  return (
    <div className="fixed left-4 top-4 z-10 flex flex-col gap-2">
      <CenterOverviewCard />
      <CenterStationsCard />
      <RoutesCard />
    </div>
  )
}
