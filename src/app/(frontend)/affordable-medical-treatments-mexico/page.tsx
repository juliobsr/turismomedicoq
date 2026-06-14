import type { Metadata } from 'next'
import { MedicalTourismPage } from '@/app/components/Seo/MedicalTourismPage'
import { getSiteUrl } from '@/lib/siteUrl'

export const revalidate = 3600

const title = 'Affordable Medical Treatments in Mexico | Safe Care in Queretaro'
const description =
  'Compare affordable medical treatments in Mexico with vetted specialists, private hospitals, bilingual coordination and recovery planning for U.S. patients.'

const faqs = [
  {
    question: 'What does affordable medical treatment in Mexico mean?',
    answer:
      'Affordable treatment should mean stronger value, not reduced safety. Patients should compare specialist credentials, hospital setting, included services, recovery planning and follow-up before deciding.',
  },
  {
    question: 'Are lower prices in Mexico always better?',
    answer:
      'No. A lower price can hide missing items such as imaging, anesthesia, medication, recovery hotel needs or follow-up. A useful estimate should clarify what is included and what may vary after clinical review.',
  },
  {
    question: 'Which treatments can be more affordable in Mexico?',
    answer:
      'Many U.S. patients compare orthopedic, spine, dental, cosmetic and bariatric procedures in Mexico. Elite Medical Journey focuses on treatments connected to vetted specialists and private facilities in its network.',
  },
  {
    question: 'Can I get a quote before traveling?',
    answer:
      'Patients can begin with a clinical review request before traveling. The safest quote process usually requires medical history, imaging or records, procedure goals and specialist review.',
  },
]

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/affordable-medical-treatments-mexico',
  },
  keywords: [
    'affordable medical treatments Mexico',
    'affordable treatments Mexico',
    'affordable surgery Mexico',
    'low cost medical treatment Mexico',
    'safe affordable surgery Mexico',
    'medical tourism Mexico affordable',
    'Queretaro affordable medical treatment',
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

export default function AffordableMedicalTreatmentsMexicoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: title,
    description,
    url: `${getSiteUrl()}/affordable-medical-treatments-mexico`,
    about: ['Affordable medical treatments in Mexico', 'Medical tourism value', 'Private medical care in Queretaro'],
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
      eyebrow="Affordable treatments Mexico"
      title="Affordable medical treatments in Mexico, built around value instead of shortcuts."
      description="For U.S. patients, Mexico can make private medical care more accessible. The right choice combines transparent pricing, vetted specialists, private hospitals and recovery planning that protects the patient after treatment."
      primaryCta={{ href: '/medical-tourism-mexico-costs', label: 'Understand costs' }}
      secondaryCta={{ href: '/procedures', label: 'View procedures' }}
      introTitle="Affordable care should feel organized, not uncertain."
      introBody={[
        'Patients often search for affordable medical treatments in Mexico because U.S. pricing can delay care, create financial pressure or leave limited self-pay options. That search is valid, but medical decisions deserve more than a bargain comparison.',
        'A strong treatment pathway considers candidacy, specialist experience, hospital environment, imaging, anesthesia, medication, recovery hotel needs, transportation and follow-up. When those pieces are aligned, affordability becomes value rather than risk.',
      ]}
      featuresTitle="How U.S. patients should compare affordable treatment options"
      features={[
        {
          title: 'Start with the clinical fit',
          description:
            "The right procedure depends on diagnosis, imaging, symptoms, health history and specialist evaluation, not only the patient's target budget.",
        },
        {
          title: 'Ask what the estimate includes',
          description:
            'A useful quote should clarify hospital costs, professional fees, anesthesia, imaging, medication, recovery support and items that may change.',
        },
        {
          title: 'Compare the hospital environment',
          description:
            'Private hospital infrastructure, technology, nursing, patient rooms and emergency readiness all influence safety and comfort.',
        },
        {
          title: 'Plan communication in English',
          description:
            'Bilingual coordination helps patients understand instructions, documents, scheduling, medication and discharge details before and after treatment.',
        },
        {
          title: 'Include recovery in the budget',
          description:
            'Recovery hotel needs, private transport, follow-up visits, companion planning and fit-to-fly timing are part of the real total cost.',
        },
        {
          title: 'Avoid price-only decisions',
          description:
            'Very low prices can be a warning sign if they remove essential safeguards or leave aftercare unclear.',
        },
      ]}
      costTitle="The right affordable option is the one you can understand."
      costBody={[
        'The real cost of medical travel includes more than the procedure. Patients should consider the complete path from records review through consultation, treatment, discharge and return home.',
        'Elite Medical Journey is built around coordination because affordability only matters when the patient understands what is included, what may change and how recovery will be supported.',
      ]}
      safetyTitle="Safety is not separate from value. It is the foundation of it."
      safetyBody={[
        'Patients deserve to know who is evaluating them, where the procedure may take place and how communication will work if questions come up before or after treatment.',
        'For American patients comparing Mexico, Queretaro offers an appealing balance: modern private care, calmer recovery zones and a city experience that feels organized for patients and companions.',
      ]}
      faqs={faqs}
      relatedLinks={[
        {
          href: '/medical-tourism-mexico',
          title: 'Medical tourism in Mexico',
          description: 'Learn how destination choice, coordination and recovery planning shape the patient journey.',
        },
        {
          href: '/medical-tourism-mexico-costs',
          title: 'Treatment cost guide',
          description: 'Understand what affects the total cost of care, recovery and travel.',
        },
        {
          href: '/procedures',
          title: 'Procedure directory',
          description: 'Compare available procedures and the specialists connected to each treatment.',
        },
      ]}
      jsonLd={jsonLd}
    />
  )
}
