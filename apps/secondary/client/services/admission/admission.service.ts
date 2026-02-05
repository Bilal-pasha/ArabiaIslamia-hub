import { apiClient } from '@/utils/axios-instance';
import { admissionEndpoints, uploadEndpoints } from '@/constants/api-endpoints';

export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  name: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  idNumber: string | null;
  address: string;
  permanentAddress: string | null;
  country: string;
  state: string | null;
  city: string | null;
  area: string | null;
  language: string | null;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string | null;
  guardianOccupation: string | null;
  guardianAddress: string | null;
  requiredClass: string;
  previousSchool: string | null;
  previousClass: string | null;
  previousGrade: string | null;
  isHafiz: string | null;
  accommodationType: string;
  photoFileKey: string | null;
  idFileKey: string | null;
  authorityLetterFileKey: string | null;
  previousResultFileKey: string | null;
  status: string;
  statusReason?: string | null;
  oralTestMarks?: string | null;
  oralTestPassed?: boolean | null;
  writtenAdmitEligible?: boolean;
  createdAt: string;
}

export interface SubmitAdmissionResponse {
  applicationNumber: string;
  id: string;
}

export async function submitAdmission(
  data: Record<string, string>
): Promise<SubmitAdmissionResponse> {
  const { data: response } = await apiClient.post<SubmitAdmissionResponse>(
    admissionEndpoints.submit,
    data
  );
  return response;
}

export async function fetchApplications(): Promise<AdmissionApplication[]> {
  const { data } = await apiClient.get<AdmissionApplication[]>(admissionEndpoints.list);
  return data;
}

export async function fetchApplication(id: string): Promise<AdmissionApplication> {
  const { data } = await apiClient.get<AdmissionApplication>(admissionEndpoints.detail(id));
  return data;
}

export async function findByApplicationNumber(
  applicationNumber: string
): Promise<AdmissionApplication | null> {
  const { data } = await apiClient.get<AdmissionApplication | null>(
    admissionEndpoints.byNumber(applicationNumber)
  );
  return data;
}

export async function updateStatus(
  id: string,
  status: 'approved' | 'rejected',
  reason?: string
): Promise<AdmissionApplication> {
  const { data } = await apiClient.patch<AdmissionApplication>(admissionEndpoints.status(id), {
    status,
    reason,
  });
  return data;
}

export async function updateOralTest(
  id: string,
  payload: { marks?: string; passed: boolean; reason?: string }
): Promise<AdmissionApplication> {
  const { data } = await apiClient.patch<AdmissionApplication>(admissionEndpoints.oralTest(id), payload);
  return data;
}

export async function setWrittenAdmitEligible(id: string): Promise<AdmissionApplication> {
  const { data } = await apiClient.patch<AdmissionApplication>(
    admissionEndpoints.writtenAdmitEligible(id)
  );
  return data;
}

export async function getFileViewUrl(key: string): Promise<string> {
  const { data } = await apiClient.get<{ url: string }>(uploadEndpoints.presignGet(key));
  return data.url;
}
