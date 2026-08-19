"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

interface DropdownOption {
  value: string;
  label: string;
}

interface EnquiryPageSettings {
  enquiryTagline: string;
  enquiryTitle: string;
  enquiryDescription: string;
  applicationPurposes: DropdownOption[];
  submitButtonText: string;
  successTitle: string;
  successMessage: string;
}

const defaultEnquirySettings: EnquiryPageSettings = {
  enquiryTagline: "Regional Proposal Intake",
  enquiryTitle: "Request Technical Integration Quoting",
  enquiryDescription: "Complete the security assessment form below. Our estimation group will process your scope and respond with preliminary blueprints.",
  applicationPurposes: [
    { value: "house", label: "Residential (House)" },
    { value: "company", label: "Corporate Office (Company)" },
    { value: "hospital", label: "Healthcare Facility (Hospital)" },
    { value: "refinery", label: "Industrial Refinery / Plant" },
    { value: "commercial", label: "Commercial Hub / Hotel" },
    { value: "other", label: "Other / Custom Infrastructure" }
  ],
  submitButtonText: "Submit Solution Enquiry",
  successTitle: "Enquiry Dispatched",
  successMessage: "Thank you. Your proposal request and structural application scope details have been forwarded directly to our engineering coordinators at harik2021a@gmail.com."
};

function EnquiryFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedSolution, setSelectedSolution] = useState("");
  const [message, setMessage] = useState("");
  
  // Settings & solutions state
  const [settings, setSettings] = useState<EnquiryPageSettings>(defaultEnquirySettings);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load solutions & page settings from database
  useEffect(() => {
    async function loadData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        // Fetch enquiry settings
        const settingsRes = await fetch(`${baseUrl}/api/contact-settings/enquiry_page`, { cache: "no-store" });
        if (settingsRes.ok) {
          const json = await settingsRes.json();
          setSettings({
            enquiryTagline: json.enquiryTagline || defaultEnquirySettings.enquiryTagline,
            enquiryTitle: json.enquiryTitle || defaultEnquirySettings.enquiryTitle,
            enquiryDescription: json.enquiryDescription || defaultEnquirySettings.enquiryDescription,
            applicationPurposes: json.applicationPurposes && json.applicationPurposes.length > 0 ? json.applicationPurposes : defaultEnquirySettings.applicationPurposes,
            submitButtonText: json.submitButtonText || defaultEnquirySettings.submitButtonText,
            successTitle: json.successTitle || defaultEnquirySettings.successTitle,
            successMessage: json.successMessage || defaultEnquirySettings.successMessage,
          });
        }

        // Fetch solutions
        const solRes = await fetch(`${baseUrl}/api/solutions`);
        if (solRes.ok) {
          const data = await solRes.json();
          setSolutions(data);
          
          const querySol = searchParams.get("solution");
          if (querySol) {
            setSelectedSolution(querySol);
          }
        }
      } catch (err) {
        console.error("Failed to load enquiry data:", err);
      }
      setLoadingSolutions(false);
    }
    loadData();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          purpose,
          message,
          solutionTitle: selectedSolution,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Enquiry submission failed");
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-white border border-slate-200/80 p-12 max-md:p-8 max-sm:p-6 rounded-[32px] shadow-sm text-center space-y-6 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-2xl mx-auto animate-pulse">
          ✓
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight m-0">{settings.successTitle}</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-normal m-0">
            {settings.successMessage}
          </p>
        </div>
        <button
          onClick={() => router.push("/solutions")}
          className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md"
        >
          Return to Solutions
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 p-12 max-md:p-8 max-sm:p-6 rounded-[32px] shadow-sm space-y-8">
      
      <div className="space-y-3 max-w-xl">
        <span className="block text-xs font-bold text-[#c22026] uppercase tracking-[0.25em]">
          {settings.enquiryTagline}
        </span>
        <h2 className="text-[2rem] max-md:text-[1.7rem] max-sm:text-[1.4rem] font-extrabold uppercase text-slate-900 tracking-tight leading-none m-0">
          {settings.enquiryTitle}
        </h2>
        <p className="text-sm max-sm:text-xs text-slate-500 font-normal leading-relaxed m-0">
          {settings.enquiryDescription}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl text-xs flex items-start gap-3">
          🔒 <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold pl-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#c22026] transition-all focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold pl-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. contact@enterprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#c22026] transition-all focus:bg-white"
            />
          </div>
        </div>

        {/* Row 2: Phone and Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold pl-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +966 50 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#c22026] transition-all focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold pl-1">
              Application Purpose
            </label>
            <select
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-[#c22026] transition-all cursor-pointer focus:bg-white"
            >
              <option value="" disabled>Select application purpose...</option>
              {settings.applicationPurposes.map((purp) => (
                <option key={purp.value} value={purp.value}>
                  {purp.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Solution */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold pl-1">
            Target Solution Vertical
          </label>
          <select
            value={selectedSolution}
            onChange={(e) => setSelectedSolution(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-750 text-sm focus:outline-none focus:border-[#c22026] transition-all cursor-pointer focus:bg-white"
            disabled={loadingSolutions}
          >
            <option value="">General Solutions Portfolio / Not Sure</option>
            {solutions.map((sol) => (
              <option key={sol.id} value={sol.title}>
                {sol.title} ({sol.subLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold pl-1">
            Technical Message & Project Scope
          </label>
          <textarea
            required
            rows={5}
            placeholder="Briefly describe your site dimensions, safety compliance standard needs, or physical boundary constraints..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#c22026] transition-all focus:bg-white resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-[#c22026] hover:bg-[#1e3e8f] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Transmitting Proposal Scope...
            </>
          ) : (
            <>
              {settings.submitButtonText}
              <span>→</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <>
      <Navbar />
      <main className={`${poppins.className} min-h-screen bg-slate-50 text-slate-800 antialiased pt-32 pb-20 w-full`}>
        <div className="max-w-[800px] mx-auto px-4">
          <Suspense fallback={
            <div className="py-24 text-center space-y-3 bg-white border border-slate-200 rounded-[32px]">
              <div className="w-10 h-10 border-4 border-slate-300 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-450">Loading Intake System...</p>
            </div>
          }>
            <EnquiryFormContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
