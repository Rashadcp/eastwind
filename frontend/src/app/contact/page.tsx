// src/app/contact/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

interface DropdownOption {
  value: string;
  label: string;
}

interface ContactInfoData {
  hqTitle: string;
  hqAddress: string;
  hubTitle: string;
  hubAddress: string;
  telephone: string;
  email: string;
  workingHours: string;
}

interface ContactPageData {
  heroBgImage: string;
  heroTagline: string;
  heroTitle: string;
  heroDescription: string;
  communicationsTagline: string;
  communicationsTitle: string;
  communicationsDesc: string;
  formSubHeaderTagline: string;
  formSubHeaderTitle: string;
  marketSegments: DropdownOption[];
  submitButtonText: string;
  successTitle: string;
  successMessage: string;
}

const defaultContactInfo: ContactInfoData = {
  hqTitle: "Al Khobar Headquarters",
  hqAddress: "King Faisal West Road, Bandariyah District,\nAl Khobar, Kingdom of Saudi Arabia",
  hubTitle: "Riyadh Technology Hub",
  hubAddress: "Olaya District, Riyadh,\nKingdom of Saudi Arabia",
  telephone: "+966 13 889 XXXX",
  email: "info@eastwindsafety.com",
  workingHours: "Sunday – Thursday | 08:00 – 17:00 AST",
};

