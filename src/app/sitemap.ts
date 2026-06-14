import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { PatientJourney as PatientJourneyType } from '@/payload-types'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elitemedicaljourney.com'

const absoluteUrl = (path: string) => `${siteUrl}${path}`

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: absoluteUrl('/'),
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: absoluteUrl('/procedures'),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: absoluteUrl('/medical-tourism-mexico'),
    changeFrequency: 'monthly',
    priority: 0.95,
  },
  {
    url: absoluteUrl('/affordable-medical-treatments-mexico'),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: absoluteUrl('/medical-tourism-mexico-costs'),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: absoluteUrl('/doctors'),
    changeFrequency: 'weekly',
    priority: 0.85,
  },
  {
    url: absoluteUrl('/facilities'),
    changeFrequency: 'weekly',
    priority: 0.85,
  },
  {
    url: absoluteUrl('/patient-journey'),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: absoluteUrl('/why-queretaro'),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })

  const [doctorsRes, proceduresRes, facilitiesRes, journeyData] = await Promise.all([
    payload.find({
      collection: 'doctors',
      depth: 0,
      limit: 1000,
      where: {
        isActive: { equals: true },
        slug: { exists: true },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    payload.find({
      collection: 'procedures',
      depth: 0,
      limit: 1000,
      where: {
        isActive: { equals: true },
        slug: { exists: true },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    payload.find({
      collection: 'facilities',
      depth: 0,
      limit: 1000,
      where: {
        isActive: { equals: true },
        slug: { exists: true },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    payload.findGlobal({ slug: 'patient-journey' }),
  ])

  const doctorRoutes: MetadataRoute.Sitemap = doctorsRes.docs
    .filter((doctor) => typeof doctor.slug === 'string' && doctor.slug.trim() !== '')
    .map((doctor) => ({
      url: absoluteUrl(`/doctors/${doctor.slug}`),
      lastModified: doctor.updatedAt ? new Date(doctor.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.75,
    }))

  const procedureRoutes: MetadataRoute.Sitemap = proceduresRes.docs
    .filter((procedure) => typeof procedure.slug === 'string' && procedure.slug.trim() !== '')
    .map((procedure) => ({
      url: absoluteUrl(`/procedures/${procedure.slug}`),
      lastModified: procedure.updatedAt ? new Date(procedure.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.85,
    }))

  const facilityRoutes: MetadataRoute.Sitemap = facilitiesRes.docs
    .filter((facility) => typeof facility.slug === 'string' && facility.slug.trim() !== '')
    .map((facility) => ({
      url: absoluteUrl(`/facilities/${facility.slug}`),
      lastModified: facility.updatedAt ? new Date(facility.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.75,
    }))

  const journey = journeyData as unknown as PatientJourneyType
  const recoveryRoutes: MetadataRoute.Sitemap = (journey.steps || [])
    .flatMap((step) => step.options || [])
    .map((option) => ({
      url: absoluteUrl(`/patient-journey/recovery/${slugify(option.title)}`),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }))

  return [
    ...staticRoutes,
    ...procedureRoutes,
    ...doctorRoutes,
    ...facilityRoutes,
    ...recoveryRoutes,
  ]
}
