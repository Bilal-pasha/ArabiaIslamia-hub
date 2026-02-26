import type { Nashir } from '@/types';
import { api } from '@/lib/api';
import { privateEndpoints } from '@/constants/api-endpoints';

export class BookNashirsService {
  async getAll() {
    const res = await api.get<{ data: Nashir[] }>(privateEndpoints.bookNashirs.list);
    return res.data.data || [];
  }

  async create(name: string) {
    await api.post(privateEndpoints.bookNashirs.list, { name });
  }

  async update(id: string, name: string) {
    await api.patch(privateEndpoints.bookNashirs.byId(id), { name });
  }

  async delete(id: string) {
    await api.delete(privateEndpoints.bookNashirs.byId(id));
  }
}

export const bookNashirsService = new BookNashirsService();
