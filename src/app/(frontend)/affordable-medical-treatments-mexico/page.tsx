import type { Metadata } from 'next'
import { MedicalTourismPage } from '@/app/components/Seo/MedicalTourismPage'

export const revalidate = 3600

const title = 'Affordable Medical Treatments in Mexico | Safe Care in Queretaro'
const description =
  'Compare affordable medical treatments in Mexico with vetted specialists, private hospitals, bilingual coordination and recovery planning in Queretaro.'

const faqs = [
  {
    question: 'What does affordable medical treatment in Mexico mean?',
    answer:
      'Affordable treatment should mean better value, not reduced safety. Patients should compare specialist credentials, hospital setting, inclusions, recovery planning and follow-up before deciding.',
  },
  {
    question: 'Are lower prices in Mexico always better?',
    answer:
      'No. A lower price can hide missing items such as imaging, anesthesia, medication, hotel recovery or follow-up. A useful estimate should clarify what is included and what may vary after clinical review.',
  },
  {
    question: 'Which treatments can be more affordable in Mexico?',
    answer:
      'Many patients compare orthopedic, spine, dental, cosmetic and bariatric procedures. Elite Medical Journey focuses on treatments connected to vetted specialists and facilities in its network.',
  },
  {
    question: 'Can I get a quote before traveling?',
    answer:
      'Patients can begin with a clinical review request. The safest quote process usually requires medical history, imaging or records, procedure goals and a specialist review before travel decisions are made.',
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
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://elitemedicaljourney.com'}/affordable-medical-treatments-mexico`,
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
      title="Affordable medical treatments in Mexico without treating safety as optional."
      description="Patients can find meaningful value in Mexico, but the right decision starts with transparent pricing, vetted specialists and a recovery plan that protects the patient after treatment."
      primaryCta={{ href: '/medical-tourism-mexico-costs', label: 'Understand costs' }}
      secondaryCta={{ href: '/procedures', label: 'View procedures' }}
      introTitle="The best value is a complete care pathway."
      introBody={[
        'Patients often search for affordable medical treatments in Mexico because U.S. prices can feel unreachable. That search is valid. But medical care should be evaluated differently than travel deals or consumer services.',
        'A strong treatment pathway considers candidacy, specialist experience, hospital environment, imaging, anesthesia, medication, recovery hotel needs, transportation and follow-up. When those pieces are aligned, affordability becomes a question of value rather than risk.',
      ]}
      featuresTitle="How to compare affordable treatment options"
      features={[
        {
          title: 'Start with the clinical fit',
          description:
            "The right procedure depends on diagnosis, imaging, symptoms, health history and specialist evaluation, not only the patient's preferred price point.",
        },
        {
          title: 'Ask what the estimate includes',
          description:
            'A useful quote should clarify hospital, professional fees, anesthesia, imaging, medication, recovery support and any items that may change.',
        },
        {
          title: 'Compare the hospital environment',
          description:
            'Private hospitals, technology, nursing, patient rooms and emergency readiness all influence the safety and comfort of care.',
        },
        {
          title: 'Plan communication in English',
          description:
            'Bilingual coordination helps patients understand instructions, documents, scheduling, medication and discharge details.',
        },
        {
          title: 'Include recovery in the budget',
          description:
            'Hotels, transport, follow-up visits, companion needs and fit-to-fly timing are part of the real total cost.',
        },
        {
          title: 'Avoid price-only decisions',
          description:
            'Very low prices can be a warning sign if they remove essential medical safeguards or leave aftercare unclear.',
        },
      ]}
      costTitle="A lower headline price is not the same as a better outcome."
      costBody={[
        'The real cost of medical travel includes more than the procedure. Patients should consider the complete path from records review through discharge and return home.',
        'Elite Medical Journey is built around coordination because affordability only matters when the patient understands what is included, what may change and how the recovery plan will be supported.',
      ]}
      safetyTitle="Safety is part of value."
      safetyBody={[
        'Patients deserve to know who is evaluating them, where the procedure may take place and how communication will work if there are questions before or after treatment.',
        'For American patients comparing Mexico, Queretaro offers an appealing balance: modern private care, calmer recovery zones and a city experience that feels organized for patients and companions.',
      ]}
      faqs={faqs}
      relatedLinks={[
        {
          href: '/medical-tourism-mexico',
          title: 'Medical tourism in Mexico',
          description: 'Learn the broader patient journey and why destination choice matters.',
        },
        {
          href: '/medical-tourism-mexico-costs',
          title: 'Treatment cost guide',
          description: 'Review what affects the total cost of care and travel.',
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
