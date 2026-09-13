"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

interface HomeMetric {
  value: string;
  label: string;
  desc: string;
}

interface PositioningItem {
  title: string;
  text: string;
}

interface PageMetric {
  value: string;
  label: string;
  desc: string;
  accent: string;
}

interface DisciplineItem {
  title: string;
  desc: string;
  accent: string;
}

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<"home" | "about_page">("home");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Tab 1: Home Page About State
  const [homeImage, setHomeImage] = useState<string>("/products/default-process-instrumentation.png");
  const [homeTitle, setHomeTitle] = useState<string>("Sustaining Regional Safety Infrastructure");
  const [homeOverview, setHomeOverview] = useState<string>("East Wind operates as a regional, end-to-end safety solutions provider delivering the complete lifecycle of safety projects across mission-critical infrastructure segments.");
  const [homeSecondary, setHomeSecondary] = useState<string>("Our core strength centers on adopting and implementing the latest safety technologies to solve complex, high-risk challenges—improving safety performance while reducing total cost of ownership (TCO) for our clients.");
  const [homeMetrics, setHomeMetrics] = useState<HomeMetric[]>([
    {
      value: "70%",
      label: "Technical Functions Weight",
      desc: "Dedicated to application engineering, cross-disciplinary integration, workshops, and instrument field services."
    },
    {
      value: "10+",
      label: "Certified Personnel Scale",
      desc: "Housing internal multi-disciplinary functions spanning mechanical, electrical, and functional safety architecture."
    }
  ]);
  const [homeLifecycleSteps, setHomeLifecycleSteps] = useState<string[]>([
    "Concept Studies & Solution Selection",
    "Safety Systems Integration",
    "Manufacturing & Assembly",
    "Installation & Commissioning",
    "Project Management Leadership",
    "Long-Term After-Sales Support"
  ]);

  // Tab 2: Dedicated About Page State
  const [pageHeroBgImage, setPageHeroBgImage] = useState<string>("/about_hero_bg.png?v=3");
  const [pageHeroTagline, setPageHeroTagline] = useState<string>("Company Overview");
  const [pageHeroTitle, setPageHeroTitle] = useState<string>("Mission-Critical Safety Infrastructure");
  const [pageHeroDescription, setPageHeroDescription] = useState<string>("East Wind is a specialized safety solutions provider in Saudi Arabia, delivering the entire lifecycle of engineered projects.");
  const [pageMandateBadge, setPageMandateBadge] = useState<string>("Operational Strength");
  const [pageMandateTitle, setPageMandateTitle] = useState<string>("Our Core Safety Mandate");
  const [pageMandateParagraph1, setPageMandateParagraph1] = useState<string>("East Wind operates with a core strength centered on implementing advanced, cyber-physical safety technologies to address high-risk industrial safety challenges. We take full regional ownership of engineered packages, ensuring that refinery control rooms, offshore platforms, and hazardous factories are protected against thermal, kinetic, and chemical events.");
  const [pageMandateParagraph2, setPageMandateParagraph2] = useState<string>("By integrating smart IoT sensors, intrinsically safe Zone 1 mobile devices, and physics-informed neural network analytics, we help major industrial plants shift from reactive emergency firefighting to proactive, automated safety control loops. This unified approach drastically lowers client Total Cost of Ownership (TCO) while guaranteeing absolute safety compliance.");
  const [pageFacilityImage, setPageFacilityImage] = useState<string>("/analyzer_shelter.webp");
  const [pageFacilityCode, setPageFacilityCode] = useState<string>("SYS.FACILITY.IMG.01");
  const [pagePositioning, setPagePositioning] = useState<PositioningItem[]>([
    {
      title: "Regional Safety Leader",
      text: "Recognized as one of the region’s premier providers of high-end, complex industrial safety systems."
    },
    {
      title: "HCIS Standard Authority",
      text: "Trusted engineering partner executing projects certified to SAF-01, SAF-12, and SASO directives."
    },
    {
      title: "Lifecycle Ownership",
      text: "We take full responsibility from early conceptual hazard studies to system integration and lifetime support."
    }
  ]);
  const [pageMetrics, setPageMetrics] = useState<PageMetric[]>([
    {
      value: "70%",
      label: "Technical Functions Weight",
      desc: "Applications engineering, hardware assembly projects, instrument service, and predictive AI loops.",
      accent: "#1e3e8f"
    },
    {
      value: "10+",
      label: "Engineers & Technicians",
      desc: "Highly trained, certified local technical workforce executing complex regional deployments.",
      accent: "#c22026"
    },
    {
      value: "KSA",
      label: "Central Integration Facilities",
      desc: "Based in Dammam, featuring engineering office rooms, assembly workshops, and calibration labs.",
      accent: "#1e3e8f"
    }
  ]);
  const [pageDisciplines, setPageDisciplines] = useState<DisciplineItem[]>([
    {
      title: "Project Management",
      desc: "Rigorous execution, delivery leadership, and interface coordination across multi-vendor networks.",
      accent: "#1e3e8f"
    },
    {
      title: "QA/QC & Compliance",
      desc: "Assuring design safety factors, testing verification logs, and international standard conformance.",
      accent: "#c22026"
    },
    {
      title: "Structural Engineering",
      desc: "Blast deflection modeling and thermal isolation calculations for heavy protective enclosures.",
      accent: "#1e3e8f"
    },
    {
      title: "Instrumentation Engineering",
      desc: "Loop diagrams, calibration parameters, and field transmitter mesh networks alignment.",
      accent: "#c22026"
    },
    {
      title: "Electrical Engineering",
      desc: "Hazardous area classifications, load calculations, and electrical protection wiring.",
      accent: "#1e3e8f"
    },
    {
      title: "Fire & Gas Engineering",
      desc: "Wired and wireless SIL-rated detection loop mapping, warning alarms, and telemetry integration.",
      accent: "#c22026"
    },
    {
      title: "HVAC Engineering",
      desc: "Overpressure control dampers, automated gas isolation loops, and explosion-proof air cooling.",
      accent: "#1e3e8f"
    },
    {
      title: "Safety Engineering",
      desc: "Functional safety analysis, hazard mapping, and toxic refuge atmosphere maintenance loops.",
      accent: "#c22026"
    },
    {
      title: "Telecommunications",
      desc: "Multi-hop mesh radio telemetry, emergency call routing, and inter-agency gateway bridges.",
      accent: "#1e3e8f"
    },
    {
      title: "HSE Engineering",
      desc: "Comprehensive site safety programs, Zone 1 mobile permitted checklists, and HSE consultancy.",
      accent: "#c22026"
    }
  ]);
  const [pageCtaTitle, setPageCtaTitle] = useState<string>("Partner with East Wind Arabia");
  const [pageCtaDescription, setPageCtaDescription] = useState<string>("Ready to draft a safety layout or request an onsite calibration analysis? Speak directly to our integration team at Dammam to outline your project scope.");
  const [pageCtaButtonText, setPageCtaButtonText] = useState<string>("Consult an Engineer");

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Load existing data from backend API
  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/about`);
      if (!res.ok) throw new Error("Failed to fetch About section settings");
      const list = await res.json();
      
      const homeDoc = list.find((item: any) => item.id === "home");
      if (homeDoc) {
        if (homeDoc.imageUrl !== undefined) setHomeImage(homeDoc.imageUrl);
        if (homeDoc.title !== undefined) setHomeTitle(homeDoc.title);
        if (homeDoc.overviewText !== undefined) setHomeOverview(homeDoc.overviewText);
        if (homeDoc.secondaryText !== undefined) setHomeSecondary(homeDoc.secondaryText);
        if (Array.isArray(homeDoc.metrics)) setHomeMetrics(homeDoc.metrics);
        if (Array.isArray(homeDoc.lifecycleSteps)) setHomeLifecycleSteps(homeDoc.lifecycleSteps);
      }

      const pageDoc = list.find((item: any) => item.id === "about_page");
      if (pageDoc) {
        if (pageDoc.heroBgImage !== undefined) setPageHeroBgImage(pageDoc.heroBgImage);
        if (pageDoc.heroTagline !== undefined) setPageHeroTagline(pageDoc.heroTagline);
        if (pageDoc.heroTitle !== undefined) setPageHeroTitle(pageDoc.heroTitle);
        if (pageDoc.heroDescription !== undefined) setPageHeroDescription(pageDoc.heroDescription);
        if (pageDoc.mandateBadge !== undefined) setPageMandateBadge(pageDoc.mandateBadge);
        if (pageDoc.mandateTitle !== undefined) setPageMandateTitle(pageDoc.mandateTitle);
        if (pageDoc.mandateParagraph1 !== undefined) setPageMandateParagraph1(pageDoc.mandateParagraph1);
        if (pageDoc.mandateParagraph2 !== undefined) setPageMandateParagraph2(pageDoc.mandateParagraph2);
        if (pageDoc.facilityImage !== undefined) setPageFacilityImage(pageDoc.facilityImage);
        if (pageDoc.facilityCode !== undefined) setPageFacilityCode(pageDoc.facilityCode);
        if (Array.isArray(pageDoc.positioning)) setPagePositioning(pageDoc.positioning);
        if (Array.isArray(pageDoc.metrics)) setPageMetrics(pageDoc.metrics);
        if (Array.isArray(pageDoc.disciplines)) setPageDisciplines(pageDoc.disciplines);
        if (pageDoc.ctaTitle !== undefined) setPageCtaTitle(pageDoc.ctaTitle);
        if (pageDoc.ctaDescription !== undefined) setPageCtaDescription(pageDoc.ctaDescription);
        if (pageDoc.ctaButtonText !== undefined) setPageCtaButtonText(pageDoc.ctaButtonText);
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to load About section data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Image Upload handler for dynamic fields
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearMessages();
    setUploadingField(fieldName);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      // 1. Upload file to backend disk via /api/upload
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
          setter(uploadedUrl);
          setSuccess(`Image '${file.name}' uploaded successfully.`);
          setUploadingField(null);
          return;
        }
      }

      // 2. Client-side Canvas fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
            setter(compressedDataUrl);
            setSuccess(`Image '${file.name}' previewed successfully.`);
            setUploadingField(null);
            return;
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload image file.");
      setUploadingField(null);
    }
  };

  // Save Home Page About Section
  const handleSaveHome = async (sectionLabel?: string | React.MouseEvent) => {
    const label = typeof sectionLabel === "string" ? sectionLabel : undefined;
    clearMessages();
    setSaving(true);
    if (label) setSavingSection(label);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const payload = {
        image: homeImage,
        title: homeTitle,
        overview: homeOverview,
        secondary: homeSecondary,
        metrics: homeMetrics,
        lifecycleSteps: homeLifecycleSteps,
      };

      const res = await fetch(`${baseUrl}/api/about/home`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to update ${label || "Home About section"}`);

      setSuccess(label ? `${label} updated and saved successfully!` : "Home Page About section updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save Home Page About changes.");
    } finally {
      setSaving(false);
      setSavingSection(null);
    }
  };

  // Save Dedicated About Page Section
  const handleSaveAboutPage = async (sectionLabel?: string | React.MouseEvent) => {
    const label = typeof sectionLabel === "string" ? sectionLabel : undefined;
    clearMessages();
    setSaving(true);
    if (label) setSavingSection(label);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const payload = {
        heroBgImage: pageHeroBgImage,
        heroTagline: pageHeroTagline,
        heroTitle: pageHeroTitle,
        heroDescription: pageHeroDescription,
        mandateBadge: pageMandateBadge,
        mandateTitle: pageMandateTitle,
        mandateParagraph1: pageMandateParagraph1,
        mandateParagraph2: pageMandateParagraph2,
        facilityImage: pageFacilityImage,
        facilityCode: pageFacilityCode,
        positioning: pagePositioning,
        metrics: pageMetrics,
        disciplines: pageDisciplines,
        ctaTitle: pageCtaTitle,
        ctaDescription: pageCtaDescription,
        ctaButtonText: pageCtaButtonText,
      };

      const res = await fetch(`${baseUrl}/api/about/about_page`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to update ${label || "About Page section"}`);

      setSuccess(label ? `${label} updated and saved successfully!` : "Dedicated About Page content updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save About Page changes.");
    } finally {
      setSaving(false);
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#1e3e8f] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading About Section Content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">About Section Content</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure dynamic titles, narratives, visual assets, metrics, and engineering disciplines for Home and Dedicated About Page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-200 rounded-sm">
            <button
              onClick={() => { setActiveTab("home"); clearMessages(); }}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "home"
                  ? "bg-white text-[#1e3e8f] shadow-xs font-bold border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Home About Section
            </button>
            <button
              onClick={() => { setActiveTab("about_page"); clearMessages(); }}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "about_page"
                  ? "bg-white text-[#1e3e8f] shadow-xs font-bold border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dedicated About Page
            </button>
          </div>

          <button
            type="button"
            onClick={activeTab === "home" ? handleSaveHome : handleSaveAboutPage}
            disabled={saving}
            className="px-4 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm shadow-xs cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            {saving ? "Saving..." : "Save Changes"}
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

      {/* TAB 1: HOME PAGE ABOUT SECTION */}
      {activeTab === "home" && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Home Page About Header & Asset
              </h2>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveHome("About Header & Asset")}
                className="px-3 py-1.5 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] cursor-pointer disabled:opacity-50 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{saving && savingSection === "About Header & Asset" ? "Saving..." : "Save Header"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Main Header Title</label>
                <input
                  type="text"
                  value={homeTitle}
                  onChange={(e) => setHomeTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                  placeholder="e.g. Sustaining Regional Safety Infrastructure"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Main Image Path or URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={homeImage}
                    onChange={(e) => setHomeImage(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    placeholder="e.g. /about.png or /uploads/image.png"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="home-image-upload"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setHomeImage, "homeImage")}
                  />
                  <label
                    htmlFor="home-image-upload"
                    className="px-3.5 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white rounded-sm text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors"
                  >
                    {uploadingField === "homeImage" ? "Uploading..." : "Upload File"}
                  </label>
                </div>
                {/* Home Image Preview */}
                {homeImage && homeImage.trim() !== "" && (
                  <div className="mt-3 w-fit max-w-xl rounded-sm border border-slate-200 bg-slate-50 p-1.5">
                    <img
                      src={formatImageUrl(homeImage)}
                      alt="Home About Preview"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = "none";
                      }}
                      className="h-36 sm:h-44 w-auto max-w-full rounded-sm object-contain block"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Overview Paragraph</label>
                <textarea
                  rows={4}
                  value={homeOverview}
                  onChange={(e) => setHomeOverview(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 leading-relaxed"
                  placeholder="Overview text..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Secondary Lifecycle Narrative</label>
                <textarea
                  rows={4}
                  value={homeSecondary}
                  onChange={(e) => setHomeSecondary(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 leading-relaxed"
                  placeholder="Secondary text..."
                />
              </div>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Quantitative Data Metrics ({homeMetrics.length})
              </h2>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setHomeMetrics([...homeMetrics, { value: "0%", label: "New Metric", desc: "Metric description text" }])}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-sm hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Add Metric</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveHome("Quantitative Metrics")}
                  className="px-3 py-1.5 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{saving && savingSection === "Quantitative Metrics" ? "Saving..." : "Save Metrics"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homeMetrics.map((m, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-sm bg-slate-50/50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => setHomeMetrics(homeMetrics.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 text-rose-600 hover:text-rose-800 font-medium text-xs cursor-pointer"
                  >
                    Remove
                  </button>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metric Value</label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => {
                        const updated = [...homeMetrics];
                        updated[idx].value = e.target.value;
                        setHomeMetrics(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                      placeholder="e.g. 70% or 10+"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metric Title / Label</label>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => {
                        const updated = [...homeMetrics];
                        updated[idx].label = e.target.value;
                        setHomeMetrics(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                      placeholder="e.g. Technical Functions Weight"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metric Description</label>
                    <textarea
                      rows={2}
                      value={m.desc}
                      onChange={(e) => {
                        const updated = [...homeMetrics];
                        updated[idx].desc = e.target.value;
                        setHomeMetrics(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 resize-none"
                      placeholder="Detail text explaining metric..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lifecycle Steps */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Lifecycle Capabilities ({homeLifecycleSteps.length})
              </h2>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setHomeLifecycleSteps([...homeLifecycleSteps, "New Lifecycle Capability"])}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-sm hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Add Step</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveHome("Lifecycle Steps")}
                  className="px-3 py-1.5 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{saving && savingSection === "Lifecycle Steps" ? "Saving..." : "Save Steps"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {homeLifecycleSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2.5 border border-slate-200 rounded-sm bg-slate-50/50">
                  <span className="w-5 h-5 rounded-xs bg-blue-50 text-[#1e3e8f] border border-blue-200 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => {
                      const updated = [...homeLifecycleSteps];
                      updated[idx] = e.target.value;
                      setHomeLifecycleSteps(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setHomeLifecycleSteps(homeLifecycleSteps.filter((_, i) => i !== idx))}
                    className="text-rose-600 hover:text-rose-800 font-medium text-xs shrink-0 cursor-pointer px-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-6 p-4 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Ready to save and publish updates to the Home Page About section</span>
            </div>
            <button
              type="button"
              onClick={handleSaveHome}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Home Page About Changes"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: DEDICATED ABOUT PAGE SECTION */}
      {activeTab === "about_page" && (
        <div className="space-y-6">
          
          {/* Hero Header Settings */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              About Page Hero Header & Background Asset
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Tagline / Badge</label>
                <input
                  type="text"
                  value={pageHeroTagline}
                  onChange={(e) => setPageHeroTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                  placeholder="e.g. Company Overview"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Title</label>
                <input
                  type="text"
                  value={pageHeroTitle}
                  onChange={(e) => setPageHeroTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                  placeholder="e.g. Mission-Critical Safety Infrastructure"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Description Paragraph</label>
              <textarea
                rows={2}
                value={pageHeroDescription}
                onChange={(e) => setPageHeroDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                placeholder="Hero overview paragraph text..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Background Image Path or URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pageHeroBgImage}
                  onChange={(e) => setPageHeroBgImage(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                  placeholder="e.g. /about_hero_bg.png or /uploads/hero.png"
                />
                <input
                  type="file"
                  accept="image/*"
                  id="page-hero-upload"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setPageHeroBgImage, "heroBgImage")}
                />
                <label
                  htmlFor="page-hero-upload"
                  className="px-3.5 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white rounded-sm text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors"
                >
                  {uploadingField === "heroBgImage" ? "Uploading..." : "Upload File"}
                </label>
              </div>

              {/* Hero Image Preview */}
              {pageHeroBgImage && pageHeroBgImage.trim() !== "" && (
                <div className="mt-3 w-fit max-w-xl rounded-sm border border-slate-200 bg-slate-50 p-1.5">
                  <img
                    src={formatImageUrl(pageHeroBgImage)}
                    alt="About Hero Background Preview"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = "none";
                    }}
                    className="h-36 sm:h-44 w-auto max-w-full rounded-sm object-contain block"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mandate & Facility Section */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              Core Mandate & Facility Showcase Image
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mandate Section Badge</label>
                <input
                  type="text"
                  value={pageMandateBadge}
                  onChange={(e) => setPageMandateBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                  placeholder="e.g. Operational Strength"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mandate Section Title</label>
                <input
                  type="text"
                  value={pageMandateTitle}
                  onChange={(e) => setPageMandateTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                  placeholder="e.g. Our Core Safety Mandate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mandate Paragraph 1</label>
              <textarea
                rows={3}
                value={pageMandateParagraph1}
                onChange={(e) => setPageMandateParagraph1(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mandate Paragraph 2</label>
              <textarea
                rows={3}
                value={pageMandateParagraph2}
                onChange={(e) => setPageMandateParagraph2(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facility Showcase Image Path or URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pageFacilityImage}
                    onChange={(e) => setPageFacilityImage(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    placeholder="e.g. /analyzer_shelter.webp or /uploads/facility.png"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="page-facility-upload"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setPageFacilityImage, "facilityImage")}
                  />
                  <label
                    htmlFor="page-facility-upload"
                    className="px-3.5 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white rounded-sm text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors"
                  >
                    {uploadingField === "facilityImage" ? "Uploading..." : "Upload File"}
                  </label>
                </div>

                {/* Facility Image Preview */}
                {pageFacilityImage && pageFacilityImage.trim() !== "" && (
                  <div className="mt-3 w-fit max-w-xl rounded-sm border border-slate-200 bg-slate-50 p-1.5">
                    <img
                      src={formatImageUrl(pageFacilityImage)}
                      alt="Facility Showcase Preview"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = "none";
                      }}
                      className="h-36 sm:h-44 w-auto max-w-full rounded-sm object-contain block"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facility Technical Reference Code</label>
                <input
                  type="text"
                  value={pageFacilityCode}
                  onChange={(e) => setPageFacilityCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                  placeholder="e.g. SYS.FACILITY.IMG.01"
                />
              </div>
            </div>
          </div>

          {/* Positioning Pillars */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Core Market Positioning Pillars ({pagePositioning.length})
              </h2>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPagePositioning([...pagePositioning, { title: "New Pillar", text: "Pillar description text" }])}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-sm hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Add Pillar</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveAboutPage("Positioning Pillars")}
                  className="px-3 py-1.5 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{saving && savingSection === "Positioning Pillars" ? "Saving..." : "Save Pillars"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pagePositioning.map((pos, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-sm bg-slate-50/50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => setPagePositioning(pagePositioning.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-rose-600 hover:text-rose-800 font-medium text-xs cursor-pointer"
                  >
                    Remove
                  </button>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pillar Title</label>
                    <input
                      type="text"
                      value={pos.title}
                      onChange={(e) => {
                        const updated = [...pagePositioning];
                        updated[idx].title = e.target.value;
                        setPagePositioning(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pillar Text</label>
                    <textarea
                      rows={3}
                      value={pos.text}
                      onChange={(e) => {
                        const updated = [...pagePositioning];
                        updated[idx].text = e.target.value;
                        setPagePositioning(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corporate Metrics */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Corporate Metrics Cards ({pageMetrics.length})
              </h2>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPageMetrics([...pageMetrics, { value: "100%", label: "New Metric", desc: "Description text", accent: "#1e3e8f" }])}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-sm hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Add Metric Card</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveAboutPage("Corporate Metrics")}
                  className="px-3 py-1.5 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{saving && savingSection === "Corporate Metrics" ? "Saving..." : "Save Metrics"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pageMetrics.map((m, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-sm bg-slate-50/50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => setPageMetrics(pageMetrics.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-rose-600 hover:text-rose-800 font-medium text-xs cursor-pointer"
                  >
                    Remove
                  </button>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metric Value</label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => {
                        const updated = [...pageMetrics];
                        updated[idx].value = e.target.value;
                        setPageMetrics(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metric Title</label>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => {
                        const updated = [...pageMetrics];
                        updated[idx].label = e.target.value;
                        setPageMetrics(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Metric Description</label>
                    <textarea
                      rows={2}
                      value={m.desc}
                      onChange={(e) => {
                        const updated = [...pageMetrics];
                        updated[idx].desc = e.target.value;
                        setPageMetrics(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Accent Hex Color</label>
                    <input
                      type="text"
                      value={m.accent}
                      onChange={(e) => {
                        const updated = [...pageMetrics];
                        updated[idx].accent = e.target.value;
                        setPageMetrics(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 font-mono"
                      placeholder="#1e3e8f or #c22026"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Disciplines */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Engineering Disciplines Matrix ({pageDisciplines.length})
              </h2>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPageDisciplines([...pageDisciplines, { title: "New Discipline", desc: "Discipline overview desc", accent: "#1e3e8f" }])}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-sm hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Add Discipline</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveAboutPage("Engineering Disciplines")}
                  className="px-3 py-1.5 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{saving && savingSection === "Engineering Disciplines" ? "Saving..." : "Save Disciplines"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageDisciplines.map((d, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-sm bg-slate-50/50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => setPageDisciplines(pageDisciplines.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 text-rose-600 hover:text-rose-800 font-medium text-xs cursor-pointer"
                  >
                    Remove
                  </button>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Discipline Name</label>
                    <input
                      type="text"
                      value={d.title}
                      onChange={(e) => {
                        const updated = [...pageDisciplines];
                        updated[idx].title = e.target.value;
                        setPageDisciplines(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                      placeholder="e.g. Structural Engineering"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Scope Description</label>
                    <textarea
                      rows={2}
                      value={d.desc}
                      onChange={(e) => {
                        const updated = [...pageDisciplines];
                        updated[idx].desc = e.target.value;
                        setPageDisciplines(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 resize-none"
                      placeholder="Engineering discipline scope text..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Accent Hex (#1e3e8f or #c22026)</label>
                    <input
                      type="text"
                      value={d.accent}
                      onChange={(e) => {
                        const updated = [...pageDisciplines];
                        updated[idx].accent = e.target.value;
                        setPageDisciplines(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 font-mono"
                      placeholder="#1e3e8f or #c22026"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box Settings */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              Footer Call-to-Action Consultation Box
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">CTA Banner Title</label>
                <input
                  type="text"
                  value={pageCtaTitle}
                  onChange={(e) => setPageCtaTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">CTA Button Label</label>
                <input
                  type="text"
                  value={pageCtaButtonText}
                  onChange={(e) => setPageCtaButtonText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">CTA Paragraph Description</label>
              <textarea
                rows={2}
                value={pageCtaDescription}
                onChange={(e) => setPageCtaDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-6 p-4 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Ready to save and publish updates to the Dedicated About Page</span>
            </div>
            <button
              type="button"
              onClick={handleSaveAboutPage}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Dedicated About Page Changes"}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
