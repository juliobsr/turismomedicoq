import Link from 'next/link'
import { NAV_LINKS, CONTACT_INFO } from '@/lib/navigation'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Marca */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                Qm
              </div>
              <span className="font-black text-xl tracking-tighter text-white">
                QUERETARO <span className="text-blue-400">MEDICAL</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Connecting international patients with top-tier, board-certified medical specialists in Queretaro, Mexico. Quality care you can trust.
            </p>
          </div>

          {/* Columna 2: Navegación (Usando NAV_LINKS) */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-blue-400">📍</span>
                <span>Queretaro, Qro. Mexico</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">📞</span>
                <a href={`tel:${CONTACT_INFO.tel}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">✉️</span>
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Disclaimer Médico */}
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-800">
            <h4 className="text-white font-bold mb-4 uppercase text-[10px] tracking-widest">Medical Disclaimer</h4>
            <p className="text-[11px] leading-relaxed text-gray-500">
              The information provided on Queretaro Medical is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
            </p>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} Queretaro Medical. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}