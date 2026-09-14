import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Services & Maintenance Support | Eastwind Safety Arabia",
  description:
    "Turnkey lifecycle services including system integration, functional safety audits, equipment calibration, breathing air cascade maintenance, and onsite safety support.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Safety Engineering & Maintenance Services | Eastwind Safety Arabia",
    description:
      "Expert safety engineering, calibration, compliance auditing, and emergency support throughout the Kingdom of Saudi Arabia.",
    url: "/services",
    siteName: "Eastwind Energy Arabia",
    locale: "en_US",
    type: "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
