"use client";

import React from "react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070b14]/90 backdrop-blur-md transition-all duration-300">
      {/* Background Glowing Orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-[#1e3e8f]/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-48 h-48 rounded-full bg-[#c22026]/15 blur-2xl pointer-events-none animate-pulse delay-300" />

      {/* Main Glass Card */}
      <div className="relative flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl max-w-sm w-full mx-4 text-center">
        {/* Animated Brand Emblem Container */}
        <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
          {/* Rotating Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-t-[#c22026] border-r-[#1e3e8f] border-b-transparent border-l-transparent animate-spin" />
          
          {/* Inner Glowing Badge */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1e3e8f] to-[#c22026] flex items-center justify-center shadow-lg shadow-[#c22026]/30">
            <span className="text-white font-black text-xl tracking-tighter italic">E</span>
          </div>
        </div>

        {/* Brand Label */}
        <span className="text-xs font-mono font-bold tracking-[0.25em] text-slate-400 uppercase mb-1">
          Eastwind Arabia
        </span>
        <h3 className="text-base font-black text-white tracking-wide mb-4">
          Industrial Safety Systems
        </h3>

        {/* Progress Bar Loader */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden p-0.5 border border-white/5">
          <div className="bg-gradient-to-r from-[#1e3e8f] via-[#c22026] to-[#1e3e8f] h-full rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Subtext */}
        <span className="mt-3 text-[0.68rem] font-medium text-slate-400 animate-pulse">
          Initializing telemetry & safety protocols...
        </span>
      </div>

      {/* Tailwind Custom Keyframe Styling */}
      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 70%;
            margin-left: 15%;
          }
          100% {
            width: 100%;
            margin-left: 0%;
          }
        }
      `}</style>
    </div>
  );
}
