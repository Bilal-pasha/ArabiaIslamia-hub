"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/utils/axios-instance";
import { AddNewStudentModal } from "@/components/AddNewStudentModal/AddNewStudentModal";
import { Button } from "@/components/Button/Button";
import Drawer from "@/components/Drawer/Drawer";
import { TableSkeleton } from "@/components/TableSkeleton/TabelSkeleton";
import { IoPrintSharp } from "react-icons/io5";
import ReactToPrint from "react-to-print";
import { STATUS, SubCamps } from "@/constant/constant";
import Image from "next/image";
import IqbalCampSlipImage from "/public/assets/iqbalCamp.jpeg";
import JinnahCampSlipImage from "/public/assets/jinnahCamp.jpeg";
import LiaqatCampSlipImage from "/public/assets/liaqatCamp.jpeg";
import JinnahCardImage from "/public/assets/Jinnah-card.jpg";
import IqbalCardImage from "/public/assets/Iqbal-card.jpg";

interface Student {
  studentName: string;
  FatherName: string;
  madrasaName: string;
  ageGroup?: string;
  age?: number;
  grade: string;
  TshirtSize: string;
  activity: string;
  rollNumber: string;
}
// eslint-disable-next-line react/display-name
const PrintContent = React.forwardRef<HTMLDivElement, { students: any }>(
  ({ students }, ref) => {
    return (
      <div ref={ref} className="print-container">
        {students
          .filter((s: any) => s.status === "Approved")
          .map((student: any, index: number) => (
            <div
              key={index}
              className="id-card relative"
              style={{
                width: "2.2in",
                height: "3.5in",
                display: "inline-block",
                margin: "0.1in",
              }}
            >
              {/* Background Card Image based on subCamp */}
              {student.subCamp === SubCamps.Jinnah && (
                <Image
                  src={JinnahCardImage}
                  alt="Jinnah Card Background"
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}
              {student.subCamp === SubCamps.Iqbal && (
                <Image
                  src={IqbalCardImage}
                  alt="Iqbal Card Background"
                  fill
                  style={{ objectFit: "cover" }}
                />
              )}

              {/* Student Photo */}
              {student.fileUrl && (
                <Image
                  src={student.fileUrl}
                  alt="Student"
                  width={100}
                  height={100}
                  className="absolute top-[0.45in] left-[0.6in] w-[100px] h-[100px] max-w-[100px] max-h-[100px] rounded-lg"
                />
              )}

              {/* Info */}
              <div className="absolute top-[135px] left-[82px] w-full h-full text-start">
                <h1 className={`text-[10px] mt-[0.5px] font-semibold ${student.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                  {student.studentName}
                </h1>
                <h1 className={`text-[10px] mt-3 font-semibold ${student.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                  {student.FatherName}
                </h1>
                <h1 className={`text-[10px] mt-3 font-semibold ${student.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                  {student.madrasaName}
                </h1>
                <h1 className={`text-[10px] mt-3 font-semibold ${student.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                  {student.subCamp}
                </h1>
                <h1 className={`text-[10px] mt-3 font-semibold ${student.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                  {student.camp}
                </h1>
                <h1 className={`text-[10px] mt-2.5 font-semibold ${student.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                  {student.group}
                </h1>
              </div>
            </div>
          ))}
      </div>
    );
  }
);

const StudentTable = ({ params }: any) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!params.id) return;
      try {
        const res = await apiClient.get(`/api/madrasas/${params.id}/students`);
        setStudents(res.data?.students ?? []);
      } catch {
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [params.id, isModalOpen, isDrawerOpen]);

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const handleClose = () => setIsDrawerOpen(false);
  const printRef = useRef<HTMLDivElement>(null);
  console.log(students);
  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-between py-6">
          <div>
            <Button
              onClick={() => setModalOpen(true)}
              variant="primary"
              size="lg"
              className="mb-4"
            >
              Add New Student
            </Button>
            <h2 className="text-xl font-semibold mb-4">Students List</h2>
          </div>
          <ReactToPrint
            trigger={() => (
              <Button
                variant="primary"
                size="lg"
                roundedness="md"
                className="px-8"
              >
                <IoPrintSharp className="h-6 w-6" />
                Print All Approved Students Card
              </Button>
            )}
            content={() => printRef.current}
          />
        </div>
        {loading ? (
          <TableSkeleton numberOfRows={6} />
        ) : students.length === 0 ? (
          <div className="text-center text-gray-600">No students found</div>
        ) : (
          <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
            <table className="min-w-full shadow-md rounded-lg bg-white border border-green-200">
              <thead className="bg-green-600 text-white sticky top-0">
                <tr>
                  <th className="py-3 px-5 border-b border-green-300 text-left">
                    No#
                  </th>
                  <th className="py-3 px-5 border-b border-green-300 text-left">
                    Student Name
                  </th>
                  <th className="py-3 px-5 border-b border-green-300 text-left">
                    Father Name
                  </th>
                  <th className="py-3 px-5 border-b border-green-300 text-left">
                    Madrasa Name
                  </th>
                  <th className="py-3 px-5 border-b border-green-300 text-left">
                    Level
                  </th>
                  <th className="py-3 px-5 border-b border-green-300 text-left">
                    T-Shirt Size
                  </th>
                  <th className="py-3 px-5 border-b border-green-300 text-left">
                    Activity
                  </th>
                  <th className="py-3 px-5 border-b border-green-300 text-left">
                    Grade
                  </th>
                  <th className="py-3 px-5 border-b border-green-300 text-left">
                    Age Group
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {students.map((student, index) => (
                  <tr
                    key={index}
                    className="border-t border-black cursor-pointer"
                    onClick={() => handleRowClick(student)}
                  >
                    <td className="px-6 py-4 border-l border-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 border-l border-gray-400">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-4 border-l border-gray-400">
                      {student.FatherName}
                    </td>
                    <td className="px-6 py-4 border-l border-gray-400">
                      {student.madrasaName ?? ""}
                    </td>
                    <td className="px-6 py-4 border-l border-gray-400">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 border-l border-gray-400">
                      {student.TshirtSize}
                    </td>
                    <td className="px-6 py-4 border-l border-gray-400">
                      {student.activity}
                    </td>
                    <td className="px-6 py-4 border-l border-gray-400">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 border-l border-gray-400">
                      {student.ageGroup ?? student.age}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ display: "none" }}>
          <PrintContent ref={printRef} students={students} />
        </div>
        {isModalOpen && (
          <AddNewStudentModal
            setModalOpen={setModalOpen}
            madrasaId={params.id}
          />
        )}
      </div>
      <Drawer
        isOpen={isDrawerOpen}
        handleClose={handleClose}
        rowData={selectedStudent}
      />
    </>
  );
};

export default StudentTable;
