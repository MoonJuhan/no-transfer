import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/index.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import AddonLoader from '@/components/addons/AddonLoader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'No Transfer',
  description: "It's hard to transfer.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AddonLoader />
      </body>
    </html>
  )
}
