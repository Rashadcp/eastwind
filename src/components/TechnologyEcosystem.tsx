"use client";

import InteractivePortfolioSection, { PortfolioItem } from "@/components/InteractivePortfolioSection";

const products: PortfolioItem[] = [
  {
    id: "mimes",
    name: "MIMES",
    category: "Wireless IIoT Platform",
    imageTone: "blue",
    overview: [
      "MIMES connects field instruments, gas detectors, pressure devices, and remote assets through an intrinsically safe wireless architecture built for industrial environments.",
      "The platform helps operators reduce cabling, shorten commissioning cycles, and maintain visibility across hazardous areas where conventional wired infrastructure is expensive or disruptive.",
      "With long-life field devices and secure telemetry, MIMES supports real-time monitoring for critical safety, production, and maintenance workflows."
    ],
    features: ["Long Battery Life", "ATEX Certified", "Wireless Monitoring", "Secure Telemetry"],
    applications: ["Oil & Gas", "Offshore", "Utilities", "Industrial Facilities"],
    benefits: [
      { value: "90%", label: "Less Cabling" },
      { value: "10 Yr", label: "Battery Design" },
      { value: "24/7", label: "Field Visibility" }
    ]
  },
  {
    id: "xshielder",
    name: "XSHIELDER",
    category: "Industrial Cybersecurity",
    imageTone: "steel",
    overview: [
      "XSHIELDER protects operational technology environments with security controls designed for SCADA, DCS, substations, and critical industrial networks.",
      "It gives operators a practical path to stronger segmentation, controlled data movement, and threat visibility without interrupting the reliability demands of plant operations."
    ],
    features: ["OT Network Defense", "Protocol Inspection", "Boundary Isolation", "Compliance Ready"],
    applications: ["Oil & Gas", "Utilities", "Defense", "Industrial Facilities"],
    benefits: [
      { value: "Zero", label: "Trust Boundaries" },
      { value: "Real-Time", label: "Threat Visibility" },
      { value: "Lower", label: "Operational Risk" }
    ]
  },
  {
    id: "tridiagonal",
    name: "TRIDIAGONAL",
    category: "Predictive Analytics",
    imageTone: "green",
    overview: [
      "TRIDIAGONAL turns industrial signals into early warnings for equipment health, process instability, and maintenance risk.",
      "The analytics layer combines operating data, vibration profiles, pressure changes, and machine behavior to help teams act before faults become shutdowns.",
      "It is suited for plants that need clearer diagnostics, smarter maintenance planning, and higher uptime from existing assets."
    ],
    features: ["Predictive Analytics", "Anomaly Detection", "Asset Health Models", "Maintenance Planning"],
    applications: ["Oil & Gas", "Utilities", "Industrial Facilities", "Offshore"],
    benefits: [
      { value: "42%", label: "Maintenance Savings" },
      { value: "Early", label: "Fault Detection" },
      { value: "Higher", label: "Asset Uptime" }
    ]
  },
  {
    id: "one-seven",
    name: "ONE SEVEN",
    category: "Fire Suppression Technology",
    imageTone: "red",
    overview: [
      "ONE SEVEN compressed air foam systems deliver high-efficiency fire suppression for industrial, municipal, offshore, and emergency response environments.",
      "The technology produces a stable foam blanket with strong heat absorption, helping teams control hazards faster while reducing water use and collateral damage."
    ],
    features: ["Water Efficient", "Rapid Knockdown", "Foam Proportioning", "Vehicle Integration"],
    applications: ["Offshore", "Defense", "Industrial Facilities", "Oil & Gas"],
    benefits: [
      { value: "90%", label: "Water Reduction" },
      { value: "Fast", label: "Fire Control" },
      { value: "Lower", label: "Response Load" }
    ]
  },
  {
    id: "nardi",
    name: "NARDI",
    category: "Gas Systems",
    imageTone: "amber",
    overview: [
      "NARDI supports compressed air, breathing air, and gas handling requirements for industrial safety and emergency operations.",
      "Its compressor and storage systems are engineered for dependable service in demanding facilities where clean air supply and pressure stability matter."
    ],
    features: ["High Pressure Systems", "Breathing Air Support", "Moisture Filtration", "Industrial Reliability"],
    applications: ["Defense", "Industrial Facilities", "Offshore", "Utilities"],
    benefits: [
      { value: "350", label: "Bar Capability" },
      { value: "Clean", label: "Air Supply" },
      { value: "Ready", label: "Emergency Support" }
    ]
  },
  {
    id: "tgr-solutions",
    name: "TGR SOLUTIONS",
    category: "Infrastructure Monitoring",
    imageTone: "slate",
    overview: [
      "TGR SOLUTIONS monitors the condition of critical infrastructure through sensors and diagnostics for structural movement, acoustic events, and vibration signatures.",
      "The solution helps operators detect degradation in pipelines, foundations, storage assets, and civil infrastructure before small changes become major failures."
    ],
    features: ["Structural Sensing", "Wireless Monitoring", "Vibration Analysis", "Risk Alerts"],
    applications: ["Utilities", "Oil & Gas", "Defense", "Industrial Facilities"],
    benefits: [
      { value: "Real-Time", label: "Monitoring" },
      { value: "Early", label: "Damage Alerts" },
      { value: "Better", label: "Asset Decisions" }
    ]
  }
];

export default function TechnologyEcosystem() {
  const handleRequestQuote = (item: PortfolioItem) => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      const footerContact = document.querySelector("footer");
      if (footerContact) {
        footerContact.scrollIntoView({ behavior: "smooth" });
      } else {
        alert(`Quote requested for ${item.name}. Our engineering team will contact you shortly.`);
      }
    }
  };

  const handleTalkToExpert = (item: PortfolioItem) => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      const footerContact = document.querySelector("footer");
      if (footerContact) {
        footerContact.scrollIntoView({ behavior: "smooth" });
      } else {
        alert(`Connecting you with a technical expert for ${item.name}.`);
      }
    }
  };

  return (
    <InteractivePortfolioSection
      sectionId="ecosystem"
      sectionLabel="Technology Portfolio"
      sectionTitle="Technology Portfolio"
      sectionDesc="Explore the technologies powering our industrial intelligence, safety, mobility, and infrastructure solutions."
      items={products}
      backgroundColor="#F8FAFC"
      cta1Label="Request Quote"
      cta1OnClick={handleRequestQuote}
      cta2Label="Talk To Expert"
      cta2OnClick={handleTalkToExpert}
    />
  );
}
