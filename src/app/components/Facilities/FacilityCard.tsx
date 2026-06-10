import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facility, FacilitiesMedia, Specialty } from '@/payload-types';

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
    infrastructureGallery,
    specialtiesOffered,
  } = facility;

  // Type Casting for the Media object (assuming Depth 1)
  const heroMedia = publicFacilityMedia(heroImage as FacilitiesMedia | undefined);
  const galleryImage = ((infrastructureGallery as FacilitiesMedia[] | undefined) || [])
    .map(publicFacilityMedia)
    .find(isImageMedia);
  const image = isImageMedia(heroMedia) ? heroMedia : galleryImage;
  const previewVideo = !image && isVideoMedia(heroMedia) ? heroMedia : undefined;
  
  // Extracting and limiting specialties for UI consistency
  const displayedSpecialties = (specialtiesOffered as Specialty[] | undefined)?.slice(0, 3);

  return (
    <Link
      href={`/facilities/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
      aria-label={`View infrastructure for ${name}`}
    >
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
        ) : previewVideo?.url ? (
          <>
            <video
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              playsInline
              preload="metadata"
              aria-label={previewVideo.alt || `${name} facility video preview`}
            >
              <source src={previewVideo.url} type={previewVideo.mimeType || 'video/mp4'} />
            </video>
            <div className="absolute inset-0 bg-slate-950/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-lg">
                <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
          </>
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
          <span className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 py-3 text-sm font-bold text-white transition-all group-hover:bg-blue-700">
            View Infrastructure
            <svg 
              className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
