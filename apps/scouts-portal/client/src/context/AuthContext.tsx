"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiClient } from "@/utils/axios-instance";

interface AuthUser {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    try {
      const res = await apiClient.get("/api/auth/me");
      const u = res.data?.data?.user;
      setUser(u ? { id: u.id, username: u.username, createdAt: u.createdAt, updatedAt: u.updatedAt } : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}
