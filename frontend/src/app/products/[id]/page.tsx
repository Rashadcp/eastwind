// src/app/products/[id]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { productsDb, ProductItem, getProductImageUrl } from "@/data/productsData";
import { formatImageUrl } from "@/utils/image";
import {
  Shield,
  Zap,
  Check,
  Download,
  ArrowLeft,
  Mail,
  ChevronRight,
  ExternalLink,
  Layers,
  FileText
} from "lucide-react";
import ProductActions from "@/components/ProductActions";

type Props = {
  params: Promise<{ id: string }>;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// 1. Fetch Product with backend API + static productsDb fallback
async function getProduct(idOrSlug: string): Promise<ProductItem | null> {
  try {
    const res = await fetch(`${baseUrl}/api/products/${encodeURIComponent(idOrSlug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) return data;
    }
  } catch (err) {
    // Fallback to local products database
  }

  // Fallback to local products database
  const found = productsDb.find(
    (p) =>
      p.id.toLowerCase() === idOrSlug.toLowerCase() ||
      p.slug.toLowerCase() === idOrSlug.toLowerCase()
  );
  return found || null;
}

// 2. Fetch all products for static generation
async function getAllProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetch(`${baseUrl}/api/products`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // ignore
  }
  return productsDb;
}

// 3. Static Site Generation: Pre-render all product pages at build time
export async function generateStaticParams() {
  const products = await getAllProducts();
  const paramsList: { id: string }[] = [];

  products.forEach((p) => {
    paramsList.push({ id: p.id });
    if (p.slug && p.slug !== p.id) {
      paramsList.push({ id: p.slug });
    }
  });

  return paramsList;
}

// 4. Dynamic SEO Metadata Generation for Google, Bing & Social Cards
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | Eastwind Safety Arabia",
      description: "The requested safety product could not be located.",
    };
  }

  const categoryName = (product.category || "Safety Infrastructure").replace(/-/g, " ");
  const title = `${product.name} | ${product.brand} | Eastwind Safety`;
  const description = product.description.slice(0, 160);
  const imageUrl = getProductImageUrl(product);

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand,
      categoryName,
      "ATEX Zone 1",
      "IECEx certified",
      "Saudi Arabia industrial safety",
      "East Wind Safety",
      "HCIS compliance",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: imageUrl.startsWith("http") ? imageUrl : `https://eastwindsafety.com${imageUrl}`,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl.startsWith("http") ? imageUrl : `https://eastwindsafety.com${imageUrl}`],
    },
    alternates: {
      canonical: `https://eastwindsafety.com/products/${product.slug || product.id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const imageUrl = getProductImageUrl(product);
  const categoryFormatted = (product.category || "General Safety")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // 5. JSON-LD Structured Data Schema for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: imageUrl.startsWith("http") ? imageUrl : `https://eastwindsafety.com${imageUrl}`,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand || "East Wind Safety",
    },
    category: categoryFormatted,
    offers: {
      "@type": "Offer",
      priceCurrency: "SAR",
      price: "Contact for Quote",
      availability: "https://schema.org/InStock",
      url: `https://eastwindsafety.com/products/${product.slug || product.id}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://eastwindsafety.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://eastwindsafety.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://eastwindsafety.com/products/${product.slug || product.id}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />

      <main className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased pt-28 pb-20 w-full overflow-x-hidden">
        {/* Top Breadcrumbs */}
        <div className="max-w-[1240px] mx-auto px-6 mb-6">
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Link href="/" className="hover:text-[#1e3e8f] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/products" className="hover:text-[#1e3e8f] transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Main Product Showcase Card */}
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm overflow-hidden p-6 sm:p-10 lg:p-12 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              
              {/* Left Column: Image & Badges */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="relative aspect-4/3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200/60 flex items-center justify-center p-8 overflow-hidden group">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 bg-white/90 border border-slate-200 text-xs font-mono font-bold text-[#1e3e8f] rounded-md backdrop-blur-sm shadow-xs">
                    {product.brand}
                  </span>
                </div>

                {/* Compliance Certifications */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 text-[#1e3e8f] text-xs font-semibold rounded-lg">
                    <Shield className="w-3.5 h-3.5" />
                    ATEX / IECEx Certified
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
                    <Zap className="w-3.5 h-3.5" />
                    SIL 2 / SIL 3 Capable
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                    HCIS Compliant
                  </span>
                </div>
              </div>

              {/* Right Column: Title, Category, Summary, CTAs */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c22026] font-bold mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  {categoryFormatted}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  {product.name}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pt-4 border-t border-slate-100">
                  <Link
                    href={`/enquire?product=${encodeURIComponent(product.name)}&brand=${encodeURIComponent(product.brand)}`}
                    className="px-8 py-3.5 bg-[#1e3e8f] hover:bg-[#152e6f] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    Request RFQ / Pricing
                  </Link>

                  <Link
                    href="/products"
                    className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Browse Catalog
                  </Link>
                </div>

                {/* Key Features Bullet Points */}
                {Array.isArray(product.features) && product.features.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Key Engineering Capabilities
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {product.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs font-medium text-slate-700 leading-snug"
                        >
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          {Array.isArray(product.specifications) && product.specifications.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-[28px] shadow-sm p-6 sm:p-10 mb-10">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-[#1e3e8f] font-bold block mb-1">
                  Datasheet Details
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Technical Specifications
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-150"
                  >
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                      {spec.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Hardware in Same Category */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
                    Portfolio Cross-Reference
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Related Safety Hardware
                  </h3>
                </div>
                <Link
                  href="/products"
                  className="text-xs font-bold text-[#1e3e8f] hover:underline flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => {
                  const relImg = getProductImageUrl(rel);
                  return (
                    <Link
                      key={rel.id}
                      href={`/products/${rel.slug || rel.id}`}
                      className="group bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col no-underline text-inherit"
                    >
                      <div className="aspect-4/3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 mb-4 overflow-hidden">
                        <img
                          src={relImg}
                          alt={rel.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#1e3e8f] uppercase tracking-wider mb-1">
                        {rel.brand}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#1e3e8f] transition-colors line-clamp-2 mb-2">
                        {rel.name}
                      </h4>
                      <span className="mt-auto text-xs font-semibold text-slate-500 group-hover:text-slate-800 flex items-center gap-1 pt-2 border-t border-slate-100">
                        View Specification <ChevronRight className="w-3 h-3" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}