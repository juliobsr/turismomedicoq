// src/components/Footer/Footer.tsx
import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { primaryNavigation } from '@/lib/siteNavigation'

// In a real scenario, this comes from your generated @/payload-types
interface Address {
  street?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  country?: string | null
}

interface SiteSettings {
  companyName?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  address?: Address | null
}

interface FooterProps {
  settings?: SiteSettings | null
}

/**
 * Enterprise Component: Global Footer
 * Architecture: Static Server Component relying on injected CMS Globals.
 * SEO: Uses semantic HTML (<address>, <nav>) for Local SEO signals.
 */
export const Footer = ({ settings }: FooterProps) => {
  // 1. Fallbacks for resilience
  const companyName = settings?.companyName || 'Queretaro Medical'
  const currentYear = new Date().getFullYear()

  // 2. Dynamic Branding Logic (Matching the Header)
  const nameWords = companyName.trim().split(' ')
  const logoInitials = nameWords.length > 1 
    ? `${nameWords[0][0]}${nameWords[1][0]}`.toUpperCase()
    : companyName.substring(0, 2).toUpperCase()

  const firstWord = nameWords[0]
  const restOfName = nameWords.slice(1).join(' ')

  return (
    <footer className="bg-gray-900 border-t border-gray-100 pt-16 pb-8 transition-colors duration-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* =============================================================== */}
          {/* COLUMN 1: Brand & Description                                   */}
          {/* =============================================================== */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 p-6 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-lg tracking-wider" aria-hidden="true">
                {logoInitials}
              </div>
              <span className="font-extrabold text-xl tracking-tight text-brand-primary">
                {firstWord.toUpperCase()}
                {restOfName && <span className="text-white ml-1">{restOfName}</span>}
              </span>
            </Link>
            <p className="text-sm leading-6 text-gray-300 max-w-xs">
              World-class medical procedures with internationally accredited specialists. Your health, our priority.
            </p>
            {/* Placeholder for Social Media Icons */}
            <div className="flex space-x-6">
              <a href="#" className="text-gray-200 hover:text-brand-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-gray-200 hover:text-brand-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
          
          {/* =============================================================== */}
          {/* COLUMNS 2 & 3: Navigation Links                                 */}
          {/* =============================================================== */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold leading-6 text-brand-primary">NAVIGATION</h3>
                <nav className="mt-6 space-y-4">
                  {primaryNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-sm leading-6 text-gray-200 hover:text-brand-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-bold leading-6 text-brand-primary">PATIENT RESOURCES</h3>
                <nav className="mt-6 space-y-4">
                  <Link href="/medical-tourism-mexico" className="block text-sm leading-6 text-gray-200 hover:text-brand-primary transition-colors">Medical Tourism in Mexico</Link>
                  <Link href="/affordable-medical-treatments-mexico" className="block text-sm leading-6 text-gray-200 hover:text-brand-primary transition-colors">Affordable Treatments Mexico</Link>
                  <Link href="/medical-tourism-mexico-costs" className="block text-sm leading-6 text-gray-200 hover:text-brand-primary transition-colors">Treatment Costs Guide</Link>
                  <Link href="/procedures/endoscopic-spine-surgery-queretaro" className="block text-sm leading-6 text-gray-200 hover:text-brand-primary transition-colors">Endoscopic Spine Surgery</Link>
                  <Link href="/facilities/hospital-angeles-centro-sur" className="block text-sm leading-6 text-gray-200 hover:text-brand-primary transition-colors">Hospital Ángeles Centro Sur</Link>
                  <Link href="/doctors/dr-jose-larrinua" className="block text-sm leading-6 text-gray-200 hover:text-brand-primary transition-colors">Dr. Larrinua Profile</Link>
                </nav>
              </div>
            </div>

            {/* =============================================================== */}
            {/* COLUMN 4: Contact & Location (Semantic <address>)               */}
            {/* =============================================================== */}
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-bold leading-6 text-brand-primary">REACH OUT</h3>
                {/* 
                  The <address> tag is crucial for Local SEO. 
                  It must only contain contact info.
                */}
                <address className="mt-6 space-y-4 not-italic">
                  {settings?.contactPhone && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5 text-gray-200" aria-hidden="true" />
                      <a href={`tel:${settings.contactPhone}`} className="text-sm leading-6 text-gray-200 hover:text-brand-primary transition-colors">
                        {settings.contactPhone}
                      </a>
                    </div>
                  )}
                  {settings?.contactEmail && (
                    <div className="flex items-center gap-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-200" aria-hidden="true" />
                      <a href={`mailto:${settings.contactEmail}`} className="text-sm leading-6 text-gray-200 hover:text-brand-primary transition-colors">
                        {settings.contactEmail}
                      </a>
                    </div>
                  )}
                  {settings?.address?.street && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-brand-primary mt-1 shrink-0" aria-hidden="true" />
                      <span className="text-sm leading-6 text-gray-200">
                        {settings.address.street}<br />
                        {settings.address.city}, {settings.address.state} {settings.address.zipCode}<br />
                        {settings.address.country}
                      </span>
                    </div>
                  )}
                </address>
              </div>
            </div>

          </div>
        </div>
        
        {/* =============================================================== */}
        {/* BOTTOM SECTION: Copyright & Legal                               */}
        {/* =============================================================== */}
        <div className="mt-16 border-t border-gray-100 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-gray-200">
            &copy; {currentYear} {companyName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-200">
            <Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
