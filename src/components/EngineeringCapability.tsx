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
      imageUrl: "/analyzer_shelter.png",
      accent: "blue"
    },
    {
      title: "Blast Resistant Modules (BRM)",
      category: "Structural Safety Buildings",
      valueProp: "Personnel and control room protection engineered for extreme hydrocarbon explosion zones.",
      metric: "10 PSI Overpressure Rating",
      imageUrl: "/blast_module.png",
      accent: "orange"
    },
    {
      title: "Blast & Thermal E-House Systems",
      category: "Remote Substations Engineering",
      valueProp: "Pre-commissioned mobile E-House substations built to withstand hazardous desert operations.",
      metric: "HCIS SAF-01 Approved",
      imageUrl: "/thermal_ehouse.png",
      accent: "blue"
    },
    {
      title: "Emergency Vehicle Integration",
      category: "Critical Fleet Customization",
      valueProp: "Integrating CAFS, advanced telemetry, and safety loops into high-performance rescue trucks.",
      metric: "90% Response Time Reduction",
      imageUrl: "/emergency_vehicle.png",
      accent: "orange"
    }
  ];

  return (
    <section
      id="engineering"
      className="relative z-10 w-full py-[120px] bg-slate-50 border-t border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-10 max-sm:px-5">
        
        {/* Section Header */}
        <div className="mb-20 max-w-[800px]">
          <span className="block mb-4 text-[#0F5F93] uppercase font-mono text-[0.75rem] font-bold tracking-widest">
            Showcase Portfolio
          </span>
          <h2 className="text-[3rem] max-sm:text-[2.2rem] text-[#0F172A] mb-6 tracking-tight font-extrabold leading-[1.1]">
            Engineering Excellence
          </h2>
          <p className="text-[1.2rem] max-sm:text-[1.1rem] text-slate-600 leading-relaxed font-normal m-0">
            We design, fabricate, and commission heavy-duty physical enclosures and integrate specialized emergency vehicles. All modules satisfy HCIS and international safety standards.
          </p>
        </div>

        {/* 2x2 Responsive Card Grid */}
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-10 max-lg:gap-[30px]">
          {solutions.map((sol, idx) => {
            const isBlue = sol.accent === "blue";
            const accentColor = isBlue ? "var(--color-accent-blue)" : "var(--color-accent-orange)";
            
            return (
              <motion.div
                key={idx}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/50 cursor-pointer relative"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 to-transparent pointer-events-none" />
                  {/* Category Tag overlay */}
                  <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-md py-1.5 px-3 rounded-lg text-[0.75rem] font-bold text-[#0F172A] border border-slate-200/50 shadow-sm">
                    {sol.category}
                  </span>
                </div>

                {/* Details Section */}
                <div className="p-[30px] flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-[1.6rem] font-extrabold text-[#0F172A] mb-3 tracking-tight">
                      {sol.title}
                    </h3>
                    <p className="text-[0.95rem] text-slate-600 leading-relaxed mb-6">
                      {sol.valueProp}
                    </p>
                  </div>

                  {/* Outcome and CTA bottom block */}
                  <div className="flex items-center justify-between border-t border-slate-200/70 pt-5 mt-2.5">
                    <div className="flex flex-col">
                      <span className="text-[0.7rem] text-slate-500 uppercase font-mono font-bold tracking-wider">
                        Engineering Outcome
                      </span>
                      <strong className="text-[1.1rem] font-extrabold mt-1" style={{ color: accentColor }}>
                        {sol.metric}
                      </strong>
                    </div>

                    <motion.div
                      className="text-[0.85rem] font-bold text-[#0F172A] flex items-center gap-1.5"
                      variants={{
                        hovered: { x: 5 }
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      Explore Specs
                      <span className="text-[1.1rem]">→</span>
                    </motion.div>
                  </div>
                </div>

                {/* Left border highlight on hover */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 origin-left"
                  style={{
                    backgroundColor: accentColor,
                    transformOrigin: "left"
                  }}
                  variants={{
                    hovered: { scaleY: 1 },
                    initial: { scaleY: 0 }
                  }}
                  initial="initial"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
