// src/app/components/MobileMenu.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CONTACT_INFO } from '@/lib/navigation'
export default function MobileMenu({ navLinks = [] }: { navLinks?: any[] }){
  const [isOpen, setIsOpen] = useState(false)
  const [openSub, setOpenSub] = useState<string | null>(null)

  return (
    <div className="md:hidden">
      {/* Botón Hamburguesa (con la lógica de la X que ya teníamos) */}
      <button onClick={() => setIsOpen(!isOpen)} className="z-[60] relative p-2">
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`h-0.5 w-full bg-blue-900 transition-all ${isOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
          <span className={`h-0.5 w-full bg-blue-900 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-full bg-blue-900 transition-all ${isOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 pt-24 px-6 overflow-y-auto">
          <nav className="space-y-6">
            {navLinks.map((link) => (
              <div key={link.label} className="border-b border-gray-50 pb-4">
                <div className="flex justify-between items-center">
                  <Link 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-black text-gray-900"
                  >
                    {link.label}
                  </Link>
                  {link.submenu && (
                    <button 
                      onClick={() => setOpenSub(openSub === link.label ? null : link.label)}
                      className="p-2 bg-gray-50 rounded-lg text-blue-600 font-bold"
                    >
                      {openSub === link.label ? '−' : '+'}
                    </button>
                  )}
                </div>

                {/* SUBMENÚ MÓVIL */}
                {link.submenu && openSub === link.label && (
                  <div className="mt-4 ml-4 space-y-4 border-l-2 border-blue-100 pl-4 py-2">
                    {link.submenu.map((sub: any) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-gray-600 font-bold text-lg"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center">
            <a href="tel:${CONTACT_INFO.tel}" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-4 py-2 rounded-full py-2 sm:px-6 sm:py-2.5 text-sm transition-colors border border-blue-200">
              Give us a call <span className=''>{CONTACT_INFO.phone}</span>
            </a>
          </div>
          </nav>
        </div>
      )}
    </div>
  )
}