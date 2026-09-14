"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { formatImageUrl } from "@/utils/image";
import { productsDb } from "@/data/productsData";
import { cachedFetch } from "@/utils/apiCache";

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
  const [logoUrl, setLogoUrl] = useState<string>("/blue logo (3).png");
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
        
        // 1. Fetch products catalog with real-time cache-busting
        let productsCatalog = await cachedFetch<any[]>(`${baseUrl}/api/products?t=${Date.now()}`, {
          fallback: productsDb,
          cache: "no-store",
        });

        if (!Array.isArray(productsCatalog) || productsCatalog.length === 0) {
          productsCatalog = productsDb;
        }

        // 2. Fetch solutions page configuration with real-time cache-busting
        const data = await cachedFetch<any>(`${baseUrl}/api/solutions-page?t=${Date.now()}`, {
          fallback: null,
          cache: "no-store",
        });

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

      // Fetch applications with cachedFetch
      try {
        const list = await cachedFetch<any[]>(`${baseUrl}/api/applications`, { fallback: [] });
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((item: any) => ({
            name: item.title,
            href: `/applications/${item.id}`,
          }));
          setApplicationsList(mapped);
        }
      } catch (err) {
        console.error("Navbar failed to fetch applications:", err);
      }

      // Fetch services with cachedFetch
      try {
        const list = await cachedFetch<any[]>(`${baseUrl}/api/services`, { fallback: [] });
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((item: any) => ({
            name: item.title,
            href: `/services/${item.id}`,
          }));
          setServicesList(mapped);
        }
      } catch (err) {
        console.error("Navbar failed to fetch services:", err);
      }
      // Fetch footer / contact settings data to get unified logoUrl
      try {
        const settings = await cachedFetch<any[]>(`${baseUrl}/api/contact-settings?t=${Date.now()}`, { fallback: [], cache: "no-store" });
        if (Array.isArray(settings)) {
          const footerDoc = settings.find((item: any) => item.id === "footer");
          if (footerDoc && footerDoc.logoUrl) {
            setLogoUrl(footerDoc.logoUrl);
          }
        }
      } catch (err) {
        console.warn("Navbar failed to fetch logo from contact settings:", err);
      }
    }

    fetchNavbarData();

    const handleCacheCleared = () => fetchNavbarData();
    window.addEventListener("cms-cache-cleared", handleCacheCleared);
    return () => window.removeEventListener("cms-cache-cleared", handleCacheCleared);
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

  const handleNavClick = () => {
    setActiveDropdown(null);
    setSolutionsExpanded(false);
    setMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  const renderDropdownLinks = (items: NavItem[]) => (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={handleNavClick}
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
            ? "w-full px-10 max-sm:px-5 py-5 bg-transparent shadow-none rounded-none backdrop-blur-none scale-100"
            : `w-[calc(100%-48px)] max-sm:w-[calc(100%-24px)] max-w-[1240px] px-6 rounded-full backdrop-blur-xl ${
                isScrolled
                  ? "py-1.5 bg-white/95 shadow-[0_12px_36px_rgba(15,23,42,0.08)] scale-[0.985]"
                  : "py-2.5 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
              }`
        }`}
      >
        <Link href="/" onClick={handleNavClick} className="brand-link inline-flex items-center no-underline shrink-0">
          <div className={`transition-all duration-300 px-2.5 py-1 rounded-xl ${
            showTransparent
              ? "bg-white/95 backdrop-blur-md shadow-md"
              : "bg-transparent"
          }`}>
            <img
              src={formatImageUrl(logoUrl)}
              alt="East Wind"
              className="h-8 sm:h-10 w-auto max-w-[160px] sm:max-w-none object-contain shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/logo.png";
              }}
            />
          </div>
        </Link>

        {/* Desktop Navigation Link Cluster */}
        <nav className="desktop-nav hidden lg:flex items-center justify-center gap-1.5" aria-label="Primary navigation">
          <Link
            href="/"
            onClick={handleNavClick}
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Home</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>

          <Link
            href="/about"
            onClick={handleNavClick}
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>About</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>

          {/* Products Link Button */}
          <Link
            href="/products"
            onClick={handleNavClick}
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Products</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>

          {/* Solutions Link Button */}
          <Link
            href="/solutions"
            onClick={handleNavClick}
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Solutions</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>

          {/* Applications Link Button */}
          <Link
            href="/solutions?type=applications"
            onClick={handleNavClick}
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Applications</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>

          {/* Single Direct Services Link Button */}
          <Link
            href="/solutions?type=services"
            onClick={handleNavClick}
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Services</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>

          <Link
            href="/contact"
            onClick={handleNavClick}
            className={`nav-link relative group/nav px-3.5 py-2 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-[#1e3e8f] hover:bg-slate-100"
            }`}
          >
            <span>Contact</span>
            <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-0 scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 ${showTransparent ? "bg-white" : "bg-[#c22026]"}`} />
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className={`mobile-menu-button flex lg:hidden w-10 h-10 items-center justify-center rounded-full cursor-pointer shadow-sm transition-all duration-200 ${
            showTransparent ? "bg-white/10 text-white" : "bg-white/90 text-slate-800"
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
        <div className={`mobile-menu-panel pointer-events-auto flex lg:hidden fixed left-4 right-4 max-h-[calc(100vh-96px)] overflow-y-auto p-4.5 flex-col gap-2.5 rounded-[24px] bg-white/95 shadow-2xl z-[150] backdrop-blur-xl ${
          showTransparent ? "top-[82px]" : "top-[70px]"
        }`}>
          <div className="industrial-grid absolute inset-0 opacity-[0.015] pointer-events-none rounded-[24px]" />
          
          <div className="relative z-10 flex flex-col gap-2.5">
            <Link 
              href="/" 
              onClick={handleNavClick} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 rounded-xl bg-slate-50/70 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              onClick={handleNavClick} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 rounded-xl bg-slate-50/70 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              About Us
            </Link>

            {/* Mobile Products Direct Link */}
            <Link 
              href="/products" 
              onClick={handleNavClick} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 rounded-xl bg-slate-50/70 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Products
            </Link>

            {/* Mobile Solutions Direct Link */}
            <Link 
              href="/solutions" 
              onClick={handleNavClick} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 rounded-xl bg-slate-50/70 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Solutions
            </Link>

            {/* Mobile Applications Direct Link */}
            <Link 
              href="/solutions?type=applications" 
              onClick={handleNavClick} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 rounded-xl bg-slate-50/70 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Applications
            </Link>

            {/* Mobile Services Direct Link */}
            <Link 
              href="/solutions?type=services" 
              onClick={handleNavClick} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 rounded-xl bg-slate-50/70 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Services & Consultancy
            </Link>

            <Link 
              href="/contact" 
              onClick={handleNavClick} 
              className="w-full min-h-[44px] flex items-center justify-between px-4 rounded-xl bg-slate-50/70 text-slate-800 text-[0.88rem] font-bold no-underline"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}