"use client";

import { useState } from "react";

interface EcosystemDevice {
  id: string;
  name: string;
  code: string;
  description: string;
  specs: { label: string; value: string }[];
  exZone: string;
  range: string;
  power: string;
  flowPath: string[];
}

const ecosystemDevices: Record<string, EcosystemDevice[]> = {
  inputs: [
    {
      id: "mimes-io",
      name: "Radio Hub IO",
      code: "MIMES-RH-IO",
      description: "Intrinsically safe wireless I/O transceiver interfacing directly with field analog and digital instruments. Eliminates localized field cable loops.",
      specs: [
        { label: "Signal Support", value: "4-20mA / HART / Digital dry contacts" },
        { label: "Safety Classification", value: "ATEX Zone 1 II 2G Ex d [ia] IIC T6" },
        { label: "Battery Chemistry", value: "Lithium Thionyl Chloride (Li-SOCl2)" },
        { label: "Design Life", value: "Up to 10 Years battery life" }
      ],
      exZone: "Zone 1 / Zone 2",
      range: "1,000m line-of-sight",
      power: "Battery (Autonomous)",
      flowPath: ["FIELD INSTRUMENT", "RADIO HUB IO", "WIRELESS MESH AP", "PLC / DCS HOST"]
    },
    {
      id: "mimes-m80",
      name: "Radio Hub M80",
      code: "MIMES-RH-M80",
      description: "High-density multi-input wireless telemetry terminal supporting up to 8 sensor channels in a compact, weather-proof Ex protection enclosure.",
      specs: [
        { label: "Capacity", value: "8 Analog/Digital Channels" },
        { label: "Enclosure Protection", value: "IP66 / GRP reinforced alloy" },
        { label: "Temperature Class", value: "T6 (-40°C to +85°C)" },
        { label: "Protocols", value: "ISA100.11a / WirelessHART / LoRa" }
      ],
      exZone: "Zone 1 / Zone 2",
      range: "1,200m line-of-sight",
      power: "Battery / 24VDC option",
      flowPath: ["8 FIELD SENSORS", "RADIO HUB M80", "WIRELESS MESH AP", "DCS CONTROL LOOP"]
    },
    {
      id: "mimes-serial",
      name: "RadioHub Serial (RH-SE)",
      code: "MIMES-RH-SE",
      description: "Bidirectional Modbus RTU to wireless transmitter, bridging existing multi-drop RS485 loops directly into the wireless telemetry network.",
      specs: [
        { label: "Interface", value: "RS-485 Modbus RTU" },
        { label: "Baud Rates", value: "9600 to 115200 bps" },
        { label: "Protection Style", value: "Flameproof Ex d IIB+H2 T5 Gb" },
        { label: "Network Routing", value: "Self-healing mesh node" }
      ],
      exZone: "Zone 1 / Zone 2",
      range: "800m range",
      power: "12-24VDC Local Line",
      flowPath: ["RS-485 DEVICE", "RH-SERIAL CONVERTER", "WIRELESS MESH AP", "SCADA HOST"]
    },
    {
      id: "mimes-button",
      name: "RadioPush Button RPB-C7",
      code: "MIMES-RPB-C7",
      description: "Intrinsically safe wireless manual call point for emergency plant shut-down loops. Direct, zero-latency trigger broadcast capability.",
      specs: [
        { label: "Switch Type", value: "Latching dual-action push button" },
        { label: "Wireless Protocol", value: "ISA100.11a Safety Profile" },
        { label: "Response Latency", value: "< 250 milliseconds" },
        { label: "Compliance Code", value: "SIL 2 Capable (IEC 61508)" }
      ],
      exZone: "Zone 0 / Zone 1",
      range: "500m mesh hop",
      power: "Long-life battery pack",
      flowPath: ["OPERATOR PUSH", "RPB-C7 BUTTON", "WIRELESS MESH AP", "ESD CONTROL SHUT-OFF"]
    },
    {
      id: "mimes-antenna",
      name: "Antenna Exe Series",
      code: "MIMES-ANT-EXE",
      description: "Intrinsically safe high-gain antennas designed for corrosive salt-spray environments to ensure stable signals across dense process columns.",
      specs: [
        { label: "Frequency Range", value: "2.4 GHz / 5.8 GHz Dual-Band" },
        { label: "Gain Rating", value: "8 dBi Omni / 12 dBi Directional" },
        { label: "Atmosphere Rating", value: "Ex e mb IIC T4 Gb / IP67 NEMA 4X" },
        { label: "Connector Type", value: "N-Type Female stainless steel" }
      ],
      exZone: "Zone 1 / Zone 2",
      range: "Extended wide area",
      power: "Passive (No Power Required)",
      flowPath: ["MESH RADIO SIGNALS", "EXE ANTENNA ARRAY", "TRANSMITTER NODE", "GATEWAY"]
    }
  ],
  alarms: [
    {
      id: "mimes-sounder",
      name: "RadioSounder RS-S1F",
      code: "MIMES-RS-S1F",
      description: "High-output wireless warning sounder broadcasting safety alert tones across noisy processing units without signal cables.",
      specs: [
        { label: "Acoustic Output", value: "115 dB(A) @ 1 meter" },
        { label: "Siren Stages", value: "45 Configurable alarm tones" },
        { label: "Loop Integration", value: "Direct link to wireless gas detector nodes" },
        { label: "Battery Life", value: "3 Years (Under regular test cycles)" }
      ],
      exZone: "Zone 1 / Zone 2 / Zone 21 / Zone 22",
      range: "800m range",
      power: "Battery / 24VDC",
      flowPath: ["ESD TRIGGER", "WIRELESS GATEWAY", "RS-S1F HORN", "115dB SOUND FIELD"]
    },
    {
      id: "mimes-beacon",
      name: "Radio Beacon R9-LED",
      code: "MIMES-RB-R9",
      description: "Explosion-proof, high-visibility flashing LED warning beacon alerting personnel in toxic gas and hazardous areas.",
      specs: [
        { label: "Light Source", value: "Array of high-intensity Cree LEDs" },
        { label: "Luminous Intensity", value: "320 Candelas effective output" },
        { label: "Material Structure", value: "Marine-grade GRP housing" },
        { label: "Safety Integrity", value: "SIL2 certified safety warning system" }
      ],
      exZone: "Zone 1 / Zone 2",
      range: "Line-of-sight visual alerts",
      power: "24VDC / Lithium battery backup",
      flowPath: ["GAS NODE ALARM", "WIRELESS AP", "R9-LED BEACON", "HIGH-VISIBILITY FLASH"]
    },
    {
      id: "mimes-beacon-led",
      name: "Radio Hub LED",
      code: "MIMES-RH-LED",
      description: "Compact wireless visual indicator node configured for localized Zone 1 hazard warnings and active emergency status displays.",
      specs: [
        { label: "Visual Mode", value: "Strobe, blinking, and steady status" },
        { label: "Beacon Control", value: "Over-the-air protocol activation" },
        { label: "Dome Lens", value: "Borosilicate glass with UV stabilizer" },
        { label: "Ingress Protection", value: "IP67 dust and water proof" }
      ],
      exZone: "Zone 1 / Zone 2",
      range: "Local visual alert zone",
      power: "Battery / Line power",
      flowPath: ["DCS ALARM FLAG", "WIRELESS AP", "RH-LED WARNING", "LOCAL STATUS LIGHT"]
    }
  ],
  gateways: [
    {
      id: "mimes-gateway",
      name: "Gateway + Access Point",
      code: "MIMES-GW-AP",
      description: "The core edge communication hub of the MIMES system. Coordinates wireless mesh traffic and routes plant telemetry directly into SCADA systems.",
      specs: [
        { label: "Device Capacity", value: "Up to 200 field transmitters" },
        { label: "Access Point Count", value: "Supports up to 20 remote AP receivers" },
        { label: "Protocol Output", value: "Modbus TCP, Modbus RTU, OPC UA, Profinet" },
        { label: "Host Integration", value: "Dual redundant Ethernet links" }
      ],
      exZone: "Zone 2 (Class I Div 2 / Safe Area)",
      range: "Coordinating entire site mesh",
      power: "24VDC / Redundant PoE supply",
      flowPath: ["200 FIELD DEVICES", "ISA100 MESH RADIO", "GATEWAY ACCESS POINT", "SCADA / DCS HOST"]
    }
  ]
};

