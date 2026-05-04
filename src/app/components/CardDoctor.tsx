// src/components/CardDoctor.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Doctor, Media, Specialty } from '@/payload-types'

interface CardDoctorProps {
  doctor: Doctor
}

export const CardDoctor = ({ doctor }: CardDoctorProps) => {
  const profilePicture = doctor.profilePicture as Media | undefined
  const specialties = doctor.specialties as Specialty[] | undefined

  return (
    <article className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative w-full h-64 bg-gray-50">
        {profilePicture?.url ? (
          <Image
            src={profilePicture.url}
            alt={profilePicture.alt || `Portrait of ${doctor.fullName}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <header>
          {/* ✅ UPDATED: Using dynamic text color if needed, or keeping high-contrast gray */}
          <h3 className="text-xl font-bold text-brand-text mb-1">
            {doctor.fullName}
          </h3>
         {/* <p className="text-sm text-gray-500 mb-4 font-mono">
            Lic: {doctor.medicalLicense}
          </p>*/}
        </header>

        {specialties && specialties.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-6">
            {specialties.map((specialty) => (
              <li
                key={specialty.id}
                // ✅ UPDATED: Dynamic primary color for the border and text. 
                // We avoid bg-opacity here because Hex CSS vars break Tailwind opacity classes.
                className="px-3 py-1 border border-brand-primary text-brand-primary text-xs font-semibold rounded-full"
              >
                {specialty.title}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link
            href={`/doctors/${doctor.slug}`}
            // ✅ UPDATED: Dynamic background color. 
            // PRO-TIP: We use hover:brightness-110 instead of a specific color variant
            className="block w-full text-center px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
            aria-label={`View full profile of ${doctor.fullName}`}
          >
            View Profile
          </Link>
        </div>
      </div>
    </article>
  )
}