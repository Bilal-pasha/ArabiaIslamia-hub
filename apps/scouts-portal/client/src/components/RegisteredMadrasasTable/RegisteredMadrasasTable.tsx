import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@arabiaaislamia/ui";
import { Button } from "@/components/Button/Button";
import { useMadrasaRegistrationContext } from "@/context/useMadrasaRegistrationContext";
import { StatusIndicator } from "@/components/Drawer/Drawer";
import { ROLE, STATUS } from "@/constant/constant";
import { NotificationModal } from "@/components/Modal/NotificationModal";
import useSearchRole from "@/hooks/useSearchRole/useSearchRole";
import { protectedRoutes } from "@/utils/routes";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@arabiaaislamia/ui";
import { toast } from "@arabiaaislamia/ui";
import { apiClient } from "@/utils/axios-instance";

const MadrasaTable: React.FC = () => {
  const { madrasas, loading, fetchMadrasas } = useMadrasaRegistrationContext();
  const [openModal, setOpenModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [currentStatus, setCurrentStatus] = useState("");
  const userName = useSearchRole();

  useEffect(() => {
    // Fetch madrasas on component mount
    fetchMadrasas();
  }, []);

  const handleSelectStatus = async (newStatus: string, madrasaId: string) => {
    setSelectedStatus(newStatus);
    if (newStatus === "Delete") {
      try {
        const result = await apiClient.delete(`/api/madrasas/${madrasaId}`);
        toast.success(result.data?.message ?? "Deleted");
        fetchMadrasas();
      } catch (error) {
        console.error("Error updating status:", error);
      }
    } else {
      try {
        await apiClient.patch(`/api/madrasas/${madrasaId}/status`, { status: newStatus });
        toast.success("Status updated successfully");
        fetchMadrasas();
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const handleStatusPending = (status: string) => {
    setCurrentStatus(status);
    setOpenModal(true);
  };

  // Table Headings
  const tableHeadings = [
    'No#',
    "Madrasa Name",
    "Madrasa Address",
    "Total Students",
    "Contact Person Name",
    "Cell Number",
    "Registered On",
    "Registered Students",
    "Status",
  ];
  if (userName === ROLE.ADMIN) {
    tableHeadings.push("Actions");
  }
  const dropdownOptions = ["Approved", "Rejected", "Delete"];
  // Loading Skeleton
  if (loading) {
    return <TableSkeleton numberOfRows={6} />;
  }
  return madrasas.length !== 0 ? (
    <>
      <div className="">
        <table className="w-full bg-white shadow-md rounded-lg border border-green-200 text-left">
          <thead className="bg-green-600 text-white text-xs uppercase">
            <tr>
              {tableHeadings.map((heading, index) => (
                <th key={index} className="py-3 px-5 border-b border-green-300">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100 text-xs">
            {madrasas.map((madrasa, index) => (
              <tr key={madrasa?._id}>
                <td className="py-3 px-8">{index + 1}</td>
                <td className="py-3 px-5 border-l border-green-200">
                  {madrasa.status === STATUS.APPROVED ? (
                    <Link
                      href={`${protectedRoutes.HOME}/${madrasa?._id}`}
                      className="text-primary-500"
                    >
                      {madrasa.madrasaName}
                    </Link>
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={() => handleStatusPending(madrasa.status)}
                    >
                      {madrasa.madrasaName}
                    </span>
                  )}
                </td>
                <td className="py-3 px-5 border-l border-green-200">
                  {madrasa.madrasaAddress}
                </td>
                <td className="py-3 px-5 border-l border-green-200">
                  {madrasa.totalStudents}
                </td>
                <td className="py-3 px-5 border-l border-green-200">
                  {madrasa.contactPersonName}
                </td>
                <td className="py-3 px-5 border-l border-green-200">
                  {madrasa.cellNumber}
                </td>
                <td className="py-3 px-5 border-l border-green-200">
                  {new Date(madrasa.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-5 border-l border-green-200">
                  {madrasa.registeredStudents}
                </td>
                <td className="py-3 px-5 border-l border-gray-300 space-x-3">
                  <StatusIndicator status={madrasa.status} />
                </td>
                {userName === ROLE.ADMIN && (
                  <td className="py-3 px-5 border-l border-green-200">
                    <div className="flex items-center justify-center relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" className="cursor-pointer p-1 rounded hover:bg-gray-100">
                            <BsThreeDotsVertical className="h-5 w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="absolute left-[-60px] top-5">
                          {dropdownOptions.map((dropdownItem, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() =>
                                handleSelectStatus(dropdownItem, madrasa._id)
                              }
                            >
                              {dropdownItem}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NotificationModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        text={`${currentStatus === "Pending"
          ? "Your registration status is currently pending. Please wait until it is approved to proceed with your madrasa registration."
          : "Your registration status is currently Rejected. Please Contact SupportArabia@gmail.com"
          }`}
      />
    </>
  ) : (
    <div>
      <h2 className="text-sm text-white">
        You don&apos;t have any registered madrasas yet
      </h2>
      <div className="flex justify-center py-8">
        <Button variant="primary" size="lg">
          <Link href="/registration">Register Your Madrasa Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default MadrasaTable;
