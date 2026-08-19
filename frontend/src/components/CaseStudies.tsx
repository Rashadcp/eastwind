"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface CaseStudyItem {
  id: string;
  industry: string;
  location: string;
  title: string;
  challenge: string;
  solution: string;
  result: string;
  accent: "blue" | "orange";
  imageUrl: string;
  productUrl: string;
}

export default function CaseStudies() {
  const cases: CaseStudyItem[] = [
    {
      id: "h2s-grid",
      industry: "Oil & Gas",
      location: "Abu Dhabi, UAE",
      title: "Wireless H2S Monitoring Grid",
      challenge: "Required gas monitoring across hazardous areas without expensive excavation.",
      solution: "Deployed wireless telemetry and secure OT infrastructure.",
      result: "90% Cost Reduction",
      accent: "blue",
      imageUrl: "/wireless_monitoring.webp",
      productUrl: "/solutions/mimes"
    },
    {
      id: "compressor-protection",
      industry: "Energy Operations",
      location: "Dhahran, Saudi Arabia",
      title: "AI-Driven Compressor Protection",
      challenge: "Unplanned cavitation failures on high-pressure gas compressors caused production trips.",
      solution: "Integrated real-time neural modeling to predict cavitation faults early.",
      result: "48-Hour Early Warning",
      accent: "blue",
      imageUrl: "/predictive_intelligence.webp",
      productUrl: "/solutions/tridiagonal"
    },
    {
      id: "fire-cafs",
      industry: "Emergency & Safety",
      location: "Riyadh, Saudi Arabia",
      title: "High-Rise Fire CAFS Integration",
      challenge: "Urban expansion required high-efficiency firefighting with minimal water footprints.",
      solution: "Integrated vehicle fleets with CAFS and remote diagnostic links.",
      result: "40% Response Time Cut",
      accent: "orange",
      imageUrl: "/emergency_response.webp",
      productUrl: "/solutions/oneseven"
    }
  ];

  const stats = [
    { value: "100+", label: "Projects Delivered" },
    { value: "15+", label: "Years Experience" },
    { value: "99.8%", label: "System Availability" },
    { value: "24/7", label: "Operational Support" }
  ];

  return (
    <section
      id="case-studies"
      className="relative z-10 w-full py-[120px] bg-transparent border-b border-white/8 overflow-hidden"
    >
      {/* Sharp spatial backdrop image - recognizable refinery photo */}
      <div
        className="absolute inset-[-25px] bg-cover bg-center opacity-[0.55] z-0 transition-all duration-700"
        style={{
          backgroundImage: "url('/critical_infrastructure.webp')",
          filter: "blur(3px) brightness(1.3) saturate(135%)",
        }}
      />

      {/* Cyber coordinate grid overlay for depth */}
      <div className="industrial-grid absolute inset-0 opacity-[0.05] pointer-events-none z-[1]" />

      {/* Tech scanlines pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-25" 
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 0px, rgba(0, 240, 255, 0.05) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Dark gradient overlay tuned for maximum background brightness and text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090c]/85 via-[#08090c]/35 to-[#08090c]/90 z-[2] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-10 max-sm:px-5 relative z-10">
        
        {/* Section Header */}
        <div className="mb-[60px] max-w-[650px]">
          <span 
            className="block mb-4 text-[#c22026] uppercase text-[0.8rem] font-bold tracking-[0.25em]"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            Case Studies
          </span>
          <h2 
            className="text-[3.2rem] max-sm:text-[2.4rem] text-white mb-4 tracking-tight font-extrabold leading-[1.1] uppercase"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            Featured Projects
          </h2>
          <p 
            className="text-[1.1rem] text-slate-300 leading-relaxed font-light m-0"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            Real-world deployments delivering measurable results across energy, infrastructure, safety, and industrial operations.
          </p>
        </div>

        {/* Stats Grid of Spatial Panels */}
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6 mb-[60px]">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="p-6 text-left flex flex-col justify-center border border-white/8 bg-white/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-white/15 hover:bg-white/10 hover:-translate-y-0.5 shadow-md relative overflow-hidden group"
              style={{
                borderTop: "1.5px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              {/* Glowing top line bar on hover */}
              <div 
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: index % 2 === 0 ? "var(--color-accent-blue)" : "var(--color-accent-orange)",
                  boxShadow: `0 2px 8px ${index % 2 === 0 ? "rgba(30, 62, 143, 0.5)" : "rgba(194, 32, 38, 0.5)"}`
                }}
              />
              
              {/* Faint coordinate tag */}
              <div 
                className="absolute top-3 right-4 font-mono text-[0.55rem] text-slate-500 font-bold select-none tracking-widest"
              >
                
              </div>

              <div 
                className="text-[2.4rem] font-extrabold text-white leading-none font-mono tracking-tight mt-2"
                style={{ 
                  fontFamily: "var(--font-poppins), var(--font-sans), sans-serif",
                  textShadow: "0 0 12px rgba(255, 255, 255, 0.12)"
                }}
              >
                {stat.value}
              </div>
              <div 
                className="text-[0.72rem] text-slate-400 mt-2 font-bold uppercase tracking-wider"
                style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Responsive Grid Cards */}
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[30px] max-sm:gap-5">
          {cases.map((item, idx) => {
            const isBlue = item.accent === "blue";
            const accentColor = isBlue ? "var(--color-accent-blue)" : "var(--color-accent-orange)";
            const code = ["EST.H2S-01", "EST.CMP-02", "EST.FF-03"][idx] || `EST.PRJ-0${idx + 1}`;
            
            return (
              <Link key={item.id} href={item.productUrl} className="group no-underline block h-full">
                <div className="relative h-full group/panel">
                  
                  {/* Ambient Glow Halo underneath the card */}
                  <div
                    className="absolute -inset-2 rounded-[32px] blur-2xl opacity-5 scale-95 transition-all duration-500 group-hover/panel:opacity-18 group-hover/panel:scale-102 pointer-events-none z-0"
                    style={{
                      background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
                    }}
                  />

                  <motion.div
                    className="case-card w-full p-9 flex flex-col justify-between relative cursor-pointer h-full overflow-hidden border border-white/60 bg-gradient-to-b from-white/90 to-white/98 backdrop-blur-xl rounded-[28px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_50px_rgba(15,23,42,0.04)] hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)] hover:-translate-y-1.5 z-10"
                    style={{
                      borderLeft: `5px solid ${accentColor}`,
                      "--accent-bg": isBlue ? "rgba(30, 62, 143, 0.85)" : "rgba(194, 32, 38, 0.85)",
                      "--accent-text": isBlue ? "#1e3e8f" : "#c22026",
                    } as React.CSSProperties}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    whileHover="hoverState"
                  >
                    {/* Background Image */}
                    <motion.div
                      className="absolute inset-[-10px] bg-cover bg-center z-[1]"
                      style={{
                        backgroundImage: `url(${item.imageUrl})`,
                      }}
                      variants={{
                        hoverState: { scale: 1.1 }
                      }}
                      initial={{ scale: 1.05 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />

                    {/* Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/88 via-white/94 to-white/98 z-[2] transition-colors duration-300 group-hover:from-white/84 group-hover:via-white/90 group-hover:to-white/94" />

                    {/* Faint Monospace Serial Watermark in background */}
                    <div 
                      className="absolute bottom-20 right-6 font-mono text-[3.8rem] font-black text-slate-900/[0.03] select-none tracking-tight pointer-events-none z-[2]"
                    >
                      {code}
                    </div>

                    {/* Card Content wrapper to sit on top of images */}
                    <div className="relative z-10 flex flex-col justify-between h-full flex-grow">
                      
                      {/* Top Row Info */}
                      <div>
                        <div className="flex justify-between items-center mb-5 relative z-10">
                          <span 
                            className="text-[0.68rem] font-bold text-white px-3 py-1 rounded-md uppercase tracking-wider"
                            style={{ 
                              backgroundColor: "var(--accent-bg)",
                              fontFamily: "var(--font-poppins), var(--font-sans), sans-serif"
                            }}
                          >
                            {item.industry}
                          </span>
                          
                          {/* Location with map marker */}
                          <div className="flex items-center gap-1.5 text-[0.75rem] text-slate-500 font-semibold">
                            <svg 
                              width="12" 
                              height="12" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2.5"
                              className="text-slate-400"
                            >
                              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}>
                              {item.location}
                            </span>
                          </div>
                        </div>

                        <h3 
                          className="text-[1.4rem] font-extrabold text-slate-900 mb-6 leading-snug uppercase tracking-tight"
                          style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                        >
                          {item.title}
                        </h3>

                        {/* Challenge & Solution Blocks structured as Dossier Safety Logs */}
                        <div className="mb-5 flex flex-col gap-4.5 relative z-10">
                          <div className="flex gap-3">
                            <div className="w-[2px] bg-slate-200 shrink-0 self-stretch my-0.5" />
                            <div>
                              <h4 
                                className="text-[0.68rem] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1"
                                style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                              >
                                <span style={{ color: accentColor }}>▪</span> Challenge
                              </h4>
                              <p 
                                className="text-[0.88rem] text-slate-600 leading-relaxed font-normal"
                                style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                              >
                                {item.challenge}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <div className="w-[2px] bg-slate-200 shrink-0 self-stretch my-0.5" />
                            <div>
                              <h4 
                                className="text-[0.68rem] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1"
                                style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                              >
                                <span style={{ color: accentColor }}>▪</span> Solution
                              </h4>
                              <p 
                                className="text-[0.88rem] text-slate-600 leading-relaxed font-normal"
                                style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                              >
                                {item.solution}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Result Section */}
                      <div className="border-t border-slate-200/60 pt-5 mt-5 flex justify-between items-center relative z-10">
                        <div className="flex flex-col">
                          <span 
                            className="text-[0.65rem] uppercase font-bold text-slate-400 tracking-wider"
                            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                          >
                            Result Metric
                          </span>
                          
                          {/* Sleek Result capsule with success status dot */}
                          <div 
                            className="inline-flex items-center gap-2 mt-1.5 px-3 py-1 rounded-full border border-slate-100 bg-slate-50/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                          >
                            <span className="relative flex h-2 w-2">
                              <span 
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                style={{ backgroundColor: accentColor }}
                              ></span>
                              <span 
                                className="relative inline-flex rounded-full h-2 w-2"
                                style={{ backgroundColor: accentColor }}
                              ></span>
                            </span>
                            
                            <strong 
                              className="text-[1.15rem] font-black tracking-tight"
                              style={{ 
                                color: "var(--accent-text)",
                                fontFamily: "var(--font-poppins), var(--font-sans), sans-serif"
                              }}
                            >
                              {item.result}
                            </strong>
                          </div>
                        </div>

                        <motion.div
                          className="py-2.5 px-4.5 rounded-full text-[0.76rem] font-bold text-slate-700 border border-slate-200 bg-white/80 backdrop-blur-sm transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                          style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                          variants={{
                            hoverState: { 
                              backgroundColor: "var(--accent-text)", 
                              color: "#ffffff",
                              borderColor: "var(--accent-text)",
                              y: -1,
                              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)"
                            }
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          View Project
                          <svg 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3"
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </motion.div>
                      </div>

                    </div>
                  </motion.div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
