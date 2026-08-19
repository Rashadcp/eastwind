"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownOption {
  value: string;
  label: string;
}

interface ContactInfoData {
  hqTitle: string;
  hqAddress: string;
  hubTitle: string;
  hubAddress: string;
  telephone: string;
  email: string;
  workingHours: string;
  gatewayText: string;
  gatewayStatus: string;
}

interface HomeContactData {
  tagline: string;
  title: string;
  description: string;
  operationalSectors: DropdownOption[];
  submitButtonText: string;
  successTitle: string;
  successMessage: string;
}

const defaultContactInfo: ContactInfoData = {
  hqTitle: "Al Khobar Headquarters",
  hqAddress: "King Faisal West Road, Bandariyah District,\nAl Khobar, Kingdom of Saudi Arabia",
  hubTitle: "Riyadh Technology Hub",
  hubAddress: "Olaya District, Riyadh,\nKingdom of Saudi Arabia",
  telephone: "+966 13 889 XXXX",
  email: "info@eastwindsafety.com",
  workingHours: "Sunday – Thursday | 08:00 – 17:00 AST",
  gatewayText: "SECURE REGIONAL GATEWAY",
  gatewayStatus: "ONLINE",
};

const defaultHomeContact: HomeContactData = {
  tagline: "Get In Touch",
  title: "Contact Engineering",
  description: "Have a project requirement or need technical details? Coordinate with our estimating and engineering teams based in Al Khobar and Riyadh.",
  operationalSectors: [
    { value: "oil-gas", label: "Oil & Gas Infrastructure" },
    { value: "petrochemical", label: "Petrochemical Operations" },
    { value: "civil-defense", label: "Civil Defense Command" },
    { value: "marine", label: "Marine & Offshore Platforms" },
    { value: "utility-power", label: "Utility & Electrical Grids" }
  ],
  submitButtonText: "Transmit Encrypted Request //",
  successTitle: "Message Transmitted",
  successMessage: "Thank you. Your layout constraints and details have been securely logged. An application engineer will contact you shortly."
};

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfoData>(defaultContactInfo);
  const [homeContact, setHomeContact] = useState<HomeContactData>(defaultHomeContact);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    industry: "",
    scope: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const [infoRes, homeRes] = await Promise.all([
          fetch(`${baseUrl}/api/contact-settings/contact_info`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/contact-settings/home_contact`, { cache: "no-store" })
        ]);

        if (infoRes.ok) {
          const json = await infoRes.json();
          setContactInfo({
            hqTitle: json.hqTitle || defaultContactInfo.hqTitle,
            hqAddress: json.hqAddress || defaultContactInfo.hqAddress,
            hubTitle: json.hubTitle || defaultContactInfo.hubTitle,
            hubAddress: json.hubAddress || defaultContactInfo.hubAddress,
            telephone: json.telephone || defaultContactInfo.telephone,
            email: json.email || defaultContactInfo.email,
            workingHours: json.workingHours || defaultContactInfo.workingHours,
            gatewayText: json.gatewayText || defaultContactInfo.gatewayText,
            gatewayStatus: json.gatewayStatus || defaultContactInfo.gatewayStatus,
          });
        }

        if (homeRes.ok) {
          const json = await homeRes.json();
          setHomeContact({
            tagline: json.tagline || defaultHomeContact.tagline,
            title: json.title || defaultHomeContact.title,
            description: json.description || defaultHomeContact.description,
            operationalSectors: json.operationalSectors && json.operationalSectors.length > 0 ? json.operationalSectors : defaultHomeContact.operationalSectors,
            submitButtonText: json.submitButtonText || defaultHomeContact.submitButtonText,
            successTitle: json.successTitle || defaultHomeContact.successTitle,
            successMessage: json.successMessage || defaultHomeContact.successMessage,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dynamic contact settings:", err);
      }
    };

    fetchContactSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({ name: "", email: "", industry: "", scope: "" });
      }, 4000);
    }, 1200);
  };

  return (
    <section
      id="contact-us"
      className="relative w-full py-28 max-md:py-16 bg-transparent overflow-hidden"
    >
      {/* Symmetrical backgrounds matching the rest of the light theme */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(30,62,143,0.05) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(194,32,38,0.04) 0%, transparent 70%)",
            filter: "blur(110px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(30,62,143,0.04) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-8 max-sm:px-5">
        
        {/* Section Header */}
        <div className="mb-16 max-w-[800px]">
          <span className="block text-[0.8rem] uppercase tracking-[0.25em] text-[#c22026] mb-4 font-bold">
            {homeContact.tagline}
          </span>
          <h2 className="text-[3.2rem] max-sm:text-[2.4rem] text-slate-900 mb-5 uppercase tracking-tight font-extrabold leading-none">
            {homeContact.title}
          </h2>
          <p className="text-[1.1rem] text-slate-600 leading-relaxed font-light">
            {homeContact.description}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Office details */}
          <div
            className="lg:col-span-5 flex flex-col justify-between rounded-[28px] p-10 max-sm:p-7 relative overflow-hidden"
            style={{
              background: "#f2f4f2",
              border: "1px solid #e2e6e3",
              boxShadow: "0 4px 24px rgba(30,62,143,0.05), 0 1px 2px rgba(0,0,0,0.02)",
            }}
          >
            <div className="space-y-8">
              
              {/* Al Khobar HQ */}
              <div className="flex gap-5 items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200/60 shadow-xs shrink-0 transition-all duration-300 group-hover:border-[#1e3e8f] group-hover:shadow-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3e8f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">{contactInfo.hqTitle}</h4>
                  <p className="text-[0.88rem] text-slate-500 leading-relaxed font-light m-0 whitespace-pre-line">
                    {contactInfo.hqAddress}
                  </p>
                </div>
              </div>

              {/* Riyadh Hub */}
              <div className="flex gap-5 items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200/60 shadow-xs shrink-0 transition-all duration-300 group-hover:border-[#c22026] group-hover:shadow-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c22026" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">{contactInfo.hubTitle}</h4>
                  <p className="text-[0.88rem] text-slate-500 leading-relaxed font-light m-0 whitespace-pre-line">
                    {contactInfo.hubAddress}
                  </p>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="flex gap-5 items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200/60 shadow-xs shrink-0 transition-all duration-300 group-hover:border-slate-400 group-hover:shadow-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Direct Contacts</h4>
                  <p className="text-[0.88rem] text-slate-500 leading-relaxed font-light m-0">
                    Secure Tel: {contactInfo.telephone}<br />
                    Email: <a href={`mailto:${contactInfo.email}`} className="text-[#c22026] hover:text-[#1e3e8f] transition-all duration-200 font-semibold">{contactInfo.email}</a>
                  </p>
                </div>
              </div>

            </div>



          </div>

          {/* Right Column: Intake Form */}
          <div
            className="lg:col-span-7 rounded-[28px] p-10 max-sm:p-7 relative overflow-hidden"
            style={{
              background: "#f2f4f2",
              border: "1px solid #e2e6e3",
              boxShadow: "0 4px 24px rgba(30,62,143,0.05), 0 1px 2px rgba(0,0,0,0.02)",
            }}
          >
            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full flex flex-col justify-center items-center text-center py-10"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-3xl font-bold mb-5 shadow-xs">
                    ✓
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">{homeContact.successTitle}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-normal max-w-sm m-0">
                    {homeContact.successMessage}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Site Engineer Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full min-h-[46px] px-4 rounded-xl bg-white border border-slate-200 text-slate-800 font-sans text-xs focus:outline-none focus:border-[#1e3e8f] focus:ring-1 focus:ring-[#1e3e8f] transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="engineer@enterprise.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full min-h-[46px] px-4 rounded-xl bg-white border border-slate-200 text-slate-800 font-sans text-xs focus:outline-none focus:border-[#1e3e8f] focus:ring-1 focus:ring-[#1e3e8f] transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">Operational Sector</label>
                    <div className="relative">
                      <select
                        required
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full min-h-[46px] px-4 rounded-xl bg-white border border-slate-200 text-slate-650 font-sans text-xs focus:outline-none focus:border-[#1e3e8f] focus:ring-1 focus:ring-[#1e3e8f] transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select sector classification...</option>
                        {homeContact.operationalSectors.map((sec) => (
                          <option key={sec.value} value={sec.value}>
                            {sec.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 text-xs">▼</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">Project Scope & Details</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Specify physical constraints, gas exposure matrices, or certifications needed (HCIS, ATEX, NFPA, etc.)..."
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-800 font-sans text-xs focus:outline-none focus:border-[#1e3e8f] focus:ring-1 focus:ring-[#1e3e8f] transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[48px] bg-slate-900 hover:bg-[#c22026] text-white text-xs font-mono uppercase tracking-widest rounded-full transition-all duration-300 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? "TRANSMITTING..." : homeContact.submitButtonText}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
