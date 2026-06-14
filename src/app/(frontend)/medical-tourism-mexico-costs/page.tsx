import type { Metadata } from 'next'
import { MedicalTourismPage } from '@/app/components/Seo/MedicalTourismPage'
import { getSiteUrl } from '@/lib/siteUrl'

export const revalidate = 3600

const title = 'Medical Tourism Mexico Costs | Treatment Pricing and Travel Planning'
const description =
  'Understand medical tourism costs in Mexico, including procedure pricing, hospital factors, recovery planning, travel logistics and personalized quotes in Queretaro.'

const faqs = [
  {
    question: 'How much does medical tourism in Mexico cost?',
    answer:
      'Costs vary by procedure, diagnosis, hospital, anesthesia, imaging, recovery needs and travel plan. A reliable estimate usually requires records review and specialist input.',
  },
  {
    question: 'What should be included in a medical tourism quote?',
    answer:
      'Patients should ask about surgeon fees, hospital or facility fees, anesthesia, imaging, lab work, medications, follow-up visits, transportation, recovery hotel needs and companion logistics.',
  },
  {
    question: 'Can medical treatment in Mexico save money compared with the United States?',
    answer:
      'Many patients find lower self-pay pathways in Mexico, but savings should be evaluated alongside safety, specialist credentials, hospital setting and recovery support.',
  },
  {
    question: 'Why can two patients receive different prices for the same procedure?',
    answer:
      'Medical complexity, imaging findings, anesthesia needs, implant or device requirements, hospital length of stay and recovery support can change the final estimate.',
  },
]

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/medical-tourism-mexico-costs',
  },
  keywords: [
    'medical tourism Mexico costs',
    'medical treatment Mexico cost',
    'surgery cost Mexico',
    'medical tourism pricing Mexico',
    'affordable surgery Mexico cost',
    'Queretaro surgery cost',
    'medical travel Mexico cost',
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

export default function MedicalTourismMexicoCostsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: title,
    description,
    url: `${getSiteUrl()}/medical-tourism-mexico-costs`,
    about: ['Medical tourism Mexico costs', 'Surgery pricing in Mexico', 'International patient travel planning'],
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
      eyebrow="Medical tourism costs"
      title="Understand medical tourism costs in Mexico before you travel."
      description="A smart medical travel budget includes the procedure, hospital, specialist, recovery plan and logistics. Transparent planning helps patients compare real value, not just advertised prices."
      primaryCta={{ href: '/procedures', label: 'See procedure pricing' }}
      secondaryCta={{ href: '/affordable-medical-treatments-mexico', label: 'Affordable care guide' }}
      introTitle="The real cost of medical tourism is the complete care plan."
      introBody={[
        'Patients often compare medical tourism costs in Mexico because they want an alternative to high U.S. self-pay prices. But a useful comparison must include all parts of the journey, not just the surgery fee.',
        'In Queretaro, the strongest patient experience starts with medical review, specialist matching, hospital planning, bilingual coordination and recovery support. Those details help patients understand what they are paying for and what could change after clinical evaluation.',
      ]}
      featuresTitle="What affects the cost of medical treatment in Mexico"
      features={[
        {
          title: 'Procedure complexity',
          description:
            'Diagnosis, imaging findings, surgical approach, implants, technology and operating time can change the estimate.',
        },
        {
          title: 'Hospital and facility level',
          description:
            'Private hospital infrastructure, room type, operating room resources and length of stay affect total cost.',
        },
        {
          title: 'Specialist and anesthesia fees',
          description:
            'Surgeon, assistant, anesthesiology and clinical team fees should be clearly understood before travel.',
        },
        {
          title: 'Pre-op testing',
          description:
            'Labs, imaging, cardiology or anesthesia clearance may be needed depending on age, health history and procedure.',
        },
        {
          title: 'Recovery support',
          description:
            'Hotel recovery, nursing support, wound checks, medication control and transportation can affect the total budget.',
        },
        {
          title: 'Travel timing',
          description:
            'Flights, companion stay, fit-to-fly clearance and extra recovery days should be included in practical planning.',
        },
      ]}
      costTitle="A good estimate explains the assumptions."
      costBody={[
        'Patients should be cautious with one-size-fits-all prices. Medical treatment costs depend on clinical factors that are not always visible in a simple online form.',
        'The better process is to provide relevant records, clarify symptoms or goals, receive specialist review and then compare a treatment pathway with realistic cost ranges and next steps.',
      ]}
      safetyTitle="Cost planning is also risk planning."
      safetyBody={[
        'A budget that ignores recovery, follow-up or complications is incomplete. Patients should know how long they may need to stay, what restrictions apply and who answers questions after discharge.',
        'Elite Medical Journey focuses on coordinated care because the most affordable option is the one that is clear, appropriate and supported from consultation through return home.',
      ]}
      faqs={faqs}
      relatedLinks={[
        {
          href: '/procedures',
          title: 'Procedure pricing',
          description: 'Review starting prices and treatment details for active procedures.',
        },
        {
          href: '/medical-tourism-mexico',
          title: 'Medical tourism in Mexico',
          description: 'Understand the broader destination and patient journey.',
        },
        {
          href: '/why-queretaro',
          title: 'Why Queretaro',
          description: 'See why Queretaro can be a strong recovery base for U.S. patients.',
        },
      ]}
      jsonLd={jsonLd}
    />
  )
}
