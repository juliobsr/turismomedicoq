'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import type { MedicalAsset } from '@/payload-types';

type GalleryVideoLink = {
  id?: string | null;
  title: string;
  url: string;
  caption?: string | null;
  thumbnail?: number | string | MedicalAsset | null;
};

type VideoEmbed = { type: 'direct' | 'iframe'; src: string; thumbnail?: string };

interface DoctorGalleryProps {
  images: (number | string | MedicalAsset)[];
  videoLinks?: GalleryVideoLink[] | null;
  title?: string;
  eyebrow?: string;
  itemActionLabel?: string;
  variant?: 'grid' | 'slider';
}

const isMedicalAsset = (item: unknown): item is MedicalAsset => {
  return (
    item !== null &&
    typeof item === 'object' &&
    'url' in item &&
    typeof (item as MedicalAsset).url === 'string'
  );
};

const isVideoAsset = (item: MedicalAsset) => {
  return String(item.mimeType || '').startsWith('video/');
};

const getYouTubeThumbnail = (id: string) => {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
};

const getYouTubeId = (parsed: URL) => {
  const hostname = parsed.hostname.replace(/^www\./, '');
  const parts = parsed.pathname.split('/').filter(Boolean);

  if (hostname === 'youtu.be') return parts[0];
  if (hostname !== 'youtube.com' && hostname !== 'm.youtube.com') return null;

  if (parsed.searchParams.get('v')) return parsed.searchParams.get('v');
  if (parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live') return parts[1];

  return parts.pop() || null;
};

const getVimeoId = (parsed: URL) => {
  const hostname = parsed.hostname.replace(/^www\./, '');
  if (hostname !== 'vimeo.com' && hostname !== 'player.vimeo.com') return null;

  const parts = parsed.pathname.split('/').filter(Boolean);
  const numericPart = parts.find((part) => /^\d+$/.test(part));

  return numericPart || null;
};

const getVideoAssetThumbnail = (item: MedicalAsset) => {
  return item.thumbnailURL || item.sizes?.thumbnail?.url || null;
};

const getVideoEmbed = (url: string): VideoEmbed => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    const youtubeId = getYouTubeId(parsed);
    const vimeoId = getVimeoId(parsed);

    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      return { type: 'direct', src: url };
    }

    if (youtubeId) {
      return {
        type: 'iframe',
        src: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`,
        thumbnail: getYouTubeThumbnail(youtubeId),
      };
    }

    if (vimeoId) {
      return {
        type: 'iframe',
        src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
        thumbnail: `https://vumbnail.com/${vimeoId}.jpg`,
      };
    }
  } catch {
    return { type: 'iframe', src: url };
  }

  return { type: 'iframe', src: url };
};

const PlayButton = () => (
  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/25">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl transition group-hover:scale-105">
      <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  </span>
);

const GalleryImage = ({
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
    <img
      src={asset.url || ''}
      alt={asset.alt || 'Medical image'}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-all duration-300 group-hover:bg-slate-900/40">
      <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="rounded-full bg-white/95 px-6 py-2.5 text-sm font-bold text-slate-900 shadow-lg">
          {actionLabel}
        </span>
      </div>
    </div>
  </button>
);

const VideoTile = ({
  title,
  caption,
  thumbnailUrl,
  onClick,
}: {
  title: string;
  caption?: string | null;
  thumbnailUrl?: string | null;
  onClick: () => void;
}) => (
  <figure className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <button
      type="button"
      onClick={onClick}
      className="relative block aspect-video w-full overflow-hidden bg-slate-950 text-left focus:outline-none focus:ring-4 focus:ring-blue-600/20"
      aria-label={`Play ${title}`}
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e9,transparent_35%),linear-gradient(135deg,#0f172a,#111827)]" />
      )}
      <PlayButton />
    </button>
    <figcaption className="p-4">
      <p className="text-sm font-black uppercase tracking-[0.12em] text-blue-700">Procedure video</p>
      <h4 className="mt-1 text-lg font-extrabold text-slate-950">{title}</h4>
      {caption && <p className="mt-2 text-sm leading-6 text-slate-600">{caption}</p>}
    </figcaption>
  </figure>
);

const SliderImage = ({
  asset,
  onClick,
  actionLabel,
}: {
  asset: MedicalAsset;
  onClick: () => void;
  actionLabel: string;
}) => (
  <article className="group relative w-[calc(100vw-2rem)] max-w-none shrink-0 snap-center overflow-hidden rounded-lg bg-slate-950 shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200 sm:w-[42vw] sm:max-w-[320px] md:w-[34vw] lg:w-[28vw] lg:max-w-[380px]">
    <button
      type="button"
      onClick={onClick}
      className="relative block aspect-[9/16] w-full cursor-zoom-in overflow-hidden bg-slate-900 text-left focus:outline-none focus:ring-4 focus:ring-blue-600/20"
      aria-label={`${actionLabel}: ${asset.alt || 'Procedure image'}`}
    >
      <img
        src={asset.url || ''}
        alt={asset.alt || 'Medical procedure image'}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="text-sm font-extrabold leading-5 text-white sm:text-base sm:leading-6">
          {asset.caption || asset.alt || 'Procedure image'}
        </p>
        <span className="mt-3 inline-flex rounded-lg bg-white/95 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-950 opacity-0 transition group-hover:opacity-100">
          {actionLabel}
        </span>
      </div>
    </button>
  </article>
);

