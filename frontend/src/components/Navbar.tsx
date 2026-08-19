"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { formatImageUrl } from "@/utils/image";
import { productsDb } from "@/data/productsData";

type AccordionKey = "applications" | "services" | "solutions";

interface NavItem {
  name: string;
  href: string;
}

interface SolutionItem {
  name: string;
  href: string;
  imageUrl?: string;
  brand?: string;
  category?: string;
}

interface SolutionCategory {
  id: string;
  name: string;
  href: string;
  description: string;
  accent: string;
  items: SolutionItem[];
}

export default function Navbar() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<AccordionKey | null>(null);
  const [solutionsExpanded, setSolutionsExpanded] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);
  
  const [mobileAccordions, setMobileAccordions] = useState<Record<AccordionKey, boolean>>({
    applications: false,
    services: false,
    solutions: false,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setSolutionsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showTransparent = isHomepage && !isScrolled;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const getHeroThreshold = () => window.innerHeight * 0.5;
    const initialThreshold = isHomepage ? getHeroThreshold() : 18;
    let localIsScrolled = lastScrollY > initialThreshold;
    let localIsVisible = true;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroThreshold = getHeroThreshold();
      const threshold = isHomepage ? heroThreshold : 18;

      const nextScrolled = currentScrollY > threshold;
      if (nextScrolled !== localIsScrolled) {
        localIsScrolled = nextScrolled;
        setIsScrolled(nextScrolled);
      }

      let nextVisible = localIsVisible;
      if (mobileMenuOpen) {
        nextVisible = true;
      } else if (isHomepage && currentScrollY <= heroThreshold) {
        nextVisible = true;
      } else if (currentScrollY <= 50) {
        nextVisible = true;
      } else if (currentScrollY > lastScrollY) {
        nextVisible = false; 
      } else {
        nextVisible = true; 
      }

      if (nextVisible !== localIsVisible) {
        localIsVisible = nextVisible;
        setIsVisible(nextVisible);
      }

      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen, isHomepage]);

  const toggleMobileAccordion = (key: AccordionKey) => {
    setMobileAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Dynamic Solution Categories & Category Products from Admin CMS & Products API
  useEffect(() => {
    async function fetchDynamicCategories() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        // 1. Fetch products catalog (with 1.5s timeout signal + static fallback)
        let productsCatalog: any[] = [];
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1500);
          const prodsRes = await fetch(`${baseUrl}/api/products`, { cache: "no-store", signal: controller.signal });
          clearTimeout(timeoutId);
          if (prodsRes.ok) {
            productsCatalog = await prodsRes.json();
          }
        } catch (e) {
          console.warn("Failed or timed out fetching products catalog for navbar:", e);
        }

        if (!Array.isArray(productsCatalog) || productsCatalog.length === 0) {
          productsCatalog = productsDb;
        }

        // 2. Fetch solutions page configuration (with 1.5s timeout signal)
        try {
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 1500);
          const res = await fetch(`${baseUrl}/api/solutions-page`, { cache: "no-store", signal: controller2.signal });
          clearTimeout(timeoutId2);
          if (res.ok) {
            const data = await res.json();
          if (data && Array.isArray(data.industries) && data.industries.length > 0) {
            const dynamicCategories: SolutionCategory[] = data.industries.map((ind: any) => {
              let catItems: SolutionItem[] = [];

              // Extract custom sub-items or products from Admin
              if (Array.isArray(ind.items) && ind.items.length > 0) {
                catItems = ind.items.map((itemObj: any) => {
                  if (typeof itemObj === "string") {
                    return { name: itemObj, href: `/solutions/${ind.id}` };
                  }
                  return {
                    name: itemObj.name || itemObj.title || "Category Product",
                    href: itemObj.href || `/solutions/${ind.id}`,
                    imageUrl: itemObj.imageUrl || "",
                    brand: itemObj.brand || ""
                  };
                });
              } else if (typeof ind.items === "string" && ind.items.trim()) {
                catItems = ind.items.split(",").map((s: string) => ({ name: s.trim(), href: `/solutions/${ind.id}` }));
              }

              // Match real hardware products from productsCatalog by category or solution relevance
              let matchingProds = productsCatalog.filter((p: any) => {
                const catLower = (p.category || "").toLowerCase();
                const nameLower = (p.name || "").toLowerCase();
                const indId = (ind.id || "").toLowerCase();
                const indName = (ind.name || "").toLowerCase();

                if (indId.includes("oil") || indName.includes("oil")) {
                  return catLower.includes("gas") || catLower.includes("instrumentation") || /gas|detector|transmitter|wireless|tank|foam/i.test(nameLower);
                }
                if (indId.includes("petro") || indName.includes("petro") || indId.includes("smart") || indName.includes("facilities")) {
                  return catLower.includes("process") || catLower.includes("explosion") || /transmitter|flow|skid|analyzer|instrument|ai|smart|gas|detector/i.test(nameLower);
                }
                if (indId.includes("civil") || indName.includes("civil")) {
                  return catLower.includes("fire") || catLower.includes("respiratory") || /truck|foam|cafs|suit|hood|scba|rescue|fire/i.test(nameLower);
                }
                if (indId.includes("marine") || indName.includes("marine")) {
                  return catLower.includes("explosion") || catLower.includes("respiratory") || /leak|shoring|chamber|cascade|air|hull|marine/i.test(nameLower);
                }
                if (indId.includes("util") || indName.includes("power")) {
                  return catLower.includes("process") || catLower.includes("wireless") || /swas|sampling|wireless|converter|power|grid/i.test(nameLower);
                }
                if (indId.includes("defense") || indName.includes("security")) {
                  return catLower.includes("respiratory") || catLower.includes("fire") || /shelter|telemetry|cyber|guard|blast|cbrn/i.test(nameLower);
                }
                return false;
              });

              // Ensure at least 3-5 products per category
              if (matchingProds.length < 3 && productsCatalog.length > 0) {
                const extra = productsCatalog.filter((p: any) => !matchingProds.some((m: any) => m.id === p.id));
                matchingProds = [...matchingProds, ...extra.slice(0, 4 - matchingProds.length)];
              }

              // Map matched products to SolutionItem format
              const productItems: SolutionItem[] = matchingProds.map((p: any) => ({
                name: p.name,
                href: `/products?id=${encodeURIComponent(p.id)}`,
                imageUrl: p.imageUrl,
                brand: p.brand || p.category,
                category: p.category
              }));

              const mergedItems = [...catItems, ...productItems];
              const finalItems = mergedItems.length > 0 ? mergedItems : [{ name: `${ind.name} Core Systems`, href: `/solutions/${ind.id}` }];

              return {
                id: ind.id,
                name: ind.name,
                href: `/solutions?cat=${encodeURIComponent(ind.id)}`,
                description: ind.description || ind.riskKicker || "High-compliance industry solution",
                accent: ind.accent || "#1e3e8f",
                items: finalItems
              };
            });

            setCategoriesList(dynamicCategories);
          }
        }
        } catch (err2) {
          console.warn("Failed or timed out fetching solutions-page for navbar:", err2);
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic navbar categories:", err);
      }
    }
    fetchDynamicCategories();
  }, []);

  // 6 Solution Categories matching website domain diagram:
  // 6 Solution Categories matching website domain specification:
  // 1. Civil Defence
  // 2. Smart Industrial Facilities
  // 3. Oil and Gas
  // 4. Marine Operations
  // 5. Utilities and Power
  // 6. Defence and Border Security
  const [categoriesList, setCategoriesList] = useState<SolutionCategory[]>([
    {
      id: "civil-defence",
      name: "Civil Defence",
      href: "/solutions?cat=civil-defence",
      description: "Metropolitan Safety Infrastructure & Emergency Response",
      accent: "#991b1b",
      items: [
        { name: "Asset Management Systems", href: "/products?id=fire-truck" },
        { name: "Rescue Intervention Vehicles (RIV)", href: "/products?id=fire-truck" },
        { name: "CAFS Systems", href: "/products?id=one-seven-cafs" },
        { name: "SCBA Support Trucks", href: "/products?id=fire-truck" },
        { name: "CBRN Emergency Response Systems", href: "/products?id=sione-hood" },
      ],
    },
    {
      id: "smart-industrial-facilities",
      name: "Smart Industrial Facilities",
      href: "/solutions?cat=smart-industrial-facilities",
      description: "Automated Facility Health & Process Reliability",
      accent: "#c22026",
      items: [
        { name: "Smart Factories", href: "/products?id=pressure-transmitter" },
        { name: "Plant AI Diagnostics", href: "/products?id=pressure-transmitter" },
        { name: "Wireless Data Acquisition", href: "/products?id=wireless-converter" },
        { name: "SIL2 Wireless Gas Detection", href: "/products?id=gas-detector" },
        { name: "Emergency Response Solutions", href: "/products?id=one-seven-cafs" },
      ],
    },
    {
      id: "oil-and-gas",
      name: "Oil and Gas",
      href: "/solutions?cat=oil-and-gas",
      description: "Intelligent Hydrocarbon Operations & Wireless Gas Detection",
      accent: "#1e3e8f",
      items: [
        { name: "End-End ISA 100 Wireless Gas Detection", href: "/products?id=gas-detector" },
        { name: "Plant Operations (Plant OPS)", href: "/products?id=pressure-transmitter" },
        { name: "TGR (Temporary Refuge Chamber)", href: "/products?id=wireless-converter" },
        { name: "Tank Farm Fire Fighting", href: "/products?id=one-seven-cafs" },
        { name: "LER & Analyzer Shelters", href: "/products?id=pressure-transmitter" },
        { name: "Digital Mobility-X Shielder", href: "/products?id=xshielder-phone" },
      ],
    },
    {
      id: "marine-operations",
      name: "Marine Operations",
      href: "/solutions?cat=marine-operations",
      description: "Harsh Deepwater Infrastructure Resilience & Damage Control",
      accent: "#b45309",
      items: [
        { name: "Damage Control Systems", href: "/products?id=smoke-detector" },
        { name: "Wireless Data Acquisition", href: "/products?id=wireless-converter" },
        { name: "H2S Shelter Rental & Air Loops", href: "/products?id=gas-detector" },
        { name: "Temporary Refuge Chambers (TGR)", href: "/products?id=smoke-detector" },
        { name: "Air Loops & Breathing Air Cascades", href: "/products?id=smoke-detector" },
      ],
    },
    {
      id: "utilities-and-power",
      name: "Utilities and Power",
      href: "/solutions?cat=utilities-and-power",
      description: "Critical Grid Asset Safeguarding & Thermal Monitoring",
      accent: "#1e3e8f",
      items: [
        { name: "Sampling Systems (SWAS)", href: "/products?id=pressure-transmitter" },
        { name: "Wireless Infrastructure", href: "/products?id=wireless-converter" },
        { name: "Smart Facilities", href: "/products?id=pressure-transmitter" },
        { name: "Digital Mobility (Xshielder)", href: "/products?id=xshielder-phone" },
      ],
    },
    {
      id: "defence-and-border-security",
      name: "Defence and Border Security",
      href: "/solutions?cat=defence-and-border-security",
      description: "National Level Security & Blast-Resistant Modules",
      accent: "#b45309",
      items: [
        { name: "Secure Wireless Telemetry", href: "/products?id=wireless-converter" },
        { name: "Blast-Resistant Guard Shelters", href: "/products?id=xshielder-phone" },
        { name: "Tactical Cyber Defense", href: "/products?id=xshielder-phone" },
        { name: "HCIS Approved Fencing", href: "/products?id=xshielder-phone" },
      ],
    },
  ]);

  const [hoveredCategoryIdx, setHoveredCategoryIdx] = useState<number | null>(null);
  const [mobileSubAccordion, setMobileSubAccordion] = useState<string | null>(null);

  // Mapped dynamically to Technical Applications (Page 2)
  const [applicationsList, setApplicationsList] = useState<NavItem[]>([
    { name: "Industry Digitalisation", href: "/applications/industry-digitalisation" },
    { name: "Wireless Data Acquisition", href: "/applications/wireless-data-acquisition" },
    { name: "AI Predictive Analytics", href: "/applications/ai-predictive-analytics" },
    { name: "Fire & Rescue Systems", href: "/applications/fire-rescue-systems" },
    { name: "Explosion-Proof Mobility", href: "/applications/explosion-proof-mobility" },
    { name: "Breathing & Asset Protection", href: "/applications/breathing-protection" },
  ]);

  // Mapped dynamically to Services & Consultancy segments (Page 2 & 3)
  const [servicesList, setServicesList] = useState<NavItem[]>([
    { name: "Explosion-Proof System Design", href: "/services/explosion-proof-design" },
    { name: "HSE & Risk Consultancy", href: "/services/hse-consultancy" },
    { name: "Digitalisation Consultancy", href: "/services/digitalisation-consultancy" },
    { name: "Fire & Gas Mapping Services", href: "/services/fire-gas-mapping" },
    { name: "Electromechanical Automation", href: "/services/electromechanical-automation" },
    { name: "Power Optimisation Support", href: "/services/power-optimisation" },
  ]);

  useEffect(() => {
    async function fetchNavbarData() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Fetch applications
      try {
        const res = await fetch(`${baseUrl}/api/applications`);
        if (res.ok) {
          const list = await res.json();
          const mapped = list.map((item: any) => ({
            name: item.title,
            href: `/applications/${item.id}`,
          }));
          if (mapped.length > 0) {
            setApplicationsList(mapped);
          }
        }
      } catch (err) {
        console.error("Navbar failed to fetch applications:", err);
      }

      // Fetch services
      try {
        const res = await fetch(`${baseUrl}/api/services`);
        if (res.ok) {
          const list = await res.json();
          const mapped = list.map((item: any) => ({
            name: item.title,
            href: `/services/${item.id}`,
          }));
          if (mapped.length > 0) {
            setServicesList(mapped);
          }
        }
      } catch (err) {
        console.error("Navbar failed to fetch services:", err);
      }
    }

    fetchNavbarData();
  }, []);




  const renderChevron = (isActive: boolean) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-180 ${isActive ? "rotate-180" : "rotate-0"}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );

  const renderDropdownLinks = (items: NavItem[]) => (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => {
            setActiveDropdown(null);
            setSolutionsExpanded(false);
            setMobileMenuOpen(false);
          }}
          className="group/item min-h-[34px] flex items-center justify-between gap-2.5 p-[7px_10px] rounded-xl text-slate-600 no-underline text-[0.78rem] font-bold leading-tight transition-all duration-300 hover:text-[#1e3e8f] hover:bg-slate-50 hover:translate-x-1"
        >
          <span>{item.name}</span>
          <span className="dropdown-arrow text-slate-400 text-[1rem] leading-none group-hover/item:text-[#c22026] group-hover/item:translate-x-0.5 transition-all duration-300">
            ›
          </span>
        </Link>
      ))}
    </div>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] w-full flex justify-center pointer-events-none transition-all duration-300 ${
        showTransparent ? "py-0" : "py-4 max-sm:py-2"
      }`}
      style={{
        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, -110%, 0)",
      }}
    >
      <div
        className={`pointer-events-auto flex items-center justify-between gap-4 transition-all duration-300 relative ${
          showTransparent
            ? "w-full px-10 max-sm:px-5 py-5 bg-transparent border-b border-white/5 shadow-none rounded-none backdrop-blur-none scale-100"
            : `w-[calc(100%-48px)] max-sm:w-[calc(100%-24px)] max-w-[1240px] px-6 rounded-full backdrop-blur-2xl border ${
                isScrolled
                  ? "py-1.5 bg-white/80 saturate-[160%] border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_12px_36px_rgba(15,23,42,0.08)] scale-[0.985]"
                  : "py-2.5 bg-white/70 saturate-[150%] border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_30px_rgba(15,23,42,0.06)]"
              }`
        }`}
      >
        <Link href="/" className="brand-link inline-flex items-center no-underline shrink-0">
          <div className={`transition-all duration-300 ${
            showTransparent
              ? "bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/80 shadow-md"
              : "bg-transparent"
          }`}>
            <img
              src="/logo.png"
              alt="East Wind Energy Arabia"
              className="h-9 sm:h-11 w-auto max-w-[150px] sm:max-w-none object-contain shrink-0"
            />
          </div>
        </Link>

        {/* Desktop Navigation Link Cluster */}
        <nav className="desktop-nav hidden lg:flex items-center justify-center gap-1.5" aria-label="Primary navigation">
          <Link
            href="/"
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Home</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>

          <Link
            href="/about"
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>About</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>

          {/* Single Solutions & Applications Link Button */}
          <Link
            href="/solutions"
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Solutions & Applications</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>

          {/* Single Direct Services Link Button */}
          <Link
            href="/solutions?type=services"
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Services</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>



          <Link
            href="/contact"
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Contact</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>
        </nav>

        <div className="nav-actions hidden lg:flex items-center">
          <Link
            href="/enquire"
            className="group/btn relative overflow-hidden min-h-[38px] px-5 inline-flex items-center justify-center rounded-full bg-[#c22026] text-white no-underline text-[0.76rem] font-extrabold uppercase tracking-wider transition-all duration-300 hover:bg-[#1e3e8f] shadow-sm whitespace-nowrap"
          >
            <span>Enquire Now</span>
            <span className="ml-1.5 transition-transform duration-300 transform group-hover/btn:translate-x-1 font-bold text-[0.8rem]">
              →
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className={`mobile-menu-button flex lg:hidden w-10 h-10 items-center justify-center border rounded-full cursor-pointer shadow-sm transition-all duration-200 ${
            showTransparent ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-white/80 text-slate-800"
          }`}
          aria-expanded={mobileMenuOpen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Accordion Panel */}
      {mobileMenuOpen && (
        <div className={`mobile-menu-panel pointer-events-auto flex lg:hidden fixed left-4 right-4 max-h-[calc(100vh-96px)] overflow-y-auto p-4.5 flex-col gap-2.5 border border-white/80 rounded-[24px] bg-white/95 shadow-2xl z-[150] backdrop-blur-xl ${
          showTransparent ? "top-[82px]" : "top-[70px]"
        }`}>
          <div className="industrial-grid absolute inset-0 opacity-[0.015] pointer-events-none rounded-[24px]" />
          
          <div className="relative z-10 flex flex-col gap-2.5">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 border border-slate-200/50 rounded-xl bg-slate-50/50 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 border border-slate-200/50 rounded-xl bg-slate-50/50 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              About Us
            </Link>

            {/* Mobile Solutions & Applications Direct Link */}
            <Link 
              href="/solutions" 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 border border-slate-200/50 rounded-xl bg-slate-50/50 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Solutions & Applications
            </Link>

            {/* Mobile Services Direct Link */}
            <Link 
              href="/solutions?type=services" 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 border border-slate-200/50 rounded-xl bg-slate-50/50 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Services & Consultancy
            </Link>



            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 border border-slate-200/50 rounded-xl bg-slate-50/50 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Contact Us
            </Link>

            <Link 
              href="/enquire" 
              onClick={() => setMobileMenuOpen(false)} 
              className="min-h-[40px] inline-flex items-center justify-center px-5 rounded-full bg-[#c22026] text-white no-underline text-[0.82rem] font-extrabold uppercase tracking-wider mt-2 shadow-sm"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}