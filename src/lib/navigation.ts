// src/lib/navigation.ts
// src/lib/navigation.ts

export interface SubmenuItem {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  submenu?: SubmenuItem[]; // El '?' significa que es opcional
}

export const NAV_LINKS: NavLink[] = [
  { 
    label: 'Find a Doctor', 
    href: '/doctors',
    submenu: [] // Empezamos vacío para llenarlo en el Header
  },
  { label: 'How it Works', href: '/about' },
  { label: 'Why Queretaro?', href: '/why-queretaro' },
  
];

export const CONTACT_INFO = {
  phone: '(508) 000-0000',
  tel: '+15080000000',
  email: 'info@queretaromedical.com'
};