// src/components/Header/Header.tsx
import Link from 'next/link'
import { PhoneIcon } from '@heroicons/react/20/solid'
import { getActiveSpecialtiesForMenu } from '@/lib/navigation'
import { SpecialtiesDropdown } from './SpecialtiesDropdown'
import { MobileMenu } from './MobileMenu'

interface HeaderProps {
  companyName?: string | null
  contactPhone?: string | null
  displayPhone?: string | null
}

export const Header = async ({ companyName, contactPhone, displayPhone }: HeaderProps) => {
  const activeSpecialties = await getActiveSpecialtiesForMenu()

  // Fallbacks strictly for resilience if the Payload CMS is empty
  const safeHref = contactPhone ? `tel:${contactPhone}` : '#'
  const safeDisplay = displayPhone || 'Contact Us'
const rawCompanyName = companyName || 'Queretaro Medical'

// ==========================================================================
  // DYNAMIC BRANDING LOGIC
  // ==========================================================================
  
  // 1. Generate dynamic initials for the Logo Box (e.g., "Vzsoluciones Medical" -> "VM")
  const nameWords = rawCompanyName.trim().split(' ')
  const logoInitials = nameWords.length > 1 
    ? `${nameWords[0][0]}${nameWords[1][0]}`.toUpperCase()
    : rawCompanyName.substring(0, 2)

  // 2. Split the name to maintain the two-color typography aesthetic
  const firstWord = nameWords[0]
  const restOfName = nameWords.slice(1).join(' ')

  return (
    <header className="border-b border-gray-100 sticky top-0 z-40 w-full backdrop-blur-md bg-brand-bg/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global Navigation">
        
        {/* Logo Section */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="sr-only">{companyName}</span>
            {/* ✅ UPDATED: Dynamic brand-primary background */}
            <div className="h-8 w-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              {logoInitials}
            </div>
            <span className="font-extrabold text-xl tracking-tight text-brand-text">
              {firstWord} <span className="text-brand-primary">{restOfName}</span>
            </span>
          </Link>
        </div>

{/* ==================================================================== */}
        {/* MOBILE MENU TRIGGER & COMPONENT (Hidden on Desktop 'lg')             */}
        {/* ==================================================================== */}
        <div className="flex lg:hidden">
          <MobileMenu 
            specialties={activeSpecialties}
            companyName={rawCompanyName}
            logoInitials={logoInitials}
            contactPhone={contactPhone || ''}
            displayPhone={safeDisplay}
          />
        </div>

        {/* Central Navigation Links */}
        <div className="hidden lg:flex lg:gap-x-8 items-center">
          <SpecialtiesDropdown specialties={activeSpecialties} />
          {/* ✅ UPDATED: hover:text-brand-primary */}
          <Link href="/facilities" className="text-sm font-semibold leading-6 text-brand-text hover:text-brand-primary transition-colors">
            Hospitals
          </Link>
          <Link href="/about" className="text-sm font-semibold leading-6 text-brand-text hover:text-brand-primary transition-colors">
            Why Us?
          </Link>
        </div>

        {/* Click-to-Call Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a 
            href={safeHref}
            // ✅ UPDATED: bg-brand-accent for high conversion contrast
            className="group flex items-center gap-2 whitespace-nowrap text-sm font-bold leading-6 text-white bg-brand-accent hover:brightness-110 px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
            aria-label={`Call our medical coordinators directly at ${safeDisplay}`}
          >
            <PhoneIcon 
              className="h-4 w-4 shrink-0 text-white/80 group-hover:text-white group-hover:animate-pulse transition-colors" 
              aria-hidden="true" 
            />
            {safeDisplay}
          </a>
        </div>

      </nav>
    </header>
  )
}