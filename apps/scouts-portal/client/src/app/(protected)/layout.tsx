import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { SessionWrapper } from "@/components/SessionWrapper/SessionWrapper";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Suspense } from "react";
import { FallBackComponent } from "@/components/FallBackComponent/FallBackComponent";
// import FullScreenPoster from "@/components/FullScreenPoster/FullScreenPoster";
import { MadrasaRegistrationProvider } from "@/context/useMadrasaRegistrationContext";
import FullScreenPoster from "@/components/FullScreenPoster/FullScreenPoster";
export const metadata: Metadata = {
  title: "Inter Deeni Madaris Scouts Camp 2024",
  description:
    "Scouts Camp 2024 Organized by Jamia Arabia Islamia Scout Coloney",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="protected-class animate">
          <MadrasaRegistrationProvider>
            <Suspense fallback={<FallBackComponent />}>
              <SessionWrapper>
                <Toaster position="top-right" />
                <Sidebar />
                {/* <FullScreenPoster /> Add the FullScreenPoster here */}
                <main className="lg:ml-64 min-h-screen bg-gray-50">
                  {children}
                </main>
              </SessionWrapper>
            </Suspense>
          </MadrasaRegistrationProvider>
        </div>
      </body>
    </html>
  );
}
