// src/app/(frontend)/layout.tsx
import './globals.css'
import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

// Components
import { Header } from '@/app/components/Header/Header'
import { Footer } from '@/app/components/Footer'

// Services & Utils
import { getSiteSettings } from '@/lib/globals'

// ============================================================================
// FONT OPTIMIZATION (Core Web Vitals: CLS & LCP)
// Preloads the font server-side and injects it via a CSS variable.
// ============================================================================
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// ============================================================================
// RESPONSIVE & PWA VIEWPORT CONFIGURATION (Next.js 15 standard)
// ============================================================================
export const viewport: Viewport = {
  themeColor: '#ffffff', // You can also make this dynamic later if needed
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Accessibility: Allow users to zoom in
}

// ============================================================================
// DYNAMIC SEO METADATA (Master Fallback)
// Architecture: Establishes the absolute base URL for social sharing links.
// ============================================================================
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings?.companyName || 'Queretaro Medical Tourism'

  // Security/SEO: Always define a reliable base URL. Fallback to localhost for dev.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: siteName || 'World-class medical procedures with internationally accredited specialists.',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: siteName,
      locale: 'en_US', // Consider making this dynamic if building a multilingual site
    },
  }
}

/**
 * Enterprise Layout: Frontend Root Layout
 * Architecture: React Server Component (RSC) injecting dynamic CSS Variables.
 */
export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Fetch cached global settings (0ms overhead due to Next.js Cache)
  const settings = await getSiteSettings()

  // 2. Map Payload CMS hex codes to standard CSS custom properties
  const themeVariables = {
    '--color-primary': settings?.primaryColor || '#2563EB',
    '--color-secondary': settings?.secondaryColor || '#1E3A8A',
    '--color-accent': settings?.accentColor || '#F59E0B',
    '--color-background': settings?.backgroundColor || '#F8FAFC',
    '--color-text': settings?.textColor || '#0F172A',
  } as React.CSSProperties

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body 
        style={themeVariables} 
        // Apply dynamic variables globally and use the optimized Inter font
        className="font-sans antialiased min-h-screen flex flex-col bg-brand-bg text-brand-text transition-colors duration-300"
      >
        {/* Pass necessary dynamic props to the Header */}
        <Header 
          companyName={settings?.companyName}
          contactPhone={settings?.contactPhone} 
          displayPhone = {settings?.contactPhone}
        />
        
        {/* Main Content Area */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Pass the entire settings object to the Footer for addresses, links, etc. */}
        <Footer settings={settings} />
      </body>
    </html>
  )
}
