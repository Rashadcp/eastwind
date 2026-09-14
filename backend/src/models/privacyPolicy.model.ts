import { PrivacyPolicy, IPrivacyPolicy } from "../db.js";
import { sanitizeObjectImages } from "../utils/imageStorage.js";
import { invalidateCache } from "../utils/cache.js";

const DEFAULT_PRIVACY_POLICY: Partial<IPrivacyPolicy> = {
  id: "default",
  heroTitle: "Privacy Policy",
  heroTagline: "Data Protection & Regulatory Compliance",
  heroBgImage: "/about_hero_bg.png?v=3",
  effectiveDate: "September 14, 2026",
  introText: "East Wind Safety is dedicated to upholding the highest standards of confidentiality, data integrity, and privacy governance. This policy details our data protection practices in full compliance with the Kingdom of Saudi Arabia Personal Data Protection Law (PDPL).",
  sections: [
    {
      id: "sec-scope",
      title: "1. Scope & Regulatory Framework",
      content: "This Privacy Policy governs the collection, processing, storage, and transfer of personal, corporate, and technical data by East Wind Safety ('East Wind', 'we', 'us', or 'our') through our official digital portals, customer portals, request-for-quotation (RFQ) pipelines, and physical engineering operations across the Kingdom of Saudi Arabia.\n\nOur operations strictly adhere to the Saudi Personal Data Protection Law (PDPL) enacted by Royal Decree No. M/19, its Implementing Regulations issued by the Saudi Data & AI Authority (SDAIA), and relevant cybersecurity directives issued by the National Cybersecurity Authority (NCA).",
      order: 1
    },
    {
      id: "sec-collection",
      title: "2. Categories of Information We Collect",
      content: "We collect only the data necessary to fulfill technical engineering solutions, deliver certified life safety equipment, and maintain regulatory compliance:\n\n• Professional & Contact Identification: Full name, business email address, direct telephone/mobile numbers, corporate affiliation, job title, and engineering department.\n• Project & Engineering Specifications: Facility hazard classifications (ATEX/IECEx Zones 0, 1, 2), HCIS regulatory safety directives, technical RFQ documentation, bill of materials, and site delivery parameters.\n• Digital & Device Telemetry: IP addresses, approximate geographic location, browser metadata, operating system metrics, and navigational pathways across our public catalog to optimize digital performance and prevent unauthorized intrusion.",
      order: 2
    },
    {
      id: "sec-purpose",
      title: "3. Lawful Basis & Purposes of Processing",
      content: "East Wind processes collected data strictly pursuant to lawful bases defined under KSA PDPL:\n\n• Contractual Execution: Processing requests for quotation, issuing commercial and technical proposals, executing system integration projects, and fulfilling warranty and maintenance contracts.\n• Regulatory Compliance: Satisfying mandatory audit and traceability obligations mandated by the High Commission for Industrial Security (HCIS), Saudi Standards, Metrology and Quality Organization (SASO), and the General Authority of Zakat and Tax (ZATCA).\n• Legitimate Business Interests: Maintaining cybersecurity vigilance, preventing industrial espionage, authenticating administrative accounts via multi-factor authentication, and improving our safety instrumentation offerings.",
      order: 3
    },
    {
      id: "sec-storage",
      title: "4. Data Storage, Residency & Cross-Border Transfers",
      content: "In compliance with KSA data sovereignty mandates, all core databases, enterprise resource systems, and client records are hosted on secure servers and certified cloud infrastructure physically located within the Kingdom of Saudi Arabia.\n\nCross-border transfers of data occur only in limited scenarios involving foreign certified original equipment manufacturers (OEMs) for specialized sensor calibration, factory acceptance testing, or international warranty registration. Such transfers are governed by SDAIA-approved Standard Contractual Clauses (SCCs) ensuring an adequate level of data protection.",
      order: 4
    },
    {
      id: "sec-security",
      title: "5. Information Security & Safeguards",
      content: "East Wind enforces enterprise-grade physical, technical, and procedural security controls to safeguard data from loss, unauthorized disclosure, or malicious tampering:\n\n• Transport Layer Security (TLS 1.3) cryptographic protocols for all data in transit.\n• AES-256 encryption for sensitive records stored at rest.\n• Strict role-based access control (RBAC) limiting employee data access strictly to a 'need-to-know' basis.\n• Routine vulnerability assessments and automated cyber-incident logging.",
      order: 5
    },
    {
      id: "sec-rights",
      title: "6. Data Subject Rights Under KSA PDPL",
      content: "Under the Saudi Personal Data Protection Law, individuals have enforceable rights regarding their personal data:\n\n• Right to Know: The right to be informed about the lawful basis and purpose of data collection.\n• Right of Access: The right to inspect and obtain a readable copy of personal data held by East Wind.\n• Right to Rectification: The right to request correction, completion, or updating of inaccurate data.\n• Right to Destruction: The right to request erasure of data that is no longer required for its lawful purpose, subject to statutory retention limits.\n• Right to Withdraw Consent: The right to revoke consent for optional marketing communications at any time without retroactive prejudice.",
      order: 6
    },
    {
      id: "sec-retention",
      title: "7. Retention Periods",
      content: "Personal and corporate data is retained only for the duration required to satisfy the operational purpose for which it was gathered, or as required by applicable statutory and regulatory retention mandates (typically 5 to 10 years for engineering project documentation, taxation, and statutory safety audit trails under Saudi law). Upon expiration of the retention window, records are permanently purged or irreversibly anonymized.",
      order: 7
    },
    {
      id: "sec-contact",
      title: "8. Data Protection Officer & Inquiries",
      content: "To exercise any of your statutory rights, submit a privacy complaint, or request clarification regarding our data governance policies, please contact our Data Protection and Compliance Department:\n\nEast Wind Safety Integrator\nAttn: Data Protection Officer\nP14, 2nd Industrial City, Dammam, Kingdom of Saudi Arabia\nEmail: enquiry@eastwind.sa\nTelephone: +966 570 833 214",
      order: 8
    }
  ],
  contactEmail: "enquiry@eastwind.sa",
  contactPhone: "+966 570 833 214",
  contactAddress: "P14, 2nd Industrial City, Dammam, Kingdom of Saudi Arabia"
};

export class PrivacyPolicyModel {
  static async get(): Promise<IPrivacyPolicy> {
    let doc = await PrivacyPolicy.findOne({ id: "default" }).lean().exec();
    if (!doc) {
      doc = await PrivacyPolicy.findOneAndUpdate(
        { id: "default" },
        DEFAULT_PRIVACY_POLICY,
        { new: true, upsert: true }
      ).lean().exec();
    }
    return (doc as unknown) as IPrivacyPolicy;
  }

  static async update(data: Partial<IPrivacyPolicy>): Promise<IPrivacyPolicy> {
    const sanitized = sanitizeObjectImages(data, "privacy_policy");
    const doc = await PrivacyPolicy.findOneAndUpdate(
      { id: "default" },
      { ...sanitized, id: "default" },
      { new: true, upsert: true }
    ).lean().exec();
    invalidateCache("privacy-policy");
    return (doc as unknown) as IPrivacyPolicy;
  }
}
