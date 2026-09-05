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
  integrationTagline?: string;
  integrationTitle?: string;
  integrationDescription?: string;
  integrationSteps?: {
    stepNumber: string;
    title: string;
    description: string;
    phase: string;
  }[];
}

interface IndustryItem {
  id: string;
  name: string;
  riskKicker: string;
  accent: string;
  image: string;
  description: string;
  items?: { name: string; items: string[] }[];
}

interface CorePortfolioItem {
  title: string;
  description: string;
  items: string[];
  icon: string;
}

const DEFAULT_INDUSTRY_GROUPS: Record<string, { name: string; items: string[] }[]> = {
  "civil-defence": [
    {
      name: "Fleet & Specialized Vehicles",
      items: ["Asset management systems AI integrated fire trucks", "Rescue intervention truck (RIV)", "SCBA trucks", "CBRN Vehicles"]
    },
    {
      name: "Extinguishing & Incident Response",
      items: ["Compressed air form system (CAFS)", "Emergency response system"]
    }
  ],
  "smart-industrial-facilities": [
    {
      name: "Factory Digitalization & IIoT",
      items: ["Smart factories", "Plant Ai", "Wireless data acquisition"]
    },
    {
      name: "Wireless Systems & Gas Safety",
      items: ["SIL2 wireless gas detection systems", "ISA 100, LUARA, HART, Wireless systems"]
    },
    {
      name: "Emergency Response & Operations",
      items: ["Emergency response solution", "Plant OPS"]
    }
  ],
  "oil-and-gas": [
    {
      name: "Wireless & Telemetry Systems",
      items: ["End-End ISA 100 wireless gas detection system", "Plant OPS", "Air loops systems", "Wireless data acquisition"]
    },
    {
      name: "Containment & Safety Infrastructure",
      items: ["TGR(temporary refuge chamber)", "LER", "Analyzer shelters"]
    },
    {
      name: "Fire Fighting & Operations",
      items: ["Tank farm fire fighting", "Digital mobility-x shielder", "H2s shelter rental", "Breathing air cascade system"]
    },
    {
      name: "Engineering & Risk Consultancy",
      items: ["HSE consultancy", "Explosion proof design consultancy"]
    }
  ],
  "marine-operations": [
    {
      name: "Vessel Containment & Integrity",
      items: ["Damage control system", "TGR", "DE Compression champeers"]
    },
    {
      name: "Wireless & Telecom Infrastructures",
      items: ["Wireless data acquisition and LAUARA 1SA 100, WIRELESS HART", "Digital mobility Xshielder", "Plant OPS"]
    },
    {
      name: "Field Services & Rentals",
      items: ["H2S shelter rental", "Air loops systems", "Breathing air cascade solution"]
    }
  ],
  "utilities-and-power": [
    {
      name: "Grid Telemetry & Sampling",
      items: ["Sampling systems", "Wireless infrastructure", "Smart Facility", "Digital mobility Xshilder"]
    },
    {
      name: "Thermal & Physical Containment",
      items: ["Analyzer shelters", "Explosion proof design consultancy"]
    }
  ],
  "defence-and-border-security": [
    {
      name: "Secure Telemetry & Modules",
      items: ["Wireless data acquisition", "Digital mobility Xshielder", "TGR"]
    },
    {
      name: "Blast Isolation & Tactical Shielding",
      items: ["LER", "Analyzer shelters", "Explosion proof design consultancy"]
    }
  ]
};

export default function UnifiedAdminSolutionsPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "page_layout">("catalog");
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingPage, setSavingPage] = useState<boolean>(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
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
  const [savingItem, setSavingItem] = useState<boolean>(false);

  // Integration Process Form State
  const [formIntegrationTagline, setFormIntegrationTagline] = useState<string>("Lifecycle Sequence");
  const [formIntegrationTitle, setFormIntegrationTitle] = useState<string>("The Integration Process");
  const [formIntegrationDescription, setFormIntegrationDescription] = useState<string>("We translate abstract regulatory mandates into continuous physical and operational resilience across your installations.");
  const [formIntegrationSteps, setFormIntegrationSteps] = useState<{ stepNumber: string; title: string; description: string; phase: string }[]>([
    {
      stepNumber: "01",
      title: "Environment Evaluation",
      description: "Industrial fields map out distinct exposure metrics. We isolate localized volatile gas indicators and ambient temperature boundaries to define system protections accurately.",
      phase: "Initial Assessment"
    },
    {
      stepNumber: "02",
      title: "Custom Infrastructure Integration",
      description: "Our professional systems represent the pinnacle of industrial safety engineering. We work directly with leading global safety brands to design, supply, install and calibrate instrumentation loops.",
      phase: "System Deployment"
    },
    {
      stepNumber: "03",
      title: "Lower Total Cost of Ownership",
      description: "By linking engineering hardware loops directly into active plant automation networks, our platforms consistently maintain safety thresholds while lowering total cost of ownership.",
      phase: "Operations and Support"
    }
  ]);

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
      id: "civil-defence",
      name: "Civil Defence",
      riskKicker: "Metropolitan Safety Infrastructure & Emergency Response",
      accent: "#991b1b",
      image: "/products/default-fire-fighting-rescue.png",
      description: "Equipping civil defence authorities with rapid intervention vehicles, CAFS fire suppression, and SCBA breathing protection systems.",
      items: DEFAULT_INDUSTRY_GROUPS["civil-defence"]
    },
    {
      id: "smart-industrial-facilities",
      name: "Smart Industrial Facilities",
      riskKicker: "Automated Facility Health & Process Reliability",
      accent: "#c22026",
      image: "/products/default-process-instrumentation.png",
      description: "Deploying enterprise digital twins, automated AI permit tracking, and wireless acoustic leak sensors inside petrochemical plants.",
      items: DEFAULT_INDUSTRY_GROUPS["smart-industrial-facilities"]
    },
    {
      id: "oil-and-gas",
      name: "Oil and Gas",
      riskKicker: "Intelligent Hydrocarbon Operations & Wireless Gas Detection",
      accent: "#c22026",
      image: "/products/default-wireless-gas-detection.png",
      description: "Integrated hydrocarbon safety, intrinsic ISA 100 wireless gas detection, temporary refuge chambers, and tank farm fire fighting.",
      items: DEFAULT_INDUSTRY_GROUPS["oil-and-gas"]
    },
    {
      id: "marine-operations",
      name: "Marine Operations",
      riskKicker: "Harsh Deepwater Infrastructure Resilience & Damage Control",
      accent: "#b45309",
      image: "/products/default-explosion-proof-products.png",
      description: "Offshore platform and vessel safety, emergency damage control kits, hull breach shoring, and breathing air cascades.",
      items: DEFAULT_INDUSTRY_GROUPS["marine-operations"]
    },
    {
      id: "utilities-and-power",
      name: "Utilities and Power",
      riskKicker: "Critical Grid Asset Safeguarding & Thermal Monitoring",
      accent: "#c22026",
      image: "/products/default-process-instrumentation.png",
      description: "Securing electrical substations, gas pipelines, and SWAS water sampling systems with automated thermal monitoring.",
      items: DEFAULT_INDUSTRY_GROUPS["utilities-and-power"]
    },
    {
      id: "defence-and-border-security",
      name: "Defence and Border Security",
      riskKicker: "National Level Security & Blast-Resistant Modules",
      accent: "#b45309",
      image: "/products/default-respiratory-protection.png",
      description: "High-grade perimeter defense, secure wireless telemetry backbones, and blast-resistant modular security offices.",
      items: DEFAULT_INDUSTRY_GROUPS["defence-and-border-security"]
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
        if (data.industries && data.industries.length > 0) {
          const normalized = data.industries.map((ind: any) => {
            const hasValidGroups =
              Array.isArray(ind.items) &&
              ind.items.length > 0 &&
              typeof ind.items[0] === "object" &&
              ind.items[0] !== null &&
              "name" in ind.items[0] &&
              "items" in ind.items[0];

            return {
              ...ind,
              items: hasValidGroups
                ? ind.items
                : (DEFAULT_INDUSTRY_GROUPS[ind.id] || DEFAULT_INDUSTRY_GROUPS[ind.name?.toLowerCase()?.replace(/[^a-z0-9]+/g, "-")] || [
                    {
                      name: "Core Systems & Capabilities",
                      items: ["Field Integration System", "Compliance Monitoring Skid"]
                    }
                  ])
            };
          });
          setIndustries(normalized);
        }
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
    setFormImageUrl("");
    setFormIntegrationTagline("");
    setFormIntegrationTitle("");
    setFormIntegrationDescription("");
    setFormIntegrationSteps([
      {
        stepNumber: "01",
        title: "",
        description: "",
        phase: ""
      },
      {
        stepNumber: "02",
        title: "",
        description: "",
        phase: ""
      },
      {
        stepNumber: "03",
        title: "",
        description: "",
        phase: ""
      }
    ]);
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
    setFormImageUrl(item.imageUrl || "");
    setFormIntegrationTagline(item.integrationTagline || "");
    setFormIntegrationTitle(item.integrationTitle || "");
    setFormIntegrationDescription(item.integrationDescription || "");
    setFormIntegrationSteps(
      item.integrationSteps && item.integrationSteps.length > 0
        ? item.integrationSteps
        : [
            {
              stepNumber: "01",
              title: "",
              description: "",
              phase: ""
            },
            {
              stepNumber: "02",
              title: "",
              description: "",
              phase: ""
            },
            {
              stepNumber: "03",
              title: "",
              description: "",
              phase: ""
            }
          ]
    );
    setShowModal(true);
  };

  const handleSaveSolutionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!formTitle.trim()) {
      setError("Solution title is required.");
      return;
    }

    setSavingItem(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");
      const generatedId = formId || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      let cleanImageUrl = formImageUrl.trim();
      if (cleanImageUrl.startsWith("data:image/")) {
        cleanImageUrl = await sanitizeImage(cleanImageUrl, token, baseUrl);
      }

      const payload = {
        id: generatedId,
        title: formTitle.trim(),
        subLabel: formSubLabel.trim(),
        tagline: formTagline.trim(),
        accent: formAccent,
        description: formDescription.trim(),
        detailedContent: formDetailedContent.trim(),
        imageUrl: cleanImageUrl,
        integrationTagline: formIntegrationTagline.trim(),
        integrationTitle: formIntegrationTitle.trim(),
        integrationDescription: formIntegrationDescription.trim(),
        integrationSteps: formIntegrationSteps
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

      if (res.status === 401) {
        throw new Error("Admin session has expired. Please log in again to save.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save solution item");

      setSuccess(`Solution item "${formTitle}" saved successfully!`);
      setTimeout(() => {
        setShowModal(false);
        fetchSolutions();
      }, 400);
    } catch (err: any) {
      setError(err.message || "Failed to save solution item.");
    } finally {
      setSavingItem(false);
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
  const handleSaveSolutionsPageLayout = async (sectionLabel?: string | React.MouseEvent) => {
    const label = typeof sectionLabel === "string" ? sectionLabel : undefined;
    clearMessages();
    setSavingPage(true);
    setSavingSection(label || "all");
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
        throw new Error(data.error || data.message || `Failed to save ${label || "Solutions Page layout"} (${res.status})`);
      }

      setSuccess(label ? `${label} saved successfully!` : "Solutions Page Banners & Layout saved successfully!");
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        setError("Request timed out while saving. Please try saving again now.");
      } else {
        setError(err.message || "Failed to save layout.");
      }
    } finally {
      setSavingPage(false);
      setSavingSection(null);
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
        description: "Comprehensive hazard mitigation and continuous safety telemetry integration.",
        items: [
          {
            name: "Core Equipment & Capabilities",
            items: ["Primary Safety Framework", "Integrated Field Module"]
          }
        ]
      }
    ]);
  };

  const handleDeleteIndustryCard = (index: number) => {
    setIndustries(industries.filter((_, idx) => idx !== index));
  };

  // Helpers for Industry Solution Columns & Bullet Items
  const handleAddIndustryColumn = (indIdx: number) => {
    const updated = [...industries];
    const ind = updated[indIdx];
    if (!ind) return;
    if (!Array.isArray(ind.items)) ind.items = [];
    ind.items.push({
      name: "New Solution Column",
      items: ["New System Capability Item"]
    });
    setIndustries(updated);
  };

  const handleUpdateColumnTitle = (indIdx: number, colIdx: number, newTitle: string) => {
    const updated = [...industries];
    const ind = updated[indIdx];
    if (!ind || !Array.isArray(ind.items) || !ind.items[colIdx]) return;
    ind.items[colIdx].name = newTitle;
    setIndustries(updated);
  };

  const handleDeleteIndustryColumn = (indIdx: number, colIdx: number) => {
    const updated = [...industries];
    const ind = updated[indIdx];
    if (!ind || !Array.isArray(ind.items)) return;
    ind.items = ind.items.filter((_, i) => i !== colIdx);
    setIndustries(updated);
  };

  const handleUpdateBulletItem = (indIdx: number, colIdx: number, bulletIdx: number, newText: string) => {
    const updated = [...industries];
    const ind = updated[indIdx];
    if (!ind || !Array.isArray(ind.items) || !ind.items[colIdx] || !Array.isArray(ind.items[colIdx].items)) return;
    ind.items[colIdx].items[bulletIdx] = newText;
    setIndustries(updated);
  };

  const handleDeleteBulletItem = (indIdx: number, colIdx: number, bulletIdx: number) => {
    const updated = [...industries];
    const ind = updated[indIdx];
    if (!ind || !Array.isArray(ind.items) || !ind.items[colIdx] || !Array.isArray(ind.items[colIdx].items)) return;
    ind.items[colIdx].items = ind.items[colIdx].items.filter((_, i) => i !== bulletIdx);
    setIndustries(updated);
  };

  const handleAddBulletItem = (indIdx: number, colIdx: number, text: string) => {
    if (!text.trim()) return;
    const updated = [...industries];
    const ind = updated[indIdx];
    if (!ind) return;
    if (!Array.isArray(ind.items)) ind.items = [];
    if (!ind.items[colIdx]) return;
    if (!Array.isArray(ind.items[colIdx].items)) ind.items[colIdx].items = [];
    ind.items[colIdx].items.push(text.trim());
    setIndustries(updated);
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
          e.target.value = "";
          return;
        }
      } else if (res.status === 401) {
        setError("Admin session has expired. Please log in again to upload photos.");
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
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
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
          const compressedDataUrl = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.88);
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
    e.target.value = "";
  };

  const filteredSolutions = solutions.filter((s: any) => {
    if (!s) return false;
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return true;

    const qNormalized = q.replace(/[-_\s]+/g, " ");
    const title = (s.title || "").toLowerCase();
    const titleNormalized = title.replace(/[-_\s]+/g, " ");
    const id = (s.id || "").toLowerCase();
    const idNormalized = id.replace(/[-_\s]+/g, " ");
    const subLabel = (s.subLabel || "").toLowerCase();
    const tagline = (s.tagline || "").toLowerCase();
    const desc = (s.description || "").toLowerCase();

    return (
      title.includes(q) ||
      titleNormalized.includes(qNormalized) ||
      id.includes(q) ||
      idNormalized.includes(qNormalized) ||
      subLabel.includes(q) ||
      tagline.includes(q) ||
      desc.includes(q)
    );
  });

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
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 text-red-500 hover:text-red-800 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="p-1 text-emerald-500 hover:text-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200/90 shadow-2xs">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "catalog"
              ? "bg-white text-orange-600 shadow-xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <span>Manage Solution Items</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            activeTab === "catalog" ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-600"
          }`}>
            {solutions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("page_layout")}
          className={`px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === "page_layout"
              ? "bg-white text-orange-600 shadow-xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          Manage Solutions Page Banners & Layout
        </button>
      </div>

      {activeTab === "catalog" ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-full md:w-96 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search solutions by title, ID (e.g. gas, fire, mimes)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-xs"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {searchQuery && (
                <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                  Filtering: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              <span className="text-xs text-slate-500 font-mono font-bold">
                Showing {filteredSolutions.length} of {solutions.length} solution items
              </span>
            </div>
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
                      <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
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
                      <a
                        href={`/solutions/${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Open public page for this solution"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Live Page</span>
                      </a>
                      <button
                        onClick={() => setViewItem(item)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        title="View details"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Edit solution item"
                      >
                        <svg className="w-3.5 h-3.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item.id)}
                        className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Delete solution item"
                      >
                        <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
          <div className="p-4 bg-orange-50/60 border border-orange-200/60 rounded-xl text-orange-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="font-medium text-slate-700">
              Configuring the dedicated <strong className="text-orange-900 font-bold">/solutions</strong> landing page banners, sector matrices, capability portfolios, and partner logos.
            </span>
            <button
              type="button"
              onClick={() => handleSaveSolutionsPageLayout()}
              disabled={savingPage}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50 shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{savingPage && savingSection === "all" ? "Saving..." : "Save Layout Changes"}</span>
            </button>
          </div>

          {/* Section 1: Hero Banner Settings & Photo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">1. Solutions Page Hero Banner & Background Photo</h2>
                <p className="text-xs text-slate-500 mt-0.5">Customize hero banner background image, headline title, tagline badge, and intro text.</p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSolutionsPageLayout("Hero Banner")}
                disabled={savingPage}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-xl cursor-pointer shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{savingPage && savingSection === "Hero Banner" ? "Saving..." : "Save Hero Banner"}</span>
              </button>
            </div>
            
            {/* Hero Background Photo Preview & Uploader */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Hero Background Image</label>
              {heroBgImage && (
                <div className="w-fit max-w-xl rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1.5 shadow-2xs">
                  <img
                    src={formatImageUrl(heroBgImage, "/solution.png")}
                    alt="Hero Background"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/solution.png";
                    }}
                    className="h-48 sm:h-56 w-auto max-w-full rounded-lg object-contain block"
                  />
                </div>
              )}
              <div className="flex gap-2 items-center text-xs max-w-xl">
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

            {/* Section 1 Bottom Save Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Ready to save updates to Solutions Hero Banner & Photo</span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSolutionsPageLayout("Hero Banner")}
                disabled={savingPage}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{savingPage && savingSection === "Hero Banner" ? "Saving..." : "Save Hero Banner"}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Operating Industries Cards with Add & Delete Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">2. Solutions By Operating Industry ({industries.length} Cards)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage industry sector risk profiles, image covers, technical solution columns, and bullet points.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={handleAddIndustryCard}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Add Industry Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSolutionsPageLayout("Operating Industries")}
                  disabled={savingPage}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-xl cursor-pointer shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{savingPage && savingSection === "Operating Industries" ? "Saving..." : "Save Operating Industries"}</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {industries.map((ind, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-3 relative group shadow-2xs">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2.5">
                    <input
                      type="text"
                      value={ind.name}
                      onChange={(e) => {
                        const updated = [...industries];
                        updated[idx].name = e.target.value;
                        setIndustries(updated);
                      }}
                      placeholder="Industry Sector Name"
                      className="flex-1 min-w-0 px-3 py-1.5 font-extrabold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm shadow-2xs"
                    />
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="whitespace-nowrap shrink-0 text-orange-600 font-mono text-[11px] bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-md font-bold tracking-tight">
                        {ind.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSaveSolutionsPageLayout(`Industry Card (${ind.name || ind.id})`)}
                        disabled={savingPage}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        title="Quick save this industry card"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteIndustryCard(idx)}
                        className="text-red-600 hover:text-red-700 font-bold text-xs cursor-pointer px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200/70 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                        title="Delete Card"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="whitespace-nowrap">Delete</span>
                      </button>
                    </div>
                  </div>

                    {/* Compact & Clean Industry Image Upload */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Sector Image</label>
                      <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-xl shadow-2xs">
                        <div className="w-16 h-14 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 p-1 relative">
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
                            className="flex flex-col items-center justify-center text-slate-500 text-[9px] font-mono text-center"
                          >
                            <span>No Photo</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <input
                            type="text"
                            value={ind.image}
                            onChange={(e) => {
                              const updated = [...industries];
                              updated[idx].image = e.target.value;
                              setIndustries(updated);
                            }}
                            placeholder="/uploads/... or paste image URL"
                            className="flex-1 min-w-0 px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-orange-500"
                          />
                          <label className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg cursor-pointer shrink-0 transition-colors shadow-2xs">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, (url) => {
                                const updated = [...industries];
                                updated[idx].image = url;
                                setIndustries(updated);
                              })}
                              className="hidden"
                            />
                          </label>
                          {ind.image && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...industries];
                                updated[idx].image = "";
                                setIndustries(updated);
                              }}
                              className="text-slate-400 hover:text-red-600 text-xs font-bold px-1.5 py-1 rounded transition-colors cursor-pointer shrink-0"
                              title="Remove photo"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Risk Kicker Tagline</label>
                    <input
                      type="text"
                      value={ind.riskKicker}
                      onChange={(e) => {
                        const updated = [...industries];
                        updated[idx].riskKicker = e.target.value;
                        setIndustries(updated);
                      }}
                      placeholder="e.g. Metropolitan Safety Infrastructure & Emergency Response"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Description</label>
                    <textarea
                      rows={2}
                      value={ind.description}
                      onChange={(e) => {
                        const updated = [...industries];
                        updated[idx].description = e.target.value;
                        setIndustries(updated);
                      }}
                      placeholder="Sector scope description..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Category Solution Columns & Capabilities Builder */}
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="block text-xs font-bold text-slate-800">
                        Solution Columns & Bullet Points
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddIndustryColumn(idx)}
                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Column</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(Array.isArray(ind.items) ? ind.items : []).map((col: any, colIdx: number) => {
                        const colName = typeof col === "string" ? col : (col?.name || `Column ${colIdx + 1}`);
                        const colItems: string[] = Array.isArray(col?.items) ? col.items : [];

                        return (
                          <div key={colIdx} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                            {/* Column Header & Delete button */}
                            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                              <input
                                type="text"
                                value={colName}
                                onChange={(e) => handleUpdateColumnTitle(idx, colIdx, e.target.value)}
                                placeholder="Column Header Title (e.g. Fleet & Specialized Vehicles)"
                                className="flex-1 min-w-0 px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:border-orange-500 focus:bg-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteIndustryColumn(idx, colIdx)}
                                className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                title="Delete this column"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>

                            {/* Column Items List */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-slate-500">
                                Bullet Points ({colItems.length})
                              </span>

                              <div className="space-y-1.5">
                                {colItems.map((bullet: string, bulletIdx: number) => (
                                  <div key={bulletIdx} className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1 group/item">
                                    <span className="text-orange-500 text-xs font-bold shrink-0">•</span>
                                    <input
                                      type="text"
                                      value={bullet}
                                      onChange={(e) => handleUpdateBulletItem(idx, colIdx, bulletIdx, e.target.value)}
                                      className="flex-1 text-xs text-slate-700 bg-transparent border-0 focus:outline-none py-0.5"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteBulletItem(idx, colIdx, bulletIdx)}
                                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-white transition-colors cursor-pointer"
                                      title="Remove item"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {/* Add New Bullet Point Row */}
                              <div className="flex gap-2 pt-1">
                                <input
                                  type="text"
                                  id={`add-bullet-${idx}-${colIdx}`}
                                  placeholder="+ Add bullet point & press Enter..."
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const inputEl = e.currentTarget;
                                      if (inputEl.value.trim()) {
                                        handleAddBulletItem(idx, colIdx, inputEl.value.trim());
                                        inputEl.value = "";
                                      }
                                    }
                                  }}
                                  className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-dashed border-slate-300 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const inputEl = document.getElementById(`add-bullet-${idx}-${colIdx}`) as HTMLInputElement;
                                    if (inputEl && inputEl.value.trim()) {
                                      handleAddBulletItem(idx, colIdx, inputEl.value.trim());
                                      inputEl.value = "";
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-600 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section 2 Bottom Save Action Bar */}
            <div className="mt-4 p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Ready to save updates to all {industries.length} Operating Industry sectors, columns & bullet points</span>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddIndustryCard}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Another Sector</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSolutionsPageLayout("Operating Industries")}
                  disabled={savingPage}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{savingPage && savingSection === "Operating Industries" ? "Saving..." : "Save Operating Industries"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Core Capabilities with Add & Delete Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">3. Technical Core Capabilities Portfolio ({corePortfolios.length} Cards)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Edit high-level technical capability domains, icons, and descriptions.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={handleAddCapabilityCard}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Add Capability Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSolutionsPageLayout("Core Capabilities")}
                  disabled={savingPage}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-xl cursor-pointer shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{savingPage && savingSection === "Core Capabilities" ? "Saving..." : "Save Core Capabilities"}</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {corePortfolios.map((cp, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-2 relative">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2.5">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input type="text" value={cp.icon} onChange={(e) => {
                        const updated = [...corePortfolios];
                        updated[idx].icon = e.target.value;
                        setCorePortfolios(updated);
                      }} className="w-10 p-1.5 border border-slate-200 bg-white rounded-lg text-center text-base shrink-0" />
                      <input type="text" value={cp.title} onChange={(e) => {
                        const updated = [...corePortfolios];
                        updated[idx].title = e.target.value;
                        setCorePortfolios(updated);
                      }} className="flex-1 min-w-0 p-1.5 border border-slate-200 bg-white rounded-lg font-bold text-slate-800 text-xs" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCapabilityCard(idx)}
                      className="text-red-600 hover:text-red-700 font-bold text-xs cursor-pointer px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200/70 rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
                      title="Delete Capability Card"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="whitespace-nowrap">Delete</span>
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

            {/* Section 3 Bottom Save Action Bar */}
            <div className="mt-4 p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Ready to save updates to {corePortfolios.length} Technical Core Capabilities</span>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddCapabilityCard}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Another Capability</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSolutionsPageLayout("Core Capabilities")}
                  disabled={savingPage}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{savingPage && savingSection === "Core Capabilities" ? "Saving..." : "Save Core Capabilities"}</span>
                </button>
              </div>
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
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setPartners([...partners, { name: "New Partner Brand", logo: "" }]);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Add Partner Brand</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSolutionsPageLayout("Partner Brands")}
                  disabled={savingPage}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-50 shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{savingPage && savingSection === "Partner Brands" ? "Saving..." : "Save Partner Brands"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {partners.map((partnerItem, idx) => {
                const name = typeof partnerItem === "string" ? partnerItem : partnerItem?.name || "Partner Brand";
                const logo = typeof partnerItem === "object" ? partnerItem?.logo || partnerItem?.image || "" : "";

                return (
                  <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-3 shadow-3xs hover:shadow-sm group">
                    <div className="space-y-3">
                      {/* Logo Preview Box */}
                      <div className="h-20 w-full bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center relative overflow-hidden shadow-2xs">
                        {logo && logo.trim() !== "" ? (
                          <img
                            src={formatImageUrl(logo)}
                            alt={name}
                            className="max-h-14 max-w-[120px] object-contain"
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-2 text-slate-400">
                            <span className="text-[11px] font-semibold text-slate-400">No Logo Uploaded</span>
                          </div>
                        )}
                      </div>

                      {/* Brand Name */}
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 m-0 truncate group-hover:text-orange-600 transition-colors">
                          {name}
                        </h4>
                        <span className={`text-[10px] font-mono truncate block mt-0.5 ${logo ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}`}>
                          {logo ? "✓ Logo Attached" : "⚠ No Logo (Hidden on Live Page)"}
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
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section 4 Bottom Save Action Bar */}
            <div className="mt-4 p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Ready to save updates to {partners.length} Integrated Partner Brands & Logos</span>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPartners([...partners, { name: "New Partner Brand", logo: "" }])}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Another Brand</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSolutionsPageLayout("Partner Brands")}
                  disabled={savingPage}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{savingPage && savingSection === "Partner Brands" ? "Saving..." : "Save Partner Brands"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL FOR TAB 1 ITEM */}
      {showModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="bg-white border border-slate-200/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Fixed Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-800 m-0">{isEdit ? "Edit Solution Item & Photo" : "Create New Solution Item"}</h2>
                <p className="text-xs text-slate-500 m-0 mt-0.5">Configure technical details, equipment photo, and 3-step integration lifecycle.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Close</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center justify-between shadow-xs">
                  <span>{error}</span>
                  <button type="button" onClick={clearMessages} className="text-red-500 font-bold ml-2 cursor-pointer">✕</button>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between shadow-xs">
                  <span>{success}</span>
                  <button type="button" onClick={clearMessages} className="text-emerald-600 font-bold ml-2 cursor-pointer">✕</button>
                </div>
              )}
              <form id="solution-item-form" onSubmit={handleSaveSolutionItem} className="space-y-5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Solution Title *</label>
                  <input type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Fire & Gas Detection Systems" className="w-full p-2.5 border rounded-lg font-bold" />
                </div>

                {/* Solution Item Photo with Upload & Preview */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">Solution Photo / Equipment Image</label>
                  <div className="h-44 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border relative">
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
                      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-mono font-medium text-slate-500">No Image Selected</span>
                      <span className="text-[11px] text-slate-400">Click &ldquo;Upload Photo&rdquo; or type an image path below</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="Enter image path (e.g. /uploads/image.webp) or upload file"
                      className="w-full p-2.5 border rounded-lg font-mono text-[11px]"
                    />
                    <label className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg cursor-pointer shrink-0 transition-colors shadow-xs">
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

                {/* Integration Process / Lifecycle Sequence Section */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                      Lifecycle Sequence / The Integration Process
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Configure the 3-step integration sequence shown on this solution's public page.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Tagline</label>
                      <input
                        type="text"
                        value={formIntegrationTagline}
                        onChange={(e) => setFormIntegrationTagline(e.target.value)}
                        placeholder="e.g. LIFECYCLE SEQUENCE"
                        className="w-full p-2 border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={formIntegrationTitle}
                        onChange={(e) => setFormIntegrationTitle(e.target.value)}
                        placeholder="e.g. The Integration Process"
                        className="w-full p-2 border rounded text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">3-Step Integration Workflow</label>
                    {formIntegrationSteps.map((step, sIdx) => (
                      <div key={sIdx} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={step.stepNumber || `0${sIdx + 1}`}
                            onChange={(e) => {
                              const updated = [...formIntegrationSteps];
                              updated[sIdx].stepNumber = e.target.value;
                              setFormIntegrationSteps(updated);
                            }}
                            className="w-14 p-1.5 border rounded font-mono font-bold text-center text-xs"
                            placeholder={`0${sIdx + 1}`}
                          />
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => {
                              const updated = [...formIntegrationSteps];
                              updated[sIdx].title = e.target.value;
                              setFormIntegrationSteps(updated);
                            }}
                            className="flex-1 p-1.5 border rounded font-bold text-xs"
                            placeholder={`Step ${sIdx + 1} Title`}
                          />
                          <input
                            type="text"
                            value={step.phase}
                            onChange={(e) => {
                              const updated = [...formIntegrationSteps];
                              updated[sIdx].phase = e.target.value;
                              setFormIntegrationSteps(updated);
                            }}
                            className="w-36 p-1.5 border rounded font-mono text-[10px] uppercase text-slate-600"
                            placeholder="e.g. Initial Assessment"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={step.description}
                          onChange={(e) => {
                            const updated = [...formIntegrationSteps];
                            updated[sIdx].description = e.target.value;
                            setFormIntegrationSteps(updated);
                          }}
                          className="w-full p-1.5 border rounded text-xs"
                          placeholder={`Detailed description for Step ${sIdx + 1}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Fixed Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">
                Make sure required fields (*) are completed
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="solution-item-form"
                  disabled={uploading || savingItem}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
                >
                  <span>{savingItem ? "Saving..." : (isEdit ? "Save Solution Item & Photo" : "Create Solution Item")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewItem && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewItem(null);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Fixed Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                  ID: {viewItem.id}
                </span>
                <span className="text-xs font-bold text-slate-700 truncate max-w-xs">{viewItem.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-800 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Close</span>
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                  className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-slate-500"
                >
                  <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-mono font-medium text-slate-400">No Image Specified</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 m-0">{viewItem.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{viewItem.description}</p>
              </div>

              {viewItem.detailedContent && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Technical Architecture Details</h4>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-white border border-slate-200 p-3 rounded-lg">{viewItem.detailedContent}</p>
                </div>
              )}

              {/* View Item Integration Steps */}
              {viewItem.integrationSteps && viewItem.integrationSteps.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-orange-600 font-bold block">
                      {viewItem.integrationTagline || "LIFECYCLE SEQUENCE"}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900 mt-0.5">
                      {viewItem.integrationTitle || "The Integration Process"}
                    </h4>
                    {viewItem.integrationDescription && (
                      <p className="text-xs text-slate-500 mt-1">{viewItem.integrationDescription}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {viewItem.integrationSteps.map((step, idx) => (
                      <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-orange-100 text-orange-700 font-mono font-bold flex items-center justify-center text-[10px]">
                            {step.stepNumber || `0${idx + 1}`}
                          </span>
                          <strong className="text-slate-800">{step.title}</strong>
                          {step.phase && (
                            <span className="ml-auto text-[10px] font-mono uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              {step.phase}
                            </span>
                          )}
                        </div>
                        {step.description && (
                          <p className="text-slate-600 text-[11px] pl-8 m-0">{step.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
              <a
                href={`/solutions/${viewItem.id}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-all flex items-center gap-1.5"
              >
                <span>Open Live Page</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                <span>Close Details</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
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
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
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
