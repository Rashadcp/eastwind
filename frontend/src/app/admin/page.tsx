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
    <div className="space-y-8 font-sans antialiased text-slate-800 select-none">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/80 p-8 rounded-xl relative overflow-hidden shadow-3xs">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#1e3e8f_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#1e3e8f] uppercase font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Console Online
            </span>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-800 m-0">Welcome to East Wind Console</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-light m-0 pt-1">
            Manage your website content, product catalog, industry solutions, and customer inquiry settings. All changes saved here update the live public website immediately.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-5 rounded-lg text-xs leading-relaxed">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.name}
            className={`bg-white border ${card.color} p-6 rounded-xl flex flex-col justify-between hover:shadow-md transition-all duration-300 group`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">{card.name}</span>
                <span className={`text-4xl font-extrabold tracking-tight ${card.accent} leading-none`}>
                  {loading ? (
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-[#1e3e8f] rounded-full animate-spin" />
                  ) : (
                    card.count
                  )}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-light m-0">
                {card.description}
              </p>
            </div>
            
            <Link
              href={card.link}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 group-hover:text-[#1e3e8f] mt-6 no-underline transition-colors cursor-pointer"
            >
              {card.actionLabel}
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
