// src/app/(frontend)/why-queretaro/page.tsx
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// ============================================================================
// STRICT TYPESCRIPT INTERFACES
// ============================================================================
interface MediaRecord {
  id: string;
  url?: string;
  alt?: string;
}

interface AdvantageRecord {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// ============================================================================
// ENTERPRISE SEO: DYNAMIC METADATA
// ============================================================================
export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise });
  
  try {
    const data = await payload.findGlobal({ slug: 'why-destination' });
    return {
      title: data.metaTitle as string || 'Why Queretaro | Medical Tourism',
      description: data.metaDescription as string || 'Discover the safest and most advanced destination for medical tourism in Mexico.',
      openGraph: {
        title: data.metaTitle as string,
        description: data.metaDescription as string,
        type: 'website',
      },
    };
  } catch (error) {
    return { title: 'Why Queretaro | Queretaro Medical' };
  }
}

// ============================================================================
// SERVER COMPONENT (SSR)
// ============================================================================
export default async function WhyDestinationPage() {
  const payload = await getPayload({ config: configPromise });
  
  // Fetch Global Configuration securely on the server
  const destinationData = await payload.findGlobal({ 
    slug: 'why-destination',
    depth: 1 
  });

  // Type Guards for Media
  //const heroImageUrl = destinationData.heroImage && typeof destinationData.heroImage === 'object' && 'url' in destinationData.heroImage 
   // ? destinationData.heroImage.url 
   // : '/assets/placeholders/queretaro-city.jpg'; // Fallback image

  // Type Guards for Arrays
  const advantages = Array.isArray(destinationData.advantages) 
    ? (destinationData.advantages as AdvantageRecord[]) 
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* ========================================================= */}
      {/* HERO SECTION: High Impact Visual & H1                     */}
      {/* ========================================================= */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/*<Image
         //   src={heroImageUrl!}
            alt="Beautiful panoramic view of Queretaro downtown"
            fill
            className="object-cover"
            priority // Critical for LCP (Core Web Vitals)
            sizes="100vw"
          />*/}
          <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
          <span className="text-blue-200 font-black tracking-[0.2em] uppercase text-sm mb-4 block">
            The Hidden Gem of Mexico
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
           {/* {destinationData.heroHeadline as string} */}
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {destinationData.heroSubtitle as string}
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* VALUE PROPOSITION GRID (Selling Points)                   */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative -mt-20 z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {advantages.map((adv) => (
            <div 
              key={adv.id} 
              className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-gray-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col"
            >
              <div className="text-5xl mb-6 bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center">
                {adv.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {adv.title}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                {adv.description}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* ========================================================= */}
      {/* CTA SECTION: Bridge Destination with Doctors              */}
      {/* ========================================================= */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
            Ready to experience world-class care?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Explore our network of board-certified specialists and top-tier medical facilities in Queretaro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/doctors" 
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Find a Specialist
            </Link>
            <Link 
              href="/contact" 
              className="bg-gray-50 text-blue-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
            >
              Talk to a Concierge
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}