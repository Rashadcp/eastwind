"use client";

import { useMemo, useState } from "react";

interface PillarItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accentColor: string;
  borderAccent: string;
  accentHex: string;
}

export default function WhyChooseUs() {
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);

  const pillars = useMemo<PillarItem[]>(() => [
    {
      id: "01",
      title: "Lifecycle Ownership",
      desc: "Turnkey engineering delivery from conceptual hazard studies and automated assembly through full field commissioning and lifetime after-sales support.",
      accentColor: "rgba(30, 62, 143, 0.08)",
      borderAccent: "rgba(30, 62, 143, 0.35)",
      accentHex: "#1e3e8f",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      ),
    },
    {
      id: "02",
      title: "Regulated Compliance",
      desc: "Absolute alignment with international and national safety codes — HCIS, ATEX, NFPA, and EN frameworks — embedded at every design stage.",
      accentColor: "rgba(194, 32, 38, 0.08)",
      borderAccent: "rgba(194, 32, 38, 0.35)",
      accentHex: "#c22026",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: "03",
      title: "Multi-Disciplinary Scale",
      desc: "Unified in-house execution across structural, electrical, instrumentation, and functional safety engineering — no fragmented subcontracting.",
      accentColor: "rgba(30, 62, 143, 0.08)",
      borderAccent: "rgba(30, 62, 143, 0.35)",
      accentHex: "#1e3e8f",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ], []);

  const disciplines = useMemo(() => [
    "Project Management", "QA/QC Compliance", "Structural",
    "Instrumentation", "Electrical", "Fire & Gas",
    "HVAC", "Telecommunications", "HSE",
  ], []);

  return (
    <section
      id="why-choose-us"
      className="relative w-full min-h-screen py-32 max-md:py-20 flex items-center justify-center overflow-hidden bg-white font-sans"
    >
      {/* ── BACKGROUND SYSTEM — mirrors IndustrySolutions exactly ── */}
      <div className="pointer-events-none absolute inset-0 z-0">

        {/* Same blue depth glow — bottom-left, matches hub visual corner overlay */}
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(30,62,143,0.09) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Same amber/red accent glow — top-right */}
        <div
          className="absolute top-[-5%] right-[-5%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(180,83,9,0.07) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />

        {/* Dot grid — exact copy from TelemetryHubVisual */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(30,62,143,0.07) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />


      </div>

      {/* ── Main layout ── */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-8 max-sm:px-5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* ─── LEFT PANEL ─── */}
        <div
          className="lg:col-span-5 flex flex-col justify-between rounded-[28px] max-md:rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.85) 35%, rgba(238,242,247,0.8) 70%, rgba(232,237,245,0.75) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.7) inset, 0 4px 24px rgba(30,62,143,0.07), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {/* Top chromatic accent line — same as hub top rule */}
          <div
            className="w-full h-[2px] shrink-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, rgba(30,62,143,0.30) 40%, rgba(180,83,9,0.22) 70%, transparent 90%)",
            }}
          />

          {/* Inner color-grade overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 80% 8%, rgba(56,130,243,0.06) 0%, transparent 52%), radial-gradient(ellipse at 8% 92%, rgba(226,232,245,0.45) 0%, transparent 48%)",
              borderRadius: "28px",
            }}
          />

          <div className="flex flex-col flex-1 p-10 max-sm:p-7 space-y-8 relative z-10">

            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div
                className="w-[3px] h-6 rounded-full"
                style={{ background: "linear-gradient(180deg, rgba(30,62,143,0.8) 0%, rgba(180,83,9,0.6) 100%)" }}
              />
              <span
                className="text-[10px] font-mono font-black uppercase tracking-[0.26em]"
                style={{ color: "rgba(100,116,139,0.70)" }}
              >
                Why East Wind
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-16">
              <h2
                className="text-[2.5rem] max-md:text-[2.0rem] max-sm:text-[1.65rem] font-extrabold tracking-tight uppercase leading-[1.1] m-0"
                style={{ color: "#0f172a" }}
              >
                Built for<br />
                <span
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    backgroundImage: "linear-gradient(135deg, #1e3e8f 0%, #c22026 100%)",
                  }}
                >
                  High-Risk
                </span>
                <br />
                Environments
              </h2>

              <p
                className="text-[0.95rem] max-sm:text-sm leading-relaxed font-light m-0"
                style={{ color: "rgba(71,85,105,0.82)" }}
              >
                End-to-end safety engineering with absolute corporate and operational accountability — reducing total cost of ownership across the full project lifecycle.
              </p>
            </div>

            {/* Capability tags */}
            <div className="space-y-3 pt-6" style={{ borderTop: "1px solid rgba(30,62,143,0.07)" }}>
              <span
                className="block text-[9px] font-mono font-black uppercase tracking-[0.28em]"
                style={{ color: "rgba(100,116,139,0.80)" }}
              >
                Technical Disciplines
              </span>
              <div className="flex flex-wrap gap-2">
                {disciplines.map((dept) => (
                  <span
                    key={dept}
                    className="text-[8.5px] font-mono font-bold tracking-widest px-3 py-1.5 transition-all duration-300 cursor-default"
                    style={{
                      color: "rgba(71,85,105,0.68)",
                      background: "linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(226,232,245,0.50) 100%)",
                      border: "1px solid rgba(203,213,230,0.65)",
                      borderRadius: "7px",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#1e3e8f";
                      (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(30,62,143,0.08) 0%, rgba(30,62,143,0.15) 100%)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,62,143,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(71,85,105,0.68)";
                      (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(226,232,245,0.50) 100%)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(203,213,230,0.65)";
                    }}
                  >
                    {dept.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div
          className="lg:col-span-7 flex flex-col justify-center gap-4 rounded-[28px] max-md:rounded-2xl p-8 max-sm:p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(248,250,253,0.85) 30%, rgba(244,247,253,0.8) 65%, rgba(237,241,250,0.75) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.7) inset, 0 4px 24px rgba(30,62,143,0.07), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {/* Inner grading overlays — same as hub */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[28px]"
            style={{
              background:
                "radial-gradient(ellipse at 96% 4%, rgba(56,130,243,0.07) 0%, transparent 42%), radial-gradient(ellipse at 4% 96%, rgba(180,83,9,0.05) 0%, transparent 42%)",
            }}
          />

          {/* Top accent rule — same as hub */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[28px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, rgba(30,62,143,0.25) 40%, rgba(180,83,9,0.18) 70%, transparent 90%)",
            }}
          />

          {pillars.map((pillar) => {
            const isHovered = hoveredPillar === pillar.id;
            return (
              <div
                key={pillar.id}
                className="relative overflow-hidden flex items-start gap-6 max-sm:flex-col max-sm:gap-4 cursor-default"
                style={{
                  padding: "1.6rem 1.75rem",
                  borderRadius: "18px",
                  background: isHovered
                    ? "rgba(255, 255, 255, 0.95)"
                    : "linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(249,251,254,0.8) 40%, rgba(243,246,252,0.75) 75%, rgba(237,241,249,0.7) 100%)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: isHovered
                    ? `1px solid ${pillar.borderAccent}`
                    : "1px solid rgba(203,215,235,0.60)",
                  boxShadow: isHovered
                    ? `0 4px 16px rgba(30,62,143,0.10),
                       0 8px 32px rgba(30,62,143,0.07),
                       0 1px 3px rgba(0,0,0,0.05),
                       inset 0 1px 0 rgba(255,255,255,1)`
                    : `0 1px 2px rgba(30,62,143,0.04),
                       0 2px 8px rgba(30,62,143,0.03),
                       inset 0 1px 0 rgba(255,255,255,0.95)`,
                  transform: isHovered ? "translateY(-2px)" : "none",
                  transition:
                    "transform 280ms cubic-bezier(.22,.68,0,1.2), box-shadow 280ms ease, background 280ms ease, border-color 280ms ease",
                }}
                onMouseEnter={() => setHoveredPillar(pillar.id)}
                onMouseLeave={() => setHoveredPillar(null)}
              >
                {/* Top sheen — light refraction crown */}
                <div
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{
                    borderRadius: "18px 18px 0 0",
                    background:
                      "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.92) 38%, rgba(255,255,255,0.72) 68%, transparent 95%)",
                  }}
                />

                {/* Corner grade — same as solution cards */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-[18px]"
                  style={{
                    background:
                      "radial-gradient(ellipse at 100% 0%, rgba(226,234,250,0.40) 0%, transparent 52%)",
                  }}
                />

                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[18px]"
                  style={{
                    background: isHovered
                      ? `linear-gradient(180deg, ${pillar.accentHex} 0%, ${pillar.accentHex}40 100%)`
                      : "linear-gradient(180deg, rgba(203,213,230,0.35) 0%, rgba(203,213,230,0.12) 100%)",
                    boxShadow: isHovered ? `2px 0 14px ${pillar.accentHex}25` : "none",
                    transition: "background 280ms ease, box-shadow 280ms ease",
                  }}
                />

                {/* Directional accent wash on hover */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-[18px]"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(ellipse at 8% 50%, ${pillar.accentColor} 0%, transparent 62%)`,
                    transition: "opacity 280ms ease",
                  }}
                />

                {/* Icon box */}
                <div
                  className="shrink-0 w-12 h-12 flex items-center justify-center relative z-10"
                  style={{
                    borderRadius: "13px",
                    background: isHovered
                      ? "#ffffff"
                      : "linear-gradient(145deg, #ffffff 0%, #f0f4fb 100%)",
                    border: isHovered
                      ? `1px solid ${pillar.borderAccent}`
                      : "1px solid rgba(203,213,230,0.65)",
                    color: isHovered ? pillar.accentHex : "rgba(100,116,139,0.60)",
                    boxShadow: isHovered
                      ? `0 0 0 3px ${pillar.accentColor}, 0 1px 4px rgba(0,0,0,0.04)`
                      : "0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
                    transform: isHovered ? "scale(1.06)" : "scale(1)",
                    transition: "all 280ms cubic-bezier(.22,.68,0,1.2)",
                  }}
                >
                  {pillar.icon}
                </div>

                {/* Content */}
                <div className="flex-grow relative z-10 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className="text-[1.05rem] max-sm:text-base font-black uppercase tracking-tight m-0"
                      style={{
                        color: isHovered ? "#0f172a" : "#1e293b",
                        transition: "color 260ms ease",
                      }}
                    >
                      {pillar.title}
                    </h3>

                    {/* ID badge */}
                    <span
                      className="shrink-0 font-mono text-[9px] font-black px-2.5 py-1 rounded-full"
                      style={{
                        color: isHovered ? pillar.accentHex : "rgba(148,163,184,0.75)",
                        background: isHovered
                          ? pillar.accentColor
                          : "linear-gradient(145deg, #ffffff 0%, #f0f4fb 100%)",
                        border: isHovered
                          ? `1px solid ${pillar.borderAccent}`
                          : "1px solid rgba(203,213,230,0.65)",
                        letterSpacing: "0.15em",
                        transition: "all 260ms ease",
                      }}
                    >
                      {pillar.id}
                    </span>
                  </div>

                  <p
                    className="text-[0.875rem] max-sm:text-xs leading-relaxed font-light m-0"
                    style={{
                      color: isHovered ? "rgba(15,23,42,0.85)" : "rgba(71,85,105,0.75)",
                      transition: "color 260ms ease",
                    }}
                  >
                    {pillar.desc}
                  </p>

                  {/* Sweep underline */}
                  <div
                    className="h-[1.5px] mt-3 origin-left"
                    style={{
                      background: `linear-gradient(90deg, ${pillar.accentHex}72 0%, ${pillar.accentHex}18 60%, transparent 100%)`,
                      transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                      width: "55%",
                      transition: "transform 340ms cubic-bezier(.22,.68,0,1.1)",
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Bottom accent rule — same as hub */}
          <div
            className="w-full h-[1px] mt-1 relative z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(30,62,143,0.22) 30%, rgba(180,83,9,0.15) 65%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}