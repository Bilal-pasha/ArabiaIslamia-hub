"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "@arabiaaislamia/ui";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/utils/axios-instance";
import { Avatar, AvatarFallback } from "@arabiaaislamia/ui";
import { protectedRoutes, publicRoutes } from "@/utils/routes";

type ButtonName = "Home" | "Class" | "Work" | "Registration" | "Sign Out";

interface ButtonStyles {
  [key: string]: React.CSSProperties;
}

const BUTTON_NAMES: ButtonName[] = [
  "Home",
  "Class",
  // "Work",
  "Registration",
  "Sign Out",
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState<ButtonName>("Home");
  const [buttonStyles, setButtonStyles] = useState<ButtonStyles>({});
  const buttonRefs = useRef<Record<ButtonName, HTMLButtonElement | null>>(
    {} as Record<ButtonName, HTMLButtonElement | null>
  );
  const { user } = useAuth();

  useEffect(() => {
    const getButtonNameFromPath = (path: string): ButtonName => {
      if (path.startsWith(protectedRoutes.CLASS)) return "Class";
      if (path.startsWith(protectedRoutes.WORK)) return "Work";
      if (path.startsWith(protectedRoutes.REGISTRATION)) return "Registration";
      return "Home";
    };

    const newActiveButton = getButtonNameFromPath(pathname);
    setActiveButton(newActiveButton);
  }, [pathname]);

  useEffect(() => {
    if (activeButton) {
      const activeButtonRef = buttonRefs.current[activeButton];
      if (activeButtonRef) {
        setButtonStyles({
          [activeButton]: {
            width: `${activeButtonRef.offsetWidth}px`,
            height: `${activeButtonRef.offsetHeight}px`,
            transform: `translateX(${activeButtonRef.offsetLeft - 9}px)`,
          },
        });
      }
    }
  }, [activeButton]);

  const handleClick = async (buttonName: ButtonName) => {
    if (buttonName === "Sign Out") {
      try {
        await apiClient.post("/api/auth/logout");
        toast.success("Signed Out Successfully");
        window.location.href = publicRoutes.AUTH_SIGN_IN;
      } catch {
        toast.error("Failed to sign out");
      }
    } else {
      setActiveButton(buttonName);
    }
  };

  const getHref = (buttonName: ButtonName) => {
    switch (buttonName) {
      case "Home":
        return protectedRoutes.HOME;
      case "Class":
        return "/class";
      case "Work":
        return "/work";
      case "Registration":
        return "/registration";
      default:
        return "/";
    }
  };
  return (
    <header
      className={`w-full flex justify-center py-6 lg:sticky lg:top-0 top-auto bottom-0 fixed z-10 ${pathname === publicRoutes.AUTH_SIGN_IN ? "hidden" : ""
        }`}
    >
      <div className="w-full flex px-8 items-center justify-between py-6">
        <div></div>
        <nav className="relative px-2 py-2 bg-[#714620fa] space-x-2 rounded-full shadow-lg">
          <div
            className="absolute bottom-2 bg-yellow-700 rounded-full transition-all duration-500 ease-in-out"
            style={{
              height: buttonStyles[activeButton]?.height || "0",
              width: buttonStyles[activeButton]?.width || "0",
              transform:
                buttonStyles[activeButton]?.transform || "translateX(0)",
            }}
          />
          {BUTTON_NAMES.map((buttonName) => (
            <Link key={buttonName} href={getHref(buttonName)}>
              <Button
                buttonName={buttonName}
                isActive={activeButton === buttonName}
                onClick={() => handleClick(buttonName)}
                ref={(el) => {
                  buttonRefs.current[buttonName] = el;
                }}
              />
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex">
          <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary-100 text-primary-600 text-sm font-medium">
                {user?.username?.slice(0, 1).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
        </div>
      </div>
    </header>
  );
};

interface ButtonProps {
  buttonName: ButtonName;
  isActive: boolean;
  onClick: () => void;
  ref: React.Ref<HTMLButtonElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ buttonName, isActive, onClick }, ref) => (
    <button
      ref={ref}
      className={`relative px-3 md:px-6 py-2 rounded-full font-semibold text-xs mg:text-sm ${isActive ? "text-white" : "text-white hover:bg-amber-700"
        } transition-all duration-300 ease-in-out ${buttonName === "Sign Out"
          ? "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-red-500/50"
          : ""
        }`}
      onClick={onClick}
    >
      {buttonName}
    </button>
  )
);

Button.displayName = "Button";

export default Navbar;
