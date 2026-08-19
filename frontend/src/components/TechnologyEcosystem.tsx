"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatImageUrl } from "@/utils/image";

export interface BrandProductItem {
  id: string;
  name: string;
  imageUrl: string;
}

export interface BrandPortfolioItem {
  id: string;
  name: string;
  tagline: string;
  logoUrl?: string;
  accentTone: "orange" | "blue" | "red";
  products: BrandProductItem[];
}

const MASTER_BRAND_CATALOG: BrandPortfolioItem[] = [
  {
    id: "one-seven",
    name: "One Seven",
    tagline: "Vehicle Fire Fighting",
    accentTone: "orange",
    products: [
      { id: "os-1", name: "One Seven CAFS Skid Unit", imageUrl: "/products/default-fire-fighting-rescue.png" },
      { id: "os-2", name: "OS Foam Concentrate Matrix", imageUrl: "/products/default-fire-fighting-rescue.png" },
      { id: "os-3", name: "OS Heavy Fire Truck Skid", imageUrl: "/products/default-fire-fighting-rescue.png" },
      { id: "os-4", name: "OS Compressed Air Proportioner", imageUrl: "/products/default-fire-fighting-rescue.png" },
      { id: "os-5", name: "OS High Expansion Nozzle", imageUrl: "/products/default-fire-fighting-rescue.png" }
    ]
  },
  {
    id: "sione",
    name: "SIONE",
    tagline: "Fire Suites & Hoods",
    accentTone: "red",
    products: [
      { id: "sn-1", name: "SIONE Structural Fire Suit", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "sn-2", name: "SIONE Particulate Fire Hood", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "sn-3", name: "SIONE Thermal Safety Boots", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "sn-4", name: "SIONE Close-Proximity Gloves", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "sn-5", name: "SIONE Fire Helmet Shell", imageUrl: "/products/default-respiratory-protection.png" }
    ]
  },
  {
    id: "partech",
    name: "Partech",
    tagline: "Damage Control Items",
    accentTone: "blue",
    products: [
      { id: "pt-1", name: "Partech Emergency Leak Seal Kit", imageUrl: "/products/default-damage-control.png" },
      { id: "pt-2", name: "Partech Hull Breach Shoring Kit", imageUrl: "/products/default-damage-control.png" },
      { id: "pt-3", name: "Partech High-Pressure Pipe Clamp", imageUrl: "/products/default-damage-control.png" },
      { id: "pt-4", name: "Partech Submersible Dewatering Pump", imageUrl: "/products/default-damage-control.png" },
      { id: "pt-5", name: "Partech Magnetic Patch Sealer", imageUrl: "/products/default-damage-control.png" }
    ]
  },
  {
    id: "nardi",
    name: "Nardi Compressor",
    tagline: "Compressors & Air Systems",
    accentTone: "orange",
    products: [
      { id: "nd-1", name: "Nardi Pacific 350 Bar Compressor", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "nd-2", name: "Nardi Cascade Recharging Rack", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "nd-3", name: "Nardi Air Quality Monitor Panel", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "nd-4", name: "Nardi Portable Field Compressor", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "nd-5", name: "Nardi Auto Purge Condensate Trap", imageUrl: "/products/default-respiratory-protection.png" }
    ]
  },
  {
    id: "xshielder",
    name: "Xshielder",
    tagline: "Phones & Ex-Proof Devices",
    accentTone: "blue",
    products: [
      { id: "xs-1", name: "Xshielder Ex-Proof Smartphone", imageUrl: "/products/xshielder-phone.png" },
      { id: "xs-2", name: "Xshielder Hazardous Area Tablet", imageUrl: "/products/xshielder-phone.png" },
      { id: "xs-3", name: "Xshielder Wireless Headset System", imageUrl: "/products/xshielder-phone.png" },
      { id: "xs-4", name: "Xshielder Thermal Imaging Camera", imageUrl: "/products/xshielder-phone.png" },
      { id: "xs-5", name: "Xshielder RFID Asset Reader", imageUrl: "/products/xshielder-phone.png" }
    ]
  },
  {
    id: "mimes",
    name: "Mimes",
    tagline: "Wireless Gas & Fire Systems",
    accentTone: "blue",
    products: [
      { id: "mm-1", name: "Mimes Wireless Toxic Gas Detector", imageUrl: "/products/gas-detector.png" },
      { id: "mm-2", name: "Mimes Wireless Flame Detector", imageUrl: "/products/gas-detector.png" },
      { id: "mm-3", name: "Mimes Ex-Proof Alarm Beacon", imageUrl: "/products/gas-detector.png" },
      { id: "mm-4", name: "Mimes Manual Call Point (MCP)", imageUrl: "/products/gas-detector.png" },
      { id: "mm-5", name: "Mimes Gateway Receiver Station", imageUrl: "/products/gas-detector.png" }
    ]
  },
  {
    id: "atexor",
    name: "Atexor",
    tagline: "Explosion Proof Lights",
    accentTone: "orange",
    products: [
      { id: "ax-1", name: "Atexor Slam Tank LED Light", imageUrl: "/products/default-explosion-proof-products.png" },
      { id: "ax-2", name: "Atexor Ex High-Bay Floodlight", imageUrl: "/products/default-explosion-proof-products.png" },
      { id: "ax-3", name: "Atexor Emergency LED Fitting", imageUrl: "/products/default-explosion-proof-products.png" },
      { id: "ax-4", name: "Atexor Ex Handheld Inspection Lamp", imageUrl: "/products/default-explosion-proof-products.png" },
      { id: "ax-5", name: "Atexor Ex Distribution Transformer", imageUrl: "/products/default-explosion-proof-products.png" }
    ]
  },
  {
    id: "polyhose",
    name: "Polyhose",
    tagline: "Breathing Air Hose",
    accentTone: "blue",
    products: [
      { id: "ph-1", name: "Polyhose High Pressure Air Line", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "ph-2", name: "Polyhose Chemical Transfer Hose", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "ph-3", name: "Polyhose Pneumatic Control Hose", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "ph-4", name: "Polyhose Anti-Static Air Line", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "ph-5", name: "Polyhose Fire Resistant Sleeve Hose", imageUrl: "/products/default-respiratory-protection.png" }
    ]
  },
  {
    id: "key-connections",
    name: "Key Connections",
    tagline: "Breathing Hose Fittings",
    accentTone: "blue",
    products: [
      { id: "kc-1", name: "Key Connections High Pressure Air Hose", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "kc-2", name: "Key Connections Chemical Line", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "kc-3", name: "Key Connections Pneumatic Recoil Hose", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "kc-4", name: "Key Connections Grounded Air Line", imageUrl: "/products/default-respiratory-protection.png" },
      { id: "kc-5", name: "Key Connections Heavy Coupling Assembly", imageUrl: "/products/default-respiratory-protection.png" }
    ]
  },
  {
    id: "cejn",
    name: "CEJN",
    tagline: "Smart Fittings & Couplings",
    accentTone: "orange",
    products: [
      { id: "cj-1", name: "CEJN Breathing Air Quick Coupling", imageUrl: "/products/default-process-instrumentation.png" },
      { id: "cj-2", name: "CEJN High Pressure Hydraulic Nipple", imageUrl: "/products/default-process-instrumentation.png" },
      { id: "cj-3", name: "CEJN Non-Drip Fluid Connector", imageUrl: "/products/default-process-instrumentation.png" },
      { id: "cj-4", name: "CEJN Compressed Air Blowgun", imageUrl: "/products/default-process-instrumentation.png" },
      { id: "cj-5", name: "CEJN Hose Reel Enclosure", imageUrl: "/products/default-process-instrumentation.png" }
    ]
  },
  {
    id: "thermocable",
    name: "Thermo Cable",
    tagline: "Linear Heat Detection Cables",
    accentTone: "red",
    products: [
      { id: "tc-1", name: "Thermo Cable Digital LHD Cable", imageUrl: "/products/default-process-instrumentation.png" },
      { id: "tc-2", name: "Thermo Cable Analogue Thermal Sensor", imageUrl: "/products/default-process-instrumentation.png" },
      { id: "tc-3", name: "Thermo Cable Stainless Steel Braided LHD", imageUrl: "/products/default-process-instrumentation.png" },
      { id: "tc-4", name: "Thermo Cable End of Line Box", imageUrl: "/products/default-process-instrumentation.png" },
      { id: "tc-5", name: "Thermo Cable High Temp 105°C LHD", imageUrl: "/products/default-process-instrumentation.png" }
    ]
  }
];

