"use client";
import React, { useEffect } from "react";
import { useForm, Controller, toast, yupResolver, type Resolver } from "@arabiaaislamia/ui";
import { Button } from "@/components/Button/Button";
import { feesStatus } from "@/constant/constant";
import { StudentSchema } from "./StudentModel.Schema";
import { apiClient } from "@/utils/axios-instance";
import { getPresignedUrl, uploadToPresignedUrl } from "@/services/upload/upload.service";

type StudentFormValues = {
  name: string;
  fatherName: string;
  GRNumber: number;
  fees: number;
  feesStatus: Array<{ month: string; status: string }>;
  status: string;
  image: File | null;
};

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
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    defaultValues: {
      name: "",
      fatherName: "",
      GRNumber: 0,
      fees: 0,
      feesStatus: feesStatus,
      status: "Unpaid",
      image: null,
    },
    resolver: yupResolver(StudentSchema) as Resolver<StudentFormValues>,
  });

  useEffect(() => {
    if (!create && studentData) {
      reset({
        name: studentData?.name ?? "",
        fatherName: studentData?.fatherName ?? "",
        GRNumber: Number(studentData?.GRNumber) || 0,
        fees: Number(studentData?.fees) || 0,
        feesStatus: Array.isArray(studentData?.feesStatusChart) ? studentData.feesStatusChart : feesStatus,
        status: studentData?.status ?? "Unpaid",
        image: null,
      });
    }
  }, [create, studentData, reset]);

  const watchedFeesStatus = watch("feesStatus");

  const CreateStudent = async (values: StudentFormValues) => {
    try {
      let fileUrl: string | undefined;
      if (values.image?.name) {
        const { url, key } = await getPresignedUrl("fileUrl", values.image.name, values.image.type);
        await uploadToPresignedUrl(url, values.image);
        fileUrl = key;
      }
      const response = await apiClient.post(`/api/classes/${classSlug}/students`, {
        name: values.name,
        fatherName: values.fatherName,
        GRNumber: values.GRNumber,
        fees: values.fees,
        feesStatusChart: values.feesStatus,
        status: values.status ?? "Unpaid",
        classSlug,
        ...(fileUrl && { fileUrl }),
      });
      const result = response.data?.result ?? response.data?.data;
      if (result) setStudents([...students, result]);
      toast.success("Student Added Successfully");
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("Failed to add student");
    }
  };

  const UpdateStudent = async (values: StudentFormValues, studentId: string) => {
    try {
      let fileUrl: string | undefined;
      if (values.image?.name) {
        const { url, key } = await getPresignedUrl("fileUrl", values.image.name, values.image.type);
        await uploadToPresignedUrl(url, values.image);
        fileUrl = key;
      }
      const response = await apiClient.patch(`/api/students/${studentId}`, {
        name: values.name,
        fatherName: values.fatherName,
        GRNumber: values.GRNumber,
        fees: values.fees,
        feesStatusChart: values.feesStatus,
        status: values.status,
        ...(fileUrl && { fileUrl }),
      });
      if (response.data && setStudent) setStudent(response.data);
      toast.success(response.data?.message ?? "Updated");
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("Failed to update student");
    }
  };

  const onSubmit = (values: StudentFormValues) => {
    create ? CreateStudent(values) : UpdateStudent(values, id);
  };

  const inputClass = (hasError: boolean) =>
    `mb-2 w-full px-3 py-2 border rounded ${hasError ? "border-red-500" : ""}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {create ? "Add New" : "Update"} Student
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="text"
                  placeholder="Name"
                  className={inputClass(!!errors.name)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </>
            )}
          />

          <Controller
            name="fatherName"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="text"
                  placeholder="Father Name"
                  className={inputClass(!!errors.fatherName)}
                />
                {errors.fatherName && (
                  <p className="text-red-500 text-sm">{errors.fatherName.message}</p>
                )}
              </>
            )}
          />

          <Controller
            name="GRNumber"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="number"
                  placeholder="GR Number"
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  className={inputClass(!!errors.GRNumber)}
                />
                {errors.GRNumber && (
                  <p className="text-red-500 text-sm">{errors.GRNumber.message}</p>
                )}
              </>
            )}
          />

          <Controller
            name="fees"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="number"
                  placeholder="Fees"
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  className={inputClass(!!errors.fees)}
                />
                {errors.fees && (
                  <p className="text-red-500 text-sm">{errors.fees.message}</p>
                )}
              </>
            )}
          />

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
              Upload Image
            </label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                    className="w-full px-3 py-2 border rounded"
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm">{errors.image.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="mt-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">Monthly Fees Status</h3>
            <div className="flex flex-wrap gap-3">
              {feesStatus?.map(({ month, status }, index) => (
                <div key={month} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={watchedFeesStatus?.[index]?.status === "Paid"}
                    onChange={(e) => {
                      const next = [...(watchedFeesStatus ?? feesStatus)];
                      next[index] = {
                        ...next[index],
                        status: e.target.checked ? "Paid" : "Not Paid",
                      };
                      setValue("feesStatus", next);
                    }}
                    className="mr-2"
                  />
                  <label className="text-gray-700">{month}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-6">
            <Button
              type="button"
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
