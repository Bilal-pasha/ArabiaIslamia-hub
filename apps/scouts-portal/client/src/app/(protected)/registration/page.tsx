"use client";

import React from "react";
import { useForm, Controller, toast, yupResolver, type Resolver } from "@arabiaaislamia/ui";
import * as Yup from "yup";
import CheckAuthentication from "@/components/CheckAuth/CheckAuth";
import { useRouter } from "next/navigation";
import { protectedRoutes } from "@/utils/routes";
import { useMadrasaRegistrationContext } from "@/context/useMadrasaRegistrationContext";
import Link from "next/link";
import useSearchRole from "@/hooks/useSearchRole/useSearchRole";
import { ROLE } from "@/constant/constant";
import { apiClient } from "@/utils/axios-instance";
import { Button } from "@/components/Button/Button";

interface RegistrationFormValues {
  madrasaName: string;
  madrasaAddress: string;
  totalStudents: number;
  contactPersonName: string;
  cellNumber: number;
}

const registrationSchema = Yup.object({
  madrasaName: Yup.string().required("Madrasa name is required"),
  madrasaAddress: Yup.string().required("Madrasa address is required"),
  totalStudents: Yup.number()
    .required("Total students is required")
    .min(1, "There must be at least 1 student"),
  contactPersonName: Yup.string().required("Contact person name is required"),
  cellNumber: Yup.number()
    .required("Cell number is required")
    .typeError("Please enter a valid number"),
});

const RegistrationForm: React.FC = () => {
  const { madrasas, loading, fetchMadrasas } = useMadrasaRegistrationContext();
  const router = useRouter();
  const userName = useSearchRole();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    defaultValues: {
      madrasaName: "",
      madrasaAddress: "",
      totalStudents: 0,
      contactPersonName: "",
      cellNumber: 0,
    },
    resolver: yupResolver(registrationSchema) as Resolver<RegistrationFormValues>,
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    try {
      const { data } = await apiClient.post("/api/madrasas", {
        madrasaName: values.madrasaName,
        madrasaAddress: values.madrasaAddress,
        totalStudents: values.totalStudents,
        contactPersonName: values.contactPersonName,
        cellNumber: String(values.cellNumber),
      });
      toast.success(data?.message ?? "Registered");
      fetchMadrasas();
      router.push(protectedRoutes.HOME);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during registration");
    }
  };

  const fields = [
    { id: "madrasaName" as const, label: "School Name", placeholder: "Enter school name", type: "text" as const },
    { id: "madrasaAddress" as const, label: "Address", placeholder: "Enter address", type: "text" as const },
    { id: "totalStudents" as const, label: "Total Students", placeholder: "Enter total students", type: "number" as const },
    { id: "contactPersonName" as const, label: "Contact Person Name", placeholder: "Enter contact person name", type: "text" as const },
    { id: "cellNumber" as const, label: "Cell Number", placeholder: "Enter cell number", type: "tel" as const },
  ];

  return (
    <>
      {userName === ROLE.ADMIN ? (
        <div className="flex justify-center items-center h-screen animate">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg transform transition hover:scale-105 duration-300 ease-in-out border border-green-200">
            <h1 className="text-3xl font-extrabold text-green-600 mb-6 text-center">
              Register Your School
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              {fields.map(({ id, label, placeholder, type }) => (
                <div className="mb-6" key={id}>
                  <label htmlFor={id} className="block text-lg font-medium text-gray-700">
                    {label}
                  </label>
                  <Controller
                    name={id}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={type}
                        id={id}
                        value={type === "number" ? (field.value === 0 ? "" : field.value) : field.value}
                        onChange={(e) =>
                          field.onChange(
                            type === "number" ? (e.target.value === "" ? 0 : Number(e.target.value)) : e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-300 focus:outline-none focus:border-green-500"
                        placeholder={placeholder}
                      />
                    )}
                  />
                  {errors[id] && (
                    <div className="text-red-500 text-sm mt-1">{errors[id]?.message}</div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-green-500/50 disabled:opacity-50"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl border border-green-200 text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Closed</h2>
            <p className="text-gray-600">Registration is Full. Please Contact Support Arabia Islamia</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckAuthentication(RegistrationForm);
