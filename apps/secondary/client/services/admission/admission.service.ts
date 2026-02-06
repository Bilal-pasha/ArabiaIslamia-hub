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
  requiredClassId: string | null;
  class?: { id: string; name: string } | null;
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
  quranTestPassed?: boolean | null;
  quranTestMarks?: string | null;
  quranTestReason?: string | null;
  oralTestMarks?: string | null;
  oralTestPassed?: boolean | null;
  writtenAdmitEligible?: boolean;
  writtenTestPassed?: boolean | null;
  writtenTestMarks?: string | null;
  writtenTestReason?: string | null;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  dateOfBirth: string | null;
  gender: string | null;
  guardianName: string | null;
  contact: string | null;
  address: string | null;
  photo: string | null;
  rollNumber: string | null;
  admissionApplicationId: string | null;
  admissionApplication?: AdmissionApplication | null;
  createdAt: string;
  updatedAt: string;
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

export async function updateQuranTest(
  id: string,
  payload: { marks?: string; passed: boolean; reason?: string }
): Promise<AdmissionApplication> {
  const { data } = await apiClient.patch<AdmissionApplication>(admissionEndpoints.quranTest(id), payload);
  return data;
}

export async function updateWrittenTest(
  id: string,
  payload: { marks?: string; passed: boolean; reason?: string }
): Promise<AdmissionApplication> {
  const { data } = await apiClient.patch<AdmissionApplication>(admissionEndpoints.writtenTest(id), payload);
  return data;
}

export async function fullyApprove(id: string): Promise<{ application: AdmissionApplication; student: Student }> {
  const { data } = await apiClient.post<{ application: AdmissionApplication; student: Student }>(
    admissionEndpoints.fullyApprove(id)
  );
  return data;
}

export async function fetchStudents(): Promise<Student[]> {
  const { data } = await apiClient.get<Student[]>(admissionEndpoints.studentsList);
  return data;
}

export async function fetchStudent(id: string): Promise<Student | null> {
  const { data } = await apiClient.get<Student | null>(admissionEndpoints.studentDetail(id));
  return data;
}

export async function getFileViewUrl(key: string): Promise<string> {
  const { data } = await apiClient.get<{ url: string }>(uploadEndpoints.presignGet(key));
  return data.url;
}

// Renewal – reference data and student lookup (public)
export interface AcademicSessionDto {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ClassDto {
  id: string;
  name: string;
  sortOrder: number;
}

export interface SectionDto {
  id: string;
  name: string;
  classId: string;
  sortOrder: number;
}

export interface StudentByRollDto {
  id: string;
  name: string;
  rollNumber: string | null;
  guardianName: string | null;
  contact: string | null;
  address: string | null;
  lastSessionName?: string;
  lastClassName?: string;
}

export async function fetchAcademicSessions(): Promise<AcademicSessionDto[]> {
  const { data } = await apiClient.get<AcademicSessionDto[]>(admissionEndpoints.academicSessions);
  return data;
}

export async function fetchClasses(): Promise<ClassDto[]> {
  const { data } = await apiClient.get<ClassDto[]>(admissionEndpoints.classes);
  return data;
}

export async function fetchSections(classId?: string): Promise<SectionDto[]> {
  const url = admissionEndpoints.sections(classId);
  const { data } = await apiClient.get<SectionDto[]>(url);
  return data;
}

export async function findStudentByRoll(rollNumber: string): Promise<StudentByRollDto | null> {
  const { data } = await apiClient.get<StudentByRollDto | null>(
    admissionEndpoints.studentByRoll(rollNumber)
  );
  return data;
}

export interface SubmitRenewalPayload {
  studentId: string;
  academicSessionId: string;
  classId: string;
  sectionId: string;
  contactOverride?: string;
  addressOverride?: string;
}

export interface SubmitRenewalResponse {
  id: string;
  message: string;
}

export async function submitRenewal(payload: SubmitRenewalPayload): Promise<SubmitRenewalResponse> {
  const { data } = await apiClient.post<SubmitRenewalResponse>(
    admissionEndpoints.submitRenewal,
    payload
  );
  return data;
}

// Dashboard stats (admin)
export interface AdmissionStatsDto {
  applications: { total: number; pending: number; approved: number; rejected: number; student: number };
  renewals: { total: number; pending: number; approved: number; rejected: number };
  students: number;
}

export async function fetchAdmissionStats(): Promise<AdmissionStatsDto> {
  const { data } = await apiClient.get<AdmissionStatsDto>(admissionEndpoints.stats);
  return data;
}

// Renewal – admin
export interface RenewalApplicationDto {
  id: string;
  studentId: string;
  academicSessionId: string;
  classId: string;
  sectionId: string;
  contactOverride: string | null;
  addressOverride: string | null;
  status: string;
  statusReason: string | null;
  createdAt: string;
  student?: Student;
  academicSession?: AcademicSessionDto;
  class?: ClassDto;
  section?: SectionDto;
}

export async function fetchRenewals(): Promise<RenewalApplicationDto[]> {
  const { data } = await apiClient.get<RenewalApplicationDto[]>(admissionEndpoints.renewalsList);
  return data;
}

export async function fetchRenewal(id: string): Promise<RenewalApplicationDto | null> {
  const { data } = await apiClient.get<RenewalApplicationDto | null>(
    admissionEndpoints.renewalDetail(id)
  );
  return data;
}

export async function updateRenewalStatus(
  id: string,
  status: 'approved' | 'rejected',
  reason?: string
): Promise<RenewalApplicationDto> {
  const { data } = await apiClient.patch<RenewalApplicationDto>(
    admissionEndpoints.renewalStatus(id),
    { status, reason }
  );
  return data;
}
