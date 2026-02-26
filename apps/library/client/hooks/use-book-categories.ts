import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookCategoriesService } from '@/services';

export const bookCategoriesKeys = { all: ['book-categories'] as const };

export function useBookCategories() {
  return useQuery({
    queryKey: bookCategoriesKeys.all,
    queryFn: () => bookCategoriesService.getAll(),
  });
}

export function useBookCategoriesCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => bookCategoriesService.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookCategoriesKeys.all }),
  });
}

export function useBookCategoriesUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => bookCategoriesService.update(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookCategoriesKeys.all }),
  });
}

export function useBookCategoriesDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookCategoriesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookCategoriesKeys.all }),
  });
}
