import type { Metadata } from 'next'
import { MedicalTourismPage } from '@/app/components/Seo/MedicalTourismPage'
import { getSiteUrl } from '@/lib/siteUrl'

export const revalidate = 3600

const title = 'Medical Tourism in Mexico | Private Care for U.S. Patients'
const description =
  'Plan medical tourism in Mexico with vetted specialists, private hospitals, bilingual coordination and recovery support in Queretaro for U.S. patients.'

const faqs = [
  {
    question: 'Is medical tourism in Mexico safe for American patients?',
    answer:
      'Medical tourism can be approached more safely when patients work with vetted specialists, private hospital environments, bilingual coordination and a clear plan before travel. Elite Medical Journey focuses on Queretaro because it combines modern medical infrastructure with a calmer recovery setting.',
  },
  {
    question: 'Why choose Queretaro instead of a border city?',
    answer:
      'Queretaro gives patients a more organized, destination-level medical travel experience. The city offers modern private hospitals, executive infrastructure, recovery-friendly zones and easy access to San Miguel de Allende, Bernal and its UNESCO-listed historic center.',
  },
  {
    question: 'Do doctors and coordinators speak English?',
    answer:
      'The patient journey is designed around bilingual communication. Patients receive English-language support with records, appointments, logistics, discharge instructions and follow-up so important details are understood before decisions are made.',
  },
  {
    question: 'What procedures are available through medical tourism in Mexico?',
    answer:
      'U.S. patients commonly compare orthopedic, spine, dental, cosmetic and bariatric care in Mexico. Elite Medical Journey focuses on procedures connected to vetted doctors, private facilities and coordinated recovery planning.',
  },
]

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/medical-tourism-mexico',
  },
  keywords: [
    'medical tourism Mexico',
    'medical tourism in Mexico',
    'safe medical tourism Mexico',
    'medical tourism Mexico for Americans',
    'medical treatment in Mexico',
    'Queretaro medical tourism',
    'affordable medical treatment Mexico',
  ],
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function MedicalTourismMexicoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: title,
    description,
    url: `${getSiteUrl()}/medical-tourism-mexico`,
    about: ['Medical tourism in Mexico', 'International patient coordination', 'Queretaro medical care'],
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <MedicalTourismPage
      eyebrow="Medical tourism Mexico"
      title="Medical tourism in Mexico, designed for clarity before you travel."
      description="For U.S. patients facing high self-pay costs, Mexico can offer access to private medical care with meaningful value. The right journey starts with vetted doctors, transparent planning, bilingual support and a recovery plan built around the patient."
      primaryCta={{ href: '/procedures', label: 'Explore procedures' }}
      secondaryCta={{ href: '/why-queretaro', label: 'Why Queretaro' }}
      introTitle="A better medical travel experience starts before the flight."
      introBody={[
        'Many patients begin researching medical tourism in Mexico because U.S. prices can make treatment feel out of reach. Cost matters, but the strongest decision is not based on a low headline price. It is based on clinical fit, specialist quality, hospital environment, communication and recovery support.',
        'Elite Medical Journey helps patients move from online research to an organized care pathway in Queretaro. The experience is built for people who want private medical care in Mexico without feeling alone, rushed or unsure about the next step.',
      ]}
      featuresTitle="What makes medical tourism in Mexico work for U.S. patients"
      features={[
        {
          title: 'Meaningful cost value',
          description:
            'Mexico can offer private treatment pathways at a lower total cost than many U.S. self-pay options, especially when the full plan is reviewed before travel.',
        },
        {
          title: 'Specialist-led decision making',
          description:
            'Patients are better served when they compare credentials, hospital privileges, candidacy, procedure fit and aftercare rather than price alone.',
        },
        {
          title: 'English-language coordination',
          description:
            'Bilingual support helps reduce friction around medical records, appointments, arrival logistics, discharge instructions and follow-up communication.',
        },
        {
          title: 'Private hospital environments',
          description:
            'Modern private hospitals in Queretaro can provide technology, privacy, comfort and clinical environments that international patients expect.',
        },
        {
          title: 'Recovery planning',
          description:
            'Hotel selection, private transportation, follow-up visits, medication planning and fit-to-fly timing are part of the journey, not afterthoughts.',
        },
        {
          title: 'A calmer Mexican destination',
          description:
            'Queretaro offers a polished, orderly and recovery-friendly alternative to crowded, high-volume medical tourism corridors.',
        },
      ]}
      costTitle="Affordable should mean transparent, complete and medically appropriate."
      costBody={[
        'Patients searching for medical tourism in Mexico often want affordability. That is reasonable. But an estimate only becomes useful when it explains what is included: consultation, hospital or facility, anesthesia, imaging, medications, recovery support, transportation and follow-up.',
        'A low advertised price can become stressful if it excludes essential care. Elite Medical Journey is designed to guide patients toward a personalized pathway after clinical review, not a generic quote that ignores medical complexity.',
      ]}
      safetyTitle="The strongest decision is an informed decision."
      safetyBody={[
        'Medical travel carries real responsibility. Patients should understand the doctor, the hospital environment, candidacy for the procedure, recovery restrictions, travel timing and what support exists if plans change.',
        'Our goal is not to convince every patient to travel. It is to help the right patient make a confident, well-informed decision with specialist input, bilingual coordination and practical recovery planning.',
      ]}
      faqs={faqs}
      relatedLinks={[
        {
          href: '/affordable-medical-treatments-mexico',
          title: 'Affordable treatments in Mexico',
          description: 'Compare treatment value in Mexico while keeping safety, coordination and recovery in focus.',
        },
        {
          href: '/medical-tourism-mexico-costs',
          title: 'Medical tourism costs',
          description: 'Understand what affects total cost, from clinical complexity to recovery support.',
        },
        {
          href: '/why-queretaro',
          title: 'Why Queretaro',
          description: 'Learn why Queretaro is a strong base for medical travel and recovery.',
        },
      ]}
      jsonLd={jsonLd}
    />
  )
}
