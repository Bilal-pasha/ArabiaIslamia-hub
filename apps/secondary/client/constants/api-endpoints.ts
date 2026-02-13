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
  admitCard: (applicationId: string, type?: string) =>
    type
      ? `/admission/admit-card/${applicationId}?type=${encodeURIComponent(type)}`
      : `/admission/admit-card/${applicationId}`,
  status: (id: string) => `/admission/${id}/status`,
  quranTest: (id: string) => `/admission/${id}/quran-test`,
  oralTest: (id: string) => `/admission/${id}/oral-test`,
  writtenAdmitEligible: (id: string) => `/admission/${id}/written-admit-eligible`,
  writtenTest: (id: string) => `/admission/${id}/written-test`,
  fullyApprove: (id: string) => `/admission/${id}/fully-approve`,
  studentsList: '/admission/students',
  studentDetail: (id: string) => `/admission/students/${id}`,
  academicSessions: '/admission/academic-sessions',
  classes: '/admission/classes',
  sections: (classId?: string) =>
    classId ? `/admission/sections?classId=${encodeURIComponent(classId)}` : '/admission/sections',
  studentByRoll: (rollNumber: string) =>
    `/admission/student-by-roll/${encodeURIComponent(rollNumber)}`,
  submitRenewal: '/admission/renewal',
  renewalsList: '/admission/renewals',
  renewalDetail: (id: string) => `/admission/renewals/${id}`,
  renewalStatus: (id: string) => `/admission/renewals/${id}/status`,
  stats: '/admission/stats',
  deleteApplication: (id: string) => `/admission/${id}`,
  deleteStudent: (id: string) => `/admission/students/${id}`,
} as const;

export const uploadEndpoints = {
  presign: '/upload/presign',
  presignGet: (key: string) => `/upload/presign-get?key=${encodeURIComponent(key)}`,
} as const;
