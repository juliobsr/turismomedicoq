import type { Metadata } from 'next'
import { MedicalTourismPage } from '@/app/components/Seo/MedicalTourismPage'
import { getSiteUrl } from '@/lib/siteUrl'

export const revalidate = 3600

const title = 'Medical Tourism Mexico Costs | Treatment Pricing and Travel Planning'
const description =
  'Understand medical tourism costs in Mexico with private hospital planning, specialist review, recovery support and travel logistics for U.S. patients.'

const faqs = [
  {
    question: 'How much does medical tourism in Mexico cost?',
    answer:
      'Costs vary by diagnosis, procedure, hospital, anesthesia, imaging, implants or devices, recovery needs and travel timing. A reliable estimate usually requires medical records review and specialist input.',
  },
  {
    question: 'What should be included in a medical tourism quote?',
    answer:
      'Patients should ask whether the quote includes surgeon fees, hospital or facility fees, anesthesia, imaging, lab work, medications, follow-up visits, transportation, recovery hotel needs and companion logistics.',
  },
  {
    question: 'Can medical treatment in Mexico save money compared with the United States?',
    answer:
      'Many U.S. patients find lower self-pay pathways in Mexico. Those savings should be evaluated alongside specialist credentials, hospital setting, communication, recovery support and the full scope of care.',
  },
  {
    question: 'Why can two patients receive different prices for the same procedure?',
    answer:
      'Two patients may need different plans because of medical complexity, imaging findings, anesthesia needs, implant or device requirements, hospital length of stay and recovery support.',
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
      title="Understand medical tourism costs in Mexico with the full plan in view."
      description="A smart medical travel budget includes the doctor, facility, anesthesia, recovery, transportation and follow-up. Transparent planning helps U.S. patients compare real value instead of isolated prices."
      primaryCta={{ href: '/procedures', label: 'Compare procedures' }}
      secondaryCta={{ href: '/affordable-medical-treatments-mexico', label: 'Affordable care guide' }}
      introTitle="A useful price estimate explains the medical pathway behind it."
      introBody={[
        'Patients often compare medical tourism costs in Mexico because U.S. self-pay prices can be difficult to justify or impossible to manage. A useful comparison must include the full care pathway, not only the procedure fee.',
        'In Queretaro, a stronger patient experience starts with records review, specialist matching, hospital planning, bilingual coordination and realistic recovery support. Those details help patients understand what is included, what may vary and what needs to be confirmed before travel.',
      ]}
      featuresTitle="What affects the cost of medical treatment in Mexico"
      features={[
        {
          title: 'Procedure complexity',
          description:
            'Diagnosis, imaging findings, surgical approach, implants, technology and operating time can all change the estimate.',
        },
        {
          title: 'Hospital and facility level',
          description:
            'Private hospital infrastructure, operating room resources, room type and length of stay affect total cost.',
        },
        {
          title: 'Specialist and anesthesia fees',
          description:
            'Surgeon, assistant, anesthesiology and clinical team fees should be clearly explained before the patient commits to travel.',
        },
        {
          title: 'Pre-op testing',
          description:
            'Labs, imaging, cardiology review or anesthesia clearance may be needed depending on age, health history and procedure.',
        },
        {
          title: 'Recovery support',
          description:
            'Recovery hotel needs, nursing support, wound checks, medication control and private transportation can affect the total budget.',
        },
        {
          title: 'Travel timing',
          description:
            'Flights, companion stay, fit-to-fly clearance and extra recovery days should be included in practical planning.',
        },
      ]}
      costTitle="The best estimate is transparent about what it includes."
      costBody={[
        'Patients should be cautious with one-size-fits-all prices. Medical treatment costs depend on clinical factors that are not always visible in a simple online form or initial message.',
        'The better process is to share relevant records, clarify symptoms or goals, receive specialist review and then compare a treatment pathway with realistic cost ranges and next steps.',
      ]}
      safetyTitle="Cost planning should reduce uncertainty, not create it."
      safetyBody={[
        'A budget that ignores recovery, follow-up or possible plan changes is incomplete. Patients should know how long they may need to stay, what restrictions apply and who answers questions after discharge.',
        'Elite Medical Journey focuses on coordinated care because the strongest value is the option that is clear, clinically appropriate and supported from consultation through return home.',
      ]}
      faqs={faqs}
      relatedLinks={[
        {
          href: '/procedures',
          title: 'Procedure pricing',
          description: 'Review available procedures and the details that influence treatment planning.',
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
