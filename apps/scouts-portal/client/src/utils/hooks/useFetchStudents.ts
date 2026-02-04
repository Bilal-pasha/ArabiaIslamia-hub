import { useEffect, useState } from 'react';
import { apiClient } from '@/utils/axios-instance';

const useFetchStudents = (classSlug: string, setTableLoading: (v: boolean) => void) => {
  const [students, setStudents] = useState<unknown[]>([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiClient.get(`/api/classes/${classSlug}/students`);
        setStudents(Array.isArray(response.data) ? response.data : []);
        setTableLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchStudents();
  }, [classSlug, setTableLoading]);
  return { students, setStudents };
};
export default useFetchStudents;