"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

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
      id: "sec-1",
      title: "1. Scope & Regulatory Framework",
      content: "This Privacy Policy governs the collection, processing, storage, and transfer of personal, corporate, and technical data by East Wind Safety ('East Wind', 'we', 'us', or 'our') through our official digital portals, customer portals, request-for-quotation (RFQ) pipelines, and physical engineering operations across the Kingdom of Saudi Arabia.\n\nOur operations strictly adhere to the Saudi Personal Data Protection Law (PDPL) enacted by Royal Decree No. M/19, its Implementing Regulations issued by the Saudi Data & AI Authority (SDAIA), and relevant cybersecurity directives issued by the National Cybersecurity Authority (NCA).",
      order: 1
    },
    {
      id: "sec-2",
      title: "2. Categories of Information We Collect",
      content: "We collect only the data necessary to fulfill technical engineering solutions, deliver certified life safety equipment, and maintain regulatory compliance:\n\n• Professional & Contact Identification: Full name, business email address, direct telephone/mobile numbers, corporate affiliation, job title, and engineering department.\n• Project & Engineering Specifications: Facility hazard classifications (ATEX/IECEx Zones 0, 1, 2), HCIS regulatory safety directives, technical RFQ documentation, bill of materials, and site delivery parameters.\n• Digital & Device Telemetry: IP addresses, approximate geographic location, browser metadata, operating system metrics, and navigational pathways across our public catalog to optimize digital performance and prevent unauthorized intrusion.",
      order: 2
    },
    {
      id: "sec-3",
      title: "3. Lawful Basis & Purposes of Processing",
      content: "East Wind processes collected data strictly pursuant to lawful bases defined under KSA PDPL:\n\n• Contractual Execution: Processing requests for quotation, issuing commercial and technical proposals, executing system integration projects, and fulfilling warranty and maintenance contracts.\n• Regulatory Compliance: Satisfying mandatory audit and traceability obligations mandated by the High Commission for Industrial Security (HCIS), Saudi Standards, Metrology and Quality Organization (SASO), and the General Authority of Zakat and Tax (ZATCA).\n• Legitimate Business Interests: Maintaining cybersecurity vigilance, preventing industrial espionage, authenticating administrative accounts via multi-factor authentication, and improving our safety instrumentation offerings.",
      order: 3
    },
    {
      id: "sec-4",
      title: "4. Data Storage, Residency & Cross-Border Transfers",
      content: "In compliance with KSA data sovereignty mandates, all core databases, enterprise resource systems, and client records are hosted on secure servers and certified cloud infrastructure physically located within the Kingdom of Saudi Arabia.\n\nCross-border transfers of data occur only in limited scenarios involving foreign certified original equipment manufacturers (OEMs) for specialized sensor calibration, factory acceptance testing, or international warranty registration. Such transfers are governed by SDAIA-approved Standard Contractual Clauses (SCCs) ensuring an adequate level of data protection.",
      order: 4
    },
    {
      id: "sec-5",
      title: "5. Information Security & Safeguards",
      content: "East Wind enforces enterprise-grade physical, technical, and procedural security controls to safeguard data from loss, unauthorized disclosure, or malicious tampering:\n\n• Transport Layer Security (TLS 1.3) cryptographic protocols for all data in transit.\n• AES-256 encryption for sensitive records stored at rest.\n• Strict role-based access control (RBAC) limiting employee data access strictly to a 'need-to-know' basis.\n• Routine vulnerability assessments and automated cyber-incident logging.",
      order: 5
    },
    {
      id: "sec-6",
      title: "6. Data Subject Rights Under KSA PDPL",
      content: "Under the Saudi Personal Data Protection Law, individuals have enforceable rights regarding their personal data:\n\n• Right to Know: The right to be informed about the lawful basis and purpose of data collection.\n• Right of Access: The right to inspect and obtain a readable copy of personal data held by East Wind.\n• Right to Rectification: The right to request correction, completion, or updating of inaccurate data.\n• Right to Destruction: The right to request erasure of data that is no longer required for its lawful purpose, subject to statutory retention limits.\n• Right to Withdraw Consent: The right to revoke consent for optional marketing communications at any time without retroactive prejudice.",
      order: 6
    },
    {
      id: "sec-7",
      title: "7. Retention Periods",
      content: "Personal and corporate data is retained only for the duration required to satisfy the operational purpose for which it was gathered, or as required by applicable statutory and regulatory retention mandates (typically 5 to 10 years for engineering project documentation, taxation, and statutory safety audit trails under Saudi law). Upon expiration of the retention window, records are permanently purged or irreversibly anonymized.",
      order: 7
    },
    {
      id: "sec-8",
      title: "8. Data Protection Officer & Inquiries",
      content: "To exercise any of your statutory rights, submit a privacy complaint, or request clarification regarding our data governance policies, please contact our Data Protection and Compliance Department:\n\nEast Wind Safety Integrator\nAttn: Data Protection Officer\nP14, 2nd Industrial City, Dammam, Kingdom of Saudi Arabia\nEmail: enquiry@eastwind.sa\nTelephone: +966 570 833 214",
      order: 8
    }
  ],
  contactEmail: "enquiry@eastwind.sa",
  contactPhone: "+966 570 833 214",
  contactAddress: "P14, 2nd Industrial City, Dammam, Kingdom of Saudi Arabia"
};

export default function AdminPrivacyPolicyPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Form State
  const [heroTitle, setHeroTitle] = useState<string>(DEFAULT_DATA.heroTitle);
  const [heroTagline, setHeroTagline] = useState<string>(DEFAULT_DATA.heroTagline);
  const [heroBgImage, setHeroBgImage] = useState<string>(DEFAULT_DATA.heroBgImage);
  const [effectiveDate, setEffectiveDate] = useState<string>(DEFAULT_DATA.effectiveDate);
  const [introText, setIntroText] = useState<string>(DEFAULT_DATA.introText);
  const [sections, setSections] = useState<PolicySection[]>(DEFAULT_DATA.sections);
  const [contactEmail, setContactEmail] = useState<string>(DEFAULT_DATA.contactEmail);
  const [contactPhone, setContactPhone] = useState<string>(DEFAULT_DATA.contactPhone);
  const [contactAddress, setContactAddress] = useState<string>(DEFAULT_DATA.contactAddress);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/privacy-policy?t=${Date.now()}`);
        if (res.ok) {
          const data: PrivacyPolicyData = await res.json();
          if (data) {
            setHeroTitle(data.heroTitle || DEFAULT_DATA.heroTitle);
            setHeroTagline(data.heroTagline || DEFAULT_DATA.heroTagline);
            setHeroBgImage(data.heroBgImage || DEFAULT_DATA.heroBgImage);
            setEffectiveDate(data.effectiveDate || DEFAULT_DATA.effectiveDate);
            setIntroText(data.introText ?? DEFAULT_DATA.introText);
            setSections(Array.isArray(data.sections) && data.sections.length > 0 ? data.sections : DEFAULT_DATA.sections);
            setContactEmail(data.contactEmail || DEFAULT_DATA.contactEmail);
            setContactPhone(data.contactPhone || DEFAULT_DATA.contactPhone);
            setContactAddress(data.contactAddress || DEFAULT_DATA.contactAddress);
          }
        }
      } catch (err: any) {
        console.error("Error loading privacy policy:", err);
        setError("Failed to load privacy policy settings from backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearMessages();
    setUploading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("image", file);

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.imageUrl || data.url || (data.filename ? `/uploads/${data.filename}` : "");
        if (uploadedUrl) {
          setHeroBgImage(uploadedUrl);
          setHasUnsavedChanges(true);
          setSuccess(`Hero background photo '${file.name}' uploaded successfully.`);
          setUploading(false);
          return;
        }
      }

      // Canvas fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            setHeroBgImage(canvas.toDataURL("image/png"));
            setHasUnsavedChanges(true);
            setSuccess(`Hero background '${file.name}' previewed successfully.`);
          }
          setUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setError("Failed to upload hero image.");
      setUploading(false);
    }
  };

  // Section Handlers
  const handleAddSection = () => {
    const newSec: PolicySection = {
      id: `sec-${Date.now()}`,
      title: `${sections.length + 1}. New Policy Clause`,
      content: "Enter detailed policy narrative, statutory provisions, and compliance requirements here...",
      order: sections.length + 1
    };
    setSections([...sections, newSec]);
    setHasUnsavedChanges(true);
  };

  const handleUpdateSection = (index: number, field: "title" | "content", value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
    setHasUnsavedChanges(true);
  };

  const handleDeleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === sections.length - 1)) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);
    setHasUnsavedChanges(true);
  };

  // Save Settings to Backend
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setSaving(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const payload = {
        heroTitle,
        heroTagline,
        heroBgImage,
        effectiveDate,
        introText,
        sections,
        contactEmail,
        contactPhone,
        contactAddress
      };

      const res = await fetch(`${baseUrl}/api/privacy-policy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update Privacy Policy");
      }

      setHasUnsavedChanges(false);
      setSuccess("Privacy Policy updated successfully! Changes are live on the public website.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save privacy policy.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#1e3e8f] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading Privacy Policy Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-50 text-[#1e3e8f] border border-blue-200 text-[10px] font-bold rounded-sm uppercase tracking-wider">
              Legal & Compliance
            </span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-600">KSA PDPL</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Privacy Policy Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure public Privacy Policy disclosures, regulatory clauses, and Data Protection Officer contact details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#1e3e8f] hover:underline self-start sm:self-auto"
          >
            Preview Live Site ↗
          </a>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-4 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{saving ? "Saving Changes..." : "Save Privacy Policy"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 text-rose-500 hover:text-rose-800 rounded-sm hover:bg-rose-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="p-1 text-emerald-500 hover:text-emerald-800 rounded-sm hover:bg-emerald-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: HERO & METADATA */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              1. Hero Banner & Document Details
            </h2>
            <span className="text-[11px] font-mono text-slate-500">KSA PDPL Alignment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Document Title</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => {
                  setHeroTitle(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                placeholder="e.g. Privacy Policy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subtitle / Tagline</label>
              <input
                type="text"
                value={heroTagline}
                onChange={(e) => {
                  setHeroTagline(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                placeholder="e.g. Data Protection & Regulatory Compliance"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Effective Date Stamp</label>
              <input
                type="text"
                value={effectiveDate}
                onChange={(e) => {
                  setEffectiveDate(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                placeholder="e.g. September 14, 2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Background Photo</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={heroBgImage}
                onChange={(e) => {
                  setHeroBgImage(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                placeholder="/about_hero_bg.png?v=3 or image URL"
              />
              <label className="px-3.5 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-semibold rounded-sm cursor-pointer shrink-0 transition-colors">
                {uploading ? "Uploading..." : "Upload Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Thumbnail Preview */}
            <div className="mt-3 h-28 w-full bg-slate-100 rounded-sm border border-slate-200 overflow-hidden relative">
              <img
                src={formatImageUrl(heroBgImage, "/about_hero_bg.png?v=3")}
                alt="Hero Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent flex items-end p-3">
                <span className="text-white text-xs font-medium drop-shadow-sm">Hero Banner Live Preview</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: INTRODUCTION SUMMARY */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            2. High-Level Executive Summary
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Introduction & Mandate Narrative</label>
            <textarea
              rows={3}
              value={introText}
              onChange={(e) => {
                setIntroText(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 resize-y leading-relaxed"
              placeholder="Enter opening executive statement about data protection commitment..."
            />
          </div>
        </div>

        {/* SECTION 3: POLICY SECTIONS REPEATER */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 m-0">
                3. Privacy Policy Articles & Clauses ({sections.length})
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Add, edit, reorder, or remove clauses to align with evolving Saudi regulations.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="px-3 py-1.5 bg-[#1e3e8f] hover:bg-[#162f6d] text-white rounded-sm text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Clause Section</span>
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="p-4 bg-slate-50/70 border border-slate-200 rounded-sm space-y-3 relative group transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1e3e8f] text-white text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {sec.title || `Clause #${idx + 1}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, "up")}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-sm disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMoveSection(idx, "down")}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-sm disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      ▼
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(idx)}
                      className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer ml-1"
                      title="Delete Clause"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Clause Title & Number</label>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => handleUpdateSection(idx, "title", e.target.value)}
                    placeholder="e.g. 1. Scope & Regulatory Framework"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#1e3e8f]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Clause Policy Content & Bullet Points</label>
                  <textarea
                    rows={6}
                    value={sec.content}
                    onChange={(e) => handleUpdateSection(idx, "content", e.target.value)}
                    placeholder="Enter detailed statutory clauses, bullet points (use •), and rules..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-[#1e3e8f] resize-y font-sans"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: DPO CONTACT & INQUIRIES */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            4. Data Protection Officer (DPO) & Regulatory Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Compliance Email</label>
              <input
                type="text"
                value={contactEmail}
                onChange={(e) => {
                  setContactEmail(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                placeholder="e.g. enquiry@eastwind.sa"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Compliance Telephone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                placeholder="e.g. +966 570 833 214"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Physical Registered Office Address</label>
            <input
              type="text"
              value={contactAddress}
              onChange={(e) => {
                setContactAddress(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              placeholder="e.g. P14, 2nd Industrial City, Dammam, Kingdom of Saudi Arabia"
            />
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs sticky bottom-4 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className={`w-2 h-2 rounded-full ${hasUnsavedChanges ? "bg-amber-500 animate-pulse" : "bg-emerald-500"} shrink-0`} />
            <span>
              {hasUnsavedChanges
                ? "You have unsaved changes — click Save to publish immediately to the live website."
                : "All privacy policy settings are synchronized with the live website."}
            </span>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm shadow-xs cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{saving ? "Saving Changes..." : "Save Privacy Policy"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
