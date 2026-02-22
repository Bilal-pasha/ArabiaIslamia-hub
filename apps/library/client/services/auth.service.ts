import { api } from '@/lib/api';
import { publicEndpoints, privateEndpoints } from '@/constants/api-endpoints';

export class AuthService {
  async login(username: string, password: string) {
    const res = await api.post(publicEndpoints.auth.login, { username, password });
    return res.data;
  }

  async me() {
    const res = await api.get<{ data: { user: { isSuperAdmin?: boolean } } }>(privateEndpoints.auth.me);
    return res.data;
  }

  async logout() {
    await api.post(privateEndpoints.auth.logout);
  }
}

export const authService = new AuthService();
