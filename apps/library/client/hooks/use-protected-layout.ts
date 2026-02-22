import { useEffect } from 'react';
import { useAuthMe, useAuthLogout } from './use-auth';

export function useProtectedLayout() {
  const meQuery = useAuthMe();
  const logoutMutation = useAuthLogout();
  const ready = meQuery.isSuccess;
  const isSuperAdmin = meQuery.data?.data?.user?.isSuperAdmin ?? false;

  useEffect(() => {
    if (meQuery.isError && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [meQuery.isError]);

  const logout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = '/login';
  };

  return { ready, isSuperAdmin, logout };
}
