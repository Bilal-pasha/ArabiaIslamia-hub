'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentsByClass, getStudent, deleteStudent, type Student } from '@/services/students.service';

export const studentKeys = {
  all: ['students'] as const,
  list: (classSlug: string) => [...studentKeys.all, 'list', classSlug] as const,
  detail: (id: string) => [...studentKeys.all, 'detail', id] as const,
};

export function useStudents(classSlug: string) {
  return useQuery({
    queryKey: studentKeys.list(classSlug),
    queryFn: () => getStudentsByClass(classSlug),
    enabled: !!classSlug,
  });
}

export function useStudent(id: string | null) {
  return useQuery({
    queryKey: studentKeys.detail(id ?? ''),
    queryFn: () => getStudent(id!),
    enabled: !!id,
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
    },
  });
}
