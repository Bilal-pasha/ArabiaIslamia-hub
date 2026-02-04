import React from "react";
import { useFormik } from "formik";
import { Button } from "@/components/Button/Button";
import { toast } from "react-hot-toast";
import { feesStatus } from "@/constant/constant";
import { StudentSchema } from "./StudentModel.Schema";
import { apiClient } from "@/utils/axios-instance";

const StudentModal = ({
  setIsModalOpen,
  students,
  setStudents,
  create = false,
  update = false,
  id,
  classSlug,
  studentData,
  setStudent,
}: any) => {
  const formik = useFormik({
    initialValues: {
      name: !create ? studentData?.name : "",
      fatherName: !create ? studentData?.fatherName : "",
      GRNumber: !create ? studentData?.GRNumber : "",
      fees: !create ? studentData?.fees : "",
      feesStatus: !create ? studentData?.feesStatusChart : feesStatus,
      status: "Unpaid",
      image: null, // New field for the image
    },
    validationSchema: StudentSchema,
    onSubmit: async (values, { resetForm }) => {
      create
        ? await CreateStudent(values, resetForm)
        : await UpdateStudent(values, resetForm, id);
    },
  });

  const CreateStudent = async (formValues: Record<string, unknown>, resetForm: () => void) => {
    try {
      const response = await apiClient.post(`/api/classes/${classSlug}/students`, {
        name: formValues.name,
        fatherName: formValues.fatherName,
        GRNumber: formValues.GRNumber,
        fees: formValues.fees,
        feesStatusChart: formValues.feesStatus,
        status: formValues.status ?? "Unpaid",
        classSlug,
      });
      const result = response.data?.result ?? response.data?.data;
      if (result) setStudents([...students, result]);
      toast.success("Student Added Successfully");
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("Failed to add student");
    }
  };

  const UpdateStudent = async (
    formValues: Record<string, unknown>,
    resetForm: () => void,
    StudentID: string
  ) => {
    try {
      const response = await apiClient.patch(`/api/students/${StudentID}`, {
        name: formValues.name,
        fatherName: formValues.fatherName,
        GRNumber: formValues.GRNumber,
        fees: formValues.fees,
        feesStatusChart: formValues.feesStatus,
        status: formValues.status,
      });
      if (response.data && setStudent) setStudent(response.data);
      toast.success(response.data?.message ?? "Updated");
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("Failed to update student");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {create ? "Add New" : "Update"} Student
        </h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`mb-2 w-full px-3 py-2 border rounded ${formik.touched.name && formik.errors.name ? "border-red-500" : ""
              }`}
          />
          {typeof formik.errors.name === "string" && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          {/* Father Name Input */}
          <input
            type="text"
            name="fatherName"
            placeholder="Father Name"
            value={formik.values.fatherName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`mb-2 w-full px-3 py-2 border rounded ${formik.touched.fatherName && formik.errors.fatherName
                ? "border-red-500"
                : ""
              }`}
          />
          {formik.touched.fatherName &&
            typeof formik.errors.fatherName === "string" ? (
            <p className="text-red-500 text-sm">{formik.errors.fatherName}</p>
          ) : null}

          {/* GR Number Input */}
          <input
            type="text"
            name="GRNumber"
            placeholder="GR Number"
            value={formik.values.GRNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`mb-2 w-full px-3 py-2 border rounded ${formik.touched.GRNumber && formik.errors.GRNumber
                ? "border-red-500"
                : ""
              }`}
          />
          {formik.touched.GRNumber &&
            typeof formik.errors.GRNumber === "string" ? (
            <p className="text-red-500 text-sm">{formik.errors.GRNumber}</p>
          ) : null}

          {/* Fees Input */}
          <input
            type="text"
            name="fees"
            placeholder="Fees"
            value={formik.values.fees}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`mb-2 w-full px-3 py-2 border rounded ${formik.touched.fees && formik.errors.fees ? "border-red-500" : ""
              }`}
          />
          {formik.touched.fees && typeof formik.errors.fees === "string" ? (
            <p className="text-red-500 text-sm">{formik.errors.fees}</p>
          ) : null}

          {/* Image Upload Field */}

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 font-semibold mb-2"
            >
              Upload Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(event) =>
                formik.setFieldValue("image", event.currentTarget.files?.[0])
              }
              className="w-full px-3 py-2 border rounded"
            />
            {formik.errors.image && formik.touched.image && (
              <p className="text-red-500 text-sm">{formik.errors.image}</p>
            )}
          </div>
          {/* Monthly Fees Status Checkboxes */}
          <div className="mt-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Monthly Fees Status</h3>
            <div className="flex flex-wrap gap-3">
              {feesStatus?.map(({ month, status }, index) => (
                <div key={month} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name={`feesStatus.${month}`}
                    checked={
                      formik?.values?.feesStatus[index]?.status === "Paid"
                    }
                    onChange={(e) =>
                      formik.setFieldValue(
                        `feesStatus`,
                        formik.values.feesStatus.map((fee: any, i: number) =>
                          i === index
                            ? {
                              ...fee,
                              status: e.target.checked ? "Paid" : "Not Paid",
                            }
                            : fee
                        )
                      )
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor={`feesStatus.${month}`}
                    className="text-gray-700"
                  >
                    {month}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-6">
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="secondary"
              size="md"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {create ? "Add Student" : "Update Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
