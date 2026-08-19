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
        if (homeDoc.imageUrl) setHomeImage(homeDoc.imageUrl);
        if (homeDoc.title) setHomeTitle(homeDoc.title);
        if (homeDoc.overviewText) setHomeOverview(homeDoc.overviewText);
        if (homeDoc.secondaryText) setHomeSecondary(homeDoc.secondaryText);
        if (homeDoc.metrics && homeDoc.metrics.length > 0) setHomeMetrics(homeDoc.metrics);
        if (homeDoc.lifecycleSteps && homeDoc.lifecycleSteps.length > 0) setHomeLifecycleSteps(homeDoc.lifecycleSteps);
      }

      const pageDoc = list.find((item: any) => item.id === "about_page");
      if (pageDoc) {
        if (pageDoc.heroBgImage) setPageHeroBgImage(pageDoc.heroBgImage);
        if (pageDoc.heroTagline) setPageHeroTagline(pageDoc.heroTagline);
        if (pageDoc.heroTitle) setPageHeroTitle(pageDoc.heroTitle);
        if (pageDoc.heroDescription) setPageHeroDescription(pageDoc.heroDescription);
        if (pageDoc.mandateBadge) setPageMandateBadge(pageDoc.mandateBadge);
        if (pageDoc.mandateTitle) setPageMandateTitle(pageDoc.mandateTitle);
        if (pageDoc.mandateParagraph1) setPageMandateParagraph1(pageDoc.mandateParagraph1);
        if (pageDoc.mandateParagraph2) setPageMandateParagraph2(pageDoc.mandateParagraph2);
        if (pageDoc.facilityImage) setPageFacilityImage(pageDoc.facilityImage);
        if (pageDoc.facilityCode) setPageFacilityCode(pageDoc.facilityCode);
        if (pageDoc.positioning && pageDoc.positioning.length > 0) setPagePositioning(pageDoc.positioning);
        if (pageDoc.metrics && pageDoc.metrics.length > 0) setPageMetrics(pageDoc.metrics);
        if (pageDoc.disciplines && pageDoc.disciplines.length > 0) setPageDisciplines(pageDoc.disciplines);
        if (pageDoc.ctaTitle) setPageCtaTitle(pageDoc.ctaTitle);
        if (pageDoc.ctaDescription) setPageCtaDescription(pageDoc.ctaDescription);
        if (pageDoc.ctaButtonText) setPageCtaButtonText(pageDoc.ctaButtonText);
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to About backend node. Showing local defaults.");
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
  const handleSaveHome = async () => {
    clearMessages();
    setSaving(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const payload = {
        imageUrl: homeImage,
        title: homeTitle,
        overviewText: homeOverview,
        secondaryText: homeSecondary,
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
      if (!res.ok) throw new Error(data.error || "Failed to update Home Page About section");

      setSuccess("Home Page About section updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save Home Page About changes.");
    } finally {
      setSaving(false);
    }
  };

  // Save Dedicated About Page Section
  const handleSaveAboutPage = async () => {
    clearMessages();
    setSaving(true);

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
      if (!res.ok) throw new Error(data.error || "Failed to update About Page section");

      setSuccess("Dedicated About Page content updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save About Page changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading About Section Data Node...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 m-0">Manage About Section Content</h1>
          <p className="text-xs text-slate-500 mt-1 m-0">
            Configure dynamic titles, narratives, visual assets, metrics, and engineering disciplines for the Home Page and About Page independently.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => { setActiveTab("home"); clearMessages(); }}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home Page About Section
          </button>
          <button
            onClick={() => { setActiveTab("about_page"); clearMessages(); }}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "about_page"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dedicated About Page
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold cursor-pointer">✕</button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* TAB 1: HOME PAGE ABOUT SECTION */}
      {activeTab === "home" && (
        <div className="space-y-8">
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Home Page About Header & Asset
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Main Header Title</label>
                <input
                  type="text"
                  value={homeTitle}
                  onChange={(e) => setHomeTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                  placeholder="e.g. Sustaining Regional Safety Infrastructure"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Main Image Path or URL</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={homeImage}
                    onChange={(e) => setHomeImage(e.target.value)}
                    className="flex-1 px-4 py-3 text-xs border rounded-xl"
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
                    className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 shadow-md transition-all"
                  >
                    {uploadingField === "homeImage" ? "Uploading..." : "Upload File"}
                  </label>
                </div>

                {/* Live Image Preview Container */}
                <div className="mt-3 relative w-full h-44 rounded-xl border border-slate-200 bg-slate-900 overflow-hidden flex items-center justify-center">
                  {homeImage ? (
                    <img
                      src={formatImageUrl(homeImage)}
                      alt="Home About Preview"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = "none";
                        if (el.nextElementSibling) {
                          (el.nextElementSibling as HTMLElement).style.display = "flex";
                        }
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : null}
                  <div
                    style={{ display: homeImage ? "none" : "flex" }}
                    className="flex flex-col items-center justify-center text-slate-400 p-4 text-center"
                  >
                    <span className="text-2xl mb-1">📷</span>
                    <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-slate-300">
                      No Image Found
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Overview Paragraph (Bold lead)</label>
              <textarea
                rows={3}
                value={homeOverview}
                onChange={(e) => setHomeOverview(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
                placeholder="Primary overview narrative text..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Secondary Paragraph (Light detail)</label>
              <textarea
                rows={3}
                value={homeSecondary}
                onChange={(e) => setHomeSecondary(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
                placeholder="Secondary detail paragraph text..."
              />
            </div>
          </div>

          {/* Metrics Section */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Quantitative Data Metrics</h2>
              <button
                type="button"
                onClick={() => setHomeMetrics([...homeMetrics, { value: "0%", label: "New Metric", desc: "Metric description text" }])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Metric
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {homeMetrics.map((m, idx) => (
                <div key={idx} className="p-5 border border-slate-200/60 rounded-xl bg-slate-50/50 space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => setHomeMetrics(homeMetrics.filter((_, i) => i !== idx))}
                    className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 font-bold text-xs cursor-pointer"
                  >
                    Remove
                  </button>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Metric Value</label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => {
                        const updated = [...homeMetrics];
                        updated[idx].value = e.target.value;
                        setHomeMetrics(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                      placeholder="e.g. 70% or 10+"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Metric Title / Label</label>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => {
                        const updated = [...homeMetrics];
                        updated[idx].label = e.target.value;
                        setHomeMetrics(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                      placeholder="e.g. Technical Functions Weight"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Metric Description</label>
                    <textarea
                      rows={2}
                      value={m.desc}
                      onChange={(e) => {
                        const updated = [...homeMetrics];
                        updated[idx].desc = e.target.value;
                        setHomeMetrics(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                      placeholder="Detail text explaining metric..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Turnkey Lifecycle Steps */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Turnkey Lifecycle Delivery Steps</h2>
              <button
                type="button"
                onClick={() => setHomeLifecycleSteps([...homeLifecycleSteps, "New Lifecycle Scope Step"])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Lifecycle Step
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homeLifecycleSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border border-slate-200/60 rounded-xl bg-slate-50/40">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center shrink-0">
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
                    className="flex-1 px-3 py-2 text-xs border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setHomeLifecycleSteps(homeLifecycleSteps.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSaveHome}
              disabled={saving}
              className="px-8 py-3.5 bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Home Page About Changes"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: DEDICATED ABOUT PAGE SECTION */}
      {activeTab === "about_page" && (
        <div className="space-y-8">
          
          {/* Hero Header Settings */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              About Page Hero Header & Background Asset
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Hero Tagline / Badge</label>
                <input
                  type="text"
                  value={pageHeroTagline}
                  onChange={(e) => setPageHeroTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                  placeholder="e.g. Company Overview"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={pageHeroTitle}
                  onChange={(e) => setPageHeroTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                  placeholder="e.g. Mission-Critical Safety Infrastructure"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Hero Description Paragraph</label>
              <textarea
                rows={2}
                value={pageHeroDescription}
                onChange={(e) => setPageHeroDescription(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
                placeholder="Hero overview paragraph text..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Hero Background Image Path or URL</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pageHeroBgImage}
                  onChange={(e) => setPageHeroBgImage(e.target.value)}
                  className="flex-1 px-4 py-3 text-xs border rounded-xl"
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
                  className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 shadow-md transition-all"
                >
                  {uploadingField === "heroBgImage" ? "Uploading..." : "Upload File"}
                </label>
              </div>
            </div>
          </div>

          {/* Mandate & Facility Section */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Core Mandate & Facility Showcase Image
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Mandate Section Badge</label>
                <input
                  type="text"
                  value={pageMandateBadge}
                  onChange={(e) => setPageMandateBadge(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                  placeholder="e.g. Operational Strength"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Mandate Section Title</label>
                <input
                  type="text"
                  value={pageMandateTitle}
                  onChange={(e) => setPageMandateTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                  placeholder="e.g. Our Core Safety Mandate"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Mandate Paragraph 1</label>
              <textarea
                rows={3}
                value={pageMandateParagraph1}
                onChange={(e) => setPageMandateParagraph1(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Mandate Paragraph 2</label>
              <textarea
                rows={3}
                value={pageMandateParagraph2}
                onChange={(e) => setPageMandateParagraph2(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Facility Showcase Image Path or URL</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={pageFacilityImage}
                    onChange={(e) => setPageFacilityImage(e.target.value)}
                    className="flex-1 px-4 py-3 text-xs border rounded-xl"
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
                    className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 shadow-md transition-all"
                  >
                    {uploadingField === "facilityImage" ? "Uploading..." : "Upload File"}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Facility Technical Reference Code</label>
                <input
                  type="text"
                  value={pageFacilityCode}
                  onChange={(e) => setPageFacilityCode(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                  placeholder="e.g. SYS.FACILITY.IMG.01"
                />
              </div>
            </div>
          </div>

          {/* Positioning Pillars */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Core Market Positioning Pillars</h2>
              <button
                type="button"
                onClick={() => setPagePositioning([...pagePositioning, { title: "New Pillar", text: "Pillar description text" }])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Pillar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pagePositioning.map((pos, idx) => (
                <div key={idx} className="p-4 border border-slate-200/60 rounded-xl bg-slate-50/50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => setPagePositioning(pagePositioning.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-rose-500 font-bold text-xs cursor-pointer"
                  >
                    Remove
                  </button>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pillar Title</label>
                    <input
                      type="text"
                      value={pos.title}
                      onChange={(e) => {
                        const updated = [...pagePositioning];
                        updated[idx].title = e.target.value;
                        setPagePositioning(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pillar Text</label>
                    <textarea
                      rows={3}
                      value={pos.text}
                      onChange={(e) => {
                        const updated = [...pagePositioning];
                        updated[idx].text = e.target.value;
                        setPagePositioning(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corporate Metrics */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Corporate Metrics Cards</h2>
              <button
                type="button"
                onClick={() => setPageMetrics([...pageMetrics, { value: "100%", label: "New Metric", desc: "Description text", accent: "#1e3e8f" }])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Metric Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pageMetrics.map((m, idx) => (
                <div key={idx} className="p-4 border border-slate-200/60 rounded-xl bg-slate-50/50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => setPageMetrics(pageMetrics.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-rose-500 font-bold text-xs cursor-pointer"
                  >
                    Remove
                  </button>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Metric Value</label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => {
                        const updated = [...pageMetrics];
                        updated[idx].value = e.target.value;
                        setPageMetrics(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Metric Title</label>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => {
                        const updated = [...pageMetrics];
                        updated[idx].label = e.target.value;
                        setPageMetrics(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Metric Description</label>
                    <textarea
                      rows={2}
                      value={m.desc}
                      onChange={(e) => {
                        const updated = [...pageMetrics];
                        updated[idx].desc = e.target.value;
                        setPageMetrics(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Accent Hex Color</label>
                    <input
                      type="text"
                      value={m.accent}
                      onChange={(e) => {
                        const updated = [...pageMetrics];
                        updated[idx].accent = e.target.value;
                        setPageMetrics(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                      placeholder="#1e3e8f or #c22026"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Disciplines */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Engineering Disciplines Matrix</h2>
              <button
                type="button"
                onClick={() => setPageDisciplines([...pageDisciplines, { title: "New Discipline", desc: "Discipline overview desc", accent: "#1e3e8f" }])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Discipline
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageDisciplines.map((d, idx) => (
                <div key={idx} className="p-4 border border-slate-200/60 rounded-xl bg-slate-50/50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => setPageDisciplines(pageDisciplines.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-rose-500 font-bold text-xs cursor-pointer"
                  >
                    Remove
                  </button>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Discipline Name</label>
                    <input
                      type="text"
                      value={d.title}
                      onChange={(e) => {
                        const updated = [...pageDisciplines];
                        updated[idx].title = e.target.value;
                        setPageDisciplines(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={d.desc}
                      onChange={(e) => {
                        const updated = [...pageDisciplines];
                        updated[idx].desc = e.target.value;
                        setPageDisciplines(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Accent Hex (#1e3e8f or #c22026)</label>
                    <input
                      type="text"
                      value={d.accent}
                      onChange={(e) => {
                        const updated = [...pageDisciplines];
                        updated[idx].accent = e.target.value;
                        setPageDisciplines(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box Settings */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Footer Call-to-Action Consultation Box
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">CTA Banner Title</label>
                <input
                  type="text"
                  value={pageCtaTitle}
                  onChange={(e) => setPageCtaTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">CTA Button Label</label>
                <input
                  type="text"
                  value={pageCtaButtonText}
                  onChange={(e) => setPageCtaButtonText(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">CTA Paragraph Description</label>
              <textarea
                rows={2}
                value={pageCtaDescription}
                onChange={(e) => setPageCtaDescription(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSaveAboutPage}
              disabled={saving}
              className="px-8 py-3.5 bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Dedicated About Page Changes"}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
