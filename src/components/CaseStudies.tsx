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
      productUrl: "/products/mimes"
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
      productUrl: "/products/tridiagonal"
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
      productUrl: "/products/oneseven"
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
      className="relative z-10 w-full py-[120px] bg-slate-900 border-b border-white/8 overflow-hidden"
    >
      {/* Blurred Project Photo Background */}
      <div
        className="absolute inset-[-25px] bg-cover bg-center blur-[1px] saturate-200 opacity-45 z-0"
        style={{
          backgroundImage: "url('/critical_infrastructure.webp')",
        }}
      />
      {/* Dark gradient overlay for content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/45 to-slate-900/80 z-0" />

      <div className="max-w-[1400px] mx-auto px-10 max-sm:px-5 relative z-10">
        
        {/* Section Header */}
        <div className="mb-5 max-w-[500px]">
          <h2 className="text-[3rem] max-sm:text-[2.2rem] text-white mb-3.75 tracking-tight font-extrabold leading-[1.1]">
            Featured Projects
          </h2>
          <p className="text-[1.2rem] max-sm:text-[1.1rem] text-white/70 leading-relaxed font-normal m-0">
            Real-world deployments delivering measurable results across energy, infrastructure, safety, and industrial operations.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6 max-lg:gap-5 border-t border-b border-white/10 py-[30px] max-sm:py-5 mb-[60px]">
          {stats.map((stat, index) => (
            <div key={index} className="text-left">
              <div className="text-[2.4rem] font-extrabold text-white font-mono leading-none">
                {stat.value}
              </div>
              <div className="text-[0.85rem] text-white/50 mt-1.5 font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Responsive Grid Cards */}
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[30px] max-sm:gap-5">
          {cases.map((item) => {
            const isBlue = item.accent === "blue";
            const accentColor = isBlue ? "var(--color-accent-blue)" : "var(--color-accent-orange)";
            
            return (
              <Link key={item.id} href={item.productUrl} className="group no-underline block h-full">
                <motion.div
                  className="case-card bg-white rounded-3xl p-9 border border-white/8 shadow-sm flex flex-col justify-between relative cursor-pointer h-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]"
                  style={{
                    borderLeft: `4px solid ${accentColor}`,
                    "--accent-bg": isBlue ? "rgba(30, 62, 143, 0.65)" : "rgba(194, 32, 38, 0.65)",
                  } as React.CSSProperties}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover="hoverState"
                >
                  {/* Blurred Background Image */}
                  <motion.div
                    className="absolute inset-[-10px] bg-cover bg-center z-[1]"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                    }}
                    variants={{
                      hoverState: { scale: 1.12 }
                    }}
                    initial={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />

                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 to-slate-900/85 z-[1] transition-colors duration-300 group-hover:from-slate-900/40 group-hover:to-slate-900/75" />

                  {/* Card Content wrapper to sit on top of images */}
                  <div className="relative z-10 flex flex-col justify-between h-full flex-grow">
                    
                    {/* Top Row Info */}
                    <div>
                      <div className="flex justify-between items-center mb-5">
                        <span 
                          className="text-[0.75rem] font-bold text-white px-2.5 py-1 rounded-md uppercase backdrop-blur-sm"
                          style={{ backgroundColor: "var(--accent-bg)" }}
                        >
                          {item.industry}
                        </span>
                        <span className="text-[0.75rem] text-white/60 font-semibold">
                          {item.location}
                        </span>
                      </div>

                      <h3 className="text-[1.4rem] font-extrabold text-white mb-6 leading-normal">
                        {item.title}
                      </h3>

                      {/* Challenge & Solution Blocks */}
                      <div className="mb-5">
                        <h4 className="text-[0.7rem] uppercase font-mono text-white/45 tracking-wider mb-1.5">
                          Challenge
                        </h4>
                        <p className="text-[0.9rem] text-white/80 leading-normal mb-4">
                          {item.challenge}
                        </p>

                        <h4 className="text-[0.7rem] uppercase font-mono text-white/45 tracking-wider mb-1.5">
                          Solution
                        </h4>
                        <p className="text-[0.9rem] text-white/80 leading-normal mb-0">
                          {item.solution}
                        </p>
                      </div>
                    </div>

                    {/* Result Section */}
                    <div className="border-t border-white/10 pt-5 mt-5 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[0.65rem] uppercase font-mono text-white/55">
                          Result Metric
                        </span>
                        <strong className="text-[1.2rem] text-white font-extrabold mt-1">
                          {item.result}
                        </strong>
                      </div>

                      <motion.div
                        className="py-2 px-4 rounded-lg text-[0.8rem] font-bold text-white border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-200"
                        variants={{
                          hoverState: { 
                            backgroundColor: "#ffffff", 
                            color: "#0F172A",
                            borderColor: "#ffffff"
                          }
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        View Project
                      </motion.div>
                    </div>

                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
