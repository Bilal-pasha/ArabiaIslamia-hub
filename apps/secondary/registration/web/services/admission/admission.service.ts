import { apiClient } from '../../lib/axios-instance';

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
  madhab: string | null;
  photoFileKey: string | null;
  idFileKey: string | null;
  authorityLetterFileKey: string | null;
  previousResultFileKey: string | null;
  status: string;
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
    '/admission/submit',
    data
  );
  return response;
}

export async function fetchApplications(): Promise<AdmissionApplication[]> {
  const { data } = await apiClient.get<AdmissionApplication[]>('/admission');
  return data;
}

export async function fetchApplication(id: string): Promise<AdmissionApplication> {
  const { data } = await apiClient.get<AdmissionApplication>(`/admission/${id}`);
  return data;
}

export async function getFileViewUrl(key: string): Promise<string> {
  const { data } = await apiClient.get<{ url: string }>(`/upload/presign-get?key=${encodeURIComponent(key)}`);
  return data.url;
}
