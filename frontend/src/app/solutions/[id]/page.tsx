// src/app/solutions/[id]/page.tsx

import Link from "next/link";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductActions from "@/components/ProductActions";
import MimesEcosystem from "@/components/MimesEcosystem";
import SolutionImage from "@/components/SolutionImage";
import { productsDb as hardwareDb, ProductItem, getProductImageUrl } from "@/data/productsData";
import { formatImageUrl } from "@/utils/image";

// Initialize Poppins font for clean corporate presentation
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Force Next.js to strictly stick to pre-rendered pages (Required for output: 'export')
export const dynamicParams = true;

interface ProductDetailsData {
  title: string;
  subLabel: string;
  tagline: string;
  accent: "blue" | "orange";
  description: string;
  detailedContent: string;
  features: string[];
  compliance: string[];
  specs: { label: string; value: string }[];
  benefits: string[];
  applications: string[];
  imageUrl: string;
}

export const solutionsDb: Record<string, ProductDetailsData> = {
  "mimes": {
    title: "MIMES Wireless IIoT Platform",
    subLabel: "Wireless Industrial Telemetry",
    tagline: "Intrinsically Safe Zero-Cabling Instrument Bridging in Zone 0 Fields",
    accent: "blue",
    description: "Deploying robust, low-power mesh radios inside Class I Division 1 (Zone 0/1) hazardous areas. We interface with telemetry transmitters, temperature gauges, and gas sensors without trenches or cabling.",
    detailedContent: "MIMES is a revolutionary wireless data acquisition platform certified for Zone 0 environments. It leverages self-healing mesh radio technologies to capture telemetry from pressure, gas, and temperature instruments across wide geographic areas. Operating on ultra-low power, a single node can run for up to 10 years without a battery change, drastically lowering the total cost of ownership (TCO) of industrial telemetry deployments.",
    features: [
      "Certified for Class I Division 1 & Zone 0/1 environments",
      "Authorised premium brand engineering & components",
      "Fully integrated with standard plant safety loops",
      "Calibrated and tested in local EWS service facilities"
    ],
    compliance: ["EN / ISO International Safety Standard Certified", "ATEX / IECEx Explosion-Proof Directives", "Local Civil Defence & Industrial Security Compliant"],
    specs: [
      { label: "Design Life", value: "10 Years Continuous" },
      { label: "Radio Frequencies", value: "2.4 GHz / 900 MHz ISM Band" },
      { label: "Enclosure Protection", value: "IP67 / NEMA 4X Weatherproof" },
      { label: "Max Transmission Range", value: "Up to 1,000m line-of-sight" }
    ],
    benefits: [
      "Ensures complete regulatory and code compliance",
      "Enhances operational longevity with rugged construction",
      "Reduces operator hazard risks in processing spaces"
    ],
    applications: ["Oil & Gas Refining", "Offshore Platforms", "Chemical Storage Terminals"],
    imageUrl: "/wireless_monitoring.webp"
  },
  "xshielder": {
    title: "Xshielder OT Firewall",
    subLabel: "Industrial Cyber-Safety",
    tagline: "Deep Packet Inspection and SCADA Isolation Gateways",
    accent: "blue",
    description: "Deep packet inspection and firewalls designed specifically for OT (Operational Technology) networks to defend SCADA and DCS from external digital threats.",
    detailedContent: "Xshielder is an industrial-grade cyber-safety boundary gateway engineered to protect critical SCADA and Distributed Control Systems (DCS). It enforces unidirectional data flows and performs deep packet inspection (DPI) on Modbus, OPC UA, and DNP3 protocols. Complying with HCIS SEC-09 guidelines, Xshielder ensures zero external penetration risk to refinery automation networks.",
    features: [
      "Certified for Class I Division 1 & Zone 0/1 environments",
      "Authorised premium brand engineering & components",
      "Fully integrated with standard plant safety loops",
      "Calibrated and tested in local EWS service facilities"
    ],
    compliance: ["EN / ISO International Safety Standard Certified", "ATEX / IECEx Explosion-Proof Directives", "Local Civil Defence & Industrial Security Compliant"],
    specs: [
      { label: "Inspection Latency", value: "< 1.5ms" },
      { label: "Supported Protocols", value: "Modbus/TCP, OPC UA, DNP3, Ethernet/IP" },
      { label: "Enclosure Rating", value: "DIN-Rail mount IP30 Class I Div 2" },
      { label: "Throughput Capacity", value: "1 Gbps continuous DPI" }
    ],
    benefits: [
      "Ensures complete regulatory and code compliance",
      "Enhances operational longevity with rugged construction",
      "Reduces operator hazard risks in processing spaces"
    ],
    applications: ["Power Substations", "Water Treatment Facilities", "Petrochemical Refineries", "Gas Separator Plants"],
    imageUrl: "/hazardous_mobility.webp"
  },
  "tridiagonal": {
    title: "Tridiagonal AI Anomaly Engine",
    subLabel: "Asset Integrity Analytics",
    tagline: "Physics-Informed Machine Learning & Predictive Asset Care",
    accent: "blue",
    description: "Ingesting high-frequency vibrational, thermal, and pressure signals to detect anomalies and forecast rotating machinery degradation before trips occur.",
    detailedContent: "Tridiagonal is an advanced neural modelling platform incorporating Physics-Informed Machine Learning models. By combining classical thermodynamic and vibration math with modern neural network pipelines, it predicts issues like cavitation, bearing wear, and impeller imbalance up to 72 hours before traditional sensors trigger alert shut-offs.",
    features: [
      "Certified for Class I Division 1 & Zone 0/1 environments",
      "Authorised premium brand engineering & components",
      "Fully integrated with standard plant safety loops",
      "Calibrated and tested in local EWS service facilities"
    ],
    compliance: ["EN / ISO International Safety Standard Certified", "ATEX / IECEx Explosion-Proof Directives", "Local Civil Defence & Industrial Security Compliant"],
    specs: [
      { label: "Early Warning Window", value: "48 to 72 Hours" },
      { label: "Model Training Ingestion", value: "Over 10TB history logs" },
      { label: "F1 Score Accuracy", value: "99.4% F1 anomaly prediction" },
      { label: "Inference response", value: "< 50ms per channel" }
    ],
    benefits: [
      "Ensures complete regulatory and code compliance",
      "Enhances operational longevity with rugged construction",
      "Reduces operator hazard risks in processing spaces"
    ],
    applications: ["High-pressure Gas Compressors", "Pumping Stations", "Refinement Centrifuges", "Power Turbines"],
    imageUrl: "/predictive_intelligence.webp"
  },
  "oneseven": {
    title: "One Seven CAFS Technology",
    subLabel: "Tactical Extinguishing Systems",
    tagline: "Ultra-High Efficiency Water-Saving Foam Systems",
    accent: "orange",
    description: "High-energy compressed air foam (CAFS) systems multiplying extinguishing surface area while conserving water resources by up to 90%.",
    detailedContent: "One Seven is the global gold standard for Compressed Air Foam Systems (CAFS). By dosing precise foam concentrates and injecting high-pressure air into the water line, it expands a single drop of water into a high-energy foam blanket. This blanket smothers hydrocarbon vapours, blocks oxygen ingress, and prevents reignition on hot metal surfaces, making it indispensable for refinery tank farms.",
    features: [
      "Certified for Class I Division 1 & Zone 0/1 environments",
      "Authorised premium brand engineering & components",
      "Fully integrated with standard plant safety loops",
      "Calibrated and tested in local EWS service facilities"
    ],
    compliance: ["EN / ISO International Safety Standard Certified", "ATEX / IECEx Explosion-Proof Directives", "Local Civil Defence & Industrial Security Compliant"],
    specs: [
      { label: "Expansion Output Ratio", value: "1:7 to 1:15 Adjustable" },
      { label: "Extinguishing Output Rate", value: "2,000 to 10,000 LPM" },
      { label: "Operating Water Pressure", value: "8 to 12 Bar nominal" },
      { label: "Foam Dosing Accuracy", value: "0.1% to 1.0% electronic feedback" }
    ],
    benefits: [
      "Ensures complete regulatory and code compliance",
      "Enhances operational longevity with rugged construction",
      "Reduces operator hazard risks in processing spaces"
    ],
    applications: ["Refinery Tank Farms", "Helidecks", "Loading Gantry Protection", "Emergency Response Fleets"],
    imageUrl: "/emergency_response.webp"
  },
  "nardi": {
    title: "Nardi High-Pressure Compressors",
    subLabel: "Breathing Air & Gas Systems",
    tagline: "Certified Escape Cascade Charging Equipment & Air Compressors",
    accent: "orange",
    description: "Engineering premium air compressors and high-pressure storage cascades for breathing air and inerting gases. Certified safe for high-temperature desert operations.",
    detailedContent: "Nardi high-pressure breathing systems provide the primary safety barrier for personnel in toxic H2S refinery environments. Engineered with multi-stage oil-free compression, automated moisture purge traps, and carbon filter elements, Nardi compressors charge high-pressure escape cascade cylinders up to 350 Bar. All units are housed in ATEX-compliant chasses to operate safely in hazardous atmospheres.",
    features: [
      "Certified for Class I Division 1 & Zone 0/1 environments",
      "Authorised premium brand engineering & components",
      "Fully integrated with standard plant safety loops",
      "Calibrated and tested in local EWS service facilities"
    ],
    compliance: ["EN / ISO International Safety Standard Certified", "ATEX / IECEx Explosion-Proof Directives", "Local Civil Defence & Industrial Security Compliant"],
    specs: [
      { label: "Max Operating Pressure", value: "350 Bar / 5000 PSI" },
      { label: "Flow Discharge Capacity", value: "300 to 700 Liters/Minute" },
      { label: "Air Quality Filtration", value: "CO/CO2/Moisture active monitoring" },
      { label: "Chassis Design", value: "Soundproofed galvanized steel canopy" }
    ],
    benefits: [
      "Ensures complete regulatory and code compliance",
      "Enhances operational longevity with rugged construction",
      "Reduces operator hazard risks in processing spaces"
    ],
    applications: ["Toxic H2S Processing Units", "Safety Escape Refuges", "Marine Vessel Engine Rooms", "Fire Brigade Stations"],
    imageUrl: "/hazardous_mobility.webp"
  },
  "tgr": {
    title: "TGR Structural Integrity Audit",
    subLabel: "Critical Infrastructure Protection",
    tagline: "Acoustic Stress Audits & Blast Shield Enclosures",
    accent: "orange",
    description: "Audit sensors and blast deflecting modular systems designed to continuously monitor structural health and shield assets from physical hazards.",
    detailedContent: "TGR is a comprehensive infrastructure protection platform. Using acoustic emission sensors and micro-strain gauges, TGR audits the structural health of storage silos, steel pipelines, and concrete foundations. When combined with our blast-resistant modules and high-security isolation borders, TGR protects critical refinery control centres from both structural failure and explosion hazards.",
    features: [
      "Certified for Class I Division 1 & Zone 0/1 environments",
      "Authorised premium brand engineering & components",
      "Fully integrated with standard plant safety loops",
      "Calibrated and tested in local EWS service facilities"
    ],
    compliance: ["EN / ISO International Safety Standard Certified", "ATEX / IECEx Explosion-Proof Directives", "Local Civil Defence & Industrial Security Compliant"],
    specs: [
      { label: "Blast Overpressure Limit", value: "10 PSI (1.0 Bar equivalent)" },
      { label: "Fire Resistance Integrity", value: "2 Hours continuous hydrocarbon flame" },
      { label: "Acoustic Audits Latency", value: "Continuous real-time telemetry" },
      { label: "Installation Method", value: "Pre-assembled bolt-on modules" }
    ],
    benefits: [
      "Ensures complete regulatory and code compliance",
      "Enhances operational longevity with rugged construction",
      "Reduces operator hazard risks in processing spaces"
    ],
    applications: ["High-Security Borders", "Substation E-Houses", "Analyser Shelter Protection", "Bulk Storage Tank Foundations"],
    imageUrl: "/critical_infrastructure.webp"
  },
  "oil-and-gas": {
    title: "Oil & Gas Industry Solutions",
    subLabel: "Intelligent Hydrocarbon Operations",
    tagline: "Fusing Intrinsically Safe Telemetry and Active Suppression in ATEX Zone 0/1 Environments",
    accent: "blue",
    description: "Deploying high-compliance telemetry grids, toxic gas mappings, and automated foam loops to safeguard upstream wellheads, desert pipelines, and downstream petrochemical tank farms.",
    detailedContent: "Our custom safety integrations protect the region's most critical oil and gas processing blocks. By combining self-healing wireless sensor networks with high-capacity firefighting systems and positive-pressure chambers, we eliminate the need for costly copper wire trenches while reinforcing site safety. Every deployment adheres to strict KSA Civil Defense, Aramco, and HCIS directives.",
    features: [
      "End-to-End ISA 100 wireless gas detection system",
      "Plant Operations (Plant OPS)",
      "TGR(temporary refuge chamber)",
      "Tank farm fire fighting",
      "LER",
      "Analyzer shelters",
      "Digital mobility-x shielder",
      "HSE consultancy",
      "Air loops systems",
      "H2s shelter rental",
      "Breathing air cascade system",
      "Explosion proof design consultancy"
    ],
    compliance: ["Saudi Civil Defense Approved", "HCIS SAF-01 / SAF-12 Compliant", "ATEX / IECEx Zone 0 Certification"],
    specs: [
      { label: "Wireless Protocol", value: "ISA100.11a / WirelessHART secure mesh" },
      { label: "Hazard Classification", value: "Class I Division 1 / ATEX Zone 0 & 1" },
      { label: "Enclosure Protection", value: "IP66 / IP67 NEMA 4X certified" },
      { label: "Response Latency", value: "< 1.0s loop-to-SCADA propagation" }
    ],
    benefits: [
      "Zero field trenching or civil cabling excavation required",
      "High-energy suppression minimizes water utility consumption by 90%",
      "Real-time operator tracking and digitized work clearances"
    ],
    applications: ["Offshore Drilling Rigs", "Downstream Refineries", "Desert Pipeline Nodes", "Petrochemical Tank Farms"],
    imageUrl: "/predictive_intelligence.webp"
  },
  "petrochemicals": {
    title: "Petrochemical Infrastructure Solutions",
    subLabel: "Process Hazard Control",
    tagline: "Physics-Informed ML Diagnostics and SIL2 Wireless Safety Arrays",
    accent: "blue",
    description: "Optimizing downstream chemical refining ecosystems with predictive anomaly diagnostics, high-fidelity wireless telemetry layers, and mission-critical emergency command platforms.",
    detailedContent: "Downstream chemical operations demand continuous process uptime and rapid leak mitigation. We integrate advanced Neural Network diagnostic engines that calculate asset degradation hours before failure, paired with SIL2 certified wireless gas detection loop safety barriers and high-noise substation telemetry.",
    features: [
      "Smart factories",
      "Plant Ai",
      "Wireless data acquisition",
      "SIL2 wireless gas detection systems",
      "ISA 100, LUARA, HART, Wireless systems",
      "Emergency response solution"
    ],
    compliance: ["IEC 61508 SIL 2 functional safety indices", "HCIS SEC-09 Cybersecurity Guidelines", "SASO and international IEEE directives"],
    specs: [
      { label: "AI Prediction Accuracy", value: "99.4% F1 anomaly F1-score prediction window" },
      { label: "Signal Latency", value: "< 50ms per sensor telemetry channel" },
      { label: "Substation Compliance", value: "IEC 61850 grid integration standard" },
      { label: "Mesh Node Capacity", value: "Up to 500 nodes per routing gateway link" }
    ],
    benefits: [
      "Predictive diagnostics lower repair overheads by up to 42%",
      "SIL2 functional loops prevent catastrophic runaway incidents",
      "High-noise radio systems override electromagnetic substation interference"
    ],
    applications: ["Ethylene Crackers", "Polymer Processing Blocks", "Chemical Storage Hubs", "Substation E-Houses"],
    imageUrl: "/industrial_digitalization.webp"
  },
  "civil-defense": {
    title: "Civil Defense & Military Solutions",
    subLabel: "Tactical Emergency Incident Command",
    tagline: "AI-Integrated Fleet Telemetry, Rapid Intervention Vehicles, and Heavy Rescue Apparata",
    accent: "orange",
    description: "Equipping public safety, civil protection, and regional defense forces with heavy tactical command vehicles, specialized life support fleets, and high-expansion foam systems.",
    detailedContent: "In critical urban and industrial emergencies, response speed and equipment reliability dictate outcomes. We design, manufacture, and integrate specialized firefighting vehicles and tactical apparatus matching Saudi Civil Defense mandates, complete with on-board telemetry, SCBA cascade charging, and CBRN hermetic overpressure cabins.",
    features: [
      "Asset management systems AI integrated fire trucks",
      "Rescue intervention truck (RIV)",
      "Compressed air form system (CAFS)",
      "SCBA trucks",
      "CBRN Vehicles",
      "Emergency response system"
    ],
    compliance: ["KSA Civil Defense General Directorate approval", "NFPA 1901 / NFPA 1971 design standards", "CBRN military protection validation"],
    specs: [
      { label: "Extinguishing Standard", value: "One Seven CAFS hyper-expansion loop" },
      { label: "Water Savings Margin", value: "Up to 90% water footprint conservation" },
      { label: "Strut Lift Index", value: "Exceeding 20 metric tons capacity benchmarks" },
      { label: "SCBA Bank Pressure", value: "350 Bar certified cascade charging" }
    ],
    benefits: [
      "Slashes water usage in hydrocarbon fires, preventing runoffs",
      "Hermetically sealed cabins isolate responders from toxic/radiological hazards",
      "Integrated vehicle health analytics prevent critical downtime during missions"
    ],
    applications: ["Municipal Fire Brigades", "Industrial Refinery Responders", "Hazmat Mitigation Teams", "National Security Borders"],
    imageUrl: "/emergency_vehicle.webp"
  },
  "marine-offshore": {
    title: "Marine & Offshore Platform Solutions",
    subLabel: "Harsh Deepwater Infrastructure Resilience",
    tagline: "Kinetic Damage Control Systems, Hyperbaric Life Support, and Salt-Atmosphere Telemetry",
    accent: "blue",
    description: "Providing deepwater platform defense, automated hull breach stabilization, corrosion-proof wireless sensor meshes, and hyperbaric breathing cascade modules.",
    detailedContent: "Offshore exploration rigs and marine vessels operate in highly corrosive, high-vibration salt atmospheres far from shore. We supply certified hyperbaric decompression chambers, H2S emergency air loop cascade rentals, and remote bulkhead flooding valves linked via ATEX marine-grade wireless gateways.",
    features: [
      "Damage control system",
      "Wireless data acquisition and LAUARA 1SA 100, WIRELESS HART",
      "H2S shelter rental",
      "TGR",
      "DE Compression champeers",
      "Air loops systems",
      "Breathing air cascade solution",
      "Digital mobility Xshielder",
      "Plant OPS"
    ],
    compliance: ["DNV / ABS Maritime Class Certifications", "ATEX / IECEx Zone 1 Explosion Protection", "EN 12021 Breathing Purity Conformance"],
    specs: [
      { label: "Enclosure Build", value: "316L Marine-grade stainless steel" },
      { label: "Blast Overpressure Limit", value: "10 PSI (1.0 Bar equivalent) deflecting shield" },
      { label: "Chamber Rating", value: "DNV certified hyperbaric pressure vessel" },
      { label: "Radio Range Deck", value: "Up to 1,000m line-of-sight signal transmission" }
    ],
    benefits: [
      "Marine-grade alloys prevent salt-corrosion decay",
      "Bilge automation isolates hull flooding in milliseconds",
      "Integrated breathing air cascades support continuous operations during H2S leaks"
    ],
    applications: ["Deepwater Oil Platforms", "Offshore Logistics Vessels", "Subsea Diving Operations", "Coast Guard Fleets"],
    imageUrl: "/thermal_ehouse.webp"
  },
  "utility-power": {
    title: "Utility & Power Grid Solutions",
    subLabel: "Critical Grid Asset Safeguarding",
    tagline: "SWAS Sampling System Engineering and High-Noise Substation Telemetry Layers",
    accent: "blue",
    description: "Hardening electrical transmission networks, high-output substations, and water treatment systems through high-noise immune telemetry and automated thermal monitoring.",
    detailedContent: "Power grids and utility plants represent high-value national targets. We engineer Steam & Water Analysis Systems (SWAS) for thermal generation plants, alongside EMI-shielded wireless mesh links for IEC 61850 substation relays and computer-vision physical safety checking arrays.",
    features: [
      "Sampling systems",
      "Wireless infrastructure",
      "Smart Facility",
      "Digital mobility Xshilder"
    ],
    compliance: ["IEEE Substation Standards Conformance", "IEC 61850 electrical grid communication rules", "Saudi Electric Company (SEC) approvals"],
    specs: [
      { label: "Bilge Analysis Loops", value: "Inline pH, conductivity, and dissolved oxygen" },
      { label: "EMI Shielding Factor", value: "High-noise immune industrial radio shielding" },
      { label: "Thermal Scanning", value: "Substation transformer continuous IR monitoring" },
      { label: "Work Permit Link", value: "Digital permit sign-off at edge nodes" }
    ],
    benefits: [
      "Protects steam turbines from dissolved silica corrosion via SWAS",
      "Maintains reliable wireless feeds inside high electromagnetic noise fields",
      "Automated thermal checks identify hot spots hours before grid trips occur"
    ],
    applications: ["High-Voltage Substations", "Thermal Power Plants", "Desalination Facilities", "Municipal Water Networks"],
    imageUrl: "/wireless_monitoring.webp"
  }
};

