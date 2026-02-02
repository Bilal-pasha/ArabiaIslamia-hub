export const publicRoutes = {
  form: '/',
  status: '/status',
} as const;

export const privateRoutes = {
  applications: '/admin/applications',
  applicationDetail: (id: string) => `/admin/applications/${id}`,
} as const;
