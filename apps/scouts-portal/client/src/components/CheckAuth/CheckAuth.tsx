import { publicRoutes } from "@/utils/routes";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CheckAuthentication = (WrappedComponent: React.ComponentType<Record<string, unknown>>) => {
  const Auth = (props: Record<string, unknown>) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push(publicRoutes.AUTH_SIGN_IN);
      }
    }, [user, loading, router]);

    if (loading || !user) return null;
    return <WrappedComponent {...props} />;
  };
  return Auth;
};

export default CheckAuthentication;
