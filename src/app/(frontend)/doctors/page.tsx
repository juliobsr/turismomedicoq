import { getPayload } from 'payload'
import configPromise from '@payload-config'
import CardDoctor from '@/app/components/CardDoctor'
import Link from 'next/link'
import { Where } from 'payload'
import { Doctor } from '@/payload-types'
export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string }>
}) {
  // 1. Extraer los parámetros de búsqueda
  const { specialty: specialtySlug } = await searchParams
  const payload = await getPayload({ config: configPromise })

  let doctors: Doctor[] = []
  let displayTitle = 'All Specialists'

  try {
    let whereQuery: Where = {}

    // 2. Si hay un slug en la URL, buscamos el ID de esa especialidad primero
    if (specialtySlug && specialtySlug !== 'all') {
      const specialtyData = await payload.find({
        collection: 'specialties',
        where: {
          slug: { equals: specialtySlug },
        },
        limit: 1,
      })

      if (specialtyData.docs.length > 0) {
        const targetSpecialty = specialtyData.docs[0]
        displayTitle = targetSpecialty.name
        
        // Filtramos doctores que CONTENGAN este ID de especialidad
        whereQuery = {
          specialty: {
            contains: targetSpecialty.id,
          },
        }
      }
    }

    // 3. Ejecutar la búsqueda de doctores
    const response = await payload.find({
      collection: 'doctors',
      where: whereQuery,
      depth: 2, // Para traer la info completa de especialidades y fotos
      limit: 100,
    })
    
    doctors = response.docs

  } catch (error) {
    console.error("Error fetching doctors:", error)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado de la página */}
        <div className="mb-12 border-l-4 border-blue-600 pl-6">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase">
            {displayTitle} <span className="text-blue-600 block md:inline">in Queretaro</span>
          </h1>
          <p className="mt-2 text-gray-500 font-medium italic">
            {doctors.length > 0 
              ? `Showing ${doctors.length} world-class specialists available for you.`
              : "We couldn't find matches for your current selection."}
          </p>
        </div>

        {/* Cuadrícula de Doctores */}
        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <CardDoctor key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          /* Estado Vacío / No hay resultados */
          <div className="bg-white rounded-[2rem] p-16 text-center border border-gray-100 shadow-sm">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We don't have doctors registered in this specialty yet, or the category doesn't exist.
            </p>
            <Link 
              href="/doctors" 
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
            >
              See All Doctors
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}