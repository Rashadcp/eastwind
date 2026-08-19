"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface SolutionCardData {
  title: string;
  badge: string;
  description: string;
  highlights: string[];
  image: string;
  slug: string;
  accent: string;
}

interface SolutionCardProps {
  sol: SolutionCardData;
  idx: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

function SolutionCard({ sol, idx, total, scrollYProgress }: SolutionCardProps) {
  const denominator = total > 1 ? total - 1 : 1;
  const startFraction = idx / denominator;
  const endFraction = (idx + 1) / denominator;

  // Calculate scaling transform: earlier cards scale down slightly more
  // target scale for idx 0 is 0.90, idx 5 (last card) is 1.0 (no scaling needed)
  const targetScale = total > 1 ? 0.90 + (idx / (total - 1)) * 0.08 : 1.0;
  
  // Custom transform interpolation based on the global scroll progress of the cards container
  const scaleTransform = useTransform(scrollYProgress, [0, startFraction, endFraction, 1], [1.0, 1.0, targetScale, targetScale]);
  const scale = idx === total - 1 ? 1.0 : scaleTransform;
    
  // Content fades out as the next card stacks on top
  const contentOpacityTransform = useTransform(scrollYProgress, [0, startFraction, endFraction, 1], [1.0, 1.0, 0.0, 0.0]);
  const contentOpacity = idx === total - 1 ? 1.0 : contentOpacityTransform;

  // Card background dims as next card stacks on top
  const dimOpacityTransform = useTransform(scrollYProgress, [0, startFraction, endFraction, 1], [0.0, 0.0, 0.65, 0.65]);
  const dimOpacity = idx === total - 1 ? 0.0 : dimOpacityTransform;

  const isEven = idx % 2 === 0;
  const isBlue = sol.accent.includes("blue");
  const isOrange = sol.accent.includes("orange");
  
  const highlightColor = isBlue ? "#38bdf8" : isOrange ? "#f97316" : "#ff6b6b";
  const badgeBgColor = isBlue ? "rgba(56, 189, 248, 0.08)" : isOrange ? "rgba(249, 115, 22, 0.08)" : "rgba(255, 107, 107, 0.08)";
  const badgeBorderColor = isBlue ? "rgba(56, 189, 248, 0.2)" : isOrange ? "rgba(249, 115, 22, 0.2)" : "rgba(255, 107, 107, 0.2)";

  return (
    <motion.div
      className="solution-card w-full h-screen sticky top-0 bg-[#f8fafc] overflow-hidden border-t border-slate-200/80 shadow-[0_-30px_60px_rgba(0,0,0,0.07)] group flex items-center will-change-transform"
      style={{
        zIndex: idx + 10,
        scale,
        transformOrigin: "center top",
        willChange: "transform",
      }}
    >
      {/* GPU Hardware Accelerated Background Image Panel */}
      <div
        className="card-bg-image absolute inset-0 bg-cover bg-center transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-0 group-hover:scale-[1.02] will-change-transform"
        style={{
          backgroundImage: `url(${sol.image})`,
          transform: "translate3d(0,0,0)"
        }}
      />

      {/* Ambient Dark Dimming Overlay for Stacked Cards */}
      {idx !== total - 1 && (
        <motion.div
          className="absolute inset-0 bg-slate-950 pointer-events-none"
          style={{
            zIndex: 5,
            opacity: dimOpacity,
          }}
        />
      )}

      {/* Dynamic Gradient Mask Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: isEven
            ? "linear-gradient(to right, rgba(248, 250, 252, 0.85) 15%, rgba(248, 250, 252, 0.4) 50%, rgba(248, 250, 252, 0) 90%)"
            : "linear-gradient(to left, rgba(248, 250, 252, 0.85) 15%, rgba(248, 250, 252, 0.4) 50%, rgba(248, 250, 252, 0) 90%)",
        }}
      />

      {/* Layout Centined Grid Content Box */}
      <div
        className={`card-content-wrapper w-full max-w-[1400px] mx-auto px-10 pt-16 h-full flex items-center relative z-20 max-lg:px-6 max-lg:justify-center ${
          isEven ? "justify-start" : "justify-end"
        }`}
      >
        {/* Premium Glassmorphic content panel with dynamic color halo drops */}
        <motion.div 
          className="relative max-w-[530px] w-full max-lg:max-w-full group/panel"
          style={{ opacity: contentOpacity }}
        >
          
          {/* Active Backdrop Glow Spot */}
          <div
            className="absolute -inset-4 rounded-[32px] blur-3xl opacity-10 transition-all duration-[600ms] ease-out group-hover/panel:opacity-20 group-hover/panel:scale-105 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${highlightColor} 0%, transparent 70%)`,
            }}
          />

