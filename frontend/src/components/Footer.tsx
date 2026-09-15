"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatImageUrl } from "@/utils/image";
import { cachedFetch } from "@/utils/apiCache";

interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLocation {
  title: string;
  address: string;
}

interface FooterData {
  logoUrl: string;
  tagline: string;
  badgeText: string;
  solutionsTitle: string;
  operationsTitle: string;
  locations: FooterLocation[];
  hqTitle: string;
  hqAddress: string;
  hubTitle: string;
  hubAddress: string;
  telephone: string;
  email: string;
  copyright: string;
  solutionsLinks: FooterLink[];
  bottomLinks: FooterLink[];
}

const DEFAULT_FOOTER: FooterData = {
  logoUrl: "/blue logo (3).png",
  tagline: "Sales, renting, and servicing of world-class safety products and engineered solutions for the Marine, Oil & Gas, Petrochemical, and Civil Defense sectors.",
  badgeText: "Certified Marine & Industrial Safety Partner",
  solutionsTitle: "Safety Solutions",
  operationsTitle: "Operations",
  locations: [
    {
      title: "Dammam, Kingdom of Saudi Arabia",
      address: "P14, 2nd Industrial City, Dammam\nKingdom of Saudi Arabia"
    },
    {
      title: "Riyadh Technology Hub",
      address: "Olaya District, Riyadh, Kingdom of Saudi Arabia"
    }
  ],
  hqTitle: "Al Khobar Headquarters",
  hqAddress: "King Faisal West Road, Bandariyah District, Al Khobar, Kingdom of Saudi Arabia",
  hubTitle: "Riyadh Technology Hub",
  hubAddress: "Olaya District, Riyadh, Kingdom of Saudi Arabia",
  telephone: "+966 570 833 214",
  email: "enquiry@eastwind.sa",
  copyright: `© ${new Date().getFullYear()} East Wind Safety. All rights reserved. Premium Safety Products & Solutions Integrator.`,
  solutionsLinks: [],
  bottomLinks: [
    { name: "Privacy Policy", href: "/privacy-policy" }
  ]
};

