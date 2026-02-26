import { useState, useCallback } from 'react';
import { useModal } from '@arabiaaislamia/ui';
import { useBookIssuesList, useBookIssuesCreate, useBookIssuesUpdate, useBookIssuesReturn, useBookIssuesDelete } from './use-book-issues';
import { useBooksListForSelect } from './use-books';
import { IssueBookFormContent, IssueDetailContent } from '@/components/issues';
import type { BookIssue } from '@/types';

export function useIssuesPage(t: (k: string) => string) {
  const modal = useModal();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: 'all', issuedTo: '', bookId: '' });
  const [editIssue, setEditIssue] = useState<BookIssue | null>(null);

  const issuesQuery = useBookIssuesList(page, filters);
  const booksQuery = useBooksListForSelect();
  const createIssue = useBookIssuesCreate();
  const updateIssue = useBookIssuesUpdate();
  const returnIssue = useBookIssuesReturn();
  const deleteIssue = useBookIssuesDelete();

  const issues = issuesQuery.data?.data ?? [];
  const books = booksQuery.data?.data ?? [];
  const totalPages = issuesQuery.data?.totalPages ?? 1;
  const total = issuesQuery.data?.total ?? 0;

  const openIssueBookModal = useCallback(() => {
    modal.custom({
      content: (
        <IssueBookFormContent
          t={t}
          books={books}
          createIssue={createIssue}
          onSuccess={() => modal.close()}
        />
      ),
      contentClassName: 'sm:max-w-md',
      showClose: true,
    });
  }, [modal, books, createIssue, t]);

  const openEditModal = useCallback((issue: BookIssue) => setEditIssue(issue), []);
  const closeEditModal = useCallback(() => setEditIssue(null), []);

  const handleEditIssueSuccess = useCallback(async () => {
    await issuesQuery.refetch();
    closeEditModal();
  }, [issuesQuery, closeEditModal]);

  const openViewModal = useCallback(
    (issue: BookIssue) => {
      modal.custom({
        content: <IssueDetailContent issue={issue} t={t} />,
        contentClassName: 'sm:max-w-md',
        showClose: true,
      });
    },
    [modal, t]
  );

  const openDeleteConfirm = useCallback(
    (issue: BookIssue) => {
      modal.confirmation({
        title: t('books.delete'),
        description: t('issues.deleteConfirm'),
        confirmText: t('common.confirm'),
        cancelText: t('common.cancel'),
        variant: 'destructive',
        onConfirm: async () => {
          await deleteIssue.mutateAsync(issue.id);
        },
      });
    },
    [modal, deleteIssue, t]
  );

  const handleReturn = useCallback(
    async (id: string) => {
      await returnIssue.mutateAsync(id);
    },
    [returnIssue]
  );

  const applyFilters = useCallback(() => setPage(1), []);

  const setFilter = useCallback((k: 'status' | 'issuedTo' | 'bookId', v: string) => {
    setFilters((f) => ({ ...f, [k]: v }));
  }, []);

  return {
    page,
    setPage,
    filters,
    setFilter,
    issues,
    books,
    total,
    totalPages,
    loading: issuesQuery.isLoading,
    openIssueBookModal,
    openViewModal,
    openEditModal,
    closeEditModal,
    editIssue,
    updateIssue,
    handleEditIssueSuccess,
    openDeleteConfirm,
    handleReturn,
    applyFilters,
    t,
  };
}
