import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'LAX Live - Live Airport Streams',
  description: 'Watch live streams from Los Angeles International Airport (LAX)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
