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

const getVideoEmbed = (url: string): { type: 'direct' | 'iframe'; src: string } => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    const pathname = parsed.pathname;

    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      return { type: 'direct', src: url };
    }

    if (hostname === 'youtu.be') {
      const id = pathname.split('/').filter(Boolean)[0];
      if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` };
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const id = parsed.searchParams.get('v') || pathname.split('/').filter(Boolean).pop();
      if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` };
    }

    if (hostname === 'vimeo.com') {
      const id = pathname.split('/').filter(Boolean).pop();
      if (id) return { type: 'iframe', src: `https://player.vimeo.com/video/${id}` };
    }
  } catch {
    return { type: 'iframe', src: url };
  }

  return { type: 'iframe', src: url };
};

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

          const embed = getVideoEmbed(item.url);

          return (
            <figure
              key={`link-${item.url}`}
              className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-video w-full bg-slate-950">
                {embed.type === 'direct' ? (
                  <video className="h-full w-full object-cover" controls playsInline preload="metadata">
                    <source src={embed.src} />
                  </video>
                ) : (
                  <iframe
                    className="h-full w-full"
                    src={embed.src}
                    title={item.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
              <figcaption className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.12em] text-blue-700">Video tour</p>
                    <h4 className="mt-1 text-lg font-extrabold text-slate-950">{item.title}</h4>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-md bg-slate-950 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-blue-700"
                  >
                    Open
                  </a>
                </div>
                {item.caption && <p className="mt-2 text-sm leading-6 text-slate-600">{item.caption}</p>}
              </figcaption>
            </figure>
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
