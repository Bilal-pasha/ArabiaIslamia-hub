import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookNashirsService } from '@/services';

export const bookNashirsKeys = { all: ['book-nashirs'] as const };

export function useBookNashirs() {
  return useQuery({
    queryKey: bookNashirsKeys.all,
    queryFn: () => bookNashirsService.getAll(),
  });
}

export function useBookNashirsCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => bookNashirsService.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookNashirsKeys.all }),
  });
}

export function useBookNashirsDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookNashirsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookNashirsKeys.all }),
  });
}
