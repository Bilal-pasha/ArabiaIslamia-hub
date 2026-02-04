import React, { useEffect, useState } from 'react';
import { apiClient } from '@/utils/axios-instance';

interface Student {
  fatherName: string;
  fees: string;
  name: string;
  rollNumber: string;
  status: "Paid" | "Unpaid";
  feesStatusChart: unknown;
}
export const useStudentData = (setIsLoading: (v: boolean) => void, params: { id: string }) => {
  const [student, setStudent] = useState<Student | undefined>();
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/students/${params.id}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Failed to fetch student:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [params.id, setIsLoading]);
  return { student, setStudent };
};
