"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button/Button";
import { useRef, useState } from "react";
import { toast, TableSkeleton, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@arabiaaislamia/ui";
import StudentModal from "@/components/StudentModal/StudenModal";
import { FaArrowLeft } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import Invoice from "@/components/Invoice/Invoice";
import { FaPrint, FaTrash, FaEdit } from "react-icons/fa";
import { useStudent, useDeleteStudent } from "@/hooks/useStudentQueries";

export default function Page({ params }: { params: { id: string } }) {
  const [modal, setModal] = useState(false);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [students, setStudents] = useState<unknown[]>([]);
  const router = useRouter();
  const invoiceRef = useRef(null);
  const { data: student, isLoading, refetch } = useStudent(params?.id ?? null);
  const setStudent = () => { refetch(); };
  const deleteMutation = useDeleteStudent();
  const handleDeleteButton = async (studentId: string) => {
    try {
      const res = await deleteMutation.mutateAsync(studentId);
      if (res?.success ?? true) {
        setModal(false);
        router.back();
        toast.success(res?.message ?? "Deleted");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  };
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  return (
    <>
      <div className="flex justify-end px-10">
        <Button
          onClick={() => router.back()}
          variant="primary"
          type="button"
          size="md"
          className="!px-4 flex items-center gap-2" // Ensure proper spacing between icon and text
        >
          <FaArrowLeft /> {/* Add the icon */}
          Go Back
        </Button>
      </div>
      <div className="container mx-auto py-10 text-black px-8 rounded-lg bg-white">
        <>{isLoading ? (<TableSkeleton numberOfRows={10} />) : (
          <>
            <div className="border-b border-gray-400 mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold ">Student&apos; Name</h2>
              <p className="text-lg py-2 px-4">{student?.name}</p>
            </div>
            <div className="border-b border-gray-400 mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold ">Father&apos; Name</h2>
              <p className="text-lg py-2 px-4">{student?.fatherName}</p>
            </div>
            <div className="border-b border-gray-400 mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold ">ID Number</h2>
              <p className="text-lg py-2 px-4">{student?.rollNumber}</p>
            </div>
            <div className="border-b border-gray-400 mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold ">Fees</h2>
              <p className="text-lg py-2 px-4">{student?.fees}</p>
            </div>
            <div className={`border-b border-gray-400 mb-4`}>
              <div className="grid mb-4 grid-cols-3 items">
                <h2 className="text-xl font-semibold  col-span-1">Status</h2>
                <div className=" gap-2 mt-2 space-y-2 space-x-4 col-span-2">
                  {(Array.isArray(student?.feesStatusChart) ? student.feesStatusChart : []).map((m: any, index: number) => (
                    <span
                      key={m.month + index}
                      className={`inline-block py-2 px-4 rounded-lg text-sm font-semibold 
                    ${m.status === "Paid" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                    >
                      {m.month} - {m.status}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div></div>
              <div className="flex space-x-4">
                <Button variant="primary" size="md" onClick={handlePrint}>
                  <FaPrint className="inline-block mr-2 w-5 h-5" />
                  Print Invoice
                </Button>
                <Button variant="primary" size="md" className="!px-4" onClick={() => setUpdateModal(true)}>
                  <FaEdit className="inline-block mr-2 w-5 h-5" />
                  Update
                </Button>
                <Button variant="danger" size="md" className="!px-4" onClick={() => setModal(true)}>
                  <FaTrash className="inline-block mr-2 w-5 h-5" />
                  Delete
                </Button>
              </div>
            </div>
            {updateModal && <StudentModal setStudents={setStudents} students={students} setIsModalOpen={setUpdateModal} id={params.id} studentData={student} setStudent={setStudent} />}
            <AlertDialog open={modal} onOpenChange={setModal}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    {`Are you sure you want to delete ${student?.name ?? "this student"}?`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteButton(params.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Invoice ref={invoiceRef} student={student} />
          </>
        )}
        </>
      </div>
    </>
  )
}