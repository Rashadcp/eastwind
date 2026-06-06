import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductActions from "@/components/ProductActions";

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

const productsDb: Record<string, ProductDetailsData> = {
  // Core Platform Slugs
  "mimes": {
    title: "MIMES Wireless IIoT Platform",
    subLabel: "Wireless Industrial Telemetry",
    tagline: "Intrinsically Safe Zero-Cabling Instrument Bridging in Zone 0 Fields",
    accent: "blue",
    description: "Deploying robust, low-power mesh radios inside Class I Division 1 (Zone 0/1) hazardous areas. We interface with telemetry transmitters, temperature gauges, and gas sensors without trenches or cabling.",
    detailedContent: "MIMES is a revolutionary wireless data acquisition platform certified for Zone 0 environments. It leverages self-healing mesh radio technologies to capture telemetry from pressure, gas, and temperature instruments across wide geographic areas. Operating on ultra-low power, a single node can run for up to 10 years without a battery change, drastically lowering the total cost of ownership (TCO) of industrial telemetry deployments.",
    features: [
      "ATEX Ex ia IIC T4 Ga Certification for Zone 0/1",
      "10-Year continuous battery cell management",
      "Self-healing multi-hop mesh routing networks",
      "Seamless integration with SCADA & DCS gateways"
    ],
    compliance: ["ATEX Zone 0 / Class I Div 1 Certification", "IECEx Zone 0 Equipment Standard", "HCIS SEC-06 Telemetry Compliance"],
    specs: [
      { label: "Design Life", value: "10 Years Continuous" },
      { label: "Radio Frequencies", value: "2.4 GHz / 900 MHz ISM Band" },
      { label: "Enclosure Protection", value: "IP67 / NEMA 4X Weatherproof" },
      { label: "Max Transmission Range", value: "Up to 1,000m line-of-sight" }
    ],
    benefits: [
      "90% excavation & cabling cost reduction",
      "Zero-cabling deployment speed",
      "Enhanced crew safety by minimizing hazardous area visits"
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
      "Modbus/TCP deep packet inspection",
      "Unidirectional data diode isolation hardware",
      "HCIS SEC-09 compliant firewall zoning",
      "Real-time intrusion warning interlocks"
    ],
    compliance: ["HCIS SEC-09 Cyber Security Guidelines", "IEC 62443 Industrial Security Standard", "ISO 27001 Information Security Management"],
    specs: [
      { label: "Inspection Latency", value: "< 1.5ms" },
      { label: "Supported Protocols", value: "Modbus/TCP, OPC UA, DNP3, Ethernet/IP" },
      { label: "Enclosure Rating", value: "DIN-Rail mount IP30 Class I Div 2" },
      { label: "Throughput Capacity", value: "1 Gbps continuous DPI" }
    ],
    benefits: [
      "Zero Trust boundary defense for SCADA and DCS",
      "Immediate alert triggering during anomalous payload signature detections",
      "Ensured regulatory compliance with national OT security standards"
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
    detailedContent: "Tridiagonal is an advanced neural modeling platform incorporating Physics-Informed Machine Learning models. By combining classical thermodynamic and vibration math with modern neural network pipelines, it predicts issues like cavitation, bearing wear, and impeller imbalance up to 72 hours before traditional sensors trigger alert shut-offs.",
    features: [
      "Physics-Informed Machine Learning models",
      "Real-time FFT vibration spectrum calculations",
      "Continuous Remaining Useful Life (RUL) forecasting",
      "Automated safety trip prevention diagnostics"
    ],
    compliance: ["ISO 13374 Condition Monitoring standard", "ISO 10816 Mechanical Vibration guidelines", "HCIS SAF-01 Process Safety interlocks"],
    specs: [
      { label: "Early Warning Window", value: "48 to 72 Hours" },
      { label: "Model Training Ingestion", value: "Over 10TB history logs" },
      { label: "F1 Score Accuracy", value: "99.4% F1 anomaly prediction" },
      { label: "Inference response", value: "< 50ms per channel" }
    ],
    benefits: [
      "42% reduction in unplanned machinery maintenance costs",
      "Prevention of sudden production shutdowns and downstream loss",
      "Minimized hardware stress by adjusting process rates before failures"
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
    detailedContent: "One Seven is the global gold standard for Compressed Air Foam Systems (CAFS). By dosing precise foam concentrates and injecting high-pressure air into the water line, it expands a single drop of water into a high-energy foam blanket. This blanket smothers hydrocarbon vapors, blocks oxygen ingress, and prevents reignition on hot metal surfaces, making it indispensable for refinery tank farms.",
    features: [
      "Automated foam-water proportioning dosing loops",
      "High heat-absorption foam bubble engineering",
      "Water conservation rate of up to 90%",
      "Direct integration with Rosenbauer truck chassis"
    ],
    compliance: ["NFPA 11 Low-Expansion Foam Standard", "NFPA 1901 Fire Apparatus Specification", "HCIS SAF-01 Fire Fighting Vehicles"],
    specs: [
      { label: "Expansion Output Ratio", value: "1:7 to 1:15 Adjustable" },
      { label: "Extinguishing Output Rate", value: "2,000 to 10,000 LPM" },
      { label: "Operating Water Pressure", value: "8 to 12 Bar nominal" },
      { label: "Foam Dosing Accuracy", value: "0.1% to 1.0% electronic feedback" }
    ],
    benefits: [
      "Smothers heavy hydrocarbon fires in seconds",
      "Allows fire tenders to operate longer on limited water supplies",
      "Saves expensive refinery structures with rapid thermal cooling"
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
      "Oil-free compression loops for pure breathing air",
      "Multi-stage water separation & purge valves",
      "ATEX Zone 2 safe cabinet chassis options",
      "Cascade cylinder charging control panels"
    ],
    compliance: ["EN 12021 Breathing Air Standard", "ATEX Directive 2014/34/EU", "ASME Pressure Vessel Code Section VIII"],
    specs: [
      { label: "Max Operating Pressure", value: "350 Bar / 5000 PSI" },
      { label: "Flow Discharge Capacity", value: "300 to 700 Liters/Minute" },
      { label: "Air Quality Filtration", value: "CO/CO2/Moisture active monitoring" },
      { label: "Chassis Design", value: "Soundproofed galvanized steel canopy" }
    ],
    benefits: [
      "Provides pure, life-saving breathing air in toxic gas leaks",
      "Rapid recharge rates for escape cascade cylinder packs",
      "Continuous runtime under ambient temperatures up to 55°C"
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
    detailedContent: "TGR is a comprehensive infrastructure protection platform. Using acoustic emission sensors and micro-strain gauges, TGR audits the structural health of storage silos, steel pipelines, and concrete foundations. When combined with our blast-resistant modules and high-security isolation borders, TGR protects critical refinery control centers from both structural failure and explosion hazards.",
    features: [
      "Continuous acoustic micro-crack sound audits",
      "Finite Element Analysis (FEA) shock deflection modeling",
      "Skid-mounted modular blast shield enclosures",
      "Autonomous foundation stress alert warnings"
    ],
    compliance: ["HCIS SEC-02 & SEC-03 Directives", "A60 Marine Thermal Boundary rating", "ASTM E119 Fire Resistance standards"],
    specs: [
      { label: "Blast Overpressure Limit", value: "10 PSI (1.0 Bar equivalent)" },
      { label: "Fire Resistance Integrity", value: "2 Hours continuous hydrocarbon flame" },
      { label: "Acoustic Audits Latency", value: "Continuous real-time telemetry" },
      { label: "Installation Method", value: "Pre-assembled bolt-on modules" }
    ],
    benefits: [
      "Prevents catastrophic asset failure through early stress detection",
      "Protects operational personnel and controls during gas explosions",
      "Maintains HCIS SEC regulatory audit pass status continuously"
    ],
    applications: ["High-Security Borders", "Substation E-Houses", "Analyzer Shelter Protection", "Bulk Storage Tank Foundations"],
    imageUrl: "/critical_infrastructure.webp"
  }
};

const validDynamicSlugs = [
  "air-purified-respirators",
  "breathing-air-compressor",
  "calibration-gases",
  "chemical-protective-suits",
  "detergents-and-disinfectants",
  "diving-equipments",
  "drug-alcohol-monitoring",
  "emergency-escape-breathing-device",
  "gas-detection",
  "personal-protection",
  "self-contained-breathing-apparatus",
  "thermal-imaging-camera",
  "environmental-analysers",
  "protective-eye-wears",
  "helmets-for-fire-brigades",
  "test-equipment-workshop-software",
  "rescue-tool-kit",
  "fire-service",
  "marine",
  "oil-and-gas",
  "others",
  "testing-maintenance",
  "calibration",
  "marine-instruments-repair",
  "temporary-refuge-shelters",
  "fire-simulators",
  "breathing-air-cascade-systems",
  "fire-gas-systems",
  "diving-chambers",
  "oxygen-boosters-breathing-air-supply",
  "flow-metering-skids",
  "chemical-injection-skids",
  "hipps"
];

// Fallback dynamic generator for products in the navbar dropdown
function getDynamicProductData(slug: string): ProductDetailsData | null {
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (!validDynamicSlugs.includes(slug)) {
    return null;
  }

  const isBlue = [
    "calibration-gases",
    "drug-alcohol-monitoring",
    "environmental-analysers",
    "test-equipment-workshop-software",
    "marine",
    "testing-maintenance",
    "calibration",
    "marine-instruments-repair",
    "flow-metering-skids",
    "chemical-injection-skids"
  ].includes(slug);

  const accent = isBlue ? "blue" : "orange";

  const subLabel = "Industrial Safety Solutions";
  const tagline = "Certified high-compliance safety systems engineered for harsh atmospheres.";
  const description = `East Wind Safety supplies premium, certified ${title} solutions to the Marine, Oil & Gas, Petrochemical, Civil Defense, and Government sectors. Engineered for high-risk and harsh environments, our products prioritize active protection and absolute operational compliance.`;
  const detailedContent = `Our professional ${title} system represents the pinnacle of industrial safety engineering. We work directly with leading global safety brands to design, supply, install, and calibrate instrumentation. Every unit undergoes strict compliance auditing under NFPA, EN, ATEX, and local civil defense guidelines, ensuring that field operators remain protected during critical process operations or emergency events.`;
  
  const features = [
    "Certified for Class I Division 1 & Zone 0/1 environments",
    "Authorized premium brand engineering & components",
    "Fully integrated with standard plant safety loops",
    "Calibrated and tested in local EWS service facilities"
  ];
  
  const benefits = [
    "Ensures complete regulatory and code compliance",
    "Enhances operational longevity with rugged construction",
    "Reduces operator hazard risks in processing spaces"
  ];

  const specs = [
    { label: "Design Life", value: "10 Years Continuous" },
    { label: "Operating Temp Range", value: "-20°C to +60°C" },
    { label: "Enclosure Protection", value: "IP66 / IP67 Weatherproof" },
    { label: "Material Structure", value: "Corrosion-resistant steel/alloy" }
  ];

  const compliance = [
    "EN / ISO International Safety Standard Certified",
    "ATEX / IECEx Explosion-Proof Directives",
    "Local Civil Defense & Industrial Security Compliant"
  ];

  const applications = ["Hydrocarbon Processing", "Civil Defense & Fire Teams", "Industrial Refineries", "Marine Operations"];
  const imageUrl = isBlue ? "/wireless_monitoring.webp" : "/hazardous_mobility.webp";

  return {
    title,
    subLabel,
    tagline,
    accent,
    description,
    detailedContent,
    features,
    compliance,
    benefits,
    specs,
    applications,
    imageUrl
  };
}

export async function generateStaticParams() {
  const coreSlugs = Object.keys(productsDb);
  return [...coreSlugs, ...validDynamicSlugs].map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const slug = id || "";
  const product = productsDb[slug] || getDynamicProductData(slug);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="py-40 px-6 min-h-[80vh] bg-white flex flex-col items-center justify-center">
          <h2 className="text-2xl text-slate-900 mb-4 font-extrabold uppercase">PRODUCT NOT FOUND</h2>
          <p className="text-slate-500 mb-8 max-w-[420px] text-center">The requested product category does not exist or has been relocated.</p>
          <a href="/" className="btn-primary">Return to Homepage</a>
        </div>
        <Footer />
      </>
    );
  }

  const accentColor = product.accent === "blue" ? "var(--color-accent-blue)" : "var(--color-accent-orange)";

  return (
    <>
      <Navbar />
      
      {/* Spacer for Fixed Navbar */}
      <div className="h-20 bg-white" />

      <main className="min-h-screen bg-white text-slate-800 py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Back link - Styled purely with Tailwind for Hover, avoiding mouse event JS handlers */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--hover-color)] text-[0.85rem] mb-10 font-semibold no-underline transition-colors duration-200"
            style={{ "--hover-color": accentColor } as React.CSSProperties}
          >
            ← Back to Operations Portal
          </a>

          {/* 1. Product Hero */}
          <div className="product-hero-layout grid grid-cols-2 gap-[60px] items-center mb-20 max-lg:grid-cols-1 max-lg:gap-10">
            <div>
              <span 
                className="block font-mono text-[0.75rem] uppercase tracking-widest font-bold mb-3"
                style={{ color: accentColor }}
              >
                {product.subLabel}
              </span>
              <h1 className="text-[3rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-4 uppercase">
                {product.title}
              </h1>
              <p className="text-[1.2rem] text-slate-600 font-medium leading-normal mb-6">
                {product.tagline}
              </p>
              <p className="text-[1.05rem] text-slate-500 leading-relaxed mb-8 m-0">
                {product.description}
              </p>
              <ProductActions productTitle={product.title} accentColor={accentColor} layout="hero" />
            </div>

            <div className="rounded-[24px] overflow-hidden border border-slate-200/50 shadow-md">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-auto block" 
              />
            </div>
          </div>

          <hr className="border-none border-t border-slate-900/10 mb-15" />

          {/* 2-Column Info Grid */}
          <div className="product-details-grid grid grid-cols-[1.6fr_1.1fr] gap-20 max-lg:grid-cols-1 max-lg:gap-[50px]">
            
            {/* Left Column: Overview, Features & Applications */}
            <div className="flex flex-col gap-[60px]">
              {/* 2. Overview */}
              <div>
                <h2 className="text-[1.8rem] font-extrabold text-slate-900 mb-5">
                  Product Overview
                </h2>
                <p className="text-[1.05rem] text-slate-600 leading-relaxed m-0">
                  {product.detailedContent}
                </p>
              </div>

              {/* 3. Key Features */}
              <div>
                <h2 className="text-[1.8rem] font-extrabold text-slate-900 mb-5">
                  Key Features
                </h2>
                <div className="flex flex-col gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <span 
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[0.85rem] shrink-0"
                        style={{ 
                          backgroundColor: product.accent === "blue" ? "rgba(2, 132, 199, 0.08)" : "rgba(217, 119, 6, 0.08)", 
                          color: accentColor 
                        }}
                      >
                        ✓
                      </span>
                      <p className="text-[1rem] text-slate-600 leading-normal m-0">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Applications */}
              <div>
                <h2 className="text-[1.8rem] font-extrabold text-slate-900 mb-5">
                  Target Industries & Applications
                </h2>
                <div className="apps-grid grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  {product.applications.map((app, index) => (
                    <div 
                      key={index} 
                      className="p-[16px_20px] bg-slate-50 rounded-xl border border-slate-200/50 text-[0.95rem] font-semibold text-slate-800"
                    >
                      {app}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Specifications & Benefits */}
            <div className="flex flex-col gap-[60px]">
              {/* 5. Technical Specifications */}
              <div>
                <h2 className="text-[1.6rem] font-extrabold text-slate-900 mb-5">
                  Technical Specifications
                </h2>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full border-collapse text-[0.85rem]">
                    <tbody>
                      {product.specs.map((spec, index) => (
                        <tr 
                          key={index} 
                          className="border-b last:border-b-0 border-slate-100"
                          style={{ backgroundColor: index % 2 === 0 ? "#F8FAFC" : "#ffffff" }}
                        >
                          <td className="p-[12px_16px] font-semibold text-slate-500">{spec.label}</td>
                          <td className="p-[12px_16px] font-bold text-slate-900 text-right">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. Benefits */}
              <div>
                <h2 className="text-[1.6rem] font-extrabold text-slate-900 mb-5">
                  Operational Benefits
                </h2>
                <div className="flex flex-col gap-4">
                  {product.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <span 
                        className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" 
                        style={{ backgroundColor: accentColor }}
                      />
                      <p className="text-[0.95rem] text-slate-600 leading-relaxed m-0">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* 7. Call To Action Footer */}
          <div 
            id="contact"
            className="mt-20 p-[60px] max-sm:p-8 bg-slate-50 rounded-[24px] border border-slate-200/50 text-center"
          >
            <h2 className="text-[2.2rem] max-sm:text-2xl font-extrabold text-slate-900 mb-4">
              Request Technical Integration Specifications
            </h2>
            <p className="text-[1.1rem] text-slate-600 max-w-[600px] mx-auto mb-8 leading-relaxed">
              Discuss custom layout designs, certifications compliance parameters, and project quotes with our senior engineering team.
            </p>
            <ProductActions productTitle={product.title} accentColor={accentColor} layout="footer" />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
