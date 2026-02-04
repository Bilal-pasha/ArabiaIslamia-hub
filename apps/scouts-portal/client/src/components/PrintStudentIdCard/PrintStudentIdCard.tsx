/* eslint-disable react/display-name */
import React from "react";
import Image from "next/image";
import { PresignedImage } from "@/components/PresignedImage/PresignedImage";

const STUDENT_CARD_FRONT = "/assets/StudentCardFront.jpg";
const STUDENT_CARD_BACK = "/assets/StudentCardBack.jpg";
const PrintContent = React.forwardRef<HTMLDivElement, { students: any }>(
  ({ students }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full h-full print-page grid grid-cols-2 gap-12 p-2"
        style={{
          height: "300mm", // A4 height
          width: "230mm", // A4 width
        }}
      >
        {students.map((student: any, index: number) => (
          <>
            <div
              key={index}
              className="flex flex-col bg-[#18acb4]"
              style={{
                height: "95mm", // Adjusted height
                width: "60mm", // Adjusted width
                pageBreakInside: "avoid", // Prevent splitting across pages
              }}
            >
              {/* Top Half - Background Image */}
              <div className="relative w-full h-3/5">
                <Image
                  src={STUDENT_CARD_FRONT}
                  alt="Background Image"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="w-full h-full"
                />
              </div>

              <div
                className={`absolute mt-[4.4rem] left-[4.4rem] w-[6.5rem] h-36`}
              >
                {student.fileUrl && (
                  <PresignedImage
                    fileUrl={student.fileUrl}
                    alt="Student Image"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Bottom Half - Content */}
              <div className="w-full h-auto pt-6 pb-3 space-y-3 text-xs text-black leading-tight">
                <p className="bg-white max-w-48 mx-auto container">
                  <span className="bg-[#2186d2] font-medium py-1 px-1 text-white">
                    GR#:
                  </span>
                  <span className="ms-0.5">{student.GRNumber}</span>
                </p>
                <p className="bg-white max-w-48 mx-auto container">
                  <span className="bg-[#2186d2] font-medium py-1 px-1 text-white">
                    Name:
                  </span>
                  <span className="ms-0.5">{student.name}</span>
                </p>
                <p className="bg-white max-w-48 mx-auto container">
                  <span className="bg-[#2186d2] py-1 px-1 font-medium text-white">
                    F Name:
                  </span>
                  <span className="ms-0.5">{student.fatherName}</span>
                </p>
                <p className="bg-white max-w-48 mx-auto container">
                  <span className="bg-[#2186d2] py-1 px-1 font-medium text-white">
                    Class:
                  </span>
                  <span className="ms-0.5">{student.classSlug}</span>
                </p>
              </div>
            </div>
            <div
              key={index}
              className="flex flex-col bg-[#18acb4]"
              style={{
                height: "95mm", // Adjusted height
                width: "60mm", // Adjusted width
                pageBreakInside: "avoid", // Prevent splitting across pages
              }}
            >
              {/* Top Half - Background Image */}
              <div className="relative w-full h-96">
                <Image
                  src={STUDENT_CARD_BACK}
                  alt="Background Image"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="w-full h-full"
                />
              </div>
            </div>
          </>
        ))}
      </div>
    );
  }
);

PrintContent.displayName = "PrintComponent";

export default PrintContent;
