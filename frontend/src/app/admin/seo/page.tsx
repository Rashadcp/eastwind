"use client";

import { useEffect, useState, useMemo } from "react";
import { formatImageUrl } from "@/utils/image";

export interface SeoPageSetting {
  id: string;
  pageKey: string;
  pageName: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  structuredDataJson?: string;
  createdAt?: string;
  updatedAt?: string;
}

const CORE_PAGE_KEYS = [
  "home",
  "about",
  "products",
  "solutions",
  "applications",
  "services",
  "contact",
  "privacy-policy"
];

const ROBOT_OPTIONS = [
  { value: "index, follow", label: "Yes, show on Google (Recommended)" },
  { value: "noindex, follow", label: "No, hide from Google search" },
  { value: "index, nofollow", label: "Show on Google, but don't follow links" },
  { value: "noindex, nofollow", label: "Completely hide and ignore this page" }
];

export default function AdminSeoPage() {
  const [pages, setPages] = useState<SeoPageSetting[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("home");
  const [formData, setFormData] = useState<SeoPageSetting | null>(null);
  const [originalData, setOriginalData] = useState<SeoPageSetting | null>(null);

  const [activeTab, setActiveTab] = useState<"search" | "social" | "advanced">("search");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingOg, setUploadingOg] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Add Page Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newPageName, setNewPageName] = useState<string>("");
  const [newPagePath, setNewPagePath] = useState<string>("");
  const [newPageTitle, setNewPageTitle] = useState<string>("");
  const [newPageDescription, setNewPageDescription] = useState<string>("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [creatingPage, setCreatingPage] = useState<boolean>(false);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // JSON-LD validation state
  const [jsonLdError, setJsonLdError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchSeoSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${baseUrl}/api/seo`);
      if (!res.ok) {
        throw new Error("Could not load page settings from server");
      }
      const data: SeoPageSetting[] = await res.json();
      setPages(data);

      const current = data.find((p) => p.pageKey === selectedKey) || data[0];
      if (current) {
        setSelectedKey(current.pageKey);
        setFormData({ ...current });
        setOriginalData({ ...current });
      }
    } catch (err: any) {
      console.error("Error loading page settings:", err);
      setError(err.message || "Failed to load page settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const handleSelectPage = (pageKey: string) => {
    if (hasUnsavedChanges) {
      const confirmSwitch = window.confirm(
        "You have unsaved changes. Switching pages will discard them. Do you want to continue?"
      );
      if (!confirmSwitch) return;
    }

    const page = pages.find((p) => p.pageKey === pageKey);
    if (page) {
      setSelectedKey(page.pageKey);
      setFormData({ ...page });
      setOriginalData({ ...page });
      setError(null);
      setSuccess(null);
      setJsonLdError(null);
    }
  };

  const hasUnsavedChanges = useMemo(() => {
    if (!formData || !originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const handleInputChange = (field: keyof SeoPageSetting, value: string) => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));

    if (field === "structuredDataJson") {
      if (!value.trim()) {
        setJsonLdError(null);
      } else {
        try {
          JSON.parse(value);
          setJsonLdError(null);
        } catch (e: any) {
          setJsonLdError("Invalid code format");
        }
      }
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    if (jsonLdError) {
      setError("Please fix the code error in Advanced Settings before saving.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${baseUrl}/api/seo/${formData.pageKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save changes");
      }

      const updated = await res.json();
      setPages((prev) =>
        prev.map((p) => (p.pageKey === updated.pageKey ? updated : p))
      );
      setFormData({ ...updated });
      setOriginalData({ ...updated });
      setSuccess(`Changes for "${updated.pageName}" saved successfully!`);
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) {
      setModalError("Please enter a page name");
      return;
    }

    const cleanPath = newPagePath.trim().startsWith("/")
      ? newPagePath.trim()
      : `/${newPagePath.trim()}`;

    const generatedKey = newPageName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    try {
      setCreatingPage(true);
      setModalError(null);

      const token = localStorage.getItem("admin_token");
      const payload = {
        pageName: newPageName.trim(),
        pageKey: generatedKey,
        path: cleanPath || `/${generatedKey}`,
        title:
          newPageTitle.trim() ||
          `${newPageName.trim()} | Eastwind Safety Arabia`,
        description:
          newPageDescription.trim() ||
          `${newPageName.trim()} - Industrial safety solutions and services in Saudi Arabia.`,
        keywords: `${newPageName.toLowerCase()}, safety, Saudi Arabia`,
        canonicalUrl: `https://eastwindsafety.com${cleanPath || `/${generatedKey}`}`,
        ogTitle:
          newPageTitle.trim() ||
          `${newPageName.trim()} | Eastwind Safety Arabia`,
        ogDescription:
          newPageDescription.trim() ||
          `${newPageName.trim()} - Industrial safety solutions and services in Saudi Arabia.`,
        ogImage: "/logo.png",
        robots: "index, follow"
      };

      const res = await fetch(`${baseUrl}/api/seo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create new page");
      }

      const created = await res.json();
      setPages((prev) => [...prev, created]);
      setSelectedKey(created.pageKey);
      setFormData({ ...created });
      setOriginalData({ ...created });
      setShowAddModal(false);
      setNewPageName("");
      setNewPagePath("");
      setNewPageTitle("");
      setNewPageDescription("");
      setSuccess(`Page "${created.pageName}" added successfully!`);
    } catch (err: any) {
      console.error("Create page error:", err);
      setModalError(err.message || "Failed to create page");
    } finally {
      setCreatingPage(false);
    }
  };

  const handleDeletePage = async () => {
    if (!formData) return;
    try {
      setDeleting(true);
      setError(null);

      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${baseUrl}/api/seo/${formData.pageKey}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete page");
      }

      const updatedPages = pages.filter((p) => p.pageKey !== formData.pageKey);
      setPages(updatedPages);
      const fallback = updatedPages[0];
      if (fallback) {
        setSelectedKey(fallback.pageKey);
        setFormData({ ...fallback });
        setOriginalData({ ...fallback });
      }
      setShowDeleteModal(false);
      setSuccess(`Page "${formData.pageName}" deleted successfully.`);
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete page");
    } finally {
      setDeleting(false);
    }
  };

  const handleUploadOgImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    try {
      setUploadingOg(true);
      setError(null);

      const token = localStorage.getItem("admin_token");
      const bodyFormData = new FormData();
      bodyFormData.append("file", file);
      bodyFormData.append("image", file);

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: bodyFormData
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl =
          data.imageUrl ||
          data.url ||
          (data.filename ? `/uploads/${data.filename}` : "");
        if (uploadedUrl) {
          handleInputChange("ogImage", uploadedUrl);
          setSuccess(`Photo "${file.name}" uploaded successfully!`);
          return;
        }
      }

      throw new Error("Failed to upload image file");
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Image upload failed");
    } finally {
      setUploadingOg(false);
    }
  };

  const filteredPages = pages.filter(
    (p) =>
      p.pageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pageKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCorePage = formData ? CORE_PAGE_KEYS.includes(formData.pageKey) : false;

  const titleLength = formData?.title?.length || 0;
  const descLength = formData?.description?.length || 0;

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#1e3e8f] border-t-transparent animate-spin mx-auto rounded-full" />
        <p className="text-xs text-slate-500 font-medium">Loading page settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 font-sans text-slate-800">
      {/* Scoped CSS for 100% Guaranteed High Contrast & Legibility */}
      <style dangerouslySetInnerHTML={{ __html: `
        .seo-list-row {
          background-color: #ffffff !important;
          color: #1e293b !important;
          border-left: 3px solid transparent !important;
          transition: background-color 0.15s ease, border-color 0.15s ease !important;
        }
        .seo-list-row:hover {
          background-color: #f8fafc !important;
        }
        .seo-list-row.is-active {
          background-color: #f1f5f9 !important;
          border-left: 3px solid #1e3e8f !important;
        }
        .seo-list-row .page-title {
          color: #0f172a !important;
          font-weight: 700 !important;
        }
        .seo-list-row.is-active .page-title {
          color: #1e3e8f !important;
        }
        .seo-list-row .page-path {
          color: #64748b !important;
        }
        .seo-chip-core {
          background-color: #e2e8f0 !important;
          color: #334155 !important;
          border: 1px solid #cbd5e1 !important;
        }
        .seo-chip-custom {
          background-color: #e0e7ff !important;
          color: #1e3e8f !important;
          border: 1px solid #c7d2fe !important;
        }
        .seo-chip-indexed {
          background-color: #dcfce7 !important;
          color: #15803d !important;
          border: 1px solid #bbf7d0 !important;
        }
        .seo-chip-noindex {
          background-color: #fee2e2 !important;
          color: #b91c1c !important;
          border: 1px solid #fecaca !important;
        }
      ` }} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-50 text-[#1e3e8f] border border-blue-200 text-[10px] font-bold rounded-xs uppercase tracking-wider">
              Website Settings
            </span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-600">Google & Social Media</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">
            Google Search & Social Media Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 m-0">
            Control how your pages look when people find them on Google or share links on WhatsApp and social media.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setModalError(null);
              setShowAddModal(true);
            }}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-3.5 h-3.5 text-[#1e3e8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span> Add New Page</span>
          </button>

          <button
            type="button"
            disabled={saving || !hasUnsavedChanges}
            onClick={handleSave}
            className="px-4 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xs text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 text-rose-500 hover:text-rose-800 rounded-xs cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xs text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="p-1 text-emerald-500 hover:text-emerald-800 rounded-xs cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 2-Column Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Pages List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xs overflow-hidden shadow-xs">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Your Pages ({pages.length})
            </span>
            <button
              type="button"
              onClick={() => {
                setModalError(null);
                setShowAddModal(true);
              }}
              className="text-[11px] text-[#1e3e8f] hover:underline font-bold cursor-pointer"
            >
              + New
            </button>
          </div>

          {/* Search Box */}
          <div className="p-2.5 border-b border-slate-100 bg-white">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search page..."
                className="w-full text-xs pl-7 pr-2.5 py-1.5 border border-slate-200 rounded-xs bg-white text-slate-800 placeholder-slate-400 focus:border-[#1e3e8f] focus:outline-none"
              />
              <svg
                className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Clean List Items */}
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredPages.map((page) => {
              const isSelected = page.pageKey === selectedKey;
              const isCore = CORE_PAGE_KEYS.includes(page.pageKey);
              const isNoIndex = page.robots?.includes("noindex");

              return (
                <div
                  key={page.pageKey}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectPage(page.pageKey)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSelectPage(page.pageKey);
                    }
                  }}
                  className={`seo-list-row p-3 cursor-pointer flex items-center justify-between gap-2 select-none ${
                    isSelected ? "is-active" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="page-title text-xs truncate">
                        {page.pageName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-tight shrink-0 ${
                          isCore ? "seo-chip-core" : "seo-chip-custom"
                        }`}
                      >
                        {isCore ? "Main Page" : "Custom"}
                      </span>
                    </div>
                    <div className="page-path text-[11px] font-mono truncate mt-0.5">
                      {page.path}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-xs shrink-0 ${
                      isNoIndex ? "seo-chip-noindex" : "seo-chip-indexed"
                    }`}
                  >
                    {isNoIndex ? "Hidden" : "Shows on Google"}
                  </span>
                </div>
              );
            })}

            {filteredPages.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400">
                No pages found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Editor (8 cols) */}
        {formData ? (
          <div className="lg:col-span-8 space-y-4">
            
            {/* Header of Selected Page & Tabs */}
            <div className="bg-white border border-slate-200 rounded-xs p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight m-0">
                    {formData.pageName}
                  </h2>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
                    {formData.path}
                  </span>
                  {isCorePage ? (
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-xs">
                      Default Website Page
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#1e3e8f] bg-blue-50 px-1.5 py-0.5 rounded-xs border border-blue-200">
                      Custom Page
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={formData.path}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#1e3e8f] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open Live Page ↗</span>
                  </a>
                  {!isCorePage && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="text-xs text-rose-600 hover:text-rose-800 hover:underline font-semibold cursor-pointer"
                    >
                      Delete This Page
                    </button>
                  )}
                </div>
              </div>

              {/* Simple Navigation Tabs */}
              <div className="flex gap-1 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("search")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xs cursor-pointer transition-colors ${
                    activeTab === "search"
                      ? "bg-[#1e3e8f] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  1. Google Search
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("social")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xs cursor-pointer transition-colors ${
                    activeTab === "social"
                      ? "bg-[#1e3e8f] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  2. WhatsApp & Social Media
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("advanced")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xs cursor-pointer transition-colors ${
                    activeTab === "advanced"
                      ? "bg-[#1e3e8f] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  3. Advanced Settings
                </button>
              </div>
            </div>

            {/* TAB 1: Google Search */}
            {activeTab === "search" && (
              <div className="space-y-4">
                {/* Google Result Preview */}
                <div className="bg-white border border-slate-200 rounded-xs p-4 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    How this page looks on Google search:
                  </div>
                  
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xs">
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-600 mb-0.5 truncate">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-700">
                        E
                      </div>
                      <span className="text-slate-800 font-medium">Eastwind Energy Arabia</span>
                      <span>›</span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {formData.path === "/" ? "home" : formData.path.replace(/^\//, "")}
                      </span>
                    </div>

                    <div className="text-[16px] text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug line-clamp-1">
                      {formData.title || "Page Title | Eastwind Safety Arabia"}
                    </div>

                    <div className="text-[12px] text-[#4d5156] leading-relaxed mt-1 line-clamp-2">
                      {formData.description ||
                        "Enter a page description below to see how it will appear in Google search results."}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="bg-white border border-slate-200 rounded-xs p-5 shadow-xs space-y-4">
                  
                  {/* Title */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Page Title (shows on Google) <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">
                          {titleLength} / 60 characters
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
                            titleLength >= 45 && titleLength <= 65
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : titleLength === 0
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {titleLength >= 45 && titleLength <= 65
                            ? "Good length"
                            : titleLength === 0
                            ? "Needs text"
                            : titleLength < 45
                            ? "A bit short"
                            : "Too long (may be cut off)"}
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g. Industrial Safety Products | Eastwind Safety Arabia"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Page Description (shows below the title on Google)
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">
                          {descLength} / 160 characters
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
                            descLength >= 120 && descLength <= 160
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : descLength === 0
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {descLength >= 120 && descLength <= 160
                            ? "Good length"
                            : descLength === 0
                            ? "Needs text"
                            : descLength < 120
                            ? "A bit short"
                            : "Too long (may be cut off)"}
                        </span>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Write 1 or 2 sentences describing what this page offers. This helps people choose your link on Google."
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Keywords & Canonical Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Search Keywords (separated by commas)
                      </label>
                      <input
                        type="text"
                        value={formData.keywords}
                        onChange={(e) => handleInputChange("keywords", e.target.value)}
                        placeholder="e.g. safety systems, gas detection, Saudi Arabia"
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Main Website Link (Canonical Link)
                      </label>
                      <input
                        type="url"
                        value={formData.canonicalUrl}
                        onChange={(e) => handleInputChange("canonicalUrl", e.target.value)}
                        placeholder="https://eastwindsafety.com/..."
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 font-mono focus:border-[#1e3e8f] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Edit name & path for custom page */}
                  {!isCorePage && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Page Name
                        </label>
                        <input
                          type="text"
                          value={formData.pageName}
                          onChange={(e) => handleInputChange("pageName", e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Page Link (Path)
                        </label>
                        <input
                          type="text"
                          value={formData.path}
                          onChange={(e) => handleInputChange("path", e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 font-mono focus:border-[#1e3e8f] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Social Media & WhatsApp */}
            {activeTab === "social" && (
              <div className="space-y-4">
                {/* Social Card Preview */}
                <div className="bg-white border border-slate-200 rounded-xs p-4 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    How this link looks when shared on WhatsApp, LinkedIn, or Facebook:
                  </div>
                  <div className="max-w-md bg-white border border-slate-200 rounded-xs overflow-hidden shadow-xs">
                    <div className="h-36 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      {formData.ogImage ? (
                        <img
                          src={formatImageUrl(formData.ogImage)}
                          alt="Preview Photo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/logo.png";
                          }}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">No Photo Selected</span>
                      )}
                    </div>
                    <div className="p-3">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        eastwindsafety.com
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5 m-0">
                        {formData.ogTitle || formData.title || "Page Title"}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 m-0">
                        {formData.ogDescription || formData.description || "Page description..."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Form Fields */}
                <div className="bg-white border border-slate-200 rounded-xs p-5 shadow-xs space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Social Media Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.ogTitle}
                      onChange={(e) => handleInputChange("ogTitle", e.target.value)}
                      placeholder="Leave empty to use the same title as Google search"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      If left empty, WhatsApp and social media will use your Google page title.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Social Media Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.ogDescription}
                      onChange={(e) => handleInputChange("ogDescription", e.target.value)}
                      placeholder="Leave empty to use the same description as Google search"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Picture to show when link is shared
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={formData.ogImage}
                        onChange={(e) => handleInputChange("ogImage", e.target.value)}
                        placeholder="/logo.png or https://example.com/photo.jpg"
                        className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 font-mono focus:border-[#1e3e8f] focus:outline-none"
                      />
                      <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xs cursor-pointer shrink-0 transition-colors">
                        <span>{uploadingOg ? "Uploading..." : "Upload Photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadOgImage}
                          disabled={uploadingOg}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Recommended photo size: 1200 x 630 pixels.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Advanced Settings */}
            {activeTab === "advanced" && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xs p-5 shadow-xs space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Show this page on Google search?
                    </label>
                    <select
                      value={formData.robots}
                      onChange={(e) => handleInputChange("robots", e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                    >
                      {ROBOT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Choose whether search engines like Google are allowed to show this page in public search results.
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Extra Code for Search Engines (Optional JSON-LD)
                      </label>
                      {jsonLdError ? (
                        <span className="text-[11px] text-rose-600 font-bold">
                          ⚠️ {jsonLdError}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Optional schema.org code
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={5}
                      value={formData.structuredDataJson || ""}
                      onChange={(e) => handleInputChange("structuredDataJson", e.target.value)}
                      placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "${formData.pageName}"\n}`}
                      className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-xs bg-slate-50 text-slate-800 focus:border-[#1e3e8f] focus:outline-none resize-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      This is only for technical developers. You can safely leave this blank.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xs p-3.5 shadow-xs">
              <div>
                {hasUnsavedChanges ? (
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xs inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    You have unsaved changes
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    All changes are saved.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={!hasUnsavedChanges || saving}
                  onClick={() => {
                    if (originalData) {
                      setFormData({ ...originalData });
                      setJsonLdError(null);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancel Changes
                </button>

                <button
                  type="button"
                  disabled={saving || !hasUnsavedChanges}
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xs p-12 text-center text-slate-400">
            Please select a page from the list on the left to edit its settings.
          </div>
        )}
      </div>

      {/* Add New Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xs shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1e3e8f]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight m-0">
                  Add a New Page
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors shadow-2xs"
                title="Close"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddPage} className="p-5 space-y-4">
              {modalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Page Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPageName}
                  onChange={(e) => {
                    setNewPageName(e.target.value);
                    if (!newPagePath) {
                      const slug = e.target.value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9-]+/g, "-");
                      setNewPagePath(`/${slug}`);
                    }
                  }}
                  placeholder="e.g. Careers, Certifications, Quality"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Page Link (URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPagePath}
                  onChange={(e) => setNewPagePath(e.target.value)}
                  placeholder="e.g. /careers or /certifications"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 font-mono focus:border-[#1e3e8f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title for Google Search
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="e.g. Careers & Job Openings | Eastwind Safety"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description for Google
                </label>
                <textarea
                  rows={3}
                  value={newPageDescription}
                  onChange={(e) => setNewPageDescription(e.target.value)}
                  placeholder="Write a brief sentence describing what this page is about..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPage}
                  className="px-4 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {creatingPage ? "Creating..." : "Create Page"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && formData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xs shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 bg-rose-50 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <h3 className="text-sm font-bold text-rose-900 tracking-tight m-0">
                Delete this page?
              </h3>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-700 m-0">
                Are you sure you want to delete the settings for{" "}
                <strong className="text-slate-900">"{formData.pageName}"</strong> ({formData.path})?
              </p>
              <p className="text-xs text-slate-500 m-0">
                This will remove this page from your Google & Social Media settings list.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeletePage}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, Delete Page"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
