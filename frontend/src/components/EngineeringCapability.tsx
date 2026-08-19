"use client";

import { motion } from "framer-motion";

interface SolutionItem {
  title: string;
  category: string;
  valueProp: string;
  metric: string;
  imageUrl: string;
  accent: "blue" | "orange";
}

export default function EngineeringCapability() {
  const solutions: SolutionItem[] = [
    {
      title: "Analyzer Instrument Shelters",
      category: "Process Instrumentation Enclosures",
      valueProp: "Custom-designed shelters ensuring continuous analyzer performance in high-hazard zones.",
      metric: "Zone 1 ATEX Compliant",
      imageUrl: "/analyzer_shelter.webp",
      accent: "blue"
    },
    {
      title: "Blast Resistant Modules (BRM)",
      category: "Structural Safety Buildings",
      valueProp: "Personnel and control room protection engineered for extreme hydrocarbon explosion zones.",
      metric: "10 PSI Overpressure Rating",
      imageUrl: "/blast_module.webp",
      accent: "orange"
    },
    {
      title: "Blast & Thermal E-House Systems",
      category: "Remote Substations Engineering",
      valueProp: "Pre-commissioned mobile E-House substations built to withstand hazardous desert operations.",
      metric: "HCIS SAF-01 Approved",
      imageUrl: "/thermal_ehouse.webp",
      accent: "blue"
    },
    {
      title: "Emergency Vehicle Integration",
      category: "Critical Fleet Customization",
      valueProp: "Integrating CAFS, advanced telemetry, and safety loops into high-performance rescue trucks.",
      metric: "90% Response Time Reduction",
      imageUrl: "/emergency_vehicle.webp",
      accent: "orange"
    }
  ];

  return (
    <section
      id="engineering"
      className="relative z-10 w-full py-[120px] bg-transparent border-t border-b border-white/8 overflow-hidden"
    >
      {/* Subtle grid accent background */}
      <div className="industrial-grid absolute inset-0 opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-10 max-sm:px-5">
        
        {/* Section Header */}
        <div className="mb-20 max-w-[800px]">
          <span 
            className="block mb-4 text-[#c22026] uppercase text-[0.8rem] font-bold tracking-[0.25em]"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            Showcase Portfolio
          </span>
          <h2 
            className="text-[3.2rem] max-sm:text-[2.4rem] text-white mb-6 tracking-tight font-extrabold leading-[1.1] uppercase"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            Engineering Excellence
          </h2>
          <p 
            className="text-[1.1rem] text-slate-300 leading-relaxed font-light m-0"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            We design, fabricate, and commission heavy-duty physical enclosures and integrate specialized emergency vehicles. All modules satisfy HCIS and international safety standards.
          </p>
        </div>

        {/* 2x2 Responsive Card Grid */}
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-10 max-lg:gap-[30px]">
          {solutions.map((sol, idx) => {
            const isBlue = sol.accent === "blue";
            const accentColor = isBlue ? "var(--color-accent-blue)" : "var(--color-accent-orange)";
            const glowColor = isBlue ? "rgba(56, 189, 248, 0.15)" : "rgba(194, 32, 38, 0.18)";
            
            return (
              <div key={idx} className="relative group/panel">
                {/* Ambient Glow Halo underneath the card */}
                <div
                  className="absolute -inset-2 rounded-[32px] blur-3xl opacity-5 scale-95 transition-all duration-500 group-hover/panel:opacity-18 group-hover/panel:scale-102 pointer-events-none z-0"
                  style={{
                    background: `radial-gradient(circle at 50% 120%, ${glowColor} 0%, transparent 65%)`,
                  }}
                />

                <motion.div
                  className="group flex flex-col w-full h-full overflow-hidden border border-white/60 bg-gradient-to-b from-white/92 to-white/98 backdrop-blur-xl rounded-[28px] cursor-pointer relative z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_50px_rgba(15,23,42,0.04)] hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)] hover:-translate-y-1.5"
                  style={{
                    borderLeft: `5px solid ${accentColor}`,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                  whileHover="hovered"
                >
                  {/* Visual Image Container */}
                  <div className="relative w-full h-[280px] overflow-hidden">
                    <motion.img
                      src={sol.imageUrl}
                      alt={sol.title}
                      className="w-full h-full object-cover"
                      variants={{
                        hovered: { scale: 1.05 }
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                    {/* Aspect gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 to-transparent pointer-events-none" />
                    
                    {/* Category Tag overlay */}
                    <span 
                      className="absolute top-5 left-5 bg-white/90 backdrop-blur-md py-1.5 px-3.5 rounded-full text-[0.68rem] font-bold text-slate-800 border border-slate-200/50 shadow-sm"
                      style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                    >
                      {sol.category}
                    </span>

                    {/* Serial Coordinate Tag */}
                    <div 
                      className="absolute top-5 right-5 font-mono text-[0.65rem] text-white/70 bg-black/45 backdrop-blur-md py-1.5 px-3 rounded-full font-bold select-none tracking-widest border border-white/10"
                    >
                      ENG.CAP.0{idx + 1}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-[30px] flex-grow flex flex-col justify-between relative z-10">
                    <div>
                      <h3 
                        className="text-[1.5rem] font-extrabold text-slate-900 mb-3 tracking-tight uppercase"
                        style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                      >
                        {sol.title}
                      </h3>
                      <p 
                        className="text-[0.92rem] text-slate-600 leading-relaxed mb-6 font-normal"
                        style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                      >
                        {sol.valueProp}
                      </p>
                    </div>

                    {/* Outcome and CTA bottom block */}
                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-5 mt-2.5">
                      <div className="flex flex-col">
                        <span 
                          className="text-[0.65rem] text-slate-500 uppercase font-bold tracking-wider"
                          style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                        >
                          Engineering Outcome
                        </span>
                        
                        {/* Unified capsule with success status dot */}
                        <div 
                          className="inline-flex items-center gap-2 mt-1.5 px-3 py-1 rounded-full border border-slate-100 bg-slate-50/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] self-start"
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
                            className="text-[0.88rem] font-black tracking-tight"
                            style={{ 
                              color: accentColor,
                              fontFamily: "var(--font-poppins), var(--font-sans), sans-serif"
                            }}
                          >
                            {sol.metric}
                          </strong>
                        </div>
                      </div>

                      <motion.div
                        className="py-2.5 px-4.5 rounded-full text-[0.76rem] font-bold text-slate-700 border border-slate-200 bg-white/80 backdrop-blur-sm transition-all duration-200 flex items-center gap-1.5 shadow-sm"
                        style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                        variants={{
                          hovered: { 
                            backgroundColor: accentColor, 
                            color: "#ffffff",
                            borderColor: accentColor,
                            y: -1,
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)"
                          }
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        Explore Specs
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
            );
          })}
        </div>

      </div>
    </section>
  );
}
