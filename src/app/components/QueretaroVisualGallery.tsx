'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'

export type QueretaroVisual = {
  src: string
  alt: string
  title: string
  description: string
  orientation?: 'wide' | 'tall' | 'square'
}

type QueretaroVisualGalleryProps = {
  images: QueretaroVisual[]
  ctaLabel?: string
  className?: string
}

export const QueretaroVisualGallery = ({
  images,
  ctaLabel = 'Explore why Queretaro works',
  className = '',
}: QueretaroVisualGalleryProps) => {
  const [activeImage, setActiveImage] = useState<QueretaroVisual | null>(null)

  return (
    <>
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {images.map((image, index) => (
          <article
            key={image.src}
            className={`group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
              index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveImage(image)}
              className="relative block w-full overflow-hidden bg-slate-900 text-left"
              aria-label={`View ${image.title} full size`}
            >
              <span
                className={`block ${
                  index === 0 ? 'aspect-[16/9]' : image.orientation === 'tall' ? 'aspect-[4/5]' : 'aspect-[4/3]'
                }`}
              />
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes={index === 0 ? '(max-width: 1024px) 100vw, 760px' : '(max-width: 1024px) 50vw, 360px'}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
              <span className="absolute bottom-4 left-4 right-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
                View full image
              </span>
            </button>

            <div className="p-5">
              <h3 className="text-xl font-black tracking-tight text-slate-950">{image.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{image.description}</p>
              <Link
                href="/why-queretaro"
                className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand-primary"
              >
                {ctaLabel}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Close full-size image"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <figure
            className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[72vh] min-h-[320px]">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <figcaption className="border-t border-white/10 bg-slate-950 p-5 text-white">
              <h3 className="text-xl font-black">{activeImage.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{activeImage.description}</p>
              <Link
                href="/why-queretaro"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:brightness-110"
              >
                {ctaLabel}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
