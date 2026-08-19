// src/app/services/[id]/page.tsx

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

interface ServiceData {
  title: string;
  category: string;
  tagline: string;
  overview: string;
  accentHex: string;
  capabilities: { title: string; body: string }[];
  deliverables: string[];
  metrics: { value: string; label: string }[];
  relatedSolutions: { name: string; href: string }[];
}

export const servicesDb: Record<string, ServiceData> = {
  "explosion-proof-design": {
    title: "Explosion-Proof System Design",
    category: "ATEX / IECEx Engineering",
    tagline: "ATEX and IECEx compliant layout engineering for classified area electrical and instrumentation assemblies.",
    overview:
      "East Wind's specialized engineering team designs custom explosion-proof electrical assemblies, process analyzer enclosures, telemetry system housings, and junction boxes configured for Class I Division 1 and ATEX Zone 1 / Zone 2 classified areas. Every layout is developed in strict accordance with IEC 60079 installation standards, NEC Article 505 directives, and regional engineering specifications. We deliver complete documentation packages prepared for third-party regulatory audits, High Commission for Industrial Security (HCIS) submissions, and certified civil safety reviews.",
    accentHex: "#1e3e8f",
    capabilities: [
      {
        title: "Hazardous Area Classification",
        body: "We establish detailed area classification drawings, zone boundary layout maps, and precise gas group risk assessments aligned with IEC 60079-10-1 parameters, forming the baseline framework for all field equipment integration scopes.",
      },
      {
        title: "Ex Panel & Enclosure Custom Engineering",
        body: "Custom engineering solutions for Ex-d (flameproof), Ex-e (increased safety), and Ex-p (purged/pressurised) control modules. We optimize physical dimensions and ambient heat dissipation properties to maintain structural safety in high-temperature desert climates.",
      },
      {
        title: "Intrinsically Safe Loop Architectures",
        body: "Intrinsically safe instrument loop layout designs utilizing comprehensive Entity Concept calculations. We handle optimal galvanic isolator matching, safety barrier selection, and cable degradation factoring to meet strict IEC 60079-14 criteria.",
      },
      {
        title: "Compliance Dossier Compilation",
        body: "Assembling verified equipment schedules, structural blast calculations, independent testing records, and statutory directives conformance statements required to secure rapid operational clearance.",
      },
    ],
    deliverables: [
      "Hazardous area zone maps and gas/dust classification layout profiles",
      "Certified Ex equipment schedules with validated safety integrity indexes",
      "Detailed 3D panel layout designs and manufacturing specifications",
      "Instrument loop diagrams and intrinsic safety parameter verification dossiers",
      "Comprehensive IEC 60079-14 structural verification field dossiers",
      "ATEX and IECEx compliance declarations ready for statutory validation",
    ],
    metrics: [
      { value: "100%", label: "ATEX / IECEx regulatory approval clearance rate" },
      { value: "IEC 60079", label: "Core reference design standard series applied" },
      { value: "−30%", label: "Enclosure footprint footprint savings vs generic catalog templates" },
    ],
    relatedSolutions: [
      { name: "MIMES Wireless Networks", href: "/solutions/mimes" },
      { name: "Explosion-Proof Mobility", href: "/solutions/explosion-proof-mobility" },
      { name: "Gas Detection Systems", href: "/solutions/gas-detection" },
    ],
  },

  "hse-consultancy": {
    title: "HSE & Risk Consultancy",
    category: "Health, Safety & Environment",
    tagline: "Rigorous corporate hazard verification, continuous risk mapping, and regulatory compliance validation.",
    overview:
      "East Wind's high-level HSE consultancy division executes complete physical asset vulnerability studies, Quantitative Risk Assessments (QRA), Hazard and Operability (HAZOP) reviews, and Layer of Protection Analysis (LOPA) profiles. We bridge the crucial gap between complex field instrumentation infrastructure and the rigorous regulatory requirements enforced by regional civil protection agencies, international safety bodies, and industrial ministries.",
    accentHex: "#c22026",
    capabilities: [
      {
        title: "Quantitative Risk Assessment (QRA)",
        body: "Utilizing fluid dispersion software to calculate thermal radiation limits and toxic cloud gas exposure thresholds. This accurately isolates localized facility risk metrics to optimize land-use boundaries and safeguard configurations.",
      },
      {
        title: "HAZOP & HAZID Group Studies",
        body: " Conducting structured Hazard Identification and Operability studies managed by certified engineering leads. We build robust risk matrices capturing design deviations, identifying failure roots, and assigning action blocks.",
      },
      {
        title: "Layer of Protection Analysis (LOPA)",
        body: "Performing semi-quantitative LOPA models to verify the target Safety Integrity Levels (SIL) for critical Safety Instrumented Functions (SIF), ensuring full compliance with the IEC 61511 functional safety framework.",
      },
      {
        title: "Emergency Management Profiling",
        body: "Developing site-specific emergency response plans, mutual aid protocols, and tactical muster maps aligned with international fire protection baselines and local industrial security directives.",
      },
    ],
    deliverables: [
      "Quantitative Risk Assessment report maps including individual hazard boundary lines",
      "Fleshed-out HAZOP register with complete severity rankings and action allocations",
      "LOPA data sheets and certified SIL determination parameter blocks",
      "Strategic site emergency response blueprints and evacuation layouts",
      "Regulatory compliance gap matrices matching strict industrial directives",
      "HSE continuous performance dashboard implementation architectures",
    ],
    metrics: [
      { value: "IEC 61511", label: "Functional safety lifecycle directive standard implemented" },
      { value: "−45%", label: "Reduction in audit non-conformance parameters post assessment" },
      { value: "HCIS", label: "Saudi Arabia industrial safety standard reference benchmark" },
    ],
    relatedSolutions: [
      { name: "Fire & Gas Systems", href: "/solutions/fire-gas-systems" },
      { name: "Gas Detection Systems", href: "/solutions/gas-detection" },
      { name: "TGR Control Loops", href: "/solutions/tgr" },
    ],
  },

  "digitalisation-consultancy": {
    title: "Digitalisation Consultancy",
    category: "Digital Architecture & Strategy",
    tagline: "Architecture layout strategies planning automated system adoption workflows for critical installations.",
    overview:
      "True industrial transformation requires a coherent architecture strategy that securely connects field-level instrumentation to corporate analytics hubs. East Wind's digitalisation consultants audit your legacy asset landscapes, resolve communications silo gaps, and engineer multi-stage integration paths that securely feed live data loops to Distributed Control Systems (DCS) without causing operational downtime.",
    accentHex: "#1e3e8f",
    capabilities: [
      {
        title: "Maturity Metric Benchmarking",
        body: "An exhaustive field evaluation of active telemetry paths, communication constraints, and technology gaps across plant maintenance, asset safety, and operations functions to build an optimized master integration path.",
      },
      {
        title: "Scalable IIoT Reference Modeling",
        body: "Engineering unified IIoT network frameworks connecting low-power sensor points to secure edge gateways, utilizing open-source protocol bridging layers to eliminate proprietary lock-in risks.",
      },
      {
        title: "DCS & SCADA Telemetry Mapping",
        body: "Designing robust hardware and software connection maps that channel field data loops straight into active plant control architectures, maximizing information usage while insulating core assets.",
      },
      {
        title: "OT Infrastructure Security Review",
        body: "Enforcing modern network segregation strategies and secure remote access models matching international cyber-protection protocols to verify that digitalisation does not create network vulnerabilities.",
      },
    ],
    deliverables: [
      "Digital transition roadmap with scored facility parameter indices",
      "Complete IIoT data flow drawings specifying link protocols and layers",
      "DCS interface connectivity maps with clear memory space allocations",
      "OT cybersecurity zone configuration analysis and boundary design models",
      "Unified facility data governance and naming registry guidelines",
      "Vendor-neutral technical requirement specifications and procurement templates",
    ],
    metrics: [
      { value: "OPC-UA", label: "Primary system interoperability standard leveraged" },
      { value: "IEC 62443", label: "Operational Technology cybersecurity standard verified" },
      { value: "Zero", label: "Process interruption incidents logged during data mapping" },
    ],
    relatedSolutions: [
      { name: "MIMES Wireless Networks", href: "/solutions/mimes" },
      { name: "Tridiagonal AI Analytics", href: "/solutions/tridiagonal" },
      { name: "Test Equipment Software", href: "/solutions/test-equipment-workshop-software" },
    ],
  },

  "fire-gas-mapping": {
    title: "Fire & Gas Mapping Services",
    category: "Detection Coverage Optimization",
    tagline: "Geographic physical monitoring optimization loops and layout coverage design studies.",
    overview:
      "Improper placement of fire and gas instrumentation leaves facilities open to catastrophic unmonitored accumulation risks. East Wind leverages advanced Computational Fluid Dynamics (CFD) gas dispersion models alongside 3D geometric ray-tracing algorithms to calculate exact target line-of-sight metrics. We maximize first-hit detection probabilities while streamlining total device count requirements to protect production spaces cost-effectively.",
    accentHex: "#c22026",
    capabilities: [
      {
        title: "CFD Gas Dispersion Simulation",
        body: "Simulating realistic toxic and combustible releases factoring in complex structure geometry, wind vectors, and local ventilation blocks to detect vulnerability blind spots missed by traditional rule-of-thumb models.",
      },
      {
        title: "3D Geometric Ray-Tracing",
        body: "Running exhaustive mathematical line-of-sight studies to optimize optical flame sensor and open-path infrared beam coverage margins, guaranteeing compliance with modern performance standards.",
      },
      {
        title: "Sensing Technology Selection Audits",
        body: "Independent assessment of catalytic bead, infrared point, open-path UVIR, electrochemical, and acoustic gas detection technologies for each specific gas group, ambient condition, and process scenario.",
      },
      {
        title: "Fire Detection Zone Mapping",
        body: "Calculating compliant heat, smoke, and linear thermal cable placement layout parameters using international codes paired with smoke movement simulations for complex processing facilities.",
      },
    ],
    deliverables: [
      "CFD dispersion simulation analysis files and hazard risk contour charts",
      "Optimized 3D sensor coverage graphics with coordinate engineering parameters",
      "Comprehensive detector installation schedule including sensor type selections",
      "Cause-and-effect control loop logic logic matrices for F&G logic panel setups",
      "Physical field validation inspection and commissioning protocol forms",
      "System lifecycle calibration frequency and upkeep schedule roadmaps",
    ],
    metrics: [
      { value: "95%+", label: "Target first-hit geographic detection probability achieved" },
      { value: "−25%", label: "Total instrument count reduction vs rule-of-thumb layouts" },
      { value: "NFPA 72", label: "Core fire signaling standard methodology applied" },
    ],
    relatedSolutions: [
      { name: "Gas Detection Systems", href: "/solutions/gas-detection" },
      { name: "Fire & Gas Systems", href: "/solutions/fire-gas-systems" },
      { name: "Environmental Analysers", href: "/solutions/environmental-analysers" },
    ],
  },

  "electromechanical-automation": {
    title: "Electromechanical Automation",
    category: "Process Control & Machinery",
    tagline: "High-noise shielded machinery automation and control logic integration for extreme contexts.",
    overview:
      "Heavy industrial mechanisms — including motor control panels, valve actuator manifolds, and safety shutdown loops — must withstand persistent electrical noise, thermal stress, and corrosive air profiles. East Wind builds, FAT-tests, and deploys rugged control cabinets, Variable Frequency Drive (VFD) enclosures, and pneumatic actuator rigs certified to safely link process hardware to plant control centers.",
    accentHex: "#b45309",
    capabilities: [
      {
        title: "Intelligent MCC Panel Engineering",
        body: "Designing smart Low Voltage Motor Control Centers outfitted with solid-state starters, overload protection links, and integrated data gateways communicating directly over standard plant field networks.",
      },
      {
        title: "Actuator & Solenoid Control Loops",
        body: "Engineering robust electro-pneumatic actuator lines and solenoid manifold panels incorporating automated Partial Stroke Testing (PST) protocols to ensure functional readiness for Emergency Shutdown (ESD) configurations.",
      },
      {
        title: "EMI Shielded Cabinet Assembly",
        body: "Building heavily shielded electrical panels incorporating galvanic isolate layers, ferrite filters, and precise bonding architectures to cancel high-frequency variable-drive electrical noise interferences.",
      },
      {
        title: "Witnessed Factory Acceptance Testing",
        body: "Executing rigorous component testing regimes inside our Dammam workshops — running dielectric strength checks, point loop continuities, and fail-safe sequence models before site logistics delivery.",
      },
    ],
    deliverables: [
      "Certified termination drawing packages: schematic loops, panel dimensions, wiring maps",
      "Component datasheets and unified design deviation registers",
      "Completed Factory Acceptance Test (FAT) witness records and check sheets",
      "Intrinsically safe field installation certificates for hazardous equipment zones",
      "Site pre-commissioning procedures and checkout execution documentation",
      "Operations manuals and recommended lifecycle operations spare parts packages",
    ],
    metrics: [
      { value: "IEC 61439", label: "Low-voltage assembly manufacturing standard applied" },
      { value: "IP65", label: "Minimum standard ingress rating for outdoor field panels" },
      { value: "SIL 2", label: "Maximum loop integrity baseline capability achieved" },
    ],
    relatedSolutions: [
      { name: "Flow Metering Skids", href: "/solutions/flow-metering-skids" },
      { name: "HIPPS Systems", href: "/solutions/hipps" },
      { name: "Gas Detection Systems", href: "/solutions/gas-detection" },
    ],
  },

  "power-optimisation": {
    title: "Power Optimisation Support",
    category: "Energy Efficiency & Grid Hardening",
    tagline: "Minimizing baseline energy waste and building grid resilience for critical process telemetry clusters.",
    overview:
      "Facility power infrastructure represents a massive chunk of continuous operating overheads. East Wind's specialized power engineers analyze electrical networks, track harmonic distortions, isolate energy leakages, and configure double-conversion Uninterruptible Power Supply (UPS) setups. We harden your monitoring networks against line noise, switching transients, and grid degradation events to safeguard critical instrumentation performance.",
    accentHex: "#1e3e8f",
    capabilities: [
      {
        title: "Power Quality Profiling Surveys",
        body: "Harmonic distortion surveys, power factor measurements, transient capture, and load flow studies using calibrated power analyzers — producing quantified evidence of energy waste and equipment stress linked to poor power quality.",
      },
      {
        title: "UPS & Filtering System Architecture",
        body: "Selection and specification of online double-conversion UPS systems, active harmonic filters, isolation transformers, and surge protection devices scaled to critical instrumentation and control system loads.",
      },
      {
        title: "Noise-Insulated Telemetry Support",
        body: "Specification of instrumentation loops with enhanced EMC immunity ratings and galvanic isolation — eliminating spurious signals and measurement drift caused by variable-frequency drive interference.",
      },
      {
        title: "Thermal Switchgear Evaluation",
        body: "Deployment of infrared thermal imaging survey programs and partial discharge monitoring systems on high-voltage switchgear links and distribution centers to flag high-resistance hotspots before structural connection failures occur.",
      },
    ],
    deliverables: [
      "Total Harmonic Distortion (THD) profile analysis reports and power quality logs",
      "Quantified facility energy loss audits with target remediation outlines",
      "UPS backup specification requirements and power filter layout calculations",
      "High-noise immune instrument selection guide by loop type",
      "Thermal imaging survey report with hotspot risk ranking",
      "Power system reliability improvement roadmap with OPEX savings estimate",
    ],
    metrics: [
      { value: "−20%", label: "Potential facility power consumption drop post integration" },
      { value: "IEC 61000", label: "Core electromagnetic immunity framework enforced" },
      { value: "99.99%", label: "Target continuous availability for critical process automation" },
    ],
    relatedSolutions: [
      { name: "MIMES Wireless Networks", href: "/solutions/mimes" },
      { name: "Environmental Analysers", href: "/solutions/environmental-analysers" },
      { name: "Flow Metering Skids", href: "/solutions/flow-metering-skids" },
    ],
  },
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/services`);
    if (!res.ok) return [];
    const list = await res.json();
    return list.map((ser: any) => ({
      id: ser.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for services:", error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  let data: ServiceData | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/services/${id}`, {
      cache: "no-store"
    });
    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error(`Failed to fetch service ${id}:`, error);
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-white text-slate-900 font-mono text-xs grid place-items-center">
        Service system node parameter empty // Config route error.
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className={`${poppins.className} min-h-screen bg-white text-slate-800 antialiased flex flex-col w-full overflow-x-hidden`}>

        {/* Hero Row */}
        <div className="w-full bg-slate-950 pt-[200px] pb-24 flex items-center border-b border-slate-900 relative">
          <img
            src="/service.png"
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none brightness-[0.65] scale-101"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c14]/95 via-[#080c14]/75 to-transparent z-10" />
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
              Service Overview
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
              Service Scope
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

        {/* Deliverables Row */}
        <div className="w-full bg-white py-12">
          <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em] block mb-5" style={{ color: data.accentHex }}>
                Key Deliverables
              </span>
              <ul className="flex flex-col gap-3.5 pl-0 list-none m-0">
                {data.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[0.92rem] text-slate-650 leading-snug font-light">
                    <span className="mt-[5px] w-4 h-4 rounded-full flex-shrink-0 grid place-items-center" style={{ backgroundColor: `${data.accentHex}15` }}>
                      <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={data.accentHex} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {d}
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
                    Engage our {data.title} team
                  </h2>
                  <p className="text-white/60 text-sm font-light m-0">
                    Our engineers will scope, plan, and deliver this service around your site&apos;s specific regulatory and operational requirements.
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