// src/app/applications/[id]/page.tsx

import Link from "next/link";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const dynamicParams = true;

interface ApplicationData {
  title: string;
  category: string;
  tagline: string;
  overview: string;
  accentHex: string;
  capabilities: { title: string; body: string }[];
  useCases: string[];
  metrics: { value: string; label: string }[];
  relatedSolutions: { name: string; href: string }[];
}

export const applicationsDb: Record<string, ApplicationData> = {
  "industry-digitalisation": {
    title: "Industry Digitalisation",
    category: "Digital Transformation",
    tagline: "Transitioning conventional industrial setups into data-driven, connected facilities.",
    overview:
      "East Wind Safety Arabia coordinates directly with leading global technology partners to transform traditional industrial processing spaces into highly optimized, data-integrated environments. By securely pairing physics-informed computer modeling algorithms with high-fidelity telemetry collection points and automated logic configurations, we unlock deep real-time operational safety tracking capabilities. This enables site operators and engineers to rapidly intercept potential plant stress signs long before an emergency shutdown loop trips production.",
    accentHex: "#1e3e8f",
    capabilities: [
      {
        title: "DCS / SCADA Process Bridging",
        body: "Building reliable communications links to overlay existing Distributed Control Systems with modern secure protocols, enabling continuous data historians logging without modifying legacy field wiring infrastructure.",
      },
      {
        title: "Physics-Informed Plant Modeling",
        body: "Developing analytical simulation setups that map process safety dependencies against physical boundary parameters, giving technical leads the capacity to simulate relief paths and test logic changes safely.",
      },
      {
        title: "Edge Computational Infrastructure",
        body: "Integrating rugged high-noise immune processing blocks at the physical site node level to clean and evaluate high-frequency parameter loops locally, preserving centralized network bandwidth.",
      },
      {
        title: "Digital Permit-to-Work Tracking",
        body: "Transitioning cumbersome manual site permit systems into cryptographic, location-verified operational safety workflows that provide immutable audit logs and zero clearance processing delays.",
      },
    ],
    useCases: [
      "Real-time continuous alarm management mapping inside volatile refinery control centers",
      "Distributed acoustic stress profiling across massive high-pressure transfer pipelines",
      "Proactive operational loop scheduling synchronized directly with active rotating asset health",
      "Centralized technical monitoring overlays managing geographically dispersed processing zones",
      "Automated energy utility load factor profiling and electrical transient event tracking",
    ],
    metrics: [
      { value: "40%", label: "Average drop in unscheduled technical downtime events" },
      { value: "3×", label: "Accelerated root-cause fault identification velocity" },
      { value: "99.9%", label: "Continuous data stream availability at edge node bridges" },
    ],
    relatedSolutions: [
      { name: "MIMES Wireless Networks", href: "/solutions/mimes" },
      { name: "Tridiagonal AI Platform", href: "/solutions/tridiagonal" },
      { name: "Test Equipment Software", href: "/solutions/test-equipment-workshop-software" },
    ],
  },

  "wireless-data-acquisition": {
    title: "Wireless Data Acquisition",
    category: "Intrinsically Safe Telemetry",
    tagline: "Intrinsically safe telemetry configurations purpose-built for hazardous industrial environments.",
    overview:
      "Traditional physical instrumentation loops requiring long copper cable trenches are economically prohibitive and represent a serious propagation vector inside explosive atmospheres. East Wind deploys self-configuring, low-power industrial wireless mesh networks that entirely bypass old civil cabling needs. We accelerate plant execution loops by months while capturing accurate, high-fidelity data parameters out of Zone 0 and Zone 1 process cells.",
    accentHex: "#1e3e8f",
    capabilities: [
      {
        title: "Zone 0 / Zone 1 Certified Rigs",
        body: "Leveraging field telemetry nodes carrying comprehensive international explosion-proof safety validations, guaranteeing completely safe performance amidst flammable hydrocarbon gas properties.",
      },
      {
        title: "Self-Healing Sensor Mesh Topologies",
        body: "Utilizing smart communication architectures that instantly rewrite data signal vectors if individual nodes get obstructed by shifting equipment layouts or local facility structures.",
      },
      {
        title: "Decade Battery Operational Life",
        body: "Integrating custom instrumentation loops engineered with micro-power consumption components to extend sensor terminal changes up to 10 years, drastically cutting maintenance workloads.",
      },
      {
        title: "Open Interoperability Protocol Bridging",
        body: "Full operational compatibility with major low-frequency industrial wireless layouts including ISA100.11a, WirelessHART, and custom gateways to deliver fluid SCADA data transfers.",
      },
    ],
    useCases: [
      "Combustible gas release detection arrays integrated across offshore production decks",
      "Continuous level monitoring across vast, un-trenched petrochemical tank farm clusters",
      "Desert pipeline corridor pressure and temperature parameter capture loop tracking",
      "Spurious variable distortion tracking loops on remote high-voltage rotating machinery",
      "Statutory continuous emission output auditing from stacks utilizing wireless probe links.",
    ],
    metrics: [
      { value: "99.85%", label: "Pre-validated network uptime across dense processing fields" },
      { value: "0 meters", label: "Excavation and line trenching infrastructure needed for deployment" },
      { value: "−70%", label: "Reduction in field deployment timelines compared to wired setups" },
    ],
    relatedSolutions: [
      { name: "MIMES Wireless Networks", href: "/solutions/mimes" },
      { name: "Gas Detection Systems", href: "/solutions/gas-detection" },
      { name: "Flow Metering Skids", href: "/solutions/flow-metering-skids" },
    ],
  },

  "ai-predictive-analytics": {
    title: "AI Predictive Analytics",
    category: "Machine Learning & Diagnostics",
    tagline: "Physics-Informed Neural Networks diagnosing equipment degradation parameters before asset failure propagation.",
    overview:
      "Relying on old reactive asset maintenance regimes subjects major production fields to enormous financial loss risks and safety non-conformance parameters. East Wind integrates physics-informed machine learning platforms that ingest continuous high-frequency vibration, temperature, and process parameters to calculate each asset's Remaining Useful Life (RUL) in real-time — allowing maintenance teams to intervene hours or days before a critical failure propagates.",
    accentHex: "#1e3e8f",
    capabilities: [
      {
        title: "Physics-Informed Neural Net (PINN) Code",
        body: "We incorporate deep engineering mathematical laws — thermodynamic baselines and physical dynamics equations — directly into the network training paths, enabling flawless precision.",
      },
      {
        title: "Calculated Remaining Useful Life Counting",
        body: "Processing field data continuously to display a real-time countdown variable on operator dashboards, allowing maintenance groups to securely schedule replacement downtime.",
      },
      {
        title: "Root-Cause Failure Mode Isolation",
        body: "Advanced signal processing algorithms categorize precise micro-anomalies — isolating impeller cavitations from bearing spalls to present immediate corrective action directives.",
      },
      {
        title: "Native Process Historian Integration",
        body: "Out-of-the-box data bridging links for existing plant repositories (such as OSIsoft PI and Aveva systems) to leverage your historical logging database investment safely.",
      },
    ],
    useCases: [
      "Continuous compressor and multi-stage turbine fleet health evaluation tracking",
      "High-pressure water injection pump cavitation warning flag generation",
      "Petrochemical heat exchanger thermal fouling rate projection audits",
      "High-voltage induction motor winding breakdown diagnostics profiling",
      "Centrifugal processing loop vibration axis alignment monitoring loops.",
    ],
    metrics: [
      { value: "42%", label: "Average savings achieved across critical asset repair overheads" },
      { value: "< 50ms", label: "Real-time stream parameter anomaly checking response latency" },
      { value: "87%", label: "Accurate predictive identification of critical failure vectors" },
    ],
    relatedSolutions: [
      { name: "Tridiagonal AI Analytics", href: "/solutions/tridiagonal" },
      { name: "TGR Acoustic Emission Sensors", href: "/solutions/tgr" },
      { name: "MIMES Sensor Networks", href: "/solutions/mimes" },
    ],
  },

  "fire-rescue-systems": {
    title: "Fire & Rescue Systems",
    category: "Emergency Response Infrastructure",
    tagline: "High-performance tactical hardware modules engineered for high-consequence industrial incident mitigation.",
    overview:
      "Mitigating critical hydrocarbon fire events or chemical spills requires hardware architectures planned for absolute uptime under intense radiant heat profiles. East Wind engineers, customizes, and integrates extreme-duty emergency apparatus, including rapid intervention trucks, high-volume foam concentrate skids, and CBRN containment platforms. Every layout carries complete certification matching Saudi Civil Defense mandates and geographic infrastructure directives.",
    accentHex: "#c22026",
    capabilities: [
      {
        title: "Patented One Seven Compressed Air Foam Systems",
        body: "Integrating specialized CAFS loops that expand water suppression surface areas exponentially, smothering chemical tank blazes while slashing asset water utility consumption by 90%.",
      },
      {
        title: "Heavy-Duty Extrication Tool Sets",
        body: "Deploying premium hydraulic rescue cutter and spreader manifolds calibrated to extract operators quickly from heavy process infrastructure or compromised transportation structures.",
      },
      {
        title: "Hazmat & CBRN Strategic Mitigation",
        body: "Engineering sealed overpressure response configurations equipped with advanced toxic chemical filtration blocks, decontamination showers, and radiation telemetry systems.",
      },
      {
        title: "Incident Command Center Telemetry",
        body: "Linking tactical asset locations, drone thermal imaging feeds, and emergency gateway channels into a single operational interface screen to provide full incident overview parameters.",
      },
    ],
    useCases: [
      "Hydrocarbon storage tank rim-seal fire suppression and cooling operations",
      "Toxic vapor containment misting and dangerous chemical product washdown tracking",
      "Municipal civil defense heavy emergency response fleet capability upgrading",
      "High-risk industrial refining sector emergency response simulations and drill validation",
      "Airport ARFF (Aircraft Rescue and Firefighting) operations.",
    ],
    metrics: [
      { value: "−90%", label: "Suppression water supply footprint reduction via high-energy CAFS" },
      { value: "< 90s", label: "Full hardware structural field setup and stream deployment speed" },
      { value: "100%", label: "Compliance documentation indexing with regional civil defense rules" },
    ],
    relatedSolutions: [
      { name: "One Seven CAFS Systems", href: "/solutions/oneseven" },
      { name: "Rescue Tool Kit", href: "/solutions/rescue-tool-kit" },
      { name: "Thermal Imaging Cameras", href: "/solutions/thermal-imaging-camera" },
    ],
  },

  "explosion-proof-mobility": {
    title: "Explosion-Proof Mobility",
    category: "Zone 1 Mobile Digitization",
    tagline: "ATEX Zone 1 validated intrinsically safe communication terminals for explosive atmospheres.",
    overview:
      "Extending smart operational connectivity into volatile atmospheric zones calls for robust hardware layout validation matching your fixed instrumentation logic. East Wind supplies, provisions, and rolls out ATEX Zone 1 and IECEx certified industrial handsets, smart terminals, and data collection options. Fully insulated and managed via secure enterprise MDM frameworks, these terminals let field operators execute check routines safely.",
    accentHex: "#b45309",
    capabilities: [
      {
        title: "Certified Zone 1 / Zone 21 Design",
        body: "Every handheld device carries rigid third-party industrial explosion safety validation, ensuring no ignition sparks can propagate inside flammable dust or processing vapor concentrations.",
      },
      {
        title: "Enterprise Knox Policy Management",
        body: "Leveraging remote configuration setups to lock terminals to approved work tasks, force asset compliance rules, and wipe lost field nodes instantly to protect data loops.",
      },
      {
        title: "Gloved Capacitive Screen Tech",
        body: "Outfitting fields with rugged Gorilla Glass screens readable in extreme desert sun parameters, specifically calibrated to accept inputs from thick industrial protective gloves.",
      },
      {
        title: "Live Automated Maintenance Sync",
        body: "Linking terminal check programs directly into the main enterprise database over local secure wireless networks, ensuring immediate status updates from the process floor.",
      },
    ],
    useCases: [
      "Operator validation rounds and equipment log entries completed inside classified fields",
      "Barcode scanning validation across refinery valves and chemical tank manifests",
      "High-resolution remote video inspections and live engineering consultation calls from hazardous areas",
      "Automated facility safety check-ins and emergency localization during site hazard alerts",
      "Digital permit sign-off and authorization routines updated on-site at the instrumentation node.",
    ],
    metrics: [
      { value: "Zone 1", label: "Certified ATEX / IECEx atmospheric safety class index" },
      { value: "−60%", label: "Permit log submission time vs paper processing methods" },
      { value: "IP68", label: "Validated ingress protection against dust and high pressure water" },
    ],
    relatedSolutions: [
      { name: "Explosion-Proof Mobility Devices", href: "/solutions/explosion-proof-mobility" },
      { name: "Xshielder Cybersecurity", href: "/solutions/xshielder" },
      { name: "Test Equipment Software", href: "/solutions/test-equipment-workshop-software" },
    ],
  },

  "breathing-protection": {
    title: "Breathing & Asset Protection",
    category: "Personnel Safety Systems",
    tagline: "High-pressure continuous respiratory delivery networks keeping facility operators safe.",
    overview:
      "In toxic, oxygen-deficient, or smoke-filled industrial environments, crew survival depends on reliable, instantly accessible breathing air systems. East Wind deploys certified cascade breathing air stations, SCBA units, airline systems, and emergency escape networks — all supported by Nardi high-pressure compressor systems and verified to EN 12021 / NFPA 1989 breathable air standards. We also provide chemical and thermal protective suit inventories for CBRN and high-temperature operations.",
    accentHex: "#1e3e8f",
    capabilities: [
      {
        title: "High-Pressure Cylinder Cascades",
        body: "Assembling structural air cylinder banks that store large reserves of breathable safety air, planned to charge field lines and refill breathing tanks concurrently during long repairs.",
      },
      {
        title: "Positive-Pressure SCBA Harnesses",
        body: "Outfitting operations with advanced full-face respiratory setups carrying smart alerting devices, quick-connect hoses, and specialized face masks to guarantee complete isolation from toxic atmospheres.",
      },
      {
        title: "Nardi High-Output Compressors",
        body: "Integrating robust reciprocating air compressors featuring active multi-stage purification filters to remove moisture and trace particles, providing breathable air right at your Dammam facility.",
      },
      {
        title: "Gas-Tight Chemical Suit Inventories",
        body: "Maintaining robust stocks of multi-layered protective suits, flash-fire barriers, and tactical emergency escape hoods built to insulate crews completely from aggressive fluid splashes.",
      },
    ],
    useCases: [
      "Confined space vessel entry safety coverage during chemical processing turnarounds",
      "Emergency site rescue squad deployment inside sudden toxic H2S release clouds",
      "Fixed temporary refuge chamber (TGR) continuous life support air system charging",
      "Offshore exploration rig emergency air main line loop configuration planning",
      "High-temperature boiler interior maintenance crew environmental protection coverage.",
    ],
    metrics: [
      { value: "EN 12021", label: "Breathable compressed air purity standard compliance verified" },
      { value: "350 Bar", label: "Maximum working pressure output for high-capacity cascade lines" },
      { value: "60 min", label: "Maximum air duration capacity in extended safety rescue profiles" },
    ],
    relatedSolutions: [
      { name: "Breathing Air Cascade Systems", href: "/solutions/breathing-air-cascade-systems" },
      { name: "Self-Contained Breathing Apparatus", href: "/solutions/self-contained-breathing-apparatus" },
      { name: "Chemical Protective Suits", href: "/solutions/chemical-protective-suits" },
    ],
  },
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/applications`);
    if (!res.ok) return [];
    const list = await res.json();
    return list.map((app: any) => ({
      id: app.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for applications:", error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  let data: ApplicationData | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/applications/${id}`, {
      cache: "no-store"
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error(`Failed to fetch application ${id}:`, error);
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-white text-slate-900 font-mono text-xs grid place-items-center">
        Application system node parameter empty // Config route error.
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className={`${poppins.className} bg-white text-slate-800 antialiased flex flex-col w-full overflow-x-hidden`}>

        {/* Hero Row */}
        <div className="w-full bg-slate-950 pt-[200px] pb-24 flex items-center border-b border-slate-900 relative">
          <img
            src="/application.png"
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none brightness-[0.65] scale-101"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c14]/90 via-[#080c14]/65 to-transparent z-10" />
          <div className="industrial-grid absolute inset-0 opacity-[0.02] pointer-events-none z-10" />
          <div className="relative max-w-[1240px] w-full mx-auto px-6 z-20">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-white tracking-tight leading-tight mb-4 m-0">
              {data.title}
            </h1>
            <p className="text-lg text-white/90 font-medium leading-relaxed max-w-2xl m-0">
              {data.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5 mt-10 pt-10 border-t border-white/10">
              {data.metrics.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <span className="text-3xl font-extrabold leading-none" style={{ color: data.accentHex }}>
                    {m.value}
                  </span>
                  <span className="text-xs text-white/60 font-medium mt-1 max-w-[160px] leading-snug">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Row */}
        <div className="w-full bg-white pt-20 pb-8">
          <div className="max-w-[1240px] mx-auto px-6">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] block mb-3" style={{ color: data.accentHex }}>
              Overview
            </span>
            <p className="text-[1.05rem] text-slate-650 leading-relaxed font-normal max-w-4xl m-0">
              {data.overview}
            </p>
          </div>
        </div>

        {/* Scope Row */}
        <div className="w-full bg-white py-12">
          <div className="max-w-[1240px] mx-auto px-6">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] block mb-6" style={{ color: data.accentHex }}>
              Core Capabilities
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.capabilities.map((cap, i) => (
                <div
                  key={cap.title}
                  className="relative p-8 rounded-2xl border border-slate-200/80 bg-white overflow-hidden"
                  style={{
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                    style={{ background: `linear-gradient(180deg, ${data.accentHex} 0%, ${data.accentHex}44 100%)` }}
                  />
                  <span className="text-[0.65rem] font-mono font-bold tracking-widest block mb-2" style={{ color: `${data.accentHex}80` }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.05rem] font-bold text-slate-900 mb-2 leading-snug">{cap.title}</h3>
                  <p className="text-[0.88rem] text-slate-500 leading-relaxed font-light m-0">{cap.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Use Cases Row */}
        <div className="w-full bg-white py-12">
          <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] block mb-5" style={{ color: data.accentHex }}>
                Operational Use Cases
              </span>
              <ul className="flex flex-col gap-3.5 pl-0 list-none m-0">
                {data.useCases.map((uc) => (
                  <li key={uc} className="flex items-start gap-3 text-[0.92rem] text-slate-650 leading-snug font-light">
                    <span className="mt-[5px] w-4 h-4 rounded-full flex-shrink-0 grid place-items-center" style={{ backgroundColor: `${data.accentHex}15` }}>
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={data.accentHex} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] block mb-5" style={{ color: data.accentHex }}>
                Related Solutions
              </span>
              <div className="flex flex-col gap-3.5">
                {data.relatedSolutions.map((sol) => (
                  <Link
                    key={sol.name}
                    href={sol.href}
                    className="group flex items-center justify-between gap-3 px-6 py-4.5 rounded-xl border border-slate-200/80 bg-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ color: "inherit" }}
                  >
                    <span className="text-[0.92rem] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                      {sol.name}
                    </span>
                    <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-200" style={{ borderColor: `${data.accentHex}30`, backgroundColor: `${data.accentHex}08`, color: data.accentHex }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Integration Row — Returned to pure white setup to seamlessly dock into the light translucent footer bounds */}
        <div className="w-full bg-white pt-12 pb-24">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="relative overflow-hidden rounded-2xl p-8 md:p-12" style={{ background: `linear-gradient(135deg, #0f172a 0%, ${data.accentHex}cc 100%)` }}>
              <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight leading-snug mb-1">
                    Ready to deploy {data.title}?
                  </h2>
                  <p className="text-white/60 text-sm font-light m-0">
                    Our engineering team will configure a solution tailored to your site&apos;s compliance and operational requirements.
                  </p>
                </div>
                <Link
                  href="/enquire"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[0.8rem] font-bold uppercase tracking-wider no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex-shrink-0"
                  style={{ color: data.accentHex }}
                >
                  Request Consultation
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}