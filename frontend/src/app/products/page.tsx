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

import { productsDb } from "@/data/productsData";
import Link from "next/link";
import { cachedFetch } from "@/utils/apiCache";
import {
  Shield,
  
  Check,
  Image as ImageIcon,
  FileText,
  FileCode,
  Globe,
  Settings,
  ArrowLeft,
  ArrowRight,
  Download,
  AlertTriangle,
  X,
  CheckCircle2,
  Search,
  RotateCcw,
  Zap
} from "lucide-react";

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialBrand = searchParams.get("brand") || "All";
  const initialSolution = searchParams.get("solution") || searchParams.get("category") || "All";
  const initialId = searchParams.get("id") || null;

  // Initialize with local productsDb so page and modals render in 0ms with zero loading screen
  const [products, setProducts] = useState<ProductItem[]>(() => {
    return productsDb.map((p: any) => ({
      ...p,
      brand: p.brand || "East Wind",
      solutionName: p.category
    }));
  });
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [categories, setCategories] = useState<string[]>(() => {
    return Array.from(new Set(productsDb.map((p: any) => p.category).filter(Boolean)));
  });

  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialSolution);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(() => {
    if (initialId) {
      const match = productsDb.find((p: any) => p.id === initialId || p.slug === initialId);
      if (match) {
        return {
          ...match,
          brand: match.brand || "East Wind",
          solutionName: match.category
        };
      }
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Enquiry Form State inside Modal
  const [enquireName, setEnquireName] = useState<string>("");
  const [enquireEmail, setEnquireEmail] = useState<string>("");
  const [enquireCompany, setEnquireCompany] = useState<string>("");
  const [enquireMessage, setEnquireMessage] = useState<string>("");
  const [enquireSubmitting, setEnquireSubmitting] = useState<boolean>(false);
  const [enquireSuccess, setEnquireSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (initialId && !selectedProduct) {
      const match = products.find((p) => p.id === initialId || p.slug === initialId);
      if (match) setSelectedProduct(match);
    }
  }, [initialId, products]);

  useEffect(() => {
    async function loadData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // 1. Fetch Brands & their products with instant memory cache
        const fetchedBrands = await cachedFetch<BrandItem[]>(`${baseUrl}/api/brands`, { fallback: [] });
        let allProds: ProductItem[] = [];

        if (Array.isArray(fetchedBrands) && fetchedBrands.length > 0) {
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

        // 2. Fetch all products API as well (with instant memory cache)
        const mainProds = await cachedFetch<any[]>(`${baseUrl}/api/products`, { fallback: [] });
        if (Array.isArray(mainProds)) {
          mainProds.forEach((mp) => {
            if (!allProds.some((p) => p.id === mp.id)) {
              allProds.push(mp);
            }
          });
        }

        if (allProds.length > 0) {
          setProducts(allProds);

          // Derive unique categories
          const cats = Array.from(new Set(allProds.map((p) => p.category || p.solutionName).filter((c): c is string => Boolean(c))));
          setCategories(cats);

          // Check if initialId was passed in query params
          if (initialId) {
            const match = allProds.find((p) => p.id === initialId);
            if (match) setSelectedProduct(match);
          }
        }
      } catch (err) {
        console.warn("Background product refresh warning:", err);
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
      setEnquireError(err.message || "Email delivery failed due to network or server configuration.");
    } finally {
      setEnquireSubmitting(false);
    }
  };

  const handleDownloadDatasheet = (product: ProductItem) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const specsHtml = (product.specifications || [
      { label: "Manufacturer Brand", value: product.brand },
      { label: "Product Identifier", value: product.id },
      { label: "Safety Classification", value: "ATEX / IECEx / SIL Compliant" },
      { label: "Operational Environment", value: "High-Hazard Industrial / Energy Sector" },
      { label: "Operating Temperature", value: "-40°C to +85°C Industrial Grade" },
      { label: "Ingress Protection", value: "IP66 / IP67 NEMA 4X" }
    ]).map(s => `<tr><td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569; width: 35%;">${s.label}</td><td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 500;">${s.value}</td></tr>`).join("");

    const featuresHtml = (product.features || [
      "Certified for mission-critical hazardous area telemetry and suppression",
      "Full compliance with Saudi Civil Defense and energy infrastructure mandates",
      "Integrated fail-safe telemetry communication diagnostics"
    ]).map(f => `<li style="margin-bottom: 8px; color: #334155; line-height: 1.5;">${f}</li>`).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${product.name} - Technical Datasheet | Eastwind Energy Arabia</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #0f172a; background: #ffffff; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e3e8f; padding-bottom: 20px; margin-bottom: 30px; }
            .brand-title { font-size: 24px; font-weight: 900; color: #1e3e8f; text-transform: uppercase; letter-spacing: -0.5px; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; font-family: monospace; text-transform: uppercase; }
            .badge-brand { background: #0f172a; color: #fff; }
            .badge-cat { background: #fef3c7; color: #b45309; margin-left: 8px; }
            h1 { font-size: 26px; font-weight: 800; margin: 12px 0 6px 0; color: #0f172a; }
            .prod-id { font-family: monospace; color: #64748b; font-size: 13px; margin-bottom: 24px; }
            .desc { font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 30px; background: #f8fafc; padding: 18px; border-radius: 8px; border-left: 4px solid #1e3e8f; }
            h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; align-items: center; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand-title">Eastwind Energy Arabia</div>
              <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;">Engineering & Hazardous Area Safety Systems</div>
            </div>
            <div class="no-print">
              <button onclick="window.print()" style="background: #1e3e8f; color: #fff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 13px;">Print / Save as PDF</button>
            </div>
          </div>

          <div>
            <span class="badge badge-brand">Brand: ${product.brand}</span>
            <span class="badge badge-cat">${product.category}</span>
          </div>

          <h1>${product.name}</h1>
          <div class="prod-id">Technical Specification Sheet • Product Reference ID: ${product.id}</div>

          <div class="desc">${product.description}</div>

          <h2>Technical Specifications</h2>
          <table>
            <tbody>
              ${specsHtml}
            </tbody>
          </table>

          <h2>Key Engineering Capabilities & Features</h2>
          <ul style="padding-left: 20px; font-size: 13px;">
            ${featuresHtml}
          </ul>

          <div class="footer">
            <div>Eastwind Energy Arabia Ltd. • Kingdom of Saudi Arabia • info@eastwindenergy.com</div>
            <div>Official Technical Product Datasheet • Confidential</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadWhitePaper = (product: ProductItem) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${product.name} - Technical Integration White Paper | Eastwind Energy Arabia</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #0f172a; background: #ffffff; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #c22026; padding-bottom: 20px; margin-bottom: 30px; }
            .brand-title { font-size: 24px; font-weight: 900; color: #c22026; text-transform: uppercase; }
            h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 10px; }
            .meta { font-size: 12px; font-family: monospace; color: #64748b; margin-bottom: 24px; }
            .section { margin-bottom: 26px; }
            .section h2 { font-size: 15px; text-transform: uppercase; color: #1e3e8f; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
            .section p { font-size: 13px; color: #334155; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand-title">Eastwind Energy Arabia</div>
              <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Technical White Paper & Safety Architecture</div>
            </div>
            <div class="no-print">
              <button onclick="window.print()" style="background: #c22026; color: #fff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 13px;">Print / Save as PDF</button>
            </div>
          </div>

          <div style="font-size: 11px; font-weight: 700; color: #c22026; text-transform: uppercase; letter-spacing: 1px;">WHITE PAPER // HAZARDOUS SYSTEMS INTEGRATION</div>
          <h1>${product.name}: Enterprise Field Deployment & Safety Validation Framework</h1>
          <div class="meta">Target Scope: ${product.brand} Industrial Architecture • Release Revision: 2026.Q3 • Scope Ref: ${product.id}</div>

          <div class="section">
            <h2>1. Executive Summary & Operational Scope</h2>
            <p>${product.description}</p>
            <p>This technical white paper outlines the standard operating principles, installation prerequisites, functional safety margins, and ATEX/IECEx zone compatibility protocols when incorporating <strong>${product.name}</strong> into petrochemical, offshore, and hazardous utility frameworks.</p>
          </div>

          <div class="section">
            <h2>2. Functional Safety & Compliance Verification</h2>
            <p>Every deployment of ${product.brand} equipment is engineered to eliminate field failure modes in volatile atmospheres (Zone 1/2 or Class 1 Div 1/2). System response latencies and fail-safe signal paths adhere to strict IEC 61508 / IEC 61511 SIL-2/3 safety integrity standards.</p>
          </div>

          <div class="section">
            <h2>3. Architectural Integration Guidelines</h2>
            <p>Direct communication bridges allow bidirectional telemetry streaming with plant DCS (Yokogawa, Honeywell, Emerson, ABB) and central SCADA stations with zero unmanaged loop downtime.</p>
          </div>

          <div class="footer">
            <div>Eastwind Energy Arabia Technical Consultancy Division</div>
            <div>White Paper Document ID: EW-WP-${product.id.toUpperCase()}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
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
                            <ImageIcon className="w-8 h-8 text-slate-300 stroke-[1.5]" />
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

      {/* ================= PRODUCT DETAIL FULL-PAGE VIEW (MIMES REFERENCE MODEL) ================= */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[300] bg-[#F8FAFC] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="max-w-[1300px] mx-auto w-full p-4 sm:p-8 lg:p-12 space-y-10 text-slate-900 min-h-screen"
            >
              {/* Top Navigation & Breadcrumbs Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Products</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                    <span>/</span>
                    <button type="button" onClick={() => setSelectedProduct(null)} className="hover:text-slate-900 transition-colors">Products</button>
                    <span>/</span>
                    <span className="font-bold text-slate-800 truncate max-w-[200px]">{selectedProduct.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold bg-slate-900 text-white px-3 py-1 rounded-md">
                    Brand: {selectedProduct.brand}
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-md">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>

              {/* 2-Column Product Showcase Layout (Mimes Architecture) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left Column (5/12): Image Gallery, Certifications & Technical Downloads */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Image Showcase Container */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex items-center justify-center relative shadow-sm overflow-hidden min-h-[340px]">
                    <div className="absolute inset-0 bg-radial from-slate-50 to-transparent pointer-events-none" />
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
                        className="max-h-[320px] w-auto h-auto max-w-full object-contain filter drop-shadow-lg transition-transform duration-500 hover:scale-105"
                      />
                    ) : null}
                    <div
                      style={{ display: selectedProduct.imageUrl && selectedProduct.imageUrl.trim() !== "" ? "none" : "flex" }}
                      className="flex flex-col items-center justify-center text-center p-8 space-y-1 text-slate-400"
                    >
                      <ImageIcon className="w-12 h-12 text-slate-300 stroke-[1.5]" />
                      <span className="text-xs font-mono font-medium text-slate-400">Technical Product Diagram</span>
                    </div>
                  </div>

                  {/* Certifications Badge Panel */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Industrial Safety Certifications
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded-lg flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>ATEX Zone 1 / 2</span>
                      </span>
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 font-bold rounded-lg flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>IECEx Certified</span>
                      </span>
                      <span className="px-3 py-1.5 bg-purple-50 text-purple-800 border border-purple-200 font-bold rounded-lg flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>SIL 2 / SIL 3</span>
                      </span>
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-lg flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>IP66 / IP67 NEMA 4X</span>
                      </span>
                    </div>
                  </div>

                  {/* Technical Downloads Box */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                      Technical Documentation
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleDownloadDatasheet(selectedProduct)}
                        className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl flex items-center justify-between group transition-all duration-200 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors">
                            <FileText className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 group-hover:text-white transition-colors">
                              Download Technical Datasheet
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              PDF • Complete Parameter Specs
                            </div>
                          </div>
                        </div>
                        <Download className="w-3.5 h-3.5 text-blue-600 group-hover:text-white transition-colors" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadWhitePaper(selectedProduct)}
                        className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl flex items-center justify-between group transition-all duration-200 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-red-100 text-[#c22026] group-hover:bg-[#c22026] group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors">
                            <FileCode className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 group-hover:text-white transition-colors">
                              Download Safety White Paper
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              PDF • Deployment & Compliance
                            </div>
                          </div>
                        </div>
                        <Download className="w-3.5 h-3.5 text-[#c22026] group-hover:text-white transition-colors" />
                      </button>
                    </div>

                    {/* Mimes Ecosystem Architecture Link */}
                    {selectedProduct.brand.toLowerCase().includes("mimes") && (
                      <div className="pt-2 border-t border-slate-100">
                        <Link
                          href="/solutions?cat=oil-gas"
                          className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center justify-between p-2.5 rounded-xl bg-sky-50 border border-sky-200 transition-colors no-underline"
                        >
                          <span className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5" />
                            <span>View Mimes Mesh Ecosystem</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column (7/12): Product Header, Actions & Detailed Sections */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Main Product Header */}
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                          Model Ref: {selectedProduct.id}
                        </span>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                          Active In Stock
                        </span>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      {selectedProduct.name}
                    </h1>

                    {/* Quick CTA Button */}
                    <div className="pt-2">
                      <a
                        href="#product-enquiry-form"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all no-underline cursor-pointer"
                      >
                        <span>Request Price & Technical Quote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Section 1: Product Description */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Product Description</span>
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Section 2: Key Equipment Features */}
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-orange-500" />
                        <span>Key Features & Functional Capabilities</span>
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                        {selectedProduct.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-medium text-slate-800"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Section 3: Technical Specifications Table */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      <span>Technical Specifications</span>
                    </h3>
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {(selectedProduct.specifications || [
                            { label: "Manufacturer Brand", value: selectedProduct.brand },
                            { label: "Safety Classification", value: "ATEX Zone 1/2, IECEx, SIL Compliant" },
                            { label: "Operational Environment", value: "High-Hazard Industrial / Energy Sector" },
                            { label: "Operating Temperature", value: "-40°C to +85°C Industrial Grade" },
                            { label: "Ingress Protection", value: "IP66 / IP67 NEMA 4X" }
                          ]).map((spec, sIdx) => (
                            <tr
                              key={sIdx}
                              className={sIdx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                            >
                              <td className="p-3 font-mono font-bold text-slate-600 w-2/5 border-b border-slate-100">
                                {spec.label}
                              </td>
                              <td className="p-3 text-slate-800 font-medium border-b border-slate-100">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Full-Width Technical Enquiry Form */}
              <div id="product-enquiry-form" className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600">
                    Direct Manufacturer Integration
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Request Technical Integration Quote for {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Submit your application requirements to receive customized pricing, delivery schedules, and integration blueprints.
                  </p>
                </div>

                {enquireError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{enquireError}</span>
                    </span>
                    <button onClick={() => setEnquireError(null)} className="text-red-500 hover:text-red-800 p-1 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {enquireSuccess ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl space-y-2">
                    <p className="font-extrabold text-sm flex items-center gap-2 text-emerald-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Technical Enquiry Dispatched Successfully!</span>
                    </p>
                    <p>Your product enquiry for <strong>{selectedProduct.name}</strong> has been transmitted and emailed directly to <strong className="underline">harik2021a@gmail.com</strong>.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendEnquiry} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-600 font-bold mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Abdullah Al-Mansoor"
                          value={enquireName}
                          onChange={(e) => setEnquireName(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1">Corporate Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={enquireEmail}
                          onChange={(e) => setEnquireEmail(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1">Company / Facility</label>
                        <input
                          type="text"
                          placeholder="e.g. Petrochemical Refinery"
                          value={enquireCompany}
                          onChange={(e) => setEnquireCompany(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Project Details & Quantity Requirements</label>
                      <textarea
                        rows={4}
                        value={enquireMessage}
                        onChange={(e) => setEnquireMessage(e.target.value)}
                        placeholder="Specify target zone classification, quantity, or commissioning timelines..."
                        className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium bg-slate-50/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={enquireSubmitting}
                      className="px-8 py-3.5 bg-slate-900 hover:bg-orange-600 text-white font-bold uppercase tracking-wider font-mono text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>{enquireSubmitting ? "Transmitting Request..." : "Send Product Enquiry"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
