// src/app/(frontend)/facilities/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

// Services & Globals
import { getFilteredFacilities } from '@/services/facilities.service';
import { getSiteSettings } from '@/lib/globals';

// Components
import { FacilityFilters } from '@/app/components/Facilities/FacilityFilters';
import FacilityCard from '@/app/components/Facilities/FacilityCard';

interface PageProps {
  searchParams: Promise<{
    specialty?: string;
    doctor?: string;
  }>;
}

// ============================================================================
// DYNAMIC SEO METADATA (OPTION A: Clean Architecture)
// ============================================================================
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const specialtyFilter = typeof resolvedParams.specialty === 'string' ? resolvedParams.specialty : undefined;
  
  // Fetch globals for description and OpenGraph context
  const settings = await getSiteSettings();
  const companyName = settings?.companyName || 'Medical Network';

  // Base SEO Configuration
  let pageTitle = 'Medical Facilities Network';
  let description = `Explore the world-class medical facilities and hospitals within the ${companyName}. Equipped with state-of-the-art technology for international patients.`;
  let canonicalUrl = '/facilities';

  // Dynamic SEO if a filter is applied
  if (specialtyFilter) {
    pageTitle = `Specialized Medical Facilities`;
    description = `Find specialized hospitals and clinics for your medical needs at ${companyName}. Review our premium infrastructure.`;
    canonicalUrl = `/facilities?specialty=${specialtyFilter}`;
  }

  return {
    // 🚀 OPTION A: Next.js will automatically append the " | Company Name" from layout.tsx
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      type: 'website',
      siteName: companyName,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
    }
  };
}

// ============================================================================
// PAGE COMPONENT: Server-Side Rendered (SSR)
// ============================================================================
export default async function FacilitiesPage({ searchParams }: PageProps) {
  // 1. Resolve Dynamic URL Params (Next.js 15+ requirement)
  const filters = await searchParams;
  const payload = await getPayload({ config: configPromise });

  // 2. Parallel Fetching: Minimizing waterfall requests for maximum performance
  // We include getSiteSettings() here to use the companyName in our UI header
  const [facilities, specialtiesRes, doctorsRes, settings] = await Promise.all([
    getFilteredFacilities(filters),
    payload.find({ 
      collection: 'specialties', 
      limit: 100,
      sort: 'title', 
    }),
    payload.find({ 
      collection: 'doctors', 
      limit: 100, 
      where: { isActive: { equals: true } }, 
      select: { id: true, fullName: true } 
    }),
    getSiteSettings()
  ]);

  const companyName = settings?.companyName || 'our network';

  return (
    <main className="min-h-screen bg-slate-50 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Header */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Medical Facilities Network
          </h1>
          <p className="text-slate-600 mt-4 text-lg max-w-2xl">
            World-class infrastructure for your medical journey. Every hospital and clinic in <strong className="text-blue-700 font-semibold">{companyName}</strong> is rigorously audited for international patient safety.
          </p>
        </header>

        {/* 
          Filters Component
          Using safe navigation (?.) and default arrays (|| []) to prevent runtime crashes.
        */}
        <div className="mb-12">
          <FacilityFilters 
            specialties={specialtiesRes?.docs?.map(s => ({ id: String(s.id) as string, title: s.title })) || []}
            doctors={doctorsRes?.docs?.map(d => ({ id: String(d.id) as string, fullName: d.fullName })) || []}
          />
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.length > 0 ? (
            facilities.map((facility, index) => (
              <FacilityCard 
                key={facility.id} 
                facility={facility} 
                // Core Web Vitals (LCP): Prioritize loading the first 2 images
                priority={index < 2} 
              />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-3xl p-16 md:p-24 text-center border border-dashed border-slate-300 shadow-sm">
              <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No facilities found</h3>
              <p className="text-slate-500 text-base max-w-sm mx-auto">
                We couldn't find any locations matching your current filters. Try selecting a different specialty or doctor.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}