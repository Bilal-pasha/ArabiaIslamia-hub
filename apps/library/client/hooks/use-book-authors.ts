import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookAuthorsService } from '@/services';

export const bookAuthorsKeys = { all: ['book-authors'] as const };

export function useBookAuthors() {
  return useQuery({
    queryKey: bookAuthorsKeys.all,
    queryFn: () => bookAuthorsService.getAll(),
  });
}

export function useBookAuthorsCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => bookAuthorsService.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookAuthorsKeys.all }),
  });
}

export function useBookAuthorsDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookAuthorsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookAuthorsKeys.all }),
  });
}
