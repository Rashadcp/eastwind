"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

interface DropdownOption {
  value: string;
  label: string;
}

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<"info" | "home" | "contact_page" | "enquiry_page">("info");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Tab 1: Office Addresses & Channels State (contact_info)
  const [hqTitle, setHqTitle] = useState<string>("Al Khobar Headquarters");
  const [hqAddress, setHqAddress] = useState<string>("King Faisal West Road, Bandariyah District,\nAl Khobar, Kingdom of Saudi Arabia");
  const [hubTitle, setHubTitle] = useState<string>("Riyadh Technology Hub");
  const [hubAddress, setHubAddress] = useState<string>("Olaya District, Riyadh,\nKingdom of Saudi Arabia");
  const [telephone, setTelephone] = useState<string>("+966 13 889 XXXX");
  const [email, setEmail] = useState<string>("info@eastwindsafety.com");
  const [workingHours, setWorkingHours] = useState<string>("Sunday – Thursday | 08:00 – 17:00 AST");
  const [gatewayText, setGatewayText] = useState<string>("SECURE REGIONAL GATEWAY");
  const [gatewayStatus, setGatewayStatus] = useState<string>("ONLINE");

  // Tab 2: Home Page Contact Section State (home_contact)
  const [homeTagline, setHomeTagline] = useState<string>("Get In Touch");
  const [homeTitle, setHomeTitle] = useState<string>("Contact Engineering");
  const [homeDescription, setHomeDescription] = useState<string>("Have a project requirement or need technical details? Coordinate with our estimating and engineering teams based in Al Khobar and Riyadh.");
  const [homeSectors, setHomeSectors] = useState<DropdownOption[]>([
    { value: "oil-gas", label: "Oil & Gas Infrastructure" },
    { value: "petrochemical", label: "Petrochemical Operations" },
    { value: "civil-defense", label: "Civil Defense Command" },
    { value: "marine", label: "Marine & Offshore Platforms" },
    { value: "utility-power", label: "Utility & Electrical Grids" }
  ]);
  const [homeSubmitBtn, setHomeSubmitBtn] = useState<string>("Send Request");
  const [homeSuccessTitle, setHomeSuccessTitle] = useState<string>("Message Sent");
  const [homeSuccessMessage, setHomeSuccessMessage] = useState<string>("Thank you. Your request has been received. Our team will contact you shortly.");

  // Tab 3: Contact Page State (contact_page)
  const [pageHeroBgImage, setPageHeroBgImage] = useState<string>("/contact_hero.png");
  const [pageHeroTagline, setPageHeroTagline] = useState<string>("Global Procurement Channels");
  const [pageHeroTitle, setPageHeroTitle] = useState<string>("Connect With Our Engineers");
  const [pageHeroDescription, setPageHeroDescription] = useState<string>("Initiate technical scoping, request custom hardware estimations, or schedule compliance architecture audits with our Dammam team.");
  const [pageCommsTagline, setPageCommsTagline] = useState<string>("Communications Log");
  const [pageCommsTitle, setPageCommsTitle] = useState<string>("Primary Operation Hubs");
  const [pageCommsDesc, setPageCommsDesc] = useState<string>("Direct routing channels across our regional estimating centers, specialized equipment workshop cells, and corporate headquarters.");
  const [pageFormTagline, setPageFormTagline] = useState<string>("Project Registration");
  const [pageFormTitle, setPageFormTitle] = useState<string>("Project Requirements");
  const [pageMarketSegments, setPageMarketSegments] = useState<DropdownOption[]>([
    { value: "oil-gas", label: "Onshore / Offshore Oil & Gas" },
    { value: "petrochemical", label: "Downstream Petrochemical Infrastructure" },
    { value: "civil-defense", label: "Civil Defense / Public Safety" },
    { value: "power-utilities", label: "Utility Systems & Smart Energy Grids" },
    { value: "marine-offshore", label: "Marine Engineering & Fleet Operations" }
  ]);
  const [pageSubmitBtn, setPageSubmitBtn] = useState<string>("Send Message");
  const [pageSuccessTitle, setPageSuccessTitle] = useState<string>("Message Sent");
  const [pageSuccessMessage, setPageSuccessMessage] = useState<string>("Your message has been sent to our team in Dammam. A specialist will follow up within 24 hours.");

  // Tab 4: Enquiry Page State (enquiry_page)
  const [enquiryTagline, setEnquiryTagline] = useState<string>("Request a Quote");
  const [enquiryTitle, setEnquiryTitle] = useState<string>("Request a Quote");
  const [enquiryDescription, setEnquiryDescription] = useState<string>("Fill out the form below. Our team will review your requirements and get back to you with an estimate.");
  const [enquiryPurposes, setEnquiryPurposes] = useState<DropdownOption[]>([
    { value: "house", label: "Residential (House)" },
    { value: "company", label: "Corporate Office (Company)" },
    { value: "hospital", label: "Healthcare Facility (Hospital)" },
    { value: "refinery", label: "Industrial Refinery / Plant" },
    { value: "commercial", label: "Commercial Hub / Hotel" },
    { value: "other", label: "Other / Custom Infrastructure" }
  ]);
  const [enquirySubmitBtn, setEnquirySubmitBtn] = useState<string>("Send Request");
  const [enquirySuccessTitle, setEnquirySuccessTitle] = useState<string>("Request Sent");
  const [enquirySuccessMessage, setEnquirySuccessMessage] = useState<string>("Thank you. Your request has been sent to our team at harik2021a@gmail.com.");

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Fetch initial data from backend API
  const fetchSettingsData = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/contact-settings`);
      if (!res.ok) throw new Error("Failed to fetch contact settings");
      const list = await res.json();

      const infoDoc = list.find((item: any) => item.id === "contact_info");
      if (infoDoc) {
        if (infoDoc.hqTitle) setHqTitle(infoDoc.hqTitle);
        if (infoDoc.hqAddress) setHqAddress(infoDoc.hqAddress);
        if (infoDoc.hubTitle) setHubTitle(infoDoc.hubTitle);
        if (infoDoc.hubAddress) setHubAddress(infoDoc.hubAddress);
        if (infoDoc.telephone) setTelephone(infoDoc.telephone);
        if (infoDoc.email) setEmail(infoDoc.email);
        if (infoDoc.workingHours) setWorkingHours(infoDoc.workingHours);
        if (infoDoc.gatewayText) setGatewayText(infoDoc.gatewayText);
        if (infoDoc.gatewayStatus) setGatewayStatus(infoDoc.gatewayStatus);
      }

      const homeDoc = list.find((item: any) => item.id === "home_contact");
      if (homeDoc) {
        if (homeDoc.tagline) setHomeTagline(homeDoc.tagline);
        if (homeDoc.title) setHomeTitle(homeDoc.title);
        if (homeDoc.description) setHomeDescription(homeDoc.description);
        if (homeDoc.operationalSectors && homeDoc.operationalSectors.length > 0) setHomeSectors(homeDoc.operationalSectors);
        if (homeDoc.submitButtonText) setHomeSubmitBtn(homeDoc.submitButtonText);
        if (homeDoc.successTitle) setHomeSuccessTitle(homeDoc.successTitle);
        if (homeDoc.successMessage) setHomeSuccessMessage(homeDoc.successMessage);
      }

      const pageDoc = list.find((item: any) => item.id === "contact_page");
      if (pageDoc) {
        if (pageDoc.heroBgImage) setPageHeroBgImage(pageDoc.heroBgImage);
        if (pageDoc.heroTagline) setPageHeroTagline(pageDoc.heroTagline);
        if (pageDoc.heroTitle) setPageHeroTitle(pageDoc.heroTitle);
        if (pageDoc.heroDescription) setPageHeroDescription(pageDoc.heroDescription);
        if (pageDoc.communicationsTagline) setPageCommsTagline(pageDoc.communicationsTagline);
        if (pageDoc.communicationsTitle) setPageCommsTitle(pageDoc.communicationsTitle);
        if (pageDoc.communicationsDesc) setPageCommsDesc(pageDoc.communicationsDesc);
        if (pageDoc.formSubHeaderTagline) setPageFormTagline(pageDoc.formSubHeaderTagline);
        if (pageDoc.formSubHeaderTitle) setPageFormTitle(pageDoc.formSubHeaderTitle);
        if (pageDoc.marketSegments && pageDoc.marketSegments.length > 0) setPageMarketSegments(pageDoc.marketSegments);
        if (pageDoc.submitButtonText) setPageSubmitBtn(pageDoc.submitButtonText);
        if (pageDoc.successTitle) setPageSuccessTitle(pageDoc.successTitle);
        if (pageDoc.successMessage) setPageSuccessMessage(pageDoc.successMessage);
      }

      const enquiryDoc = list.find((item: any) => item.id === "enquiry_page");
      if (enquiryDoc) {
        if (enquiryDoc.enquiryTagline) setEnquiryTagline(enquiryDoc.enquiryTagline);
        if (enquiryDoc.enquiryTitle) setEnquiryTitle(enquiryDoc.enquiryTitle);
        if (enquiryDoc.enquiryDescription) setEnquiryDescription(enquiryDoc.enquiryDescription);
        if (enquiryDoc.applicationPurposes && enquiryDoc.applicationPurposes.length > 0) setEnquiryPurposes(enquiryDoc.applicationPurposes);
        if (enquiryDoc.submitButtonText) setEnquirySubmitBtn(enquiryDoc.submitButtonText);
        if (enquiryDoc.successTitle) setEnquirySuccessTitle(enquiryDoc.successTitle);
        if (enquiryDoc.successMessage) setEnquirySuccessMessage(enquiryDoc.successMessage);
      }

    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to Contact settings backend. Showing local defaults.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearMessages();
    setUploadingField(fieldName);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      setter(data.imageUrl);
      setSuccess(`Image file '${file.name}' uploaded successfully.`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload image file.");
    } finally {
      setUploadingField(null);
    }
  };

  // Save section handler
  const saveSection = async (section: string, payload: any, sectionLabel: string) => {
    clearMessages();
    setSaving(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${baseUrl}/api/contact-settings/${section}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to update ${sectionLabel}`);

      setSuccess(`${sectionLabel} updated successfully!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to save ${sectionLabel}.`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading Contact Settings Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 m-0">Manage Contact & Enquiry Pages</h1>
          <p className="text-xs text-slate-500 mt-1 m-0">
            Centrally manage office location addresses, direct contact channels, and form dropdown selection options across Home, Contact, and Enquiry pages.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-xl self-start md:self-auto flex-wrap">
          <button
            onClick={() => { setActiveTab("info"); clearMessages(); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "info" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Office Locations & Channels
          </button>
          <button
            onClick={() => { setActiveTab("home"); clearMessages(); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "home" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home Contact Section
          </button>
          <button
            onClick={() => { setActiveTab("contact_page"); clearMessages(); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "contact_page" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Contact Page
          </button>
          <button
            onClick={() => { setActiveTab("enquiry_page"); clearMessages(); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "enquiry_page" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Enquiry Page
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 text-rose-500 hover:text-rose-800 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="p-1 text-emerald-500 hover:text-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* TAB 1: OFFICE ADDRESSES & CHANNELS */}
      {activeTab === "info" && (
        <div className="space-y-8">
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Office Locations & Direct Contact Channels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Al Khobar HQ Title</label>
                <input
                  type="text"
                  value={hqTitle}
                  onChange={(e) => setHqTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Al Khobar HQ Full Address</label>
                <textarea
                  rows={2}
                  value={hqAddress}
                  onChange={(e) => setHqAddress(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Riyadh Technology Hub Title</label>
                <input
                  type="text"
                  value={hubTitle}
                  onChange={(e) => setHubTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Riyadh Technology Hub Full Address</label>
                <textarea
                  rows={2}
                  value={hubAddress}
                  onChange={(e) => setHubAddress(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Direct Telephone Exchange</label>
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Direct Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Operational Working Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Gateway Text Tag</label>
                <input
                  type="text"
                  value={gatewayText}
                  onChange={(e) => setGatewayText(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Gateway Status Tag</label>
                <input
                  type="text"
                  value={gatewayStatus}
                  onChange={(e) => setGatewayStatus(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-8 p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Ready to save and publish updates to Office Addresses & Channels</span>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => saveSection("contact_info", {
                hqTitle, hqAddress, hubTitle, hubAddress, telephone, email, workingHours, gatewayText, gatewayStatus
              }, "Office Addresses & Channels")}
              className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Office Addresses Changes"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: HOME CONTACT SECTION */}
      {activeTab === "home" && (
        <div className="space-y-8">
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Home Page Contact Section Header & Form
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Tagline Badge</label>
                <input
                  type="text"
                  value={homeTagline}
                  onChange={(e) => setHomeTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={homeTitle}
                  onChange={(e) => setHomeTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Section Description</label>
              <textarea
                rows={2}
                value={homeDescription}
                onChange={(e) => setHomeDescription(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Submit Button Label</label>
                <input
                  type="text"
                  value={homeSubmitBtn}
                  onChange={(e) => setHomeSubmitBtn(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Form Success Title</label>
                <input
                  type="text"
                  value={homeSuccessTitle}
                  onChange={(e) => setHomeSuccessTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Form Success Body Message</label>
              <textarea
                rows={2}
                value={homeSuccessMessage}
                onChange={(e) => setHomeSuccessMessage(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>
          </div>

          {/* Operational Sectors Dropdown Options */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Operational Sector Dropdown Options</h2>
              <button
                type="button"
                onClick={() => setHomeSectors([...homeSectors, { value: `sector-${Date.now()}`, label: "New Operational Sector" }])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Sector Option
              </button>
            </div>

            <div className="space-y-4">
              {homeSectors.map((sec, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-200/60 rounded-xl bg-slate-50/50">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option Value Key</label>
                    <input
                      type="text"
                      value={sec.value}
                      onChange={(e) => {
                        const updated = [...homeSectors];
                        updated[idx].value = e.target.value;
                        setHomeSectors(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option Display Label</label>
                    <input
                      type="text"
                      value={sec.label}
                      onChange={(e) => {
                        const updated = [...homeSectors];
                        updated[idx].label = e.target.value;
                        setHomeSectors(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setHomeSectors(homeSectors.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 font-bold text-xs shrink-0 cursor-pointer self-end sm:self-center py-2"
                  >
                    Remove Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-8 p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Ready to save and publish updates to Home Contact Section</span>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => saveSection("home_contact", {
                tagline: homeTagline,
                title: homeTitle,
                description: homeDescription,
                operationalSectors: homeSectors,
                submitButtonText: homeSubmitBtn,
                successTitle: homeSuccessTitle,
                successMessage: homeSuccessMessage,
              }, "Home Contact Section")}
              className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Home Contact Changes"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: DEDICATED CONTACT PAGE */}
      {activeTab === "contact_page" && (
        <div className="space-y-8">
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Contact Page Hero Header & Form Titles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Hero Tagline Badge</label>
                <input
                  type="text"
                  value={pageHeroTagline}
                  onChange={(e) => setPageHeroTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={pageHeroTitle}
                  onChange={(e) => setPageHeroTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Hero Description Paragraph</label>
              <textarea
                rows={2}
                value={pageHeroDescription}
                onChange={(e) => setPageHeroDescription(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Hero Background Image Path or URL</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pageHeroBgImage}
                  onChange={(e) => setPageHeroBgImage(e.target.value)}
                  className="flex-1 px-4 py-3 text-xs border rounded-xl"
                />
                <input
                  type="file"
                  accept="image/*"
                  id="contact-hero-upload"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setPageHeroBgImage, "heroBgImage")}
                />
                <label
                  htmlFor="contact-hero-upload"
                  className="px-4 py-3 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-900 cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  {uploadingField === "heroBgImage" ? "Uploading..." : "Upload File"}
                </label>
              </div>

              {/* Contact Hero Background Image Preview */}
              {pageHeroBgImage && pageHeroBgImage.trim() !== "" && (
                <div className="mt-3 w-fit max-w-xl rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-2xs">
                  <img
                    src={formatImageUrl(pageHeroBgImage)}
                    alt="Contact Hero Preview"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = "none";
                    }}
                    className="h-44 sm:h-52 w-auto max-w-full rounded-lg object-contain block"
                  />
                </div>
              )}
            </div>

            {/* Left Side: Operations Hubs Section Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Operations Hubs Section Title</label>
                <input
                  type="text"
                  value={pageCommsTitle}
                  onChange={(e) => setPageCommsTitle(e.target.value)}
                  placeholder="e.g. Primary Operation Hubs"
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Operations Hubs Description</label>
                <textarea
                  rows={2}
                  value={pageCommsDesc}
                  onChange={(e) => setPageCommsDesc(e.target.value)}
                  placeholder="e.g. Direct routing channels across our regional estimating centers..."
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Form Subheader Tagline</label>
                <input
                  type="text"
                  value={pageFormTagline}
                  onChange={(e) => setPageFormTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Form Subheader Title</label>
                <input
                  type="text"
                  value={pageFormTitle}
                  onChange={(e) => setPageFormTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Submit Button Label</label>
                <input
                  type="text"
                  value={pageSubmitBtn}
                  onChange={(e) => setPageSubmitBtn(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Form Success Title</label>
                <input
                  type="text"
                  value={pageSuccessTitle}
                  onChange={(e) => setPageSuccessTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Form Success Body Message</label>
              <textarea
                rows={2}
                value={pageSuccessMessage}
                onChange={(e) => setPageSuccessMessage(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>
          </div>

          {/* Market Segments Dropdown Options */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Strategic Market Segment Dropdown Options</h2>
              <button
                type="button"
                onClick={() => setPageMarketSegments([...pageMarketSegments, { value: `segment-${Date.now()}`, label: "New Market Segment" }])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Segment Option
              </button>
            </div>

            <div className="space-y-4">
              {pageMarketSegments.map((seg, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-200/60 rounded-xl bg-slate-50/50">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option Value Key</label>
                    <input
                      type="text"
                      value={seg.value}
                      onChange={(e) => {
                        const updated = [...pageMarketSegments];
                        updated[idx].value = e.target.value;
                        setPageMarketSegments(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option Display Label</label>
                    <input
                      type="text"
                      value={seg.label}
                      onChange={(e) => {
                        const updated = [...pageMarketSegments];
                        updated[idx].label = e.target.value;
                        setPageMarketSegments(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPageMarketSegments(pageMarketSegments.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 font-bold text-xs shrink-0 cursor-pointer self-end sm:self-center py-2"
                  >
                    Remove Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-8 p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Ready to save and publish updates to Contact Page Settings</span>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => saveSection("contact_page", {
                heroBgImage: pageHeroBgImage,
                heroTagline: pageHeroTagline,
                heroTitle: pageHeroTitle,
                heroDescription: pageHeroDescription,
                communicationsTagline: pageCommsTagline,
                communicationsTitle: pageCommsTitle,
                communicationsDesc: pageCommsDesc,
                formSubHeaderTagline: pageFormTagline,
                formSubHeaderTitle: pageFormTitle,
                marketSegments: pageMarketSegments,
                submitButtonText: pageSubmitBtn,
                successTitle: pageSuccessTitle,
                successMessage: pageSuccessMessage,
              }, "Contact Page Settings")}
              className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Contact Page Changes"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: ENQUIRY PAGE */}
      {activeTab === "enquiry_page" && (
        <div className="space-y-8">
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 m-0 border-b border-slate-100 pb-3">
              Enquiry Page Header & Response Messages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Page Tagline Badge</label>
                <input
                  type="text"
                  value={enquiryTagline}
                  onChange={(e) => setEnquiryTagline(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Page Title</label>
                <input
                  type="text"
                  value={enquiryTitle}
                  onChange={(e) => setEnquiryTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Page Description Paragraph</label>
              <textarea
                rows={2}
                value={enquiryDescription}
                onChange={(e) => setEnquiryDescription(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Submit Button Label</label>
                <input
                  type="text"
                  value={enquirySubmitBtn}
                  onChange={(e) => setEnquirySubmitBtn(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Success Screen Title</label>
                <input
                  type="text"
                  value={enquirySuccessTitle}
                  onChange={(e) => setEnquirySuccessTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Success Screen Body Message</label>
              <textarea
                rows={2}
                value={enquirySuccessMessage}
                onChange={(e) => setEnquirySuccessMessage(e.target.value)}
                className="w-full px-4 py-3 text-xs border rounded-xl"
              />
            </div>
          </div>

          {/* Application Purposes Dropdown Options */}
          <div className="bg-white p-8 border border-slate-200/60 rounded-2xl space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800 m-0">Application Purpose Dropdown Options</h2>
              <button
                type="button"
                onClick={() => setEnquiryPurposes([...enquiryPurposes, { value: `purpose-${Date.now()}`, label: "New Application Purpose" }])}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                + Add Purpose Option
              </button>
            </div>

            <div className="space-y-4">
              {enquiryPurposes.map((purp, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-slate-200/60 rounded-xl bg-slate-50/50">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option Value Key</label>
                    <input
                      type="text"
                      value={purp.value}
                      onChange={(e) => {
                        const updated = [...enquiryPurposes];
                        updated[idx].value = e.target.value;
                        setEnquiryPurposes(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option Display Label</label>
                    <input
                      type="text"
                      value={purp.label}
                      onChange={(e) => {
                        const updated = [...enquiryPurposes];
                        updated[idx].label = e.target.value;
                        setEnquiryPurposes(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnquiryPurposes(enquiryPurposes.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700 font-bold text-xs shrink-0 cursor-pointer self-end sm:self-center py-2"
                  >
                    Remove Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-8 p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Ready to save and publish updates to Enquiry Page Settings</span>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => saveSection("enquiry_page", {
                enquiryTagline,
                enquiryTitle,
                enquiryDescription,
                applicationPurposes: enquiryPurposes,
                submitButtonText: enquirySubmitBtn,
                successTitle: enquirySuccessTitle,
                successMessage: enquirySuccessMessage,
              }, "Enquiry Page Settings")}
              className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Enquiry Page Changes"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
