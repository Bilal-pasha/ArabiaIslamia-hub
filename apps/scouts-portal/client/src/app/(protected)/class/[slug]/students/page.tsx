"use client";
import { Button } from "@/components/Button/Button";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { TableSkeleton } from "@arabiaaislamia/ui";
import StudentModal from "@/components/StudentModal/StudenModal";
import { getCurrentMonthYear, tableHead } from "@/constant/constant";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useStudents } from "@/hooks/useStudentQueries";
import { protectedRoutes } from "@/utils/routes";
import { PrinterIcon } from "@heroicons/react/24/outline";
import PrintComponent from "@/components/PrintStudentIdCard/PrintStudentIdCard";
import { useReactToPrint } from "react-to-print";

const StudentTable = ({ params }: { params: { slug: string } }) => {
  const classSlug = params.slug;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const currentMonthYear = getCurrentMonthYear();
  const { data: students = [], isLoading: tableLoading, refetch } = useStudents(classSlug);
  const setStudents = (_?: unknown) => { refetch(); };

  // Ref for react-to-print
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Student_ID_Cards",
  });

  return (
    <>
      <div className="container mx-auto">
        <div className="py-4 space-y-4">
          <h1 className="text-2xl font-bold text-white">Student Information</h1>
          <div className="flex justify-between">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              type="submit"
              size="md"
              className="!px-4"
            >
              <FaPlus />
              Add New Student
            </Button>
            <div className="flex space-x-5">
              <Button
                onClick={handlePrint}
                variant="primary"
                type="button"
                size="md"
                className="!px-4 flex items-center gap-2"
              >
                <PrinterIcon className="w-5 h-5" />
                Print All Students ID Cards
              </Button>
              <Button
                onClick={() => router.back()}
                variant="primary"
                type="button"
                size="md"
                className="!px-4 flex items-center gap-2"
              >
                <FaArrowLeft />
                Go Back
              </Button>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          {tableLoading ? (
            <TableSkeleton numberOfRows={18} />
          ) : (
            <table className="w-full text-left bg-white shadow-md rounded-lg border border-green-200">
              <thead className="bg-green-600 text-white text-xs uppercase">
                <tr>
                  {tableHead.map((value, index) => (
                    <th
                      key={index}
                      className="py-3 px-5 border-b border-green-300"
                    >
                      {value}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100 bg-white text-xs">
                {students.map((student: any, index) => (
                  <tr key={index}>
                    <td className="py-3 px-5 border-l border-green-200 border-r">
                      <Link
                        href={`${protectedRoutes.CLASS}/${classSlug}/students/${student?.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {student?.name}
                      </Link>
                    </td>
                    <td className="py-3 px-5 border-l border-green-200">
                      {student.fatherName}
                    </td>
                    <td className="py-3 px-5 border-l border-green-200">
                      {student.GRNumber}
                    </td>
                    <td className="py-3 px-5 border-l border-green-200">
                      {student.fees}
                    </td>
                    <td className="py-3 px-5 border-l border-green-200 border-r">
                      {student.status === "Paid" ? (
                        <div className="flex font-medium text-xs">
                          <span className="text-green-500 flex gap-x-1 rounded-md bg-green-100 py-1 px-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            {student.status} - {currentMonthYear}
                          </span>
                        </div>
                      ) : (
                        <div className="flex font-medium text-xs">
                          <span className="text-red-600 flex items-center gap-x-1 bg-danger-300 py-1 px-2 rounded-md">
                            <XCircleIcon className="h-4 w-4 text-red-500" />
                            {student.status} - {currentMonthYear}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Print Student Card Component */}
        <div style={{ display: "none" }}>
          <PrintComponent ref={printRef} students={students} />
        </div>

        {isModalOpen && (
          <StudentModal
            setStudents={setStudents}
            students={students}
            setIsModalOpen={setIsModalOpen}
            classSlug={classSlug}
            create
          />
        )}
      </div>
    </>
  );
};

export default StudentTable;
