import type { BookIssue, PaginatedResponse } from '@/types';
import { api } from '@/lib/api';
import { privateEndpoints } from '@/constants/api-endpoints';

export type IssueFilters = { status?: string; issuedTo?: string; bookId?: string };

export class BookIssuesService {
  async getList(params: { page: number; limit: number; filters?: IssueFilters }) {
    const search = new URLSearchParams();
    search.set('page', String(params.page));
    search.set('limit', String(params.limit));
    const { status, issuedTo, bookId } = params.filters || {};
    if (status && status !== 'all') search.set('status', status);
    if (issuedTo?.trim()) search.set('issuedTo', issuedTo.trim());
    if (bookId && bookId !== 'all') search.set('bookId', bookId);
    const res = await api.get<PaginatedResponse<BookIssue>>(`${privateEndpoints.bookIssues.list}?${search}`);
    return res.data;
  }

  async create(data: { bookId: string; issuedTo: string; dueAt: string }) {
    await api.post(privateEndpoints.bookIssues.list, data);
  }

  async returnBook(id: string) {
    await api.post(privateEndpoints.bookIssues.return(id));
  }

  async delete(id: string) {
    await api.delete(privateEndpoints.bookIssues.byId(id));
  }
}

export const bookIssuesService = new BookIssuesService();
