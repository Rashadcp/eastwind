"use client";

import { useState } from "react";
import InteractivePortfolioSection, { PortfolioItem } from "./InteractivePortfolioSection";

interface IndustryItem extends PortfolioItem {
  num: string;
  riskFactor: string;
  accent: string;
  icon: React.ReactNode;
}

const industries: IndustryItem[] = [
  {
    id: "oil-gas",
    name: "Oil & Gas",
    category: "Intelligent Hydrocarbon Operations",
    imageTone: "blue",
    overview: [
      "From upstream wellheads to downstream refineries, we deploy intrinsically safe instrumentation, wireless gas loops, and predictive AI analytics to prevent catastrophes and ensure continuous uptime."
    ],
    features: [
      "MIMES Wireless Gas Telemetry",
      "Tridiagonal AI Anomaly Forecaster",
      "Pepperl+Fuchs Ex-Mobility Devices"
    ],
    applications: ["CLASSIFICATION: ZONE 0 HAZARDS"],
    benefits: [
      {
        value: "0.8s",
        label: "Hazard Propagation Detection Latency"
      }
    ],
    num: "01",
    riskFactor: "CLASSIFICATION: ZONE 0 HAZARDS",
    accent: "#1e3e8f",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
      </svg>
    )
  },
  {
    id: "offshore",
    name: "Offshore Operations",
    category: "Harsh Deepwater Infrastructure Resilience",
    imageTone: "orange",
    overview: [
      "Offshore platforms face extreme salt atmospheres and remote operating conditions. We provide robust wireless mesh systems for structural integrity and high-expansion foam systems for rapid deck fire extinguishing."
    ],
    features: [
      "One Seven Deck CAFS Systems",
      "TGR Acoustic Emission Sensors",
      "Xshielder Industrial Cybersecurity"
    ],
    applications: ["CLASSIFICATION: EXPLOSIVE DECK HAZARDS"],
    benefits: [
      {
        value: "99.85%",
        label: "Remote Telemetry Link Uptime"
      }
    ],
    num: "02",
    riskFactor: "CLASSIFICATION: EXPLOSIVE DECK HAZARDS",
    accent: "#c2410c",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20M6 20v-8h12v8M12 12V4h6v8M4 20l4-4M20 20l-4-4" />
      </svg>
    )
  },
  {
    id: "utilities",
    name: "Utilities & Power",
    category: "Critical Grid Asset Safeguarding",
    imageTone: "blue",
    overview: [
      "Securing electrical substations, gas pipelines, and water treatment systems. We deploy structural integrity modules, distributed cyber-physical safety systems, and automated thermal monitoring."
    ],
    features: [
      "E-House Blast-Rated Substations",
      "Thermal Anomaly Infrared Cameras",
      "MIMES Wireless Substation Network"
    ],
    applications: ["CLASSIFICATION: GRID INTERDEPENDENCY"],
    benefits: [
      {
        value: "0.2s",
        label: "Automatic Transformer Trip-Out Isolation"
      }
    ],
    num: "03",
    riskFactor: "CLASSIFICATION: GRID INTERDEPENDENCY",
    accent: "#1e3e8f",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  },
  {
    id: "defense",
    name: "Defense & Border Security",
    category: "National Level Asset Hardening",
    imageTone: "orange",
    overview: [
      "Providing high-grade perimeter defense, secure wireless telemetry backbones, and blast-resistant modular security offices that adhere to Saudi Military Security Standards."
    ],
    features: [
      "HCIS Approved Fencing Integrations",
      "Blast-Resistant Modular Guard Shelters",
      "Xshielder Tactical Cyber Defense"
    ],
    applications: ["CLASSIFICATION: HIGH-GRADE SECURITY"],
    benefits: [
      {
        value: "100%",
        label: "HCIS SEC-02 Compliance Certification"
      }
    ],
    num: "04",
    riskFactor: "CLASSIFICATION: HIGH-GRADE SECURITY",
    accent: "#c2410c",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  },
  {
    id: "civil-defense",
    name: "Civil Defense",
    category: "Metropolitan Safety Infrastructure",
    imageTone: "red",
    overview: [
      "Equipping fire departments and municipal services with state-of-the-art emergency command systems, high-efficiency water-saving CAFS vehicles, and smart responder telemetry."
    ],
    features: [
      "Rosenbauer Specialized Cabins",
      "One Seven CAFS Tactical Systems",
      "Intrinsically Safe Crew Telemetry"
    ],
    applications: ["CLASSIFICATION: URBAN HAZARD MITIGATION"],
    benefits: [
      {
        value: "-80%",
        label: "Water Usage Reduction in Extinguishing"
      }
    ],
    num: "05",
    riskFactor: "CLASSIFICATION: URBAN HAZARD MITIGATION",
    accent: "#991b1b",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    )
  },
  {
    id: "smart-facilities",
    name: "Smart Industrial Facilities",
    category: "Automated Facility Health & Security",
    imageTone: "red",
    overview: [
      "Deploying enterprise digital twins, automated AI permit-to-work checklists, and wireless acoustic leak sensors inside modern petrochemical plants and factories to maximize safety."
    ],
    features: [
      "Tridiagonal Machine Learning Diagnostics",
      "Nardi Compressed Gases Systems",
      "Smart Digital Permit-to-Work Tracking"
    ],
    applications: ["CLASSIFICATION: PROCESS RELIABILITY"],
    benefits: [
      {
        value: "42%",
        label: "Preventive Maintenance Cost Reduction"
      }
    ],
    num: "06",
    riskFactor: "CLASSIFICATION: PROCESS RELIABILITY",
    accent: "#991b1b",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 21H2V3l7 4v3l7-4v3l6-4v18z M17 14h2v2h-2z M12 14h2v2h-2z M7 14h2v2h-2z" />
      </svg>
    )
  }
];

