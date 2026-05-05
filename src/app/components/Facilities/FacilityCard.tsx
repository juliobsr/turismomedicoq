import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facility, Media, Specialty } from '@/payload-types';

/**
 * Enterprise Interface for FacilityCard
 * Strictly typed to handle Payload CMS relational data.
 */
interface FacilityCardProps {
  facility: Facility;
  /**
   * Performance Tip: Set priority to true for the first 2-3 cards
   * appearing above the fold to optimize Largest Contentful Paint (LCP).
   */
  priority?: boolean;
}

/**
 * FacilityCard Component
 * Optimized for SEO and Performance using Next.js Image component.
 */
export default function FacilityCard({ facility, priority = false }: FacilityCardProps) {
  // Destructuring with safety fallbacks for Payload relations
  const {
    name,
    slug,
    city,
    heroImage,
    specialtiesOffered,
  } = facility;

  // Type Casting for the Media object (assuming Depth 1)
  const image = heroImage as Media | undefined;
  
  // Extracting and limiting specialties for UI consistency
  const displayedSpecialties = (specialtiesOffered as Specialty[] | undefined)?.slice(0, 3);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      {/* 
          Image Container: 
          Uses fixed aspect ratio to eliminate Cumulative Layout Shift (CLS).
      */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || `${name} medical facilities`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50">
            <span className="text-[10px] uppercase font-bold tracking-tighter">No Preview Available</span>
          </div>
        )}
        
        {/* Geographic Context Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
            {city}
          </span>
        </div>
      </div>

      {/* Facility Information Section */}
      <div className="p-6 flex flex-col flex-grow">
        <header className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
            {name}
          </h3>
        </header>

        {/* Dynamic Tags for Specialties */}
        <div className="flex flex-wrap gap-2 mb-6">
          {displayedSpecialties?.map((spec) => (
            <span 
              key={spec.id} 
              className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100"
            >
              {spec.title}
            </span>
          ))}
          {(specialtiesOffered?.length ?? 0) > 3 && (
            <span className="text-[11px] font-medium text-slate-400 py-0.5">
              +{(specialtiesOffered?.length ?? 0) - 3} more
            </span>
          )}
        </div>

        {/* Primary Call to Action */}
        <div className="mt-auto">
          <Link 
            href={`/facilities/${slug}`}
            className="inline-flex items-center justify-center w-full bg-slate-900 text-white text-sm font-bold py-3 rounded-xl transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            View Infrastructure
            <svg 
              className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}