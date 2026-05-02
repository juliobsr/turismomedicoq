import Image from 'next/image'
import Link from 'next/link'

export default function CardDoctor({ doctor }: { doctor: any }) {
  const profilePic = doctor.profilePicture && typeof doctor.profilePicture !== 'string' 
    ? doctor.profilePicture.url 
    : null;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {profilePic ? (
          <Image
            src={profilePic}
            alt={doctor.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 font-bold uppercase text-xs">
            No Photo
          </div>
        )}
        
        {/* CONTENEDOR DE BADGES DINÁMICO */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
          {doctor.specialty?.map((spec: any, index: number) => (
            <span 
              key={index}
              className="bg-white/90 backdrop-blur-md text-blue-700 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider whitespace-nowrap"
            >
              {typeof spec === 'object' ? spec.name : 'Specialist'}
            </span>
          ))}
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-4">
          Dr. {doctor.name}
        </h3>
        
        {/* Footer de la tarjeta con botón */}
        <div className="mt-auto">
          <Link 
            href={`/doctors/${doctor.id}`}
            className="inline-flex items-center justify-center w-full bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300"
          >
            View Professional Profile
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}