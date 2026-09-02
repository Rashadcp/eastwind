// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eastwind Energy Arabia | Industrial Digitalization & Critical Safety Infrastructure",
  description: "Fusing Industrial Digitalization, Edge Wireless Data Acquisition, Predictive AI Analytics, Intrinsically Safe Mobility, and Fire & Rescue Engineering across the Middle East.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      {/* FIXED: Changed overflow-x-hidden to overflow-x-clip so child containers can lock into sticky position */}
      <body className="relative min-h-screen bg-[#080c14] overflow-x-clip w-full max-w-full">
        {children}
      </body>
    </html>
  );
}