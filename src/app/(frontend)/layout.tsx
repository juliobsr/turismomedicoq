// src/app/layout.tsx
import './globals.css'
import React from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export const metadata = {
  title: 'Queretaro Medical | World-Class Healthcare Specialists',
  description: 'Internationally accredited specialists, state-of-the-art facilities, and accessible medical procedures in Queretaro, Mexico.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* Usamos un div envolvente para que el Header no afecte al Admin */}
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}