"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  // Services Page Hero Banner State
  const [heroBgImage, setHeroBgImage] = useState<string>("/products/default-process-instrumentation.png");
  const [heroTagline, setHeroTagline] = useState<string>("FIELD & ENGINEERING SERVICES");
  const [heroTitle, setHeroTitle] = useState<string>("SPECIALIZED ENGINEERING SERVICES");
  const [heroDescription, setHeroDescription] = useState<string>("Full lifecycle support, commissioning, functional safety assessments, and rapid calibration coverage across primary operating facilities.");
  const [savingBanner, setSavingBanner] = useState<boolean>(false);
  const [uploadingBanner, setUploadingBanner] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any | null>(null);

  // Form states
  const [formId, setFormId] = useState<string>("");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("");
  const [formTagline, setFormTagline] = useState<string>("");
  const [formOverview, setFormOverview] = useState<string>("");
  const [formAccentHex, setFormAccentHex] = useState<string>("#10b981"); // Emerald green default for services

  // Lists
  const [formCapabilities, setFormCapabilities] = useState<{ title: string; body: string }[]>([]);
  const [capTitle, setCapTitle] = useState<string>("");
  const [capBody, setCapBody] = useState<string>("");

  const [formDeliverables, setFormDeliverables] = useState<string[]>([]);
  const [deliverableInput, setDeliverableInput] = useState<string>("");

  const [formMetrics, setFormMetrics] = useState<{ value: string; label: string }[]>([]);
  const [metricValue, setMetricValue] = useState<string>("");
  const [metricLabel, setMetricLabel] = useState<string>("");

  // Individual Service Item Image State
  const [formHeroImage, setFormHeroImage] = useState<string>("");
  const [uploadingItemImage, setUploadingItemImage] = useState<boolean>(false);

  const fetchServices = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const [serRes, pageRes] = await Promise.all([
        fetch(`${baseUrl}/api/services`),
        fetch(`${baseUrl}/api/solutions-page?t=${Date.now()}`)
      ]);
      if (!serRes.ok) throw new Error("Failed to fetch services");
      const list = await serRes.json();
      setServices(list);

      if (pageRes.ok) {
        const pageData = await pageRes.json();
        if (pageData.servicesHeroBgImage) setHeroBgImage(pageData.servicesHeroBgImage);
        if (pageData.servicesHeroTagline) setHeroTagline(pageData.servicesHeroTagline);
        if (pageData.servicesHeroTitle) setHeroTitle(pageData.servicesHeroTitle);
        if (pageData.servicesHeroDescription) setHeroDescription(pageData.servicesHeroDescription);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to retrieve services from database.");
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    clearMessages();

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
          setHeroBgImage(uploadData.url);
          setSuccess(`Hero image '${file.name}' uploaded successfully!`);
          setUploadingBanner(false);
          e.target.value = "";
          return;
        }
      }
    } catch (err) {
      console.warn("Direct upload fallback:", err);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setHeroBgImage(event.target.result as string);
        setSuccess(`Image processed.`);
      }
      setUploadingBanner(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSaveHeroBanner = async () => {
    setSavingBanner(true);
    clearMessages();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${baseUrl}/api/solutions-page`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          servicesHeroBgImage: heroBgImage,
          servicesHeroTagline: heroTagline,
          servicesHeroTitle: heroTitle,
          servicesHeroDescription: heroDescription
        })
      });
      if (!res.ok) throw new Error("Failed to save Services Hero Banner");
      setSuccess("Services Page Hero Banner & Background Photo saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save Hero Banner");
    } finally {
      setSavingBanner(false);
    }
  };

  const handleItemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingItemImage(true);
    clearMessages();

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
          setFormHeroImage(uploadData.url);
          setSuccess(`Service cover photo '${file.name}' uploaded!`);
          setUploadingItemImage(false);
          e.target.value = "";
          return;
        }
      }
    } catch (err) {
      console.warn("Item photo upload fallback:", err);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormHeroImage(event.target.result as string);
        setSuccess(`Image processed.`);
      }
      setUploadingItemImage(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleOpenCreate = () => {
    clearMessages();
    setIsEdit(false);
    setFormId("");
    setFormTitle("");
    setFormCategory("");
    setFormTagline("");
    setFormOverview("");
    setFormAccentHex("#10b981");
    setFormHeroImage("");
    setFormCapabilities([]);
    setFormDeliverables([]);
    setFormMetrics([]);
    setCapTitle("");
    setCapBody("");
    setDeliverableInput("");
    setMetricValue("");
    setMetricLabel("");
    setShowModal(true);
  };

  const handleOpenEdit = (item: any) => {
    clearMessages();
    setIsEdit(true);
    setFormId(item.id || item._id || "");
    setFormTitle(item.title);
    setFormCategory(item.category || "");
    setFormTagline(item.tagline || "");
    setFormOverview(item.overview || "");
    setFormAccentHex(item.accentHex || "#10b981");
    setFormHeroImage(item.heroImage || item.imageUrl || "");
    setFormCapabilities(item.capabilities || []);
    setFormDeliverables(item.deliverables || []);
    setFormMetrics(item.metrics || []);
    setCapTitle("");
    setCapBody("");
    setDeliverableInput("");
    setMetricValue("");
    setMetricLabel("");
    setShowModal(true);
  };

  const addCapability = () => {
    if (capTitle.trim() && capBody.trim()) {
      setFormCapabilities([...formCapabilities, { title: capTitle.trim(), body: capBody.trim() }]);
      setCapTitle("");
      setCapBody("");
    }
  };

  const removeCapability = (idx: number) => {
    setFormCapabilities(formCapabilities.filter((_, i) => i !== idx));
  };

  const addDeliverable = () => {
    if (deliverableInput.trim()) {
      setFormDeliverables([...formDeliverables, deliverableInput.trim()]);
      setDeliverableInput("");
    }
  };

  const removeDeliverable = (idx: number) => {
    setFormDeliverables(formDeliverables.filter((_, i) => i !== idx));
  };

  const addMetric = () => {
    if (metricValue.trim() && metricLabel.trim()) {
      setFormMetrics([...formMetrics, { value: metricValue.trim(), label: metricLabel.trim() }]);
      setMetricValue("");
      setMetricLabel("");
    }
  };

  const removeMetric = (idx: number) => {
    setFormMetrics(formMetrics.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!formId || !formTitle || !formTagline || !formOverview) {
      setError("Please fill in all required parameters.");
      return;
    }

    const payload = {
      id: formId.trim().toLowerCase().replace(/\s+/g, "-"),
      title: formTitle.trim(),
      category: formCategory.trim(),
      tagline: formTagline.trim(),
      overview: formOverview.trim(),
      accentHex: formAccentHex,
      heroImage: formHeroImage.trim(),
      imageUrl: formHeroImage.trim(),
      capabilities: formCapabilities,
      deliverables: formDeliverables,
      metrics: formMetrics,
      relatedSolutions: []
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      let res;
      if (isEdit) {
        res = await fetch(`${baseUrl}/api/services/${encodeURIComponent(payload.id)}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${baseUrl}/api/services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save operation failed");

      setSuccess(`Service '${payload.title}' successfully ${isEdit ? "updated" : "created"}.`);
      setShowModal(false);
      fetchServices();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save service details to database.");
    }
  };

  const handleDelete = async () => {
    const target = (deleteTarget || "").trim();
    if (!target) return;
    clearMessages();

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${baseUrl}/api/services/${encodeURIComponent(target)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete operation failed");

      setSuccess("Service deleted successfully.");
      setDeleteTarget(null);
      fetchServices();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete service.");
      setDeleteTarget(null);
    }
  };

  const filteredServices = services.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-xl font-bold tracking-tight m-0 text-slate-900">Consultancy Services</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage safety consultancy programs, audit scopes, and deliverables</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 py-2 px-4 rounded-sm bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-[#1e3e8f]"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-white">Add New Service</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 px-4 rounded-sm text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 px-4 rounded-sm text-xs">
          {success}
        </div>
      )}

      {/* 1. Services Page Hero Banner & Background Photo */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 m-0">1. Services Page Hero Banner & Background Photo</h2>
            <p className="text-xs text-slate-500 mt-0.5 m-0">Customize hero banner background photo, headline title, tagline badge, and intro text for the Services view.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveHeroBanner}
            disabled={savingBanner}
            className="px-4 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{savingBanner ? "Saving..." : "Save Banner"}</span>
          </button>
        </div>
        
        {/* Hero Background Photo Preview & Uploader */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Hero Background Image</label>
          {heroBgImage && (
            <div className="w-fit max-w-xl rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-1.5 shadow-2xs">
              <img
                src={formatImageUrl(heroBgImage, "/products/default-process-instrumentation.png")}
                alt="Services Hero Background"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/products/default-process-instrumentation.png";
                }}
                className="h-48 sm:h-56 w-auto max-w-full rounded-lg object-contain block"
              />
            </div>
          )}
          <div className="flex gap-2 items-center text-xs max-w-xl">
            <input
              type="text"
              value={heroBgImage}
              onChange={(e) => setHeroBgImage(e.target.value)}
              placeholder="Image URL or upload a file..."
              className="w-full p-2.5 border border-slate-200 rounded-lg font-mono text-[11px]"
            />
            <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer shrink-0">
              {uploadingBanner ? "Uploading..." : "Upload Photo"}
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Hero Tagline</label>
            <input
              type="text"
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Hero Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg font-bold"
            />
          </div>
        </div>
        <div>
          <label className="block font-bold text-slate-700 mb-1">Hero Description</label>
          <textarea
            rows={3}
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-sm text-xs"
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 m-0">2. Engineering Services Catalog ({totalItems} Items)</h2>
            <p className="text-xs text-slate-500 mt-0.5 m-0">Manage specialized engineering service offerings, deliverables, and capabilities.</p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md w-full">
        <span className="absolute left-3.5 top-2.5 text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search services by title, category or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:border-[#1e3e8f] focus:outline-none transition-colors"
        />
      </div>

      {/* Services List Table */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#1e3e8f] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading services database...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs font-medium">
            No consultancy services found. Click &quot;Add New Service&quot; to begin.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left m-0">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">Service Code (ID)</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">Service Title</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">Category</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">Accent Color</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {paginatedServices.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider">{item.id}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-900 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded border border-slate-200 bg-slate-100 overflow-hidden shrink-0">
                          <img
                            src={formatImageUrl(item.heroImage || item.imageUrl, "/service.png")}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/service.png"; }}
                          />
                        </div>
                        <span className="truncate font-semibold">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{item.category}</td>
                    <td className="px-5 py-3.5 text-xs">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700">
                        <span className="w-3.5 h-3.5 rounded-sm border border-slate-300" style={{ backgroundColor: item.accentHex }} />
                        {item.accentHex}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setViewItem(item)}
                        className="py-1 px-2.5 rounded-sm text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white hover:bg-emerald-50 transition-colors cursor-pointer border border-emerald-200 hover:border-emerald-300 shadow-2xs"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="py-1 px-2.5 rounded-sm text-xs font-semibold text-[#1e3e8f] hover:text-blue-900 bg-white hover:bg-blue-50 transition-colors cursor-pointer border border-blue-200 hover:border-blue-300 shadow-2xs"
                        style={{ color: "#1e3e8f" }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item.id || item._id)}
                        className="py-1 px-2.5 rounded-sm text-xs font-semibold text-[#c22026] hover:text-red-900 bg-white hover:bg-rose-50 transition-colors cursor-pointer border border-rose-200 hover:border-rose-300 shadow-2xs"
                        style={{ color: "#c22026" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-slate-200 bg-slate-50">
                <span className="text-xs text-slate-600 font-medium">
                  Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} entries
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="py-1 px-2.5 rounded-sm border border-slate-300 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer ${
                        currentPage === page
                          ? "bg-[#1e3e8f] text-white border border-[#1e3e8f]"
                          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="py-1 px-2.5 rounded-sm border border-slate-300 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CRUD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
            
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-8 border-b border-slate-200 flex-shrink-0 bg-slate-50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 m-0" style={{ color: "#000000" }}>
                {isEdit ? `Edit Service: ${formId}` : "Create New Service"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors shadow-2xs"
                title="Close"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <form id="service-form" onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>Service Slug ID *</label>
                  <input
                    type="text"
                    required
                    disabled={isEdit}
                    placeholder="e.g. hse-consultancy"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none disabled:bg-slate-100 disabled:text-slate-700"
                    style={{ color: "#000000" }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter visual title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                    style={{ color: "#000000" }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>Category Classification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Risk Audit Programs"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                    style={{ color: "#000000" }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>Tagline statement *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter service tagline statement"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                    style={{ color: "#000000" }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>Accent Hex Theme Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={formAccentHex}
                      onChange={(e) => setFormAccentHex(e.target.value)}
                      className="w-12 h-10 bg-white border border-slate-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#10b981"
                      value={formAccentHex}
                      onChange={(e) => setFormAccentHex(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-mono font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                      style={{ color: "#000000" }}
                    />
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>Overview Summary *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter detailed service overview statement"
                  value={formOverview}
                  onChange={(e) => setFormOverview(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none transition-colors"
                  style={{ color: "#000000" }}
                />
              </div>

              {/* Service Specific Hero / Cover Image */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <label className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>
                  Service Hero / Cover Image (Optional Override)
                </label>
                <p className="text-[11px] text-slate-500 m-0 pl-1">
                  Assign a unique hero image for this specific engineering service detail page. If left blank, it falls back to the default detail hero photo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  {formHeroImage && (
                    <div className="w-16 h-12 rounded-lg border border-slate-300 overflow-hidden bg-slate-100 shrink-0 shadow-2xs">
                      <img
                        src={formatImageUrl(formHeroImage, "/service.png")}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/service.png"; }}
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Image URL or upload file (/service.png, /uploads/...)"
                    value={formHeroImage}
                    onChange={(e) => setFormHeroImage(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-mono font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                    style={{ color: "#000000" }}
                  />
                  <label className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer shrink-0 transition-colors border border-slate-300 flex items-center gap-1.5 shadow-2xs">
                    <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>{uploadingItemImage ? "Uploading..." : "Upload Photo"}</span>
                    <input type="file" accept="image/*" onChange={handleItemImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Capabilities (Title and Body) */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>Operational Capabilities</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Capability Title"
                    value={capTitle}
                    onChange={(e) => setCapTitle(e.target.value)}
                    className="px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                    style={{ color: "#000000" }}
                  />
                  <div className="md:col-span-2 flex gap-4">
                    <input
                      type="text"
                      placeholder="Capability description statement"
                      value={capBody}
                      onChange={(e) => setCapBody(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                      style={{ color: "#000000" }}
                    />
                    <button
                      type="button"
                      onClick={addCapability}
                      className="px-5 py-3 rounded-lg bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
                      style={{ color: "#ffffff", backgroundColor: "#1e3e8f" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {formCapabilities.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-black block" style={{ color: "#000000" }}>{item.title}</span>
                        <p className="text-[11px] text-slate-800 font-medium leading-relaxed m-0" style={{ color: "#1e293b" }}>{item.body}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCapability(idx)}
                        className="text-rose-600 hover:text-rose-700 font-bold uppercase text-[10px] tracking-wider cursor-pointer border-none bg-transparent"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables (Bullet List) */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>Key Deliverables</span>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter deliverable output (e.g. 3D Ray Tracing Report)"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f]"
                    style={{ color: "#000000" }}
                  />
                  <button
                    type="button"
                    onClick={addDeliverable}
                    className="px-5 py-3 rounded-lg bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
                    style={{ color: "#ffffff", backgroundColor: "#1e3e8f" }}
                  >
                    Add
                  </button>
                </div>
                <ul className="flex flex-col gap-2 pl-0 list-none m-0">
                  {formDeliverables.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <span className="text-black font-medium leading-relaxed" style={{ color: "#000000" }}>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeDeliverable(idx)}
                        className="text-rose-600 hover:text-rose-700 font-bold uppercase text-[10px] tracking-wider cursor-pointer border-none bg-transparent"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics Grid */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-black block pl-1" style={{ color: "#000000" }}>Service Metric Highlights</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Metric Value (e.g. 100%)"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    className="px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                    style={{ color: "#000000" }}
                  />
                  <div className="md:col-span-2 flex gap-4">
                    <input
                      type="text"
                      placeholder="Metric label description"
                      value={metricLabel}
                      onChange={(e) => setMetricLabel(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                      style={{ color: "#000000" }}
                    />
                    <button
                      type="button"
                      onClick={addMetric}
                      className="px-5 py-3 rounded-lg bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
                      style={{ color: "#ffffff", backgroundColor: "#1e3e8f" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formMetrics.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-2 relative group">
                      <button
                        type="button"
                        onClick={() => removeMetric(idx)}
                        className="absolute right-3 top-3 text-[10px] text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer font-bold p-1 rounded hover:bg-rose-500/10"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <span className="text-xl font-extrabold tracking-tight" style={{ color: formAccentHex }}>{item.value}</span>
                      <span className="text-[10px] font-mono text-slate-800 font-bold block uppercase tracking-wider leading-relaxed" style={{ color: "#1e293b" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              </form>
            </div>

            {/* Fixed Footer */}
            <div className="py-4 px-8 border-t border-slate-200 flex justify-end gap-3 flex-shrink-0 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-lg text-black border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
                style={{ color: "#000000", backgroundColor: "#ffffff" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="service-form"
                className="px-8 py-2.5 rounded-lg bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-lg shadow-[#1e3e8f]/20"
                style={{ color: "#ffffff", backgroundColor: "#1e3e8f" }}
              >
                {isEdit ? "Update Service" : "Save Service"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-8 rounded-xl w-full max-w-md text-center space-y-6 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 text-lg mx-auto">
              <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight m-0">Confirm Delete Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal m-0">
                Are you sure you want to permanently delete service `{deleteTarget}`? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-black text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
                style={{ color: "#000000", backgroundColor: "#ffffff" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-7 py-2.5 rounded-lg bg-[#c22026] hover:bg-[#9e1a1f] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
                style={{ color: "#ffffff", backgroundColor: "#c22026" }}
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}


      {/* VIEW MODAL OVERLAY */}
      {viewItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="h-16 flex items-center justify-between px-8 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 m-0">
                Service Details: {viewItem.title || viewItem.id}
              </h3>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors shadow-2xs"
                title="Close"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Service Title</span>
                  <h2 className="text-base font-bold text-slate-900 m-0 mt-0.5">{viewItem.title}</h2>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Category Tagline</span>
                  <p className="text-xs text-slate-700 font-semibold m-0 mt-0.5">{viewItem.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Accent Color Hex</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: viewItem.accentHex }} />
                    <span className="text-xs font-mono font-bold text-slate-800">{viewItem.accentHex}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Section Tagline</span>
                  <p className="text-xs text-slate-700 font-semibold m-0 mt-0.5">{viewItem.tagline}</p>
                </div>
              </div>

              {/* Overview */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Overview Description</span>
                <p className="text-xs text-slate-650 leading-relaxed font-light m-0">{viewItem.overview}</p>
              </div>

              {/* Capabilities */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">Core Capabilities</span>
                {viewItem.capabilities && viewItem.capabilities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {viewItem.capabilities.map((cap: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-150 rounded-lg relative">
                        <h4 className="text-xs font-bold text-slate-800 mb-1">{cap.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-light m-0">{cap.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-light m-0">No capabilities defined.</p>
                )}
              </div>

              {/* Deliverables & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">Key Deliverables</span>
                  {viewItem.deliverables && viewItem.deliverables.length > 0 ? (
                    <ul className="space-y-2 pl-0 list-none m-0 text-xs text-slate-650">
                      {viewItem.deliverables.map((del: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1e3e8f] shrink-0 mt-1.5" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 font-light m-0">No deliverables logged.</p>
                  )}
                </div>

                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">Performance Metrics</span>
                  {viewItem.metrics && viewItem.metrics.length > 0 ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <table className="w-full border-collapse text-left m-0 text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-2 font-bold text-slate-650">Metric Label</th>
                            <th className="px-4 py-2 font-bold text-slate-650 text-right">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {viewItem.metrics.map((met: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-4 py-2 text-slate-600 font-light">{met.label}</td>
                              <td className="px-4 py-2 text-[#1e3e8f] font-bold text-right">{met.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-light m-0">No metrics specified.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="h-16 flex items-center justify-end px-8 border-t border-slate-100 flex-shrink-0 bg-slate-50">
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <span>Close View</span>
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
