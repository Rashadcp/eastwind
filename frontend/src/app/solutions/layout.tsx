import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrated Safety Solutions & Turnkey Systems | Eastwind Safety Arabia",
  description:
    "End-to-end engineered safety solutions including wireless gas telemetry, temporary refuge chambers, CAFS tank farm systems, and digital mobility platforms.",
  alternates: {
    canonical: "/solutions",
  },
  openGraph: {
    title: "Integrated Industrial Safety Solutions | Eastwind Safety Arabia",
    description:
      "Engineered systems integrating ATEX hardware, real-time wireless telemetry, and HCIS-compliant plant monitoring across Saudi Arabia.",
    url: "/solutions",
    siteName: "Eastwind Energy Arabia",
    locale: "en_US",
    type: "website",
  },
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
