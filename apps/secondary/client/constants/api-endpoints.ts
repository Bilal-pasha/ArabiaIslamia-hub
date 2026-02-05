/**
 * API endpoints used by services.
 * Services import from here; axios instance is in utils/axios-instance.
 */

export const admissionEndpoints = {
  submit: '/admission/submit',
  list: '/admission',
  detail: (id: string) => `/admission/${id}`,
  byNumber: (applicationNumber: string) =>
    `/admission/by-number/${encodeURIComponent(applicationNumber)}`,
  status: (id: string) => `/admission/${id}/status`,
  quranTest: (id: string) => `/admission/${id}/quran-test`,
  oralTest: (id: string) => `/admission/${id}/oral-test`,
  writtenAdmitEligible: (id: string) => `/admission/${id}/written-admit-eligible`,
  writtenTest: (id: string) => `/admission/${id}/written-test`,
  fullyApprove: (id: string) => `/admission/${id}/fully-approve`,
  studentsList: '/admission/students',
  studentDetail: (id: string) => `/admission/students/${id}`,
} as const;

export const uploadEndpoints = {
  presign: '/upload/presign',
  presignGet: (key: string) => `/upload/presign-get?key=${encodeURIComponent(key)}`,
} as const;
