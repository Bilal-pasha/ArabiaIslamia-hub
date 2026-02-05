import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@arabiaaislamia/ui";
import { SessionWrapper } from "@/components/SessionWrapper/SessionWrapper";
import { Providers } from "@/components/Providers";
import { Suspense } from "react";
import { FallBackComponent } from "@/components/FallBackComponent/FallBackComponent";
import "react-responsive-carousel/lib/styles/carousel.css";

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
      <body className="bg-white">
        <Providers>
          <Suspense fallback={<FallBackComponent />}>
            <SessionWrapper>
              <Toaster position="top-right" richColors />
              {children}
            </SessionWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
