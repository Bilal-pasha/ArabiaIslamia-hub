"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "@arabiaaislamia/ui";
import { apiClient } from "@/utils/axios-instance";

interface Madrasa {
  _id: string;
  id?: string;
  madrasaName: string;
  madrasaAddress: string;
  totalStudents: number;
  createdAt: string;
  contactPersonName: string;
  cellNumber: string;
  registeredStudents: number;
  status: string;
}

interface MadrasaContextType {
  madrasas: Madrasa[];
  loading: boolean;
  fetchMadrasas: () => void;
}

const MadrasaRegistrationContext = createContext<
  MadrasaContextType | undefined
>(undefined);

export const useMadrasaRegistrationContext = () => {
  const context = useContext(MadrasaRegistrationContext);
  if (!context) {
    throw new Error(
      "useMadrasaRegistrationContext must be used within a MadrasaRegistrationProvider"
    );
  }
  return context;
};

interface MadrasaProviderProps {
  children: ReactNode;
}

export const MadrasaRegistrationProvider: React.FC<MadrasaProviderProps> = ({
  children,
}) => {
  const [madrasas, setMadrasas] = useState<Madrasa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMadrasas = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/madrasas/current");
      if (response.data?.data) {
        setMadrasas(response.data.data);
      }
    } catch {
      toast.error("Failed to fetch madrasas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMadrasas();
  }, []);

  return (
    <MadrasaRegistrationContext.Provider
      value={{ madrasas, loading, fetchMadrasas }}
    >
      {children}
    </MadrasaRegistrationContext.Provider>
  );
};
