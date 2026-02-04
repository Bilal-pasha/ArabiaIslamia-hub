"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CheckAuthentication from "@/components/CheckAuth/CheckAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { protectedRoutes } from "@/utils/routes";
import { useMadrasaRegistrationContext } from "@/context/useMadrasaRegistrationContext";
import { Button } from "@/components/Button/Button";
import Link from "next/link";
import useSearchRole from "@/hooks/useSearchRole/useSearchRole";
import { ROLE } from "@/constant/constant";
import { apiClient } from "@/utils/axios-instance";

interface RegistrationData {
  madrasaName: string;
  madrasaAddress: string;
  totalStudents: number;
  contactPersonName: string;
  cellNumber: number;
}

const RegistrationForm: React.FC = () => {
  const { madrasas, loading, fetchMadrasas } = useMadrasaRegistrationContext();
  const [response, setResponse] = useState<unknown>(null);
  const router = useRouter();
  const userName = useSearchRole();

  const initialValues: RegistrationData = {
    madrasaName: "",
    madrasaAddress: "",
    totalStudents: 0,
    contactPersonName: "",
    cellNumber: 0,
  };

  const validationSchema = Yup.object({
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

  const onSubmit = async (values: RegistrationData) => {
    try {
      const { data } = await apiClient.post("/api/madrasas", {
        madrasaName: values.madrasaName,
        madrasaAddress: values.madrasaAddress,
        totalStudents: values.totalStudents,
        contactPersonName: values.contactPersonName,
        cellNumber: String(values.cellNumber),
      });
      setResponse(data);
      toast.success(data?.message ?? "Registered");
      fetchMadrasas();
      router.push(protectedRoutes.HOME);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <>
      {userName === ROLE.ADMIN ? (
        //   <div className="flex justify-center items-center flex-col max-w-2xl mx-auto space-y-8">
        //   <h2 className="text-center text-lg text-white font-semibold mt-6">
        //     You have already registered your madrasa.
        //   </h2>
        //   <Button variant="primary" size="md">
        //     <Link href={protectedRoutes.HOME}>Registration Page</Link>
        //   </Button>
        // </div>
        <div className="flex justify-center items-center h-screen animate">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg transform transition hover:scale-105 duration-300 ease-in-out border border-green-200">
            <h1 className="text-3xl font-extrabold text-green-600 mb-6 text-center">
              Register Your School
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form>
                {[
                  {
                    id: "madrasaName",
                    label: "School Name",
                    placeholder: "Enter school name",
                    type: "text",
                  },
                  {
                    id: "madrasaAddress",
                    label: "Address",
                    placeholder: "Enter address",
                    type: "text",
                  },
                  {
                    id: "totalStudents",
                    label: "Total Students",
                    placeholder: "Enter total students",
                    type: "number",
                  },
                  {
                    id: "contactPersonName",
                    label: "Contact Person Name",
                    placeholder: "Enter contact person name",
                    type: "text",
                  },
                  {
                    id: "cellNumber",
                    label: "Cell Number",
                    placeholder: "Enter cell number",
                    type: "tel",
                  },
                ].map(({ id, label, placeholder, type }) => (
                  <div className="mb-6" key={id}>
                    <label
                      htmlFor={id}
                      className="block text-lg font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    <Field
                      type={type}
                      id={id}
                      name={id as keyof RegistrationData}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-300 focus:outline-none focus:border-green-500"
                      placeholder={placeholder}
                    />
                    <ErrorMessage
                      name={id as keyof RegistrationData}
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-green-500/50"
                >
                  Register
                </button>
              </Form>
            </Formik>
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