export const validDynamicSlugs = [
  "air-purified-respirators", "breathing-air-compressor", "calibration-gases",
  "chemical-protective-suits", "detergents-and-disinfectants", "diving-equipments",
  "drug-alcohol-monitoring", "emergency-escape-breathing-device", "gas-detection",
  "personal-protection", "self-contained-breathing-apparatus", "thermal-imaging-camera",
  "environmental-analysers", "protective-eye-wears", "helmets-for-fire-brigades",
  "test-equipment-workshop-software", "rescue-tool-kit", "fire-service", "marine",
  "oil-and-gas", "petrochemicals", "civil-defense", "marine-offshore", "utility-power", 
  "others", "testing-maintenance", "calibration", "marine-instruments-repair",
  "temporary-refuge-shelters", "fire-simulators", "breathing-air-cascade-systems",
  "fire-gas-systems", "diving-chambers", "oxygen-boosters-breathing-air-supply",
  "flow-metering-skids", "chemical-injection-skids", "hipps"
];

export function getDynamicProductData(slug: string): ProductDetailsData | null {
  const title = slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  if (!validDynamicSlugs.includes(slug)) return null;

  const isBlue = ["calibration-gases", "drug-alcohol-monitoring", "environmental-analysers", "test-equipment-workshop-software", "marine", "testing-maintenance", "calibration", "marine-instruments-repair", "flow-metering-skids", "chemical-injection-skids", "oil-and-gas", "petrochemicals", "marine-offshore", "utility-power"].includes(slug);
  const accent = isBlue ? "blue" : "orange";

  return {
    title,
    subLabel: "Industrial Safety Solutions",
    tagline: "Certified high-compliance safety systems engineered for harsh atmospheres.",
    accent,
    description: `Eastwind Safety supplies premium, certified ${title} solutions to the Marine, Oil & Gas, Petrochemical, Civil Defence, and Government sectors. Engineered for high-risk and harsh environments, our architectures prioritise active protection and absolute operational compliance.`,
    detailedContent: `Our professional ${title} system represents the pinnacle of industrial safety engineering. We work directly with leading global safety brands to design, supply, install, and calibrate instrumentation loops. Every unit undergoes strict compliance auditing under NFPA, EN, ATEX, and local civil defence guidelines, ensuring that field operators remain protected during critical process operations or emergency events.`,
    features: [
      "Certified for Class I Division 1 & Zone 0/1 environments",
      "Authorised premium brand engineering & components",
      "Fully integrated with standard plant safety loops",
      "Calibrated and tested in local EWS service facilities"
    ],
    compliance: ["EN / ISO International Safety Standard Certified", "ATEX / IECEx Explosion-Proof Directives", "Local Civil Defence & Industrial Security Compliant"],
    benefits: ["Ensures complete regulatory and code compliance", "Enhances operational longevity with rugged construction", "Reduces operator hazard risks in processing spaces"],
    specs: [
      { label: "Design Life", value: "10 Years Continuous" },
      { label: "Operating Temp Range", value: "-20°C to +60°C" },
      { label: "Enclosure Protection", value: "IP66 / IP67 Weatherproof" },
      { label: "Material Structure", value: "Corrosion-resistant steel/alloy" }
    ],
    applications: ["Oil & Gas Refining", "Offshore Platforms", "Chemical Storage Terminals"],
    imageUrl: "/wireless_monitoring.webp"
  };
}

