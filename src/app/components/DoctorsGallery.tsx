'use client';

import React, { useRef, useState, useMemo } from 'react';
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
  title?: string;
  eyebrow?: string;
  itemActionLabel?: string;
  variant?: 'grid' | 'slider';
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
  onClick,
  actionLabel,
}: { 
  asset: MedicalAsset; 
  onClick: () => void;
  actionLabel: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative h-80 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-slate-200 shadow-sm transition-all duration-500 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/20"
    aria-label={`${actionLabel}: ${asset.alt || 'Medical image'}`}
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
          {actionLabel}
        </span>
      </div>
    </div>
  </button>
);

const SliderItem = ({
  asset,
  onClick,
  actionLabel,
}: {
  asset: MedicalAsset;
  onClick: () => void;
  actionLabel: string;
}) => (
  <article className="group relative w-[58vw] max-w-[260px] shrink-0 snap-center overflow-hidden rounded-lg bg-slate-950 shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200 sm:w-[42vw] sm:max-w-[320px] md:w-[34vw] lg:w-[28vw] lg:max-w-[380px]">
    <button
      type="button"
      onClick={onClick}
      className="relative block aspect-[9/16] w-full cursor-zoom-in overflow-hidden bg-slate-900 text-left focus:outline-none focus:ring-4 focus:ring-blue-600/20"
      aria-label={`${actionLabel}: ${asset.alt || 'Procedure image'}`}
    >
      <Image
        src={asset.url || ''}
        alt={asset.alt || 'Medical procedure image'}
        fill
        sizes="(max-width: 640px) 58vw, (max-width: 1024px) 34vw, 380px"
        className="object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="max-w-3xl text-sm font-extrabold leading-5 text-white sm:text-base sm:leading-6">
          {asset.caption || asset.alt || 'Procedure image'}
        </p>
        <span className="mt-3 inline-flex rounded-lg bg-white/95 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-950 opacity-0 transition group-hover:opacity-100">
          {actionLabel}
        </span>
      </div>
    </button>
  </article>
);

/**
 * Enhanced DoctorGallery
 * Strategy: Dynamic Grid + Optimized Lightbox.
 */
export default function DoctorGallery({
  images,
  title = 'Our Medical Facilities',
  eyebrow,
  itemActionLabel = 'Examine Image',
  variant = 'grid',
}: DoctorGalleryProps) {
  const [index, setIndex] = useState<number>(-1);
  const sliderRef = useRef<HTMLDivElement | null>(null);

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

  const scrollSlider = (direction: 'previous' | 'next') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const distance = slider.clientWidth * 0.82;
    slider.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className={`w-full border-t border-slate-200 py-20 ${variant === 'slider' ? 'bg-white' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-4">
        <header className={`mb-12 ${variant === 'slider' ? 'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between' : 'text-center'}`}>
          <div>
            {eyebrow && (
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              {title}
            </h2>
            <div className={`mt-4 flex ${variant === 'slider' ? 'justify-start' : 'justify-center'}`}>
              <span className="h-1.5 w-24 rounded-full bg-blue-600" aria-hidden="true" />
            </div>
          </div>

          {variant === 'slider' && imageCount > 1 && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scrollSlider('previous')}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
                aria-label="Previous procedure image"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => scrollSlider('next')}
                className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700"
                aria-label="Next procedure image"
              >
                Next
              </button>
            </div>
          )}
        </header>

        {variant === 'slider' ? (
          <div
            ref={sliderRef}
            className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 [scrollbar-width:thin] sm:gap-6"
          >
            {validImages.map((item, idx) => (
              <SliderItem
                key={item.id}
                asset={item}
                onClick={() => setIndex(idx)}
                actionLabel={itemActionLabel}
              />
            ))}
          </div>
        ) : (
          <div className={gridConfig}>
            {validImages.map((item, idx) => (
              <GalleryItem
                key={item.id}
                asset={item}
                onClick={() => setIndex(idx)}
                actionLabel={itemActionLabel}
              />
            ))}
          </div>
        )}

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
