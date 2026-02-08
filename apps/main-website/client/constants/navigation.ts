import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  GraduationCap as CapIcon,
  Landmark,
  School,
  UserPlus,
  Award,
  Download,
  ClipboardList,
} from 'lucide-react';
import { SECONDARY_APP_URL, HUFFAZ_APP_URL, SCOUTS_APP_URL } from './env';

export interface NavChildLink {
  text: string;
  href: string;
  icon?: LucideIcon;
}

export interface NavLinkItem {
  text: string;
  href: string;
  links?: NavChildLink[];
}

export const NAV_DATA: NavLinkItem[] = [
  {
    text: 'Faculties',
    href: '/faculties',
    links: [
      { text: 'Tahfeez ul Quran', href: '/faculties#tahfeez-ul-quran-faculty', icon: BookOpen },
      { text: 'Dars-e-Nizami', href: '/faculties#darse-nizami-faculty', icon: CapIcon },
      { text: 'Mahad ul Arabia', href: '/faculties#mahad-ul-lugha-tul-arabia-faculty', icon: Landmark },
      { text: 'Schooling System', href: '/faculties#schooling-system-faculty', icon: School },
    ],
  },
  { text: 'About us', href: '/about' },
  { text: 'Contact us', href: '/contact' },
  {
    text: 'More',
    href: '/more',
    links: [
      { text: 'Admissions', href: '/more#admissions', icon: UserPlus },
      { text: 'Scholarships', href: '/more#scholarships', icon: Award },
      { text: 'Downloads', href: '/more#downloads', icon: Download },
      { text: 'Results', href: '/more#results', icon: ClipboardList },
    ],
  },
];

/** Application portals (Secondary, Huffaz, Scouts) — used in header and footer; hrefs from env only */
export interface AppLinkItem {
  text: string;
  href: string;
  description?: string;
}

export const APP_LINKS: AppLinkItem[] = [
  { text: 'Secondary School', href: SECONDARY_APP_URL, description: 'Portal & admissions' },
  { text: 'Huffaz', href: HUFFAZ_APP_URL, description: 'Tahfeez & registration' },
  { text: 'Scouts Portal', href: SCOUTS_APP_URL, description: 'Scouts registration & portal' },
];
