import { useAuth } from "@/context/AuthContext";

const useSearchRole = () => {
  const { user } = useAuth();
  return user?.username ?? null;
};

export default useSearchRole;
