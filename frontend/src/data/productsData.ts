// src/data/productsData.ts

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  features: string[];
  specifications: { label: string; value: string }[];
  imageUrl?: string;
}

export function getProductImageUrl(product: ProductItem): string {
  if (product.imageUrl) {
    if (product.imageUrl.startsWith("/uploads/")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      return `${baseUrl}${product.imageUrl}`;
    }
    return product.imageUrl;
  }
  
  // Specific overrides based on ID
  switch (product.id) {
    case "smoke-detector":
      return "/products/smoke-detector.png";
    case "gas-detector":
      return "/products/gas-detector.png";
    case "xshielder-phone":
      return "/products/xshielder-phone.png";
    case "wireless-converter":
      return "/products/wireless-converter.png";
    case "pressure-transmitter":
      return "/products/pressure-transmitter.png";
    default:
      break;
  }

  // Category fallback mapping
  switch (product.category) {
    case "fire-fighting-rescue":
      return "/products/default-fire-fighting-rescue.png";
    case "respiratory-protection":
      return "/products/default-respiratory-protection.png";
    case "wireless-gas-detection":
      return "/products/default-wireless-gas-detection.png";
    case "process-instrumentation":
      return "/products/default-process-instrumentation.png";
    case "explosion-proof-products":
      return "/products/default-explosion-proof-products.png";
    default:
      return "/products/default-explosion-proof-products.png";
  }
}

export const PRODUCT_BRANDS = [
  { id: "one-seven", name: "One Seven" },
  { id: "sione", name: "SIONE" },
  { id: "paratech", name: "Paratech" },
  { id: "nardi", name: "Nardi Compressor" },
  { id: "xshielder", name: "Xshielder" },
  { id: "mimes", name: "Mimes" },
  { id: "atexor", name: "Atexor" },
  { id: "poly-hose", name: "Poly Hose" },
  { id: "key-connections", name: "Key Connections" },
  { id: "cejn", name: "CEJN" },
  { id: "thermo-cable", name: "Thermo Cable" }
] as const;

export const PRODUCT_CATEGORIES = [
  { id: "fire-fighting-rescue", name: "Fire Fighting & Rescue Application" },
  { id: "respiratory-protection", name: "Respiratory Protection Infrastructure" },
  { id: "wireless-gas-detection", name: "Wireless Gas Detection Systems" },
  { id: "process-instrumentation", name: "Process & Instrumentation Modules" },
  { id: "explosion-proof-products", name: "Explosion-Proof Classified Products" }
] as const;

