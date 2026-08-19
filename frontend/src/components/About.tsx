"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

interface MetricItem {
  value: string;
  label: string;
  desc: string;
}

interface HomeAboutData {
  imageUrl: string;
  title: string;
  overviewText: string;
  secondaryText: string;
  metrics: MetricItem[];
  lifecycleSteps: string[];
}

const defaultData: HomeAboutData = {
  imageUrl: "/products/default-process-instrumentation.png",
  title: "Sustaining Regional Safety Infrastructure",
  overviewText: "East Wind operates as a regional, end-to-end safety solutions provider delivering the complete lifecycle of safety projects across mission-critical infrastructure segments.",
  secondaryText: "Our core strength centers on adopting and implementing the latest safety technologies to solve complex, high-risk challenges—improving safety performance while reducing total cost of ownership (TCO) for our clients.",
  metrics: [
    {
      value: "70%",
      label: "Technical Functions Weight",
      desc: "Dedicated to application engineering, cross-disciplinary integration, workshops, and instrument field services."
    },
    {
      value: "10+",
      label: "Certified Personnel Scale",
      desc: "Housing internal multi-disciplinary functions spanning mechanical, electrical, and functional safety architecture."
    }
  ],
  lifecycleSteps: [
    "Concept Studies & Solution Selection",
    "Safety Systems Integration",
    "Manufacturing & Assembly",
    "Installation & Commissioning",
    "Project Management Leadership",
    "Long-Term After-Sales Support"
  ]
};

export default function About() {
  const [data, setData] = useState<HomeAboutData>(defaultData);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchHomeAbout = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/about/home`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setData({
            imageUrl: json.imageUrl || defaultData.imageUrl,
            title: json.title || defaultData.title,
            overviewText: json.overviewText || defaultData.overviewText,
            secondaryText: json.secondaryText || defaultData.secondaryText,
            metrics: json.metrics && json.metrics.length > 0 ? json.metrics : defaultData.metrics,
            lifecycleSteps: json.lifecycleSteps && json.lifecycleSteps.length > 0 ? json.lifecycleSteps : defaultData.lifecycleSteps,
          });
          setImageError(false);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic home about section:", err);
      }
    };

    fetchHomeAbout();
  }, []);

  return (
    <section 
      id="about-us" 
      className="relative w-full min-h-screen py-24 max-md:py-12 flex items-center justify-center bg-transparent overflow-hidden"
    >
      {/* Symmetrical Ambient Glow System mimicking the blue/orange dusk horizon */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1e3e8f]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#ff2228]/8 blur-[140px] pointer-events-none z-0" />

      {/* Structural Tech Grid Overlay */}
      <div className="industrial-grid absolute inset-0 opacity-[0.02] pointer-events-none z-0" />

      {/* Responsive Documentary Column Grid Layout */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-10 max-sm:px-5 grid grid-cols-1 lg:grid-cols-12 gap-12 max-md:gap-6 items-stretch">
        
        {/* LEFT COLUMN: Premium Documentary Splash Visual */}
        <div className="lg:col-span-5 flex flex-col relative group">
          <div className="relative w-full h-full min-h-[480px] max-lg:min-h-[320px] overflow-hidden rounded-[28px] border border-slate-200/60 shadow-2xl bg-slate-950/10 flex items-center justify-center">
            {data.imageUrl && !imageError ? (
              <img
                src={formatImageUrl(data.imageUrl)}
                alt={data.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 select-none"
              />
            ) : (
              <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center">
                <span className="text-4xl mb-2">📷</span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  No Image Found
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* RIGHT COLUMN: Frosted Glass Information Streams (Pure Black Text) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          
          {/* Narrative Overview Panel */}
          <div 
            style={{ backgroundColor: "#f2f4f2", borderColor: "#e2e6e3" }}
            className="border border-[#e2e6e3] rounded-[32px] max-md:rounded-2xl p-10 max-sm:p-6 flex flex-col justify-center shadow-md text-black flex-grow"
          >
            <h2 className="text-[2.6rem] max-md:text-[2rem] max-sm:text-[1.65rem] font-black tracking-tight uppercase leading-[1.1] mb-6 text-black">
              {data.title}
            </h2>
            <p className="text-[1.05rem] max-sm:text-sm text-black leading-relaxed font-normal mb-6">
              {data.overviewText}
            </p>
            <p className="text-sm max-sm:text-xs text-black leading-relaxed font-light opacity-90">
              {data.secondaryText}
            </p>
          </div>

          {/* Symmetrical Operational Benchmarks & Project Trackers */}
          <div 
            style={{ backgroundColor: "#f2f4f2", borderColor: "#e2e6e3" }}
            className="border border-[#e2e6e3] rounded-[32px] max-md:rounded-2xl p-10 max-sm:p-6 flex flex-col justify-center shadow-md text-black"
          >
            
            {/* Quantitative Data Grid */}
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6 mb-8 border-b border-slate-200/60 pb-8">
              {data.metrics.map((metric, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className={`text-4xl max-sm:text-3xl font-black font-mono ${idx % 2 === 0 ? "text-[#1e3e8f]" : "text-[#ff2228]"}`}>
                    {metric.value}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-black mt-1">
                    {metric.label}
                  </span>
                  <span className="text-[11px] text-black leading-tight mt-1 opacity-90">
                    {metric.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Matrix Deliverables Section */}
            <span className="block text-[10px] font-sans font-bold text-black opacity-60 uppercase tracking-widest mb-4">
              Turnkey Project Lifecycle Delivery Scope:
            </span>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
              {data.lifecycleSteps.map((step) => (
                <div 
                  key={step} 
                  className="flex items-center gap-2.5 py-2.5 px-4 bg-white/80 border border-slate-200/60 rounded-xl text-xs font-bold text-black shadow-3xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2228] shrink-0" />
                  <span className="truncate">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}