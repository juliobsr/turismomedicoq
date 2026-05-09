export const primaryNavigation = [
  { label: 'Find a Doctor', href: '/doctors' },
  { label: 'Hospitals', href: '/facilities' },
  { label: 'Patient Journey', href: '/patient-journey' },
  { label: 'Why Queretaro', href: '/why-queretaro' },
] as const

export type PrimaryNavigationItem = (typeof primaryNavigation)[number]
