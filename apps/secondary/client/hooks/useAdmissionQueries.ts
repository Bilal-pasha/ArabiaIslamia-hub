'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchApplications,
  fetchApplication,
  findByApplicationNumber,
  submitAdmission,
  updateStatus,
  updateOralTest,
  setWrittenAdmitEligible,
  type AdmissionApplication,
  type SubmitAdmissionResponse,
} from '@/services/admission/admission.service';

export const admissionKeys = {
  all: ['admission'] as const,
  list: () => [...admissionKeys.all, 'list'] as const,
  detail: (id: string) => [...admissionKeys.all, 'detail', id] as const,
  byNumber: (number: string) => [...admissionKeys.all, 'byNumber', number] as const,
};

export function useApplications() {
  return useQuery({ queryKey: admissionKeys.list(), queryFn: fetchApplications });
}

export function useApplication(id: string | null) {
  return useQuery({
    queryKey: admissionKeys.detail(id ?? ''),
    queryFn: () => fetchApplication(id!),
    enabled: !!id,
  });
}

export function useFindByApplicationNumber(applicationNumber: string | null) {
  return useQuery({
    queryKey: admissionKeys.byNumber(applicationNumber ?? ''),
    queryFn: () => findByApplicationNumber(applicationNumber!),
    enabled: !!applicationNumber?.trim(),
  });
}

export function useSubmitAdmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, string>) => submitAdmission(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: admissionKeys.all }),
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: 'approved' | 'rejected';
      reason?: string;
    }) => updateStatus(id, status, reason),
    onSuccess: (data: AdmissionApplication) => {
      queryClient.invalidateQueries({ queryKey: admissionKeys.all });
      queryClient.invalidateQueries({ queryKey: admissionKeys.detail(data.id) });
    },
  });
}

export function useUpdateOralTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { marks?: string; passed: boolean; reason?: string };
    }) => updateOralTest(id, payload),
    onSuccess: (data: AdmissionApplication) => {
      queryClient.invalidateQueries({ queryKey: admissionKeys.all });
      queryClient.invalidateQueries({ queryKey: admissionKeys.detail(data.id) });
    },
  });
}

export function useSetWrittenAdmitEligible() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setWrittenAdmitEligible(id),
    onSuccess: (data: AdmissionApplication) => {
      queryClient.invalidateQueries({ queryKey: admissionKeys.all });
      queryClient.invalidateQueries({ queryKey: admissionKeys.detail(data.id) });
    },
  });
}
