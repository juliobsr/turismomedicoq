import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import LeadForm from '@/app/components/LeadForm'

// ============================================================================
// STRICT TYPESCRIPT INTERFACES
// ============================================================================
type PageProps = {
  params: Promise<{ id: string }>;
}

interface MediaRecord {
  id: string;
  url?: string;
  alt?: string;
}

interface SpecialtyRecord {
  id: string;
  name: string;
}

interface TrustSignalRecord {
  id: string;
  name: string;
  logo?: string | MediaRecord;
}

interface LexicalTextNode {
  type: 'text';
  text: string;
  format?: number;
}

interface LexicalElementNode {
  type: 'paragraph' | 'list' | 'listitem' | string;
  children?: LexicalNode[];
  listType?: 'bullet' | 'number';
}

type LexicalNode = LexicalTextNode | LexicalElementNode;

// ============================================================================
// ENTERPRISE SEO: DYNAMIC METADATA
// ============================================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const payload = await getPayload({ config: configPromise });

  try {
    const doctor = await payload.findByID({
      collection: 'doctors',
      id: resolvedParams.id,
      depth: 1,
    });

    const specialtyNames = Array.isArray(doctor.specialty) 
      ? doctor.specialty
          .map((s) => typeof s === 'object' && s !== null && 'name' in s ? s.name : '')
          .filter(Boolean)
          .join(', ')
      : 'Specialist';

    const imageUrl = doctor.profilePicture && typeof doctor.profilePicture === 'object' && 'url' in doctor.profilePicture 
      ? doctor.profilePicture.url 
      : undefined;

    return {
      title: `Dr. ${doctor.name} | ${specialtyNames} in Queretaro`,
      description: `Book a consultation with Dr. ${doctor.name}. Board-certified ${specialtyNames} offering world-class medical procedures in Queretaro, Mexico.`,
      openGraph: {
        title: `Dr. ${doctor.name} - Queretaro Medical Tourism`,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    return { title: 'Doctor Profile | Queretaro Medical' };
  }
}

// ============================================================================
// UTILS: BULLETPROOF LEXICAL SERIALIZER
// ============================================================================
const serializeLexical = (nodes?: LexicalNode[]): React.ReactNode => {
  if (!nodes || !Array.isArray(nodes)) return null;

  return nodes.map((node, index) => {
    if (node.type === 'text') {
      const textNode = node as LexicalTextNode;
      if (!textNode.text) return null;
      
      let textContent: React.ReactNode = <span key={index}>{textNode.text}</span>;
      
      if (textNode.format && (textNode.format & 1)) textContent = <strong key={index}>{textContent}</strong>;
      if (textNode.format && (textNode.format & 2)) textContent = <em key={index}>{textContent}</em>;
      return textContent;
    }

    const elementNode = node as LexicalElementNode;
    if (!elementNode.children) return null;

    if (elementNode.type === 'paragraph') {
      return (
        <p key={index} className="mb-4 last:mb-0 text-gray-700 leading-relaxed">
          {serializeLexical(elementNode.children)}
        </p>
      );
    }

    if (elementNode.type === 'list') {
      const Tag = elementNode.listType === 'number' ? 'ol' : 'ul';
      const listStyle = elementNode.listType === 'number' ? 'list-decimal' : 'list-disc';
      return (
        <Tag key={index} className={`list-inside ${listStyle} ml-4 mb-4 text-gray-700`}>
          {serializeLexical(elementNode.children)}
        </Tag>
      );
    }

    if (elementNode.type === 'listitem') {
      return <li key={index}>{serializeLexical(elementNode.children)}</li>;
    }

    return null; 
  });
};

// ============================================================================
// SERVER COMPONENT (SSR)
// ============================================================================
export default async function DoctorProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const payload = await getPayload({ config: configPromise });

  let doctor;
  
  try {
    doctor = await payload.findByID({
      collection: 'doctors',
      id: resolvedParams.id,
      depth: 3, 
    });
  } catch (error) {
    notFound(); 
  }

  const profilePicUrl = doctor.profilePicture && typeof doctor.profilePicture === 'object' && 'url' in doctor.profilePicture
    ? doctor.profilePicture.url 
    : null;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <article className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* ========================================================= */}
        {/* ROW 1: CSS GRID MAGIC (SEO & A11y Optimized)              */}
        {/* ========================================================= */}
        <header className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8 p-8 md:p-12 border-b border-gray-100">
          
          {/* BLOCK A: Core Info (H1, Link, Badges) 
              DOM Order 1: High SEO priority. 
              Mobile: Renders 1st. 
              Desktop: Forced to Right Column, Row 1 */}
          <div className="flex flex-col justify-start md:col-start-2 md:row-start-1">
            <Link 
              href="/doctors" 
              className="text-sm text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center gap-2 font-bold transition-colors w-fit"
            >
              &larr; Back to Directory
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray(doctor.specialty) && doctor.specialty.map((spec) => {
                const specObj = typeof spec === 'object' && spec !== null ? spec as SpecialtyRecord : null;
                if (!specObj) return null;
                return (
                  <span 
                    key={specObj.id} 
                    className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-wider shadow-sm"
                  >
                    {specObj.name}
                  </span>
                );
              })}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Dr. {doctor.name}
            </h1>
          </div>

          {/* BLOCK B: Profile Image 
              DOM Order 2. 
              Mobile: Renders 2nd (Below name). 
              Desktop: Forced to Left Column, Spans Rows 1 & 2 */}
          <div className="flex justify-center md:justify-start items-start md:col-start-1 md:row-start-1 md:row-span-2 mt-4 md:mt-0">
            {profilePicUrl ? (
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5 bg-gray-50">
                <Image
                  src={profilePicUrl}
                  alt={`Portrait of Dr. ${doctor.name}`}
                  fill
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/5 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 font-bold text-xs uppercase tracking-wider text-center px-4">
                  Photo Unavailable
                </span>
              </div>
            )}
          </div>

          {/* BLOCK C: Trust Signals (Logos) 
              DOM Order 3. 
              Mobile: Renders 3rd. 
              Desktop: Forced to Right Column, Row 2 */}
          <div className="space-y-8 md:col-start-2 md:row-start-2 flex flex-col justify-end pt-4 md:pt-0">
            
            {Array.isArray(doctor.affiliations) && doctor.affiliations.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-3">
                  Affiliations
                </h3>
                <div className="flex flex-wrap gap-4 items-center">
                  {doctor.affiliations.map((inst) => {
                    const instObj = typeof inst === 'object' && inst !== null ? inst as TrustSignalRecord : null;
                    const logoUrl = instObj?.logo && typeof instObj.logo === 'object' && 'url' in instObj.logo ? instObj.logo.url : null;
                    if (!instObj || !logoUrl) return null; 

                    return (
                      <div key={instObj.id} className="group relative">
                        <div className="h-12 w-20 relative grayscale hover:grayscale-0 transition-all duration-300">
                          <Image src={logoUrl} alt={instObj.name} fill className="object-contain" sizes="80px" />
                        </div>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                          {instObj.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {Array.isArray(doctor.certifications) && doctor.certifications.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Board Certifications
                </h3>
                <div className="flex flex-wrap gap-4 items-center">
                  {doctor.certifications.map((cert) => {
                    const certObj = typeof cert === 'object' && cert !== null ? cert as TrustSignalRecord : null;
                    const logoUrl = certObj?.logo && typeof certObj.logo === 'object' && 'url' in certObj.logo ? certObj.logo.url : null;
                    if (!certObj || !logoUrl) return null; 

                    return (
                      <div key={certObj.id} className="group relative">
                        <div className="h-12 w-20 relative grayscale hover:grayscale-0 transition-all duration-300">
                          <Image src={logoUrl} alt={certObj.name} fill className="object-contain" sizes="80px" />
                        </div>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                          {certObj.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ========================================================= */}
        {/* ROW 2: BIOGRAPHY                                          */}
        {/* ========================================================= */}
        <section className="p-6 md:p-6 bg-white border-b border-gray-100">
          {/*<h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Overview</h2>*/}
          <div className="prose prose-blue prose-lg max-w-none text-gray-600 leading-relaxed">
            {doctor.biography && typeof doctor.biography === 'object' && 'root' in doctor.biography && (doctor.biography as any).root?.children ? (
              serializeLexical((doctor.biography as any).root.children)
            ) : (
              <p className="italic text-gray-400">Professional biography is currently being updated.</p>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* ROW 3: LEAD CAPTURE                                       */}
        {/* ========================================================= */}
        <section className="p-6 md:p-12 bg-gray-50/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Request a Consultation</h2>
              <p className="text-gray-500 mt-2">Connect with our medical concierge to schedule an appointment with Dr. {doctor.name}.</p>
            </div>
            <LeadForm doctorId={doctor.id} />
          </div>
        </section>

      </article>
    </main>
  );
}