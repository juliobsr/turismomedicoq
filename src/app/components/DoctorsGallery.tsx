'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import 'yet-another-react-lightbox/styles.css';

import { Media as MediaType } from '@/payload-types';

interface DoctorGalleryProps {
  images: (string | MediaType)[];
}

/**
 * Enhanced Doctor Gallery Component
 * Features: Dynamic centering for < 4 images, Lightbox integration, and Enterprise-grade UI polish.
 */
export default function DoctorGallery({ images }: DoctorGalleryProps) {
  const [index, setIndex] = useState<number>(-1);

  // 1. DATA SANITIZATION: Ensure we only work with populated Media objects
  const validImages = useMemo(() => 
    images.filter((item): item is MediaType => typeof item !== 'string'),
    [images]
  );

  const imageCount = validImages.length;

  // 2. DYNAMIC LAYOUT LOGIC: Calculate grid classes based on image count
  const getGridClasses = () => {
    const baseClasses = "grid gap-6 justify-center mx-auto";
    
    // Mobile is always 1 column, small tablets 2
    let responsiveClasses = "grid-cols-1 sm:grid-cols-2";

    // Dynamic columns for large screens (lg)
    if (imageCount === 1) {
      responsiveClasses += " lg:grid-cols-1 max-w-2xl";
    } else if (imageCount === 2) {
      responsiveClasses += " lg:grid-cols-2 max-w-4xl";
    } else if (imageCount === 3) {
      responsiveClasses += " md:grid-cols-3 lg:grid-cols-3 max-w-6xl";
    } else {
      // Default: 4 columns for 4 or more images
      responsiveClasses += " md:grid-cols-3 lg:grid-cols-4 max-w-7xl";
    }

    return `${baseClasses} ${responsiveClasses}`;
  };

  // 3. LIGHTBOX SLIDES PREPARATION
  const slides = useMemo(() => 
    validImages.map((item) => ({
      src: item.url || '',
      alt: item.alt || 'Medical facility image',
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
            <span className="h-1 w-20 rounded-full bg-blue-600"></span>
          </div>
        </header>

        {/* Dynamic Grid System */}
        <div className={getGridClasses()}>
          {validImages.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setIndex(idx)}
              className="group relative h-80 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-slate-200 shadow-sm transition-all duration-500 hover:shadow-2xl"
            >
              <Image
                src={item.url || ''}
                alt={item.alt || 'Facility Preview'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
            </div>
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