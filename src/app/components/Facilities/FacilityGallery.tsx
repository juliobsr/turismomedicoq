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

type VideoEmbed = { type: 'direct' | 'iframe'; src: string; thumbnail?: string }

const getVideoEmbed = (url: string): VideoEmbed => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    const pathname = parsed.pathname;

    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      return { type: 'direct', src: url };
    }

    if (hostname === 'youtu.be') {
      const id = pathname.split('/').filter(Boolean)[0];
      if (id) {
        return {
          type: 'iframe',
          src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        };
      }
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const id = parsed.searchParams.get('v') || pathname.split('/').filter(Boolean).pop();
      if (id) {
        return {
          type: 'iframe',
          src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        };
      }
    }

    if (hostname === 'vimeo.com') {
      const id = pathname.split('/').filter(Boolean).pop();
      if (id) return { type: 'iframe', src: `https://player.vimeo.com/video/${id}?autoplay=1` };
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
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    caption?: string | null;
    embed: VideoEmbed;
  } | null>(null);

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
    
    // Default for 4+ media items: larger thumbnails for better inspection.
    return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl`;
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
                className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(lightboxImageIndex)}
                  className="group relative block aspect-video w-full cursor-zoom-in overflow-hidden bg-slate-100 text-left"
                  aria-label={`Enlarge ${img.alt || 'hospital infrastructure image'}`}
                >
                  <Image
                    src={img.url!}
                    alt={img.alt || 'Hospital infrastructure'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-all duration-300 group-hover:bg-slate-900/25">
                    <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-lg bg-white/95 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg backdrop-blur-sm">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        Enlarge
                      </span>
                    </div>
                  </div>
                </button>

                {img.caption && (
                  <figcaption className="px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (item.type === 'video') {
            const video = item.media;

            return (
              <figure
                key={`video-${video.id}`}
                className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => setActiveVideo({
                    title: video.alt || 'Facility video',
                    caption: video.caption,
                    embed: { type: 'direct', src: video.url! },
                  })}
                  className="group relative block aspect-video w-full overflow-hidden bg-slate-950 text-left"
                  aria-label={`Play ${video.alt || 'facility video'}`}
                >
                  <video
                    className="h-full w-full object-cover opacity-90 transition group-hover:scale-105"
                    muted
                    playsInline
                    preload="metadata"
                  >
                    <source src={video.url!} type={video.mimeType || 'video/mp4'} />
                  </video>
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl transition group-hover:scale-105">
                      <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </button>
                <figcaption className="px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
                  <span>{video.caption || video.alt || 'Facility video'}</span>
                </figcaption>
              </figure>
            );
          }

          const embed = getVideoEmbed(item.url);
          const thumbnailUrl = item.thumbnail?.url || embed.thumbnail;

          return (
            <figure
              key={`link-${item.url}`}
              className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <button
                type="button"
                onClick={() => setActiveVideo({ title: item.title, caption: item.caption, embed })}
                className="group relative block aspect-video w-full overflow-hidden bg-slate-950 text-left"
                aria-label={`Play ${item.title}`}
              >
                {thumbnailUrl ? (
                  <Image
                    src={thumbnailUrl}
                    alt={item.thumbnail?.alt || item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e9,transparent_35%),linear-gradient(135deg,#0f172a,#111827)]" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/25">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl transition group-hover:scale-105">
                    <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </button>
              <figcaption className="p-4">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-blue-700">Video tour</p>
                <h4 className="mt-1 text-lg font-extrabold text-slate-950">{item.title}</h4>
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

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
              <div>
                <h4 className="text-lg font-extrabold text-slate-950">{activeVideo.title}</h4>
                {activeVideo.caption && <p className="text-sm text-slate-600">{activeVideo.caption}</p>}
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="rounded-md bg-slate-100 px-3 py-2 text-sm font-extrabold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>
            <div className="aspect-video w-full bg-slate-950">
              {activeVideo.embed.type === 'direct' ? (
                <video className="h-full w-full" controls autoPlay playsInline>
                  <source src={activeVideo.embed.src} />
                </video>
              ) : (
                <iframe
                  className="h-full w-full"
                  src={activeVideo.embed.src}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
