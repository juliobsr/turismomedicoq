import React from 'react';
import { getPayload } from 'payload';
import { Metadata } from 'next';
import config from '@/payload.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { WhyQueretaro as WhyQueretaroType, MedicalAsset } from '@/payload-types';
import { StickyAdvantageNav } from '@/app/components/WhyQueretaro/StickyNav';

/**
 * ENTERPRISE SEO STRATEGY
 * Updated generateMetadata with strict type checking for Payload relationships.
 */
export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config });

  // Fetching Global data with depth 1 to ensure MedicalAsset is populated
  const data = await payload.findGlobal({
    slug: 'why-queretaro',
    depth: 1,
  });

  const title = data?.seo?.metaTitle || 'Why Queretaro? | Premium Medical Tourism';
  const description = data?.seo?.metaDescription || 'Discover Queretaro medical excellence.';

  // 🛡️ TYPE GUARD: Checking if backgroundImage is a populated object and not just an ID string
  const backgroundImage = data?.hero?.mainImage;
  
  const isPopulatedAsset = 
    backgroundImage && 
    typeof backgroundImage === 'object' && 
    'url' in backgroundImage;

  // Resolve the URL and Alt text safely
  const ogImage = isPopulatedAsset ? backgroundImage.url : null;
  const ogAlt = isPopulatedAsset ? backgroundImage.alt : 'Why Queretaro Medical Tourism';

  return {
    title,
    description,
    alternates: {
      canonical: '/why-queretaro',
    },
    openGraph: {
      title,
      description,
      url: 'https://queretaro.medical/why-queretaro',
      siteName: 'Queretaro Medical Tourism',
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt || 'Medical Tourism Excellence',
        }
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

/**
 * Modern "Why Queretaro" Page
 * Focused on aggressive marketing and high-quality visual assets.
 */
export default async function WhyQueretaroPage() {
  const payload = await getPayload({ config });
  const data: WhyQueretaroType = await payload.findGlobal({
    slug: 'why-queretaro',
    depth: 1,
  });

  if (!data) return notFound();

  const { hero, content } = data;
// Prepare navigation items for the sticky nav
const navItems = data.content?.sections?.map((block: any) => ({
  anchor: block.anchorSlug,
  label: block.title,
})) || [];
  return (
    <main className="w-full overflow-x-hidden bg-white scroll-smooth">
      {/* 🚀 Sticky Navigation - Client Component
      <StickyAdvantageNav items={navItems} /> */}
      {/* ⚡ Full-Height Hero Section */}
      <section className="relative h-screen flex items-center">
        {typeof hero.mainImage === 'object' && (
          <Image
            src={(hero.mainImage as MedicalAsset).url!}
            alt={(hero.mainImage as MedicalAsset).alt || 'Queretaro'}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-6">
              {hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* 🚀 Dynamic Sections: The Z-Pattern Strategy */}
      <section className="py-20 flex flex-col gap-32">
        {content?.sections?.map((block: any, index: number) => {
          const isImageLeft = block.layout === 'imageLeft';
          const image = block.sectionImage as MedicalAsset;

          return (
            <div 
              key={block.id} 
              className={`container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 ${
                !isImageLeft ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 relative h-[500px] group overflow-hidden rounded-3xl">
                <Image
                  src={image.url!}
                  alt={image.alt || 'Medical Tourism Advantage'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2">
                
                <h3 className="text-4xl md:text-5xl font-extrabold text-slate-600 mb-2">
                  {block.title}
                </h3>
                <h3 className="text-2xl font-medium text-blue-500 mb-8 italic">
                  {block.highlightSubtitle}
                </h3>
                <div className="text-lg text-slate-600 leading-loose prose prose-slate">
                  {/* RichText rendering would be applied here */}
                  <p>Comprehensive description of Queretaro's medical and logistical excellence.</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}