function TelemetryHubVisual({
  activeId,
  setActiveId,
  items,
}: {
  activeId: string;
  setActiveId: (id: string) => void;
  items: PortfolioItem[];
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const nodeCoords = [
    { x: 520, y: 280, textX: 550, textY: 285, textAnchor: "start" },
    { x: 410, y: 393, textX: 435, textY: 415, textAnchor: "start" },
    { x: 190, y: 393, textX: 165, textY: 415, textAnchor: "end" },
    { x: 80, y: 280, textX: 50, textY: 285, textAnchor: "end" },
    { x: 190, y: 167, textX: 165, textY: 155, textAnchor: "end" },
    { x: 410, y: 167, textX: 435, textY: 155, textAnchor: "start" }
  ] as const;

  return (
    <div className="relative w-full h-full flex justify-center items-center bg-black/[0.01] rounded-2xl p-3 border border-dashed border-black/5 min-h-[200px]">
      <svg
        viewBox="0 100 600 360"
        className="w-full max-w-[500px] h-auto overflow-visible"
      >
        <defs>
          <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </radialGradient>
        </defs>

        <line x1="300" y1="100" x2="300" y2="460" stroke="rgba(2, 132, 199, 0.04)" strokeWidth="1" strokeDasharray="3 6" />
        <line x1="50" y1="280" x2="550" y2="280" stroke="rgba(2, 132, 199, 0.04)" strokeWidth="1" strokeDasharray="3 6" />

        <ellipse cx="300" cy="280" rx="220" ry="130" stroke="rgba(2, 132, 199, 0.08)" fill="none" strokeWidth="1.5" strokeDasharray="4 6" />
        <ellipse cx="300" cy="280" rx="150" ry="90" stroke="rgba(2, 132, 199, 0.04)" fill="none" strokeWidth="1" />
        <ellipse cx="300" cy="280" rx="260" ry="155" stroke="rgba(2, 132, 199, 0.03)" fill="none" strokeWidth="1" />

        <circle r="4" fill="var(--color-accent-blue)" opacity="0.4" className="animate-pulse-opacity">
          <animateMotion dur="16s" repeatCount="indefinite" path="M 80,280 A 220,130 0 1,0 520,280 A 220,130 0 1,0 80,280" />
        </circle>
        <circle r="3" fill="var(--color-accent-orange)" opacity="0.4" className="animate-pulse-opacity">
          <animateMotion dur="24s" repeatCount="indefinite" begin="-8s" path="M 80,280 A 220,130 0 1,0 520,280 A 220,130 0 1,0 80,280" />
        </circle>

        <circle cx="130" cy="180" r="1.5" fill="var(--color-accent-blue)" opacity="0.3" className="animate-pulse-opacity" />
        <circle cx="480" cy="180" r="1.5" fill="var(--color-accent-orange)" opacity="0.3" className="animate-pulse-opacity" />
        <circle cx="100" cy="380" r="1.5" fill="var(--color-accent-red)" opacity="0.3" className="animate-pulse-opacity" />
        <circle cx="500" cy="370" r="1.5" fill="var(--color-accent-blue)" opacity="0.3" className="animate-pulse-opacity" />

        {items.map((indItem, idx) => {
          const ind = indItem as IndustryItem;
          const isHovered = hoveredId === ind.id;
          const isActive = activeId === ind.id;
          const isHighlighted = isHovered || isActive;
          const coords = nodeCoords[idx];

          return (
            <line
              key={`line-${ind.id}`}
              x1="300"
              y1="280"
              x2={coords.x}
              y2={coords.y}
              stroke={isHighlighted ? ind.accent : "rgba(0, 0, 0, 0.08)"}
              strokeWidth={isHighlighted ? "2" : "1"}
              strokeDasharray={isHighlighted ? "6 6" : "none"}
              className={`transition-all duration-300 ${isHighlighted ? "animate-line-flow" : ""}`}
            />
          );
        })}

        <g className="cursor-default">
          <circle
            cx="300"
            cy="280"
            r="62"
            fill="none"
            stroke="var(--color-accent-blue)"
            strokeWidth="1"
            opacity="0.2"
            className="origin-[300px_280px] animate-hub-pulse"
          />
          <circle cx="300" cy="280" r="54" fill="#ffffff" stroke="rgba(2, 132, 199, 0.12)" strokeWidth="1" />
          <circle
            cx="300"
            cy="280"
            r="48"
            fill="url(#hubGradient)"
            stroke="var(--color-accent-blue)"
            strokeWidth="2.5"
            style={{
              filter: "drop-shadow(0 6px 16px rgba(2, 132, 199, 0.15))"
            }}
          />
          <text x="300" y="271" textAnchor="middle" className="font-mono text-[0.58rem] font-extrabold fill-[#0f172a] tracking-widest">INDUSTRIAL</text>
          <text x="300" y="283" textAnchor="middle" className="font-mono text-[0.58rem] font-extrabold fill-[#0f172a] tracking-widest">INTELLIGENCE</text>
          <text x="300" y="296" textAnchor="middle" className="font-mono text-[0.58rem] font-extrabold fill-[var(--color-accent-blue)] tracking-widest">PLATFORM</text>
        </g>

        {items.map((indItem, idx) => {
          const ind = indItem as IndustryItem;
          const isHovered = hoveredId === ind.id;
          const isActive = activeId === ind.id;
          const isHighlighted = isHovered || isActive;
          const coords = nodeCoords[idx];

          return (
            <g
              key={`node-${ind.id}`}
              onClick={() => setActiveId(ind.id)}
              onMouseEnter={() => setHoveredId(ind.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer"
            >
              {isHighlighted && (
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="28"
                  fill="none"
                  stroke={ind.accent}
                  strokeWidth="1.5"
                  className="animate-node-pulse"
                  style={{
                    transformOrigin: `${coords.x}px ${coords.y}px`
                  }}
                />
              )}

              <circle
                cx={coords.x}
                cy={coords.y}
                r="20"
                fill={isHighlighted ? "#ffffff" : "var(--color-bg-surface-elevated)"}
                stroke={isHighlighted ? ind.accent : "var(--color-border-color)"}
                strokeWidth={isHighlighted ? "2.5" : "1.5"}
                style={{
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  filter: isHighlighted ? `drop-shadow(0 4px 12px ${ind.accent}33)` : "none"
                }}
              />

              <g
                transform={`translate(${coords.x - 9}, ${coords.y - 9})`}
                className="transition-colors duration-300"
                style={{
                  color: isHighlighted ? ind.accent : "var(--color-text-secondary)"
                }}
              >
                {ind.icon}
              </g>

              <text
                x={coords.textX}
                y={coords.textY}
                textAnchor={coords.textAnchor}
                className={`font-sans text-[0.75rem] transition-all duration-300 tracking-tight ${
                  isHighlighted ? "font-bold fill-slate-900" : "font-semibold fill-[#64748b]"
                }`}
              >
                {ind.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function IndustrySolutions() {
  const handleRequestQuote = (item: PortfolioItem) => {
    const contactSection = document.getElementById("contact-us");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      const footerContact = document.querySelector("footer");
      if (footerContact) {
        footerContact.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleTalkToExpert = (item: PortfolioItem) => {
    const contactSection = document.getElementById("contact-us");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      const footerContact = document.querySelector("footer");
      if (footerContact) {
        footerContact.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <InteractivePortfolioSection
      sectionId="solutions"
      sectionLabel="Sector Specific Operations"
      sectionTitle="Solutions by Industry"
      sectionDesc="We adapt our core capabilities to the specific compliance and threat profiles of the Middle East's primary infrastructure sectors."
      items={industries}
      backgroundColor="#ffffff"
      cta1Label="Request Consultation"
      cta1OnClick={handleRequestQuote}
      cta2Label="Speak to Specialist"
      cta2OnClick={handleTalkToExpert}
      renderVisual={(item, tone, state) => (
        <TelemetryHubVisual
          activeId={state.activeId}
          setActiveId={state.setActiveId}
          items={state.items}
        />
      )}
      hideSidebar={true}
      isFullHeight={false}
    />
  );
}