          {/* Spatial Glass Card Frame */}
          <div 
            className="spatial-panel w-full p-10 max-sm:p-8 flex flex-col gap-6 border border-white/60 backdrop-blur-2xl saturate-150 rounded-[28px] relative z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_50px_rgba(15,23,42,0.06),inset 0_1px_1px_rgba(255,255,255,0.7)] group-hover:shadow-[0_30px_70px_rgba(15,23,42,0.1)] group-hover:border-white/80"
            style={{
              borderLeft: `5px solid ${highlightColor}`,
              background: "#f2f4f2",
              borderColor: "#e2e6e3",
            }}
          >
            {/* Big Watermark Index Serial */}
            <div 
              className="absolute top-6 right-8 text-[4.5rem] font-black text-slate-900/[0.04] leading-none select-none tracking-tighter"
              style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
            >
              {String(idx + 1).padStart(2, "0")}
            </div>

            <div className="relative z-10">
              <span
                className="text-[0.68rem] py-1 px-3 rounded-full uppercase tracking-wider font-bold inline-block mb-3.5 border"
                style={{ 
                  color: highlightColor, 
                  backgroundColor: badgeBgColor, 
                  borderColor: badgeBorderColor,
                  fontFamily: "var(--font-poppins), var(--font-sans), sans-serif"
                }}
              >
                {sol.badge}
              </span>
              <h3 
                className="text-[2.2rem] text-slate-900 font-extrabold tracking-tight leading-[1.1] uppercase max-lg:text-[1.8rem]"
                style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
              >
                {sol.title}
              </h3>
            </div>

            <p 
              className="text-[0.95rem] text-slate-600 leading-relaxed font-normal"
              style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
            >
              {sol.description}
            </p>

            {/* Operational Bullet Capability Grid */}
            <div className="flex flex-col gap-3 py-1 relative z-10">
              {sol.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-start gap-3.5 text-[0.88rem] text-slate-700 font-semibold group/item transition-colors duration-200 hover:text-slate-900"
                  style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 mt-0.5 transition-transform duration-300 ease-out group-hover/item:translate-x-1"
                    style={{ color: highlightColor }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Route Action Dispatcher Button */}
            <div className="mt-2 relative z-10">
              <Link
                href={`/solutions/${sol.slug}`}
                className="group/btn py-3 px-7 text-[0.78rem] font-bold uppercase tracking-wider !text-white inline-flex items-center gap-2.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-lg hover:-translate-y-[2px] active:translate-y-0"
                style={{
                  backgroundColor: highlightColor,
                  borderColor: highlightColor,
                  fontFamily: "var(--font-poppins), var(--font-sans), sans-serif",
                  boxShadow: `0 4px 14px 0 rgba(${isBlue ? "30, 62, 143" : "194, 32, 38"}, 0.2)`
                }}
              >
                Explore Solution
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Divisions() {
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the entire cards list container
  const { scrollYProgress } = useScroll({
    target: cardsContainerRef,
    offset: ["start start", "end end"]
  });

  // Synchronized slugs to match your product details paths perfectly
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
      slug: "tridiagonal",
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
      slug: "mimes",
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
      slug: "tridiagonal",
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
      slug: "oneseven",
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
      slug: "tgr",
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
      slug: "xshielder",
      accent: "var(--color-accent-red)"
    }
  ];

  return (
    <section
      id="divisions"
      className="bg-transparent relative z-10 overflow-visible w-full m-0 p-0"
    >
      {/* Subtle background coordinate grid */}
      <div className="industrial-grid absolute inset-0 opacity-[0.03] pointer-events-none" />
      
      {/* Header Block Container - Scrolls normally before cards pin */}
      <div className="max-w-[1400px] mx-auto px-10 max-sm:px-5 pt-[100px] mb-10">
        <div className="max-w-[800px]">
          <span 
            className="block text-[0.8rem] uppercase tracking-[0.25em] text-[#c22026] mb-4 font-bold"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            Capabilities Portfolio
          </span>
          <h2 
            className="text-[3.2rem] max-sm:text-[2.4rem] text-white mb-5 uppercase tracking-tight font-extrabold leading-none"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            Enterprise Solutions
          </h2>
          <p 
            className="text-[1.1rem] text-slate-300 leading-relaxed font-light"
            style={{ fontFamily: "var(--font-poppins), var(--font-sans), sans-serif" }}
          >
            Fusing operational safety systems with predictive intelligence and mobile automation to secure the region&apos;s primary industrial sectors.
          </p>
        </div>
      </div>

      {/* Stacking Cards Deck Stream */}
      <div 
        ref={cardsContainerRef} 
        className="flex flex-col w-full overflow-visible"
      >
        {solutions.map((sol, idx) => (
          <SolutionCard
            key={sol.title}
            sol={sol}
            idx={idx}
            total={solutions.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}