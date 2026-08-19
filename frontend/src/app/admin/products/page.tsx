"use client";

import { useEffect, useState } from "react";
import { PRODUCT_BRANDS, PRODUCT_CATEGORIES, ProductItem } from "@/data/productsData";
import { formatImageUrl } from "@/utils/image";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("All");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrandFilter]);

  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<ProductItem | null>(null);

  // Form states
  const [formId, setFormId] = useState<string>("");
  const [formName, setFormName] = useState<string>("");
  const [formBrand, setFormBrand] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formImageUrl, setFormImageUrl] = useState<string>("");
  
  // Features and Specs arrays
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState<string>("");
  const [formSpecs, setFormSpecs] = useState<{ label: string; value: string }[]>([]);
  const [specLabel, setSpecLabel] = useState<string>("");
  const [specValue, setSpecValue] = useState<string>("");

  // Upload states
  const [uploading, setUploading] = useState<boolean>(false);

  // Load products
  const fetchProducts = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch product records");
      const list = await res.json();
      setProducts(list);
    } catch (err: any) {
      console.error(err);
      setError("Failed to retrieve products from active registers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
    setFormBrand(PRODUCT_BRANDS[0]?.name || "");
    setFormCategory(PRODUCT_CATEGORIES[0]?.id || "");
    setFormDescription("");
    setFormImageUrl("");
    setFormFeatures([]);
    setFeatureInput("");
    setFormSpecs([]);
    setSpecLabel("");
    setSpecValue("");
    setShowModal(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (item: ProductItem) => {
    clearMessages();
    setIsEdit(true);
    setFormId(item.id);
    setFormName(item.name);
    setFormBrand(item.brand);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormImageUrl(item.imageUrl || "");
    setFormFeatures(item.features || []);
    setFeatureInput("");
    setFormSpecs(item.specifications || []);
    setSpecLabel("");
    setSpecValue("");
    setShowModal(true);
  };

  // Add a feature entry
  const addFeature = () => {
    if (featureInput.trim()) {
      setFormFeatures([...formFeatures, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  // Remove a feature entry
  const removeFeature = (idx: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== idx));
  };

  // Add a specification row
  const addSpec = () => {
    if (specLabel.trim() && specValue.trim()) {
      setFormSpecs([...formSpecs, { label: specLabel.trim(), value: specValue.trim() }]);
      setSpecLabel("");
      setSpecValue("");
    }
  };

  // Remove a specification row
  const removeSpec = (idx: number) => {
    setFormSpecs(formSpecs.filter((_, i) => i !== idx));
  };

  // Handle local image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setFormImageUrl(compressedDataUrl);
          setSuccess(`Product image '${file.name}' attached and ready to save!`);
        } else {
          setFormImageUrl(rawUrl);
        }
        setUploading(false);
      };
      img.onerror = () => {
        setFormImageUrl(rawUrl);
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

  // Handle form Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!formId || !formName || !formBrand || !formCategory) {
      setError("Please fill in all required parameters.");
      return;
    }

    const payload: ProductItem = {
      id: formId.trim().toLowerCase().replace(/\s+/g, "-"),
      slug: formId.trim().toLowerCase().replace(/\s+/g, "-") + "-system",
      name: formName.trim(),
      brand: formBrand,
      category: formCategory,
      description: formDescription.trim(),
      features: formFeatures,
      specifications: formSpecs,
      imageUrl: formImageUrl || undefined
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      let res;
      if (isEdit) {
        // PUT update
        res = await fetch(`${baseUrl}/api/products/${payload.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // POST create
        res = await fetch(`${baseUrl}/api/products`, {
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

      setSuccess(`Product '${payload.name}' successfully ${isEdit ? "updated" : "created"}.`);
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to commit changes to dynamic database.");
    }
  };

  // Handle Delete operation
  const handleDelete = async () => {
    if (!deleteTarget) return;
    clearMessages();

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${baseUrl}/api/products/${deleteTarget}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete operation failed");

      setSuccess("Product record deleted successfully.");
      setDeleteTarget(null);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete product from database.");
      setDeleteTarget(null);
    }
  };

  const availableBrands = ["All", ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))];

  const filteredProducts = products.filter(item => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand =
      selectedBrandFilter === "All" ||
      item.brand?.toLowerCase() === selectedBrandFilter.toLowerCase();

    return matchesSearch && matchesBrand;
  });
  
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 font-sans text-white select-none">
      
      {/* Title Header */}
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight m-0 text-white">Product Inventory</h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Manage physical hardware database records</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 py-3 px-6 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-sky-600/10 active:translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product Node
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs flex items-center gap-2">
          <span>{success}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        {/* Search Input Bar */}
        <div className="relative max-w-md w-full">
          <span className="absolute left-4 top-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products by name, brand or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition-all font-medium"
          />
        </div>

        {/* Filter By Brand Dropdown */}
        <div className="flex items-center gap-2 shrink-0 max-sm:w-full">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">Filter Brand:</span>
          <select
            value={selectedBrandFilter}
            onChange={(e) => setSelectedBrandFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-extrabold text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none cursor-pointer max-sm:w-full shadow-sm"
          >
            {availableBrands.map((b) => (
              <option key={b} value={b} className="bg-white text-slate-900 font-bold py-1">
                {b === "All" ? "All Brands (Show All)" : b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
        
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Loading catalog modules...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs font-medium">
            No hardware products registered in this database. Click &quot;Add Product Node&quot; to begin.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left m-0">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Product Code (ID)</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Product Name</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Brand</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Category</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {paginatedProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{item.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-100 max-w-xs truncate">{item.name}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">{item.brand}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400 max-w-[180px] truncate">
                      {PRODUCT_CATEGORIES.find((c) => c.id === item.category)?.name || item.category}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => setViewItem(item)}
                        className="py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/5 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer border border-emerald-500/20"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/5 hover:bg-sky-500 hover:text-white transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item.id)}
                        className="py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50/5 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-white/5 bg-white/[0.01]">
                <span className="text-xs text-slate-400 font-medium">
                  Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} entries
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="py-1.5 px-3.5 rounded-xl border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-wider text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-sky-600 text-white shadow-md shadow-sky-600/10"
                          : "border border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="py-1.5 px-3.5 rounded-xl border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-wider text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* CRUD MODAL OVERLAY */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 w-full max-w-3xl rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 flex-shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white m-0">
                {isEdit ? `Configure Product: ${formId}` : "Create New Product Catalog Node"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Scroll Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ID input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Product Code ID *</label>
                  <input
                    type="text"
                    required
                    disabled={isEdit}
                    placeholder="e.g. gas-leak-detector"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-650 focus:border-sky-500 focus:outline-none transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter visual product name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-650 focus:border-sky-500 focus:outline-none transition-colors font-medium"
                  />
                </div>

                {/* Brand select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Brand Name *</label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none transition-colors font-medium cursor-pointer"
                  >
                    {PRODUCT_BRANDS.map((b) => (
                      <option key={b.id} value={b.name} className="bg-slate-950 text-white">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Category Classifier *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none transition-colors font-medium cursor-pointer"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-950 text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Narrative Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed technical product summary"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-650 focus:border-sky-500 focus:outline-none transition-colors font-medium resize-y"
                />
              </div>

              {/* Image Upload & Preview Area */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Product Visual Image</label>
                
                <div className="h-40 w-full bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-white/10 relative">
                  {formImageUrl && formImageUrl.trim() !== "" ? (
                    <img
                      key={formImageUrl}
                      src={formatImageUrl(formImageUrl)}
                      alt="Product Preview"
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
                    className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-slate-500"
                  >
                    <span className="text-xl">📷</span>
                    <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8">
                    <input
                      type="text"
                      placeholder="e.g. /uploads/image.png"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-650 focus:border-sky-500 focus:outline-none transition-colors font-medium"
                    />
                  </div>
                  <div className="md:col-span-4 relative">
                    <input
                      type="file"
                      id="product-file-upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="product-file-upload"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-dashed border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider bg-sky-500/5 hover:bg-sky-500/10 transition-all cursor-pointer"
                    >
                      {uploading ? "Processing..." : "Upload File"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Dynamic Features List */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Key Technical Features</span>
                
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter a features bullet point"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none transition-colors font-medium"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-5 py-3 rounded-2xl bg-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-colors cursor-pointer text-slate-200"
                  >
                    Add
                  </button>
                </div>

                <ul className="flex flex-col gap-2 pl-0 list-none m-0">
                  {formFeatures.map((feat, idx) => (
                    <li key={idx} className="flex justify-between items-center px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs">
                      <span className="text-slate-350 pr-4 leading-relaxed font-light">{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-rose-500 hover:text-rose-400 font-bold uppercase text-[9px] tracking-wider cursor-pointer border-none bg-transparent"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic Specs Matrix */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Technical Specifications Matrix</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Parameter label (e.g. Dimensions)"
                    value={specLabel}
                    onChange={(e) => setSpecLabel(e.target.value)}
                    className="px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none transition-colors font-medium"
                  />
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Performance metric value (e.g. 500x500mm)"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none transition-colors font-medium"
                    />
                    <button
                      type="button"
                      onClick={addSpec}
                      className="px-5 py-3 rounded-2xl bg-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-colors cursor-pointer text-slate-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden font-mono text-[11px] bg-white/[0.01]">
                  {formSpecs.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-xs font-normal">
                      No technical parameters specified.
                    </div>
                  ) : (
                    formSpecs.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 hover:bg-white/[0.02] transition-colors">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">{spec.label}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-200">{spec.value}</span>
                          <button
                            type="button"
                            onClick={() => removeSpec(idx)}
                            className="text-rose-500 hover:text-rose-400 font-bold uppercase text-[9px] tracking-wider cursor-pointer border-none bg-transparent"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Form submit/cancel */}
              <div className="pt-6 border-t border-white/5 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-full text-slate-400 border border-white/10 hover:border-white/20 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-lg shadow-sky-600/10"
                >
                  {isEdit ? "Update Catalog Node" : "Save Catalog Node"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 text-lg mx-auto">
              ⚠️
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight m-0">Confirm Node Deletion</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light m-0">
                Are you sure you want to permanently delete product code `{deleteTarget}`? This action cuts active dynamic assets and cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-full border border-white/10 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Abort
              </button>
              <button
                onClick={handleDelete}
                className="px-7 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Delete Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL OVERLAY */}
      {viewItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="h-16 flex items-center justify-between px-8 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 m-0">
                Product Details Node: {viewItem.id}
              </h3>
              <button
                onClick={() => setViewItem(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* Product Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 aspect-square flex items-center justify-center p-2 relative">
                  {viewItem.imageUrl && viewItem.imageUrl.trim() !== "" ? (
                    <img 
                      key={viewItem.imageUrl}
                      src={formatImageUrl(viewItem.imageUrl)} 
                      alt={viewItem.name} 
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
                    style={{ display: viewItem.imageUrl && viewItem.imageUrl.trim() !== "" ? "none" : "flex" }}
                    className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-slate-400"
                  >
                    <span className="text-xl">📷</span>
                    <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
                  </div>
                </div>
                
                <div className={`${viewItem.imageUrl ? "md:col-span-2" : "md:col-span-3"} space-y-4`}>
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Product Name</span>
                    <h2 className="text-base font-bold text-slate-900 m-0 mt-0.5">{viewItem.name}</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Brand Manufacturer</span>
                      <p className="text-xs text-slate-700 font-medium m-0 mt-0.5">{viewItem.brand}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Category Tag</span>
                      <p className="text-xs text-slate-700 font-medium m-0 mt-0.5">
                        {PRODUCT_CATEGORIES.find((c) => c.id === viewItem.category)?.name || viewItem.category}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Description Overview</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-light m-0 mt-0.5">{viewItem.description || "No description provided."}</p>
                  </div>
                </div>
              </div>

              {/* Technical Features */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">Key Technical Features</span>
                {viewItem.features && viewItem.features.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 list-none m-0">
                    {viewItem.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-650">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 font-light m-0">No technical features cataloged.</p>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">Technical Specifications Matrix</span>
                {viewItem.specifications && viewItem.specifications.length > 0 ? (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full border-collapse text-left m-0 text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-5 py-2.5 font-bold text-slate-600">Parameter</th>
                          <th className="px-5 py-2.5 font-bold text-slate-600">Value / Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {viewItem.specifications.map((spec, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-5 py-2.5 font-bold text-slate-500 tracking-wider text-[10px] uppercase">{spec.label}</td>
                            <td className="px-5 py-2.5 text-slate-800 font-semibold">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-light m-0">No technical specifications provided.</p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="h-16 flex items-center justify-end px-8 border-t border-slate-100 flex-shrink-0 bg-slate-50">
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-6 py-2.5 rounded-full bg-slate-850 text-white hover:bg-slate-700 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
