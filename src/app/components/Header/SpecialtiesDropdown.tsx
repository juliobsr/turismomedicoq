// src/components/Header/SpecialtiesDropdown.tsx
'use client'

import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/20/solid' // Ensure you have @heroicons/react installed
import type { Specialty } from '@/payload-types'

interface SpecialtiesDropdownProps {
  specialties: Specialty[]
}

/**
 * Enterprise Component: SpecialtiesDropdown
 * Architecture: Client Component for focus management, but visually driven by CSS (Tailwind group-hover)
 * SEO Impact: Renders semantic <a> tags directly into the HTML payload for Googlebot.
 */
export const SpecialtiesDropdown = ({ specialties }: SpecialtiesDropdownProps) => {
  return (
    <div className="relative group inline-block z-50">
      {/* Primary Trigger Button */}
      <button 
        className="flex items-center gap-x-1 font-semibold text-gray-900 hover:text-blue-600 transition-colors py-2"
        aria-expanded="false"
        aria-haspopup="true"
      >
        Find a Doctor
        <ChevronDownIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" aria-hidden="true" />
      </button>

      {/* 
        Dropdown Menu: Hidden by default, shown on group-hover.
        Invisible/opacity-0 ensures it doesn't block clicks when closed, but transitions smoothly.
      */}
      <div className="absolute left-0 mt-2 w-64 origin-top-left rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100">
        <div className="p-2" role="menu" aria-orientation="vertical">
          
          {/* STATIC OPTION: All Specialties */}
          <Link
            href="/doctors"
            className="block rounded-lg px-4 py-2.5 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors mb-1"
            role="menuitem"
          >
            All Specialties
          </Link>

          {/* DYNAMIC OPTIONS: Populated from Database */}
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {specialties.length > 0 ? (
              specialties.map((spec) => (
                <Link
                  key={spec.id}
                  href={`/doctors?specialty=${spec.slug}`}
                  className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  role="menuitem"
                >
                  {spec.title}
                </Link>
              ))
            ) : (
              <span className="block px-4 py-2 text-sm text-gray-400 italic">
                Directory updating...
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}