// src/app/(frontend)/facilities/[slug]/page.tsx

import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { Facility, FacilitiesMedia, MedicalAsset, Specialty, Doctor } from '@/payload-types';

// Components
import { LexicalRenderer } from '@/app/components/LexicalRenderer';
import { FacilityGallery, type FacilityGalleryItem } from '@/app/components/Facilities/FacilityGallery';

interface FacilityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ISR: Revalidate the static page every hour to keep doctor rosters and gallery fresh
export const revalidate = 3600; 

const publicFacilityMedia = (asset?: FacilitiesMedia): FacilitiesMedia | undefined => {
  if (!asset?.filename?.startsWith('hospital-angeles-')) return asset

  return {
    ...asset,
    url: `/media/facilities/${asset.filename}`,
  }
}

const isImageMedia = (asset?: FacilitiesMedia): asset is FacilitiesMedia => {
  if (!asset?.url) return false
  return !asset.mimeType || asset.mimeType.startsWith('image/')
}

const isVideoMedia = (asset?: FacilitiesMedia): asset is FacilitiesMedia => {
  return Boolean(asset?.url && asset.mimeType?.startsWith('video/'))
}

type FacilityVideoLink = NonNullable<Facility['infrastructureVideoLinks']>[number]

/**
 * Enterprise Architecture: Static Path Generation (SSG)
 * Pre-renders all active facilities at build time for maximum performance.
 */
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  
  const { docs } = await payload.find({
    collection: 'facilities',
    limit: 1000,
    where: { 
      isActive: { equals: true },
      slug: { exists: true },
    },
    select: { slug: true },
  });

  return docs
    .filter((doc) => typeof doc.slug === 'string' && doc.slug.trim() !== '')
    .map((doc) => ({
      slug: String(doc.slug),
    }));
}

/**
 * Enterprise Architecture: Dynamic SEO Metadata
 */