const defaultContactPage: ContactPageData = {
  heroBgImage: "/contact_hero.png",
  heroTagline: "Global Procurement Channels",
  heroTitle: "Connect With Our Engineers",
  heroDescription: "Initiate technical scoping, request custom hardware estimations, or schedule compliance architecture audits with our Dammam team.",
  communicationsTagline: "Communications Log",
  communicationsTitle: "Primary Operation Hubs",
  communicationsDesc: "Direct routing channels across our regional estimating centers, specialized equipment workshop cells, and corporate headquarters.",
  formSubHeaderTagline: "Project Registration",
  formSubHeaderTitle: "Blueprint Specifications Intake",
  marketSegments: [
    { value: "oil-gas", label: "Onshore / Offshore Oil & Gas" },
    { value: "petrochemical", label: "Downstream Petrochemical Infrastructure" },
    { value: "civil-defense", label: "Civil Defense / Public Safety" },
    { value: "power-utilities", label: "Utility Systems & Smart Energy Grids" },
    { value: "marine-offshore", label: "Marine Engineering & Fleet Operations" }
  ],
  submitButtonText: "Transmit Integration File",
  successTitle: "Transmission Complete",
  successMessage: "Your infrastructure profile has been successfully parsed and channeled to our technical estimating group in Dammam. A specialist will follow up within 24 business hours."
};

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfoData>(defaultContactInfo);
  const [contactPage, setContactPage] = useState<ContactPageData>(defaultContactPage);

  const [formState, setFormState] = useState({
    name: "",
    company: "",
    email: "",
    sector: "",
    scope: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const [infoRes, pageRes] = await Promise.all([
          fetch(`${baseUrl}/api/contact-settings/contact_info`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/contact-settings/contact_page`, { cache: "no-store" })
        ]);

        if (infoRes.ok) {
          const json = await infoRes.json();
          setContactInfo({
            hqTitle: json.hqTitle || defaultContactInfo.hqTitle,
            hqAddress: json.hqAddress || defaultContactInfo.hqAddress,
            hubTitle: json.hubTitle || defaultContactInfo.hubTitle,
            hubAddress: json.hubAddress || defaultContactInfo.hubAddress,
            telephone: json.telephone || defaultContactInfo.telephone,
            email: json.email || defaultContactInfo.email,
            workingHours: json.workingHours || defaultContactInfo.workingHours,
          });
        }

        if (pageRes.ok) {
          const json = await pageRes.json();
          setContactPage({
            heroBgImage: json.heroBgImage || defaultContactPage.heroBgImage,
            heroTagline: json.heroTagline || defaultContactPage.heroTagline,
            heroTitle: json.heroTitle || defaultContactPage.heroTitle,
            heroDescription: json.heroDescription || defaultContactPage.heroDescription,
            communicationsTagline: json.communicationsTagline || defaultContactPage.communicationsTagline,
            communicationsTitle: json.communicationsTitle || defaultContactPage.communicationsTitle,
            communicationsDesc: json.communicationsDesc || defaultContactPage.communicationsDesc,
            formSubHeaderTagline: json.formSubHeaderTagline || defaultContactPage.formSubHeaderTagline,
            formSubHeaderTitle: json.formSubHeaderTitle || defaultContactPage.formSubHeaderTitle,
            marketSegments: json.marketSegments && json.marketSegments.length > 0 ? json.marketSegments : defaultContactPage.marketSegments,
            submitButtonText: json.submitButtonText || defaultContactPage.submitButtonText,
            successTitle: json.successTitle || defaultContactPage.successTitle,
            successMessage: json.successMessage || defaultContactPage.successMessage,
          });
        }
      } catch (err) {
        console.error("Failed to fetch contact page settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className={`${poppins.className} min-h-screen bg-white text-slate-800 antialiased flex flex-col w-full overflow-x-hidden`}>
        
        {/* ── SECTION 1: BRIGHT INDUSTRIAL SPLASH HERO BANNER ── */}
        <div className="relative w-full overflow-hidden bg-slate-950 min-h-[50vh] pt-[250px] pb-32 flex items-center z-10 border-b border-slate-900 shrink-0">
          <img
            src={contactPage.heroBgImage}
            alt={contactPage.heroTitle}
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none brightness-[0.45] scale-101"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c14]/95 via-[#080c14]/75 to-transparent z-10" />
          <div className="industrial-grid absolute inset-0 opacity-[0.02] pointer-events-none z-10" />

          <div className="relative max-w-[1240px] w-full mx-auto px-6 z-20">
            <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-5 border text-white bg-white/5 border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c22026]" />
              {contactPage.heroTagline}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-white tracking-tight leading-tight mb-4 m-0">
              {contactPage.heroTitle}
            </h1>
            <p className="text-lg text-slate-300 font-light leading-relaxed max-w-2xl m-0">
              {contactPage.heroDescription}
            </p>
          </div>
        </div>

        {/* ── SECTION 2: SPLIT PORTAL CONFIGURATION ── */}
        <div className="w-full bg-white py-20 flex-grow">
          <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Box: Corporate Channels & Office Desks */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-3">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] block text-[#1e3e8f]">
                  {contactPage.communicationsTagline}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight m-0">
                  {contactPage.communicationsTitle}
                </h2>
                <p className="text-sm text-slate-500 font-light leading-relaxed m-0">
                  {contactPage.communicationsDesc}
                </p>
              </div>

              <div className="space-y-8">
                {/* Al Khobar HQ */}
                <div className="flex gap-5 items-start">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200/60 shadow-xs shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#1e3e8f]">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide m-0">{contactInfo.hqTitle}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light m-0 whitespace-pre-line">
                      {contactInfo.hqAddress}
                    </p>
                  </div>
                </div>

                {/* Riyadh Tech Hub */}
                <div className="flex gap-5 items-start">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200/60 shadow-xs shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#c22026]">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide m-0">{contactInfo.hubTitle}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light m-0 whitespace-pre-line">
                      {contactInfo.hubAddress}
                    </p>
                  </div>
                </div>

                {/* Secure Contact Matrix */}
                <div className="border-t border-slate-100 pt-8 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-slate-600 font-light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>General Correspondence: <a href={`mailto:${contactInfo.email}`} className="text-[#c22026] font-semibold no-underline hover:underline">{contactInfo.email}</a></span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 font-light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>Telephone Exchange: <span className="text-slate-900 font-semibold">{contactInfo.telephone}</span></span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 font-light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 14,14" />
                    </svg>
                    <span>Operational Availability: <span className="text-slate-900 font-medium">{contactInfo.workingHours}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Premium System Estimation Intake Form */}
            <div className="lg:col-span-7 bg-[#f8fafc] border border-slate-200/60 p-8 md:p-10 rounded-2xl shadow-2xs">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide m-0">{contactPage.successTitle}</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed m-0 font-light">
                    {contactPage.successMessage}
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold uppercase tracking-wider text-[#1e3e8f] bg-transparent border-0 underline mt-4 cursor-pointer"
                  >
                    Submit another inquiry profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="border-b border-slate-200/80 pb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest m-0">{contactPage.formSubHeaderTagline}</h3>
                    <p className="text-lg font-bold text-slate-900 pt-0.5 m-0">{contactPage.formSubHeaderTitle}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-[#1e3e8f] focus:outline-hidden transition-colors font-medium text-slate-800"
                      />
                    </div>
                    {/* Company */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Corporate Body</label>
                      <input
                        type="text"
                        required
                        value={formState.company}
                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                        placeholder="e.g. Aramco / Sabic"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-[#1e3e8f] focus:outline-hidden transition-colors font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Secure Corporate Email</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="j.doe@enterprise.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-[#1e3e8f] focus:outline-hidden transition-colors font-medium text-slate-800"
                    />
                  </div>

                  {/* Sector Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Strategic Market Segment</label>
                    <select
                      value={formState.sector}
                      onChange={(e) => setFormState({ ...formState, sector: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-[#1e3e8f] focus:outline-hidden transition-colors font-medium text-slate-800"
                    >
                      <option value="" disabled>Select market segment classification...</option>
                      {contactPage.marketSegments.map((seg) => (
                        <option key={seg.value} value={seg.value}>
                          {seg.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Scope */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Technical Scope & Compliance Mandates</label>
                    <textarea
                      required
                      rows={5}
                      value={formState.scope}
                      onChange={(e) => setFormState({ ...formState, scope: e.target.value })}
                      placeholder="Outline your technical parameters, zoning challenges (Zone 0/1), or compliance targets (HCIS, NFPA, ATEX)..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-[#1e3e8f] focus:outline-hidden transition-colors font-medium text-slate-800 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center py-4 px-6 text-xs font-bold uppercase tracking-wider text-white bg-[#c22026] hover:bg-slate-900 border-0 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                  >
                    {contactPage.submitButtonText}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ml-2">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}