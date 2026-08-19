// src/app/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import IndustrySolutions from "@/components/IndustrySolutions";
import TechnologyEcosystem from "@/components/TechnologyEcosystem";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Global Header Navigation Panel */}
      <Navbar />
      
      {/* CRITICAL FIX: Removed 'overflow-x-clip' from the main container. 
        This restores the viewport scroll context so 'position: sticky' works correctly.
      */}
      <main className="min-h-screen relative z-10 w-full bg-white text-slate-800 antialiased">
        
        {/* 1. Cinematic Interactive Scroll-Scrub Section */}
        <Hero />

        {/* 2. Solution-First Core Interactive Telemetry Graphic */}
        <IndustrySolutions />

        {/* 3. Premium Modular About Us Section */}
        <About />

        {/* 5. Technology Ecosystem Portfolio Section */}
        <TechnologyEcosystem />

        {/* 6. Modern Interactive Contact & Quote Section */}
        <Contact />

        {/* Global Interface Footer Information Panel */}
        <Footer />
      </main>
    </>
  );
}