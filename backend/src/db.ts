import mongoose, { Schema, Document } from "mongoose";
import fs from "fs";
import { DB_FILE } from "./config.js";

// --- Mongoose Document Interfaces ---

export interface IProduct extends Document {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  features: string[];
  specifications: { label: string; value: string }[];
  imageUrl?: string;
}

export interface ISolution extends Document {
  id: string;
  title: string;
  subLabel: string;
  tagline: string;
  accent: "blue" | "orange";
  description: string;
  detailedContent: string;
  features: string[];
  compliance: string[];
  specs: { label: string; value: string }[];
  benefits: string[];
  applications: string[];
  imageUrl: string;
}

export interface IApplication extends Document {
  id: string;
  title: string;
  category: string;
  tagline: string;
  overview: string;
  accentHex: string;
  capabilities: { title: string; body: string }[];
  useCases: string[];
  metrics: { value: string; label: string }[];
  relatedSolutions: { name: string; href: string }[];
}

export interface IService extends Document {
  id: string;
  title: string;
  category: string;
  tagline: string;
  overview: string;
  accentHex: string;
  capabilities: { title: string; body: string }[];
  deliverables: string[];
  metrics: { value: string; label: string }[];
  relatedSolutions: { name: string; href: string }[];
}

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  salt: string;
}

export interface IAboutContent extends Document {
  id: string; // 'home' | 'about_page'
  imageUrl?: string;
  title?: string;
  overviewText?: string;
  secondaryText?: string;
  lifecycleSteps?: string[];
  heroBgImage?: string;
  heroTagline?: string;
  heroTitle?: string;
  heroDescription?: string;
  mandateBadge?: string;
  mandateTitle?: string;
  mandateParagraph1?: string;
  mandateParagraph2?: string;
  facilityImage?: string;
  facilityCode?: string;
  positioning?: { title: string; text: string }[];
  metrics?: { value: string; label: string; desc: string; accent?: string }[];
  disciplines?: { title: string; desc: string; accent?: string }[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
}

export interface IContactSettings extends Document {
  id: string; // 'contact_info' | 'home_contact' | 'contact_page' | 'enquiry_page'
  hqTitle?: string;
  hqAddress?: string;
  hubTitle?: string;
  hubAddress?: string;
  telephone?: string;
  email?: string;
  workingHours?: string;
  gatewayText?: string;
  gatewayStatus?: string;
  tagline?: string;
  title?: string;
  description?: string;
  operationalSectors?: { value: string; label: string }[];
  submitButtonText?: string;
  successTitle?: string;
  successMessage?: string;
  heroBgImage?: string;
  heroTagline?: string;
  heroTitle?: string;
  heroDescription?: string;
  communicationsTagline?: string;
  communicationsTitle?: string;
  communicationsDesc?: string;
  formSubHeaderTagline?: string;
  formSubHeaderTitle?: string;
  marketSegments?: { value: string; label: string }[];
  enquiryTagline?: string;
  enquiryTitle?: string;
  enquiryDescription?: string;
  applicationPurposes?: { value: string; label: string }[];
}

export interface ISolutionPage extends Document {
  id: string; // 'solutions_page'
  heroBgImage?: string;
  heroTagline?: string;
  heroTitle?: string;
  heroDescription?: string;
  industriesTagline?: string;
  industriesTitle?: string;
  industriesDesc?: string;
  industries?: {
    id: string;
    name: string;
    riskKicker: string;
    accent: string;
    image: string;
    description: string;
  }[];
  capabilitiesTagline?: string;
  capabilitiesTitle?: string;
  capabilitiesDesc?: string;
  corePortfolios?: {
    title: string;
    description: string;
    items: string[];
    icon: string;
  }[];
  partnersTagline?: string;
  partnersTitle?: string;
  partnersDesc?: string;
  partners?: any[];
  gatewayTagline?: string;
  gatewayTitle?: string;
  gatewayDesc?: string;
  solutionScopeOptions?: { value: string; label: string }[];
  submitButtonText?: string;
}

export interface ISuccessStoryResult {
  label: string;
  value: string;
}

export interface ISuccessStory extends Document {
  id: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  results: ISuccessStoryResult[];
  imageUrl: string;
  featured?: boolean;
  year?: string;
  createdAt?: Date;
}

export interface IBrandProduct {
  id: string;
  name: string;
  category?: string;
  solutionName?: string;
  imageUrl?: string;
  description?: string;
}

export interface IBrand extends Document {
  id: string;
  name: string;
  tagline: string;
  solutionId: string;
  solutionName: string;
  description: string;
  logoUrl?: string;
  accent: string;
  products: IBrandProduct[];
}

// --- Mongoose Schemas ---

const ProductSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true, index: true },
  slug: { type: String, default: "" },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  features: { type: [String], default: [] },
  specifications: [{ label: String, value: String }],
  imageUrl: { type: String }
});

