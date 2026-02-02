const REGISTRATION_BASE =
  process.env.NEXT_PUBLIC_REGISTRATION_URL || 'http://localhost:3012';

export const publicRoutes = {
  home: '/',
} as const;

export const privateRoutes = {
  applications: `${REGISTRATION_BASE}/admin/applications`,
} as const;

export const externalUrls = {
  registration: REGISTRATION_BASE,
  applications: `${REGISTRATION_BASE}/admin/applications`,
} as const;
