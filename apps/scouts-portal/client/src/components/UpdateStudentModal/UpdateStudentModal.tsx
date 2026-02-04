"use client";
import React from "react";
import { useForm, Controller, toast, yupResolver, type Resolver } from "@arabiaaislamia/ui";
import { validationSchema } from "./validationSchema";
import { activities, SubCamps } from "@/constant/constant";
import { apiClient } from "@/utils/axios-instance";
import { getPresignedUrl, uploadToPresignedUrl } from "@/services/upload/upload.service";

type UpdateStudentFormValues = {
  studentName: string;
  FatherName: string;
  ageGroup: string;
  grade: string;
  TshirtSize: string;
  activity: string;
  status: string;
  group: string;
  camp: string;
  subCamp: string;
  report: string;
  image?: FileList | null;
};

export const UpdateStudentModal = ({
  setModalOpen,
  student,
  handleClose,
}: {
  setModalOpen: (v: boolean) => void;
  student: any;
  handleClose: () => void;
}) => {
  if (!student) return null;

  const getAgeGroupFromAge = (age: number | string) => {
    const numAge = typeof age === "string" ? parseInt(age) : age;
    if (numAge >= 13 && numAge <= 16) return "13-16";
    if (numAge >= 17 && numAge <= 20) return "17-20";
    return "";
  };
  const getAgeGroupValue = (ageGroupLabel: string) => {
    if (ageGroupLabel?.includes("13-16")) return "13-16";
    if (ageGroupLabel?.includes("17-20")) return "17-20";
    return ageGroupLabel ?? "";
  };

  const ageGroups = [
    { value: "13-16", label: "13-16 Junior" },
    { value: "17-20", label: "17-20 Senior" },
  ];
  const statuses = ["Approved", "Rejected"];
  const groups = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ");
  const campNo = Array.from({ length: 100 }, (_, i) => `Camp ${i + 1}`);
  const subCamps = [SubCamps.Jinnah, SubCamps.Iqbal];

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStudentFormValues>({
    defaultValues: {
      studentName: student?.studentName || student?.name || "",
      FatherName: student?.FatherName || student?.fatherName || "",
      ageGroup: student?.ageGroup ? getAgeGroupValue(student.ageGroup) : (student?.age ? getAgeGroupFromAge(student.age) : ""),
      grade: student?.grade || "",
      TshirtSize: student?.TshirtSize || student?.tshirtSize || "",
      activity: student?.activity || "",
      status: student?.status || "",
      group: student?.group || "",
      camp: student?.camp || "",
      subCamp: student?.subCamp || "",
      report: student?.report || "",
      image: null,
    },
    resolver: yupResolver(validationSchema) as Resolver<UpdateStudentFormValues>,
    values: {
      studentName: student?.studentName || student?.name || "",
      FatherName: student?.FatherName || student?.fatherName || "",
      ageGroup: student?.ageGroup ? getAgeGroupValue(student.ageGroup) : (student?.age ? getAgeGroupFromAge(student.age) : ""),
      grade: student?.grade || "",
      TshirtSize: student?.TshirtSize || student?.tshirtSize || "",
      activity: student?.activity || "",
      status: student?.status || "",
      group: student?.group || "",
      camp: student?.camp || "",
      subCamp: student?.subCamp || "",
      report: student?.report || "",
    },
  });

  const onSubmit = async (values: UpdateStudentFormValues) => {
    const studentId = student._id ?? student.id;
    if (!studentId) {
      setError("root", { message: "Student ID missing" });
      return;
    }
    try {
      let fileUrl: string | undefined;
      const file = values.image?.[0];
      if (file?.name) {
        const { url, key } = await getPresignedUrl("fileUrl", file.name, file.type);
        await uploadToPresignedUrl(url, file);
        fileUrl = key;
      }
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
        ...(fileUrl && { fileUrl }),
      });
      if (response.data?.success) {
        toast.success(response.data.message ?? "Updated");
      } else {
        toast.error(response.data?.error ?? "Update failed");
      }
      setModalOpen(false);
      handleClose();
    } catch (error: unknown) {
      setError("root", {
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500";
  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <div className="container mx-auto">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white rounded-lg shadow-lg w-2/3 p-6 relative">
          <h2 className="text-2xl pb-2 font-bold mb-4 text-center">Update Student</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <Controller name="studentName" control={control} render={({ field }) => <input {...field} type="text" className={inputClass} />} />
                {errors.studentName && <div className={errorClass}>{errors.studentName.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Father Name</label>
                <Controller name="FatherName" control={control} render={({ field }) => <input {...field} type="text" className={inputClass} />} />
                {errors.FatherName && <div className={errorClass}>{errors.FatherName.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age Group</label>
                <Controller
                  name="ageGroup"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className={inputClass}>
                      <option value="">Select Age Group</option>
                      {ageGroups.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.ageGroup && <div className={errorClass}>{errors.ageGroup.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Grade</label>
                <Controller name="grade" control={control} render={({ field }) => <input {...field} type="text" className={inputClass} />} />
                {errors.grade && <div className={errorClass}>{errors.grade.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">T-shirt Size</label>
                <Controller name="TshirtSize" control={control} render={({ field }) => <input {...field} type="text" className={inputClass} />} />
                {errors.TshirtSize && <div className={errorClass}>{errors.TshirtSize.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Activity</label>
                <Controller
                  name="activity"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className={inputClass}>
                      <option value="">Select an activity</option>
                      {activities.map((a, i) => (
                        <option key={a + i} value={a}>{a}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.activity && <div className={errorClass}>{errors.activity.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className={inputClass}>
                      <option value="">Select status</option>
                      {statuses.map((s, i) => (
                        <option key={s + i} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.status && <div className={errorClass}>{errors.status.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Group</label>
                <Controller
                  name="group"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className={inputClass}>
                      <option value="">Select group</option>
                      {groups.map((g, i) => (
                        <option key={g + i} value={g}>{g}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.group && <div className={errorClass}>{errors.group.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sub Camp</label>
                <Controller
                  name="subCamp"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className={inputClass}>
                      <option value="">Select sub camp</option>
                      {subCamps.map((s, i) => (
                        <option key={s + i} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.subCamp && <div className={errorClass}>{errors.subCamp.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Camp Number</label>
                <Controller
                  name="camp"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className={inputClass}>
                      <option value="">Select Camp Number</option>
                      {campNo.map((c, i) => (
                        <option key={c + i} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.camp && <div className={errorClass}>{errors.camp.message}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Photo (optional, max 1 MB)</label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="file"
                      accept="image/jpeg, image/png, image/gif"
                      onChange={(e) => onChange(e.target.files)}
                      className={inputClass}
                    />
                  )}
                />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">Student Report</label>
                <Controller
                  name="report"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter student report here..."
                    />
                  )}
                />
                {errors.report && <div className={errorClass}>{errors.report.message}</div>}
              </div>
            </div>
            <div className="flex justify-end space-x-4 items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${isSubmitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200`}
              >
                {isSubmitting ? "Updating..." : "Update Student"}
              </button>
              <button type="button" onClick={() => setModalOpen(false)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">
                Cancel
              </button>
            </div>
            {errors.root && <div className="text-red-600 text-sm mt-2">{errors.root.message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};
