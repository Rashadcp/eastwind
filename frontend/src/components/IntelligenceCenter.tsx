"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Custom count-up animation component that triggers when in view
function CountUp({ 
  value, 
  duration = 1.5, 
  suffix = "", 
  prefix = "", 
  decimals = 0 
}: { 
  value: number; 
  duration?: number; 
  suffix?: string; 
  prefix?: string; 
  decimals?: number; 
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(progress * value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

// Background Floating Particle component
interface Particle {
  id: number;
  size: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  driftX: number;
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = [...Array(12)].map((_, i) => ({
      id: i,
      size: Math.random() * 8 + 4,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
      driftX: Math.random() * 30 - 15
    }));
    setTimeout(() => {
      setParticles(generated);
    }, 0);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => {
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.id % 2 === 0 ? "rgba(30, 62, 143, 0.06)" : "rgba(194, 32, 38, 0.06)",
              left: `${p.startX}%`,
              top: `${p.startY}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, p.driftX, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

export default function IntelligenceCenter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="operational-impact"
      ref={containerRef}
      className="relative z-10 w-full py-[120px] max-sm:py-20 border-t border-b border-slate-200/60 overflow-hidden bg-transparent"
    >
      {/* Floating Particles in background */}
      <FloatingParticles />

      {/* Decorative blurred gradient background blobs */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(30,62,143,0.08)_0%,transparent_70%)] blur-[60px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(194,32,38,0.08)_0%,transparent_70%)] blur-[80px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-10 max-sm:px-5 relative z-10">
        
        {/* Section Header */}
        <div className="mb-[70px] max-w-[800px]">
          <span className="block mb-4 text-[#c22026] uppercase font-mono text-[0.75rem] font-bold tracking-widest">
            Operational Performance Metrics
          </span>
          <h2 className="text-[3rem] max-sm:text-[2.2rem] text-white mb-6 tracking-tight font-extrabold leading-[1.1] uppercase">
            Operational Impact
          </h2>
          <p className="text-[1.2rem] max-sm:text-[1.1rem] text-slate-300 leading-relaxed font-normal m-0">
            Turning industrial intelligence into measurable operational outcomes across energy, infrastructure, safety, and mission-critical environments.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-[30px] max-md:gap-5">
          
          {/* Card 1: Large Featured Card (AI-Powered Operational Intelligence) */}
          <motion.div 
            className="spatial-panel col-span-2 max-md:col-span-1 flex flex-col justify-between p-10 max-sm:p-6 relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#1e3e8f]/20 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.08)]"
            whileHover={{ y: -5 }}
          >
            {/* Top Row: Info */}
            <div className="max-w-[60%] max-md:max-w-full relative z-10">
              <span className="font-mono text-[0.7rem] text-[#1e3e8f] font-bold tracking-widest uppercase block mb-3">
                Core Engine
              </span>
              <h3 className="text-[1.8rem] font-extrabold text-slate-900 mb-4 tracking-tight leading-snug uppercase">
                AI-Powered Operational Intelligence
              </h3>
              <p className="text-[1rem] text-slate-600 leading-relaxed m-0 font-medium">
                Transforming raw industrial data into predictive actions before failures occur.
              </p>
            </div>

            {/* Visual: Flowing data streams to central core */}
            <div className="absolute right-5 top-5 bottom-[120px] w-[40%] max-md:hidden flex items-center justify-center pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
                <defs>
                  <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e3e8f" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1e3e8f" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c22026" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="#1e3e8f" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#1e3e8f" stopOpacity="1" />
                  </linearGradient>
                </defs>
                
                {/* Central Intelligence Core */}
                <motion.circle 
                  cx="150" 
                  cy="100" 
                  r="35" 
                  fill="url(#coreGlow)"
                  animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.6, 0.9, 0.6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <circle cx="150" cy="100" r="12" fill="#1e3e8f" />
                <motion.circle 
                  cx="150" 
                  cy="100" 
                  r="6" 
                  fill="#ffffff" 
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <circle cx="150" cy="100" r="18" stroke="#1e3e8f" strokeWidth="1" strokeDasharray="3 3" />

                {/* Flowing Streams */}
                <motion.path 
                  d="M 20,40 Q 80,40 150,100" 
                  stroke="url(#streamGrad)" 
                  strokeWidth="2" 
                  strokeDasharray="6 8"
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                <motion.path 
                  d="M 20,100 Q 80,100 150,100" 
                  stroke="url(#streamGrad)" 
                  strokeWidth="2" 
                  strokeDasharray="6 8"
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.path 
                  d="M 20,160 Q 80,160 150,100" 
                  stroke="url(#streamGrad)" 
                  strokeWidth="2" 
                  strokeDasharray="6 8"
                  animate={{ strokeDashoffset: [100, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>

            {/* Bottom Row: Metrics */}
            <div className="grid grid-cols-2 gap-6 border-t border-slate-200/60 pt-[30px] mt-[30px] relative z-10">
              <div>
                <div className="text-[2.5rem] font-extrabold text-slate-900 font-mono leading-none">
                  <CountUp value={92} suffix="%" />
                </div>
                <div className="text-[0.85rem] text-slate-500 mt-1.5 font-bold">
                  Predictive Accuracy
                </div>
              </div>
              <div>
                <div className="text-[2.5rem] font-extrabold text-[#c22026] font-mono leading-none">
                  <CountUp value={0.8} decimals={1} suffix="s" />
                </div>
                <div className="text-[0.85rem] text-slate-500 mt-1.5 font-bold">
                  Hazard Detection Response
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: System Availability */}
          <motion.div 
            className="spatial-panel col-span-1 flex flex-col justify-between p-10 max-sm:p-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#1e3e8f]/20 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.08)]"
            whileHover={{ y: -5 }}
          >
            <div>
              <span className="font-mono text-[0.7rem] text-slate-500 font-bold tracking-widest uppercase block mb-2">
                Reliability
              </span>
              <h3 className="text-[1.4rem] font-extrabold text-slate-900 mb-2 leading-snug uppercase">
                System Availability
              </h3>
              <p className="text-[0.9rem] text-slate-600 leading-normal m-0 font-medium">
                Maintaining uninterrupted visibility across distributed assets.
              </p>
            </div>

            {/* Circular Progress Visual */}
            <div className="flex justify-center items-center my-6 relative">
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="rgba(15,23,42,0.05)" 
                  strokeWidth="6" 
                  fill="none" 
                />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="#1e3e8f" 
                  strokeWidth="7" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeDasharray="263.8"
                  initial={{ strokeDashoffset: 263.8 }}
                  animate={isInView ? { strokeDashoffset: 263.8 * (1 - 0.998) } : {}}
                  transition={{ duration: 2, ease: "easeOut" }}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute text-[1.6rem] font-extrabold text-slate-900 font-mono text-center">
                <CountUp value={99.8} decimals={1} suffix="%" />
              </div>
            </div>

            <div className="text-[0.8rem] text-slate-500 text-center border-t border-slate-200/60 pt-4 font-semibold">
              Enterprise Grade SLA Guaranteed
            </div>
          </motion.div>

          {/* Card 3: Maintenance Optimization */}
          <motion.div 
            className="spatial-panel col-span-1 flex flex-col justify-between p-10 max-sm:p-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#c22026]/20 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.08)]"
            whileHover={{ y: -5 }}
          >
            <div>
              <span className="font-mono text-[0.7rem] text-[#c22026] font-bold tracking-widest uppercase block mb-2">
                Cost Reduction
              </span>
              <h3 className="text-[1.4rem] font-extrabold text-slate-900 mb-2 leading-snug uppercase">
                Maintenance Optimization
              </h3>
              <p className="text-[0.9rem] text-slate-600 leading-normal m-0 font-medium">
                Reduction in unplanned maintenance costs through predictive analytics.
              </p>
            </div>

            {/* Smooth growth curve visual */}
            <div className="w-full h-20 my-5">
              <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none" fill="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c22026" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#c22026" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <motion.path
                  d="M 0,80 Q 40,75 80,45 T 160,25 T 200,5 L 200,80 Z"
                  fill="url(#areaGrad)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1 }}
                />
                {/* Line path */}
                <motion.path
                  d="M 0,80 Q 40,75 80,45 T 160,25 T 200,5"
                  stroke="#c22026"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
                {/* Circle pointer */}
                <motion.circle 
                  cx="200" 
                  cy="5" 
                  r="5" 
                  fill="#c22026"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 1.8, duration: 0.3 }}
                />
              </svg>
            </div>

            <div className="flex justify-between items-end border-t border-slate-200/60 pt-4">
              <span className="text-[0.85rem] text-slate-500 font-bold">Total Reduction</span>
              <strong className="text-[1.8rem] text-[#c22026] font-mono leading-none font-extrabold">
                <CountUp value={42} suffix="%" />
              </strong>
            </div>
          </motion.div>

          {/* Card 4: Safety Performance */}
          <motion.div 
            className="spatial-panel col-span-1 flex flex-col justify-between p-10 max-sm:p-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#1e3e8f]/20 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.08)]"
            whileHover={{ y: -5 }}
          >
            <div>
              <span className="font-mono text-[0.7rem] text-[#1e3e8f] font-bold tracking-widest uppercase block mb-2">
                HSE Excellence
              </span>
              <h3 className="text-[1.4rem] font-extrabold text-slate-900 mb-2 leading-snug uppercase">
                Safety Performance
              </h3>
              <p className="text-[0.9rem] text-slate-600 leading-normal m-0 font-medium">
                Faster incident identification and response across operational sites.
              </p>
            </div>

            {/* Expanding pulse rings visual */}
            <div className="h-[90px] flex items-center justify-center relative">
              <div className="relative w-[50px] h-[50px]">
                <motion.div 
                  className="absolute inset-[-10px] border-2 border-[#1e3e8f]/30 rounded-full"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div 
                  className="absolute inset-[-20px] border border-[#1e3e8f]/15 rounded-full"
                  animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                />
                <div className="absolute inset-0 bg-[#1e3e8f] rounded-full flex items-center justify-center shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-slate-200/60 pt-4">
              <span className="text-[0.85rem] text-slate-500 font-bold">Incident Reduction</span>
              <strong className="text-[1.8rem] text-[#1e3e8f] font-mono leading-none font-extrabold">
                <CountUp value={90} suffix="%" />
              </strong>
            </div>
          </motion.div>

          {/* Card 5: Decision Acceleration */}
          <motion.div 
            className="spatial-panel col-span-1 flex flex-col justify-between p-10 max-sm:p-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#1e3e8f]/20 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.08)]"
            whileHover={{ y: -5 }}
          >
            <div>
              <span className="font-mono text-[0.7rem] text-slate-500 font-bold tracking-widest uppercase block mb-2">
                Speed
              </span>
              <h3 className="text-[1.4rem] font-extrabold text-slate-900 mb-2 leading-snug uppercase">
                Decision Acceleration
              </h3>
              <p className="text-[0.9rem] text-slate-600 leading-normal m-0 font-medium">
                Instant access to operational insights across facilities and field teams.
              </p>
            </div>

            {/* Timeline flow visual */}
            <div className="flex items-center justify-between my-6 relative w-full">
              <div className="absolute inset-x-0 h-[2px] bg-slate-200 z-0" />
              
              <motion.div 
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#1e3e8f] to-transparent z-10"
                animate={{ left: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {[0, 1, 2].map((idx) => (
                <div 
                  key={idx} 
                  className={`w-6 h-6 rounded-full ${
                    idx === 2 ? "bg-[#c22026] border-[#c22026]" : "bg-white border-slate-300"
                  } border-2 z-20 flex items-center justify-center shadow-sm`}
                >
                  <div className={`w-2 h-2 rounded-full ${idx === 2 ? "bg-white" : "bg-[#1e3e8f]"}`} />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-end border-t border-slate-200/60 pt-4">
              <span className="text-[0.85rem] text-slate-500 font-bold">Latency</span>
              <strong className="text-[1.5rem] text-[#c22026] font-black uppercase tracking-tight">
                Real-Time
              </strong>
            </div>
          </motion.div>

          {/* Card 6: Integrated Ecosystem */}
          <motion.div 
            className="spatial-panel col-span-3 max-lg:col-span-2 max-md:col-span-1 flex flex-col justify-between p-10 max-sm:p-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#c22026]/20 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.08)]"
            whileHover={{ y: -5 }}
          >
            <div className="grid grid-cols-2 gap-10 w-full items-center max-md:grid-cols-1 max-md:gap-6">
              
              {/* Left Side: Text */}
              <div>
                <span className="font-mono text-[0.7rem] text-[#c22026] font-bold tracking-widest uppercase block mb-3">
                  Unified Security & Diagnostics
                </span>
                <h3 className="text-[1.8rem] font-extrabold text-slate-900 mb-4 tracking-tight leading-snug uppercase">
                  Integrated Ecosystem
                </h3>
                <p className="text-[1rem] text-slate-600 leading-relaxed m-0 font-medium">
                  Seamless cross-layer integrity loops syncing physical infrastructure, cyber boundary shielding, and neural models into a single outcome dashboard.
                </p>
              </div>

              {/* Right Side: Visual connected nodes */}
              <div className="relative h-[200px] flex items-center justify-center rounded-2xl bg-white/20 border border-slate-200/50 overflow-hidden">
                {/* Visual network lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="25%" y1="30%" x2="75%" y2="30%" stroke="rgba(15,23,42,0.08)" strokeWidth="1" />
                  <line x1="25%" y1="30%" x2="50%" y2="70%" stroke="rgba(15,23,42,0.08)" strokeWidth="1" />
                  <line x1="75%" y1="30%" x2="50%" y2="70%" stroke="rgba(15,23,42,0.08)" strokeWidth="1" />
                  <line x1="20%" y1="70%" x2="50%" y2="70%" stroke="rgba(15,23,42,0.08)" strokeWidth="1" />
                  <line x1="80%" y1="70%" x2="50%" y2="70%" stroke="rgba(15,23,42,0.08)" strokeWidth="1" />
                </svg>

                {/* Nodes layout */}
                <div className="grid grid-cols-3 gap-3 w-[90%] relative z-10 max-sm:grid-cols-1">
                  {[
                    "Digital Twins", "AI Analytics", "Wireless Monitoring",
                    "Cybersecurity", "Fire Protection", "Infrastructure Security"
                  ].map((nodeName, idx) => {
                    const isOrange = idx % 2 === 0;
                    
                    return (
                      <motion.div
                        key={nodeName}
                        className="p-[10px_8px] bg-white/60 backdrop-blur-md rounded-xl text-[0.75rem] font-bold text-slate-800 text-center shadow-sm cursor-default transition-all duration-180 border"
                        style={{
                          borderColor: isOrange ? "rgba(194, 32, 38, 0.15)" : "rgba(30, 62, 143, 0.15)",
                          "--hover-border": isOrange ? "#c22026" : "#1e3e8f",
                        } as React.CSSProperties}
                        animate={{
                          y: [0, idx % 2 === 0 ? -4 : 4, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: idx * 0.3
                        }}
                        whileHover={{
                          scale: 1.05,
                          borderColor: "var(--hover-border)",
                          boxShadow: "0 4px 20px rgba(15,23,42,0.08)",
                          backgroundColor: "rgba(255, 255, 255, 0.9)"
                        }}
                      >
                        {nodeName}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
