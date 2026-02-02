export const publicRoutes = {
  home: '/',
  form: '/registration',
  status: '/registration/status',
} as const;

export const privateRoutes = {
  applications: '/registration/admin/applications',
  applicationDetail: (id: string) => `/registration/admin/applications/${id}`,
} as const;

export const externalUrls = {
  registration: '/registration',
  applications: '/registration/admin/applications',
} as const;
