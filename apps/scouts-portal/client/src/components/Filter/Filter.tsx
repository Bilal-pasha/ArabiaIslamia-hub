import React, { useEffect, useReducer, useRef, useMemo } from "react";
import { Button } from "@/components/Button/Button";
import ReactToPrint from "react-to-print";
import { IoPrintSharp } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";
import Image from "next/image";
import { activities, STATUS, SubCamps } from "@/constant/constant";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { apiClient } from "@/utils/axios-instance";

// Define the types for the filter values
interface TfilterValues {
  status: string;
  subCamp: string;
  campNumber: string;
  activity: string;
  ageGroup: string;
  madrasa: string;
  tShirtSize: string;
  group: string;
}

// Define the type for a single student object (filtered data item)
interface StudentData {
  _id: string;
  madrasaId: string;
  studentName: string;
  madrasaName: string;
  FatherName: string;
  age: number;
  grade: string;
  TshirtSize: string;
  status: string;
  activity: string;
  fileUrl: string;
  createdAt: string;
  camp: string;
  group: string;
  report: string;
  subCamp: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: StudentData[];
}

// Define the state type
interface State {
  filterValues: TfilterValues;
  madrasaList: string[]; // List of madrasa names
  appliedFilters: TfilterValues;
  filteredData: ApiResponse;
  madrasaName: string[]; // List of madrasa names (used for filters)
  loading: boolean;
  pdfLoading: boolean; // New loading state for PDF generation
  error: string | null;
}

// Define the action types
type Action =
  | { type: "SET_FILTER_VALUE"; filter: keyof TfilterValues; value: string }
  | { type: "APPLY_FILTERS" }
  | { type: "SET_MADRASA_LIST"; data: string[] }
  | { type: "SET_FILTERED_DATA"; data: StudentData[] }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_PDF_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string };

