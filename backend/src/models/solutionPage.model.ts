import { SolutionPage, ISolutionPage } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

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
  /**
   * Fetch the solution page configuration.
   * Creates initial defaults ONLY if the record does not exist in the database.
   */
  static async get(): Promise<ISolutionPage | null> {
    let doc = await SolutionPage.findOne({ id: "solutions_page" }).lean().exec();
    if (!doc) {
      doc = await SolutionPage.findOneAndUpdate(
        { id: "solutions_page" },
        {
          id: "solutions_page",
          heroBgImage: "/application.png",
          heroTagline: "ENGINEERED SAFETY & INDUSTRIAL INFRASTRUCTURE",
          heroTitle: "MIDDLE EAST SAFETY SOLUTIONS",
          heroDescription: "Eastwind Arabia supplies high-compliance fire fighting, respiratory protection, wireless gas detection, and process instrumentation modules across Saudi Arabia and the GCC.",
          industriesTitle: "Solutions by Industry",
          industriesDesc: "We adapt our core capabilities to the specific compliance and threat profiles of primary infrastructure sectors.",
          industries: DEFAULT_INDUSTRIES
        },
        { new: true, upsert: true }
      ).lean().exec();
    }
    return (doc as unknown) as ISolutionPage | null;
  }

  /**
   * Update solution page configuration.
   * Auto-extracts any base64 images and invalidates cache.
   */
  static async update(data: Partial<ISolutionPage>): Promise<ISolutionPage | null> {
    const sanitized = sanitizeObjectImages(data, "solutions_page");
    const doc = await SolutionPage.findOneAndUpdate(
      { id: "solutions_page" },
      { ...sanitized, id: "solutions_page" },
      { new: true, upsert: true }
    ).lean().exec();
    invalidateCache("solutions-page");
    return (doc as unknown) as ISolutionPage | null;
  }
}
