import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookIssuesService, type IssueFilters } from '@/services/book-issues.service';

export const bookIssuesKeys = {
  all: ['book-issues'] as const,
  list: (page: number, filters: IssueFilters) => ['book-issues', 'list', page, filters] as const,
};

export function useBookIssuesList(page: number, filters: IssueFilters) {
  return useQuery({
    queryKey: bookIssuesKeys.list(page, filters),
    queryFn: () => bookIssuesService.getList({ page, limit: 10, filters }),
  });
}

export function useBookIssuesCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { bookId: string; issuedTo: string; dueAt: string }) =>
      bookIssuesService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookIssuesKeys.all }),
  });
}

export function useBookIssuesReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookIssuesService.returnBook(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookIssuesKeys.all }),
  });
}

export function useBookIssuesDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookIssuesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookIssuesKeys.all }),
  });
}
