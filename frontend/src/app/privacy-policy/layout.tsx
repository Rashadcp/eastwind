import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection | Eastwind Safety Arabia",
  description:
    "Official Privacy Policy of East Wind Safety Integrator. Learn how we handle corporate and technical data in strict compliance with Saudi Personal Data Protection Law (PDPL) and HCIS standards.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy & Data Protection | Eastwind Safety Arabia",
    description:
      "Official data governance and privacy policies of East Wind Safety under Saudi Personal Data Protection Law (PDPL).",
    url: "/privacy-policy",
    siteName: "Eastwind Energy Arabia",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
