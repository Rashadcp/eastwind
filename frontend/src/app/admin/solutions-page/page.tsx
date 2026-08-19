"use client";

import { useEffect, useState } from "react";

interface IndustryItem {
  id: string;
  name: string;
  riskKicker: string;
  accent: string;
  image: string;
  description: string;
}

interface CorePortfolioItem {
  title: string;
  description: string;
  items: string[];
  icon: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

export default function AdminSolutionsPage() {
  const [activeTab, setActiveTab] = useState<"hero_industries" | "capabilities" | "partners" | "gateway">("hero_industries");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Hero & Industries State
  const [heroBgImage, setHeroBgImage] = useState<string>("/application.png");
  const [heroTagline, setHeroTagline] = useState<string>("ENGINEERED SAFETY & INDUSTRIAL INFRASTRUCTURE");
  const [heroTitle, setHeroTitle] = useState<string>("MIDDLE EAST SAFETY SOLUTIONS");
  const [heroDescription, setHeroDescription] = useState<string>("Eastwind Arabia supplies high-compliance fire fighting, respiratory protection, wireless gas detection, and process instrumentation modules across Saudi Arabia and the GCC.");
  const [industriesTagline, setIndustriesTagline] = useState<string>("Operating Environments");
  const [industriesTitle, setIndustriesTitle] = useState<string>("Solutions By Operating Industry");
  const [industriesDesc, setIndustriesDesc] = useState<string>("Industrial sectors feature highly specific chemical, thermal, and spatial risks. We build multi-layered mitigation loops engineered to perform reliably inside harsh conditions.");
  const [industries, setIndustries] = useState<IndustryItem[]>([
    {
      id: "oil-gas",
      name: "Oil & Gas",
      riskKicker: "HAZARDOUS ATMOSPHERE | ATEX ZONE 0 & ZONE 1",
      accent: "#c22026",
      image: "/predictive_intelligence.webp",
      description: "Securing petrochemical extraction, transport infrastructure, and downstream refining loops through intrinsically safe telemetry, explosion isolation, and toxic gas environment management."
    },
    {
      id: "petrochemical",
      name: "Petrochemicals",
      riskKicker: "PROCESS HAZARD CONTROL | ZONE 1 & ZONE 2",
      accent: "#f59e0b",
      image: "/industrial_digitalization.webp",
      description: "Optimising downstream chemical refining ecosystems with real-time Physics-Informed ML, predictive anomaly diagnostics, and high-fidelity wireless telemetry layers."
    },
    {
      id: "civil-defense",
      name: "Civil Defense",
      riskKicker: "TACTICAL EMERGENCY INCIDENT COMMAND",
      accent: "#ef4444",
      image: "/emergency_vehicle.webp",
      description: "Equipping public safety, civil protection, and regional defense forces with heavy tactical command apparatus, specialized life-support vehicles, and optimized foam suppression networks."
    },
    {
      id: "marine",
      name: "Marine & Offshore",
      riskKicker: "OFFSHORE ARCHITECTURE | ABS & DNV COMPLIANT",
      accent: "#1e3e8f",
      image: "/thermal_ehouse.webp",
      description: "Providing deepwater infrastructure defense, automated hull breach stabilization tracking, and extreme salt-atmosphere corrosive protection systems."
    },
    {
      id: "utility-power",
      name: "Utility & Power",
      riskKicker: "CRITICAL GRID SAFETY MARGIN | IEEE & IEC CERTIFIED",
      accent: "#10b981",
      image: "/wireless_monitoring.webp",
      description: "Hardening continental power distribution grids, high-output electrical substations, and water transformation architectures through high-noise immune telemetry and physical containment monitoring."
    }
  ]);

  // Capabilities State
  const [capabilitiesTagline, setCapabilitiesTagline] = useState<string>("Core Expertise");
  const [capabilitiesTitle, setCapabilitiesTitle] = useState<string>("Core Capabilities Portfolio");
  const [capabilitiesDesc, setCapabilitiesDesc] = useState<string>("Eastwind executes complex, multi-disciplinary workflows through structural, instrumentation, and fire safety engineering domains to assure unified system performance.");
  const [corePortfolios, setCorePortfolios] = useState<CorePortfolioItem[]>([
    {
      title: "AI, Digitalisation & Data Architecture",
      description: "Advanced data acquisition pipelines running Agentic AI models to enable automated predictive asset diagnostics.",
      items: [
        "AI infrastructure deployment for volatile processing contexts",
        "Plant operations enablement utilizing operational Agentic AI",
        "Process parameter optimization and predictive engineering analysis",
        "Data acquisition topologies facilitating rapid AI framework execution"
      ],
      icon: "⚡"
    },
    {
      title: "Tactical Response Integration",
      description: "Complete design engineering, manufacturing, and systems calibration for highly tailored safety fleets.",
      items: [
        "Heavy emergency industrial fire trucks and fluid tanker units",
        "SCBA mobile compressed air cylinder recharging trucks",
        "Rapid intervention vehicles (RIV) for tactical site access",
        "Amphibious extreme-terrain safety equipment and clinical units"
      ],
      icon: "⚙️"
    },
    {
      title: "Fire & Gas Detection Topologies",
      description: "Intelligent field instrumentation grids built to pass strict SIL 2 and SIL 3 risk parameters.",
      items: [
        "Fixed and portable multi-point toxic gas detection infrastructure",
        "Visual and acoustic emergency alerting networks",
        "Multi-spectrum optical flame monitoring instruments",
        "Linear thermal cables and localized smoke detection arrays"
      ],
      icon: "👁️"
    },
    {
      title: "Extinguishing & Lifecycle Simulation",
      description: "Clean agent containment systems paired with high-fidelity operator training platforms.",
      items: [
        "Novec 1230, CO2, and Inergen absolute suppression setups",
        "Virtual reality and kinetic hot-fire training simulator modules",
        "High-capacity automated foam concentrate skid engineering",
        "Underground energy pipeline physical protection systems"
      ],
      icon: "🛡️"
    },
    {
      title: "Industrial Wireless Environments",
      description: "Eliminating hazardous civil field cabling through robust, self-healing mesh communication paths.",
      items: [
        "SIL 2 capable self-configuring wireless data radio fields",
        "Wireless tracking loops for dense field instrumentation systems",
        "ATEX Zone 0 certified radio transmitter configurations",
        "Multi-hop WirelessHART & ISA100 structural mesh routing"
      ],
      icon: "🛰️"
    },
    {
      title: "Specialised Lifecycles & Field Services",
      description: "Multi-disciplinary lifecycle management from conceptual studies to laboratory field calibrations.",
      items: [
        "Concept development, system design layouts, and HSE consulting",
        "Comprehensive H2S fleet rental assets and breathing air packs",
        "Operational operator certifications tailored to client locations",
        "Torque, pressure, thermal, and electrical field calibration loops"
      ],
      icon: "🔬"
    }
  ]);

  // Technology Partners State
  const [partnersTagline, setPartnersTagline] = useState<string>("Global Integration");
  const [partnersTitle, setPartnersTitle] = useState<string>("Integrated Technology Partners");
  const [partnersDesc, setPartnersDesc] = useState<string>("We securely assimilate components from verified global market leaders into unified, field-ready physical frameworks.");
  const [partners, setPartners] = useState<any[]>([
    "Dräger", "Empel", "Nardi", "Mimes", "One Seven", "Sieon", "Xshielder",
    "Nittan", "FlamePro", "E2S", "Schneider", "CRI", "CEJN", "Polyhose",
    "Keiconnections", "Leader", "Tridiagonal", "Phoenix", "Pepperl+Fuchs",
    "Guttor", "Paratech", "Panam", "Atexxor", "Thermocable"
  ]);

  // Gateway State
  const [gatewayTagline, setGatewayTagline] = useState<string>("Enquiry Gateway");
  const [gatewayTitle, setGatewayTitle] = useState<string>("Initiate Solution Proposal Request");
  const [gatewayDesc, setGatewayDesc] = useState<string>("Our regional infrastructure engineering office coordinates directly with technical site operators to map out field constraints, balance topologies, and deploy high-compliance certified safety systems.");
  const [solutionScopeOptions, setSolutionScopeOptions] = useState<DropdownOption[]>([
    { value: "ai-digitalization", label: "AI, Digitalisation & Data" },
    { value: "firefighting", label: "Tactical Response Fleet Systems" },
    { value: "gas-detection", label: "Fire & Gas Topology Loops" },
    { value: "suppression", label: "Extinguishing & Simulator Skids" },
    { value: "wireless", label: "Industrial Wireless Mesh Networks" },
    { value: "services", label: "Specialised Field Services" }
  ]);
  const [submitButtonText, setSubmitButtonText] = useState<string>("Submit Request");

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const fetchSolutionsPage = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/solutions-page`);
      if (!res.ok) throw new Error("Failed to fetch Solutions Page config");
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
      if (data.solutionScopeOptions && data.solutionScopeOptions.length > 0) setSolutionScopeOptions(data.solutionScopeOptions);
      if (data.submitButtonText) setSubmitButtonText(data.submitButtonText);

    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to backend server. Showing local defaults.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSolutionsPage();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearMessages();
    setUploadingField(fieldKey);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      setter(data.imageUrl);
      setSuccess(`File '${file.name}' uploaded successfully!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload file.");
    } finally {
      setUploadingField(null);
    }
  };

  // Save full configuration
  const handleSaveConfig = async () => {
    clearMessages();
    setSaving(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

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
        partners,
        gatewayTagline,
        gatewayTitle,
        gatewayDesc,
        solutionScopeOptions,
        submitButtonText,
      };

      const res = await fetch(`${baseUrl}/api/solutions-page`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save Solutions Page config");

      setSuccess("Solutions Page content saved successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading Solutions Page Data Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 m-0">Manage Solutions Page Content</h1>
          <p className="text-xs text-slate-500 mt-1 m-0">
            Dynamically customize Hero banner, Operating Industry categories, Core Capability portfolios, Partner logos, and Gateway form options.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-xl flex-wrap self-start md:self-auto">
          <button
            onClick={() => { setActiveTab("hero_industries"); clearMessages(); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "hero_industries" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hero & Operating Industries
          </button>
          <button
            onClick={() => { setActiveTab("capabilities"); clearMessages(); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "capabilities" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Core Capabilities
          </button>
          <button
            onClick={() => { setActiveTab("partners"); clearMessages(); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "partners" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Partner Brands
          </button>
          <button
            onClick={() => { setActiveTab("gateway"); clearMessages(); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "gateway" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Enquiry Gateway
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

      {/* TAB 1: HERO & OPERATING INDUSTRIES */}
      {activeTab === "hero_industries" && (
        <div className="space-y-8">
          
          {/* Hero Section Card */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Solutions Page Hero Banner
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Tagline Badge</label>
                <input
                  type="text"
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Main Hero Title</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Hero Overview Description</label>
              <textarea
                rows={3}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Hero Background Image Path or URL</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={heroBgImage}
                  onChange={(e) => setHeroBgImage(e.target.value)}
                  className="flex-1 px-4 py-3 text-xs border rounded-xl"
                />
                <input
                  type="file"
                  accept="image/*"
                  id="solutions-hero-upload"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setHeroBgImage, "heroBgImage")}
                />
                <label
                  htmlFor="solutions-hero-upload"
                  className="px-4 py-3 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-900 cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  {uploadingField === "heroBgImage" ? "Uploading..." : "Upload Image"}
                </label>
              </div>
            </div>
          </div>

          {/* Operating Industry Categories Header */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Operating Industry Section Header
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Section Tagline</label>
                <input
                  type="text"
                  value={industriesTagline}
                  onChange={(e) => setIndustriesTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={industriesTitle}
                  onChange={(e) => setIndustriesTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Section Description</label>
              <textarea
                rows={2}
                value={industriesDesc}
                onChange={(e) => setIndustriesDesc(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>
          </div>

          {/* Industry Categories List */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Operating Industry Categories</h2>
              <button
                type="button"
                onClick={() => setIndustries([
                  ...industries,
                  {
                    id: `industry-${Date.now()}`,
                    name: "New Industry Category",
                    riskKicker: "PROCESS RISK CATEGORY | ZONE 1",
                    accent: "#c22026",
                    image: "/predictive_intelligence.webp",
                    description: "High-level risk mitigation narrative for this operating environment..."
                  }
                ])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Industry Category
              </button>
            </div>

            <div className="space-y-6">
              {industries.map((ind, idx) => (
                <div key={idx} className="p-6 border border-slate-200/80 rounded-xl bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">CATEGORY #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setIndustries(industries.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      Delete Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">ID Slug</label>
                      <input
                        type="text"
                        value={ind.id}
                        onChange={(e) => {
                          const updated = [...industries];
                          updated[idx].id = e.target.value;
                          setIndustries(updated);
                        }}
                        className="w-full px-3 py-2 text-xs border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Display Name</label>
                      <input
                        type="text"
                        value={ind.name}
                        onChange={(e) => {
                          const updated = [...industries];
                          updated[idx].name = e.target.value;
                          setIndustries(updated);
                        }}
                        className="w-full px-3 py-2 text-xs border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Accent Hex Color</label>
                      <input
                        type="text"
                        value={ind.accent}
                        onChange={(e) => {
                          const updated = [...industries];
                          updated[idx].accent = e.target.value;
                          setIndustries(updated);
                        }}
                        className="w-full px-3 py-2 text-xs border rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Risk Kicker Badge</label>
                    <input
                      type="text"
                      value={ind.riskKicker}
                      onChange={(e) => {
                        const updated = [...industries];
                        updated[idx].riskKicker = e.target.value;
                        setIndustries(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={ind.description}
                      onChange={(e) => {
                        const updated = [...industries];
                        updated[idx].description = e.target.value;
                        setIndustries(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Category Image Path / URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ind.image}
                        onChange={(e) => {
                          const updated = [...industries];
                          updated[idx].image = e.target.value;
                          setIndustries(updated);
                        }}
                        className="flex-1 px-3 py-2 text-xs border rounded-lg"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id={`ind-img-${idx}`}
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, (url) => {
                          const updated = [...industries];
                          updated[idx].image = url;
                          setIndustries(updated);
                        }, `industry-${idx}`)}
                      />
                      <label
                        htmlFor={`ind-img-${idx}`}
                        className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Upload
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveConfig}
              className="px-8 py-3.5 bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Solutions Page Content"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CORE CAPABILITIES PORTFOLIOS */}
      {activeTab === "capabilities" && (
        <div className="space-y-8">
          
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Core Capabilities Section Header
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Section Tagline</label>
                <input
                  type="text"
                  value={capabilitiesTagline}
                  onChange={(e) => setCapabilitiesTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={capabilitiesTitle}
                  onChange={(e) => setCapabilitiesTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Section Description</label>
              <textarea
                rows={2}
                value={capabilitiesDesc}
                onChange={(e) => setCapabilitiesDesc(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>
          </div>

          {/* Portfolios Cards List */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Core Capability Portfolio Cards</h2>
              <button
                type="button"
                onClick={() => setCorePortfolios([
                  ...corePortfolios,
                  {
                    title: "New Capability Domain",
                    description: "High-level domain description narrative...",
                    items: ["Capability feature item 1", "Capability feature item 2"],
                    icon: "🛡️"
                  }
                ])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Capability Card
              </button>
            </div>

            <div className="space-y-6">
              {corePortfolios.map((port, idx) => (
                <div key={idx} className="p-6 border border-slate-200/80 rounded-xl bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">CARD #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setCorePortfolios(corePortfolios.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      Delete Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Icon Emoji</label>
                      <input
                        type="text"
                        value={port.icon}
                        onChange={(e) => {
                          const updated = [...corePortfolios];
                          updated[idx].icon = e.target.value;
                          setCorePortfolios(updated);
                        }}
                        className="w-full px-3 py-2 text-xs border rounded-lg text-center"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={port.title}
                        onChange={(e) => {
                          const updated = [...corePortfolios];
                          updated[idx].title = e.target.value;
                          setCorePortfolios(updated);
                        }}
                        className="w-full px-3 py-2 text-xs border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Description</label>
                    <textarea
                      rows={2}
                      value={port.description}
                      onChange={(e) => {
                        const updated = [...corePortfolios];
                        updated[idx].description = e.target.value;
                        setCorePortfolios(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>

                  {/* Bullet items */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Bullet Items (One per line)</label>
                    <textarea
                      rows={3}
                      value={port.items.join("\n")}
                      onChange={(e) => {
                        const updated = [...corePortfolios];
                        updated[idx].items = e.target.value.split("\n").filter(Boolean);
                        setCorePortfolios(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveConfig}
              className="px-8 py-3.5 bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Solutions Page Content"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: TECHNOLOGY PARTNER BRANDS */}
      {activeTab === "partners" && (
        <div className="space-y-8">
          
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Technology Partners Section Header
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Section Tagline</label>
                <input
                  type="text"
                  value={partnersTagline}
                  onChange={(e) => setPartnersTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={partnersTitle}
                  onChange={(e) => setPartnersTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Section Description</label>
              <textarea
                rows={2}
                value={partnersDesc}
                onChange={(e) => setPartnersDesc(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>
          </div>

          {/* Partner Brands Cards Editor with View, Edit, Add, and Delete Actions */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 m-0 flex items-center gap-2">
                  <span>Integrated Partner Brands & Logos</span>
                  <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {partners.length} Brands
                  </span>
                </h2>
                <p className="text-xs text-slate-500 m-0 mt-1">Manage brand names and logo images displayed on the auto-scrolling solutions carousel.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newBrand = { name: "New Partner Brand", logo: "" };
                  setPartners([...partners, newBrand]);
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
                        <h3 className="text-sm font-extrabold text-slate-900 m-0 truncate group-hover:text-orange-600 transition-colors">
                          {name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono truncate block mt-0.5">
                          {logo ? "Custom Logo Attached" : "Default Auto Match"}
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
                            onChange={(e) => handleImageUpload(e, (url) => {
                              const updated = [...partners];
                              if (typeof updated[idx] === "string") {
                                updated[idx] = { name: updated[idx], logo: url };
                              } else {
                                updated[idx] = { ...updated[idx], logo: url };
                              }
                              setPartners(updated);
                            }, `partner-logo-${idx}`)}
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

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveConfig}
              className="px-8 py-3.5 bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Solutions Page Content"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: ENQUIRY GATEWAY & FORM SCOPES */}
      {activeTab === "gateway" && (
        <div className="space-y-8">
          
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Enquiry Gateway Section Header & Button
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Gateway Tagline</label>
                <input
                  type="text"
                  value={gatewayTagline}
                  onChange={(e) => setGatewayTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Gateway Title</label>
                <input
                  type="text"
                  value={gatewayTitle}
                  onChange={(e) => setGatewayTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Gateway Description</label>
              <textarea
                rows={2}
                value={gatewayDesc}
                onChange={(e) => setGatewayDesc(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Form Submit Button Label</label>
              <input
                type="text"
                value={submitButtonText}
                onChange={(e) => setSubmitButtonText(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>
          </div>

          {/* Primary Solution Scope Dropdown Options */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Primary Solution Scope Dropdown Choices</h2>
              <button
                type="button"
                onClick={() => setSolutionScopeOptions([
                  ...solutionScopeOptions,
                  { value: `scope-${Date.now()}`, label: "New Solution Scope Option" }
                ])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Scope Option
              </button>
            </div>

            <div className="space-y-4">
              {solutionScopeOptions.map((opt, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-200/60 rounded-xl bg-slate-50/50">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option Value Key</label>
                    <input
                      type="text"
                      value={opt.value}
                      onChange={(e) => {
                        const updated = [...solutionScopeOptions];
                        updated[idx].value = e.target.value;
                        setSolutionScopeOptions(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg font-mono"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option Display Label</label>
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => {
                        const updated = [...solutionScopeOptions];
                        updated[idx].label = e.target.value;
                        setSolutionScopeOptions(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSolutionScopeOptions(solutionScopeOptions.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 font-bold text-xs shrink-0 cursor-pointer self-end sm:self-center py-2"
                  >
                    Remove Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveConfig}
              className="px-8 py-3.5 bg-orange-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Solutions Page Content"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