// Initial state
const initialState: State = {
  filterValues: {
    status: "",
    subCamp: "",
    campNumber: "",
    activity: "",
    ageGroup: "",
    madrasa: "",
    tShirtSize: "",
    group: "",
  },
  appliedFilters: {
    status: "",
    subCamp: "",
    campNumber: "",
    activity: "",
    ageGroup: "",
    madrasa: "",
    tShirtSize: "",
    group: "",
  },
  madrasaList: [],
  madrasaName: [],
  filteredData: { success: false, data: [] },
  loading: false,
  pdfLoading: false,
  error: null,
};

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FILTER_VALUE":
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          [action.filter]: action.value,
        },
      };
    case "APPLY_FILTERS":
      return {
        ...state,
        appliedFilters: state.filterValues,
      };
    case "SET_FILTERED_DATA":
      return {
        ...state,
        filteredData: { success: true, data: action.data },
      };
    case "SET_MADRASA_LIST":
      return {
        ...state,
        madrasaList: action.data,
        madrasaName: action.data,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "SET_PDF_LOADING":
      return {
        ...state,
        pdfLoading: action.loading,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

// Helper function to convert age to age group
const getAgeGroupFromAge = (age: number) => {
  if (age >= 13 && age <= 16) return "13-16 Junior";
  if (age >= 17 && age <= 20) return "17-20 Senior";
  return "Unknown";
};

// PrintContent Component
// eslint-disable-next-line react/display-name
const PrintContent = React.forwardRef<HTMLDivElement, { data: StudentData[] }>(
  ({ data }, ref) => (
    <div ref={ref}>
      <div className="flex items-center justify-evenly space-x-4 py-3">
        <Image
          src="/assets/signinLogo.png"
          alt="Sign In Logo"
          width={200}
          height={200}
          className="object-contain"
        />
        <Image
          src="/assets/JamiaArabiaLogo.png"
          alt="Jamia Arabia Logo"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
      <table className="w-full bg-white shadow-md rounded-md border-collapse border border-gray-300">
        <thead className="bg-gray-300 text-black text-xs uppercase">
          <tr>
            {[
              "No#",
              "Name",
              "Father Name",
              "Madrasa Name",
              "Age Group",
              "Status",
              "Activity",
              "Group",
              "Camp Number",
              "Sub Camp",
              "T-shirt Size",
            ].map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-xs font-semibold border-b border-gray-300 text-start"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((student, index) => (
            <tr key={student._id} className="border-t border-gray-300">
              {[
                index + 1,
                student.studentName,
                student.FatherName,
                student.madrasaName,
                getAgeGroupFromAge(student.age),
                student.status,
                student.activity,
                student.group,
                student.camp,
                student.subCamp,
                student.TshirtSize || "",
              ].map((value, index) => (
                <td
                  key={index}
                  className="px-4 py-2 text-xs text-gray-800 border-r border-gray-300"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
);

export const Filter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchMadrasaNames = useMemo(() => {
    return async () => {
      try {
        const response = await apiClient.get("/api/madrasas/names");
        if (response.data?.success && response.data?.data) {
          dispatch({ type: "SET_MADRASA_LIST", data: response.data.data });
        }
      } catch {
        dispatch({ type: "SET_ERROR", error: "Failed to fetch madrasa names" });
      }
    };
  }, []);

  // Fetch madrasa names once when the component mounts
  useEffect(() => {
    fetchMadrasaNames();
  }, [fetchMadrasaNames]);

  const filters: (keyof TfilterValues)[] = [
    "status",
    "subCamp",
    "campNumber",
    "activity",
    "ageGroup",
    "madrasa",
    "tShirtSize",
    "group",
  ];

  const handleInputChange = (filter: keyof TfilterValues, value: string) => {
    dispatch({ type: "SET_FILTER_VALUE", filter, value });
  };

  const handleApplyFilters = async () => {
    dispatch({ type: "APPLY_FILTERS" });
    dispatch({ type: "SET_LOADING", loading: true });

    try {
      const response = await apiClient.post("/api/students/filter", state.filterValues);
      const data: ApiResponse = response.data;
      dispatch({ type: "SET_FILTERED_DATA", data: data.data });
    } catch {
      dispatch({ type: "SET_ERROR", error: "Error fetching filtered data" });
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  // Static filter options
  const campNumberOptions = Array.from(
    { length: 100 },
    (_, index) => `Camp ${index + 1}`
  );
  const activityOptions = activities;
  const subCampOptions = [SubCamps.Jinnah, SubCamps.Iqbal];
  const statusOptions = [STATUS.APPROVED, STATUS.REJECTED];
  const ageGroupOptions = [
    { value: "13-16", label: "13-16 Junior" },
    { value: "17-20", label: "17-20 Senior" },
  ];
  const tShirtSizeOptions = ["Medium", "large", "Xl"];
  const groupOptions = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ];
  const handleClear = (filter: keyof TfilterValues) => {
    dispatch({ type: "SET_FILTER_VALUE", filter, value: "" });
  };

  // Function to save table data as PDF
  const handleSavePDF = async () => {
    if (state.filteredData.data.length === 0) {
      alert('No data available to generate PDF.');
      return;
    }

    // Set loading state
    dispatch({ type: "SET_PDF_LOADING", loading: true });

    try {
      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '20px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.zIndex = '9999';

      // Create the content HTML directly
      tempContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-evenly; margin-bottom: 20px;">
          <img src="/assets/signinLogo.png" alt="Sign In Logo" style="width: 150px; height: auto;" />
          <img src="/assets/JamiaArabiaLogo.png" alt="Jamia Arabia Logo" style="width: 150px; height: auto;" />
        </div>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
          <thead style="background-color: #e5e7eb; color: #000;">
            <tr>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">No#</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">Name</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">Father Name</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">Madrasa Name</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">Age Group</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">Status</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">Activity</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">Group</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">Camp Number</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">Sub Camp</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left; font-size: 10px;">T-shirt Size</th>
            </tr>
          </thead>
          <tbody>
            ${state.filteredData.data.map((student, index) => `
              <tr>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${index + 1}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${student.studentName}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${student.FatherName}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${student.madrasaName}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${getAgeGroupFromAge(student.age)}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${student.status}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${student.activity}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${student.group}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${student.camp}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${student.subCamp}</td>
                <td style="padding: 6px; border: 1px solid #ccc; font-size: 10px;">${student.TshirtSize || ""}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      // Append to body temporarily
      document.body.appendChild(tempContainer);

      // Wait for images to load and content to render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create canvas from the temporary container
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight
      });

      // Remove the temporary container
      document.body.removeChild(tempContainer);

      // Check if canvas is valid
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Failed to generate canvas from content');
      }

      // Get image data
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Validate image data
      if (!imgData || imgData === 'data:,' || imgData.length < 100) {
        throw new Error('Invalid image data generated');
      }

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `student-data-${currentDate}.pdf`;

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Clear loading state
      dispatch({ type: "SET_PDF_LOADING", loading: false });
    }
  };
  return (
    <div className="flex flex-col justify-center items-end px-4 space-x-4 py-28 animate">
      {/* Filter Button */}
      <div className="relative inline-block text-left">
        <div className="flex space-x-5">
          <ReactToPrint
            trigger={() => (
              <Button
                variant="primary"
                size="md"
                roundedness="md"
                className="px-8"
                disabled={state.filteredData.data.length === 0}
              >
                <IoPrintSharp className="h-6 w-6" /> Print
              </Button>
            )}
            content={() => printRef.current}
          />
          {/* <Button
            variant="primary"
            size="md"
            roundedness="md"
            className="px-8"
            onClick={handleSavePDF}
            disabled={state.filteredData.data.length === 0 || state.pdfLoading}
          >
            {state.pdfLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <FaFilePdf className="h-6 w-6" /> Save PDF
              </>
            )}
          </Button> */}
          <Button
            variant="primary"
            size="md"
            roundedness="md"
            className="px-8"
            onClick={() =>
              dispatch({ type: "SET_LOADING", loading: !state.loading })
            }
          >
            Filters
          </Button>
        </div>

        {/* Filter Inputs */}
        {state.loading && (
          <div className="absolute right-0 mt-2 w-96 py-2 bg-white rounded-md shadow-lg z-20">
            <div className="p-4 space-y-4">
              {filters.map((filter) => (
                <div key={filter} className="flex flex-col space-y-1">
                  <label
                    htmlFor={filter}
                    className="text-sm flex justify-between font-medium text-gray-700"
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    {state.filterValues[filter] && (
                      <Button
                        variant={"primary"}
                        size={"sm"}
                        roundedness={"lg"}
                        onClick={() => handleClear(filter)}
                      >
                        clear
                      </Button>
                    )}
                  </label>
                  {filter === "ageGroup" && (
                    <select
                      id={filter}
                      value={state.filterValues[filter]}
                      onChange={(e) =>
                        handleInputChange(filter, e.target.value)
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Age Group</option>
                      {ageGroupOptions.map((ageGroup, index) => (
                        <option key={index} value={ageGroup.value}>
                          {ageGroup.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter === "subCamp" && (
                    <select
                      id={filter}
                      value={state.filterValues[filter]}
                      onChange={(e) =>
                        handleInputChange(filter, e.target.value)
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Sub Camp</option>
                      {subCampOptions.map((subCamp, index) => (
                        <option key={index} value={subCamp}>
                          {subCamp}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter === "status" && (
                    <select
                      id={filter}
                      value={state.filterValues[filter]}
                      onChange={(e) =>
                        handleInputChange(filter, e.target.value)
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter === "activity" && (
                    <select
                      id={filter}
                      value={state.filterValues[filter]}
                      onChange={(e) =>
                        handleInputChange(filter, e.target.value)
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Activity</option>
                      {activityOptions.map((activity, index) => (
                        <option key={index} value={activity}>
                          {activity}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter === "madrasa" && (
                    <select
                      id={filter}
                      value={state.filterValues[filter]}
                      onChange={(e) =>
                        handleInputChange(filter, e.target.value)
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Madrasa</option>
                      {state.madrasaName.map((madrasa, index) => (
                        <option key={index} value={madrasa}>
                          {madrasa}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter === "campNumber" && (
                    <select
                      id={filter}
                      value={state.filterValues[filter]}
                      onChange={(e) =>
                        handleInputChange(filter, e.target.value)
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Camp Number</option>
                      {campNumberOptions.map((camp, index) => (
                        <option key={index} value={camp}>
                          {camp}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter === "tShirtSize" && (
                    <select
                      id={filter}
                      value={state.filterValues[filter]}
                      onChange={(e) =>
                        handleInputChange(filter, e.target.value)
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select T-shirt Size</option>
                      {tShirtSizeOptions.map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter === "group" && (
                    <select
                      id={filter}
                      value={state.filterValues[filter]}
                      onChange={(e) =>
                        handleInputChange(filter, e.target.value)
                      }
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Group</option>
                      {groupOptions.map((group, index) => (
                        <option key={index} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
            <div className="py-1 px-2 space-x-4 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleApplyFilters}
                className="px-4"
              >
                Apply
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() =>
                  dispatch({ type: "SET_LOADING", loading: false })
                }
                className="px-4"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error or Loading State */}
      {state.error && (
        <div className="mt-4 text-sm text-red-500">{state.error}</div>
      )}

      {/* Display Filtered Data */}
      <div className="mt-4 w-full">
        {state.filteredData.data.length > 0 ? (
          <table className="w-full animate bg-white shadow-md rounded-md border border-green-200">
            <thead className="bg-green-600 text-white text-sm uppercase">
              <tr>
                {[
                  "No#",
                  "Student Name",
                  "Father Name",
                  "Madrasa Name",
                  "Age Group",
                  "Status",
                  "Activity",
                  "Group",
                  "Camp Number",
                  "Sub Camp",
                  "T-shirt Size",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 text-sm font-semibold border-b border-green-300 text-start"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100">
              {state.filteredData.data.map((student, index) => (
                <tr key={student._id}>
                  {[
                    index + 1,
                    student.studentName,
                    student.FatherName,
                    student.madrasaName,
                    getAgeGroupFromAge(student.age),
                    student.status,
                    student.activity,
                    student.group,
                    student.camp,
                    student.subCamp,
                    student.TshirtSize || "",
                  ].map((value, index) => (
                    <td key={index} className="px-4 py-2 text-sm text-gray-700">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-sm text-gray-600 text-center">
            No filtered data available.
          </div>
        )}
      </div>

      {/* Hidden Print Content */}
      <div style={{ display: "none" }}>
        <PrintContent ref={printRef} data={state.filteredData.data} />
      </div>

      {/* PDF Loading Overlay */}
      {state.pdfLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <h3 className="text-lg font-semibold text-gray-800">Generating PDF...</h3>
            <p className="text-sm text-gray-600 text-center">
              Please wait while we prepare your PDF document.<br />
              This may take a few moments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
