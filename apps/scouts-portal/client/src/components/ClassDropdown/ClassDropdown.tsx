"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ClassDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const sections = {
    Primary: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
    Secondary: [
      "Pre-Level",
      "Level 1",
      "Level 2",
      "Level 3",
      "9th",
      "Matric",
      "Huffaz English",
      "Huffaz Arabic",
    ],
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Toggle accordion sections
  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setExpandedSection(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigate to a dynamic route when an option is selected
  const handleOptionSelect = (option: string) => {
    const classSlug = option.toLowerCase().replace(/\s+/g, "-");
    router.push(`/class/${classSlug}/students`);
  };

  return (
    <div className="flex justify-center items-center h-[75vh]">
      <div className="relative w-80" ref={dropdownRef}>
        {/* Dropdown button */}
        <button
          onClick={toggleDropdown}
          className={`bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-8 w-full rounded-xl shadow-lg flex justify-between items-center transition-all duration-300 ${
            isDropdownOpen
              ? "hover:from-purple-500 hover:to-pink-500"
              : "hover:bg-gradient-to-r"
          }`}
        >
          <span>Select Class</span>
          {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {/* Dropdown content */}
        {isDropdownOpen && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-96 overflow-scroll">
            {/* Sections */}
            {Object.entries(sections).map(([section, options], index) => (
              <div key={index} className="overflow-hidden">
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex justify-between items-center py-3 px-4 text-left font-semibold hover:bg-gray-100 transition-all duration-200 text-gray-800"
                >
                  <span>{section}</span>
                  {expandedSection === section ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {/* Section options with smooth height transition */}
                <ul
                  className={`transition-all duration-300 ${
                    expandedSection === section
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                  style={{
                    overflow: "hidden",
                  }}
                >
                  {options.map((option, idx) => (
                    <li
                      key={idx}
                      className="py-2 px-6 cursor-pointer hover:bg-purple-100 text-gray-800 transition-all duration-200"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDropdown;
