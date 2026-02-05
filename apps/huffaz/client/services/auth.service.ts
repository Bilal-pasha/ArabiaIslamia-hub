import { apiClient } from '@/utils/axios-instance';
import { authEndpoints } from '@/constants/api-endpoints';

export interface LoginResponse {
  accessToken?: string;
  message?: string;
}

export interface SignUpResponse {
  user?: unknown;
  accessToken?: string;
  message?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(authEndpoints.login, { email, password });
  return data;
}

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<SignUpResponse> {
  const { data } = await apiClient.post<SignUpResponse>(authEndpoints.register, {
    name,
    email,
    password,
  });
  return data;
}
