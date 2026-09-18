// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-admin",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eastwind.sa";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Eastwind Energy Arabia | Industrial Digitalization & Critical Safety Infrastructure",
    template: "%s | Eastwind Energy Arabia",
  },
  description:
    "Fusing Industrial Digitalization, Edge Wireless Data Acquisition, Predictive AI Analytics, Intrinsically Safe Mobility, and Fire & Rescue Engineering across the Kingdom of Saudi Arabia and the Middle East.",
  keywords: [
    "industrial safety Saudi Arabia",
    "ATEX Zone 1",
    "IECEx equipment",
    "wireless gas detection",
    "CAFS firefighting systems",
    "intrinsically safe mobility",
    "HCIS compliance",
    "temporary refuge shelters",
    "Eastwind Energy Arabia",
    "East Wind Safety",
  ],
  authors: [{ name: "East Wind Safety Integrator" }],
  creator: "East Wind Safety Integrator",
  publisher: "Eastwind Energy Arabia",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Eastwind Energy Arabia",
    title: "Eastwind Energy Arabia | Industrial Digitalization & Safety",
    description:
      "Specialized life safety engineering, wireless telemetry, ATEX instrumentation, and industrial safety integration in Saudi Arabia.",
    images: [
      {
        url: "/logo.png",
        width: 600,
        height: 600,
        alt: "Eastwind Energy Arabia Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eastwind Energy Arabia | Critical Safety Infrastructure",
    description:
      "Industrial digitalization, wireless gas detection, and emergency firefighting systems in KSA.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Eastwind Energy Arabia",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  telephone: "+966 570 833 214",
  email: "enquiry@eastwind.sa",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dammam",
    addressRegion: "Eastern Province",
    addressCountry: "SA",
  },
  sameAs: [],
};

import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      {/* FIXED: Changed overflow-x-hidden to overflow-x-clip so child containers can lock into sticky position */}
      <body className="relative min-h-screen bg-[#080c14] overflow-x-clip w-full max-w-full" suppressHydrationWarning>
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}