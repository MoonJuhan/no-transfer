'use client'

import { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/16/solid'

type ModalBasicProps = {
  show: boolean
  setShow: (show: boolean) => void
  title: string
  buttons: {
    text: string
    className: string
    onClick: () => void
  }[]
  children: React.ReactNode
}

export default function ModalBasic({ show, setShow, children, title, buttons }: ModalBasicProps) {
  const [localShow, setLocalShow] = useState(false)
  const [visible, setVisible] = useState(false)

  const ModalBasicClassName = `fixed inset-0 flex justify-center items-center z-20 bg-black/20 backdrop-blur-sm transition-opacity ${visible ? 'opacity-100' : 'opacity-0'}`

  const showModal = () => {
    setLocalShow(true)
    setTimeout(() => {
      setVisible(true)
    }, 100)
  }

  const closeModal = () => {
    setVisible(false)
    setTimeout(() => {
      setLocalShow(false)
      setShow(false)
    }, 150)
  }

  useEffect(() => {
    if (show) showModal()
    else closeModal()
  }, [show])

  return (
    <>
      {localShow && (
        <div className={ModalBasicClassName}>
          <div className="flex flex-col bg-white text-black rounded w-96">
            <div className="flex justify-between items-center px-4 py-2 border-b border-black">
              <b>{title}</b>
              <button onClick={closeModal}>
                <XMarkIcon className="size-6 text-black" />
              </button>
            </div>

            <div className="px-4 py-2">{children}</div>

            <div className="flex justify-end gap-2 px-4 pb-2">
              {buttons.map((button, index) => (
                <button className={button.className} key={index} onClick={button.onClick}>
                  {button.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
