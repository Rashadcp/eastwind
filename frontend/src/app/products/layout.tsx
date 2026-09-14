import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial Safety Products & Certified Equipment | Eastwind Safety Arabia",
  description:
    "Explore our comprehensive catalog of ATEX/IECEx certified safety equipment, wireless gas detectors, breathing air cascades, CAFS systems, and explosion-proof mobility devices.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Industrial Safety Products Catalog | Eastwind Safety Arabia",
    description:
      "Engineered life-safety products, explosion-proof gear, and emergency response instrumentation certified for high-risk industrial facilities in KSA.",
    url: "/products",
    siteName: "Eastwind Energy Arabia",
    locale: "en_US",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
