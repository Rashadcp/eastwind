import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Divisions from "@/components/Divisions";
import IndustrySolutions from "@/components/IndustrySolutions";
import EngineeringCapability from "@/components/EngineeringCapability";
import CaseStudies from "@/components/CaseStudies";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen relative z-10">
        <Hero />
        <IndustrySolutions />
        <Divisions /> 
        <EngineeringCapability />
        <CaseStudies />
      </main>
      <Footer />
    </>
  );
}
