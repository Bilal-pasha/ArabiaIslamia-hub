import type { Book, PaginatedResponse } from '@/types';
import { api } from '@/lib/api';
import { privateEndpoints } from '@/constants/api-endpoints';

export type BookFilters = Record<string, string>;

export class BooksService {
  async getList(params: { page: number; limit: number; filters?: BookFilters }) {
    const search = new URLSearchParams();
    search.set('page', String(params.page));
    search.set('limit', String(params.limit));
    Object.entries(params.filters || {}).forEach(([k, v]) => {
      if (v?.trim()) search.set(k, v.trim());
    });
    const res = await api.get<PaginatedResponse<Book>>(`${privateEndpoints.books.list}?${search}`);
    return res.data;
  }

  async getById(id: string) {
    const res = await api.get<{ data: Book }>(privateEndpoints.books.byId(id));
    return res.data.data;
  }

  async create(data: Partial<Book>) {
    const res = await api.post<{ data: { id: string } }>(privateEndpoints.books.list, data);
    return res.data.data;
  }

  async update(id: string, data: Partial<Book>) {
    await api.patch(privateEndpoints.books.byId(id), data);
  }

  async delete(id: string) {
    await api.delete(privateEndpoints.books.byId(id));
  }

  async getByShelf(shelfNumber: string, limit = 500) {
    const res = await api.get<PaginatedResponse<Book>>(privateEndpoints.books.list, {
      params: { shelfNumber, limit, page: 1 },
    });
    return res.data.data;
  }
}

export const booksService = new BooksService();