export async function generateMetadata({ params }: FacilityPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const payload = await getPayload({ config: configPromise });
  
  const { docs } = await payload.find({
    collection: 'facilities',
    where: { slug: { equals: resolvedParams.slug }, isActive: { equals: true } },
    depth: 1, // Depth 1 to access heroImage URL
  });

  const facility = docs[0] as Facility | undefined;
  if (!facility) return {};

  const heroMedia = publicFacilityMedia(facility.heroImage as FacilitiesMedia | undefined);
  const primaryImage = isImageMedia(heroMedia) ? heroMedia.url : undefined;

  const title = `${facility.name} | Tier 1 Private Hospital in Queretaro`
  const description = `Explore ${facility.name}, a Tier 1 private hospital environment in Queretaro with advanced technology, modern infrastructure and specialist care for international patients.`

  return {
    title,
    description,
    alternates: {
      canonical: `/facilities/${resolvedParams.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: primaryImage ? [primaryImage] : [],
    },
  };
}

/**
 * Enterprise Page: Facility Profile
 */
export default async function FacilityDetailPage({ params }: FacilityPageProps) {
  const resolvedParams = await params;
  const payload = await getPayload({ config: configPromise });

  // Fetch with Depth 2 to fully populate specialties, doctors, and gallery media
  const { docs } = await payload.find({
    collection: 'facilities',
    where: { slug: { equals: resolvedParams.slug }, isActive: { equals: true } },
    depth: 2, 
  });

  const facility = docs[0] as Facility | undefined;
  
  if (!facility) {
    notFound();
  }

  // Defensive Type Casting and Safety Fallbacks
  const heroMedia = publicFacilityMedia(facility.heroImage as FacilitiesMedia | undefined);
  const heroIsVideo = Boolean(heroMedia?.url && heroMedia.mimeType?.startsWith('video/'));
  const heroIsImage = Boolean(heroMedia?.url && (!heroMedia.mimeType || heroMedia.mimeType.startsWith('image/')));
  const specialties = (facility.specialtiesOffered as Specialty[] | undefined) || [];
  const doctors = (facility.doctors as Doctor[] | undefined) || [];
  const galleryMedia = ((facility.infrastructureGallery as FacilitiesMedia[] | undefined) || [])
    .map(publicFacilityMedia)
    .filter((asset): asset is FacilitiesMedia => Boolean(asset?.url));
  const galleryVideoLinks = (facility.infrastructureVideoLinks || []).filter(
    (item): item is FacilityVideoLink => Boolean(item?.url)
  );
  const galleryItems: FacilityGalleryItem[] = [
    ...galleryMedia
      .filter((asset) => isImageMedia(asset) || isVideoMedia(asset))
      .map((asset) => (
        isVideoMedia(asset)
          ? ({ type: 'video', media: asset } as const)
          : ({ type: 'image', media: asset } as const)
      )),
    ...galleryVideoLinks.map((item) => {
      const thumbnail = typeof item.thumbnail === 'object' && item.thumbnail
        ? publicFacilityMedia(item.thumbnail)
        : undefined;

      return {
        type: 'videoLink',
        title: item.title,
        url: item.url,
        caption: item.caption,
        thumbnail: thumbnail && isImageMedia(thumbnail) ? thumbnail : undefined,
      } as const;
    }),
  ];
  const isHospitalAngeles = facility.slug === 'hospital-angeles-centro-sur'

  const premiumPoints = [
    {
      title: 'Tier 1 private-hospital environment',
      description:
        'Designed for complex specialty care, privacy, comfort and international patient confidence.',
      icon: ShieldCheckIcon,
    },
    {
      title: 'Advanced technology platform',
      description:
        'Public hospital information highlights modern facilities, imaging, laboratory, intensive care and surgical areas.',
      icon: CpuChipIcon,
    },
    {
      title: 'Specialist medical staff ecosystem',
      description:
        'A high-caliber private network where leading specialists can coordinate care inside a modern hospital setting.',
      icon: UserGroupIcon,
    },
  ]

  /**
   * JSON-LD: MedicalClinic Schema
   * Critical for Local SEO and Knowledge Graph integration.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: facility.name,
    image: heroIsImage ? heroMedia?.url : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: facility.city,
      addressCountry: 'MX'
    },
    medicalSpecialty: specialties.map(s => s.title).join(', '),
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 🚀 SEO: Injecting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section with LCP Optimization */}
      <section className="relative min-h-[680px] w-full bg-slate-900">
        {heroIsVideo && heroMedia?.url ? (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={heroMedia.alt || `${facility.name} facility video`}
          >
            <source src={heroMedia.url!} type={heroMedia.mimeType || 'video/mp4'} />
          </video>
        ) : heroIsImage && heroMedia?.url ? (
          <Image
            src={heroMedia.url!}
            alt={heroMedia.alt || facility.name}
            fill
            className="object-cover opacity-55"
            priority // Critical for Core Web Vitals (LCP)
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-slate-950/55" />
        
        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl flex-col justify-end px-4 py-16">
          <div className="max-w-4xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
              <BuildingOffice2Icon className="h-4 w-4" />
              {facility.city}
            </span>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
              {facility.name}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100 md:text-xl">
              A Tier 1 private hospital environment in Queretaro for patients who expect advanced technology, elite specialist care and a recovery setting that feels secure, modern and well coordinated.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/doctors/dr-jose-larrinua"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-slate-100"
              >
                View specialist
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/patient-journey"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/35 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              >
                Plan patient journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-8 text-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3">
          {premiumPoints.map((point) => {
            const Icon = point.icon

            return (
              <article key={point.title} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <Icon className="h-7 w-7 text-blue-300" />
                <h2 className="mt-4 text-lg font-extrabold">{point.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{point.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 py-16 lg:grid-cols-3">
        
        {/* Left Column: Description & Gallery */}
        <div className="lg:col-span-2 space-y-12">
          <div className="rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Private hospital profile
            </p>
            
            {/* Assuming description is RichText (Lexical) from Payload */}
            {facility.description ? (
              <LexicalRenderer data={facility.description} className="mt-6" />
            ) : (
              <p className="text-slate-500 italic">No description available.</p>
            )}
          </div>

          {isHospitalAngeles && (
            <section className="rounded-lg bg-[#eef5f2] p-8 ring-1 ring-emerald-100 md:p-10">
              <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
                    US patient standard
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                    Designed to stand shoulder to shoulder with premium private care expectations.
                  </h2>
                </div>
                <div className="space-y-4">
                  {[
                    'Advanced operating, intensive care, imaging, laboratory and hospitalization environments.',
                    'A medical staff ecosystem capable of supporting high-complexity specialty care.',
                    'A Centro Sur location that makes post-treatment logistics easier for patients and companions.',
                  ].map((item) => (
                    <p key={item} className="flex gap-3 text-sm font-semibold leading-6 text-slate-700">
                      <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Infrastructure Gallery Client Component */}
          {galleryItems.length > 0 && (
            <div className="mt-12">
              <div className="mb-6 flex items-end justify-between gap-6">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                    Visual tour
                  </p>
                  <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    Infrastructure Gallery
                  </h3>
                </div>
                <SparklesIcon className="hidden h-8 w-8 text-blue-700 md:block" />
              </div>
              {/* Reusing a client-side Lightbox gallery approach */}
              <FacilityGallery items={galleryItems} />
            </div>
          )}
        </div>

        {/* Right Column: Relationships (Specialties & Doctors) */}
        <aside className="space-y-10">
          
          {/* Specialties Widget */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Medical Departments
            </h3>
            {specialties.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {specialties.map(spec => (
                  <li key={spec.id} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    {spec.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">Departments updating soon.</p>
            )}
          </div>

          {/* Doctors Widget */}
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/50">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Our Specialists Here
            </h3>
            {doctors.length > 0 ? (
              <div className="space-y-4">
                {doctors.map(doc => (
                  <Link 
                    key={doc.id} 
                    href={`/doctors/${doc.slug}`}
                    className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 relative shrink-0">
                      {(doc.profilePicture as MedicalAsset)?.url && (
                        <Image 
                          src={(doc.profilePicture as MedicalAsset).url!} 
                          alt={doc.fullName} 
                          fill 
                          className="object-cover" 
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {doc.fullName}
                      </p>
                      <p className="text-xs text-slate-500">View Profile →</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Specialists directory updating soon.</p>
            )}
          </div>

        </aside>
      </section>
    </main>
  );
}
