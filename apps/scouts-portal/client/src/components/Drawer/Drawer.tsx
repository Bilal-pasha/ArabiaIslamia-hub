"use client";
import React, { useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, Avatar, AvatarImage, AvatarFallback } from "@arabiaaislamia/ui";
import Image from "next/image";
import { UpdateStudentModal } from "@/components/UpdateStudentModal/UpdateStudentModal";
import { Button } from "../Button/Button";
import useSearchRole from "@/hooks/useSearchRole/useSearchRole";
import { ROLE, STATUS, SubCamps } from "@/constant/constant";
import {
  AiOutlineCheck,
  AiOutlineClockCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { toast } from "@arabiaaislamia/ui";
import { apiClient } from "@/utils/axios-instance";
import { studentDrawerMappingKeys } from "./Drawer.types";
import { IoPrintSharp } from "react-icons/io5";
import ReactToPrint from "react-to-print";
import { usePresignedFileUrl } from "@/hooks/usePresignedFileUrl/usePresignedFileUrl";
import { PresignedImage } from "@/components/PresignedImage/PresignedImage";
const JINNAH_CARD_IMAGE = "/assets/Jinnah-card.jpg";
const IQBAL_CARD_IMAGE = "/assets/Iqbal-card.jpg";
interface IStatusIndicator {
  status: string;
}

export const StatusIndicator: React.FC<IStatusIndicator> = ({ status }) => {
  const icon = {
    Approved: <AiOutlineCheck className="mr-2" />,
    Rejected: <AiOutlineClose className="mr-2" />,
    Pending: <AiOutlineClockCircle className="mr-2" />,
  }[status] || <AiOutlineClockCircle className="mr-2" />;

  const statusStyles =
    {
      Approved: "bg-green-200 text-green-700",
      Rejected: "bg-red-200 text-red-700",
      Pending: "bg-yellow-50 text-yellow-700",
    }[status] || "bg-gray-200 text-gray-700";

  return (
    <div className={`flex items-center px-3 py-1 rounded-lg ${statusStyles}`}>
      {icon}
      {status}
    </div>
  );
};

interface IInfoCard {
  label: string;
  value: string;
}

const InfoCard: React.FC<IInfoCard> = ({ label, value }) => {
  if (label === "fileUrl" || label === "_id" || label === "madrasaId") {
    return null;
  }
  const displayName = studentDrawerMappingKeys[label] || label;
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-200">
      {label === "status" ? (
        <div className="flex items-center justify-between">
          <span className="font-semibold">{displayName}:</span>
          <StatusIndicator status={value} />
        </div>
      ) : (
        <>
          <span className="font-semibold">{displayName}:</span>
          <span className="ml-2">{value}</span>
        </>
      )}
    </div>
  );
};
// eslint-disable-next-line react/display-name
const PrintContent = React.forwardRef<HTMLDivElement, { rowData: any }>(
  ({ rowData }, ref) => {
    // Ensure rowData is an array
    const dataArray = Array.isArray(rowData) ? rowData : [rowData];

    return (
      <div
        ref={ref}
        className="print-container"
      >
        {dataArray.slice(0, 8).map((data, index) => (
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
            {/* Top Half - Background Image */}
            {/* Background Card Image based on subCamp */}
            {data.subCamp === SubCamps.Jinnah && (
              <Image
                src={JINNAH_CARD_IMAGE}
                alt="Jinnah Card Background"
                fill
                style={{ objectFit: "cover" }}
              />
            )}
            {data.subCamp === SubCamps.Iqbal && (
              <Image
                src={IQBAL_CARD_IMAGE}
                alt="Iqbal Card Background"
                fill
                style={{ objectFit: "cover" }}
              />
            )}

            {/* Student Photo */}
            {data.fileUrl && (
              <PresignedImage
                fileUrl={data.fileUrl}
                alt="Student"
                width={100}
                height={100}
                className="absolute top-[0.45in] left-[0.6in] w-[100px] h-[100px] max-w-[100px] max-h-[100px] rounded-lg"
              />
            )}

            {/* Info */}
            <div className="absolute top-[135px] left-[82px] w-full h-full text-start">
              <h1 className={`text-[10px] mt-[0.5px] font-semibold ${data.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                {data.studentName}
              </h1>
              <h1 className={`text-[10px] mt-3 font-semibold ${data.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                {data.FatherName}
              </h1>
              <h1 className={`text-[10px] mt-3 font-semibold ${data.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                {data.madrasaName}
              </h1>
              <h1 className={`text-[10px] mt-3 font-semibold ${data.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                {data.subCamp}
              </h1>
              <h1 className={`text-[10px] mt-3 font-semibold ${data.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                {data.camp}
              </h1>
              <h1 className={`text-[10px] mt-2.5 font-semibold ${data.subCamp === SubCamps.Iqbal ? "text-white" : "text-black"}`}>
                {data.group}
              </h1>
            </div>
          </div>

        ))}
      </div>
    );
  }
);

const Drawer: React.FC<{
  isOpen: boolean;
  handleClose: () => void;
  rowData: any;
}> = ({ isOpen, handleClose, rowData }) => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const userName = useSearchRole();
  const printRef = useRef<HTMLDivElement>(null);
  const fileDisplayUrl = usePresignedFileUrl(rowData?.fileUrl);

  if (!rowData) return null;

  const handleDelete = async () => {
    try {
      const id = rowData._id ?? rowData.id;
      await apiClient.delete(`/api/students/${id}`);
      toast.success("Student deleted successfully.");
      handleClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete student.";
      toast.error(message);
    }
  };

  const renderButton = (rowData: any) => (
    <div className="flex justify-end space-x-4">
      {rowData.status === STATUS.APPROVED && (
        <ReactToPrint
          trigger={() => (
            <Button
              variant="primary"
              size="lg"
              roundedness="md"
              className="px-8"
            >
              <IoPrintSharp className="h-6 w-6" />
              Print
            </Button>
          )}
          content={() => printRef.current}
        />
      )}
      <Button
        variant="danger"
        size="lg"
        roundedness="md"
        className="px-8"
        onClick={handleDelete}
      >
        Delete
      </Button>
      {userName === ROLE.ADMIN && (
        <Button
          variant="primary"
          size="lg"
          roundedness="md"
          className="px-8"
          onClick={() => setUpdateModalOpen(true)}
        >
          Update
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Student Details</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col justify-between h-[80vh] pt-4">
            <div className="flex p-6">
              <div className="flex-1">
                <h2 className="text-xl py-4 font-bold mb-4 text-center">
                  Student Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(rowData).map(
                    ([key, value]: any, index: number) => (
                      <InfoCard key={key + index} label={key} value={value} />
                    )
                  )}
                </div>
              </div>
              <div className="ml-4">
                <Avatar className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-lg">
                  {fileDisplayUrl && <AvatarImage src={fileDisplayUrl} alt="Student Avatar" />}
                  <AvatarFallback className="bg-primary-100 text-primary-600 text-2xl font-medium">
                    {rowData.studentName?.slice(0, 1).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            {renderButton(rowData)}
          </div>
        </SheetContent>
      </Sheet>

      {/* Hidden print content */}
      <div style={{ display: "none" }}>
        <PrintContent ref={printRef} rowData={rowData} />
      </div>

      {isUpdateModalOpen && (
        <UpdateStudentModal
          setModalOpen={setUpdateModalOpen}
          student={rowData}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default Drawer;
