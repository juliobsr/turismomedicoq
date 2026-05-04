// src/components/Directory/SpecialtyFilter.tsx
'use client'

import { useRouter } from 'next/navigation'
import type { Specialty } from '@/payload-types'

interface SpecialtyFilterProps {
  specialties: Specialty[]
  currentSlug?: string
}

/**
 * Enterprise Component: SpecialtyFilter
 * Architecture: Client Component handling URL-driven state for SEO-friendly filtering.
 * Prevents client-side heavy filtering and leaves the heavy lifting to PostgreSQL.
 */
export const SpecialtyFilter = ({ specialties, currentSlug }: SpecialtyFilterProps) => {
  const router = useRouter()

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = event.target.value

    // Push the new state to the URL. Next.js App Router will automatically 
    // trigger a Server Component re-render with the new searchParams.
    if (selectedSlug === 'all') {
      router.push('/doctors', { scroll: false }) // Prevent jumping to top
    } else {
      router.push(`/doctors?specialty=${selectedSlug}`, { scroll: false })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in w-full max-w-md mx-auto">
      <label htmlFor="specialty-filter" className="text-sm font-semibold text-gray-600">
        Filter by Specialty:
      </label>
      <div className="relative w-full">
        <select
          id="specialty-filter"
          value={currentSlug || 'all'}
          onChange={handleFilterChange}
          className="appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-shadow cursor-pointer shadow-sm font-medium"
          aria-label="Select a medical specialty"
        >
          <option value="all">All Specialties</option>
          
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.slug || ''}>
              {spec.title}
            </option>
          ))}
        </select>
        
        {/* Custom SVG chevron for cross-browser visual consistency */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}