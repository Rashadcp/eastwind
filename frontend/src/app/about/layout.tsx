import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Mission-Critical Safety Infrastructure | Eastwind Safety Arabia",
  description:
    "East Wind is a specialized safety solutions integrator in Saudi Arabia, delivering lifecycle engineering, ATEX/IECEx certified packages, and advanced cyber-physical safety technologies.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Eastwind Safety Arabia",
    description:
      "Mission-critical industrial safety engineering, functional safety loops, and emergency response solutions across the Kingdom of Saudi Arabia.",
    url: "/about",
    siteName: "Eastwind Energy Arabia",
    locale: "en_US",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
