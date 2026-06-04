"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AccordionKey = "products" | "applications" | "services" | "solutions";

interface NavItem {
  name: string;
  href: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<AccordionKey | null>(null);
  const [mobileAccordions, setMobileAccordions] = useState<Record<AccordionKey, boolean>>({
    products: false,
    applications: false,
    services: false,
    solutions: false,
  });

  const showTransparent = isHomepage && !isScrolled;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    // Initial scroll state calculation
    const getHeroThreshold = () => window.innerHeight * 0.5;
    const initialThreshold = isHomepage ? getHeroThreshold() : 18;
    let localIsScrolled = lastScrollY > initialThreshold;
    let localIsVisible = true;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroThreshold = getHeroThreshold();
      const threshold = isHomepage ? heroThreshold : 18;

      // Scrolled state
      const nextScrolled = currentScrollY > threshold;
      if (nextScrolled !== localIsScrolled) {
        localIsScrolled = nextScrolled;
        setIsScrolled(nextScrolled);
      }

      // Visibility state
      let nextVisible = localIsVisible;
      if (mobileMenuOpen) {
        nextVisible = true;
      } else if (isHomepage && currentScrollY <= heroThreshold) {
        // Stays visible and transparent inside the first half of the hero section on scroll down
        nextVisible = true;
      } else if (currentScrollY <= 50) {
        nextVisible = true;
      } else if (currentScrollY > lastScrollY) {
        nextVisible = false; // scrolling down
      } else {
        nextVisible = true; // scrolling up
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

  const productsList: NavItem[] = [
    { name: "Air Purified Respirators", href: "/products/air-purified-respirators" },
    { name: "Breathing Air Compressor", href: "/products/breathing-air-compressor" },
    { name: "Calibration Gases", href: "/products/calibration-gases" },
    { name: "Chemical Protective Suits", href: "/products/chemical-protective-suits" },
    { name: "Detergents and Disinfectants", href: "/products/detergents-and-disinfectants" },
    { name: "Diving Equipments and Systems", href: "/products/diving-equipments" },
    { name: "Drug and Alcohol Monitoring", href: "/products/drug-alcohol-monitoring" },
    { name: "Emergency Escape Breathing Device", href: "/products/emergency-escape-breathing-device" },
    { name: "Gas Detection", href: "/products/gas-detection" },
    { name: "Personal Protection", href: "/products/personal-protection" },
    { name: "Self Contained Breathing Apparatus", href: "/products/self-contained-breathing-apparatus" },
    { name: "Thermal Imaging Camera", href: "/products/thermal-imaging-camera" },
    { name: "Environmental Analysers", href: "/products/environmental-analysers" },
    { name: "Protective Eye Wears", href: "/products/protective-eye-wears" },
    { name: "Helmets for Fire Brigades", href: "/products/helmets-for-fire-brigades" },
    { name: "Test Equipment & Workshop Software", href: "/products/test-equipment-workshop-software" },
    { name: "Rescue Tool Kit", href: "/products/rescue-tool-kit" },
  ];

  const applicationsList: NavItem[] = [
    { name: "Fire Service", href: "/products/fire-service" },
    { name: "Marine", href: "/products/marine" },
    { name: "Oil and Gas", href: "/products/oil-and-gas" },
    { name: "Others", href: "/products/others" },
  ];

  const servicesList: NavItem[] = [
    { name: "Testing and Maintenance", href: "/products/testing-maintenance" },
    { name: "Calibration", href: "/products/calibration" },
    { name: "Marine Instruments Repair", href: "/products/marine-instruments-repair" },
  ];

  const solutionsList: NavItem[] = [
    { name: "Temporary Refuge Shelters", href: "/products/temporary-refuge-shelters" },
    { name: "Fire Simulators", href: "/products/fire-simulators" },
    { name: "Breathing Air Cascade Systems", href: "/products/breathing-air-cascade-systems" },
    { name: "Fire & Gas Systems (Wired/Wireless)", href: "/products/fire-gas-systems" },
    { name: "Diving Chambers", href: "/products/diving-chambers" },
    { name: "Oxygen Boosters & Air Supply", href: "/products/oxygen-boosters-breathing-air-supply" },
    { name: "Flow Metering Skids", href: "/products/flow-metering-skids" },
    { name: "Chemical Injection Skids", href: "/products/chemical-injection-skids" },
    { name: "HIPPS", href: "/products/hipps" },
  ];

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
      aria-hidden="true"
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
          className="group/item min-h-[34px] flex items-center justify-between gap-2.5 p-[7px_10px] rounded-xl text-slate-600 no-underline text-[0.78rem] font-bold leading-tight transition-all duration-160 hover:text-[#153b8b] hover:bg-slate-100 hover:translate-x-0.5"
        >
          <span>{item.name}</span>
          <span className="dropdown-arrow text-slate-400 text-[1rem] leading-none group-hover/item:text-[#153b8b] transition-colors" aria-hidden="true">
            ›
          </span>
        </Link>
      ))}
    </div>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] w-full flex justify-center pointer-events-none transition-all duration-300 ${
        showTransparent ? "py-0" : "py-4 max-[700px]:py-2.5"
      }`}
      style={{
        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, -110%, 0)",
      }}
    >
      <div
        className={`pointer-events-auto flex items-center justify-between gap-4 transition-all duration-300 relative ${
          showTransparent
            ? "w-full px-10 py-5 bg-transparent border-b border-transparent shadow-none rounded-none backdrop-blur-none scale-100"
            : `w-[calc(100%-48px)] max-[700px]:w-[calc(100%-28px)] max-w-[1240px] px-6 rounded-full backdrop-blur-md border ${
                isScrolled
                  ? "py-1.5 bg-white/70 border-slate-200/80 shadow-[0_12px_36px_rgba(15,23,42,0.09)] scale-[0.985]"
                  : "py-2.5 max-[700px]:py-2 bg-white/55 border-slate-200/40 shadow-[0_8px_30px_rgb(15,23,42,0.04)]"
              }`
        }`}
      >
        <Link href="/" className="brand-link inline-flex items-center gap-2.5 no-underline text-slate-900" aria-label="East Wind Safety home">
          <span className="brand-mark w-[38px] h-[38px] grid place-items-center rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 shadow-sm" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35 15C20 25 10 45 10 65c0 13 8 20 15 20-5-10-7-25-2-40 5-15 12-25 12-30Z" fill="#1E3E8F" />
              <path d="M52 20C37 30 27 50 27 70c0 10 5 15 10 15-5-7-7-20 0-35 7-15 15-25 15-30Z" fill="#C22026" />
            </svg>
          </span>
          <span className="brand-copy flex flex-col justify-center gap-0.5">
            <span className={`brand-name text-[0.98rem] font-black leading-none transition-colors duration-300 ${
              showTransparent ? "text-white" : "text-[#153b8b]"
            }`}>
              East Wind
            </span>
            <span className={`brand-subtitle text-[0.58rem] font-bold leading-none tracking-[0.14em] uppercase transition-colors duration-300 ${
              showTransparent ? "text-white/80" : "text-[#c22026]"
            }`}>
              Safety Arabia
            </span>
          </span>
        </Link>

        <nav className="desktop-nav hidden min-[1160px]:flex items-center justify-center gap-1.5" aria-label="Primary navigation">
          <Link
            href="/"
            className={`nav-link px-3.5 py-1.75 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent
                ? "text-white/90 hover:text-white hover:bg-white/10"
                : "text-slate-600 hover:text-[#153b8b] hover:bg-slate-100/70"
            }`}
          >
            Home
          </Link>
          <a
            href="#about-us"
            className={`nav-link px-3.5 py-1.75 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent
                ? "text-white/90 hover:text-white hover:bg-white/10"
                : "text-slate-600 hover:text-[#153b8b] hover:bg-slate-100/70"
            }`}
          >
            About
          </a>

          <div
            className="nav-dropdown"
            onMouseEnter={() => setActiveDropdown("products")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`nav-link-dropdown inline-flex items-center gap-1.25 px-3.5 py-1.75 text-[0.76rem] font-extrabold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                showTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-[#153b8b] hover:bg-slate-100/70"
              } ${
                activeDropdown === "products"
                  ? (showTransparent ? "text-white bg-white/15" : "text-[#153b8b] bg-slate-100/80")
                  : ""
              }`}
            >
              Products {renderChevron(activeDropdown === "products")}
            </button>

            {activeDropdown === "products" && (
              <div className="mega-dropdown-container absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 bg-white/98 border border-slate-200 rounded-[20px] shadow-2xl z-[150] backdrop-blur-lg p-5 grid grid-cols-[220px_1fr] gap-6 w-[min(840px,calc(100vw-64px))] before:content-[''] before:absolute before:-top-4.5 before:inset-x-0 before:h-4.5">
                <div className="dropdown-feature min-h-full flex flex-col justify-end p-5 rounded-2xl bg-gradient-to-br from-[#102a5f] via-[#153b8b] to-[#c22026] text-white">
                  <span className="dropdown-kicker block text-white/70 text-[0.66rem] font-bold tracking-widest uppercase">Product Catalog</span>
                  <strong className="block my-2.5 text-[0.98rem] leading-[1.3] font-black">Safety equipment for high-risk industrial teams.</strong>
                  <p className="m-0 text-white/78 text-[0.74rem] leading-[1.6]">Browse protection, detection, rescue, and specialty systems.</p>
                </div>
                <div className="mega-dropdown-grid-3 grid grid-cols-3 gap-4.5">
                  <div>
                    <span className="dropdown-section-title block text-[#c22026] text-[0.66rem] font-bold tracking-widest uppercase mb-2.5">Breathing & Protection</span>
                    {renderDropdownLinks(productsList.slice(0, 6))}
                  </div>
                  <div>
                    <span className="dropdown-section-title block text-[#c22026] text-[0.66rem] font-bold tracking-widest uppercase mb-2.5">Detection & Systems</span>
                    {renderDropdownLinks(productsList.slice(6, 12))}
                  </div>
                  <div>
                    <span className="dropdown-section-title block text-[#c22026] text-[0.66rem] font-bold tracking-widest uppercase mb-2.5">Support & Specialty</span>
                    {renderDropdownLinks(productsList.slice(12))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href="#experience-center"
            className={`nav-link px-3.5 py-1.75 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent
                ? "text-white/90 hover:text-white hover:bg-white/10"
                : "text-slate-600 hover:text-[#153b8b] hover:bg-slate-100/70"
            }`}
          >
            Experience
          </a>

          <div
            className="nav-dropdown relative"
            onMouseEnter={() => setActiveDropdown("applications")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`nav-link-dropdown inline-flex items-center gap-1.25 px-3.5 py-1.75 text-[0.76rem] font-extrabold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                showTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-[#153b8b] hover:bg-slate-100/70"
              } ${
                activeDropdown === "applications"
                  ? (showTransparent ? "text-white bg-white/15" : "text-[#153b8b] bg-slate-100/80")
                  : ""
              }`}
            >
              Applications {renderChevron(activeDropdown === "applications")}
            </button>

            {activeDropdown === "applications" && (
              <div className="dropdown-container absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-64 p-4.5 bg-white/98 border border-slate-200 rounded-[20px] shadow-2xl z-[150] backdrop-blur-lg before:content-[''] before:absolute before:-top-4.5 before:inset-x-0 before:h-4.5">
                <span className="dropdown-section-title block text-[#c22026] text-[0.66rem] font-bold tracking-widest uppercase mb-2.5">Industries</span>
                {renderDropdownLinks(applicationsList)}
              </div>
            )}
          </div>

          <div
            className="nav-dropdown relative"
            onMouseEnter={() => setActiveDropdown("services")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`nav-link-dropdown inline-flex items-center gap-1.25 px-3.5 py-1.75 text-[0.76rem] font-extrabold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                showTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-[#153b8b] hover:bg-slate-100/70"
              } ${
                activeDropdown === "services"
                  ? (showTransparent ? "text-white bg-white/15" : "text-[#153b8b] bg-slate-100/80")
                  : ""
              }`}
            >
              Services {renderChevron(activeDropdown === "services")}
            </button>

            {activeDropdown === "services" && (
              <div className="dropdown-container absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-64 p-4.5 bg-white/98 border border-slate-200 rounded-[20px] shadow-2xl z-[150] backdrop-blur-lg before:content-[''] before:absolute before:-top-4.5 before:inset-x-0 before:h-4.5">
                <span className="dropdown-section-title block text-[#c22026] text-[0.66rem] font-bold tracking-widest uppercase mb-2.5">Support</span>
                {renderDropdownLinks(servicesList)}
              </div>
            )}
          </div>

          <div
            className="nav-dropdown"
            onMouseEnter={() => setActiveDropdown("solutions")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className={`nav-link-dropdown inline-flex items-center gap-1.25 px-3.5 py-1.75 text-[0.76rem] font-extrabold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                showTransparent
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-slate-600 hover:text-[#153b8b] hover:bg-slate-100/70"
              } ${
                activeDropdown === "solutions"
                  ? (showTransparent ? "text-white bg-white/15" : "text-[#153b8b] bg-slate-100/80")
                  : ""
              }`}
            >
              Solutions {renderChevron(activeDropdown === "solutions")}
            </button>

            {activeDropdown === "solutions" && (
              <div className="mega-dropdown-container absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 bg-white/98 border border-slate-200 rounded-[20px] shadow-2xl z-[150] backdrop-blur-lg p-5 grid grid-cols-[220px_1fr] gap-6 w-[min(650px,calc(100vw-64px))] before:content-[''] before:absolute before:-top-4.5 before:inset-x-0 before:h-4.5">
                <div className="dropdown-feature min-h-full flex flex-col justify-end p-5 rounded-xl bg-gradient-to-br from-[#102a5f] via-[#153b8b] to-[#c22026] text-white">
                  <span className="dropdown-kicker block text-white/70 text-[0.66rem] font-bold tracking-widest uppercase">Engineered Solutions</span>
                  <strong className="block my-2.5 text-[0.98rem] leading-[1.3] font-black">Packaged systems for critical operations.</strong>
                  <p className="m-0 text-white/78 text-[0.74rem] leading-[1.6]">From refuge shelters to process skids, built around industrial reliability.</p>
                </div>
                <div className="mega-dropdown-grid-2 grid grid-cols-2 gap-4.5">
                  <div>
                    <span className="dropdown-section-title block text-[#c22026] text-[0.66rem] font-bold tracking-widest uppercase mb-2.5">Critical & Safety Systems</span>
                    {renderDropdownLinks(solutionsList.slice(0, 5))}
                  </div>
                  <div>
                    <span className="dropdown-section-title block text-[#c22026] text-[0.66rem] font-bold tracking-widest uppercase mb-2.5">Process & Skids</span>
                    {renderDropdownLinks(solutionsList.slice(5))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href="#contact-us"
            className={`nav-link px-3.5 py-1.75 text-[0.76rem] font-extrabold uppercase no-underline tracking-wider rounded-full transition-all duration-200 ${
              showTransparent
                ? "text-white/90 hover:text-white hover:bg-white/10"
                : "text-slate-600 hover:text-[#153b8b] hover:bg-slate-100/70"
            }`}
          >
            Contact
          </a>
        </nav>

        <div className="nav-actions hidden min-[1160px]:flex items-center">
          <Link
            href="/products/gas-detection"
            className="quote-link min-h-[38px] px-5 inline-flex items-center justify-center rounded-full bg-[#c22026] text-white no-underline text-[0.76rem] font-extrabold uppercase tracking-wider transition-all hover:bg-slate-900 shadow-sm hover:shadow-md hover:-translate-y-[1px] whitespace-nowrap"
          >
            Enquire Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className={`mobile-menu-button flex min-[1160px]:hidden w-10 h-10 items-center justify-center border rounded-full cursor-pointer shadow-sm transition-all duration-200 ${
            showTransparent
              ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
              : "border-slate-200 bg-white text-slate-900"
          }`}
          aria-label="Toggle mobile menu"
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

      {mobileMenuOpen && (
        <div className={`mobile-menu-panel pointer-events-auto flex min-[1160px]:hidden fixed left-6 right-6 max-[700px]:left-3.5 max-[700px]:right-3.5 max-h-[calc(100vh-96px)] overflow-y-auto p-4 flex-col gap-2.5 border border-slate-200 rounded-2xl bg-white/98 shadow-2xl z-[150] backdrop-blur-lg transition-all duration-300 ${
          showTransparent ? "top-[82px]" : "top-[70px]"
        }`}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link w-full min-h-[44px] flex items-center justify-between px-3 border border-slate-100 rounded-xl bg-slate-50/50 text-slate-900 no-underline text-[0.88rem] font-bold cursor-pointer">
            Home
          </Link>
          <a href="#about-us" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link w-full min-h-[44px] flex items-center justify-between px-3 border border-slate-100 rounded-xl bg-slate-50/50 text-slate-900 no-underline text-[0.88rem] font-bold cursor-pointer">
            About Us
          </a>

          <div>
            <button type="button" onClick={() => toggleMobileAccordion("products")} className="mobile-accordion-trigger w-full min-h-[44px] flex items-center justify-between px-3 border border-slate-100 rounded-xl bg-slate-50/50 text-slate-900 no-underline text-[0.88rem] font-bold cursor-pointer">
              <span>Products</span>
              {renderChevron(mobileAccordions.products)}
            </button>
            {mobileAccordions.products && (
              <div className="mobile-accordion-content flex flex-col gap-1 mt-1.5 p-2 border border-slate-200 rounded-xl bg-slate-50">
                {productsList.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="mobile-dropdown-link min-h-[36px] flex items-center px-2.5 rounded-lg text-slate-600 no-underline text-[0.82rem] font-semibold hover:bg-white hover:text-[#153b8b]">
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a href="#experience-center" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link w-full min-h-[44px] flex items-center justify-between px-3 border border-slate-100 rounded-xl bg-slate-50/50 text-slate-900 no-underline text-[0.88rem] font-bold cursor-pointer">
            Experience Center
          </a>

          <div>
            <button type="button" onClick={() => toggleMobileAccordion("applications")} className="mobile-accordion-trigger w-full min-h-[44px] flex items-center justify-between px-3 border border-slate-100 rounded-xl bg-slate-50/50 text-slate-900 no-underline text-[0.88rem] font-bold cursor-pointer">
              <span>Applications</span>
              {renderChevron(mobileAccordions.applications)}
            </button>
            {mobileAccordions.applications && (
              <div className="mobile-accordion-content flex flex-col gap-1 mt-1.5 p-2 border border-slate-200 rounded-xl bg-slate-50">
                {applicationsList.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="mobile-dropdown-link min-h-[36px] flex items-center px-2.5 rounded-lg text-slate-600 no-underline text-[0.82rem] font-semibold hover:bg-white hover:text-[#153b8b]">
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <button type="button" onClick={() => toggleMobileAccordion("services")} className="mobile-accordion-trigger w-full min-h-[44px] flex items-center justify-between px-3 border border-slate-100 rounded-xl bg-slate-50/50 text-slate-900 no-underline text-[0.88rem] font-bold cursor-pointer">
              <span>Services</span>
              {renderChevron(mobileAccordions.services)}
            </button>
            {mobileAccordions.services && (
              <div className="mobile-accordion-content flex flex-col gap-1 mt-1.5 p-2 border border-slate-200 rounded-xl bg-slate-50">
                {servicesList.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="mobile-dropdown-link min-h-[36px] flex items-center px-2.5 rounded-lg text-slate-600 no-underline text-[0.82rem] font-semibold hover:bg-white hover:text-[#153b8b]">
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <button type="button" onClick={() => toggleMobileAccordion("solutions")} className="mobile-accordion-trigger w-full min-h-[44px] flex items-center justify-between px-3 border border-slate-100 rounded-xl bg-slate-50/50 text-slate-900 no-underline text-[0.88rem] font-bold cursor-pointer">
              <span>Engineered Solutions</span>
              {renderChevron(mobileAccordions.solutions)}
            </button>
            {mobileAccordions.solutions && (
              <div className="mobile-accordion-content flex flex-col gap-1 mt-1.5 p-2 border border-slate-200 rounded-xl bg-slate-50">
                {solutionsList.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="mobile-dropdown-link min-h-[36px] flex items-center px-2.5 rounded-lg text-slate-600 no-underline text-[0.82rem] font-semibold hover:bg-white hover:text-[#153b8b]">
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a href="#contact-us" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link w-full min-h-[44px] flex items-center justify-between px-3 border border-slate-100 rounded-xl bg-slate-50/50 text-slate-900 no-underline text-[0.88rem] font-bold cursor-pointer">
            Contact Us
          </a>

          <Link href="/products/gas-detection" onClick={() => setMobileMenuOpen(false)} className="mobile-quote-link quote-link min-h-[40px] inline-flex items-center justify-center px-5 rounded-full bg-[#c22026] text-white no-underline text-[0.82rem] font-extrabold uppercase tracking-wider transition-all hover:bg-slate-900 shadow-sm whitespace-nowrap">
            Enquire Now
          </Link>
        </div>
      )}
    </header>
  );
}