const SliderVideo = ({
  title,
  caption,
  thumbnailUrl,
  onClick,
}: {
  title: string;
  caption?: string | null;
  thumbnailUrl?: string | null;
  onClick: () => void;
}) => (
  <article className="group relative w-[calc(100vw-2rem)] max-w-none shrink-0 snap-center overflow-hidden rounded-lg bg-slate-950 shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200 sm:w-[42vw] sm:max-w-[320px] md:w-[34vw] lg:w-[28vw] lg:max-w-[380px]">
    <button
      type="button"
      onClick={onClick}
      className="relative block aspect-[9/16] w-full overflow-hidden bg-slate-950 text-left focus:outline-none focus:ring-4 focus:ring-blue-600/20"
      aria-label={`Play ${title}`}
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 34vw, 380px"
          className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e9,transparent_35%),linear-gradient(135deg,#0f172a,#111827)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
      <PlayButton />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="text-sm font-extrabold leading-5 text-white sm:text-base sm:leading-6">
          {caption || title}
        </p>
      </div>
    </button>
  </article>
);

export default function DoctorGallery({
  images,
  videoLinks,
  title = 'Our Medical Facilities',
  eyebrow,
  itemActionLabel = 'Examine Image',
  variant = 'grid',
}: DoctorGalleryProps) {
  const [index, setIndex] = useState<number>(-1);
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    caption?: string | null;
    embed: VideoEmbed;
  } | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const validMedia = useMemo(() => images.filter(isMedicalAsset), [images]);
  const validImages = useMemo(() => validMedia.filter((item) => !isVideoAsset(item)), [validMedia]);
  const validVideos = useMemo(() => validMedia.filter(isVideoAsset), [validMedia]);
  const validVideoLinks = useMemo(() => (videoLinks || []).filter((item) => Boolean(item?.url)), [videoLinks]);
  const itemCount = validImages.length + validVideos.length + validVideoLinks.length;

  const gridConfig = useMemo(() => {
    const base = 'grid gap-6 justify-center mx-auto';
    if (itemCount === 1) return `${base} grid-cols-1 max-w-2xl`;
    if (itemCount === 2) return `${base} grid-cols-1 sm:grid-cols-2 max-w-4xl`;
    if (itemCount === 3) return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl`;
    return `${base} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl`;
  }, [itemCount]);

  const slides = useMemo(
    () =>
      validImages.map((item) => ({
        src: item.url || '',
        alt: item.alt || 'Medical gallery image',
        width: item.width || 1200,
        height: item.height || 800,
      })),
    [validImages],
  );

  if (itemCount === 0) return null;

  const scrollSlider = (direction: 'previous' | 'next') => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction === 'next' ? slider.clientWidth * 0.82 : slider.clientWidth * -0.82,
      behavior: 'smooth',
    });
  };

  const openUploadedVideo = (item: MedicalAsset) => {
    setActiveVideo({
      title: item.alt || 'Procedure video',
      caption: item.caption,
      embed: { type: 'direct', src: item.url || '' },
    });
  };

  const openVideoLink = (item: GalleryVideoLink) => {
    setActiveVideo({
      title: item.title,
      caption: item.caption,
      embed: getVideoEmbed(item.url),
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
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
            <div className={`mt-4 flex ${variant === 'slider' ? 'justify-start' : 'justify-center'}`}>
              <span className="h-1.5 w-24 rounded-full bg-blue-600" aria-hidden="true" />
            </div>
          </div>

          {variant === 'slider' && itemCount > 1 && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scrollSlider('previous')}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
                aria-label="Previous gallery item"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => scrollSlider('next')}
                className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700"
                aria-label="Next gallery item"
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
              <SliderImage key={item.id} asset={item} onClick={() => setIndex(idx)} actionLabel={itemActionLabel} />
            ))}
            {validVideos.map((item) => (
              <SliderVideo
                key={item.id}
                title={item.alt || 'Procedure video'}
                caption={item.caption}
                thumbnailUrl={getVideoAssetThumbnail(item)}
                onClick={() => openUploadedVideo(item)}
              />
            ))}
            {validVideoLinks.map((item) => {
              const embed = getVideoEmbed(item.url);
              const thumbnail = isMedicalAsset(item.thumbnail) ? item.thumbnail.url : undefined;

              return (
                <SliderVideo
                  key={item.id || item.url}
                  title={item.title}
                  caption={item.caption}
                  thumbnailUrl={thumbnail || embed.thumbnail}
                  onClick={() => openVideoLink(item)}
                />
              );
            })}
          </div>
        ) : (
          <div className={gridConfig}>
            {validImages.map((item, idx) => (
              <GalleryImage key={item.id} asset={item} onClick={() => setIndex(idx)} actionLabel={itemActionLabel} />
            ))}
            {validVideos.map((item) => (
              <VideoTile
                key={item.id}
                title={item.alt || 'Procedure video'}
                caption={item.caption}
                thumbnailUrl={getVideoAssetThumbnail(item)}
                onClick={() => openUploadedVideo(item)}
              />
            ))}
            {validVideoLinks.map((item) => {
              const embed = getVideoEmbed(item.url);
              const thumbnail = isMedicalAsset(item.thumbnail) ? item.thumbnail.url : undefined;

              return (
                <VideoTile
                  key={item.id || item.url}
                  title={item.title}
                  caption={item.caption}
                  thumbnailUrl={thumbnail || embed.thumbnail}
                  onClick={() => openVideoLink(item)}
                />
              );
            })}
          </div>
        )}

        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={slides}
          plugins={[Zoom, Fullscreen]}
          styles={{
            container: { backgroundColor: 'rgba(15, 23, 42, 0.98)' },
          }}
          render={{
            buttonPrev: slides.length <= 1 ? () => null : undefined,
            buttonNext: slides.length <= 1 ? () => null : undefined,
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
    </section>
  );
}
