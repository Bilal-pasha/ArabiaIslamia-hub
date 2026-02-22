import type { Author } from '@/types';
import { api } from '@/lib/api';
import { privateEndpoints } from '@/constants/api-endpoints';

export class BookAuthorsService {
  async getAll() {
    const res = await api.get<{ data: Author[] }>(privateEndpoints.bookAuthors.list);
    return res.data.data || [];
  }

  async create(name: string) {
    await api.post(privateEndpoints.bookAuthors.list, { name });
  }

  async delete(id: string) {
    await api.delete(privateEndpoints.bookAuthors.byId(id));
  }
}

export const bookAuthorsService = new BookAuthorsService();
