'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import 'yet-another-react-lightbox/styles.css';

import type { MedicalAsset } from '@/payload-types';

/**
 * Enterprise Interface for FacilityGallery
 * Defensive typing: Payload relations can sometimes return IDs (strings) 
 * if depth is not sufficient. We account for this possibility.
 */
interface FacilityGalleryProps {
  images: (string | MedicalAsset)[];
}

/**
 * FacilityGallery Component
 * 
 * Purpose: High-performance image grid with interactive Lightbox 
 * for showcasing medical infrastructure (ORs, recovery rooms, equipment).
 * 
 * @author Vzsoluciones Engineering Team
 */
export const FacilityGallery = ({ images = [] }: FacilityGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  // 1. DATA SANITIZATION: Filter out unpopulated string IDs and ensure valid Media objects
  const validImages = useMemo(() => {
    return images.filter((item): item is MedicalAsset => typeof item !== 'string' && !!item.url);
  }, [images]);

  const imageCount = validImages.length;

  // 2. DYNAMIC LAYOUT ENGINE: Adjusts grid based on the number of photos
  const gridClasses = useMemo(() => {
    const baseClasses = "grid gap-4 sm:gap-6 mx-auto";
    
    if (imageCount === 1) return `${baseClasses} grid-cols-1 max-w-3xl`;
    if (imageCount === 2) return `${baseClasses} grid-cols-1 sm:grid-cols-2 max-w-5xl`;
    if (imageCount === 3) return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl`;
    
    // Default for 4+ images
    return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl`;
  }, [imageCount]);

  // 3. LIGHTBOX SLIDES PREPARATION: Mapping Payload Media to Lightbox format
  const slides = useMemo(() => {
    return validImages.map((img) => ({
      src: img.url!,
      alt: img.alt || 'Medical facility infrastructure',
      width: img.width || 1920,
      height: img.height || 1080,
    }));
  }, [validImages]);

  // Fail-safe: Render nothing if no valid images exist to prevent empty white space
  if (imageCount === 0) return null;

  return (
    <div className="w-full">
      {/* Dynamic Grid */}
      <div className={gridClasses}>
        {validImages.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => setLightboxIndex(idx)}
            className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-lg bg-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Image
              src={img.url!}
              alt={img.alt || 'Hospital infrastructure'}
              fill
              // Performance optimization for Core Web Vitals (Responsive Image Sizing)
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy" // These are usually below the fold, lazy loading is perfect
            />
            
            {/* Elegant Hover Overlay */}
            <div className="absolute inset-0 bg-slate-900/0 transition-all duration-300 group-hover:bg-slate-900/30 flex items-center justify-center">
              <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-lg bg-white/95 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Enlarge
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Implementation */}
      <Lightbox
        index={lightboxIndex}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Zoom, Fullscreen]}
        // Enterprise UI: Dark overlay to focus attention on the medical images
        styles={{ 
          container: { backgroundColor: "rgba(15, 23, 42, 0.95)" } 
        }}
        render={{
          // Hide navigation buttons if there is only 1 image
          buttonPrev: imageCount <= 1 ? () => null : undefined,
          buttonNext: imageCount <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
};