export default function TechnologyEcosystem() {
  const [brands, setBrands] = useState<BrandPortfolioItem[]>(MASTER_BRAND_CATALOG);
  const [activeBrandId, setActiveBrandId] = useState<string>(MASTER_BRAND_CATALOG[0].id);
  const [activeSlideIndices, setActiveSlideIndices] = useState<Record<string, number>>({});
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Fetch dynamic brands from API and merge cleanly with master catalog
  useEffect(() => {
    async function fetchBrands() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/brands`);
        if (res.ok) {
          const apiBrands = await res.json();
          if (Array.isArray(apiBrands) && apiBrands.length > 0) {
            const mappedApiBrands: BrandPortfolioItem[] = apiBrands.map((b: any) => ({
              id: b.id,
              name: b.name,
              tagline: b.solutionName || b.tagline || "Brand Products",
              logoUrl: b.logoUrl || b.imageUrl || "",
              accentTone: b.accent === "orange" ? "orange" : b.accent === "red" ? "red" : "blue",
              products: (b.products || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                imageUrl: p.imageUrl || "/products/default-fire-fighting-rescue.png"
              }))
            }));

            setBrands(mappedApiBrands);
          }
        }
      } catch (err) {
        console.error("Using master brand catalog fallback:", err);
      }
    }
    fetchBrands();
  }, []);

  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];
  const products = activeBrand?.products || [];
  const activeSlideIndex = activeSlideIndices[activeBrandId] || 0;
  const currentProduct = products[activeSlideIndex] || products[0];

  // Automatic 3-Second (3000ms) Slide Animation Timer
  useEffect(() => {
    if (!products || products.length <= 1) return;

    const timer = setInterval(() => {
      setActiveSlideIndices((prev) => ({
        ...prev,
        [activeBrandId]: ((prev[activeBrandId] || 0) + 1) % products.length,
      }));
    }, 3000); // Exactly 3 seconds timer

    return () => clearInterval(timer);
  }, [activeBrandId, products.length]);

  const handlePrevSlide = () => {
    setActiveSlideIndices((prev) => ({
      ...prev,
      [activeBrandId]: (activeSlideIndex === 0 ? products.length - 1 : activeSlideIndex - 1),
    }));
  };

  const handleNextSlide = () => {
    setActiveSlideIndices((prev) => ({
      ...prev,
      [activeBrandId]: ((activeSlideIndex + 1) % products.length),
    }));
  };

  return (
    <section id="ecosystem" className="relative z-10 w-full border-t border-b border-black/5 py-16 bg-[#F8FAFC]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.06] bg-blue-500 pointer-events-none transition-all duration-700" />

      <div className="max-w-[1400px] mx-auto px-10 max-sm:px-5 w-full relative z-10">
        
        {/* Header Block */}
        <div className="max-w-[780px] mb-14">
          <span className="block mb-3.5 text-orange-600 uppercase font-mono text-[0.75rem] font-bold tracking-widest">
            Eastwind Portfolio
          </span>
          <h2 className="text-[3rem] max-md:text-[2.2rem] mb-5 uppercase font-extrabold tracking-tight leading-none text-slate-900">
            Eastwind Portfolio
          </h2>
          <p className="text-[1.08rem] leading-relaxed m-0 font-medium text-slate-700">
            Select a brand on the left to view its products showcasing with 3-second auto-slide animation.
          </p>
        </div>

        {/* 2-Column Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(340px,0.35fr)_minmax(0,0.65fr)] gap-8.5 items-start">
          
          {/* ================= LEFT SIDE: SCROLLBAR BRAND SELECTION TABS ================= */}
          <aside
            className="portfolio-selector p-4 border border-[#e2e6e3] rounded-[32px] shadow-md sticky top-28 z-10 max-lg:static max-lg:grid max-lg:grid-cols-2 max-lg:gap-2.5 max-sm:grid-cols-1 max-h-[calc(100vh-140px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-orange-500 transition-colors"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9", backgroundColor: "#f2f4f2", borderColor: "#e2e6e3" }}
            aria-label="Brand selection tabs"
          >
            {brands.map((brand) => {
              const isActive = brand.id === activeBrandId;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setActiveBrandId(brand.id)}
                  className={`portfolio-selector-button w-full min-h-[76px] flex items-center justify-between gap-4 p-4 rounded-2xl cursor-pointer text-left transition-all duration-180 max-lg:mb-0 ${
                    isActive
                      ? "border border-slate-300 bg-white shadow-sm translate-y-0"
                      : "border border-transparent bg-transparent hover:bg-slate-200/50 hover:-translate-y-[1px]"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {brand.logoUrl && brand.logoUrl.trim() !== "" && (
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                        <img 
                          src={formatImageUrl(brand.logoUrl)} 
                          alt={brand.name} 
                          onError={(e) => {
                            const parent = (e.currentTarget as HTMLElement).parentElement;
                            if (parent) parent.style.display = "none";
                          }}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className={`block text-[1rem] font-extrabold tracking-normal ${
                        isActive ? "text-slate-900 font-black" : "text-slate-700 font-bold"
                      }`}>
                        {brand.name}
                      </span>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`w-2.5 h-2.5 rounded-full ${
                      isActive ? "bg-orange-600" : "bg-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </aside>

          {/* ================= RIGHT SIDE: CARD WITH ONLY PRODUCT IMAGE & PRODUCT NAME ================= */}
          <div 
            style={{ backgroundColor: "#f2f4f2", borderColor: "#e2e6e3" }}
            className="border border-[#e2e6e3] rounded-[32px] overflow-hidden p-6 max-sm:p-4 shadow-md"
          >
            {/* White / Light Blue Shade Card Container */}
            <div className="product-visual min-h-[440px] max-sm:min-h-[340px] rounded-[28px] border border-[#e2e6e3] bg-gradient-to-br from-[#f8faf8] via-[#f2f4f2] to-[#eaeaea] relative overflow-hidden flex flex-col justify-between p-8 max-sm:p-6 shadow-sm text-slate-900">
              
              {/* Ambient Glow inside light card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] opacity-[0.12] bg-blue-500 pointer-events-none transition-all duration-700" />
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

              {/* CENTER SLIDE DISPLAY: ONLY PRODUCT IMAGE & PRODUCT NAME */}
              <div className="relative z-10 flex-grow flex items-center justify-center my-6">
                <AnimatePresence mode="wait">
                  {currentProduct && (
                    <motion.div
                      key={`${activeBrandId}-${activeSlideIndex}`}
                      initial={{ opacity: 0, x: 45, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -45, scale: 0.96 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <Link
                        href={`/products?brand=${encodeURIComponent(activeBrand.name)}&id=${encodeURIComponent(currentProduct.id)}`}
                        className="flex flex-col items-center justify-center text-center space-y-6 max-w-lg cursor-pointer group/card no-underline"
                      >
                        {/* 1. PRODUCT IMAGE */}
                        <div className="h-[230px] max-sm:h-[170px] flex items-center justify-center">
                          <img 
                            src={formatImageUrl(currentProduct?.imageUrl, "/products/default-fire-fighting-rescue.png")} 
                            alt={currentProduct?.name || "Product Image"} 
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/products/default-fire-fighting-rescue.png";
                            }}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(30,62,143,0.18)] transition-transform duration-500 group-hover/card:scale-105 select-none"
                          />
                        </div>

                        {/* 2. PRODUCT NAME ONLY */}
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-mono px-6 py-2.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-md text-center max-w-full group-hover/card:border-orange-500 group-hover/card:text-orange-600 transition-colors">
                          {currentProduct.name}
                        </h3>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              {/* Bottom Bar Controls & Slide Indicators */}
              <div className="relative z-10 w-full pt-4 border-t border-slate-200/80 flex items-center justify-between">
                {/* Dots indicator */}
                <div className="flex items-center gap-2">
                  {products.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlideIndices((prev) => ({ ...prev, [activeBrandId]: idx }))}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === activeSlideIndex ? "w-8 bg-blue-600 shadow-sm" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200 shadow-sm"
                    title="Previous Product"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200 shadow-sm"
                    title="Next Product"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
