'use client'

import { useEffect, useState } from 'react'

import useStore from '@/stores'

export default function AddonLoader() {
  const [localShow, setLocalShow] = useState(false)
  const [visible, setVisible] = useState(false)

  const showLoader = () => {
    setLocalShow(true)
    setTimeout(() => {
      setVisible(true)
    })
  }

  const closeLoader = () => {
    setVisible(false)
    setTimeout(() => {
      setLocalShow(false)
    }, 150)
  }

  const { isLoading } = useStore()
  useEffect(() => {
    if (isLoading) showLoader()
    else closeLoader()
  }, [isLoading])

  const addonLoaderClassName = `fixed inset-0 flex justify-center items-center z-30 bg-black/20 backdrop-blur-sm transition-opacity opacity-${visible ? '100' : '0'}`

  return <>{localShow && <div className={addonLoaderClassName}>Loading...</div>}</>
}
