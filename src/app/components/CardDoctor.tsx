import Image from 'next/image'
import Link from 'next/link'
import type { Doctor, MedicalAsset, Specialty } from '@/payload-types'

interface CardDoctorProps {
  doctor: Doctor
}

export const CardDoctor = ({ doctor }: CardDoctorProps) => {
  const profilePicture = doctor.profilePicture as MedicalAsset | undefined
  const specialties = doctor.specialties as Specialty[] | undefined

  return (
    <Link
      href={`/doctors/${doctor.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
      aria-label={`View full profile of ${doctor.fullName}`}
    >
      <div className="relative h-64 w-full overflow-hidden bg-gray-50">
        {profilePicture?.url ? (
          <Image
            src={profilePicture.url}
            alt={profilePicture.alt || `Portrait of ${doctor.fullName}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col p-6">
        <header>
          <h3 className="mb-1 text-xl font-bold text-brand-text transition-colors group-hover:text-brand-primary">
            {doctor.fullName}
          </h3>
        </header>

        {specialties && specialties.length > 0 && (
          <ul className="mb-6 flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <li
                key={specialty.id}
                className="rounded-lg border border-brand-primary px-3 py-1 text-xs font-semibold text-brand-primary"
              >
                {specialty.title}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto border-t border-gray-100 pt-4">
          <span className="block w-full rounded-lg bg-brand-primary px-4 py-2 text-center font-medium text-white transition-all group-hover:brightness-110">
            View Profile
          </span>
        </div>
      </div>
    </Link>
  )
}
