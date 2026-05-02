// src/components/Header.tsx
import Link from 'next/link'
import MobileMenu from '@/app/components/MobileMenu'
import { NAV_LINKS, CONTACT_INFO } from '@/lib/navigation'      
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function Header() {
  const payload = await getPayload({ config: configPromise });

  // 1. Obtener especialidades que tienen doctores (mismo filtro que antes)
  const doctorsRes = await payload.find({
    collection: 'doctors',
    limit: 1000,
    depth: 1, // Necesitamos profundidad 1 para ver el objeto de especialidad
  });

  // Extraer especialidades únicas de los doctores encontrados
  const activeSpecialtiesMap = new Map();
  doctorsRes.docs.forEach(doc => {
    if (Array.isArray(doc.specialty)) {
      doc.specialty.forEach((s: any) => {
        if (typeof s === 'object') {
          activeSpecialtiesMap.set(s.slug || s.id, s.name);
        }
      });
    }
  });

  const dynamicSubmenu = Array.from(activeSpecialtiesMap).map(([slug, name]) => ({
    label: name,
    href: `/doctors?specialty=${slug}`
  }));

  // 2. Enriquecer NAV_LINKS con la data real
  const finalNavLinks = NAV_LINKS.map(link => {
    if (link.label === 'Find a Doctor') {
      return {
        ...link,
        submenu: [
          { label: 'All Specialists', href: '/doctors' },
          ...dynamicSubmenu
        ]
      };
    }
    return link;
  });
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Nombre */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                Qm
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight hidden md:flex    ">
                Queretaro Medical
              </span>
            </Link>
          </div>

          {/* Navegación Desktop: AHORA DINÁMICA */}
      {/* Navegación Desktop */}
      <nav className="hidden md:flex space-x-8 h-full">
            {finalNavLinks.map((link) => (
              <div key={link.label} className="relative group h-full flex items-center">
                <Link href={link.href} className="text-gray-600 hover:text-blue-600 font-bold text-sm flex items-center gap-1">
                  {link.label}
                  {link.submenu && <span className="text-[8px] transition-transform group-hover:rotate-180">▼</span>}
                </Link>

                {link.submenu && (
                  <div className="absolute top-[80px] left-0 w-64 bg-white shadow-2xl rounded-2xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {link.submenu.map((sub) => (
                      <Link key={sub.href} href={sub.href} className="block px-5 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>


          {/* Botón CTA Móvil/Desktop */}
          <div className="flex items-center hidden md:flex">
            <a href="tel:${CONTACT_INFO.tel}" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-4 py-2 rounded-full py-2 sm:px-6 sm:py-2.5 text-sm transition-colors border border-blue-200">
              Give us a call <span className='hidden md:inline-flex'>{CONTACT_INFO.phone}</span>
            </a>
          </div>
          {/* LAS TRES LÍNEAS (Solo se ven en móvil) */}
  {/* AQUÍ ESTÁ LA CORRECCIÓN: Pasar la prop navLinks */}
  <MobileMenu navLinks={finalNavLinks} />
        </div>
        
      </div>
      
    </header>
  )
}