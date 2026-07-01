import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'KeenKids Learn',
  description: 'STEAM learning for Grades 1–4',
  manifest:    '/manifest.json',
}

export const viewport: Viewport = {
  width:               'device-width',
  initialScale:        1,
  maximumScale:        1, // prevent zoom on input focus on iOS
  userScalable:        false,
  themeColor:          '#0284c7',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
