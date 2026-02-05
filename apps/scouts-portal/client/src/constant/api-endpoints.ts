/**
 * API endpoints used by services.
 * Services import from here; axios instance is in utils/axios-instance.
 */

export const studentsEndpoints = {
  byClass: (classSlug: string) => `/api/classes/${classSlug}/students`,
  detail: (id: string) => `/api/students/${id}`,
} as const;

export const uploadEndpoints = {
  presign: '/api/upload/presign',
  presignGet: (key: string) =>
    `/api/upload/presign-get?key=${encodeURIComponent(key)}`,
} as const;
