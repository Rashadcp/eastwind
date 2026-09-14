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
  { value: "index, follow", label: "Index, Follow (Recommended for public pages)" },
  { value: "noindex, follow", label: "Noindex, Follow (Hide from search, follow links)" },
  { value: "index, nofollow", label: "Index, Nofollow (Show in search, ignore links)" },
  { value: "noindex, nofollow", label: "Noindex, Nofollow (Completely hidden & ignored)" }
];

export default function AdminSeoPage() {
  const [pages, setPages] = useState<SeoPageSetting[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("home");
  const [formData, setFormData] = useState<SeoPageSetting | null>(null);
  const [originalData, setOriginalData] = useState<SeoPageSetting | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingOg, setUploadingOg] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Add New Page Modal State
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
        throw new Error("Failed to load SEO configuration from server");
      }
      const data: SeoPageSetting[] = await res.json();
      setPages(data);

      // Select initial page
      const current = data.find((p) => p.pageKey === selectedKey) || data[0];
      if (current) {
        setSelectedKey(current.pageKey);
        setFormData({ ...current });
        setOriginalData({ ...current });
      }
    } catch (err: any) {
      console.error("Error fetching SEO settings:", err);
      setError(err.message || "Failed to fetch SEO settings");
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
        "You have unsaved changes on the current page. Switching pages will discard them. Do you want to proceed?"
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
          setJsonLdError("Invalid JSON format");
        }
      }
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    if (jsonLdError) {
      setError("Please fix the Structured Data JSON error before saving.");
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
        throw new Error(data.error || "Failed to save SEO changes");
      }

      const updated = await res.json();
      setPages((prev) =>
        prev.map((p) => (p.pageKey === updated.pageKey ? updated : p))
      );
      setFormData({ ...updated });
      setOriginalData({ ...updated });
      setSuccess(`SEO settings for "${updated.pageName}" saved successfully!`);
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) {
      setModalError("Page name is required");
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
          `${newPageName.trim()} - Industrial safety solutions and engineering infrastructure in Saudi Arabia.`,
        keywords: `${newPageName.toLowerCase()}, industrial safety, Saudi Arabia`,
        canonicalUrl: `https://eastwindsafety.com${cleanPath || `/${generatedKey}`}`,
        ogTitle:
          newPageTitle.trim() ||
          `${newPageName.trim()} | Eastwind Safety Arabia`,
        ogDescription:
          newPageDescription.trim() ||
          `${newPageName.trim()} - Industrial safety solutions and engineering infrastructure in Saudi Arabia.`,
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
        throw new Error(data.error || "Failed to create new page SEO");
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
      setSuccess(`Custom page "${created.pageName}" added successfully!`);
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
        throw new Error(data.error || "Failed to delete page SEO");
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
          setSuccess(`OG Image "${file.name}" uploaded successfully!`);
          return;
        }
      }

      throw new Error("Failed to upload image file to server");
    } catch (err: any) {
      console.error("OG upload error:", err);
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

  // Title & Description length indicators
  const titleLength = formData?.title?.length || 0;
  const descLength = formData?.description?.length || 0;

  const getTitleBadge = (len: number) => {
    if (len === 0) return { label: "Empty", color: "text-rose-600 bg-rose-50 border-rose-200" };
    if (len >= 45 && len <= 65) return { label: "Optimal (45-65)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (len < 45) return { label: "A bit short (<45)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "May truncate (>65)", color: "text-rose-600 bg-rose-50 border-rose-200" };
  };

  const getDescBadge = (len: number) => {
    if (len === 0) return { label: "Empty", color: "text-rose-600 bg-rose-50 border-rose-200" };
    if (len >= 120 && len <= 160) return { label: "Optimal (120-160)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (len < 120) return { label: "A bit short (<120)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "May truncate (>160)", color: "text-rose-600 bg-rose-50 border-rose-200" };
  };

  const titleBadge = getTitleBadge(titleLength);
  const descBadge = getDescBadge(descLength);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#1e3e8f] border-t-transparent animate-spin mx-auto rounded-full" />
        <p className="text-xs text-slate-500 font-medium">
          Loading Meta SEO Settings & Configured Pages...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 font-sans text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-50 text-[#1e3e8f] border border-blue-200 text-[10px] font-bold rounded-xs uppercase tracking-wider">
              Search Engine Optimization
            </span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-600">
              Meta Tags & OpenGraph
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">
            Meta SEO & Page Customization
          </h1>
          <p className="text-xs text-slate-500 mt-1 m-0">
            Customize search snippets, titles, social cards, canonical URLs, and add custom page metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setModalError(null);
              setShowAddModal(true);
            }}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-4 h-4 text-[#1e3e8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add New Page</span>
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
            <span>{saving ? "Saving Changes..." : "Save Page SEO"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xs text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 text-rose-500 hover:text-rose-800 rounded-xs hover:bg-rose-100 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xs text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="p-1 text-emerald-500 hover:text-emerald-800 rounded-xs hover:bg-emerald-100 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pages List (3 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xs overflow-hidden shadow-xs">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider m-0">
                Site Pages ({pages.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalError(null);
                setShowAddModal(true);
              }}
              className="text-[11px] text-[#1e3e8f] hover:underline font-bold cursor-pointer"
            >
              + New Page
            </button>
          </div>

          {/* Search Box */}
          <div className="p-2.5 border-b border-slate-100">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search page or path..."
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

          {/* List of Pages */}
          <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
            {filteredPages.map((page) => {
              const isSelected = page.pageKey === selectedKey;
              const isCore = CORE_PAGE_KEYS.includes(page.pageKey);
              return (
                <button
                  key={page.pageKey}
                  type="button"
                  onClick={() => handleSelectPage(page.pageKey)}
                  className={`w-full text-left p-3 transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-blue-50/70 border-l-4 border-l-[#1e3e8f]"
                      : "hover:bg-slate-50 border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold truncate ${isSelected ? "text-[#1e3e8f]" : "text-slate-800"}`}>
                        {page.pageName}
                      </span>
                      {isCore ? (
                        <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-xs border border-slate-200 font-medium">
                          Core
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-50 text-amber-700 rounded-xs border border-amber-200 font-bold">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                      {page.path}
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-xs font-semibold ${
                        page.robots?.includes("noindex")
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {page.robots?.includes("noindex") ? "Noindex" : "Indexed"}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredPages.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400">
                No matching pages found for "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Editor & Live Previews (8 cols) */}
        {formData ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Page Title & Live SERP Card */}
            <div className="bg-white border border-slate-200 rounded-xs p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1e3e8f]" />
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight m-0">
                    Google Search Engine Snippet Preview
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={formData.path}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#1e3e8f] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>View Public URL</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  {!isCorePage && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="text-[11px] text-rose-600 hover:text-rose-800 hover:underline font-bold cursor-pointer ml-2"
                    >
                      Delete Page
                    </button>
                  )}
                </div>
              </div>

              {/* SERP Preview Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs font-sans">
                <div className="flex items-center gap-2 mb-1 text-[12px] text-[#202124] leading-tight">
                  <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-700">
                    E
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-slate-600 truncate">
                    <span className="text-[#202124] font-medium">Eastwind Energy Arabia</span>
                    <span>›</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {formData.path === "/" ? "home" : formData.path.replace(/^\//, "")}
                    </span>
                  </div>
                </div>

                <div className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer leading-snug font-medium line-clamp-1">
                  {formData.title || "Page Title goes here | Eastwind Safety Arabia"}
                </div>

                <div className="text-[13px] text-[#4d5156] leading-relaxed mt-1 line-clamp-2">
                  {formData.description ||
                    "Enter a meta description to see how this page will be displayed in Google search results across desktop and mobile devices."}
                </div>
              </div>

              {/* Character Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">Title Length: </span>
                    <span className="font-mono text-slate-900 font-bold">{titleLength}</span>
                    <span className="text-slate-400"> chars</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-xs border font-semibold ${titleBadge.color}`}>
                    {titleBadge.label}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">Description Length: </span>
                    <span className="font-mono text-slate-900 font-bold">{descLength}</span>
                    <span className="text-slate-400"> chars</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-xs border font-semibold ${descBadge.color}`}>
                    {descBadge.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Core Meta Fields Form */}
            <div className="bg-white border border-slate-200 rounded-xs p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0 border-b border-slate-100 pb-2">
                Core Search Engine Meta Fields
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Page Name
                  </label>
                  <input
                    type="text"
                    value={formData.pageName}
                    disabled={isCorePage}
                    onChange={(e) => handleInputChange("pageName", e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 disabled:bg-slate-100 disabled:text-slate-500 focus:border-[#1e3e8f] focus:outline-none"
                  />
                  {isCorePage && (
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Core page key identifier is locked for routing safety.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Path
                  </label>
                  <input
                    type="text"
                    value={formData.path}
                    disabled={isCorePage}
                    onChange={(e) => handleInputChange("path", e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 disabled:bg-slate-100 disabled:text-slate-500 font-mono focus:border-[#1e3e8f] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Meta Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Recommended: 50 – 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Primary Keyword | Brand Name"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Meta Description
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Recommended: 120 – 160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Compelling summary of the page including target keywords and clear call to action..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meta Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange("keywords", e.target.value)}
                    placeholder="safety systems, ATEX, gas detector, KSA"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    value={formData.canonicalUrl}
                    onChange={(e) => handleInputChange("canonicalUrl", e.target.value)}
                    placeholder="https://eastwindsafety.com/page"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 font-mono focus:border-[#1e3e8f] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Sharing / OpenGraph Preview & Configuration */}
            <div className="bg-white border border-slate-200 rounded-xs p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0 border-b border-slate-100 pb-2">
                Social Sharing & OpenGraph (OG) Protocol
              </h2>

              {/* Social Card Preview */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Social Card Preview (LinkedIn, Twitter / X, WhatsApp, Facebook)
                </span>
                <div className="max-w-md bg-white border border-slate-200 rounded-xs overflow-hidden shadow-xs">
                  <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {formData.ogImage ? (
                      <img
                        src={formatImageUrl(formData.ogImage)}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/logo.png";
                        }}
                      />
                    ) : (
                      <span className="text-xs text-slate-400">No OG image selected</span>
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
                      {formData.ogDescription || formData.description || "Social description"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    OG Title (optional, defaults to Meta Title)
                  </label>
                  <input
                    type="text"
                    value={formData.ogTitle}
                    onChange={(e) => handleInputChange("ogTitle", e.target.value)}
                    placeholder="Custom social media title..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    OG Description (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.ogDescription}
                    onChange={(e) => handleInputChange("ogDescription", e.target.value)}
                    placeholder="Custom social media preview description..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  OG Image URL / Upload
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formData.ogImage}
                    onChange={(e) => handleInputChange("ogImage", e.target.value)}
                    placeholder="/logo.png or https://example.com/image.jpg"
                    className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 font-mono focus:border-[#1e3e8f] focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xs cursor-pointer shrink-0 transition-colors">
                    <span>{uploadingOg ? "Uploading..." : "Upload Image"}</span>
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
                  Recommended aspect ratio: 1200x630 px (1.91:1) for crisp sharing previews.
                </span>
              </div>
            </div>

            {/* Robots & Advanced Directives */}
            <div className="bg-white border border-slate-200 rounded-xs p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider m-0 border-b border-slate-100 pb-2">
                Robots Directives & Indexing Control
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Robots Meta Tag Directive
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
                  Controls whether search engine bots index this specific page in web search results and crawl hyperlinks on it.
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Custom Structured Data (JSON-LD)
                  </label>
                  {jsonLdError ? (
                    <span className="text-[11px] text-rose-600 font-bold">
                      ⚠️ {jsonLdError}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Optional schema.org JSON block
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={formData.structuredDataJson || ""}
                  onChange={(e) => handleInputChange("structuredDataJson", e.target.value)}
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "${formData.pageName}"\n}`}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-xs bg-slate-50 text-slate-800 focus:border-[#1e3e8f] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xs p-4 shadow-xs">
              <div className="flex items-center gap-2">
                {hasUnsavedChanges ? (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xs inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Unsaved changes on this page
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-500">
                    All SEO parameters are synchronized.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!hasUnsavedChanges || saving}
                  onClick={() => {
                    if (originalData) {
                      setFormData({ ...originalData });
                      setJsonLdError(null);
                    }
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Reset Changes
                </button>

                <button
                  type="button"
                  disabled={saving || !hasUnsavedChanges}
                  onClick={handleSave}
                  className="px-5 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{saving ? "Saving Changes..." : "Save Page SEO"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xs p-12 text-center text-slate-400">
            Select a page from the list to customize its meta and SEO tags.
          </div>
        )}
      </div>

      {/* Add New Custom Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xs shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1e3e8f]" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight m-0">
                  Add New Custom Page for Meta SEO
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                  placeholder="e.g. Careers, Technical Whitepapers, Quality Standards"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Page Path / URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPagePath}
                  onChange={(e) => setNewPagePath(e.target.value)}
                  placeholder="e.g. /careers or /whitepapers"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 font-mono focus:border-[#1e3e8f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Meta Title
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="e.g. Careers & Job Openings | Eastwind Safety Arabia"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-800 focus:border-[#1e3e8f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Meta Description
                </label>
                <textarea
                  rows={3}
                  value={newPageDescription}
                  onChange={(e) => setNewPageDescription(e.target.value)}
                  placeholder="Brief summary for search engine snippet..."
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
                  {creatingPage ? "Creating Page..." : "Create Page SEO"}
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
                Delete Custom Page SEO
              </h3>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-700 m-0">
                Are you sure you want to delete the SEO configuration for{" "}
                <strong className="text-slate-900">"{formData.pageName}"</strong> ({formData.path})?
              </p>
              <p className="text-xs text-slate-500 m-0">
                This action cannot be undone. Custom meta tags for this route will be permanently removed.
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
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
