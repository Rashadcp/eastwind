"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatImageUrl } from "@/utils/image";
import { cachedFetch } from "@/utils/apiCache";

interface PolicySection {
  id?: string;
  title: string;
  content: string;
  order?: number;
}

interface PrivacyPolicyData {
  id: string;
  heroTitle: string;
  heroTagline: string;
  heroBgImage: string;
  effectiveDate: string;
  introText: string;
  sections: PolicySection[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

const DEFAULT_DATA: PrivacyPolicyData = {
  id: "default",
  heroTitle: "Privacy Policy",
  heroTagline: "Data Protection & Regulatory Compliance",
  heroBgImage: "/about_hero_bg.png?v=3",
  effectiveDate: "September 14, 2026",
  introText: "East Wind Safety is dedicated to upholding the highest standards of confidentiality, data integrity, and privacy governance. This policy details our data protection practices in full compliance with the Kingdom of Saudi Arabia Personal Data Protection Law (PDPL).",
  sections: [
    {
      id: "sec-scope",
      title: "1. Scope & Regulatory Framework",
      content: "This Privacy Policy governs the collection, processing, storage, and transfer of personal, corporate, and technical data by East Wind Safety ('East Wind', 'we', 'us', or 'our') through our official digital portals, customer portals, request-for-quotation (RFQ) pipelines, and physical engineering operations across the Kingdom of Saudi Arabia.\n\nOur operations strictly adhere to the Saudi Personal Data Protection Law (PDPL) enacted by Royal Decree No. M/19, its Implementing Regulations issued by the Saudi Data & AI Authority (SDAIA), and relevant cybersecurity directives issued by the National Cybersecurity Authority (NCA).",
      order: 1
    },
    {
      id: "sec-collection",
      title: "2. Categories of Information We Collect",
      content: "We collect only the data necessary to fulfill technical engineering solutions, deliver certified life safety equipment, and maintain regulatory compliance:\n\n• Professional & Contact Identification: Full name, business email address, direct telephone/mobile numbers, corporate affiliation, job title, and engineering department.\n• Project & Engineering Specifications: Facility hazard classifications (ATEX/IECEx Zones 0, 1, 2), HCIS regulatory safety directives, technical RFQ documentation, bill of materials, and site delivery parameters.\n• Digital & Device Telemetry: IP addresses, approximate geographic location, browser metadata, operating system metrics, and navigational pathways across our public catalog to optimize digital performance and prevent unauthorized intrusion.",
      order: 2
    },
    {
      id: "sec-purpose",
      title: "3. Lawful Basis & Purposes of Processing",
      content: "East Wind processes collected data strictly pursuant to lawful bases defined under KSA PDPL:\n\n• Contractual Execution: Processing requests for quotation, issuing commercial and technical proposals, executing system integration projects, and fulfilling warranty and maintenance contracts.\n• Regulatory Compliance: Satisfying mandatory audit and traceability obligations mandated by the High Commission for Industrial Security (HCIS), Saudi Standards, Metrology and Quality Organization (SASO), and the General Authority of Zakat and Tax (ZATCA).\n• Legitimate Business Interests: Maintaining cybersecurity vigilance, preventing industrial espionage, authenticating administrative accounts via multi-factor authentication, and improving our safety instrumentation offerings.",
      order: 3
    },
    {
      id: "sec-storage",
      title: "4. Data Storage, Residency & Cross-Border Transfers",
      content: "In compliance with KSA data sovereignty mandates, all core databases, enterprise resource systems, and client records are hosted on secure servers and certified cloud infrastructure physically located within the Kingdom of Saudi Arabia.\n\nCross-border transfers of data occur only in limited scenarios involving foreign certified original equipment manufacturers (OEMs) for specialized sensor calibration, factory acceptance testing, or international warranty registration. Such transfers are governed by SDAIA-approved Standard Contractual Clauses (SCCs) ensuring an adequate level of data protection.",
      order: 4
    },
    {
      id: "sec-security",
      title: "5. Information Security & Safeguards",
      content: "East Wind enforces enterprise-grade physical, technical, and procedural security controls to safeguard data from loss, unauthorized disclosure, or malicious tampering:\n\n• Transport Layer Security (TLS 1.3) cryptographic protocols for all data in transit.\n• AES-256 encryption for sensitive records stored at rest.\n• Strict role-based access control (RBAC) limiting employee data access strictly to a 'need-to-know' basis.\n• Routine vulnerability assessments and automated cyber-incident logging.",
      order: 5
    },
    {
      id: "sec-rights",
      title: "6. Data Subject Rights Under KSA PDPL",
      content: "Under the Saudi Personal Data Protection Law, individuals have enforceable rights regarding their personal data:\n\n• Right to Know: The right to be informed about the lawful basis and purpose of data collection.\n• Right of Access: The right to inspect and obtain a readable copy of personal data held by East Wind.\n• Right to Rectification: The right to request correction, completion, or updating of inaccurate data.\n• Right to Destruction: The right to request erasure of data that is no longer required for its lawful purpose, subject to statutory retention limits.\n• Right to Withdraw Consent: The right to revoke consent for optional marketing communications at any time without retroactive prejudice.",
      order: 6
    },
    {
      id: "sec-retention",
      title: "7. Retention Periods",
      content: "Personal and corporate data is retained only for the duration required to satisfy the operational purpose for which it was gathered, or as required by applicable statutory and regulatory retention mandates (typically 5 to 10 years for engineering project documentation, taxation, and statutory safety audit trails under Saudi law). Upon expiration of the retention window, records are permanently purged or irreversibly anonymized.",
      order: 7
    },
    {
      id: "sec-contact",
      title: "8. Data Protection Officer & Inquiries",
      content: "To exercise any of your statutory rights, submit a privacy complaint, or request clarification regarding our data governance policies, please contact our Data Protection and Compliance Department:\n\nEast Wind Safety Integrator\nAttn: Data Protection Officer\nP14, 2nd Industrial City, Dammam, Kingdom of Saudi Arabia\nEmail: enquiry@eastwind.sa\nTelephone: +966 570 833 214",
      order: 8
    }
  ],
  contactEmail: "enquiry@eastwind.sa",
  contactPhone: "+966 570 833 214",
  contactAddress: "P14, 2nd Industrial City, Dammam, Kingdom of Saudi Arabia"
};

export default function PrivacyPolicyPage() {
  const [data, setData] = useState<PrivacyPolicyData>(DEFAULT_DATA);

  useEffect(() => {
    async function fetchPolicy() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await cachedFetch<PrivacyPolicyData>(
          `${baseUrl}/api/privacy-policy?t=${Date.now()}`,
          { fallback: DEFAULT_DATA, cache: "no-store" }
        );
        if (res) {
          setData({
            id: res.id || "default",
            heroTitle: res.heroTitle || DEFAULT_DATA.heroTitle,
            heroTagline: res.heroTagline || DEFAULT_DATA.heroTagline,
            heroBgImage: res.heroBgImage || DEFAULT_DATA.heroBgImage,
            effectiveDate: res.effectiveDate || DEFAULT_DATA.effectiveDate,
            introText: res.introText ?? DEFAULT_DATA.introText,
            sections: Array.isArray(res.sections) && res.sections.length > 0 ? res.sections : DEFAULT_DATA.sections,
            contactEmail: res.contactEmail || DEFAULT_DATA.contactEmail,
            contactPhone: res.contactPhone || DEFAULT_DATA.contactPhone,
            contactAddress: res.contactAddress || DEFAULT_DATA.contactAddress
          });
        }
      } catch (e) {
        console.error("Privacy policy fetch error:", e);
      }
    }

    fetchPolicy();

    const handleCacheCleared = () => fetchPolicy();
    window.addEventListener("cms-cache-cleared", handleCacheCleared);
    return () => window.removeEventListener("cms-cache-cleared", handleCacheCleared);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#1e3e8f] selection:text-white antialiased">
      <Navbar />

      {/* 1. CINEMATIC HERO BANNER */}
      <section className="relative min-h-[440px] pt-32 pb-20 flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background Image with Dark Vignette */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('${formatImageUrl(data.heroBgImage, "/about_hero_bg.png?v=3")}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/90" />
        
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3e8f_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-5">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {data.heroTitle}
          </h1>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {data.heroTagline}
          </p>

          {/* Effective Date Stamp */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Effective Date: <strong className="text-white">{data.effectiveDate}</strong></span>
            <span className="mx-1.5 opacity-40">•</span>
            <span>Jurisdiction: <strong className="text-white">Kingdom of Saudi Arabia</strong></span>
          </div>
        </div>
      </section>

      {/* 2. CORE STATUTORY HIGHLIGHTS STRIP */}
      <section className="bg-white border-b border-slate-200 py-6 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#1e3e8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900">KSA Data Residency</span>
              <span className="text-[11px] text-slate-500">Hosted locally in KSA</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900">AES-256 & TLS 1.3</span>
              <span className="text-[11px] text-slate-500">Encrypted in transit & rest</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V7m0 4h4m-4 0H7" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900">HCIS SAF Standard</span>
              <span className="text-[11px] text-slate-500">Audited safety traceability</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#c22026]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900">Enforceable Rights</span>
              <span className="text-[11px] text-slate-500">Full KSA PDPL protections</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN POLICY CONTENT LAYOUT */}
      <main className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">
        
        {/* Executive Summary Card */}
        {data.introText && (
          <div className="mb-8 p-5 sm:p-6 bg-white border border-slate-200/90 rounded-sm shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#1e3e8f]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1e3e8f] font-bold block mb-1.5">
              Executive Statement
            </span>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
              {data.introText}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {data.sections.map((sec, idx) => (
            <article
              key={sec.id || idx}
              id={`section-${idx}`}
              className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-sm shadow-xs hover:shadow-md hover:border-[#1e3e8f]/40 transition-all duration-200 flex flex-col justify-start space-y-3"
            >
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1e3e8f] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {sec.title}
                </h2>
              </div>

              <div className="text-slate-600 text-xs sm:text-[13px] leading-relaxed space-y-2 font-normal whitespace-pre-line flex-1">
                {sec.content}
              </div>
            </article>
          ))}

          {/* Regulatory Contact & DPO Card */}
          <div className="md:col-span-2 p-5 sm:p-6 bg-gradient-to-br from-[#1e3e8f]/5 via-white to-slate-50 border border-[#1e3e8f]/20 rounded-sm shadow-xs space-y-4 mt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1e3e8f] text-white flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Data Protection Officer & Governance Contact</h3>
                <p className="text-[11px] text-slate-500">Official statutory communications channel for data subject requests</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-700 pt-3 border-t border-slate-200/60">
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Email Communications:</strong>
                <a 
                  href={`mailto:${data.contactEmail}`}
                  className="text-[#1e3e8f] hover:underline font-medium break-all"
                >
                  {data.contactEmail}
                </a>
              </div>
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Telephone Inquiries:</strong>
                <a 
                  href={`tel:${data.contactPhone}`}
                  className="text-slate-700 hover:text-[#1e3e8f] font-medium"
                >
                  {data.contactPhone}
                </a>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <strong className="block text-slate-900 font-semibold mb-0.5">Registered Physical Office:</strong>
                <span className="text-slate-600 font-normal">{data.contactAddress}</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
