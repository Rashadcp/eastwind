"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

export interface BrandProductItem {
  id: string;
  name: string;
  category: string;
  solutionName: string;
  imageUrl: string;
  description?: string;
}

export interface BrandItem {
  id: string;
  name: string;
  tagline: string;
  solutionId: string;
  solutionName: string;
  description: string;
  logoUrl?: string;
  accent: string;
  products: BrandProductItem[];
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<BrandItem | null>(null);

  // Form states
  const [formId, setFormId] = useState<string>("");
  const [formName, setFormName] = useState<string>("");
  const [formTagline, setFormTagline] = useState<string>("");
  const [formSolutionName, setFormSolutionName] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formLogoUrl, setFormLogoUrl] = useState<string>("");
  const [formAccent, setFormAccent] = useState<string>("orange");

  // Form Products array & editing state
  // Brand Products selector state
  const [formProducts, setFormProducts] = useState<BrandProductItem[]>([]);
  const [allMasterProducts, setAllMasterProducts] = useState<BrandProductItem[]>([]);
  const [selectedMasterProdId, setSelectedMasterProdId] = useState<string>("");

  // Upload state
  const [uploading, setUploading] = useState<boolean>(false);

  // Load brands and master inventory products
  const fetchBrands = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/brands`);
      if (res.ok) {
        const list = await res.json();
        setBrands(list);
      }

      const pRes = await fetch(`${baseUrl}/api/products`);
      if (pRes.ok) {
        const pList = await pRes.json();
        setAllMasterProducts(pList.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category || "General Safety",
          solutionName: p.solutionName || p.category || "Industrial Solution",
          imageUrl: p.imageUrl || "/products/default-process-instrumentation.png",
          description: p.description || ""
        })));
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to retrieve brands portfolio from active database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Open modal for Creation
  const handleOpenCreate = () => {
    clearMessages();
    setIsEdit(false);
    setFormId("");
    setFormName("");
    setFormTagline("");
    setFormSolutionName("Vehicle Fire Fighting");
    setFormDescription("");
    setFormLogoUrl("");
    setFormAccent("orange");
    setFormProducts([]);
    setSelectedMasterProdId("");
    setShowModal(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (item: BrandItem) => {
    clearMessages();
    setIsEdit(true);
    setFormId(item.id);
    setFormName(item.name);
    setFormTagline(item.tagline || "");
    setFormSolutionName(item.solutionName || "");
    setFormDescription(item.description || "");
    setFormLogoUrl(item.logoUrl || "");
    setFormAccent(item.accent || "orange");
    setFormProducts(item.products || []);
    setSelectedMasterProdId("");
    setShowModal(true);
  };

  // Image Upload helper for Brand Logo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    clearMessages();

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
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
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
          const compressedDataUrl = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.82);
          setFormLogoUrl(compressedDataUrl);
          setSuccess(`Brand logo '${file.name}' attached and ready!`);
        } else {
          setFormLogoUrl(rawUrl);
        }
        setUploading(false);
      };
      img.onerror = () => {
        setFormLogoUrl(rawUrl);
        setUploading(false);
      };
      img.src = rawUrl;
    };
    reader.onerror = () => {
      setError("Failed to process image file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Attach Product from Master Inventory to Brand
  const handleAttachMasterProduct = () => {
    if (!selectedMasterProdId) return;
    const match = allMasterProducts.find((p) => p.id === selectedMasterProdId);
    if (!match) return;

    if (formProducts.some((p) => p.id === match.id || p.name === match.name)) {
      setError(`Product '${match.name}' is already attached to this brand.`);
      return;
    }

    setFormProducts([...formProducts, match]);
    setSuccess(`Attached product '${match.name}' to brand.`);
    setSelectedMasterProdId("");
  };

  const handleRemoveProduct = (idx: number) => {
    setFormProducts(formProducts.filter((_, i) => i !== idx));
  };

  // Save Brand (Submit)
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!formName) {
      setError("Brand Name is required.");
      return;
    }

    const payload: Partial<BrandItem> = {
      id: isEdit ? formId : formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: formName,
      tagline: formTagline,
      solutionId: formSolutionName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      solutionName: formSolutionName,
      description: formDescription,
      logoUrl: formLogoUrl,
      accent: formAccent,
      products: formProducts,
    };

    try {
      const token = localStorage.getItem("admin_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const url = isEdit ? `${baseUrl}/api/brands/${formId}` : `${baseUrl}/api/brands`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save brand record.");

      setSuccess(`Brand "${formName}" ${isEdit ? "updated" : "created"} successfully!`);
      setShowModal(false);
      fetchBrands();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  };

  // Delete Brand
  const handleDeleteBrand = async (id: string) => {
    clearMessages();
    try {
      const token = localStorage.getItem("admin_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/brands/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete brand");

      setSuccess("Brand removed successfully!");
      setDeleteTarget(null);
      fetchBrands();
    } catch (err: any) {
      setError(err.message || "Failed to delete brand");
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.solutionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              CMS Module
            </span>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Brand Portfolio Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage public Eastwind Portfolio brands, brand descriptions, and sliding product arrays.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Brand
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex justify-between items-center shadow-sm">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">✕</button>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs flex justify-between items-center shadow-sm">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Search Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search brands by name or solution area..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
        <span className="text-xs font-mono font-bold text-slate-500">
          Showing {filteredBrands.length} Brands
        </span>
      </div>

      {/* Brands Cards List Grid */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
          Loading Brands Portfolio...
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
          No brands found matching criteria. Click "Add New Brand" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div key={brand.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                    {brand.solutionName || "General Solution"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">ID: {brand.id}</span>
                </div>

                {/* Brand Logo / Asset Image Display Box */}
                <div className="h-28 w-full bg-slate-900 rounded-xl mb-3 flex items-center justify-center p-2 border border-slate-800 relative overflow-hidden">
                  {brand.logoUrl && brand.logoUrl.trim() !== "" ? (
                    <img
                      key={brand.logoUrl}
                      src={formatImageUrl(brand.logoUrl)}
                      alt={brand.name}
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
                    style={{ display: brand.logoUrl && brand.logoUrl.trim() !== "" ? "none" : "flex" }}
                    className="flex flex-col items-center justify-center text-center p-2 space-y-1 text-slate-500"
                  >
                    <span className="text-lg">📷</span>
                    <span className="text-[10px] font-mono font-medium text-slate-400">No Image Found</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{brand.name}</h3>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{brand.tagline}</p>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4">{brand.description}</p>
                
                {/* Products Count */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
                  <div className="text-[11px] font-bold text-slate-700 mb-1 flex justify-between">
                    <span>Associated Brand Products</span>
                    <span className="text-orange-600 font-mono">({brand.products?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(brand.products || []).slice(0, 3).map((p, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                        {p.name}
                      </span>
                    ))}
                    {(brand.products?.length || 0) > 3 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        +{(brand.products?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setViewItem(brand)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleOpenEdit(brand)}
                  className="flex-1 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold rounded-lg transition-colors border border-orange-200"
                >
                  Edit Brand
                </button>
                <button
                  onClick={() => setDeleteTarget(brand.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors border border-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Confirm Brand Removal</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete brand ID <strong>{deleteTarget}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBrand(deleteTarget)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {isEdit ? `Edit Brand (${formId})` : "Create New Brand Record"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-5">
              {/* Brand Main Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. One Seven"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="e.g. Compressed Air Foam Systems"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Solution Category</label>
                  <input
                    type="text"
                    value={formSolutionName}
                    onChange={(e) => setFormSolutionName(e.target.value)}
                    placeholder="e.g. Vehicle Fire Fighting"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand Accent Tone</label>
                  <select
                    value={formAccent}
                    onChange={(e) => setFormAccent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="orange">Orange (Tactical Response)</option>
                    <option value="blue">Blue (Wireless & Mobile)</option>
                    <option value="red">Red (Fire Suites & Cables)</option>
                    <option value="green">Green (Process Safety)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Overview of the brand's core engineering capabilities..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Brand Logo / Asset Upload with Live Image Preview Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Brand Logo / Asset Image</label>
                
                <div className="h-36 w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-800 relative">
                  {formLogoUrl && formLogoUrl.trim() !== "" ? (
                    <img
                      key={formLogoUrl}
                      src={formatImageUrl(formLogoUrl)}
                      alt="Brand Logo Preview"
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
                    style={{ display: formLogoUrl && formLogoUrl.trim() !== "" ? "none" : "flex" }}
                    className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-slate-500"
                  >
                    <span className="text-xl">📷</span>
                    <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    placeholder="Enter image URL or upload photo"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors border border-slate-300">
                    {uploading ? "Processing..." : "Browse..."}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>

              {/* BRAND PRODUCTS MANAGER */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Attached Brand Products ({formProducts.length})
                    </h4>
                    <span className="text-[10px] text-slate-500">Products assigned to this brand</span>
                  </div>
                </div>

                {/* Products List Table with Image Thumbnails & Remove Button Only */}
                {formProducts.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {formProducts.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 bg-white border border-slate-200 p-2.5 rounded-xl text-xs hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Image Thumbnail Box */}
                          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden flex items-center justify-center p-0.5 shrink-0 shadow-2xs">
                            {p.imageUrl && p.imageUrl.trim() !== "" ? (
                              <img
                                src={formatImageUrl(p.imageUrl)}
                                alt={p.name}
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                }}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-xs">📷</span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-extrabold text-slate-800 truncate leading-snug">{p.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">
                              <span className="font-semibold text-slate-600">Category:</span> {p.category}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(idx)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition-colors border border-rose-200 flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>🗑️</span> Remove from Brand
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-400 font-medium">
                    No products attached to this brand yet. Select a product below to attach.
                  </div>
                )}

                {/* Attach Product From Master Inventory */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                  <span className="text-xs font-extrabold text-slate-800 block">
                    ➕ Attach Product from Inventory
                  </span>

                  <div className="space-y-2.5">
                    <select
                      value={selectedMasterProdId}
                      onChange={(e) => setSelectedMasterProdId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white text-slate-800"
                    >
                      <option value="">-- Select Product from Inventory --</option>
                      {allMasterProducts.map((mp) => (
                        <option key={mp.id} value={mp.id}>
                          {mp.name} ({mp.category})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleAttachMasterProduct}
                      disabled={!selectedMasterProdId}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
                    >
                      + Attach Selected Product to Brand
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 italic m-0">
                    To create or edit product specifications, use <strong>Manage Products (`/admin/products`)</strong>.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  {isEdit ? "Update Brand Record" : "Save New Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Brand Details Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {viewItem.solutionName}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{viewItem.name}</h3>
                <p className="text-xs text-slate-500 font-semibold">{viewItem.tagline}</p>
              </div>
              <button onClick={() => setViewItem(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {viewItem.description}
            </p>

            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Registered Brand Products ({viewItem.products?.length || 0})</h4>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {(viewItem.products || []).map((p, idx) => (
                  <div key={idx} className="text-xs bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden flex items-center justify-center p-0.5 shrink-0">
                        {p.imageUrl && p.imageUrl.trim() !== "" ? (
                          <img
                            src={formatImageUrl(p.imageUrl)}
                            alt={p.name}
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px]">📷</span>
                        )}
                      </div>
                      <span className="font-bold text-slate-800 truncate">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{p.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setViewItem(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
