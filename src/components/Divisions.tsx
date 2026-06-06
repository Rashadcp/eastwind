import Link from "next/link";

interface SolutionCardData {
  title: string;
  badge: string;
  description: string;
  highlights: string[];
  image: string;
  slug: string;
  accent: string;
}

export default function Divisions() {
  const solutions: SolutionCardData[] = [
    {
      title: "Industrial Digitalization",
      badge: "Digital Twins & DCS Loops",
      description: "Optimize plant performance and simulate shutdown scenarios by unifying DCS databases, SCADA trends, and 3D plant meshes into an active operational model.",
      highlights: [
        "Real-time DCS control loop synchronization",
        "Interactive process simulation sandbox",
        "Web-native holographic plant model renders"
      ],
      image: "/industrial_digitalization.webp",
      slug: "industrial-digitalization",
      accent: "var(--color-accent-blue)"
    },
    {
      title: "Wireless Monitoring",
      badge: "Intrinsically Safe IIoT Mesh",
      description: "Eliminate expensive excavation and cabling in explosive atmospheres. Deploy self-healing radio mesh systems to bridge remote transmitters and gas detectors.",
      highlights: [
        "ATEX Zone 0/1 intrinsically safe nodes",
        "Self-healing multi-hop telemetry networks",
        "10-year battery cell power management"
      ],
      image: "/wireless_monitoring.webp",
      slug: "wireless-data-acquisition",
      accent: "var(--color-accent-orange)"
    },
    {
      title: "Predictive Intelligence",
      badge: "Asset Integrity Analytics",
      description: "Shift maintenance from reactive intervention to proactive safety. Leverage physics-informed machine learning to forecast mechanical wear hours before trips occur.",
      highlights: [
        "Physics-Informed Neural Network (PINN) modeling",
        "Predictive Remaining Useful Life (RUL) index",
        "Early warning rotating machinery alarms"
      ],
      image: "/predictive_intelligence.webp",
      slug: "ai-predictive-analytics",
      accent: "var(--color-accent-blue)"
    },
    {
      title: "Emergency Response Systems",
      badge: "Unified Command & Telemetry",
      description: "Coordinate municipal responders and industrial emergency services. Synthesize GPS vehicle routing, live drone thermal feeds, and alarms into a unified GIS portal.",
      highlights: [
        "Unified GIS emergency mapping interface",
        "Rosenbauer CAFS vehicle cabin telemetry",
        "Inter-agency radio gateway bridging channels"
      ],
      image: "/emergency_response.webp",
      slug: "emergency-response-systems",
      accent: "var(--color-accent-red)"
    },
    {
      title: "Critical Infrastructure Protection",
      badge: "Blast Enclosures & Boundaries",
      description: "Defend control rooms and refinery sectors from kinetic and thermal hazards. Engineer modular shelters and fences certified to Saudi military safety directives.",
      highlights: [
        "1.0 Bar structural overpressure blast deflection",
        "A60 thermal and marine fire isolation boundaries",
        "Automated toxic gas isolating HVAC dampers"
      ],
      image: "/critical_infrastructure.webp",
      slug: "critical-infrastructure-protection",
      accent: "var(--color-accent-orange)"
    },
    {
      title: "Hazardous Area Mobility",
      badge: "Zone 1 Mobile Digitization",
      description: "Digitize refinery checklists and site permit-to-work portals. Equip operational field crews with certified intrinsically safe tablets, smartphones, and inspection tools.",
      highlights: [
        "ATEX & IECEx Zone 1 certified rugged devices",
        "High-visibility Gorilla Glass touchscreens",
        "Enterprise Knox Mobile Device Management (MDM)"
      ],
      image: "/hazardous_mobility.webp",
      slug: "explosion-proof-mobility",
      accent: "var(--color-accent-red)"
    }
  ];

  return (
    <section
      id="divisions"
      className="bg-[#080c14] relative z-10 overflow-visible w-full m-0 pt-[100px] pb-0"
    >
      {/* Subtle grid accent background */}
      <div className="industrial-grid absolute inset-0 opacity-[0.03] pointer-events-none" />
      
      {/* Header Block Container */}
      <div className="max-w-[1400px] mx-auto px-10 max-sm:px-5 mb-[60px]">
        <div className="max-w-[800px]">
          <span className="block font-mono text-[0.75rem] uppercase tracking-[0.2em] text-red-500 mb-4 font-bold">
            Capabilities Portfolio
          </span>
          <h2 className="text-[3rem] max-sm:text-[2.2rem] text-white mb-5 uppercase tracking-tight font-extrabold">
            Enterprise Solutions
          </h2>
          <p className="text-[1.1rem] text-slate-400 leading-relaxed">
            Fusing operational safety systems with predictive intelligence and mobile automation to secure the region's primary industrial sectors.
          </p>
        </div>
      </div>

      {/* Vertical Solution Cards Stack - FULL WIDTH */}
      <div className="flex flex-col w-full">
        {solutions.map((sol, idx) => {
          const isEven = idx % 2 === 0;
          const isBlue = sol.accent.includes("blue");
          const isOrange = sol.accent.includes("orange");
          
          const highlightColor = isBlue ? "#38bdf8" : isOrange ? "#f97316" : "#ff6b6b";
          const badgeBgColor = isBlue ? "rgba(56, 189, 248, 0.12)" : isOrange ? "rgba(249, 115, 22, 0.12)" : "rgba(255, 107, 107, 0.12)";
          const badgeBorderColor = isBlue ? "rgba(56, 189, 248, 0.25)" : isOrange ? "rgba(249, 115, 22, 0.25)" : "rgba(255, 107, 107, 0.25)";
          
          return (
            <div
              key={sol.title}
              className="solution-card w-full h-screen sticky top-0 bg-[#080c14] overflow-hidden border-t border-white/8 shadow-[0_-20px_40px_rgba(0,0,0,0.4)] group max-lg:flex max-lg:justify-center max-lg:px-4"
            >
              {/* Background Image Container */}
              <div
                className="card-bg-image absolute inset-0 bg-cover bg-center transition-transform duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] z-0 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${sol.image})`,
                }}
              />

              {/* Dark Gradient Overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: isEven
                    ? "linear-gradient(to right, rgba(8, 12, 20, 0.9) 35%, rgba(8, 12, 20, 0.3) 70%, rgba(8, 12, 20, 0.1) 100%)"
                    : "linear-gradient(to left, rgba(8, 12, 20, 0.9) 35%, rgba(8, 12, 20, 0.3) 70%, rgba(8, 12, 20, 0.1) 100%)",
                }}
              />

              {/* Centered grid content alignment wrapper */}
              <div
                className={`card-content-wrapper w-full max-w-[1400px] mx-auto px-10 h-full flex items-center relative z-20 max-lg:px-0 max-lg:justify-center ${
                  isEven ? "justify-start" : "justify-end"
                }`}
              >
                {/* Glassmorphism Content Panel */}
                <div className="glass-panel-content max-w-[520px] w-full bg-slate-950/75 border border-white/10 rounded-[20px] p-10 flex flex-col gap-6 shadow-md transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-slate-950/85 group-hover:border-white/20 group-hover:shadow-lg max-lg:m-0 max-lg:p-[30px_20px] max-lg:max-w-full">
                  <div>
                    <span
                      className="font-mono text-[0.65rem] py-1 px-2 rounded-md uppercase tracking-wider font-semibold inline-block mb-3 border"
                      style={{ color: highlightColor, backgroundColor: badgeBgColor, borderColor: badgeBorderColor }}
                    >
                      {sol.badge}
                    </span>
                    <h3 className="text-[2.2rem] !text-white font-extrabold tracking-tight leading-none uppercase max-lg:text-[1.8rem]">
                      {sol.title}
                    </h3>
                  </div>

                  <p className="text-[0.95rem] !text-slate-200 leading-relaxed">
                    {sol.description}
                  </p>

                  {/* Highlights list */}
                  <div className="flex flex-col gap-2.5">
                    {sol.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-2.5 text-[0.85rem] !text-slate-300 font-medium"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: highlightColor }}
                        />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-2">
                    <Link
                      href={`/products/${sol.slug}`}
                      className="btn-primary py-2.5 px-6 text-[0.75rem] !text-white inline-flex items-center gap-2"
                      style={{
                        backgroundColor: sol.accent,
                        borderColor: sol.accent,
                      }}
                    >
                      Explore Solution
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
