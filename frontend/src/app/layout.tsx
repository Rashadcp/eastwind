// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eastwind Energy Arabia | Industrial Digitalization & Critical Safety Infrastructure",
  description: "Fusing Industrial Digitalization, Edge Wireless Data Acquisition, Predictive AI Analytics, Intrinsically Safe Mobility, and Fire & Rescue Engineering across the Middle East.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${geistMono.variable}`}>
      {/* FIXED: Changed overflow-x-hidden to overflow-x-clip so child containers can lock into sticky position */}
      <body className="relative min-h-screen bg-[#080c14] overflow-x-clip w-full max-w-full">
        {children}
      </body>
    </html>
  );
}