'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import 'yet-another-react-lightbox/styles.css';

import type { FacilitiesMedia } from '@/payload-types';

export type FacilityGalleryItem =
  | {
      type: 'image';
      media: FacilitiesMedia;
    }
  | {
      type: 'video';
      media: FacilitiesMedia;
    }
  | {
      type: 'videoLink';
      title: string;
      url: string;
      caption?: string | null;
      thumbnail?: FacilitiesMedia;
    };

/**
 * Enterprise Interface for FacilityGallery
 * Defensive typing: Payload relations can sometimes return IDs (strings) 
 * if depth is not sufficient. We account for this possibility.
 */
interface FacilityGalleryProps {
  items: FacilityGalleryItem[];
}

/**
 * FacilityGallery Component
 * 
 * Purpose: High-performance image grid with interactive Lightbox 
 * for showcasing medical infrastructure (ORs, recovery rooms, equipment).
 * 
 * @author Vzsoluciones Engineering Team
 */
export const FacilityGallery = ({ items = [] }: FacilityGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const validItems = useMemo(() => items.filter((item) => {
    if (item.type === 'videoLink') return Boolean(item.url);
    return Boolean(item.media?.url);
  }), [items]);

  const imageItems = useMemo(
    () => validItems.filter((item): item is Extract<FacilityGalleryItem, { type: 'image' }> => item.type === 'image'),
    [validItems]
  );

  const itemCount = validItems.length;

  // 2. DYNAMIC LAYOUT ENGINE: Adjusts grid based on the number of photos
  const gridClasses = useMemo(() => {
    const baseClasses = "grid gap-4 sm:gap-6 mx-auto";
    
    if (itemCount === 1) return `${baseClasses} grid-cols-1 max-w-3xl`;
    if (itemCount === 2) return `${baseClasses} grid-cols-1 sm:grid-cols-2 max-w-5xl`;
    if (itemCount === 3) return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl`;
    
    // Default for 4+ images
    return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl`;
  }, [itemCount]);

  // 3. LIGHTBOX SLIDES PREPARATION: Mapping Payload Media to Lightbox format
  const slides = useMemo(() => {
    return imageItems.map((item) => ({
      src: item.media.url!,
      alt: item.media.alt || 'Medical facility infrastructure',
      width: item.media.width || 1920,
      height: item.media.height || 1080,
    }));
  }, [imageItems]);

  // Fail-safe: Render nothing if no valid images exist to prevent empty white space
  if (itemCount === 0) return null;

  return (
    <div className="w-full">
      {/* Dynamic Grid */}
      <div className={gridClasses}>
        {validItems.map((item) => {
          if (item.type === 'image') {
            const img = item.media;
            const lightboxImageIndex = imageItems.findIndex((imageItem) => imageItem.media.id === img.id);

            return (
              <figure
                key={`image-${img.id}`}
                onClick={() => setLightboxIndex(lightboxImageIndex)}
                className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-lg bg-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Image
                  src={img.url!}
                  alt={img.alt || 'Hospital infrastructure'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {img.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                    {img.caption}
                  </figcaption>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-all duration-300 group-hover:bg-slate-900/30">
                  <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="flex items-center gap-2 rounded-lg bg-white/95 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg backdrop-blur-sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      Enlarge
                    </span>
                  </div>
                </div>
              </figure>
            );
          }

          if (item.type === 'video') {
            const video = item.media;

            return (
              <figure
                key={`video-${video.id}`}
                className="overflow-hidden rounded-lg bg-slate-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-video w-full bg-slate-950">
                  <video
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={video.url!} type={video.mimeType || 'video/mp4'} />
                  </video>
                </div>
                <figcaption className="flex items-center justify-between gap-3 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  <span>{video.caption || video.alt || 'Facility video'}</span>
                  <a
                    href={video.url!}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-md bg-slate-950 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-blue-700"
                  >
                    Open video
                  </a>
                </figcaption>
              </figure>
            );
          }

          return (
            <a
              key={`link-${item.url}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-video bg-slate-900">
                {item.thumbnail?.url ? (
                  <Image
                    src={item.thumbnail.url}
                    alt={item.thumbnail.alt || item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e9,transparent_35%),linear-gradient(135deg,#0f172a,#111827)]" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/25">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl transition group-hover:scale-105">
                    <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-blue-700">Video tour</p>
                <h4 className="mt-1 text-lg font-extrabold text-slate-950">{item.title}</h4>
                {item.caption && <p className="mt-2 text-sm leading-6 text-slate-600">{item.caption}</p>}
              </div>
            </a>
          );
        })}
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
          buttonPrev: imageItems.length <= 1 ? () => null : undefined,
          buttonNext: imageItems.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
};
