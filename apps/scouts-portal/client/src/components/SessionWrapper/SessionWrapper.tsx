"use client";
import React, { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

interface SessionWrapperProps {
  children: ReactNode;
}

export const SessionWrapper: React.FC<SessionWrapperProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
