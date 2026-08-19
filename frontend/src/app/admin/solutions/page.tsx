"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

interface SolutionItem {
  id: string;
  title: string;
  subLabel: string;
  tagline: string;
  accent: "blue" | "orange" | "red" | "emerald";
  description: string;
  detailedContent: string;
  features: string[];
  compliance: string[];
  specs: { label: string; value: string }[];
  benefits: string[];
  applications: string[];
  imageUrl: string;
}

interface IndustryItem {
  id: string;
  name: string;
  riskKicker: string;
  accent: string;
  image: string;
  description: string;
  items?: any;
}

interface CorePortfolioItem {
  title: string;
  description: string;
  items: string[];
  icon: string;
}

export default function UnifiedAdminSolutionsPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "page_layout">("catalog");
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingPage, setSavingPage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // TAB 1: SOLUTION ITEM CATALOG MODALS & FORM STATES
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<SolutionItem | null>(null);

  const [formId, setFormId] = useState<string>("");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formSubLabel, setFormSubLabel] = useState<string>("");
  const [formTagline, setFormTagline] = useState<string>("");
  const [formAccent, setFormAccent] = useState<"blue" | "orange" | "red" | "emerald">("blue");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formDetailedContent, setFormDetailedContent] = useState<string>("");
  const [formImageUrl, setFormImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  // TAB 2: DEDICATED /SOLUTIONS PAGE LAYOUT & BANNERS STATE
  const [heroBgImage, setHeroBgImage] = useState<string>("/application.png");
  const [heroTagline, setHeroTagline] = useState<string>("ENGINEERED SAFETY & INDUSTRIAL INFRASTRUCTURE");
  const [heroTitle, setHeroTitle] = useState<string>("MIDDLE EAST SAFETY SOLUTIONS");
  const [heroDescription, setHeroDescription] = useState<string>("Eastwind Arabia supplies high-compliance fire fighting, respiratory protection, wireless gas detection, and process instrumentation modules across Saudi Arabia and the GCC.");
  const [industriesTagline, setIndustriesTagline] = useState<string>("Operating Environments");
  const [industriesTitle, setIndustriesTitle] = useState<string>("Solutions By Operating Industry");
  const [industriesDesc, setIndustriesDesc] = useState<string>("Industrial sectors feature highly specific chemical, thermal, and spatial risks.");
  const [industries, setIndustries] = useState<IndustryItem[]>([
    {
      id: "oil-gas",
      name: "Oil & Gas",
      riskKicker: "HAZARDOUS ATMOSPHERE | ATEX ZONE 0 & ZONE 1",
      accent: "#c22026",
      image: "/predictive_intelligence.webp",
      description: "Securing petrochemical extraction, transport infrastructure, and downstream refining loops."
    },
    {
      id: "petrochemical",
      name: "Petrochemicals",
      riskKicker: "PROCESS HAZARD CONTROL | ZONE 1 & ZONE 2",
      accent: "#f59e0b",
      image: "/industrial_digitalization.webp",
      description: "Optimising downstream chemical refining ecosystems with real-time ML and telemetry."
    },
    {
      id: "civil-defense",
      name: "Civil Defense",
      riskKicker: "TACTICAL EMERGENCY INCIDENT COMMAND",
      accent: "#ef4444",
      image: "/emergency_vehicle.webp",
      description: "Equipping public safety, civil protection, and regional defense forces."
    },
    {
      id: "marine",
      name: "Marine & Offshore",
      riskKicker: "OFFSHORE ARCHITECTURE | ABS & DNV COMPLIANT",
      accent: "#1e3e8f",
      image: "/thermal_ehouse.webp",
      description: "Providing deepwater infrastructure defense and automated hull breach tracking."
    },
    {
      id: "utility-power",
      name: "Utility & Power",
      riskKicker: "CRITICAL GRID SAFETY MARGIN | IEEE & IEC CERTIFIED",
      accent: "#10b981",
      image: "/wireless_monitoring.webp",
      description: "Hardening continental power distribution grids and substations."
    }
  ]);

  const [capabilitiesTagline, setCapabilitiesTagline] = useState<string>("Core Expertise");
  const [capabilitiesTitle, setCapabilitiesTitle] = useState<string>("Core Capabilities Portfolio");
  const [capabilitiesDesc, setCapabilitiesDesc] = useState<string>("Eastwind executes complex, multi-disciplinary workflows.");
  const [corePortfolios, setCorePortfolios] = useState<CorePortfolioItem[]>([
    {
      title: "AI, Digitalisation & Data Architecture",
      description: "Advanced data acquisition pipelines running Agentic AI models.",
      items: ["AI infrastructure deployment", "Plant operations enablement"],
      icon: "⚡"
    }
  ]);

  const [gatewayTagline, setGatewayTagline] = useState<string>("Proposal Engineering Intake");
  const [gatewayTitle, setGatewayTitle] = useState<string>("Request Technical Integration Quoting");
  const [gatewayDesc, setGatewayDesc] = useState<string>("Complete the security assessment form below.");
  const [submitButtonText, setSubmitButtonText] = useState<string>("Submit Solution Blueprint Scope");

  // Technology Partners State
  const [partnersTagline, setPartnersTagline] = useState<string>("Global Integration");
  const [partnersTitle, setPartnersTitle] = useState<string>("Integrated Technology Partners");
  const [partnersDesc, setPartnersDesc] = useState<string>("We securely assimilate components from verified global market leaders into unified, field-ready physical frameworks.");
  const [partners, setPartners] = useState<any[]>([
    { name: "Dräger", logo: "/brands/draeger.png" },
    { name: "Empel", logo: "" },
    { name: "Nardi", logo: "/brands/nardi.png" },
    { name: "Mimes", logo: "/brands/mimes.png" },
    { name: "One Seven", logo: "/brands/oneseven.png" },
    { name: "Sieon", logo: "/brands/sione.png" },
    { name: "Xshielder", logo: "/brands/xshielder.png" },
    { name: "Nittan", logo: "" },
    { name: "FlamePro", logo: "/brands/flamepro.png" },
    { name: "E2S", logo: "/brands/e2s.png" },
    { name: "Schneider", logo: "/brands/schneider.png" },
    { name: "CRI", logo: "" },
    { name: "CEJN", logo: "" },
    { name: "Polyhose", logo: "" },
    { name: "Keiconnections", logo: "" },
    { name: "Leader", logo: "" },
    { name: "Tridiagonal", logo: "" },
    { name: "Phoenix", logo: "" },
    { name: "Pepperl+Fuchs", logo: "/brands/pepperlfuchs.png" },
    { name: "Guttor", logo: "" },
    { name: "Paratech", logo: "" },
    { name: "Panam", logo: "" },
    { name: "Atexxor", logo: "" },
    { name: "Thermocable", logo: "" }
  ]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Fetch Catalog Solutions (Tab 1)
  const fetchSolutions = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/solutions`);
      if (!res.ok) throw new Error("Failed to fetch solutions");
      const list = await res.json();
      setSolutions(list);
    } catch (err: any) {
      console.error(err);
      setError("Failed to retrieve solution items.");
    }
  };

  // Fetch Solutions Page Layout (Tab 2)
  const fetchSolutionsPageData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/solutions-page`);
      if (res.ok) {
        const data = await res.json();
        if (data.heroBgImage) setHeroBgImage(data.heroBgImage);
        if (data.heroTagline) setHeroTagline(data.heroTagline);
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroDescription) setHeroDescription(data.heroDescription);
        if (data.industriesTagline) setIndustriesTagline(data.industriesTagline);
        if (data.industriesTitle) setIndustriesTitle(data.industriesTitle);
        if (data.industriesDesc) setIndustriesDesc(data.industriesDesc);
        if (data.industries && data.industries.length > 0) setIndustries(data.industries);
        if (data.capabilitiesTagline) setCapabilitiesTagline(data.capabilitiesTagline);
        if (data.capabilitiesTitle) setCapabilitiesTitle(data.capabilitiesTitle);
        if (data.capabilitiesDesc) setCapabilitiesDesc(data.capabilitiesDesc);
        if (data.corePortfolios && data.corePortfolios.length > 0) setCorePortfolios(data.corePortfolios);
        if (data.partnersTagline) setPartnersTagline(data.partnersTagline);
        if (data.partnersTitle) setPartnersTitle(data.partnersTitle);
        if (data.partnersDesc) setPartnersDesc(data.partnersDesc);
        if (data.partners && data.partners.length > 0) setPartners(data.partners);
        if (data.gatewayTagline) setGatewayTagline(data.gatewayTagline);
        if (data.gatewayTitle) setGatewayTitle(data.gatewayTitle);
        if (data.gatewayDesc) setGatewayDesc(data.gatewayDesc);
        if (data.submitButtonText) setSubmitButtonText(data.submitButtonText);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      await Promise.all([fetchSolutions(), fetchSolutionsPageData()]);
      setLoading(false);
    }
    loadAll();
  }, []);

  // Save Handlers for Tab 1 Solution Items
  const handleOpenCreate = () => {
    clearMessages();
    setIsEdit(false);
    setFormId("");
    setFormTitle("");
    setFormSubLabel("");
    setFormTagline("");
    setFormAccent("blue");
    setFormDescription("");
    setFormDetailedContent("");
    setFormImageUrl("/predictive_intelligence.webp");
    setShowModal(true);
  };

  const handleOpenEdit = (item: SolutionItem) => {
    clearMessages();
    setIsEdit(true);
    setFormId(item.id);
    setFormTitle(item.title);
    setFormSubLabel(item.subLabel || "");
    setFormTagline(item.tagline || "");
    setFormAccent(item.accent || "blue");
    setFormDescription(item.description || "");
    setFormDetailedContent(item.detailedContent || "");
    setFormImageUrl(item.imageUrl || "/predictive_intelligence.webp");
    setShowModal(true);
  };

  const handleSaveSolutionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!formTitle.trim()) {
      setError("Solution title is required.");
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");
      const generatedId = formId || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const payload = {
        id: generatedId,
        title: formTitle.trim(),
        subLabel: formSubLabel.trim(),
        tagline: formTagline.trim(),
        accent: formAccent,
        description: formDescription.trim(),
        detailedContent: formDetailedContent.trim(),
        imageUrl: formImageUrl.trim()
      };

      const url = isEdit ? `${baseUrl}/api/solutions/${generatedId}` : `${baseUrl}/api/solutions`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save solution item");

      setSuccess(`Solution item "${formTitle}" saved successfully!`);
      setShowModal(false);
      fetchSolutions();
    } catch (err: any) {
      setError(err.message || "Failed to save solution item.");
    }
  };

  const handleDeleteSolutionItem = async (id: string) => {
    clearMessages();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${baseUrl}/api/solutions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete solution item");
      setSuccess("Solution item deleted!");
      setDeleteTarget(null);
      fetchSolutions();
    } catch (err: any) {
      setError(err.message || "Failed to delete item.");
    }
  };

  // Helper to convert any Base64 image string to lightweight uploaded file URL before saving
  const sanitizeImage = async (urlOrBase64: string, token: string | null, baseUrl: string): Promise<string> => {
    if (!urlOrBase64 || typeof urlOrBase64 !== "string" || !urlOrBase64.startsWith("data:image/")) {
      return urlOrBase64;
    }
    try {
      const res = await fetch(urlOrBase64);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append("file", blob, `brand_logo_${Date.now()}.png`);

      const uploadRes = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token || ""}` },
        body: formData
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        if (uploadData.url) return uploadData.url;
      }
    } catch (err) {
      console.warn("Auto base64 upload failed:", err);
    }
    return urlOrBase64;
  };

  // Save Handler for Tab 2 Solutions Page Banners & Content
  const handleSaveSolutionsPageLayout = async () => {
    clearMessages();
    setSavingPage(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      // Auto-sanitize partners logos to turn giant Base64 strings into lightweight file URLs
      const sanitizedPartners = await Promise.all(
        partners.map(async (partnerItem) => {
          if (typeof partnerItem === "string") {
            const logo = await sanitizeImage(partnerItem, token, baseUrl);
            return { name: partnerItem, logo };
          }
          const name = partnerItem?.name || "Partner Brand";
          const rawLogo = partnerItem?.logo || partnerItem?.image || "";
          const logo = await sanitizeImage(rawLogo, token, baseUrl);
          return { ...partnerItem, name, logo };
        })
      );

      setPartners(sanitizedPartners);

      const payload = {
        heroBgImage,
        heroTagline,
        heroTitle,
        heroDescription,
        industriesTagline,
        industriesTitle,
        industriesDesc,
        industries,
        capabilitiesTagline,
        capabilitiesTitle,
        capabilitiesDesc,
        corePortfolios,
        partnersTagline,
        partnersTitle,
        partnersDesc,
        partners: sanitizedPartners,
        gatewayTagline,
        gatewayTitle,
        gatewayDesc,
        submitButtonText
      };

      const res = await fetch(`${baseUrl}/api/solutions-page`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Admin authentication session expired. Please logout and log back in.");
        }
        throw new Error(data.error || data.message || `Failed to save Solutions Page layout (${res.status})`);
      }

      setSuccess("Solutions Page Banners & Layout saved successfully!");
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        setError("Request timed out while saving. Please try saving again now.");
      } else {
        setError(err.message || "Failed to save layout.");
      }
    } finally {
      setSavingPage(false);
    }
  };

  // Add / Delete Industry Cards Helpers (Tab 2)
  const handleAddIndustryCard = () => {
    const newId = `industry-${Date.now()}`;
    setIndustries([
      ...industries,
      {
        id: newId,
        name: "New Industry Sector",
        riskKicker: "SAFETY COMPLIANCE HAZARD CONTROL",
        accent: "#1e3e8f",
        image: "/predictive_intelligence.webp",
        description: "Comprehensive hazard mitigation and continuous safety telemetry integration."
      }
    ]);
  };

  const handleDeleteIndustryCard = (index: number) => {
    setIndustries(industries.filter((_, idx) => idx !== index));
  };

  // Add / Delete Capability Cards Helpers (Tab 2)
  const handleAddCapabilityCard = () => {
    setCorePortfolios([
      ...corePortfolios,
      {
        title: "New Technical Capability",
        description: "Advanced engineering design and field calibration workflows.",
        items: ["Multi-vendor interface leadership"],
        icon: "🛡️"
      }
    ]);
  };

  const handleDeleteCapabilityCard = (index: number) => {
    setCorePortfolios(corePortfolios.filter((_, idx) => idx !== index));
  };

  // Direct server upload helper with client canvas compression fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    clearMessages();

    // 1. Attempt direct upload to server /api/upload to get lightweight file URL
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const uploadData = await res.json();
        if (uploadData.url) {
          setter(uploadData.url);
          setSuccess(`Image '${file.name}' uploaded successfully!`);
          setUploading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Direct upload fallback to client compression:", err);
    }

    // 2. Client-side canvas compression fallback
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        setUploading(false);
        return;
      }
      const rawUrl = event.target.result as string;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.7);
          setter(compressedDataUrl);
          setSuccess(`Image '${file.name}' attached successfully!`);
        } else {
          setter(rawUrl);
        }
        setUploading(false);
      };
      img.onerror = () => {
        setter(rawUrl);
        setUploading(false);
      };
      img.src = rawUrl;
    };
    reader.onerror = () => {
      setError("Failed to process image file. Please try another PNG or JPG photo.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const filteredSolutions = solutions.filter((s: any) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              Full Dynamic CMS
            </span>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Solutions Management Portal</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete View, Add, Edit, and Delete controls for all solution items, photos, headings, and page sections.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-md cursor-pointer transition-all shrink-0"
          >
            + Add Solution Item
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-800">✕</button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex justify-between items-center">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-800">✕</button>
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 space-x-4">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === "catalog"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Manage Solution Items ({solutions.length})
        </button>
        <button
          onClick={() => setActiveTab("page_layout")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === "page_layout"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Manage Solutions Page Banners & Layout
        </button>
      </div>

      {activeTab === "catalog" ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-full md:w-80">
              <input
                type="text"
                placeholder="Search solutions by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:border-orange-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono font-bold">
              Showing {filteredSolutions.length} of {solutions.length} solution items
            </span>
          </div>

          {/* Solutions Catalog Grid with View, Edit, Delete Actions */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-mono">Loading Solution Catalog...</div>
          ) : filteredSolutions.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <p className="text-xs text-slate-500 font-medium">No solution items found. Click "+ Add Solution Item" to create one.</p>
              <button
                onClick={handleOpenCreate}
                className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                + Add Solution Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSolutions.map((item: any) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-orange-500/50 transition-all">
                  {/* Photo Display Banner */}
                  <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center p-2">
                    {item.imageUrl && item.imageUrl.trim() !== "" ? (
                      <img
                        key={item.imageUrl}
                        src={formatImageUrl(item.imageUrl)}
                        alt={item.title}
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.style.display = "none";
                          if (el.nextElementSibling) {
                            (el.nextElementSibling as HTMLElement).style.display = "flex";
                          }
                        }}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div
                      style={{ display: item.imageUrl && item.imageUrl.trim() !== "" ? "none" : "flex" }}
                      className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-slate-400"
                    >
                      <span className="text-xl">📷</span>
                      <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
                    </div>
                    <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase text-orange-600 bg-white/95 border border-orange-200 px-2.5 py-1 rounded-md shadow-sm">
                      {item.id}
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-slate-800 leading-snug">{item.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.description}</p>
                    </div>

                    {/* ACTION BUTTONS: VIEW, EDIT, DELETE */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewItem(item)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="View details"
                      >
                        <span>👁️</span>
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="Edit solution item"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item.id)}
                        className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="Delete solution item"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-950 text-xs flex items-center justify-between">
            <div>
              <strong className="block font-bold">📍 Website Location:</strong>
              <span>Edits all page banners, photos, headings, titles, descriptions, and intake text on <strong className="underline">http://localhost:3000/solutions</strong>.</span>
            </div>
            <button
              onClick={handleSaveSolutionsPageLayout}
              disabled={savingPage}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-md shrink-0 ml-4 cursor-pointer"
            >
              {savingPage ? "Saving Layout..." : "Save Solutions Page Banners & Photos"}
            </button>
          </div>

          {/* Section 1: Hero Banner Settings & Photo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-800">1. Solutions Page Hero Banner & Background Photo</h2>
            </div>
            
            {/* Hero Background Photo Preview & Uploader */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Hero Background Image</label>
              {heroBgImage && (
                <div className="h-44 w-full bg-slate-950 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center">
                  <img
                    src={formatImageUrl(heroBgImage, "/solution.png")}
                    alt="Hero Background"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/solution.png";
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div className="flex gap-2 items-center text-xs">
                <input type="text" value={heroBgImage} onChange={(e) => setHeroBgImage(e.target.value)} className="w-full p-2.5 border rounded-lg font-mono text-[11px]" />
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer shrink-0">
                  {uploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setHeroBgImage)} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Tagline</label>
                <input type="text" value={heroTagline} onChange={(e) => setHeroTagline(e.target.value)} className="w-full p-2.5 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Title</label>
                <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full p-2.5 border rounded-lg font-bold" />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Description</label>
              <textarea rows={3} value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} className="w-full p-2.5 border rounded-lg text-xs" />
            </div>
          </div>

          {/* Section 2: Operating Industries Cards with Add & Delete Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-800">2. Solutions By Operating Industry ({industries.length} Cards)</h2>
              <button
                type="button"
                onClick={handleAddIndustryCard}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-sm"
              >
                + Add Industry Card
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {industries.map((ind, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3 relative group">
                  <div className="flex justify-between items-center font-bold text-slate-800 border-b pb-2">
                    <input type="text" value={ind.name} onChange={(e) => {
                      const updated = [...industries];
                      updated[idx].name = e.target.value;
                      setIndustries(updated);
                    }} className="font-extrabold text-slate-800 bg-transparent border-b border-dashed" />
                    
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 font-mono text-[11px]">{ind.id}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteIndustryCard(idx)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer px-2 py-0.5 bg-red-50 rounded"
                        title="Delete Card"
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </div>

                    {/* Industry Image & Upload */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">Card Photo</label>
                      <div className="h-28 w-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-1 border relative">
                        {ind.image && ind.image.trim() !== "" ? (
                          <img
                            key={ind.image}
                            src={formatImageUrl(ind.image)}
                            alt={ind.name}
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
                          style={{ display: ind.image && ind.image.trim() !== "" ? "none" : "flex" }}
                          className="flex flex-col items-center justify-center text-center p-2 space-y-0.5 text-slate-400"
                        >
                          <span className="text-lg">📷</span>
                          <span className="text-[10px] font-mono font-medium text-slate-400">No Image Found</span>
                        </div>
                      </div>
                    <div className="flex gap-2">
                      <input type="text" value={ind.image} onChange={(e) => {
                        const updated = [...industries];
                        updated[idx].image = e.target.value;
                        setIndustries(updated);
                      }} className="w-full p-2 border rounded text-[10px] font-mono" />
                      <label className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-[10px] cursor-pointer shrink-0">
                        Upload
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => {
                          const updated = [...industries];
                          updated[idx].image = url;
                          setIndustries(updated);
                        })} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Risk Kicker Tagline</label>
                    <input type="text" value={ind.riskKicker} onChange={(e) => {
                      const updated = [...industries];
                      updated[idx].riskKicker = e.target.value;
                      setIndustries(updated);
                    }} className="w-full p-2 border rounded font-mono text-[10px]" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Card Description</label>
                    <textarea rows={2} value={ind.description} onChange={(e) => {
                      const updated = [...industries];
                      updated[idx].description = e.target.value;
                      setIndustries(updated);
                    }} className="w-full p-2 border rounded" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Category Products / Sub-solutions (comma-separated for Navbar & Details)</label>
                    <input
                      type="text"
                      placeholder="e.g. Wireless Gas Detection, Plant OPS, Temporary Refuge Chamber, Tank Farm Fire Fighting"
                      value={Array.isArray(ind.items) ? ind.items.map((i: any) => typeof i === "string" ? i : i.name).join(", ") : (ind.items || "")}
                      onChange={(e) => {
                        const updated = [...industries];
                        const itemsArr = e.target.value.split(",").map(s => s.trim()).filter(Boolean).map(name => ({ name, href: `/solutions/${ind.id}` }));
                        updated[idx].items = itemsArr;
                        setIndustries(updated);
                      }}
                      className="w-full p-2 border rounded font-mono text-[10px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Core Capabilities with Add & Delete Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-800">3. Technical Core Capabilities Portfolio ({corePortfolios.length} Cards)</h2>
              <button
                type="button"
                onClick={handleAddCapabilityCard}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-sm"
              >
                + Add Capability Card
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {corePortfolios.map((cp, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-2 relative">
                  <div className="flex items-center justify-between gap-2 border-b pb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <input type="text" value={cp.icon} onChange={(e) => {
                        const updated = [...corePortfolios];
                        updated[idx].icon = e.target.value;
                        setCorePortfolios(updated);
                      }} className="w-10 p-1.5 border rounded text-center text-base" />
                      <input type="text" value={cp.title} onChange={(e) => {
                        const updated = [...corePortfolios];
                        updated[idx].title = e.target.value;
                        setCorePortfolios(updated);
                      }} className="w-full p-1.5 border rounded font-bold" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCapabilityCard(idx)}
                      className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer px-2 py-0.5 bg-red-50 rounded shrink-0"
                      title="Delete Capability Card"
                    >
                      Delete 🗑️
                    </button>
                  </div>
                  <textarea rows={2} value={cp.description} onChange={(e) => {
                    const updated = [...corePortfolios];
                    updated[idx].description = e.target.value;
                    setCorePortfolios(updated);
                  }} className="w-full p-2 border rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: INTEGRATED PARTNER BRANDS & LOGOS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 m-0 flex items-center gap-2">
                  <span>4. Integrated Partner Brands & Logos</span>
                  <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {partners.length} Brands
                  </span>
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-1">
                  Manage brand names and logo images displayed on the public solutions auto-scrolling marquee.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPartners([...partners, { name: "New Partner Brand", logo: "" }]);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all shrink-0"
              >
                <span>+ Add Partner Brand</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {partners.map((partnerItem, idx) => {
                const name = typeof partnerItem === "string" ? partnerItem : partnerItem?.name || "Partner Brand";
                const logo = typeof partnerItem === "object" ? partnerItem?.logo || partnerItem?.image || "" : "";
                const cleanKey = name.toLowerCase().trim();
                const defaultLogo = logo || (
                  cleanKey.includes("dräg") || cleanKey.includes("draeg") ? "/brands/draeger.png" :
                  cleanKey.includes("one seven") ? "/brands/oneseven.png" :
                  cleanKey.includes("xshield") ? "/brands/xshielder.png" :
                  cleanKey.includes("nardi") ? "/brands/nardi.png" :
                  cleanKey.includes("mimes") ? "/brands/mimes.png" :
                  cleanKey.includes("sieon") || cleanKey.includes("sione") ? "/brands/sione.png" :
                  cleanKey.includes("e2s") ? "/brands/e2s.png" :
                  cleanKey.includes("flamepro") ? "/brands/flamepro.png" :
                  cleanKey.includes("schneider") ? "/brands/schneider.png" :
                  cleanKey.includes("pepperl") ? "/brands/pepperlfuchs.png" : ""
                );

                return (
                  <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-3 shadow-3xs hover:shadow-sm group">
                    <div className="space-y-3">
                      {/* Logo Preview Box */}
                      <div className="h-20 w-full bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center relative overflow-hidden shadow-2xs">
                        {defaultLogo ? (
                          <img
                            src={defaultLogo}
                            alt={name}
                            className="max-h-14 max-w-[120px] object-contain"
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-extrabold text-sm">
                            {name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Brand Name */}
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 m-0 truncate group-hover:text-orange-600 transition-colors">
                          {name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono truncate block mt-0.5">
                          {logo ? "Custom Logo Uploaded" : "Default Auto Match"}
                        </span>
                      </div>
                    </div>

                    {/* Inline Quick Field Edits */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/60">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Brand Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            const updated = [...partners];
                            if (typeof updated[idx] === "string") {
                              updated[idx] = { name: e.target.value, logo: "" };
                            } else {
                              updated[idx] = { ...updated[idx], name: e.target.value };
                            }
                            setPartners(updated);
                          }}
                          className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white font-medium focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          placeholder="Brand Name"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Logo Image</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={logo}
                            onChange={(e) => {
                              const updated = [...partners];
                              if (typeof updated[idx] === "string") {
                                updated[idx] = { name: updated[idx], logo: e.target.value };
                              } else {
                                updated[idx] = { ...updated[idx], logo: e.target.value };
                              }
                              setPartners(updated);
                            }}
                            className="flex-1 px-2.5 py-1.5 text-[11px] border rounded-lg bg-white font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            placeholder="/brands/logo.png"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id={`partner-file-${idx}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => {
                              const updated = [...partners];
                              if (typeof updated[idx] === "string") {
                                updated[idx] = { name: updated[idx], logo: url };
                              } else {
                                updated[idx] = { ...updated[idx], logo: url };
                              }
                              setPartners(updated);
                            })}
                          />
                          <label
                            htmlFor={`partner-file-${idx}`}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-orange-600 !text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg cursor-pointer shrink-0 flex items-center shadow-sm transition-colors"
                          >
                            Upload
                          </label>
                        </div>
                      </div>

                      {/* Card Action Row: Delete Button */}
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setPartners(partners.filter((_, i) => i !== idx))}
                          className="text-rose-600 hover:text-rose-700 text-[11px] font-bold py-1 px-2.5 rounded-md hover:bg-rose-50 cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <span>🗑️ Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveSolutionsPageLayout}
              disabled={savingPage}
              className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-lg cursor-pointer"
            >
              {savingPage ? "Saving Layout..." : "Save Solutions Page Banners & Photos"}
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL FOR TAB 1 ITEM */}
      {showModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-6 my-auto relative">
            <div className="sticky top-0 bg-white pt-1 pb-3 z-10 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-800">{isEdit ? "Edit Solution Item & Photo" : "Create New Solution Item"}</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Close</span>
                <span className="text-sm font-black">✕</span>
              </button>
            </div>

            <form onSubmit={handleSaveSolutionItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Solution Title *</label>
                <input type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Fire & Gas Detection Systems" className="w-full p-2.5 border rounded-lg font-bold" />
              </div>

              {/* Solution Item Photo with Upload & Preview */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Solution Photo / Equipment Image</label>
                <div className="h-40 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border relative">
                  {formImageUrl && formImageUrl.trim() !== "" ? (
                    <img
                      key={formImageUrl}
                      src={formatImageUrl(formImageUrl)}
                      alt="Solution Preview"
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
                    style={{ display: formImageUrl && formImageUrl.trim() !== "" ? "none" : "flex" }}
                    className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-slate-400"
                  >
                    <span className="text-xl">📷</span>
                    <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={formImageUrl} onChange={(e) => setFormImageUrl(e.target.value)} className="w-full p-2.5 border rounded-lg font-mono text-[11px]" />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer shrink-0">
                    {uploading ? "Uploading..." : "Upload Photo"}
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setFormImageUrl)} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Overview Description *</label>
                <textarea rows={3} required value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Summary description..." className="w-full p-2.5 border rounded-lg" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Technical Content</label>
                <textarea rows={4} value={formDetailedContent} onChange={(e) => setFormDetailedContent(e.target.value)} placeholder="Detailed technical specifications content..." className="w-full p-2.5 border rounded-lg" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-orange-600 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer">{isEdit ? "Save Solution Item & Photo" : "Create Solution Item"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL (WITH STICKY CLOSE CONTROLS & SMOOTH SCROLLING) */}
      {viewItem && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewItem(null);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4 my-auto relative">
            
            {/* Sticky Header Close Control */}
            <div className="sticky top-0 bg-white pt-1 pb-3 z-20 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                ID: {viewItem.id}
              </span>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Close</span>
                <span className="text-sm font-black">✕</span>
              </button>
            </div>

            {/* Photo Banner */}
            <div className="h-56 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-slate-800 shrink-0 relative">
              {viewItem.imageUrl && viewItem.imageUrl.trim() !== "" ? (
                <img
                  key={viewItem.imageUrl}
                  src={formatImageUrl(viewItem.imageUrl)}
                  alt={viewItem.title}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    if (el.nextElementSibling) {
                      (el.nextElementSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              ) : null}
              <div
                style={{ display: viewItem.imageUrl && viewItem.imageUrl.trim() !== "" ? "none" : "flex" }}
                className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-slate-400"
              >
                <span className="text-xl">📷</span>
                <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
              </div>
            </div>

            <h2 className="text-lg font-extrabold text-slate-800">{viewItem.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{viewItem.description}</p>

            {viewItem.detailedContent && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <strong className="block text-slate-800 font-bold">Detailed Specifications & Technical Content:</strong>
                <p className="text-slate-600 leading-relaxed font-normal whitespace-pre-wrap">{viewItem.detailedContent}</p>
              </div>
            )}

            {/* Sticky Footer Close Control */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-3 pb-1 border-t border-slate-100 flex justify-end z-20">
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-red-600 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Close Window</span>
                <span className="font-mono text-sm">✕</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 my-auto">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mx-auto">
              ⚠️
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Confirm Solution Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">Are you sure you want to delete solution "{deleteTarget}"?</p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
              <button onClick={() => handleDeleteSolutionItem(deleteTarget)} className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
