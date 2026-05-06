import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { PatientJourney as PatientJourneyType, MedicalAsset } from '@/payload-types'

// Core Utilities & Components
import { getSiteSettings } from '@/lib/globals'
import { LeadCaptureForm } from '@/app/components/LeadCaptureForm'

export const revalidate = 3600 // ISR: Revalidate page from cache every hour

// ============================================================================
// DYNAMIC METADATA & SEO (Enterprise Grade)
// ============================================================================
export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  
  // PERFORMANCE: Parallel data fetching
  const [settings, journeyData] = await Promise.all([
    getSiteSettings(),
    payload.findGlobal({ slug: 'patient-journey' })
  ])

  const journey = journeyData as unknown as PatientJourneyType
  const companyName = settings?.companyName || 'Queretaro Medical'
  const heroImage = (journey.heroCover as MedicalAsset)?.url
  
  // SAFE FALLBACK: Data Sanitization for SEO Title
  const cleanMetaTitle = journey.metaTitle?.trim();
  const pageTitle = cleanMetaTitle 
    ? `${cleanMetaTitle}` 
    : `The Patient Journey`;

  return {
    title: pageTitle,
    description: journey.metaDescription || journey.heroDescription,
    alternates: {
      canonical: '/patient-journey',
    },
    openGraph: {
      title: pageTitle,
      description: journey.metaDescription || journey.heroDescription,
      type: 'website',
      siteName: companyName,
      images: heroImage ? [{ url: heroImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      images: heroImage ? [heroImage] : [],
    }
  }
}

// ============================================================================
// SERVER COMPONENT: PATIENT JOURNEY
// ============================================================================
export default async function PatientJourneyPage() {
  const payload = await getPayload({ config: configPromise })

  // PERFORMANCE: Parallel data fetching for UI rendering
  const [settings, journeyData] = await Promise.all([
    getSiteSettings(),
    payload.findGlobal({ slug: 'patient-journey' })
  ])

  const journey = journeyData as unknown as PatientJourneyType
  const brandPrimaryColor = settings?.primaryColor || '#1e3a8a'
  const heroImage = journey.heroCover as MedicalAsset | undefined

  // ==========================================================================
  // SCHEMA.ORG: HowTo JSON-LD
  // Triggers Rich Snippets in Google Search for step-by-step guides.
  // ==========================================================================
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: journey.heroTitle,
    description: journey.heroDescription,
    step: journey.steps?.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      image: (step.image as MedicalAsset)?.url || undefined,
    }))
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* 🚀 Inject Structured Data Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
        {heroImage?.url && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt || 'Medical Tourism in Queretaro'}
            fill
            className="object-cover object-center absolute inset-0 z-0 brightness-[0.4]"
            priority
          />
        )}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">
            Step-by-Step Guide
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6 tracking-tight">
            {journey.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto">
            {journey.heroDescription}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        
        {/* Left Column: Timeline Content */}
        <div className="lg:col-span-2">
          {/* A11Y: Ordered List for sequential timeline */}
          <ol className="relative border-l-2 border-blue-200 ml-4 md:ml-6 space-y-16">
            {journey.steps?.map((step, index) => {
              const mainStepMedia = step.image as MedicalAsset | undefined;
              const hasOptions = step.options && step.options.length > 0;
              
              return (
                <li key={index} className="ml-10 relative">
                  {/* Timeline Point Indicator */}
                  <span 
                    className="absolute -left-[3.25rem] flex items-center justify-center w-10 h-10 rounded-full ring-8 ring-slate-50 text-white font-bold shadow-md"
                    style={{ backgroundColor: brandPrimaryColor }}
                  >
                    {index + 1}
                  </span>
                  
                  <article className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 transition-all hover:shadow-md">
                    {step.duration && (
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                        ⏱️ {step.duration}
                      </span>
                    )}
                    
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-slate-600 text-lg leading-relaxed mb-8">
                      {step.description}
                    </p>

                    {/* Main Step Image (Renders only if no nested options are provided) */}
                    {mainStepMedia?.url && !hasOptions && (
                      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                        <Image
                          src={mainStepMedia.url}
                          alt={mainStepMedia.alt || step.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 800px"
                        />
                      </div>
                    )}

                    {/* Nested Visual Options (e.g., Recovery Destinations) */}
                    {hasOptions && (
                      <div className="mt-8 border-t border-slate-100 pt-8">
                        <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                          Choose Your Experience
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {step.options!.map((option, optIdx) => {
                            const optionImg = option.image as MedicalAsset | undefined;
                            return (
                              <div key={optIdx} className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                                {optionImg?.url && (
                                  <div className="relative w-full h-48 overflow-hidden">
                                    <Image 
                                      src={optionImg.url} 
                                      alt={optionImg.alt || option.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                                      sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                    <p className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow-md">
                                      {option.title}
                                    </p>
                                  </div>
                                )}
                                <div className="p-5">
                                  <p className="text-sm text-slate-600 leading-relaxed">
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </article>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Right Column: Global Sidebar & Contextual Lead Gen */}
        <aside className="relative">
          <div className="sticky top-8 space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Start Your Journey</h3>
              <p className="text-slate-300 text-sm mb-0 leading-relaxed relative z-10">
                From your arrival at the airport to your recovery in the historic center of Queretaro or the artistic charm of San Miguel de Allende, our concierge team handles every detail.
              </p>
            </div>
            
            {/* Contextual Lead Capture Form (Injects "General Consultation" automatically) */}
            <LeadCaptureForm 
              context="doctor" 
              fixedEntityId="general" 
              fixedEntityName="Our Concierge Team"
              dynamicOptions={[]} 
            />
          </div>
        </aside>

      </div>
    </main>
  )
}