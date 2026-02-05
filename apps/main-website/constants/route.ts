export const publicRoutes = {
  home: '/',
  about: '/about',
  contact: '/contact',
  faculties: '/faculties',
  forms: '/forms',
  more: '/more',
} as const;

export const adminRoutes = {
  signin: '/admin/signin',
  dashboard: '/admin',
  hero: '/admin/hero',
  sections: '/admin/sections',
} as const;
