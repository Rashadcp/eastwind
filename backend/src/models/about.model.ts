import { AboutContent, IAboutContent } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

export class AboutModel {
  static async getAll(): Promise<IAboutContent[]> {
    const docs = await AboutContent.find({}).lean().exec();
    return (docs as unknown) as IAboutContent[];
  }

  static async getBySection(id: string): Promise<IAboutContent | null> {
    let item = await AboutContent.findOne({ id }).lean().exec();
    if (!item && id === "home") {
      item = await AboutContent.findOneAndUpdate(
        { id: "home" },
        {
          id: "home",
          imageUrl: "/products/default-process-instrumentation.png",
          title: "Sustaining Regional Safety Infrastructure",
          overviewText: "East Wind operates as a regional, end-to-end safety solutions provider delivering the complete lifecycle of safety projects across mission-critical infrastructure segments.",
          secondaryText: "Our core strength centers on adopting and implementing the latest safety technologies to solve complex, high-risk challenges—improving safety performance while reducing total cost of ownership (TCO) for our clients.",
          metrics: [
            {
              value: "70%",
              label: "Technical Functions Weight",
              desc: "Dedicated to application engineering, cross-disciplinary integration, workshops, and instrument field services."
            },
            {
              value: "10+",
              label: "Certified Personnel Scale",
              desc: "Housing internal multi-disciplinary functions spanning mechanical, electrical, and functional safety architecture."
            }
          ],
          lifecycleSteps: [
            "Concept Studies & Solution Selection",
            "Safety Systems Integration",
            "Manufacturing & Assembly",
            "Installation & Commissioning",
            "Project Management Leadership",
            "Long-Term After-Sales Support"
          ]
        },
        { new: true, upsert: true }
      ).lean().exec();
    }
    if (!item && id === "page") {
      item = await AboutContent.findOneAndUpdate(
        { id: "page" },
        {
          id: "page",
          heroBgImage: "/about_hero_bg.png?v=3",
          heroTagline: "Company Overview",
          heroTitle: "Mission-Critical Safety Infrastructure",
          heroDescription: "East Wind is a specialized safety solutions provider in Saudi Arabia, delivering the entire lifecycle of engineered projects.",
          mandateBadge: "Operational Strength",
          mandateTitle: "Our Core Safety Mandate",
          mandateParagraph1: "East Wind operates with a core strength centered on implementing advanced, cyber-physical safety technologies to address high-risk industrial safety challenges. We take full regional ownership of engineered packages, ensuring that refinery control rooms, offshore platforms, and hazardous factories are protected against thermal, kinetic, and chemical events.",
          mandateParagraph2: "By integrating smart IoT sensors, intrinsically safe Zone 1 mobile devices, and physics-informed neural network analytics, we help major industrial plants shift from reactive emergency firefighting to proactive, automated safety control loops. This unified approach drastically lowers client Total Cost of Ownership (TCO) while guaranteeing absolute safety compliance.",
          facilityImage: "/analyzer_shelter.webp",
          facilityCode: "SYS.FACILITY.IMG.01",
          positioning: [
            { title: "Regional Safety Leader", text: "Recognized as one of the region’s premier providers of high-end, complex industrial safety systems." },
            { title: "HCIS Standard Authority", text: "Trusted engineering partner executing projects certified to SAF-01, SAF-12, and SASO directives." },
            { title: "Lifecycle Ownership", text: "We take full responsibility from early conceptual hazard studies to system integration and lifetime support." }
          ],
          metrics: [
            { value: "70%", label: "Technical Functions Weight", desc: "Applications engineering, hardware assembly projects, instrument service, and predictive AI loops.", accent: "#1e3e8f" },
            { value: "10+", label: "Engineers & Technicians", desc: "Highly trained, certified local technical workforce executing complex regional deployments.", accent: "#c22026" },
            { value: "KSA", label: "Central Integration Facilities", desc: "Based in Dammam, featuring engineering office rooms, assembly workshops, and calibration labs.", accent: "#1e3e8f" }
          ],
          disciplines: [
            { title: "Project Management", desc: "Rigorous execution, delivery leadership, and interface coordination across multi-vendor networks.", accent: "#1e3e8f" },
            { title: "QA/QC & Compliance", desc: "Assuring design safety factors, testing verification logs, and international standard conformance.", accent: "#c22026" },
            { title: "Engineering & Integration", desc: "Multi-disciplinary CAD, functional safety design, hardware assembly, and instrument calibration.", accent: "#1e3e8f" }
          ],
          ctaTitle: "Partner With Regional Safety Engineering Leaders",
          ctaDescription: "Engage with our Dammam engineering offices for FEED hazard reviews, equipment sizing packages, and turnkey execution.",
          ctaButtonText: "Initiate Technical Scoping"
        },
        { new: true, upsert: true }
      ).lean().exec();
    }
    return (item as unknown) as IAboutContent | null;
  }

  static async upsertSection(id: string, data: Partial<IAboutContent>): Promise<IAboutContent> {
    const sanitized = sanitizeObjectImages(data, `about_${id}`);
    const doc = await AboutContent.findOneAndUpdate(
      { id },
      { ...sanitized, id },
      { new: true, upsert: true }
    ).lean().exec();
    invalidateCache("about");
    return (doc as unknown) as IAboutContent;
  }
}
