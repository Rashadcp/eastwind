import { SolutionPage, ISolutionPage } from "../db.js";

const DEFAULT_INDUSTRIES = [
  {
    id: "civil-defence",
    name: "Civil Defence",
    riskKicker: "Metropolitan Safety Infrastructure & Emergency Response",
    accent: "#991b1b",
    image: "/products/default-fire-fighting-rescue.png",
    description: "Equipping civil defence authorities with rapid intervention vehicles, CAFS fire suppression, and SCBA breathing protection systems."
  },
  {
    id: "smart-industrial-facilities",
    name: "Smart Industrial Facilities",
    riskKicker: "Automated Facility Health & Process Reliability",
    accent: "#c22026",
    image: "/products/default-process-instrumentation.png",
    description: "Deploying enterprise digital twins, automated AI permit tracking, and wireless acoustic leak sensors inside petrochemical plants."
  },
  {
    id: "oil-and-gas",
    name: "Oil and Gas",
    riskKicker: "Intelligent Hydrocarbon Operations & Wireless Gas Detection",
    accent: "#1e3e8f",
    image: "/products/default-wireless-gas-detection.png",
    description: "Integrated hydrocarbon safety, intrinsic ISA 100 wireless gas detection, temporary refuge chambers, and tank farm fire fighting."
  },
  {
    id: "marine-operations",
    name: "Marine Operations",
    riskKicker: "Harsh Deepwater Infrastructure Resilience & Damage Control",
    accent: "#b45309",
    image: "/products/default-explosion-proof-products.png",
    description: "Offshore platform and vessel safety, emergency damage control kits, hull breach shoring, and breathing air cascades."
  },
  {
    id: "utilities-and-power",
    name: "Utilities and Power",
    riskKicker: "Critical Grid Asset Safeguarding & Thermal Monitoring",
    accent: "#1e3e8f",
    image: "/products/default-process-instrumentation.png",
    description: "Securing electrical substations, gas pipelines, and SWAS water sampling systems with automated thermal monitoring."
  },
  {
    id: "defence-and-border-security",
    name: "Defence and Border Security",
    riskKicker: "National Level Security & Blast-Resistant Modules",
    accent: "#b45309",
    image: "/products/default-respiratory-protection.png",
    description: "High-grade perimeter defense, secure wireless telemetry backbones, and blast-resistant modular security offices."
  }
];

export class SolutionPageModel {
  static async get(): Promise<ISolutionPage | null> {
    let doc = await SolutionPage.findOne({ id: "solutions_page" }).exec();
    if (!doc || !doc.industries || doc.industries.length < 6) {
      doc = await SolutionPage.findOneAndUpdate(
        { id: "solutions_page" },
        {
          id: "solutions_page",
          heroBgImage: "/application.png",
          heroTagline: "ENGINEERED SAFETY & INDUSTRIAL INFRASTRUCTURE",
          heroTitle: "MIDDLE EAST SAFETY SOLUTIONS",
          heroDescription: "Eastwind Arabia supplies high-compliance fire fighting, respiratory protection, wireless gas detection, and process instrumentation modules across Saudi Arabia and the GCC.",
          industriesTagline: "SECTOR SPECIFIC OPERATIONS",
          industriesTitle: "Solutions by Industry",
          industriesDesc: "We adapt our core capabilities to the specific compliance and threat profiles of primary infrastructure sectors.",
          industries: DEFAULT_INDUSTRIES
        },
        { new: true, upsert: true }
      ).exec();
    }
    return doc;
  }

  static async update(data: Partial<ISolutionPage>): Promise<ISolutionPage> {
    return await SolutionPage.findOneAndUpdate(
      { id: "solutions_page" },
      { ...data, id: "solutions_page" },
      { new: true, upsert: true }
    ).exec();
  }
}
