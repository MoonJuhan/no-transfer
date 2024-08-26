'use client'

import CenterOverview from './CenterOverview'

export default function ControlPanel() {
  return (
    <div className="fixed left-4 top-4 z-10 flex flex-col gap-4">
      <CenterOverview />
    </div>
  )
}