export default function Footer() {
  const [footer, setFooter] = useState<FooterData>(DEFAULT_FOOTER);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // 1. Fetch dynamic contact settings and footer document with real-time cache-busting
        const list = await cachedFetch<any[]>(`${baseUrl}/api/contact-settings?t=${Date.now()}`, { fallback: [], cache: "no-store" });
        if (Array.isArray(list) && list.length > 0) {
          const footerDoc = list.find((item: any) => item.id === "footer");
          const contactDoc = list.find((item: any) => item.id === "contact_info");

          // Determine locations
          let locs: FooterLocation[] = [];
          if (footerDoc?.locations && Array.isArray(footerDoc.locations)) {
            locs = footerDoc.locations.filter((l: any) => (l.title && l.title.trim()) || (l.address && l.address.trim()));
          } else if (contactDoc) {
            const hqT = contactDoc.hqTitle;
            const hqA = contactDoc.hqAddress;
            const hubT = contactDoc.hubTitle;
            const hubA = contactDoc.hubAddress;
            if (hqT?.trim() || hqA?.trim()) locs.push({ title: hqT || "", address: hqA || "" });
            if (hubT?.trim() || hubA?.trim()) locs.push({ title: hubT || "", address: hubA || "" });
          }

          setFooter({
            logoUrl: footerDoc?.logoUrl || "/logo.png",
            tagline: typeof footerDoc?.tagline === "string" && footerDoc.tagline.trim() ? footerDoc.tagline : DEFAULT_FOOTER.tagline,
            badgeText: typeof footerDoc?.badgeText === "string" ? footerDoc.badgeText : DEFAULT_FOOTER.badgeText,
            solutionsTitle: "",
            operationsTitle: typeof footerDoc?.operationsTitle === "string" && footerDoc.operationsTitle.trim() ? footerDoc.operationsTitle : DEFAULT_FOOTER.operationsTitle,
            locations: locs,
            hqTitle: locs[0]?.title || footerDoc?.hqTitle || contactDoc?.hqTitle || DEFAULT_FOOTER.hqTitle,
            hqAddress: locs[0]?.address || footerDoc?.hqAddress || contactDoc?.hqAddress || DEFAULT_FOOTER.hqAddress,
            hubTitle: locs[1]?.title || footerDoc?.hubTitle || contactDoc?.hubTitle || DEFAULT_FOOTER.hubTitle,
            hubAddress: locs[1]?.address || footerDoc?.hubAddress || contactDoc?.hubAddress || DEFAULT_FOOTER.hubAddress,
            telephone: footerDoc?.telephone || contactDoc?.telephone || DEFAULT_FOOTER.telephone,
            email: footerDoc?.email || contactDoc?.email || DEFAULT_FOOTER.email,
            copyright: typeof footerDoc?.copyright === "string" ? footerDoc.copyright : DEFAULT_FOOTER.copyright,
            solutionsLinks: [],
            bottomLinks: Array.isArray(footerDoc?.bottomLinks)
              ? footerDoc.bottomLinks
              : DEFAULT_FOOTER.bottomLinks
          });
        }
      } catch (err) {
        console.error("Footer dynamic data fetch fallback:", err);
      }
    }

    fetchFooterData();

    const handleCacheCleared = () => fetchFooterData();
    window.addEventListener("cms-cache-cleared", handleCacheCleared);
    return () => window.removeEventListener("cms-cache-cleared", handleCacheCleared);
  }, []);

  return (
    <footer className="w-full bg-white/95 backdrop-blur-3xl border-t border-white/90 rounded-none py-14 sm:py-16 px-6 sm:px-10 relative overflow-hidden mt-0 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.85),0_-20px_50px_-15px_rgba(15,23,42,0.05)] z-10">
      {/* High-Tech Industrial Grid Backdrop Overlay */}
      <div className="industrial-grid absolute inset-0 opacity-[0.02] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 relative z-10 items-start">
        
        {/* Column 1: Brand & Mission (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-start justify-start">
          <div className="h-10 flex items-center mb-4">
            <Link href="/" className="inline-block">
              <img
                src={formatImageUrl(footer.logoUrl, "/blue logo (3).png")}
                alt="East Wind"
                className="h-10 sm:h-11 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo.png";
                }}
              />
            </Link>
          </div>
          <p 
            className="text-[0.88rem] text-slate-500 max-w-[360px] leading-relaxed m-0 font-normal"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            {footer.tagline && footer.tagline.trim() ? footer.tagline : DEFAULT_FOOTER.tagline}
          </p>
        </div>

        {/* Column 2: Operations & Hubs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-start justify-start">
          <div className="h-10 flex items-center mb-4">
            <span 
              className="text-slate-900 uppercase text-[0.75rem] font-bold tracking-[0.25em]"
              style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
            >
              {footer.operationsTitle || "Operations"}
            </span>
          </div>
          
          <div className="flex flex-col gap-5 w-full">
            {(Array.isArray(footer.locations) ? footer.locations : [
              { title: footer.hqTitle, address: footer.hqAddress },
              { title: footer.hubTitle, address: footer.hubAddress }
            ]).filter(l => (l.title && l.title.trim()) || (l.address && l.address.trim())).map((loc, locIdx) => {
              const isBlue = locIdx % 2 === 0;
              return (
                <div key={locIdx} className="flex gap-3.5 items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isBlue ? "bg-blue-50 border border-blue-100" : "bg-red-50 border border-red-100"} shadow-xs shrink-0 mt-0.5`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={isBlue ? "text-[#1e3e8f]" : "text-[#c22026]"}>
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    {loc.title && (
                      <strong className="text-slate-900 block mb-0.5 text-[0.88rem] font-semibold" style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}>
                        {loc.title}
                      </strong>
                    )}
                    {loc.address && (
                      <span style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }} className="leading-relaxed font-normal text-slate-500 block text-[0.82rem] whitespace-pre-line">
                        {loc.address}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Direct Contact / Communications (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-start justify-start lg:border-l lg:border-slate-100 lg:pl-8">
          <div className="h-10 flex items-center mb-4">
            <span 
              className="text-slate-900 uppercase text-[0.75rem] font-bold tracking-[0.25em]"
              style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
            >
              Direct Contact
            </span>
          </div>

          <div className="flex flex-col gap-5 w-full">
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-50 border border-red-100 shadow-xs shrink-0 mt-0.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#c22026]">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5 text-[0.88rem] font-semibold" style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}>
                  Contact Portal
                </strong>
                <span style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }} className="leading-relaxed font-normal text-slate-500 block text-[0.82rem]">
                  Email: <a href={`mailto:${footer.email}`} className="text-[#c22026] hover:text-[#1e3e8f] transition-colors duration-300 no-underline font-medium">{footer.email}</a><br />
                  Tel: {footer.telephone}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal Section */}
      <div className="max-w-[1400px] mx-auto pt-10 border-t border-slate-200/50 flex flex-wrap justify-between items-center gap-6 text-[0.8rem] text-slate-500 relative z-10">
        <div style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }} className="font-light">
          {footer.copyright}
        </div>
        <div className="flex gap-6">
          {footer.bottomLinks.map((link, idx) => (
            <Link 
              key={idx}
              href={link.href} 
              className="group/lnk text-slate-650 hover:text-[#c22026] no-underline transition-colors duration-300 flex items-center font-normal text-[0.88rem]"
              style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
            >
              <span className="inline-block transition-all duration-300 transform -translate-x-1 opacity-0 group-hover/lnk:translate-x-0 group-hover/lnk:opacity-100 mr-1 text-[#c22026] font-bold text-[0.9rem] leading-none">
                ›
              </span>
              <span className="transition-transform duration-300 group-hover/lnk:translate-x-1">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}