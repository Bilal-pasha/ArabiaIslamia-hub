import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services';

export const authKeys = { me: ['auth', 'me'] as const };

export function useAuthMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => authService.me(),
    retry: false,
  });
}

export function useAuthLogin() {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authService.login(username, password),
  });
}

export function useAuthLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
}
