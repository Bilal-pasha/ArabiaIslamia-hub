"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { apiClient } from "@/utils/axios-instance";

interface AddNewStudentModalProps {
  setModalOpen: (open: boolean) => void;
  madrasaId: string;
}

export const AddNewStudentModal: React.FC<AddNewStudentModalProps> = ({
  setModalOpen,
  madrasaId,
}) => {
  // Initial form values
  const initialValues = {
    studentName: "",
    FatherName: "",
    ageGroup: "",
    grade: "",
    TshirtSize: "",
    // image: null as File | null, // New field for image upload
  };
  const TshirtSizes = ["Medium", "large", "Xl"];
  // Age groups
  const ageGroups = [
    { value: "13-16 Junior", label: "13-16 Junior" },
    { value: "17-20 Senior", label: "17-20 Senior" },
  ];

  // Form validation schema
  const validationSchema = Yup.object({
    studentName: Yup.string().required("Required"),
    FatherName: Yup.string().required("Required"),
    ageGroup: Yup.string().required("Required"),
    grade: Yup.string().required("Required"),
    TshirtSize: Yup.string().required("Required"),
    // image: Yup.mixed()
    //   .notRequired()
    //   .test("fileSize", "File size must be less than 1 Mb", (value) => {
    //     return !value || (value as File).size <= 1024 * 1024; // Apply only if value exists
    //   })
    //   .test("fileType", "Unsupported file format", (value) => {
    //     return (
    //       !value ||
    //       ["image/jpeg", "image/png", "image/gif"].includes(
    //         (value as File).type
    //       )
    //     ); // Apply only if value exists
    //   }),
  });


  const handleSubmit = async (
    values: { studentName: string; FatherName: string; ageGroup: string; grade: string; TshirtSize: string },
    { setSubmitting, setErrors }: { setSubmitting: (v: boolean) => void; setErrors: (e: { submit?: string }) => void }
  ) => {
    try {
      const { data } = await apiClient.post("/api/students", {
        madrasaId,
        studentName: values.studentName,
        FatherName: values.FatherName,
        ageGroup: values.ageGroup,
        grade: values.grade,
        TshirtSize: values.TshirtSize,
      });
      toast.success(data?.message ?? "Student added");
      setModalOpen(false);
    } catch (error: unknown) {
      setErrors({ submit: error instanceof Error ? error.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white rounded-lg shadow-lg w-2/3 p-12 gap-12 relative border border-green-200">
          <h2 className="text-2xl pb-2 font-bold mb-4 text-center">
            Add New Student
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4" encType="multipart/form-data">
                <div className="grid grid-cols-3 gap-4">
                  {/* Student Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student Name
                    </label>
                    <Field
                      type="text"
                      name="studentName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <ErrorMessage
                      name="studentName"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Father Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Father Name
                    </label>
                    <Field
                      type="text"
                      name="FatherName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <ErrorMessage
                      name="FatherName"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Age Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Age Group
                    </label>
                    <Field
                      as="select"
                      name="ageGroup"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" label="Select Age Group" />
                      {ageGroups.map((group) => (
                        <option key={group.value} value={group.value}>
                          {group.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="ageGroup"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Grade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Grade
                    </label>
                    <Field
                      type="text"
                      name="grade"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <ErrorMessage
                      name="grade"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* T-shirt size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      T-shirt Size
                    </label>
                    <Field
                      as="select"
                      name="TshirtSize"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" label="Select T-shirt Size" />
                      {TshirtSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="TshirtSize"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>


                  {/* Image Upload */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Image (max 1 MB)
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/jpeg, image/png, image/gif"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          setFieldValue("image", file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <ErrorMessage
                      name="image"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div> */}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${isSubmitting
                        ? "bg-gray-400"
                        : "bg-green-600 hover:bg-green-700"
                      } text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200`}
                  >
                    {isSubmitting ? "Adding..." : "Add Student"}
                  </button>

                  {/* Close Modal Button */}
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>

                <ErrorMessage
                  name="submit"
                  component="div"
                  className="text-red-600 text-sm mt-2"
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
