import type { Metadata } from 'next'
import { MedicalTourismPage } from '@/app/components/Seo/MedicalTourismPage'
import { getSiteUrl } from '@/lib/siteUrl'

export const revalidate = 3600

const title = 'Medical Tourism in Mexico | Safe, Affordable Treatment in Queretaro'
const description =
  'Explore medical tourism in Mexico for American patients seeking safe, affordable treatment, vetted specialists, bilingual coordination and recovery support in Queretaro.'

const faqs = [
  {
    question: 'Is medical tourism in Mexico safe for American patients?',
    answer:
      'Medical tourism can be safer when patients choose vetted specialists, modern private hospitals, clear pre-travel planning and bilingual coordination. Elite Medical Journey focuses on Queretaro because it offers a calmer recovery environment and strong private medical infrastructure.',
  },
  {
    question: 'Why choose Queretaro instead of a border city?',
    answer:
      'Queretaro gives patients a more planned, less chaotic medical travel experience. The city offers modern hospitals, business-class infrastructure, recovery-friendly zones and access to San Miguel de Allende, Bernal and a historic center that companions can comfortably enjoy.',
  },
  {
    question: 'Do doctors and coordinators speak English?',
    answer:
      'The journey is designed around bilingual communication. Patients receive support with records, appointments, logistics, discharge instructions and follow-up so important medical details are understood before decisions are made.',
  },
  {
    question: 'What procedures are available through medical tourism in Mexico?',
    answer:
      'Patients commonly compare orthopedic, spine, dental, cosmetic and bariatric care in Mexico. Elite Medical Journey currently focuses on vetted procedures and specialists listed in the platform procedure directory.',
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
      title="Medical tourism in Mexico, planned around safety and clarity."
      description="For American patients, Mexico can offer meaningful value in private medical care. The difference is choosing a destination, specialist and recovery plan built around safety instead of shortcuts."
      primaryCta={{ href: '/procedures', label: 'Compare procedures' }}
      secondaryCta={{ href: '/why-queretaro', label: 'Why Queretaro' }}
      introTitle="Mexico is attractive for medical travel, but the right structure matters."
      introBody={[
        'Many patients begin their search with price. That is understandable, especially when U.S. healthcare costs are high or insurance leaves large gaps. But medical tourism should never be treated like bargain shopping. The better question is where cost, quality, communication and recovery planning meet.',
        'Elite Medical Journey positions Queretaro as a more refined alternative inside Mexico: a modern city with private hospitals, vetted specialists, bilingual coordination and recovery settings that feel organized rather than improvised.',
      ]}
      featuresTitle="What makes medical tourism in Mexico work for patients"
      features={[
        {
          title: 'Lower total cost potential',
          description:
            'Mexico can offer private medical care at a lower overall cost than many U.S. self-pay pathways, especially when coordination and recovery logistics are planned early.',
        },
        {
          title: 'Specialist-led decision making',
          description:
            'Patients should compare credentials, hospital privileges, procedure fit and aftercare, not just the advertised price of a treatment.',
        },
        {
          title: 'Bilingual coordination',
          description:
            'English-speaking support reduces uncertainty around medical records, instructions, arrival logistics and follow-up communication.',
        },
        {
          title: 'Private hospital environments',
          description:
            'Modern private hospitals can provide technology, privacy and comfort standards that international patients expect during treatment.',
        },
        {
          title: 'Recovery planning',
          description:
            'The recovery environment matters: hotel selection, transportation, follow-up visits and fit-to-fly timing can affect the whole experience.',
        },
        {
          title: 'A calmer destination',
          description:
            'Queretaro offers a safer-feeling, more orderly experience than many high-volume medical tourism corridors.',
        },
      ]}
      costTitle="Affordable should mean transparent, not cheap."
      costBody={[
        'Patients searching for medical tourism in Mexico often want affordability. That is valid, but price only helps when the full scope is clear: consultation, procedure, facility, anesthesia, imaging, medications, recovery support, transportation and follow-up.',
        'A low headline price can become expensive if it excludes essential care. Our content and lead process are designed to move patients toward a personalized estimate after clinical review, not a generic quote that ignores risk and complexity.',
      ]}
      safetyTitle="The safer path is informed comparison."
      safetyBody={[
        'Medical tourism carries real responsibility. Patients should understand surgeon training, hospital environment, procedure candidacy, recovery restrictions and what happens if plans change.',
        'The goal is not to convince every patient to travel. The goal is to help the right patient make a better-informed decision with clear coordination, specialist input and practical recovery planning.',
      ]}
      faqs={faqs}
      relatedLinks={[
        {
          href: '/affordable-medical-treatments-mexico',
          title: 'Affordable treatments in Mexico',
          description: 'Understand how patients can compare treatment value without compromising safety.',
        },
        {
          href: '/medical-tourism-mexico-costs',
          title: 'Medical tourism costs',
          description: 'See what affects total cost, from procedure complexity to recovery support.',
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
