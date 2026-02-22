import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Book } from '@/types';
import { booksService, type BookFilters } from '@/services/books.service';

export const booksKeys = {
  all: ['books'] as const,
  list: (page: number, filters: BookFilters) => ['books', 'list', page, filters] as const,
  byId: (id: string) => ['books', id] as const,
  byShelf: (shelf: string) => ['books', 'shelf', shelf] as const,
};

export function useBooksList(page: number, filters: BookFilters) {
  return useQuery({
    queryKey: booksKeys.list(page, filters),
    queryFn: () => booksService.getList({ page, limit: 10, filters }),
  });
}

export function useBookById(id: string | null) {
  return useQuery({
    queryKey: booksKeys.byId(id ?? ''),
    queryFn: () => booksService.getById(id!),
    enabled: !!id,
  });
}

export function useBooksByShelf(shelfNumber: string | null) {
  return useQuery({
    queryKey: booksKeys.byShelf(shelfNumber ?? ''),
    queryFn: () => booksService.getByShelf(shelfNumber!),
    enabled: !!shelfNumber?.trim(),
  });
}

export function useBooksCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Book>) => booksService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: booksKeys.all }),
  });
}

export function useBooksDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => booksService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: booksKeys.all }),
  });
}

export function useBooksListForSelect() {
  return useQuery({
    queryKey: ['books', 'list-select'],
    queryFn: () => booksService.getList({ page: 1, limit: 1000 }),
  });
}
