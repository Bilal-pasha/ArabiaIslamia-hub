"use client";
import React from "react";
import { useForm, Controller, toast, yupResolver, type Resolver } from "@arabiaaislamia/ui";
import * as Yup from "yup";
import { apiClient } from "@/utils/axios-instance";
import { getPresignedUrl, uploadToPresignedUrl } from "@/services/upload/upload.service";

interface AddNewStudentFormValues {
  studentName: string;
  FatherName: string;
  ageGroup: string;
  grade: string;
  TshirtSize: string;
  image: FileList | null;
}

interface AddNewStudentModalProps {
  setModalOpen: (open: boolean) => void;
  madrasaId: string;
}

const addNewStudentSchema = Yup.object({
  studentName: Yup.string().required("Required"),
  FatherName: Yup.string().required("Required"),
  ageGroup: Yup.string().required("Required"),
  grade: Yup.string().required("Required"),
  TshirtSize: Yup.string().required("Required"),
  image: Yup.mixed()
    .nullable()
    .test("fileSize", "File size must be less than 1 Mb", (value) => {
      if (!value || !(value as FileList).length) return true;
      return (value as FileList)[0].size <= 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || !(value as FileList).length) return true;
      const type = (value as FileList)[0].type;
      return ["image/jpeg", "image/png", "image/gif"].includes(type);
    }),
});

export const AddNewStudentModal: React.FC<AddNewStudentModalProps> = ({
  setModalOpen,
  madrasaId,
}) => {
  const TshirtSizes = ["Medium", "large", "Xl"];
  const ageGroups = [
    { value: "13-16 Junior", label: "13-16 Junior" },
    { value: "17-20 Senior", label: "17-20 Senior" },
  ];

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddNewStudentFormValues>({
    defaultValues: {
      studentName: "",
      FatherName: "",
      ageGroup: "",
      grade: "",
      TshirtSize: "",
      image: null,
    },
    resolver: yupResolver(addNewStudentSchema) as Resolver<AddNewStudentFormValues>,
  });

  const onSubmit = async (values: AddNewStudentFormValues) => {
    try {
      let fileUrl: string | undefined;
      const file = values.image?.[0];
      if (file) {
        const { url, key } = await getPresignedUrl("fileUrl", file.name, file.type);
        await uploadToPresignedUrl(url, file);
        fileUrl = key;
      }
      const { data } = await apiClient.post("/api/students", {
        madrasaId,
        studentName: values.studentName,
        FatherName: values.FatherName,
        ageGroup: values.ageGroup,
        grade: values.grade,
        TshirtSize: values.TshirtSize,
        ...(fileUrl && { fileUrl }),
      });
      toast.success(data?.message ?? "Student added");
      setModalOpen(false);
    } catch (error: unknown) {
      setError("root", {
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <div className="container mx-auto">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white rounded-lg shadow-lg w-2/3 p-12 gap-12 relative border border-green-200">
          <h2 className="text-2xl pb-2 font-bold mb-4 text-center">Add New Student</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <Controller
                  name="studentName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                />
                {errors.studentName && (
                  <div className="text-red-600 text-sm mt-1">{errors.studentName.message}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Father Name</label>
                <Controller
                  name="FatherName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                />
                {errors.FatherName && (
                  <div className="text-red-600 text-sm mt-1">{errors.FatherName.message}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age Group</label>
                <Controller
                  name="ageGroup"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Age Group</option>
                      {ageGroups.map((group) => (
                        <option key={group.value} value={group.value}>
                          {group.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.ageGroup && (
                  <div className="text-red-600 text-sm mt-1">{errors.ageGroup.message}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Grade</label>
                <Controller
                  name="grade"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                />
                {errors.grade && (
                  <div className="text-red-600 text-sm mt-1">{errors.grade.message}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">T-shirt Size</label>
                <Controller
                  name="TshirtSize"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select T-shirt Size</option>
                      {TshirtSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.TshirtSize && (
                  <div className="text-red-600 text-sm mt-1">{errors.TshirtSize.message}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image (max 1 MB)
                </label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="file"
                      accept="image/jpeg, image/png, image/gif"
                      onChange={(e) => onChange(e.target.files)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}
                />
                {errors.image && (
                  <div className="text-red-600 text-sm mt-1">{errors.image.message}</div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${isSubmitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                  } text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200`}
              >
                {isSubmitting ? "Adding..." : "Add Student"}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>

            {errors.root && (
              <div className="text-red-600 text-sm mt-2">{errors.root.message}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
