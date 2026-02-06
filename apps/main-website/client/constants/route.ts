export const publicRoutes = {
  home: '/',
  about: '/about',
  contact: '/contact',
  faculties: '/faculties',
  forms: '/forms',
  more: '/more',
} as const;

export const adminRoutes = {
  login: '/admin/login',
  dashboard: '/admin',
  hero: '/admin/hero',
  sections: '/admin/sections',
} as const;
