import { useAuthLogin } from './use-auth';

export function useLogin(onSuccess: () => void) {
  const loginMutation = useAuthLogin();
  const loading = loginMutation.isPending;
  const error = loginMutation.isError;

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
    onSuccess();
  };

  return { login, loading, error };
}
