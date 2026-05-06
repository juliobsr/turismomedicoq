'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

// Styles
import 'yet-another-react-lightbox/styles.css';

// Types
import { MedicalAsset } from '@/payload-types';

interface DoctorGalleryProps {
  /** Accepts raw IDs or fully populated MedicalAsset objects from Payload CMS */
  images: (number | string | MedicalAsset)[];
}

/**
 * TYPE GUARD: isMedicalAsset
 * Safely ensures the item is a populated object from Payload CMS.
 */
const isMedicalAsset = (item: unknown): item is MedicalAsset => {
  return (
    item !== null &&
    typeof item === 'object' &&
    'url' in item &&
    typeof (item as MedicalAsset).url === 'string'
  );
};

/**
 * GalleryItem: Sub-component for individual facility images
 * Performance: Optimized for cumulative layout shift (CLS) prevention.
 */
const GalleryItem = ({ 
  asset, 
  onClick 
}: { 
  asset: MedicalAsset; 
  onClick: () => void 
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative h-80 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-slate-200 shadow-sm transition-all duration-500 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/20"
    aria-label={`Examine facility: ${asset.alt || 'Medical Center'}`}
  >
    <Image
      src={asset.url || ''}
      alt={asset.alt || 'Medical facility image'}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
    />
    
    {/* Refined Interactive Overlay */}
    <div className="absolute inset-0 bg-slate-900/0 transition-all duration-300 group-hover:bg-slate-900/40 flex items-center justify-center">
      <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="bg-white/95 px-6 py-2.5 rounded-full text-slate-900 text-sm font-bold shadow-lg">
          Examine Facility
        </span>
      </div>
    </div>
  </button>
);

/**
 * Enhanced DoctorGallery
 * Strategy: Dynamic Grid + Optimized Lightbox.
 */
export default function DoctorGallery({ images }: DoctorGalleryProps) {
  const [index, setIndex] = useState<number>(-1);

  // 1. DATA SANITIZATION: Strict check for populated assets only
  const validImages = useMemo(() => images.filter(isMedicalAsset), [images]);
  const imageCount = validImages.length;

  // 2. DYNAMIC LAYOUT LOGIC: Pre-computed grid configuration
  const gridConfig = useMemo(() => {
    const base = "grid gap-6 justify-center mx-auto";
    if (imageCount === 1) return `${base} grid-cols-1 max-w-2xl`;
    if (imageCount === 2) return `${base} grid-cols-1 sm:grid-cols-2 max-w-4xl`;
    if (imageCount === 3) return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl`;
    return `${base} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl`;
  }, [imageCount]);

  // 3. LIGHTBOX SLIDES PREPARATION
  const slides = useMemo(() => 
    validImages.map((item) => ({
      src: item.url || '',
      alt: item.alt || 'Facility overview',
      width: item.width || 1200,
      height: item.height || 800,
    })),
    [validImages]
  );

  if (imageCount === 0) return null;

  return (
    <section className="w-full py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Our Medical Facilities
          </h2>
          <div className="mt-4 flex justify-center">
            <span className="h-1.5 w-24 rounded-full bg-blue-600" aria-hidden="true" />
          </div>
        </header>

        {/* Dynamic Grid System */}
        <div className={gridConfig}>
          {validImages.map((item, idx) => (
            <GalleryItem 
              key={item.id} 
              asset={item} 
              onClick={() => setIndex(idx)} 
            />
          ))}
        </div>

        {/* Lightbox Component */}
        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={slides}
          plugins={[Zoom, Fullscreen]}
          styles={{ 
            container: { backgroundColor: "rgba(15, 23, 42, 0.98)" } 
          }}
          render={{
            buttonPrev: slides.length <= 1 ? () => null : undefined,
            buttonNext: slides.length <= 1 ? () => null : undefined,
          }}
        />
      </div>
    </section>
  );
}