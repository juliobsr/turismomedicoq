// src/app/(frontend)/facilities/[slug]/page.tsx

import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { Facility, Media, Specialty, Doctor } from '@/payload-types';

// Components
import { LexicalRenderer } from '@/app/components/LexicalRenderer';
import { FacilityGallery } from '@/app/components/Facilities/FacilityGallery';

interface FacilityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ISR: Revalidate the static page every hour to keep doctor rosters and gallery fresh
export const revalidate = 3600; 

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

  const primaryImage = (facility.heroImage as Media)?.url;

  return {
    title: `${facility.name} | Premium Medical Facilities`,
    description: `Explore the world-class medical infrastructure at ${facility.name} located in ${facility.city}.`,
    openGraph: {
      title: facility.name,
      description: `State-of-the-art medical facility in ${facility.city}.`,
      type: 'website',
      images: primaryImage ? [{ url: primaryImage }] : [],
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
  const heroImage = facility.heroImage as Media | undefined;
  const specialties = (facility.specialtiesOffered as Specialty[] | undefined) || [];
  const doctors = (facility.doctors as Doctor[] | undefined) || [];
  const galleryImages = (facility.infrastructureGallery as Media[] | undefined) || [];

  /**
   * JSON-LD: MedicalClinic Schema
   * Critical for Local SEO and Knowledge Graph integration.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: facility.name,
    image: heroImage?.url,
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
      <section className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] bg-slate-900">
        {heroImage?.url && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt || facility.name}
            fill
            className="object-cover opacity-60"
            priority // Critical for Core Web Vitals (LCP)
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <span className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm">
              {facility.city}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              {facility.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left Column: Description & Gallery */}
        <div className="lg:col-span-2 space-y-12">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">About the Facility</h2>
            {/* Assuming description is RichText (Lexical) from Payload */}
            {facility.description ? (
              <LexicalRenderer data={facility.description} />
            ) : (
              <p className="text-slate-500 italic">No description available.</p>
            )}
          </div>

          {/* Infrastructure Gallery Client Component */}
          {galleryImages.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Infrastructure Gallery</h3>
              {/* Reusing a client-side Lightbox gallery approach */}
              <FacilityGallery images={galleryImages} />
            </div>
          )}
        </div>

        {/* Right Column: Relationships (Specialties & Doctors) */}
        <aside className="space-y-10">
          
          {/* Specialties Widget */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Medical Departments
            </h3>
            {specialties.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {specialties.map(spec => (
                  <li key={spec.id} className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 shadow-sm">
                    {spec.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">Departments updating soon.</p>
            )}
          </div>

          {/* Doctors Widget */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/50">
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
                    className="flex items-center gap-4 p-3 rounded-2xl transition-colors hover:bg-slate-50 group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 relative shrink-0">
                      {(doc.profilePicture as Media)?.url && (
                        <Image 
                          src={(doc.profilePicture as Media).url!} 
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