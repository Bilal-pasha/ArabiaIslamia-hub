"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button/Button";
import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/Modal/Modal";
import toast from "react-hot-toast";
import { TableSkeleton } from "@/components/TableSkeleton/TabelSkeleton";
import StudentModal from "@/components/StudentModal/StudenModal";
import { FaArrowLeft } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import Invoice from "@/components/Invoice/Invoice";
import { FaPrint, FaTrash, FaEdit } from "react-icons/fa";
import { useStudentData } from "@/utils/hooks/useStudentData";
import { apiClient } from "@/utils/axios-instance";

export default function Page({ params }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [modal, setModal] = useState(false)
  const [updateModal, setUpdateModal] = useState<boolean>(false)
  const [students, setStudents] = useState([]);
  const router = useRouter();
  const invoiceRef = useRef(null);
  const { student, setStudent } = useStudentData(setIsLoading, params);
  const handleDeleteButton = async (studentId: string) => {
    setModal(true);
    try {
      const res = await apiClient.delete(`/api/students/${studentId}`);
      if (res.data?.success ?? res.status === 200) {
        router.back();
        toast.success(res.data?.message ?? "Deleted");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  };
  const closeModal = () => {
    setModal(false);
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
                  {student?.feesStatusChart?.map((m: any, index: number) => (
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
            {modal && <Modal closeModal={closeModal} handleFunction={handleDeleteButton} id={params.id} name={student?.name} />}
            <Invoice ref={invoiceRef} student={student} />
          </>
        )}
        </>
      </div>
    </>
  )
}