export const dynamic = "force-dynamic";

function getSolutionImageUrl(imageUrl: string): string {
  return formatImageUrl(imageUrl);
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/solutions`);
    if (!res.ok) return [];
    const list = await res.json();
    return list.map((sol: any) => ({
      id: sol.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for solutions:", error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const slug = id || "";
  
  let product: ProductDetailsData | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/solutions/${slug}`, {
      cache: "no-store"
    });
    if (res.ok) {
      product = await res.json();
    }
  } catch (error) {
    console.error(`Failed to fetch solution ${slug}:`, error);
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className={`${poppins.className} py-32 px-4 sm:px-6 lg:px-8 min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center antialiased w-full`}>
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-8 text-center shadow-xs mx-auto">
            <h1 className="text-xl font-bold text-slate-900 mb-2">System Entry Not Found</h1>
            <p className="text-sm text-slate-500 mb-6">The requested system parameter profile could not be retrieved from active nodes.</p>
            <Link href="/" className="inline-block px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors">
              Return to Homepage
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isBlueAccent = product.accent === "blue";
  const brandColor = isBlueAccent ? "#1e3e8f" : "#c22026";
  const brandLightBg = isBlueAccent ? "#f4f7fc" : "#fffbeb";
  
  // Fetch dynamic products catalog from API for related hardware
  let productsList: ProductItem[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`, {
      cache: "no-store"
    });
    if (res.ok) {
      productsList = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch products for related hardware:", error);
  }

  // Filter related physical products contextually based on the active solution slug
  let relatedHardware: ProductItem[] = [];
  const lowercaseSlug = slug.toLowerCase();
  
  if (
    lowercaseSlug === "civil-defense" || 
    lowercaseSlug === "oneseven" || 
    lowercaseSlug === "fire-service" || 
    lowercaseSlug === "rescue-tool-kit" || 
    lowercaseSlug === "helmets-for-fire-brigades"
  ) {
    const ids = ["fire-truck", "one-seven-cafs", "sione-fire-suit", "scba-system"];
    relatedHardware = productsList.filter((p) => ids.includes(p.id));
  } else if (
    lowercaseSlug === "oil-and-gas" || 
    lowercaseSlug === "petrochemicals" || 
    lowercaseSlug === "mimes" || 
    lowercaseSlug === "gas-detection" || 
    lowercaseSlug === "fire-gas-systems" || 
    lowercaseSlug === "tridiagonal" || 
    lowercaseSlug === "environmental-analysers" || 
    lowercaseSlug === "flow-metering-skids" || 
    lowercaseSlug === "chemical-injection-skids"
  ) {
    const ids = ["gas-detector", "smoke-detector", "xshielder-phone", "wireless-converter", "pressure-transmitter"];
    relatedHardware = productsList.filter((p) => ids.includes(p.id));
  } else if (
    lowercaseSlug === "marine-offshore" || 
    lowercaseSlug === "marine" || 
    lowercaseSlug === "nardi" || 
    lowercaseSlug === "self-contained-breathing-apparatus" || 
    lowercaseSlug === "breathing-air-compressor" || 
    lowercaseSlug === "air-purified-respirators" || 
    lowercaseSlug === "breathing-air-cascade-systems"
  ) {
    const ids = ["cascade-system", "polyhose-breathing", "cejn-connections", "hose-reel"];
    relatedHardware = productsList.filter((p) => ids.includes(p.id));
  } else {
    // Fallback default: show high-grade explosion proof elements
    relatedHardware = productsList.filter((p) => p.category === "explosion-proof-products");
  }

  return (
    <>
      <Navbar />
      
      <main className={`${poppins.className} min-h-screen bg-white text-slate-800 antialiased pt-24 w-full overflow-x-hidden`}>
        
        {/* ── SECTION 1: ELEGANT HERO COVER ── */}
        <section className="bg-slate-50 border-b border-slate-200/60 py-16 md:py-20 w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch w-full">
              
              <div className="lg:col-span-6 space-y-5 w-full flex flex-col justify-center">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] block" style={{ color: brandColor }}>
                    {product.subLabel}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight uppercase">
                    {product.title.split(' ')[0]} <span className="font-bold block text-slate-950 mt-1">{product.title.split(' ').slice(1).join(' ')}</span>
                  </h1>
                </div>
                
                <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
                  {product.tagline}
                </p>
                
                <p className="text-sm text-slate-500 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full">
                  <ProductActions productTitle={product.title} accentColor={brandColor} layout="hero" />
                </div>
              </div>

              <div className="lg:col-span-6 w-full flex flex-col relative min-h-[260px] lg:min-h-[360px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
                <SolutionImage imageUrl={product.imageUrl} title={product.title} />
              </div>

            </div>
          </div>
        </section>

        {/* ── SECTION 2: THE INTEGRATION STORYBOARD ── */}
        <section className="py-16 md:py-24 w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-100 pb-6 w-full">
              <div className="space-y-1.5">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-slate-400 block">Lifecycle Sequence</span>
                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">The Integration Process</h2>
              </div>
              <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                We translate abstract regulatory mandates into continuous physical and operational resilience across your installations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch">
              
              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl space-y-4 flex flex-col justify-between w-full">
                <div className="space-y-3">
                  <span className="text-3xl font-extrabold block tracking-tight text-slate-200 font-mono">01</span>
                  <h3 className="text-md font-bold text-slate-900 uppercase tracking-wide">Environment Evaluation</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Industrial fields map out distinct exposure metrics. We isolate localized volatile gas indicators and ambient temperature boundaries to define system protections accurately.
                  </p>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 pt-3 border-t border-slate-200/40">
                  Initial Assessment
                </div>
              </div>

              <div className="bg-white border-2 p-6 md:p-8 rounded-2xl space-y-4 flex flex-col justify-between shadow-md relative w-full" style={{ borderColor: brandColor }}>
                <div className="space-y-3">
                  <span className="text-4xl font-extrabold block tracking-tight font-mono" style={{ color: brandLightBg }}>02</span>
                  <h3 className="text-md font-bold text-slate-900 uppercase tracking-wide">Custom Infrastructure Integration</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {product.detailedContent}
                  </p>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider font-bold pt-3 border-t border-slate-100" style={{ color: brandColor }}>
                  System Deployment
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl space-y-4 flex flex-col justify-between w-full">
                <div className="space-y-3">
                  <span className="text-3xl font-extrabold block tracking-tight text-slate-200 font-mono">03</span>
                  <h3 className="text-md font-bold text-slate-900 uppercase tracking-wide">Lower Total Cost of Ownership</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    By linking engineering hardware loops directly into active plant automation networks, our platforms consistently maintain safety thresholds while lowering total cost of ownership.
                  </p>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 pt-3 border-t border-slate-200/40 font-semibold">
                  Operations and Support
                </div>
              </div>

            </div>
          </div>
        </section>
        
        {slug === "mimes" && <MimesEcosystem />}

        {/* ── SECTION 3: PLATFORM COMPETENCIES ── */}
        <section className="py-16 bg-slate-50 border-t border-b border-slate-200/60 w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-slate-200 pb-4 w-full">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Core Strengths</span>
              <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight pt-1">Platform Competencies</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
              {product.features.map((feature, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 sm:p-6 rounded-xl shadow-3xs flex items-start gap-4 hover:border-slate-300 transition-colors w-full">
                  <span className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-mono text-xs text-slate-400 font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 m-0 pt-1 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: SECTORS & DATA SHEET GRID ── */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
            
            <div className="lg:col-span-7 space-y-4 w-full">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Strategic Sectors</h4>
              <div className="flex flex-wrap gap-2 w-full">
                {product.applications.map((app, idx) => (
                  <span key={idx} className="px-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-600 rounded-md shadow-3xs">
                    {app}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4 w-full">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Engineering Parameters</h3>
                <p className="text-md font-bold text-slate-900 pt-0.5">Technical Specifications</p>
              </div>
              
              <div className="divide-y divide-slate-100 font-mono text-xs w-full">
                {product.specs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3.5 px-1 hover:bg-slate-50/50 transition-colors">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider pr-2">{spec.label}</span>
                    <span className="font-bold text-slate-900 text-right tracking-tight">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── NEW CRITICAL SECTION: SYSTEM COMPONENTS / FEATURED HARDWARE CARD GRID ── */}
        {relatedHardware && relatedHardware.length > 0 && (
          <section className="py-16 bg-slate-50 border-t border-b border-slate-200/60 w-full">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="border-b border-slate-200 pb-4 w-full">
                <span className="text-xs font-bold uppercase tracking-widest block" style={{ color: brandColor }}>
                  System Infrastructure Elements
                </span>
                <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight pt-1">
                  Featured Hardware Components
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {relatedHardware.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="group relative overflow-hidden flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-3xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 no-underline text-inherit"
                  >
                    {/* Perspective Product Image as Background */}
                    <div 
                      className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none select-none opacity-[0.18] transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-[0.32] z-0 bg-contain bg-no-repeat bg-right-bottom"
                      style={{ 
                        backgroundImage: `url(${getProductImageUrl(item)})`,
                        filter: "brightness(1.2) contrast(1.1)"
                      }}
                    />

                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">
                          {item.brand}
                        </span>
                        <span 
                          className="w-2 h-2 rounded-full opacity-60 transition-opacity group-hover:opacity-100" 
                          style={{ backgroundColor: brandColor }} 
                        />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-slate-955 m-0 pr-6">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-light m-0 line-clamp-3 pr-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-50 mt-5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-800 transition-colors relative z-10">
                      <span>View Specifications</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="transition-transform group-hover:translate-x-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 5: COMPLIANCE & BENEFITS ── */}
        <section className="py-16 bg-white w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="space-y-6 w-full">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regulatory Framework</h3>
                <p className="text-xl font-bold text-slate-900">Compliance Code Verification</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {product.compliance.map((comp, idx) => (
                  <div key={idx} className="p-5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs font-medium text-slate-700 shadow-3xs w-full">
                    <span className="pr-4 font-semibold">{comp}</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-md shrink-0">Verified</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 w-full">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operational Yield</h3>
                <p className="text-xl font-bold text-slate-900">Expected Performance Outcomes</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {product.benefits.map((benefit, idx) => (
                  <div key={idx} className="p-5 bg-white border border-slate-200 rounded-xl flex items-start gap-4 w-full">
                    <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-0.5 shadow-3xs">
                      ✓
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 font-semibold m-0 leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION 6: LIGHT CORPORATE INTAKE PANEL ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-20 w-full">
          <div className="bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl p-6 sm:p-10 md:p-16 text-center relative overflow-hidden shadow-xs w-full">
            <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: brandColor }} />
            
            <div className="max-w-2xl mx-auto space-y-4 relative z-10 w-full">
              <span className="text-xs font-bold uppercase tracking-[0.2em] block" style={{ color: brandColor }}>
                Procurement and Infrastructure Planning
              </span>
              <h2 className="text-2xl md:text-4xl font-light tracking-tight text-slate-900 uppercase">
                Request Engineering <br />
                <span className="font-bold block text-slate-950 mt-1">Integration Blueprints</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-normal max-w-xl mx-auto pt-1">
                Coordinate directly with our regional technical estimating group based in Dammam to compile custom infrastructure layouts, validation parameters, and comprehensive project quoting metrics.
              </p>
              <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-3 w-full">
                <ProductActions productTitle={product.title} accentColor={brandColor} layout="footer" />
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </main>
    </>
  );
}