import { apiClient } from '@/utils/axios-instance';
import { studentsEndpoints } from '@/constant/api-endpoints';

export interface Student {
  id?: string;
  fatherName: string;
  fees: string;
  name: string;
  rollNumber: string;
  status: 'Paid' | 'Unpaid';
  feesStatusChart: unknown;
  GRNumber?: string;
}

export async function getStudentsByClass(classSlug: string): Promise<Student[]> {
  const { data } = await apiClient.get<Student[]>(studentsEndpoints.byClass(classSlug));
  return Array.isArray(data) ? data : [];
}

export async function getStudent(id: string): Promise<Student> {
  const { data } = await apiClient.get<Student>(studentsEndpoints.detail(id));
  return data;
}

export async function deleteStudent(id: string): Promise<{ success?: boolean; message?: string }> {
  const { data } = await apiClient.delete<{ success?: boolean; message?: string }>(studentsEndpoints.detail(id));
  return data ?? {};
}
