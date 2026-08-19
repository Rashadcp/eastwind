"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface SuccessStoryItem {
  id: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  imageUrl: string;
  year?: string;
  date?: string;
}

const DEFAULT_STORIES: SuccessStoryItem[] = [
  {
    id: "story-1",
    title: "One Seven CAFS Deployment for Petrochemical Storage Depot",
    client: "Major Energy Terminal, Jubail",
    category: "Fire Suppression",
    summary: "Engineered and commissioned a heavy-duty Compressed Air Foam System (CAFS) protecting high-value hydrocarbon storage tanks against extreme thermal events while slashing water consumption by 90%.",
    imageUrl: "/emergency_vehicle.webp",
    date: "October 2025",
    year: "2025"
  },
  {
    id: "story-2",
    title: "ATEX Zone 0 Mobile & Wireless Gas Mesh Implementation",
    client: "Refinery Complex, Yanbu",
    category: "Wireless Safety",
    summary: "Deployed intrinsically safe Xshielder mobile terminals and Mimes wireless self-healing gas detection nodes across refinery turnarounds for zero-wiring continuous personnel protection.",
    imageUrl: "/wireless_monitoring.webp",
    date: "July 2025",
    year: "2025"
  },
  {
    id: "story-3",
    title: "High-Pressure Respiratory Charging & Protection Hub",
    client: "Industrial Offshore Fleet, Dammam",
    category: "Breathing Systems",
    summary: "Installed Nardi 350 Bar heavy breathing air cascade recharging stations and Polyhose safety lines for offshore vessel crews requiring continuous EN12021 compliant breathing air.",
    imageUrl: "/emergency_response.webp",
    date: "March 2025",
    year: "2025"
  },
  {
    id: "story-4",
    title: "Hazardous Area Industrial Digitalization & Asset Tracking",
    client: "Chemical Processing Hub, Ras Tanura",
    category: "Industrial Digitalization",
    summary: "Integrated Ex-proof telemetry sensors and predictive analytics control loops across high-risk processing shelters to ensure zero unscheduled downtime.",
    imageUrl: "/industrial_digitalization.webp",
    date: "November 2024",
    year: "2024"
  }
];

export default function SuccessStoriesSection() {
  const [stories, setStories] = useState<SuccessStoryItem[]>(DEFAULT_STORIES);

  useEffect(() => {
    async function fetchStories() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/success-stories`);
        if (res.ok) {
          const apiStories = await res.json();
          if (Array.isArray(apiStories) && apiStories.length > 0) {
            setStories(apiStories);
          }
        }
      } catch (err) {
        console.error("Using default success stories fallback:", err);
      }
    }
    fetchStories();
  }, []);

  return (
    <section className="relative z-10 py-24 bg-[#F8FAFC] text-slate-900 border-t border-b border-slate-200/80 overflow-hidden">
      {/* Subtle ambient glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-10 max-sm:px-5 relative z-10">
        
        {/* Executive Header Block */}
        <div className="max-w-[780px] mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-[0.75rem] font-mono font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            Our Journey & Achievements
          </span>
          <h2 className="text-[3rem] max-md:text-[2.2rem] uppercase font-extrabold tracking-tight leading-none text-slate-900">
            Our Success Story
          </h2>
          <p className="text-[1.08rem] leading-relaxed m-0 font-medium text-slate-700 mt-4">
            Explore Eastwind's milestones of engineered safety excellence, technological breakthroughs, and proven achievements across Saudi Arabia.
          </p>
        </div>

        {/* ================= SUCCESS STORIES CONTAINERS GRID (IMAGE, HEADING, DATE, CONTENT ONLY) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <motion.div
              key={story.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-slate-200/90 rounded-[24px] overflow-hidden shadow-lg hover:shadow-2xl hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* 1. IMAGE (WHOLE IMAGE UNCROPPED) */}
                <div className="h-72 max-sm:h-60 relative overflow-hidden bg-slate-950 flex items-center justify-center p-3 border-b border-slate-800">
                  <img
                    src={story.imageUrl || "/emergency_vehicle.webp"}
                    alt={story.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* 2. DATE, HEADING & CONTENT */}
                <div className="p-7 space-y-3">
                  
                  {/* DATE BADGE */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-md">
                      📅 {story.date || story.year || "2025"}
                    </span>
                  </div>

                  {/* HEADING */}
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-orange-600 transition-colors">
                    {story.title}
                  </h3>

                  {/* CONTENT / SUMMARY */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                    {story.summary}
                  </p>

                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
