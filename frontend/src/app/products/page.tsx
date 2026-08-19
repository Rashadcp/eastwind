"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { formatImageUrl } from "@/utils/image";

export interface SpecItem {
  label: string;
  value: string;
}

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  features?: string[];
  specifications?: SpecItem[];
  imageUrl?: string;
  slug?: string;
  solutionName?: string;
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
  products: ProductItem[];
}

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialBrand = searchParams.get("brand") || "All";
  const initialSolution = searchParams.get("solution") || searchParams.get("category") || "All";
  const initialId = searchParams.get("id") || null;

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialSolution);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // Enquiry Form State inside Modal
  const [enquireName, setEnquireName] = useState<string>("");
  const [enquireEmail, setEnquireEmail] = useState<string>("");
  const [enquireCompany, setEnquireCompany] = useState<string>("");
  const [enquireMessage, setEnquireMessage] = useState<string>("");
  const [enquireSubmitting, setEnquireSubmitting] = useState<boolean>(false);
  const [enquireSuccess, setEnquireSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // 1. Fetch Brands & their products
        const brandsRes = await fetch(`${baseUrl}/api/brands`);
        let allProds: ProductItem[] = [];
        let fetchedBrands: BrandItem[] = [];

        if (brandsRes.ok) {
          fetchedBrands = await brandsRes.json();
          setBrands(fetchedBrands);

          // Extract all products from brands
          fetchedBrands.forEach((b) => {
            if (b.products && Array.isArray(b.products)) {
              b.products.forEach((p) => {
                allProds.push({
                  ...p,
                  brand: b.name,
                  solutionName: b.solutionName || p.category
                });
              });
            }
          });
        }

        // 2. Fetch all products API as well (to ensure standalone products are included)
        const prodsRes = await fetch(`${baseUrl}/api/products`);
        if (prodsRes.ok) {
          const mainProds = await prodsRes.json();
          if (Array.isArray(mainProds)) {
            mainProds.forEach((mp) => {
              if (!allProds.some((p) => p.id === mp.id)) {
                allProds.push(mp);
              }
            });
          }
        }

        setProducts(allProds);

        // Derive unique categories
        const cats = Array.from(new Set(allProds.map((p) => p.category || p.solutionName).filter((c): c is string => Boolean(c))));
        setCategories(cats);

        // Check if initialId was passed in query params
        if (initialId) {
          const match = allProds.find((p) => p.id === initialId);
          if (match) setSelectedProduct(match);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [initialId]);

  // Sync state with URL params if modified
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    if (brandParam) setSelectedBrand(brandParam);

    const solParam = searchParams.get("solution") || searchParams.get("category");
    if (solParam) setSelectedCategory(solParam);
  }, [searchParams]);

  // Solution sector keywords map for precise solution filtering
  const solutionKeywordsMap: Record<string, string[]> = {
    "oil & gas industry": ["oil", "gas", "petrochemical", "refinery", "mimes", "xshielder", "wireless"],
    "marine operations": ["marine", "offshore", "ship", "vessel", "partech", "hull", "damage"],
    "utilities & power": ["utility", "power", "electrical", "grid", "atexor", "nardi", "compressor"],
    "defense & border security": ["defense", "border", "military", "tactical", "security", "guard"],
    "civil defense": ["civil", "fire", "rescue", "emergency", "one seven", "foam", "sione"],
    "smart industrial facilities": ["industrial", "facility", "smart", "digitalization", "telemetry", "sensor"]
  };

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesBrand =
      selectedBrand === "All" ||
      p.brand.toLowerCase() === selectedBrand.toLowerCase() ||
      p.brand.toLowerCase().includes(selectedBrand.toLowerCase());

    let matchesCategory = selectedCategory === "All";
    if (!matchesCategory) {
      const lowerSel = selectedCategory.toLowerCase();
      const keywords = solutionKeywordsMap[lowerSel];
      const prodText = `${p.name} ${p.brand} ${p.category || ""} ${p.solutionName || ""} ${p.description || ""}`.toLowerCase();
      if (keywords) {
        matchesCategory = keywords.some((kw) => prodText.includes(kw));
      } else {
        matchesCategory = prodText.includes(lowerSel);
      }
    }

    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBrand && matchesCategory && matchesSearch;
  });

  const [enquireError, setEnquireError] = useState<string | null>(null);

  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setEnquireSuccess(false);
    setEnquireError(null);
    setEnquireMessage(`Hello, I would like to request technical details and pricing for: ${product.name} (${product.brand}).`);
  };

  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquireName.trim() || !enquireEmail.trim()) return;

    setEnquireSubmitting(true);
    setEnquireError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const payload = {
        name: enquireName.trim(),
        email: enquireEmail.trim(),
        phone: enquireCompany.trim() || "Not Provided",
        purpose: "Product Technical Enquiry",
        productName: selectedProduct?.name,
        brand: selectedProduct?.brand,
        message: enquireMessage
      };

      const res = await fetch(`${baseUrl}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Email delivery failed.");
      }

      setEnquireSuccess(true);
    } catch (err: any) {
      console.error("Failed to send enquiry:", err);
      setEnquireError(err.message || "Email delivery failed due to network or server configuration.");
    } finally {
      setEnquireSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col justify-between">
      <Navbar />

      <main className="pt-32 pb-24 flex-1">
        


        {/* Main Content Layout (Left Filters + Right Products Grid) */}
        <section className="max-w-[1400px] mx-auto px-10 max-sm:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            
            {/* ================= LEFT SIDEBAR FILTERS (INDEPENDENT SCROLL CONTAINER) ================= */}
            <aside 
              className="space-y-6 bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm sticky top-28 max-h-[calc(100vh-130px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-orange-500 transition-colors"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9" }}
            >
              
              {/* Search Bar */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Search Equipment
                </label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              {/* Filter By Brand */}
              <div className="space-y-2 border-t border-slate-100 pt-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                    Filter By Brand
                  </span>
                  {(selectedBrand !== "All" || selectedCategory !== "All") && (
                    <button
                      onClick={() => {
                        setSelectedBrand("All");
                        setSelectedCategory("All");
                        setSearchQuery("");
                      }}
                      className="text-[10px] font-mono text-orange-600 font-bold hover:underline"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedBrand("All")}
                    className={`w-full text-left px-3 py-2 rounded-lg font-bold transition-colors flex justify-between items-center ${
                      selectedBrand === "All"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Brands</span>
                    <span className="font-mono text-[10px] opacity-75">({products.length})</span>
                  </button>

                  {brands.map((b) => {
                    const count = products.filter((p) => p.brand.toLowerCase() === b.name.toLowerCase()).length;
                    const isSelected = selectedBrand.toLowerCase() === b.name.toLowerCase();
                    return (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBrand(b.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex justify-between items-center ${
                          isSelected
                            ? "bg-orange-600 text-white font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="line-clamp-1">{b.name}</span>
                        <span className="font-mono text-[10px] opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter By Solution */}
              <div className="space-y-2 border-t border-slate-100 pt-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                    Filter By Solution
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`w-full text-left px-3 py-2 rounded-lg font-bold transition-colors flex justify-between items-center ${
                      selectedCategory === "All"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Solutions</span>
                    <span className="font-mono text-[10px] opacity-75">({products.length})</span>
                  </button>

                  {[
                    { id: "oil-gas", name: "Oil & Gas Industry", keywords: ["oil", "gas", "petrochemical", "refinery", "mimes", "xshielder", "wireless"] },
                    { id: "marine-offshore", name: "Marine Operations", keywords: ["marine", "offshore", "ship", "vessel", "partech", "hull", "damage"] },
                    { id: "utilities-power", name: "Utilities & Power", keywords: ["utility", "power", "electrical", "grid", "atexor", "nardi", "compressor"] },
                    { id: "defense-security", name: "Defense & Border Security", keywords: ["defense", "border", "military", "tactical", "security", "guard"] },
                    { id: "civil-defense", name: "Civil Defense", keywords: ["civil", "fire", "rescue", "emergency", "one seven", "foam", "sione"] },
                    { id: "smart-industrial", name: "Smart Industrial Facilities", keywords: ["industrial", "facility", "smart", "digitalization", "telemetry", "sensor"] }
                  ].map((sol) => {
                    const isSelected = selectedCategory.toLowerCase() === sol.name.toLowerCase();

                    // Calculate product count matching this solution
                    const count = products.filter((p) => {
                      const text = `${p.name} ${p.brand} ${p.category || ""} ${p.solutionName || ""} ${p.description || ""}`.toLowerCase();
                      return sol.keywords.some((kw) => text.includes(kw));
                    }).length;

                    return (
                      <button
                        key={sol.id}
                        onClick={() => setSelectedCategory(sol.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex justify-between items-center ${
                          isSelected
                            ? "bg-orange-600 text-white font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="line-clamp-1">{sol.name}</span>
                        <span className="font-mono text-[10px] opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </aside>

            {/* ================= RIGHT MAIN PRODUCTS GRID ================= */}
            <main className="space-y-6">
              
              {/* Filter Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-slate-400">Active Filters:</span>
                  {selectedBrand !== "All" && (
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-full font-bold">
                      Brand: {selectedBrand}
                    </span>
                  )}
                  {selectedCategory !== "All" && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full font-bold">
                      Solution: {selectedCategory}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-bold">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {selectedBrand === "All" && selectedCategory === "All" && !searchQuery && (
                    <span className="font-bold text-slate-700">Showing All Equipment</span>
                  )}
                </div>

                <span className="text-xs font-mono font-bold text-slate-400">
                  Showing {filteredProducts.length} Products
                </span>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center font-mono text-xs text-slate-400">
                  Loading Products Catalog...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                  <h3 className="text-base font-bold text-slate-800">No products match your selected filters.</h3>
                  <p className="text-xs text-slate-500">Try choosing another brand or category, or click "Reset All".</p>
                  <button
                    onClick={() => {
                      setSelectedBrand("All");
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Clean White Product Image Display */}
                        <div className="h-52 bg-white p-2 relative flex items-center justify-center mb-4">
                          {product.imageUrl && product.imageUrl.trim() !== "" ? (
                            <img
                              key={product.imageUrl}
                              src={formatImageUrl(product.imageUrl)}
                              alt={product.name}
                              onError={(e) => {
                                const el = e.currentTarget as HTMLImageElement;
                                el.style.display = "none";
                                if (el.nextElementSibling) {
                                  (el.nextElementSibling as HTMLElement).style.display = "flex";
                                }
                              }}
                              className="max-h-48 max-w-full object-contain filter drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : null}
                          <div
                            style={{ display: product.imageUrl && product.imageUrl.trim() !== "" ? "none" : "flex" }}
                            className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-slate-400"
                          >
                            <span className="text-2xl">📷</span>
                            <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
                          </div>
                        </div>

                        {/* Product Title & Short Subtitle Content */}
                        <div className="mb-6 space-y-1.5">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#2ba8ab] transition-colors">
                            {product.name}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 font-normal">
                            {product.description || product.category || "Certified Industrial Safety Equipment"}
                          </p>
                        </div>
                      </div>

                      {/* Single Action Button (View Details) */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleSelectProduct(product)}
                          className="w-full py-2.5 px-4 bg-white border border-[#2ba8ab] text-[#2ba8ab] hover:bg-[#2ba8ab] hover:text-white font-bold text-sm rounded-xl transition-all duration-200 text-center shadow-2xs"
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

            </main>

          </div>
        </section>

      </main>

      {/* ================= PRODUCT DETAIL & ENQUIRY MODAL ================= */}
      <AnimatePresence>
        {selectedProduct && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProduct(null);
            }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 pt-24 sm:pt-28 pb-10 bg-slate-950/85 backdrop-blur-lg overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-[28px] max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-slate-900 my-auto"
            >
              {/* Modal Top Header Bar with Prominent Close Button */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1 rounded-md">
                    Brand: {selectedProduct.brand}
                  </span>
                  <span className="text-xs font-mono font-bold bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-md">
                    {selectedProduct.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Close Window</span>
                  <span className="text-sm font-black">✕</span>
                </button>
              </div>

              {/* Product Header */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs font-mono font-bold text-slate-400 mt-1">
                  Product ID: {selectedProduct.id}
                </p>
              </div>

              {/* Image Frame (UNCROPPED WHOLE IMAGE) */}
              <div className="h-64 sm:h-72 bg-slate-950 rounded-2xl p-6 flex items-center justify-center border border-slate-800 relative">
                {selectedProduct.imageUrl && selectedProduct.imageUrl.trim() !== "" ? (
                  <img
                    key={selectedProduct.imageUrl}
                    src={formatImageUrl(selectedProduct.imageUrl)}
                    alt={selectedProduct.name}
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = "none";
                      if (el.nextElementSibling) {
                        (el.nextElementSibling as HTMLElement).style.display = "flex";
                      }
                    }}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                  />
                ) : null}
                <div
                  style={{ display: selectedProduct.imageUrl && selectedProduct.imageUrl.trim() !== "" ? "none" : "flex" }}
                  className="flex flex-col items-center justify-center text-center p-4 space-y-1 text-slate-400"
                >
                  <span className="text-xl">📷</span>
                  <span className="text-xs font-mono font-medium text-slate-400">No Image Found</span>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Product Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Key Features if available */}
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    Key Equipment Features
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedProduct.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 font-medium">
                        <span className="text-orange-600 font-bold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Direct Technical Enquiry Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200 bg-slate-50 p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Request Technical Integration Quote
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded">
                    Direct Response
                  </span>
                </div>

                {enquireError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center justify-between">
                    <span>⚠️ {enquireError}</span>
                    <button onClick={() => setEnquireError(null)} className="text-red-500 hover:text-red-800">✕</button>
                  </div>
                )}

                {enquireSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl space-y-1">
                    <p className="font-extrabold text-sm">✅ Technical Enquiry Dispatched Successfully!</p>
                    <p>Your product enquiry for <strong>{selectedProduct.name}</strong> has been transmitted and emailed directly to <strong className="underline">harik2021a@gmail.com</strong>.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendEnquiry} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name *"
                        value={enquireName}
                        onChange={(e) => setEnquireName(e.target.value)}
                        className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium bg-white"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Corporate Email *"
                        value={enquireEmail}
                        onChange={(e) => setEnquireEmail(e.target.value)}
                        className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Company / Facility"
                        value={enquireCompany}
                        onChange={(e) => setEnquireCompany(e.target.value)}
                        className="p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium bg-white"
                      />
                    </div>

                    <textarea
                      rows={3}
                      value={enquireMessage}
                      onChange={(e) => setEnquireMessage(e.target.value)}
                      placeholder="Project details / quantity requirements..."
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium bg-white"
                    />

                    <button
                      type="submit"
                      disabled={enquireSubmitting}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider font-mono rounded-xl shadow-md transition-all"
                    >
                      {enquireSubmitting ? "Transmitting Request..." : "Send Product Enquiry →"}
                    </button>
                  </form>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white p-12 text-center text-xs font-mono">Loading Products Catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
