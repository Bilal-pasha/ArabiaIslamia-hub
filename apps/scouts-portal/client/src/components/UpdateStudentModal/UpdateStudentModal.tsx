"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { validationSchema } from "./validationSchema";
import { activities, SubCamps } from "@/constant/constant";
import { apiClient } from "@/utils/axios-instance";

export const UpdateStudentModal = ({
  setModalOpen,
  // madrasaId,
  student,
  handleClose,
}: any) => {
  // Early return if no student data
  if (!student) {
    console.error("No student data provided to UpdateStudentModal");
    return null;
  }

  // Helper function to convert age to age group
  const getAgeGroupFromAge = (age: number | string) => {
    const numAge = typeof age === 'string' ? parseInt(age) : age;
    if (numAge >= 13 && numAge <= 16) return "13-16";
    if (numAge >= 17 && numAge <= 20) return "17-20";
    return "";
  };

  // Helper function to extract age group value from full label
  const getAgeGroupValue = (ageGroupLabel: string) => {
    if (ageGroupLabel.includes("13-16")) return "13-16";
    if (ageGroupLabel.includes("17-20")) return "17-20";
    return ageGroupLabel; // Return as-is if it's already a value
  };

  // Initial form values - handle cases where student might be undefined or properties don't exist
  const initialValues = {
    studentName: student?.studentName || student?.name || "",
    FatherName: student?.FatherName || student?.fatherName || "",
    ageGroup: student?.ageGroup ? getAgeGroupValue(student.ageGroup) : (student?.age ? getAgeGroupFromAge(student.age) : ""), // Convert age group label to value or age to age group
    grade: student?.grade || "",
    TshirtSize: student?.TshirtSize || student?.tshirtSize || "",
    activity: student?.activity || "",
    status: student?.status || "", // New field for status
    group: student?.group || "", // New field for group
    camp: student?.camp || "", // New field for camp
    subCamp: student?.subCamp || "", // New field for sub-camp
    report: student?.report || "", // New field for student report
  };

  // Age groups
  const ageGroups = [
    { value: "13-16", label: "13-16 Junior" },
    { value: "17-20", label: "17-20 Senior" },
  ];



  // Status options
  const statuses = ["Approved", "Rejected"];

  // Group options
  const groups = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ];

  // Camp options

  // Sub-camp options
  const campNo = Array.from({ length: 100 }, (_, i) => `Camp ${i + 1}`);
  const subCamps = [SubCamps.Jinnah, SubCamps.Iqbal];
  // Form validation schema

  const handleSubmit = async (
    values: Record<string, string>,
    { setSubmitting, setErrors }: { setSubmitting: (v: boolean) => void; setErrors: (e: { submit?: string }) => void }
  ) => {
    const studentId = student._id ?? student.id;
    if (!studentId) {
      setErrors({ submit: "Student ID missing" });
      return;
    }
    try {
      const response = await apiClient.patch(`/api/students/${studentId}`, {
        studentName: values.studentName,
        FatherName: values.FatherName,
        ageGroup: values.ageGroup,
        grade: values.grade,
        TshirtSize: values.TshirtSize,
        activity: values.activity,
        status: values.status,
        group: values.group,
        camp: values.camp,
        subCamp: values.subCamp,
        report: values.report,
      });
      if (response.data?.success) {
        toast.success(response.data.message ?? "Updated");
      } else {
        toast.error(response.data?.error ?? "Update failed");
      }
      setModalOpen(false);
      handleClose();
    } catch (error: unknown) {
      setErrors({ submit: error instanceof Error ? error.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white rounded-lg shadow-lg w-2/3 p-6 relative">
          <h2 className="text-2xl pb-2 font-bold mb-4 text-center">
            Update Student
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
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
                      type="text"
                      name="TshirtSize"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <ErrorMessage
                      name="TshirtSize"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Activity Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Activity
                    </label>
                    <Field
                      as="select"
                      name="activity"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" label="Select an activity" />
                      {activities.map((activity, index) => (
                        <option key={activity + index} value={activity}>
                          {activity}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="activity"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" label="Select status" />
                      {statuses.map((status, index) => (
                        <option key={status + index} value={status}>
                          {status}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Group Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Group
                    </label>
                    <Field
                      as="select"
                      name="group"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" label="Select group" />
                      {groups.map((group, index) => (
                        <option key={group + index} value={group}>
                          {group}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="group"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Camp Dropdown */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Camp
                    </label>
                    <Field
                      as="select"
                      name="camp"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" label="Select camp" />
                      {camps.map((camp, index) => (
                        <option key={camp + index} value={camp}>
                          {camp}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="camp"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div> */}

                  {/* Sub Camp Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sub Camp
                    </label>
                    <Field
                      as="select"
                      name="subCamp"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" label="Select sub camp" />
                      {subCamps.map((subCamp, index) => (
                        <option key={subCamp + index} value={subCamp}>
                          {subCamp}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="subCamp"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                  {/* camp no Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Camp Number
                    </label>
                    <Field
                      as="select"
                      name="camp"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="" label="Select Camp Number" />
                      {campNo.map((camp, index) => (
                        <option key={camp + index} value={camp}>
                          {camp}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="camp"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                  {/* Student Report Text Area */}
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Student Report
                    </label>
                    <Field
                      as="textarea"
                      name="report"
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter student report here..."
                    />
                    <ErrorMessage
                      name="report"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
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
                    {isSubmitting ? "Updating..." : "Update Student"}
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
