"use client";

import { useAuth } from "@/context/AuthContext";
import SignIn from "@/components/SignIn/SignIn";
import { useRouter } from "next/navigation";
import { protectedRoutes } from "@/utils/routes";
import { useEffect } from "react";

const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push(protectedRoutes.HOME);
  }, [user, loading, router]);

  if (loading) return null;
  if (user) return null;
  return <SignIn />;
};

export default AuthLayout;
