"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/utils/axios-instance";
import { Avatar } from "../Avatar/Avatar";
import Image from "next/image";
import { protectedRoutes, publicRoutes } from "@/utils/routes";
import {
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  MapIcon,
  CalendarDaysIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import scoutsImage from "/public/assets/signinLogo.png";

type ButtonName = "Home" | "Intro And Services" | "Guidelines" | "Camping Guide" | "Schedule" | "Gallery" | "Registration" | "Sign Out";

interface SidebarItem {
  name: ButtonName;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: "Home",
    icon: HomeIcon,
    href: protectedRoutes.HOME,
  },
  {
    name: "Intro And Services",
    icon: InformationCircleIcon,
    href: protectedRoutes.INTRO,
  },
  {
    name: "Guidelines",
    icon: ExclamationTriangleIcon,
    href: protectedRoutes.IMPORTANT_INSTRUCTIONS,
  },
  {
    name: "Camping Guide",
    icon: MapIcon,
    href: protectedRoutes.INSTRUCTION_ABOUT_CAMPING,
  },
  {
    name: "Schedule",
    icon: CalendarDaysIcon,
    href: protectedRoutes.SCHEDULE,
  },
  {
    name: "Gallery",
    icon: PhotoIcon,
    href: protectedRoutes.GALLERY,
  },
  {
    name: "Registration",
    icon: UserPlusIcon,
    href: "/registration",
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState<ButtonName>("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const getButtonNameFromPath = (path: string): ButtonName => {
      if (path.startsWith(protectedRoutes.REGISTRATION)) return "Registration";
      if (path.startsWith(protectedRoutes.INTRO)) return "Intro And Services";
      if (path.startsWith(protectedRoutes.IMPORTANT_INSTRUCTIONS)) return "Guidelines";
      if (path.startsWith(protectedRoutes.INSTRUCTION_ABOUT_CAMPING)) return "Camping Guide";
      if (path.startsWith(protectedRoutes.SCHEDULE)) return "Schedule";
      if (path.startsWith(protectedRoutes.GALLERY)) return "Gallery";
      return "Home";
    };

    const newActiveButton = getButtonNameFromPath(pathname);
    setActiveButton(newActiveButton);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await apiClient.post("/api/auth/logout");
      toast.success("Signed Out Successfully");
      window.location.href = publicRoutes.AUTH_SIGN_IN;
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const handleItemClick = (buttonName: ButtonName) => {
    setActiveButton(buttonName);
    setIsMobileMenuOpen(false); // Close mobile menu on item click
  };

  if (pathname === publicRoutes.AUTH_SIGN_IN) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-green-700 text-white rounded-lg shadow-lg hover:bg-green-800 transition-colors"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r-2 border-green-200 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b-2 border-green-200 bg-white flex justify-center">
            <Link href={protectedRoutes.HOME}>
              <Image
                src={scoutsImage}
                alt="Scouts Camp Logo"
                width={300}
                height={120}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeButton === item.name;

              return (
                <Link key={item.name} href={item.href}>
                  <button
                    onClick={() => handleItemClick(item.name)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${isActive
                        ? "bg-green-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                      }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t-2 border-green-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-red-500/50"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
