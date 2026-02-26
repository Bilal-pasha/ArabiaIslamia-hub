import type { Category } from '@/types';
import { api } from '@/lib/api';
import { privateEndpoints } from '@/constants/api-endpoints';

export class BookCategoriesService {
  async getAll() {
    const res = await api.get<{ data: Category[] }>(privateEndpoints.bookCategories.list);
    return res.data.data || [];
  }

  async create(name: string) {
    await api.post(privateEndpoints.bookCategories.list, { name });
  }

  async update(id: string, name: string) {
    await api.patch(privateEndpoints.bookCategories.byId(id), { name });
  }

  async delete(id: string) {
    await api.delete(privateEndpoints.bookCategories.byId(id));
  }
}

export const bookCategoriesService = new BookCategoriesService();
