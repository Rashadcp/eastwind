import mongoose, { Schema, Document } from "mongoose";
import fs from "fs";
import { DB_FILE } from "../config.js";
import { invalidateCache } from "../utils/cache.js";

export interface ISeoSetting extends Document {
  id: string; // Same as pageKey
  pageKey: string;
  pageName: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  structuredDataJson?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SeoSettingSchema = new Schema<ISeoSetting>(
  {
    id: { type: String, required: true, unique: true, index: true },
    pageKey: { type: String, required: true, unique: true, index: true },
    pageName: { type: String, required: true },
    path: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    keywords: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "/logo.png" },
    robots: { type: String, default: "index, follow" },
    structuredDataJson: { type: String, default: "" }
  },
  { timestamps: true }
);

export const SeoSetting =
  mongoose.models.SeoSetting ||
  mongoose.model<ISeoSetting>("SeoSetting", SeoSettingSchema);

export const DEFAULT_SEO_SETTINGS = [
  {
    id: "home",
    pageKey: "home",
    pageName: "Home Page",
    path: "/",
    title: "Eastwind Energy Arabia | Industrial Digitalization & Critical Safety Infrastructure",
    description: "Fusing Industrial Digitalization, Edge Wireless Data Acquisition, Predictive AI Analytics, Intrinsically Safe Mobility, and Fire & Rescue Engineering across the Middle East.",
    keywords: "industrial safety Saudi Arabia, ATEX Zone 1, wireless gas detection, CAFS firefighting systems, intrinsically safe mobility, HCIS compliance, Eastwind Energy Arabia",
    canonicalUrl: "https://eastwindsafety.com/",
    ogTitle: "Eastwind Energy Arabia | Industrial Digitalization & Safety",
    ogDescription: "Specialized life safety engineering, wireless telemetry, ATEX instrumentation, and industrial safety integration in Saudi Arabia.",
    ogImage: "/logo.png",
    robots: "index, follow"
  },
  {
    id: "about",
    pageKey: "about",
    pageName: "About Us",
    path: "/about",
    title: "About Us | Mission-Critical Safety Infrastructure | Eastwind Safety Arabia",
    description: "East Wind is a specialized safety solutions integrator in Saudi Arabia, delivering lifecycle engineering, ATEX/IECEx certified packages, and advanced cyber-physical safety technologies.",
    keywords: "about east wind, mission critical safety, ATEX packages KSA, Dammam safety integrator, HCIS compliance authority",
    canonicalUrl: "https://eastwindsafety.com/about",
    ogTitle: "About Us | Eastwind Safety Arabia",
    ogDescription: "Mission-critical industrial safety engineering, functional safety loops, and emergency response solutions across the Kingdom of Saudi Arabia.",
    ogImage: "/analyzer_shelter.webp",
    robots: "index, follow"
  },
  {
    id: "products",
    pageKey: "products",
    pageName: "Products Catalog",
    path: "/products",
    title: "Industrial Safety Products & Certified Equipment | Eastwind Safety Arabia",
    description: "Explore our comprehensive catalog of ATEX/IECEx certified safety equipment, wireless gas detectors, breathing air cascades, CAFS systems, and explosion-proof mobility devices.",
    keywords: "safety equipment catalog, ATEX Zone 1 hardware, wireless gas detector, SCBA compressors, CAFS equipment, explosion proof devices",
    canonicalUrl: "https://eastwindsafety.com/products",
    ogTitle: "Industrial Safety Products Catalog | Eastwind Safety Arabia",
    ogDescription: "Engineered life-safety products, explosion-proof gear, and emergency response instrumentation certified for high-risk industrial facilities in KSA.",
    ogImage: "/logo.png",
    robots: "index, follow"
  },
  {
    id: "solutions",
    pageKey: "solutions",
    pageName: "Solutions Overview",
    path: "/solutions",
    title: "Integrated Safety Solutions & Turnkey Systems | Eastwind Safety Arabia",
    description: "End-to-end engineered safety solutions including wireless gas telemetry, temporary refuge chambers, CAFS tank farm systems, and digital mobility platforms.",
    keywords: "engineered safety solutions, wireless telemetry systems, temporary refuge chambers, tank farm fire fighting, plant AI diagnostics",
    canonicalUrl: "https://eastwindsafety.com/solutions",
    ogTitle: "Integrated Industrial Safety Solutions | Eastwind Safety Arabia",
    ogDescription: "Engineered systems integrating ATEX hardware, real-time wireless telemetry, and HCIS-compliant plant monitoring across Saudi Arabia.",
    ogImage: "/application.png",
    robots: "index, follow"
  },
  {
    id: "applications",
    pageKey: "applications",
    pageName: "Technical Applications",
    path: "/solutions?type=applications",
    title: "Technical Applications Portfolio | Eastwind Safety Arabia",
    description: "Explore our core technical application frameworks designed to engineer continuous safety and operational intelligence across hazardous facilities.",
    keywords: "industrial applications, ATEX mobility applications, gas detection loops, fire rescue systems, breathing protection applications",
    canonicalUrl: "https://eastwindsafety.com/solutions?type=applications",
    ogTitle: "Technical Applications Portfolio | Eastwind Safety Arabia",
    ogDescription: "Application frameworks for high-hazard refineries, petrochemical complexes, and offshore rigs in Saudi Arabia.",
    ogImage: "/application.png",
    robots: "index, follow"
  },
  {
    id: "services",
    pageKey: "services",
    pageName: "Engineering Services",
    path: "/solutions?type=services",
    title: "Engineering Services & Maintenance Support | Eastwind Safety Arabia",
    description: "Turnkey lifecycle services including system integration, functional safety audits, equipment calibration, breathing air cascade maintenance, and onsite safety support.",
    keywords: "safety engineering services, instrumentation calibration, F&G 3D mapping, HCIS safety audits, cascade loop maintenance",
    canonicalUrl: "https://eastwindsafety.com/solutions?type=services",
    ogTitle: "Safety Engineering & Maintenance Services | Eastwind Safety Arabia",
    ogDescription: "Expert safety engineering, calibration, compliance auditing, and emergency support throughout the Kingdom of Saudi Arabia.",
    ogImage: "/logo.png",
    robots: "index, follow"
  },
  {
    id: "contact",
    pageKey: "contact",
    pageName: "Contact & Regional Hubs",
    path: "/contact",
    title: "Contact Us & Regional Offices | Eastwind Safety Arabia",
    description: "Get in touch with East Wind Safety engineering specialists. Offices in Al Khobar and Riyadh. Contact us for requests for quotation, system integration inquiries, or technical support.",
    keywords: "contact east wind safety, Al Khobar safety integrator, Riyadh office, RFQ request safety equipment, technical enquiry Dammam",
    canonicalUrl: "https://eastwindsafety.com/contact",
    ogTitle: "Contact Eastwind Safety Arabia",
    ogDescription: "Connect with our certified safety engineers in Saudi Arabia for project RFQs, site assessments, and equipment inquiries.",
    ogImage: "/logo.png",
    robots: "index, follow"
  },
  {
    id: "privacy-policy",
    pageKey: "privacy-policy",
    pageName: "Privacy Policy",
    path: "/privacy-policy",
    title: "Privacy Policy & Data Protection | Eastwind Safety Arabia",
    description: "Official Privacy Policy of East Wind Safety Integrator. Learn how we handle corporate and technical data in strict compliance with Saudi Personal Data Protection Law (PDPL) and HCIS standards.",
    keywords: "East Wind privacy policy, KSA PDPL compliance, Saudi data protection, HCIS cybersecurity, data privacy Dammam",
    canonicalUrl: "https://eastwindsafety.com/privacy-policy",
    ogTitle: "Privacy Policy & Data Protection | Eastwind Safety Arabia",
    ogDescription: "Official data governance and privacy policies of East Wind Safety under Saudi Personal Data Protection Law (PDPL).",
    ogImage: "/logo.png",
    robots: "index, follow"
  }
];

