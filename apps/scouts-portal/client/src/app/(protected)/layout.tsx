import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@arabiaaislamia/ui";
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
      <body className="overflow-x-hidden">
        <div className="protected-class animate w-full min-w-0 overflow-x-hidden">
          <MadrasaRegistrationProvider>
            <Suspense fallback={<FallBackComponent />}>
              <SessionWrapper>
                <Toaster position="top-right" richColors />
                <Sidebar />
                {/* <FullScreenPoster /> Add the FullScreenPoster here */}
                <main className="lg:ml-64 min-h-screen w-full min-w-0 overflow-x-hidden bg-gray-50 p-4 sm:p-6">
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