export default function MimesEcosystem() {
  const [activeCategory, setActiveCategory] = useState<"inputs" | "alarms" | "gateways">("inputs");
  const [selectedEcosystemDevice, setSelectedEcosystemDevice] = useState<string>("mimes-io");

  const currentCategoryDevices = ecosystemDevices[activeCategory];
  const activeDevice = currentCategoryDevices.find(d => d.id === selectedEcosystemDevice) || currentCategoryDevices[0];

  return (
    <>
      {/* ── SECTION 2A: WHY WIRELESS SAFETY? (PREMIUM INDUSTRIAL TILES) ── */}
      <section className="py-20 bg-slate-900 text-white w-full border-t border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-6 w-full">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold tracking-[0.15em] text-sky-400 uppercase block">[ TECHNICAL ADVANTAGES ]</span>
              <h2 className="text-3xl font-bold uppercase tracking-tight text-white">Why Wireless Safety?</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-light">
              Industrial wireless loops bypass physical cabling constraints, eliminating safety risks and lowering installation latency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            {/* Card 1 */}
            <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl hover:border-sky-500/30 hover:bg-slate-950/60 transition-all duration-300 flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg w-fit group-hover:border-sky-500/20 transition-all">
                  <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v15M8 6l4-4 4 4M5 18h14M3 21h18" />
                    <circle cx="12" cy="18" r="1.5" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Zero Trenching</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Eliminates hazardous civil excavation, concrete cutting, and cable containment loops inside operating process fields.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-600 block mt-6"></span>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl hover:border-sky-500/30 hover:bg-slate-950/60 transition-all duration-300 flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg w-fit group-hover:border-sky-500/20 transition-all">
                  <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="14" width="6" height="6" rx="1" />
                    <rect x="15" y="14" width="6" height="6" rx="1" />
                    <rect x="9" y="4" width="6" height="6" rx="1" />
                    <path d="M6 14v-4h12v4" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Seamless DCS Link</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Direct protocol integration (Modbus, OPC UA, Profinet) to Honeywell, Emerson, or Yokogawa DCS loops.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-600 block mt-6"></span>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl hover:border-sky-500/30 hover:bg-slate-950/60 transition-all duration-300 flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg w-fit group-hover:border-sky-500/20 transition-all">
                  <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5M12 16h.01" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Ex Zone 0/1 Safe</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Full compliance with Class I Div 1 and ATEX Zone 0/1 directives to prevent kinetic ignition in explosive atmospheres.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-600 block mt-6"></span>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl hover:border-sky-500/30 hover:bg-slate-950/60 transition-all duration-300 flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg w-fit group-hover:border-sky-500/20 transition-all">
                  <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="6" width="16" height="12" rx="2" />
                    <path d="M22 10v4M6 10v4M12 10v4" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Solar Autonomy</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Operates up to 10 years on lithium cells, with optional high-compliance solar back-up assemblies for sirens.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-600 block mt-6"></span>
            </div>

            {/* Card 5 */}
            <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-xl hover:border-sky-500/30 hover:bg-slate-950/60 transition-all duration-300 flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg w-fit group-hover:border-sky-500/20 transition-all">
                  <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 6v6l4 2M12 3V1" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Rapid Install</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Deploy complete wireless safety meshes in hours instead of weeks, minimizing site down-time windows.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-600 block mt-6"></span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2B: MIMES INTERACTIVE ECOSYSTEM DASHBOARD ── */}
      <section className="py-20 bg-slate-950 text-white w-full border-b border-slate-900 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.03] pointer-events-none bg-sky-500" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-900 pb-6 w-full">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold tracking-[0.15em] text-sky-400 uppercase block">[ NETWORK TOPOLOGY ]</span>
              <h2 className="text-3xl font-bold uppercase tracking-tight text-white">Our Product Ecosystem</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-light">
              Inter-connected telemetry hardware loop coordinating field sensors, alarms, and control interfaces inside explosive gas environments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Device Selection Panel (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Selector Tabs */}
              <div className="flex bg-slate-900/50 border border-slate-800 p-1 rounded-lg gap-1">
                <button
                  onClick={() => {
                    setActiveCategory("inputs");
                    setSelectedEcosystemDevice(ecosystemDevices.inputs[0].id);
                  }}
                  className={`flex-1 py-2 px-3 text-left font-mono text-[10px] uppercase tracking-wider rounded transition-all cursor-pointer ${
                    activeCategory === "inputs"
                      ? "bg-slate-850 text-sky-400 border border-slate-700/60"
                      : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  [01 // Telemetry & Input]
                </button>
                <button
                  onClick={() => {
                    setActiveCategory("alarms");
                    setSelectedEcosystemDevice(ecosystemDevices.alarms[0].id);
                  }}
                  className={`flex-1 py-2 px-3 text-left font-mono text-[10px] uppercase tracking-wider rounded transition-all cursor-pointer ${
                    activeCategory === "alarms"
                      ? "bg-slate-850 text-sky-400 border border-slate-700/60"
                      : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  [02 // Alarms & Output]
                </button>
                <button
                  onClick={() => {
                    setActiveCategory("gateways");
                    setSelectedEcosystemDevice(ecosystemDevices.gateways[0].id);
                  }}
                  className={`flex-1 py-2 px-3 text-left font-mono text-[10px] uppercase tracking-wider rounded transition-all cursor-pointer ${
                    activeCategory === "gateways"
                      ? "bg-slate-850 text-sky-400 border border-slate-700/60"
                      : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  [03 // Gateways]
                </button>
              </div>

              {/* Device Selector Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ecosystemDevices[activeCategory].map((device) => {
                  const isSelected = selectedEcosystemDevice === device.id;
                  return (
                    <button
                      key={device.id}
                      onClick={() => setSelectedEcosystemDevice(device.id)}
                      className={`p-4 text-left rounded-xl border transition-all flex flex-col justify-between h-24 cursor-pointer ${
                        isSelected
                          ? "bg-slate-900/90 border-sky-500/60 text-white shadow-lg"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="font-semibold text-sm tracking-wide block text-slate-100">{device.name}</span>
                      <div className="flex justify-between items-center w-full font-mono text-[9px] text-slate-500">
                        <span>{device.code}</span>
                        <span className={isSelected ? "text-sky-400" : "text-slate-600"}>
                          {device.exZone.split(" / ")[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Flow Route Visualization */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 font-mono text-[10px] text-slate-500 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 uppercase tracking-widest">[ NETWORK SIGNAL ROUTING ]</span>
                  <span className="text-sky-400/70 select-none animate-pulse">● SIGNAL ROUTE ONLINE</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2 text-slate-400 text-[11px] leading-relaxed">
                  {activeDevice.flowPath.map((pathNode, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded bg-slate-900/80 border ${
                        pathNode === activeDevice.name.toUpperCase()
                          ? "border-sky-500/40 text-sky-400 font-bold"
                          : "border-slate-850"
                      }`}>
                        {pathNode}
                      </span>
                      {idx < activeDevice.flowPath.length - 1 && (
                        <span className="text-sky-500/50 font-bold select-none">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Parameters Inspector Panel (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[420px]">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 block">[ INSPECTING DEVICE ]</span>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mt-1">{activeDevice.name}</h3>
                  </div>
                  <span className="font-mono text-[10px] bg-slate-800/80 border border-slate-700/50 px-2 py-1 rounded text-slate-450">
                    {activeDevice.code}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {activeDevice.description}
                </p>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-slate-800/80">
                {activeDevice.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex justify-between items-center font-mono text-[10px] border-b border-slate-900 pb-2">
                    <span className="text-slate-500 uppercase">{spec.label}</span>
                    <span className="text-slate-200 font-semibold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 font-mono text-[9px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-slate-400 uppercase">[ ATEX APPROVED ]</span>
                </div>
                <div className="text-right">
                  <span>MAX RANGE: <strong className="text-white">{activeDevice.range}</strong></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
