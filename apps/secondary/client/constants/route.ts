export const publicRoutes = {
  home: '/',
  form: '/registration',
  status: '/registration/status',
} as const;

export const privateRoutes = {
  dashboard: '/registration/admin',
  applications: '/registration/admin/applications',
  applicationDetail: (id: string) => `/registration/admin/applications/${id}`,
  students: '/registration/admin/students',
  studentDetail: (id: string) => `/registration/admin/students/${id}`,
  users: '/registration/admin/users',
  signin: '/registration/admin/signin',
} as const;

export const externalUrls = {
  registration: '/registration',
  applications: '/registration/admin/applications',
  status: '/registration/status',
} as const;