const SolutionSchema = new Schema<ISolution>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  subLabel: { type: String, default: "" },
  tagline: { type: String, required: true },
  accent: { type: String, enum: ["blue", "orange"], default: "blue" },
  description: { type: String, required: true },
  detailedContent: { type: String, default: "" },
  features: { type: [String], default: [] },
  compliance: { type: [String], default: [] },
  specs: [{ label: String, value: String }],
  benefits: { type: [String], default: [] },
  applications: { type: [String], default: [] },
  imageUrl: { type: String, default: "" }
});

const ApplicationSchema = new Schema<IApplication>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, default: "" },
  tagline: { type: String, required: true },
  overview: { type: String, required: true },
  accentHex: { type: String, default: "#38bdf8" },
  capabilities: [{ title: String, body: String }],
  useCases: { type: [String], default: [] },
  metrics: [{ value: String, label: String }],
  relatedSolutions: [{ name: String, href: String }]
});

const ServiceSchema = new Schema<IService>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  category: { type: String, default: "" },
  tagline: { type: String, required: true },
  overview: { type: String, required: true },
  accentHex: { type: String, default: "#10b981" },
  capabilities: [{ title: String, body: String }],
  deliverables: { type: [String], default: [] },
  metrics: [{ value: String, label: String }],
  relatedSolutions: [{ name: String, href: String }]
});

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true }
});

const AboutContentSchema = new Schema<IAboutContent>({
  id: { type: String, required: true, unique: true, index: true },
  imageUrl: { type: String },
  title: { type: String },
  overviewText: { type: String },
  secondaryText: { type: String },
  lifecycleSteps: { type: [String], default: [] },
  heroBgImage: { type: String },
  heroTagline: { type: String },
  heroTitle: { type: String },
  heroDescription: { type: String },
  mandateBadge: { type: String },
  mandateTitle: { type: String },
  mandateParagraph1: { type: String },
  mandateParagraph2: { type: String },
  facilityImage: { type: String },
  facilityCode: { type: String },
  positioning: [{ title: String, text: String }],
  metrics: [{ value: String, label: String, desc: String, accent: String }],
  disciplines: [{ title: String, desc: String, accent: String }],
  ctaTitle: { type: String },
  ctaDescription: { type: String },
  ctaButtonText: { type: String }
});

const ContactSettingsSchema = new Schema<IContactSettings>({
  id: { type: String, required: true, unique: true, index: true },
  hqTitle: { type: String },
  hqAddress: { type: String },
  hubTitle: { type: String },
  hubAddress: { type: String },
  telephone: { type: String },
  email: { type: String },
  workingHours: { type: String },
  gatewayText: { type: String },
  gatewayStatus: { type: String },
  tagline: { type: String },
  title: { type: String },
  description: { type: String },
  operationalSectors: [{ value: String, label: String }],
  submitButtonText: { type: String },
  successTitle: { type: String },
  successMessage: { type: String },
  heroBgImage: { type: String },
  heroTagline: { type: String },
  heroTitle: { type: String },
  heroDescription: { type: String },
  communicationsTagline: { type: String },
  communicationsTitle: { type: String },
  communicationsDesc: { type: String },
  formSubHeaderTagline: { type: String },
  formSubHeaderTitle: { type: String },
  marketSegments: [{ value: String, label: String }],
  enquiryTagline: { type: String },
  enquiryTitle: { type: String },
  enquiryDescription: { type: String },
  applicationPurposes: [{ value: String, label: String }]
});

const SolutionPageSchema = new Schema<ISolutionPage>({
  id: { type: String, required: true, unique: true, index: true },
  heroBgImage: { type: String },
  heroTagline: { type: String },
  heroTitle: { type: String },
  heroDescription: { type: String },
  industriesTagline: { type: String },
  industriesTitle: { type: String },
  industriesDesc: { type: String },
  industries: [{
    id: String,
    name: String,
    riskKicker: String,
    accent: String,
    image: String,
    description: String
  }],
  capabilitiesTagline: { type: String },
  capabilitiesTitle: { type: String },
  capabilitiesDesc: { type: String },
  corePortfolios: [{
    title: String,
    description: String,
    items: [String],
    icon: String
  }],
  partnersTagline: { type: String },
  partnersTitle: { type: String },
  partnersDesc: { type: String },
  partners: { type: [Schema.Types.Mixed], default: [] },
  gatewayTagline: { type: String },
  gatewayTitle: { type: String },
  gatewayDesc: { type: String },
  solutionScopeOptions: [{ value: String, label: String }],
  submitButtonText: { type: String }
});

const BrandSchema = new Schema<IBrand>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  tagline: { type: String, default: "" },
  solutionId: { type: String, default: "" },
  solutionName: { type: String, default: "" },
  description: { type: String, default: "" },
  logoUrl: { type: String, default: "" },
  accent: { type: String, default: "orange" },
  products: [{
    id: String,
    name: String,
    category: String,
    solutionName: String,
    imageUrl: String,
    description: String
  }]
});