export const productsDb: ProductItem[] = [
  // ─── CATEGORY 1: FIRE FIGHTING & RESCUE APPLICATION ──────────────────────
  {
    id: "fire-truck",
    slug: "industrial-fire-truck",
    name: "AI-Integrated Industrial Fire Truck",
    brand: "One Seven",
    category: "fire-fighting-rescue",
    description: "Premium high-capacity rapid intervention response vehicle integrated with intelligent crew telemetry routing systems and advanced fire suppression skids.",
    features: [
      "Rosenbauer custom high-durability modular cabin engineering",
      "Real-time integration with centralized safety incident command nodes",
      "High-pressure water utility protection logic links"
    ],
    specifications: [
      { label: "Chassis Base", value: "Heavy-duty custom industrial framework" },
      { label: "Suppression Tech", value: "One Seven integrated system panel" },
      { label: "Compliance Index", value: "Saudi Civil Defense approved configuration" }
    ]
  },
  {
    id: "one-seven-cafs",
    slug: "one-seven-cafs-system",
    name: "Compressed Air Foam System (CAFS)",
    brand: "One Seven",
    category: "fire-fighting-rescue",
    description: "Patented energy foam generation framework that expands water surface coverage exponentially while slashing industrial fluid footprints.",
    features: [
      "Up to 90% water conservation utility efficiency margins",
      "Rapid suppression layer blanket deployment for volatile hydrocarbon blazes",
      "Unified mechanical air-foam mixing loop control panels"
    ],
    specifications: [
      { label: "Expansion Core Ratio", value: "Custom high-energy expansion matrices" },
      { label: "Foam Medium Types", value: "Class A and Class B hydrocarbon concentrates" },
      { label: "Certification", value: "NFPA 11 / NFPA 16 compliance standards" }
    ]
  },
  {
    id: "sione-hood",
    slug: "sione-structural-fire-hood",
    name: "SIONE Structural Fire Hood",
    brand: "SIONE",
    category: "fire-fighting-rescue",
    description: "Premium particulate barrier safety hood engineered to shield emergency response crews against aggressive micro-toxins and extreme ambient radiation loops.",
    features: [
      "Advanced nanolayer tracking structure prevents carcinogen infiltration",
      "Ergonomic flat-lock seam engineering optimized for SCBA mask pairing",
      "High-breathability thermal composition fabric matrices"
    ],
    specifications: [
      { label: "Thermal Threshold", value: "Stable up to 450°C continuous radiation exposure" },
      { label: "Filtration Efficiency", value: "99.9% particulate block capability" },
      { label: "Material Composition", value: "SIONE multi-layer meta-aramid composite blend" }
    ]
  },
  {
    id: "sione-fire-suit",
    slug: "sione-structural-fire-suit",
    name: "SIONE Structural Turnout Fire Suit",
    brand: "SIONE",
    category: "fire-fighting-rescue",
    description: "High-tier multi-layered turnout apparel providing critical thermal protection loops for close-range industrial firefighting operations.",
    features: [
      "Heavily reinforced stress points with impact-resistant aramid pads",
      "Moisture-wicking internal barrier controls rapid heat-stress accumulation",
      "Integrated rescue dragging strap device on upper shoulder deck"
    ],
    specifications: [
      { label: "Outer Shell Layer", value: "Premium Nomex tough ripstop weave" },
      { label: "Moisture Barrier", value: "Gore-Tex breathable ePTFE structural liner" },
      { label: "Standard Baseline", value: "EN 469 / NFPA 1971 certified index" }
    ]
  },
  {
    id: "fire-gloves",
    slug: "premium-firefighting-gloves",
    name: "Heavy Industrial Firefighting Gloves",
    brand: "SIONE",
    category: "fire-fighting-rescue",
    description: "Heavy-duty heat-insulated structural gloves providing high tactile dexterity paired with exceptional puncture defense lines.",
    features: [
      "Silicon-coated Kevlar structural grips across entire hand surface",
      "Reinforced knuckle defense shells guarding against mechanical crushes",
      "Extended safety cuff element designed to tuck into structural suit cuffs"
    ],
    specifications: [
      { label: "Mechanical Protection", value: "EN 388 Level 4 puncture index" },
      { label: "Thermal Stability", value: "Zero shrinkage up to 250°C contact layers" },
      { label: "Material", value: "Treated grain leather with composite backing" }
    ]
  },
  {
    id: "fire-boots",
    slug: "insulated-firefighting-boots",
    name: "Insulated Structural Firefighting Boots",
    brand: "SIONE",
    category: "fire-fighting-rescue",
    description: "Vulcanized safety rubber firefighting boots outfitted with impact-resistant steel caps and high-voltage grid insulation loops.",
    features: [
      "Completely pierce-proof steel mid-sole configuration inserts",
      "Highly slip-resistant rubber tread profiles certified for heavy sludge fields",
      "Flame-retardant thermal structural insulation layers throughout"
    ],
    specifications: [
      { label: "Dielectric Capacity", value: "Tested up to 5kV grid isolation limits" },
      { label: "Impact Defense", value: "Steel cap rating exceeding 200 Joules" },
      { label: "Compliance Index", value: "EN ISO 20345 / NFPA 1971" }
    ]
  },
  {
    id: "fire-helmet",
    slug: "premium-fire-helmet-system",
    name: "Premium Structural Fire Helmet System",
    brand: "SIONE",
    category: "fire-fighting-rescue",
    description: "High-grade thermoplastic safety helmet system featuring dual visor elements and built-in interface tracks for communication loops.",
    features: [
      "Impact absorption interior shell lined with high-density polyurethane foam",
      "Integrated clear face shield plus gold panoramic high-heat visor loops",
      "Adjustable ratchet headband suspension customized for gloved operation"
    ],
    specifications: [
      { label: "Shell Material", value: "High-temperature injection-molded composite" },
      { label: "Visor Rating", value: "Certified block against fast particulate impacts" },
      { label: "Compliance Index", value: "EN 443 / NFPA 1971 safety standard" }
    ]
  },
  {
    id: "paratech-rescue-kit",
    slug: "paratech-heavy-rescue-system",
    name: "Paratech Heavy Rescue Shoring System",
    brand: "Paratech",
    category: "fire-fighting-rescue",
    description: "Premium tactical pneumatic shoring cylinders and structural lift tools engineered to stabilize collapsed industrial infrastructure safely.",
    features: [
      "High-pressure pneumatic cylinder lines optimized for zero manual effort",
      "Interlocking modular strut layout arrays for high structural load flexibility",
      "Heavy-duty alloy build matching rigorous Middle East industrial context variables"
    ],
    specifications: [
      { label: "Strut Lifting Index", value: "Exceeding 20 metric tons capacity benchmarks" },
      { label: "Operating Pressure", value: "Up to 15 bar high-capacity pneumatic setups" },
      { label: "Material Profile", value: "Aircraft-grade hardened structural aluminium base" }
    ]
  },
  {
    id: "chemical-suit",
    slug: "cbrn-chemical-protection-suit",
    name: "CBRN Chemical Protection Suit",
    brand: "Paratech",
    category: "fire-fighting-rescue",
    description: "Gas-tight Type 1a chemical defense containment suit engineered to isolate technicians completely from aggressive industrial fluid splashes and gaseous agents.",
    features: [
      "Multi-layered barrier material resistant to chemical permeation profiles",
      "Expanded rear pouch layout built to internalise critical SCBA assets safely",
      "Heavy-duty dual gas-tight zip systems with safety closure flaps"
    ],
    specifications: [
      { label: "Classification Index", value: "Type 1a EN 943-2 certified safety envelope" },
      { label: "Exhaust Valves", value: "Dual overpressure ventilation control vents" },
      { label: "Visor Material", value: "Rigid Teflon-coated impact-resistant composite shield" }
    ]
  },

  // ─── CATEGORY 2: RESPIRATORY PROTECTION INFRASTRUCTURE ───────────────────
  {
    id: "nardi-compressor",
    slug: "nardi-breathing-air-compressor",
    name: "Nardi High-Pressure Breathing Air Compressor",
    brand: "Nardi",
    category: "respiratory-protection",
    description: "Premium heavy-duty reciprocating compressor terminal equipped with a multi-stage active air purification filter array.",
    features: [
      "On-site processing loops produce certified, pristine Grade-D breathable air",
      "Automated electronic condensation drain management systems",
      "Heavy vibration-damping structural sub-frames optimized for high-noise areas"
    ],
    specifications: [
      { label: "Working Pressure", value: "Up to 330 Bar continuous charging limits" },
      { label: "Flow Volume Speed", value: "Custom high-output flow rate variants" },
      { label: "Compliance Index", value: "EN 12021 clean breathable air specification" }
    ]
  },
  {
    id: "scba-system",
    slug: "self-contained-breathing-apparatus",
    name: "Self-Contained Breathing Apparatus (SCBA)",
    brand: "Nardi",
    category: "respiratory-protection",
    description: "High-grade industrial SCBA pack incorporating an ergonomic backplate chassis, safety pressure reduction links, and a clear panoramic mask setup.",
    features: [
      "Positive pressure demand configuration guarantees zero external gas leak-in",
      "Ultra-lightweight carbon composite storage cylinder choices",
      "Integrated audible low-air pressure alarm warning modules"
    ],
    specifications: [
      { label: "Cylinder Pressure", value: "300 Bar certified structural rating" },
      { label: "Duration Capacity", value: "Up to 45 or 60 minute operation variants" },
      { label: "Compliance Baseline", value: "EN 137 Type 2 Industrial safety specification" }
    ]
  },
  {
    id: "cascade-system",
    slug: "breathing-air-cascade-system",
    name: "Breathing Air Cylinder Cascade Station",
    brand: "Nardi",
    category: "respiratory-protection",
    description: "High-capacity heavy-duty multi-cylinder cascade manifold rig configured to store critical breathing reserves and supply remote airline loops.",
    features: [
      "Sequential loop logic panel allows for maximum efficiency while filling empty tanks",
      "Dual supply manifold channels allow for continuous operations during replacement loops",
      "Hardened structural protection steel frame built for harsh environments"
    ],
    specifications: [
      { label: "Bank Cylinder Count", value: "4-bank, 8-bank, or custom layout profiles" },
      { label: "Max System Loading", value: "350 Bar safe working threshold capacity" },
      { label: "Valving Matrix", value: "Hardened stainless steel fine needle control loops" }
    ]
  },
  {
    id: "polyhose-breathing",
    slug: "poly-hose-breathing-air-line",
    name: "Poly Hose High-Pressure Breathing Air Hose",
    brand: "Poly Hose",
    category: "respiratory-protection",
    description: "Specialised multi-layered high-pressure and low-pressure hose units built explicitly for continuous airline breathing applications.",
    features: [
      "Inner tube material preserves absolute gas purity without adding odors",
      "High-tensile synthetic fiber reinforcement layers handle pressure spikes safely",
      "Extremely robust outer jacket resistant to abrasion, ozone, and hydrocarbon fluid splashes"
    ],
    specifications: [
      { label: "Pressure Class Track", value: "High-Pressure and Low-Pressure deployment variants" },
      { label: "Safety Burst Factor", value: "4:1 structural margin safety ratio" },
      { label: "Compliance Index", value: "EN 14593 / EN 14594 respiratory framework" }
    ]
  },
  {
    id: "cejn-connections",
    slug: "cejn-pneumatic-safety-couplings",
    name: "CEJN Smart Safety Pneumatic Connections",
    brand: "CEJN",
    category: "respiratory-protection",
    description: "Premium quick-connect coupling terminals engineered to prevent accidental line separation in breathing air supply systems.",
    features: [
      "Two-stage safety release mechanism vents pressure safely before disconnecting",
      "High-flow flow path design minimizes pressure drops across connection points",
      "Streamlined profile helps prevent the coupling from snagging on facility infrastructure"
    ],
    specifications: [
      { label: "Material Composition", value: "Chrome-plated brass or high-grade stainless steel" },
      { label: "Flow Capacity Index", value: "Optimised high-flow rate tracking setup" },
      { label: "Connection Lock", value: "Self-locking automatic safety collar mechanism" }
    ]
  },
  {
    id: "hose-reel",
    slug: "industrial-respiratory-hose-reel",
    name: "Industrial Respiratory Hose Reel Station",
    brand: "Key Connections",
    category: "respiratory-protection",
    description: "Heavy-duty steel supply reel configured to store and deploy long lengths of breathing air line in high-risk zones.",
    features: [
      "Spark-free automatic rewinding assembly mechanisms",
      "Full-flow internal swivel hubs prevent line kinking during fast pay-outs",
      "Corrosion-resistant epoxy powder coating built for harsh desert climates"
    ],
    specifications: [
      { label: "Line Length Capacity", value: "Accommodates up to 50 or 100 meters of safety line" },
      { label: "Chassis Material", value: "Heavy-gauge reinforced carbon steel bracket" },
      { label: "Fluid Path", value: "Clean stainless steel core tube layout assembly" }
    ]
  },

  // ─── CATEGORY 3: WIRELESS GAS DETECTION SYSTEMS ──────────────────────────
  {
    id: "mimes-beacon",
    slug: "mimes-wireless-safety-beacon",
    name: "Mimes Industrial Wireless Safety Beacon",
    brand: "Mimes",
    category: "wireless-gas-detection",
    description: "High-visibility wireless visual signaling node integrated into self-healing field sensor mesh network paths.",
    features: [
      "High-intensity xenon strobe light elements provide clear, long-distance visual alert signaling",
      "Low-power wireless layout modules extend on-site battery operational lifespans up to a decade",
      "Rugged weatherproof housing optimized to perform reliably in extreme desert sandstorms"
    ],
    specifications: [
      { label: "Network Protocol", value: "ISA100.11a / WirelessHART secure protocol bridging" },
      { label: "Visibility Output", value: "360-degree high-candela flashing light field" },
      { label: "Ingress Shield Index", value: "IP66 / IP67 certified structural dust seal" }
    ]
  },
  {
    id: "mimes-sounder",
    slug: "mimes-wireless-alarm-sounder",
    name: "Mimes Wireless High-Output Alarm Sounder",
    brand: "Mimes",
    category: "wireless-gas-detection",
    description: "High-decibel audible alarm warning node configured to receive automated emergency process loop commands via secure radio arrays.",
    features: [
      "Multi-tone electronic sounder array allows for distinctive facility-wide hazard alerts",
      "Fully wireless network routing eliminates the need for expensive trenching layouts",
      "Synchronized alarm firing loops prevent acoustic distortion across dense processing fields"
    ],
    specifications: [
      { label: "Acoustic Decibel DBA", value: "115dB dynamic output at 1 meter distance" },
      { label: "Operating Frequency", value: "2.4GHz / 868MHz low-frequency wireless options" },
      { label: "Ex Classification", value: "ATEX Zone 1 explosion-proof certified build" }
    ]
  },
  {
    id: "wireless-mcp",
    slug: "mimes-wireless-manual-call-point",
    name: "Mimes Wireless Manual Call Point (MCP)",
    brand: "Mimes",
    category: "wireless-gas-detection",
    description: "Intrinsically safe wireless manual alarm terminal that allows operators to trigger facility emergency shutdown systems instantly.",
    features: [
      "Impact-resistant break-glass or lift-flap activation mechanisms",
      "Cryptographic frequency-hopping technology prevents signal jamming risks",
      "Highly visible design with clear physical status indicator flags"
    ],
    specifications: [
      { label: "Ex Validation Class", value: "Ex-ia IIC T4 Intrinsically Safe listing" },
      { label: "Battery Life Metric", value: "Up to 10 year continuous monitoring configuration" },
      { label: "Compliance Index", value: "EN 54-11 / NFPA 72 reference benchmark" }
    ]
  },
  {
    id: "smoke-detector",
    slug: "mimes-wireless-smoke-detector",
    name: "Mimes Wireless Photoelectric Smoke Detector",
    brand: "Mimes",
    category: "wireless-gas-detection",
    description: "Intrinsically safe wireless smoke detection node utilizing an advanced optical sensing chamber for early fire detection in industrial zones.",
    features: [
      "Smart algorithms reduce false alerts caused by airborne dust and sand parameters",
      "Automated continuous internal self-testing loops verify sensor cleanliness profiles",
      "Wireless transmitter links directly to control room SCADA telemetry systems"
    ],
    specifications: [
      { label: "Sensing Element Type", value: "Advanced Photoelectric scattering optical block" },
      { label: "Zoning Certification", value: "ATEX Zone 1 and Class I Division 1 certified build" },
      { label: "Network Link", value: "Self-healing mesh radio protocol bridging" }
    ]
  },
  {
    id: "heat-detector",
    slug: "mimes-wireless-heat-detector",
    name: "Mimes Wireless Intelligent Heat Detector",
    brand: "Mimes",
    category: "wireless-gas-detection",
    description: "Rugged wireless thermal tracking node providing dual rate-of-rise and fixed temperature monitoring paths for fast-burning fires.",
    features: [
      "Dual thermal monitoring circuits provide rapid response to fast-growing fires",
      "Sealed electronic modules stand up to high humidity and corrosive process air",
      "Low battery level flags are transmitted automatically to centralized dashboards"
    ],
    specifications: [
      { label: "Thermal Limit Focus", value: "Fixed 58°C limit or rapid rate-of-rise trigger logic" },
      { label: "Wireless Coverage", value: "Up to 500 meters line-of-sight signal transmission range" },
      { label: "Standard Baseline", value: "FM approved / UL listed compliance profile" }
    ]
  },
  {
    id: "gas-detector",
    slug: "mimes-wireless-gas-detector",
    name: "Mimes Wireless SIL2 Gas Detector",
    brand: "Mimes",
    category: "wireless-gas-detection",
    description: "High-precision wireless gas detection transmitter designed to spot toxic leaks or combustible hydrocarbon gas build-ups in real-time.",
    features: [
      "Interchangeable smart sensor heads optimized for toxic gases (H2S, CO) or combustible leaks",
      "SIL2 certified control loop reliability index for high-consequence areas",
      "Integrated local LCD monitor displays clear concentration readouts directly on the field floor"
    ],
    specifications: [
      { label: "Sensing Core Options", value: "Electrochemical, Catalytic Bead, or Infrared Point sensing" },
      { label: "Safety Integrity", value: "IEC 61508 SIL 2 certified functional safety architecture" },
      { label: "Wireless Protocol", value: "ISA100.11a / WirelessHART secure protocol bridging" }
    ]
  },

  // ─── CATEGORY 4: PROCESS & INSTRUMENTATION MODULES ───────────────────────
  {
    id: "wireless-converter",
    slug: "wired-to-wireless-converting-system",
    name: "Wired-to-Wireless Field Converting Gateway",
    brand: "Mimes",
    category: "process-instrumentation",
    description: "Industrial interface module configured to convert conventional analog 4-20mA or Modbus wired loops into secure wireless data flows.",
    features: [
      "Instantly upgrades legacy hardware to wireless status without modifying field wiring",
      "Dual input ports accommodate multiple analog instrumentation signals simultaneously",
      "Hardened explosion-proof housing built for reliable outdoor installations"
    ],
    specifications: [
      { label: "Input Channel Range", value: "4-20 mA loops, 1-5V signals, or digital RS-485 Modbus" },
      { label: "Output Wireless Radio", value: "Encrypted ISA100 / WirelessHART data streams" },
      { label: "Enclosure Protection", value: "Ex-d flameproof heavy terminal barrel" }
    ]
  },
  {
    id: "level-transmitter",
    slug: "mimes-wireless-level-transmitter",
    name: "Mimes Wireless Guided Wave Level Transmitter",
    brand: "Mimes",
    category: "process-instrumentation",
    description: "Advanced wireless level transmitter configured to track fluid interfaces accurately inside high-pressure storage tanks.",
    features: [
      "Radar echo tracking handles shifting fluid density and steam parameters smoothly",
      "Non-contact or guided-wave probe setups handle corrosive chemical fluids easily",
      "Wireless transmitter links directly to tank farm inventory management servers"
    ],
    specifications: [
      { label: "Measurement Range", value: "Up to 30 meters continuous fluid level depth" },
      { label: "Accuracy Threshold", value: "±2mm precise resolution tracking calibration" },
      { label: "Pressure Limit Base", value: "Stable up to 40 bar process container load forces" }
    ]
  },
  {
    id: "temp-transmitter",
    slug: "mimes-wireless-temperature-transmitter",
    name: "Mimes Wireless Multipoint Temperature Transmitter",
    brand: "Mimes",
    category: "process-instrumentation",
    description: "High-stability wireless temperature tracking module compatible with multi-element RTD and thermocouple inputs.",
    features: [
      "Advanced cold-junction compensation ensures high measurement accuracy",
      "Supports multipoint temperature logging to monitor thermal profiles across large vessels",
      "Low power circuitry design runs on long-lasting internal battery packs"
    ],
    specifications: [
      { label: "Sensor Input Support", value: "Pt100, Pt1000 RTDs, plus Type K/J/T thermocouples" },
      { label: "Resolution Margin", value: "0.01°C high-accuracy digital step" },
      { label: "Radio Link Profile", value: "Low-frequency secure mesh communications array" }
    ]
  },
  {
    id: "steam-trap-monitor",
    slug: "wireless-steam-trap-monitor",
    name: "Wireless Acoustic Steam Trap Monitor",
    brand: "Mimes",
    category: "process-instrumentation",
    description: "Non-intrusive wireless acoustic sensor node engineered to identify steam trap blow-through or blockage conditions instantly.",
    features: [
      "Clamp-on installation allows for fast setup without cutting into active pipe infrastructure",
      "Combines ultrasonic acoustic monitoring with pipe surface temperature tracking",
      "Automated logic flags energy loss and system failures immediately on control screens"
    ],
    specifications: [
      { label: "Sensing Technology", value: "Ultrasonic acoustic band tracking with thermal contact sensors" },
      { label: "Installation Type", value: "Non-intrusive dual locking heavy clamp setup" },
      { label: "Operating Boundary", value: "Handles pipe temperatures up to 400°C safely" }
    ]
  },
  {
    id: "pressure-transmitter",
    slug: "mimes-wireless-pressure-transmitter",
    name: "Mimes Wireless Process Pressure Transmitter",
    brand: "Mimes",
    category: "process-instrumentation",
    description: "Highly accurate wireless pressure transmitter built to monitor gauge or absolute pressure levels in extreme chemical process loops.",
    features: [
      "Piezoresistive sensing cell with built-in thermal compensation loops",
      "Overpressure safety limit barriers protect the internal sensor from process spikes",
      "Corrosion-resistant metal alloy diaphrams ensure long operational lifespans"
    ],
    specifications: [
      { label: "Calibrated Pressure", value: "Vacuum scales up to 700 bar high-pressure tracking" },
      { label: "Accuracy Core Index", value: "±0.075% calibrated span stability index" },
      { label: "Wetted Metals Base", value: "Hastelloy C-276 / 316L Stainless Steel options" }
    ]
  },
  {
    id: "flow-transmitter",
    slug: "mimes-wireless-flow-transmitter",
    name: "Mimes Wireless Differential Flow Transmitter",
    brand: "Mimes",
    category: "process-instrumentation",
    description: "High-precision differential pressure flow transmitter designed to log fluid transfer rates cleanly and transmit data via wireless mesh networks.",
    features: [
      "Optimised for volumetric flow calculations across orifice plates or venturi tubes",
      "Primary seal modules prevent process fluid migration into the electronics cavity",
      "Integrates smoothly with active facility loop tuning architectures"
    ],
    specifications: [
      { label: "DP Range Span", value: "Custom calibrated differential pressure spans" },
      { label: "Data Sample Interval", value: "User-configurable updates from 1 second to 1 hour" },
      { label: "Zoning Standard", value: "Class I Div 1 / ATEX Zone 0 safety listing" }
    ]
  },

  // ─── CATEGORY 5: EXPLOSION-PROOF CLASSIFIED PRODUCTS ─────────────────────
  {
    id: "xshielder-phone",
    slug: "xshielder-intrinsically-safe-smartphone",
    name: "Xshielder ATEX Zone 1 Smartphone",
    brand: "Xshielder",
    category: "explosion-proof-products",
    description: "Premium intrinsically safe Android smartphone certified for safe communication directly inside volatile, explosive gas atmospheres.",
    features: [
      "ATEX / IECEx Zone 1 spark-free internal architecture certifications",
      "Thick capacitive touch screen calibrated for use with heavy industrial work gloves",
      "Hardened, shock-absorbing frame built to withstand severe drops onto concrete"
    ],
    specifications: [
      { label: "Operating OS System", value: "Hardened Android Enterprise edition with secure data encryption" },
      { label: "Ingress Protection", value: "IP68 certified water submerge and dust block seal" },
      { label: "Hazard Validation", value: "Ex-ib IIC T4 Gb dynamic protection ranking" }
    ]
  },
  {
    id: "ex-lights",
    slug: "atexor-explosion-proof-led-luminaire",
    name: "Atexor Explosion-Proof LED Luminaire",
    brand: "Atexor",
    category: "explosion-proof-products",
    description: "High-output, heavy-duty explosion-proof LED light fixtures engineered to provide safe, dependable lighting in hazardous Zone 1 and 21 workspaces.",
    features: [
      "Copper-free aluminum alloy housing with excellent thermal dissipation properties",
      "Impact-resistant, tempered glass lens protects the high-efficiency LED matrix",
      "Emergency backup battery options supply continuous light during power failure loops"
    ],
    specifications: [
      { label: "Luminous Efficacy", value: "140 lumens per watt high-output economy" },
      { label: "Zoning Validation", value: "ATEX / IECEx Zone 1, 2, 21, and 22 certified" },
      { label: "Voltage Operational", value: "Universal 90-305 VAC grid input tracking links" }
    ]
  },
  {
    id: "custom-enclosure",
    slug: "custom-ex-d-flameproof-enclosure",
    name: "Custom Ex-d Flameproof Control Enclosure",
    brand: "Atexor",
    category: "explosion-proof-products",
    description: "Custom-engineered flameproof control and junction box enclosures tailored to house conventional electrical gear safely in classified fields.",
    features: [
      "Heavy flame-path threads cool internal combustion gases before they escape",
      "Stainless steel cover bolts prevent corrosion freeze in harsh chemical areas",
      "Internal mounting plates and wiring terminals layout customized to client blueprints"
    ],
    specifications: [
      { label: "Protection Variant", value: "Ex-d Flameproof / Ex-e Increased Safety options" },
      { label: "Material Profile", value: "Marine-grade copper-free cast aluminium or 316L stainless steel" },
      { label: "Certification Base", value: "IECEx / ATEX component compliance dossier approved" }
    ]
  },
  {
    id: "thermocable-linear",
    slug: "thermocable-linear-heat-detection-cable",
    name: "Thermo Cable Digital Linear Heat Detection Cable",
    brand: "Thermo Cable",
    category: "explosion-proof-products",
    description: "Advanced continuous linear heat detection cable designed to monitor temperature spikes along cable trays, conveyors, and storage tanks.",
    features: [
      "Twisted pair polymer-insulated conductors short-circuit at specific temperature limits to trip alarms instantly",
      "Can be integrated directly into hazardous zones using simple zener safety barriers",
      "Outer shielding options include chemical-resistant polymers or heavy stainless steel braiding"
    ],
    specifications: [
      { label: "Trigger Temperature", value: "Available in 68°C, 88°C, 105°C, or 185°C variants" },
      { label: "Zone Interface Link", value: "Connects directly to conventional fire alarm panel loops" },
      { label: "Maximum Run Track", value: "Up to 3,000 meters continuous monitoring per zone line" }
    ]
  }
];