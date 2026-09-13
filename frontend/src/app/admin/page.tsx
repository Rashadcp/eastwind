"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  products: number;
  solutions: number;
  applications: number;
  services: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    solutions: 0,
    applications: 0,
    services: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        // Fetch all listings in parallel
        const [prodRes, solRes, appRes, serRes] = await Promise.all([
          fetch(`${baseUrl}/api/products`),
          fetch(`${baseUrl}/api/solutions`),
          fetch(`${baseUrl}/api/applications`),
          fetch(`${baseUrl}/api/services`)
        ]);

        if (!prodRes.ok || !solRes.ok || !appRes.ok || !serRes.ok) {
          throw new Error("Failed to fetch database details");
        }

        const [prods, sols, apps, sers] = await Promise.all([
          prodRes.json(),
          solRes.json(),
          appRes.json(),
          serRes.json()
        ]);

        setStats({
          products: prods.length,
          solutions: sols.length,
          applications: apps.length,
          services: sers.length
        });
      } catch (err: any) {
        console.error("Dashboard stats load error:", err);
        setError("Could not load real-time statistics from database modules.");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      name: "Products Catalog",
      count: stats.products,
      description: "Explosion-proof hardware, SCBAs, cascade banks, and quick couplings",
      color: "border-slate-200 hover:border-[#1e3e8f]/40 hover:shadow-md",
      accent: "text-[#1e3e8f]",
      actionLabel: "Manage Products",
      link: "/admin/products"
    },
    {
      name: "Industry Solutions",
      count: stats.solutions,
      description: "MIMES wireless telemetry systems, Xshielder OT firewalls, and specific verticals",
      color: "border-slate-200 hover:border-[#1e3e8f]/40 hover:shadow-md",
      accent: "text-[#1e3e8f]",
      actionLabel: "Manage Solutions",
      link: "/admin/solutions"
    },
    {
      name: "Operational Applications",
      count: stats.applications,
      description: "Digitalisation strategies, wireless sensor routing layouts, and rescue systems",
      color: "border-slate-200 hover:border-[#1e3e8f]/40 hover:shadow-md",
      accent: "text-[#1e3e8f]",
      actionLabel: "Manage Applications",
      link: "/admin/applications"
    },
    {
      name: "Consultancy Services",
      count: stats.services,
      description: "HSE review schedules, F&G 3D ray-tracing audits, and panel FAT inspections",
      color: "border-slate-200 hover:border-[#1e3e8f]/40 hover:shadow-md",
      accent: "text-[#1e3e8f]",
      actionLabel: "Manage Services",
      link: "/admin/services"
    }
  ];

  return (
    <div className="space-y-6 font-sans antialiased text-slate-800">
      
      {/* Welcome Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#1e3e8f] bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Console Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Welcome to East Wind Console</h2>
          <p className="text-xs text-slate-600 leading-relaxed m-0 pt-0.5">
            Manage your product catalog, industry solutions, operational applications, and site content. All modifications synchronize live with the public storefront.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-sm text-xs leading-relaxed">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="bg-white border border-slate-200 p-5 rounded-sm flex flex-col justify-between hover:border-[#1e3e8f] transition-colors group"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.name}</span>
                <span className="text-3xl font-bold tracking-tight text-[#1e3e8f] leading-none">
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-slate-200 border-t-[#1e3e8f] rounded-full animate-spin" />
                  ) : (
                    card.count
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-normal m-0">
                {card.description}
              </p>
            </div>
            
            <Link
              href={card.link}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e3e8f] group-hover:text-[#162f6d] mt-5 no-underline transition-colors"
            >
              <span>{card.actionLabel}</span>
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
