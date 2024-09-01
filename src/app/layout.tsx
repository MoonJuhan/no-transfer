import type { Metadata } from 'next'
import Script from 'next/script'
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
  const GA_TRACKING_ID = 'G-XX2MTJXY7D'

  return (
    <html lang="en">
      <head>
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <AddonLoader />
      </body>
    </html>
  )
}
