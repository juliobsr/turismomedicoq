// src/app/(frontend)/layout.tsx
import './globals.css'
import React from 'react'
import type { Metadata } from 'next'

import { Header } from '@/app/components/Header/Header'
import  Footer  from '@/app/components/Footer'
import { getSiteSettings } from '@/lib/globals'

// ============================================================================
// DYNAMIC SEO METADATA (Fallback)
// ============================================================================
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings?.companyName || 'Vzsoluciones Medical Tourism'
  
  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: 'World-class medical procedures with internationally accredited specialists.',
  }
}

/**
 * Enterprise Layout: Frontend Root Layout
 * Architecture: RSC injecting CSS Variables for true White-labeling.
 */
export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Fetch cached global settings
  const settings = await getSiteSettings()

  // 2. Map Payload CMS hex codes to standard CSS custom properties
  // We use fallback values to ensure the UI doesn't break if the CMS is empty
  const themeVariables = {
    '--color-primary': settings?.primaryColor || '#2563EB',
    '--color-secondary': settings?.secondaryColor || '#1E3A8A',
    '--color-accent': settings?.accentColor || '#F59E0B',
    '--color-background': settings?.backgroundColor || '#F8FAFC',
    '--color-text': settings?.textColor || '#0F172A',
  } as React.CSSProperties

  return (
    <html lang="en">
      <body 
        style={themeVariables} 
        // Apply our dynamic variables globally using the custom Tailwind classes
        className="antialiased min-h-screen flex flex-col bg-brand-bg text-brand-text transition-colors duration-300"
      >
        {/* Pass necessary dynamic props to the Header */}
        <Header 
        companyName={settings?.companyName}
          contactPhone={settings?.contactPhone} 
          displayPhone={settings?.contactPhone} 
        />
        
        <main className="flex-grow">
          {children}
        </main>

        {/* Pass the entire settings object to the Footer for addresses, emails, etc. */}
        <Footer settings={settings} />
      </body>
    </html>
  )
}