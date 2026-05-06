// src/app/(frontend)/page.tsx
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import Image from 'next/image';
import Link from 'next/link';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; specialty?: string }>;
}) {
  const { q, specialty } = await searchParams;
  const payload = await getPayload({ config: configPromise });

  // 1. Traemos las especialidades reales para el menú
  const { docs: allSpecialties } = await payload.find({
    collection: 'specialties',
    sort: 'name',
    limit: 100,
  });

  // 2. Ajustamos el filtro (whereClause)
  const whereClause: any = {};
  if (q) whereClause.name = { contains: q };
  
  // IMPORTANTE: Al ser relación, filtramos por el ID de la especialidad
  if (specialty && specialty !== 'all') {
    whereClause.specialty = { equals: specialty };
  }

  const { docs: doctors } = await payload.find({
    collection: 'doctors',
    where: whereClause,
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* SECCIÓN HERO */}
      <section className="relative bg-blue-900 py-20 lg:py-32 overflow-hidden">
        {/* 1. IMAGEN DE FONDO (Reemplaza la URL por la tuya real) */}
  <div className="absolute inset-0 z-0">
    <Image
      src="https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/16/38/c6/40/8b/v1_E11/E117OW06.jpg?w=1600&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=1968228562e3f1ac81aff123d89abafcc51bfe5b336a70b538b1fdc533650720" // Ejemplo: Hospital Moderno
      alt="Modern Medical Facilities in Queretaro"
      fill
      priority
      className="object-cover object-center"
      sizes="100vw"
    />
    {/* 2. SUPERPOSICIÓN OSCURA (Overlay) para legibilidad */}
    <div className="absolute inset-0 bg-blue-750/60 backdrop-blur-[2px]"></div>
  </div>
        {/* Decoración de fondo (Opcional: puedes usar una imagen de fondo aquí) */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className=" mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:items-center gap-12">
            
            {/* Texto del Hero */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-800 text-blue-100 text-sm font-bold mb-6 tracking-wide uppercase">
                Trusted Medical Care in Mexico
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                World-Class Doctors <br />
                <span className="text-blue-400 text-3xl md:text-5xl">At a Fraction of the Cost</span>
              </h1>
              <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto lg:mx-0">
                Connect with board-certified specialists in Queretaro. 
                Save up to 60% on premium medical procedures without compromising quality.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <span className="text-blue-400 font-bold">✓</span> Certified Specialists
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <span className="text-blue-400 font-bold">✓</span> English-Speaking Staff
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <span className="text-blue-400 font-bold">✓</span> Modern Facilities
                </div>
              </div>
            </div>

            {/* BUSCADOR INTEGRADO EN EL HERO */}
            <div id="search" className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100 transition-transform hover:scale-[1.02]">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                Start your treatment here
              </h2>
              <form className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">What are you looking for?</label>
                  <input 
                    name="q" 
                    defaultValue={q} 
                    placeholder="Doctor name or procedure..." 
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Specialty</label>
                  <select 
                    name="specialty" 
                    defaultValue={specialty || 'all'}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none appearance-none text-gray-900"
                  >
                    <option value="all">All Specialties</option>
                    {allSpecialties.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 transition-all uppercase tracking-widest mt-2"
                >
                  Search Specialists
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
           <div>
              <h2 className="text-3xl font-black text-gray-900">Featured Specialists</h2>
              <p className="text-gray-500 font-medium">Discover top-rated doctors in Queretaro</p>
           </div>
           
           
        </div><div className="max-w-7xl mx-auto">


        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => {
            const profilePic = doctor.profilePicture && typeof doctor.profilePicture !== 'string' 
              ? doctor.profilePicture 
              : null;

            return (
              <Link href={`/doctors/${doctor.slug}`} key={doctor.slug} className="group">
                <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
  
            {/* 1. INFO DEL DOCTOR: Primero en móvil, Segundo en Desktop */}
            <div className="p-6 order-1 md:order-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {Array.isArray(doctor.specialties) && doctor.specialties.map((spec: any) => (
                  <span key={spec.id} className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {typeof spec === 'object' ? spec.name : 'Specialist'}
                  </span>
                ))}
              </div>
              
              <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                {doctor.fullName}
              </h3>
            </div>

            {/* 2. IMAGEN: Segundo en móvil, Primero en Desktop */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 order-2 md:order-1">
            {profilePic?.url ? (
                      <Image
                        src={profilePic.url}
                        alt={doctor.fullName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-bold uppercase text-xs">No Photo</div>
            )}
              </div>

            {/* 3. BOTÓN: Siempre al final */}
            <div className="p-6 pt-0 mt-2 order-3">
              <Link 
                href={`/doctors/${doctor.slug}`}
                className="block w-full text-center bg-gray-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
              >
                View Profile
              </Link>
            </div>
          </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏜️</div>
            <h3 className="text-2xl font-bold text-gray-900">No doctors found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters to find more results.</p>
            <Link href="/" className="inline-block mt-6 text-blue-600 font-semibold hover:underline">
              Clear all filters
            </Link>
          </div>
        )}
      </div>
        </section>
      
    </main>
  );
}