function syncToDatabaseJson(settings: any[]): void {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const data = JSON.parse(raw);
      data.seo_settings = settings;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to sync SEO settings to database.json:", err);
  }
}

export class SeoModel {
  static async getAll(): Promise<any[]> {
    let list = await SeoSetting.find({}).sort({ createdAt: 1 }).lean().exec();

    // If MongoDB is empty, seed defaults
    if (!list || list.length === 0) {
      if (fs.existsSync(DB_FILE)) {
        try {
          const raw = fs.readFileSync(DB_FILE, "utf-8");
          const data = JSON.parse(raw);
          if (Array.isArray(data.seo_settings) && data.seo_settings.length > 0) {
            await SeoSetting.insertMany(data.seo_settings);
            return data.seo_settings;
          }
        } catch (e) {}
      }

      await SeoSetting.insertMany(DEFAULT_SEO_SETTINGS);
      syncToDatabaseJson(DEFAULT_SEO_SETTINGS);
      return DEFAULT_SEO_SETTINGS;
    }

    return list;
  }

  static async getByPageKey(pageKey: string): Promise<any> {
    const cleanKey = pageKey.toLowerCase().trim();
    let doc = await SeoSetting.findOne({
      $or: [{ pageKey: cleanKey }, { id: cleanKey }]
    }).lean().exec();

    if (!doc) {
      // Check defaults
      const foundDefault = DEFAULT_SEO_SETTINGS.find(
        (s) => s.pageKey === cleanKey || s.id === cleanKey
      );
      if (foundDefault) {
        doc = await SeoSetting.create(foundDefault);
      }
    }

    return doc;
  }

  static async upsert(pageKey: string, payload: Partial<ISeoSetting>): Promise<any> {
    const cleanKey = pageKey.toLowerCase().trim();
    const updateData = {
      ...payload,
      id: cleanKey,
      pageKey: cleanKey
    };

    const doc = await SeoSetting.findOneAndUpdate(
      { $or: [{ pageKey: cleanKey }, { id: cleanKey }] },
      { $set: updateData },
      { upsert: true, new: true }
    ).lean().exec();

    const all = await this.getAll();
    syncToDatabaseJson(all);

    invalidateCache("seo");
    return doc;
  }

  static async create(payload: any): Promise<any> {
    const pageKey = (payload.pageKey || payload.id || payload.pageName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await SeoSetting.findOne({
      $or: [{ pageKey }, { id: pageKey }]
    }).lean().exec();

    if (existing) {
      throw new Error(`SEO configuration for page '${pageKey}' already exists`);
    }

    const newSetting = await SeoSetting.create({
      ...payload,
      id: pageKey,
      pageKey
    });

    const all = await this.getAll();
    syncToDatabaseJson(all);

    invalidateCache("seo");
    return newSetting;
  }

  static async delete(pageKey: string): Promise<any> {
    const cleanKey = pageKey.toLowerCase().trim();
    const deleted = await SeoSetting.findOneAndDelete({
      $or: [{ pageKey: cleanKey }, { id: cleanKey }]
    }).lean().exec();

    if (!deleted) {
      throw new Error(`SEO setting for '${cleanKey}' not found`);
    }

    const all = await this.getAll();
    syncToDatabaseJson(all);

    invalidateCache("seo");
    return deleted;
  }
}
