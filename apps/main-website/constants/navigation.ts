export interface NavLinkItem {
  text: string;
  href: string;
  links?: { text: string; href: string }[];
}

export const NAV_DATA: NavLinkItem[] = [
  {
    text: 'Faculties',
    href: '/faculties',
    links: [
      { text: 'Tahfeez ul Quran', href: '/faculties' },
      { text: 'Dars-e-Nizami', href: '/faculties' },
      { text: 'Mahad ul Arabia', href: '/faculties' },
      { text: 'Schooling System', href: '/faculties' },
    ],
  },
  { text: 'About us', href: '/about' },
  { text: 'Contact us', href: '/contact' },
  {
    text: 'More',
    links: [
      { text: 'Admissions', href: '/more#admissions' },
      { text: 'Scholarships', href: '/more#scholarships' },
      { text: 'Downloads', href: '/more#downloads' },
      { text: 'Results', href: '/more#results' },
    ],
  },
];
