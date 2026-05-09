// src/components/Header/MobileMenu.tsx
'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline'
import type { Specialty } from '@/payload-types'

interface MobileMenuProps {
  specialties: Specialty[]
  companyName: string
  logoInitials: string
  contactPhone: string
  displayPhone: string
}

/**
 * Enterprise Component: MobileMenu
 * Architecture: Uses React Portals to render the overlay at the <body> level,
 * escaping the Header's CSS stacking context (backdrop-filter constraint).
 */
export const MobileMenu = ({
  specialties,
  companyName,
  logoInitials,
  contactPhone,
  displayPhone,
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  
  // SSR Safety: Track if the component has mounted on the client
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // 1. Mark as mounted only on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // 2. Auto-close menu when navigating to a new route
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // 3. Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // ==========================================================================
  // RENDER LOGIC
  // ==========================================================================
  
  // The interactive slide-over panel
  const mobileOverlay = (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Dark Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sliding Panel */}
      <div className="relative z-[101] w-full max-w-sm overflow-y-auto bg-brand-bg px-6 py-6 shadow-2xl ring-1 ring-gray-900/10 animate-slide-in-right">
        
        {/* Mobile Header: Logo & Close Button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-lg tracking-wider">
              {logoInitials}
            </div>
            <span className="font-extrabold text-xl tracking-tight text-brand-text truncate max-w-[200px]">
              {companyName}
            </span>
          </Link>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-brand-text hover:text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-7 w-7" aria-hidden="true" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-100">
            <div className="space-y-2 py-6">
              
              <Link href="/facilities" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-brand-text hover:bg-gray-50 hover:text-brand-primary transition-colors">
                Hospitals
              </Link>
              <Link href="/facilities" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-brand-text hover:bg-gray-50 hover:text-brand-primary transition-colors">
                How it Works?
              </Link>
              <Link href="/patient-journey" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-brand-text hover:bg-gray-50 hover:text-brand-primary transition-colors">
                Hospitals
              </Link>
              <Link href="/why-queretaro" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-brand-text hover:bg-gray-50 hover:text-brand-primary transition-colors">
                Why Queretaro?
              </Link>

              {/* Dynamic Specialties Section */}
              <div className="pt-4 pb-2">
                <p className="text-sm font-bold text-brand-primary mb-2 uppercase tracking-wider">Specialties</p>
                <div className="space-y-1 pl-3 border-l-2 border-brand-primary/20">
                  <Link href="/doctors" className="block rounded-lg py-2 text-sm font-semibold text-brand-text hover:text-brand-primary transition-colors">
                    View All Specialties &rarr;
                  </Link>
                  {specialties.map((spec) => (
                    <Link
                      key={spec.id}
                      href={`/doctors?specialty=${spec.slug}`}
                      className="block rounded-lg py-2 text-sm text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      {spec.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="py-6">
              <a
                href={`tel:${contactPhone}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-accent px-4 py-3 text-base font-bold text-white shadow-sm hover:brightness-110 transition-all"
              >
                <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                Call Now: {displayPhone}
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )

  return (
    <div className="lg:hidden">
      {/* 
        Trigger Button (Hamburger) 
        This renders naturally inside the Header DOM structure.
      */}
      <button
        type="button"
        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-brand-text hover:text-brand-primary transition-colors"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
      >
        <span className="sr-only">Open main menu</span>
        <Bars3Icon className="h-7 w-7" aria-hidden="true" />
      </button>

      {/* 
        ENTERPRISE FIX: React Portal
        Teleports the overlay HTML directly into the <body> tag, escaping the 
        <header> stacking context and guaranteeing it overlays the entire screen.
      */}
      {mounted && isOpen && createPortal(mobileOverlay, document.body)}
    </div>
  )
}