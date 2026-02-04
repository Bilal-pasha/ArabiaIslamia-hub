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

/**
 * App URLs: must come from env — base path/domain differs per app, so do not use /{app} redirects.
 * Set NEXT_PUBLIC_SECONDARY_APP_URL, NEXT_PUBLIC_HUFFAZ_APP_URL, NEXT_PUBLIC_SCOUTS_APP_URL
 * to full URLs (e.g. https://secondary.example.com or https://example.com/secondary).
 */
const getAppUrl = (key: string): string =>
  typeof process !== 'undefined' && process.env?.[key] ? String(process.env[key]).trim() : '';

const secondaryAppUrl = getAppUrl('NEXT_PUBLIC_SECONDARY_APP_URL');
const huffazAppUrl = getAppUrl('NEXT_PUBLIC_HUFFAZ_APP_URL');
const scoutsAppUrl = getAppUrl('NEXT_PUBLIC_SCOUTS_APP_URL');

export const NAV_DATA: NavLinkItem[] = [
  {
    text: 'Faculties',
    href: '/faculties',
    links: [
      { text: 'Tahfeez ul Quran', href: '/faculties', icon: BookOpen },
      { text: 'Dars-e-Nizami', href: '/faculties', icon: CapIcon },
      { text: 'Mahad ul Arabia', href: '/faculties', icon: Landmark },
      { text: 'Schooling System', href: '/faculties', icon: School },
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
  { text: 'Secondary School', href: secondaryAppUrl, description: 'Portal & admissions' },
  { text: 'Huffaz', href: huffazAppUrl, description: 'Tahfeez & registration' },
  { text: 'Scouts Portal', href: scoutsAppUrl, description: 'Scouts registration & portal' },
].filter((app) => app.href !== '');