const SuccessStorySchema = new Schema<ISuccessStory>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  client: { type: String, required: true },
  category: { type: String, default: "Industrial Safety" },
  summary: { type: String, required: true },
  challenge: { type: String, default: "" },
  solution: { type: String, default: "" },
  results: [{ label: String, value: String }],
  imageUrl: { type: String, default: "/products/default-fire-fighting-rescue.png" },
  featured: { type: Boolean, default: true },
  year: { type: String, default: "2025" }
}, { timestamps: true });

// --- Mongoose Models ---

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export const Solution = mongoose.models.Solution || mongoose.model<ISolution>("Solution", SolutionSchema);
export const Application = mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
export const Service = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
export const AboutContent = mongoose.models.AboutContent || mongoose.model<IAboutContent>("AboutContent", AboutContentSchema);
export const ContactSettings = mongoose.models.ContactSettings || mongoose.model<IContactSettings>("ContactSettings", ContactSettingsSchema);
export const SolutionPage = mongoose.models.SolutionPage || mongoose.model<ISolutionPage>("SolutionPage", SolutionPageSchema);
export const Brand = mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);
export const SuccessStory = mongoose.models.SuccessStory || mongoose.model<ISuccessStory>("SuccessStory", SuccessStorySchema);

// --- Database Seeding logic ---

export async function seedDatabase(): Promise<void> {
  try {
    const counts = {
      products: await Product.countDocuments(),
      solutions: await Solution.countDocuments(),
      applications: await Application.countDocuments(),
      services: await Service.countDocuments(),
      admins: await Admin.countDocuments(),
      about: await AboutContent.countDocuments(),
      contactSettings: await ContactSettings.countDocuments(),
      solutionPage: await SolutionPage.countDocuments(),
      brands: await Brand.countDocuments(),
    };

    const needsSeeding = 
      counts.products === 0 || 
      counts.solutions === 0 || 
      counts.applications === 0 || 
      counts.services === 0 || 
      counts.admins === 0 ||
      counts.about === 0 ||
      counts.contactSettings === 0 ||
      counts.solutionPage === 0 ||
      counts.brands === 0;

    if (!needsSeeding) {
      console.log(`Database verification passed. MongoDB collections loaded.
        - ${counts.products} Products
        - ${counts.solutions} Solutions
        - ${counts.applications} Applications
        - ${counts.services} Services
        - ${counts.admins} Admins
        - ${counts.about} About Content Records
        - ${counts.contactSettings} Contact Settings Records
        - ${counts.solutionPage} Solutions Page Configuration
        - ${counts.brands} Brands Portfolio`);
      return;
    }

    console.log("One or more MongoDB collections are empty. Scanning local database.json file...");
    if (!fs.existsSync(DB_FILE)) {
      console.warn(`Local seed file database.json not found at ${DB_FILE}. Skipping seeding.`);
      return;
    }

    const rawData = fs.readFileSync(DB_FILE, "utf-8");
    const seed = JSON.parse(rawData);

    if (counts.products === 0 && seed.products && seed.products.length > 0) {
      console.log(`Seeding ${seed.products.length} Products to MongoDB...`);
      await Product.insertMany(seed.products);
    }
    if (counts.solutions === 0 && seed.solutions && seed.solutions.length > 0) {
      console.log(`Seeding ${seed.solutions.length} Solutions to MongoDB...`);
      await Solution.insertMany(seed.solutions);
    }
    if (counts.applications === 0 && seed.applications && seed.applications.length > 0) {
      console.log(`Seeding ${seed.applications.length} Applications to MongoDB...`);
      await Application.insertMany(seed.applications);
    }
    if (counts.services === 0 && seed.services && seed.services.length > 0) {
      console.log(`Seeding ${seed.services.length} Services to MongoDB...`);
      await Service.insertMany(seed.services);
    }
    if (counts.admins === 0 && seed.admin && seed.admin.length > 0) {
      console.log(`Seeding ${seed.admin.length} Administrators to MongoDB...`);
      await Admin.insertMany(seed.admin);
    }
    if (counts.about === 0 && seed.about && seed.about.length > 0) {
      console.log(`Seeding ${seed.about.length} About Content Records to MongoDB...`);
      await AboutContent.insertMany(seed.about);
    }
    if (counts.contactSettings === 0 && seed.contact_settings && seed.contact_settings.length > 0) {
      console.log(`Seeding ${seed.contact_settings.length} Contact Settings Records to MongoDB...`);
      await ContactSettings.insertMany(seed.contact_settings);
    }
    if (counts.solutionPage === 0 && seed.solutions_page && seed.solutions_page.length > 0) {
      console.log(`Seeding ${seed.solutions_page.length} Solutions Page Configuration to MongoDB...`);
      await SolutionPage.insertMany(seed.solutions_page);
    }
    if (seed.brands && seed.brands.length > 0) {
      console.log(`Upserting ${seed.brands.length} Brands into MongoDB...`);
      for (const b of seed.brands) {
        await Brand.findOneAndUpdate({ id: b.id }, b, { upsert: true, new: true });
      }
    }

    console.log("Database initialization & seeding completed successfully.");
  } catch (error) {
    console.error("Critical Failure during MongoDB seeding process:", error);
  }
}
