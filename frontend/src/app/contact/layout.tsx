import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Regional Offices | Eastwind Safety Arabia",
  description:
    "Get in touch with East Wind Safety engineering specialists. Offices in Al Khobar and Riyadh. Contact us for requests for quotation, system integration inquiries, or technical support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Eastwind Safety Arabia",
    description:
      "Connect with our certified safety engineers in Saudi Arabia for project RFQs, site assessments, and equipment inquiries.",
    url: "/contact",
    siteName: "Eastwind Energy Arabia",
    locale: "en_US",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
