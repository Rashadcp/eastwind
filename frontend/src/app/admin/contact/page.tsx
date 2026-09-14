"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

interface DropdownOption {
  value: string;
  label: string;
}

export interface ContactLocation {
  title: string;
  address: string;
}

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<"info" | "home" | "contact_page" | "enquiry_page">("info");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Tab 1: Office Addresses & Channels State (contact_info)
  const [locations, setLocations] = useState<ContactLocation[]>([
    {
      title: "Al Khobar Headquarters",
      address: "King Faisal West Road, Bandariyah District,\nAl Khobar, Kingdom of Saudi Arabia",
    },
    {
      title: "Riyadh Technology Hub",
      address: "Olaya District, Riyadh,\nKingdom of Saudi Arabia",
    },
  ]);
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
  const [homeTitle, setHomeTitle] = useState<string>("Contact Our Team");
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
      const footerDoc = list.find((item: any) => item.id === "footer");
      if (infoDoc) {
        if (Array.isArray(infoDoc.locations) && infoDoc.locations.length > 0) {
          setLocations(infoDoc.locations);
        } else if (footerDoc && Array.isArray(footerDoc.locations) && footerDoc.locations.length > 0) {
          setLocations(footerDoc.locations);
        } else {
          const initialLocs: ContactLocation[] = [];
          if (infoDoc.hqTitle || infoDoc.hqAddress) {
            initialLocs.push({ title: infoDoc.hqTitle || "Al Khobar Headquarters", address: infoDoc.hqAddress || "" });
          }
          if (infoDoc.hubTitle || infoDoc.hubAddress) {
            initialLocs.push({ title: infoDoc.hubTitle || "Riyadh Technology Hub", address: infoDoc.hubAddress || "" });
          }
          if (initialLocs.length > 0) {
            setLocations(initialLocs);
          }
        }

        if (infoDoc.hqTitle !== undefined) setHqTitle(infoDoc.hqTitle);
        if (infoDoc.hqAddress !== undefined) setHqAddress(infoDoc.hqAddress);
        if (infoDoc.hubTitle !== undefined) setHubTitle(infoDoc.hubTitle);
        if (infoDoc.hubAddress !== undefined) setHubAddress(infoDoc.hubAddress);
        if (infoDoc.telephone !== undefined) setTelephone(infoDoc.telephone);
        if (infoDoc.email !== undefined) setEmail(infoDoc.email);
        if (infoDoc.workingHours !== undefined) setWorkingHours(infoDoc.workingHours);
        if (infoDoc.gatewayText !== undefined) setGatewayText(infoDoc.gatewayText);
        if (infoDoc.gatewayStatus !== undefined) setGatewayStatus(infoDoc.gatewayStatus);
      }

      const homeDoc = list.find((item: any) => item.id === "home_contact");
      if (homeDoc) {
        if (homeDoc.tagline !== undefined) setHomeTagline(homeDoc.tagline);
        if (homeDoc.title !== undefined) setHomeTitle(homeDoc.title);
        if (homeDoc.description !== undefined) setHomeDescription(homeDoc.description);
        if (Array.isArray(homeDoc.operationalSectors)) setHomeSectors(homeDoc.operationalSectors);
        if (homeDoc.submitButtonText !== undefined) setHomeSubmitBtn(homeDoc.submitButtonText);
        if (homeDoc.successTitle !== undefined) setHomeSuccessTitle(homeDoc.successTitle);
        if (homeDoc.successMessage !== undefined) setHomeSuccessMessage(homeDoc.successMessage);
      }

      const pageDoc = list.find((item: any) => item.id === "contact_page");
      if (pageDoc) {
        if (pageDoc.heroBgImage !== undefined) setPageHeroBgImage(pageDoc.heroBgImage);
        if (pageDoc.heroTagline !== undefined) setPageHeroTagline(pageDoc.heroTagline);
        if (pageDoc.heroTitle !== undefined) setPageHeroTitle(pageDoc.heroTitle);
        if (pageDoc.heroDescription !== undefined) setPageHeroDescription(pageDoc.heroDescription);
        if (pageDoc.communicationsTagline !== undefined) setPageCommsTagline(pageDoc.communicationsTagline);
        if (pageDoc.communicationsTitle !== undefined) setPageCommsTitle(pageDoc.communicationsTitle);
        if (pageDoc.communicationsDesc !== undefined) setPageCommsDesc(pageDoc.communicationsDesc);
        if (pageDoc.formSubHeaderTagline !== undefined) setPageFormTagline(pageDoc.formSubHeaderTagline);
        if (pageDoc.formSubHeaderTitle !== undefined) setPageFormTitle(pageDoc.formSubHeaderTitle);
        if (Array.isArray(pageDoc.marketSegments)) setPageMarketSegments(pageDoc.marketSegments);
        if (pageDoc.submitButtonText !== undefined) setPageSubmitBtn(pageDoc.submitButtonText);
        if (pageDoc.successTitle !== undefined) setPageSuccessTitle(pageDoc.successTitle);
        if (pageDoc.successMessage !== undefined) setPageSuccessMessage(pageDoc.successMessage);
      }

      const enquiryDoc = list.find((item: any) => item.id === "enquiry_page");
      if (enquiryDoc) {
        if (enquiryDoc.enquiryTagline !== undefined) setEnquiryTagline(enquiryDoc.enquiryTagline);
        if (enquiryDoc.enquiryTitle !== undefined) setEnquiryTitle(enquiryDoc.enquiryTitle);
        if (enquiryDoc.enquiryDescription !== undefined) setEnquiryDescription(enquiryDoc.enquiryDescription);
        if (Array.isArray(enquiryDoc.applicationPurposes)) setEnquiryPurposes(enquiryDoc.applicationPurposes);
        if (enquiryDoc.submitButtonText !== undefined) setEnquirySubmitBtn(enquiryDoc.submitButtonText);
        if (enquiryDoc.successTitle !== undefined) setEnquirySuccessTitle(enquiryDoc.successTitle);
        if (enquiryDoc.successMessage !== undefined) setEnquirySuccessMessage(enquiryDoc.successMessage);
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

  // Dynamic Location Handlers
  const handleAddLocation = () => {
    setLocations((prev) => [
      ...prev,
      {
        title: "New Office / Hub Location",
        address: "Address & Industrial Zone, Kingdom of Saudi Arabia",
      },
    ]);
  };

  const handleUpdateLocation = (index: number, field: "title" | "address", value: string) => {
    setLocations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteLocation = (index: number) => {
    if (locations.length <= 1) {
      if (!confirm("Are you sure you want to delete this location? It is recommended to have at least one office location listed.")) {
        return;
      }
    }
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveLocation = (index: number, direction: "up" | "down") => {
    setLocations((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
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

      // If saving contact_info, also sync active locations to footer so footer stays completely in sync
      if (section === "contact_info") {
        const syncedLocations = Array.isArray(payload.locations) ? payload.locations : [];
        await fetch(`${baseUrl}/api/contact-settings/footer`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            locations: syncedLocations,
            hqTitle: syncedLocations[0]?.title || "",
            hqAddress: syncedLocations[0]?.address || "",
            hubTitle: syncedLocations[1]?.title || "",
            hubAddress: syncedLocations[1]?.address || "",
            telephone: payload.telephone,
            email: payload.email
          })
        }).catch(() => null);
      }

      setSuccess(`${sectionLabel} updated successfully!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Failed to save ${sectionLabel}.`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCurrentTab = () => {
    if (activeTab === "info") {
      saveSection("contact_info", {
        locations,
        hqTitle: locations[0]?.title || hqTitle,
        hqAddress: locations[0]?.address || hqAddress,
        hubTitle: locations[1]?.title || hubTitle,
        hubAddress: locations[1]?.address || hubAddress,
        telephone,
        email,
        workingHours,
        gatewayText,
        gatewayStatus
      }, "Office Addresses & Channels");
    } else if (activeTab === "home") {
      saveSection("home_contact", {
        tagline: homeTagline,
        title: homeTitle,
        description: homeDescription,
        operationalSectors: homeSectors,
        submitButtonText: homeSubmitBtn,
        successTitle: homeSuccessTitle,
        successMessage: homeSuccessMessage,
      }, "Home Contact Section");
    } else if (activeTab === "contact_page") {
      saveSection("contact_page", {
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
      }, "Contact Page Settings");
    } else if (activeTab === "enquiry_page") {
      saveSection("enquiry_page", {
        enquiryTagline,
        enquiryTitle,
        enquiryDescription,
        applicationPurposes: enquiryPurposes,
        submitButtonText: enquirySubmitBtn,
        successTitle: enquirySuccessTitle,
        successMessage: enquirySuccessMessage,
      }, "Enquiry Page Settings");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#1e3e8f] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading Contact Information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Contact & Enquiry Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Centrally manage office location addresses, direct contact channels, and form dropdown selection options across Home, Contact, and Enquiry pages.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-200 rounded-sm self-start md:self-auto flex-wrap">
            <button
              onClick={() => { setActiveTab("info"); clearMessages(); }}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "info" ? "bg-white text-[#1e3e8f] shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Office Locations
            </button>
            <button
              onClick={() => { setActiveTab("home"); clearMessages(); }}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "home" ? "bg-white text-[#1e3e8f] shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Home Contact
            </button>
            <button
              onClick={() => { setActiveTab("contact_page"); clearMessages(); }}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "contact_page" ? "bg-white text-[#1e3e8f] shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Contact Page
            </button>
            <button
              onClick={() => { setActiveTab("enquiry_page"); clearMessages(); }}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "enquiry_page" ? "bg-white text-[#1e3e8f] shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Enquiry Page
            </button>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveCurrentTab}
            className="px-4 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 text-rose-500 hover:text-rose-800 rounded-sm hover:bg-rose-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="p-1 text-emerald-500 hover:text-emerald-800 rounded-sm hover:bg-emerald-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* TAB 1: OFFICE ADDRESSES & CHANNELS */}
      {activeTab === "info" && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span>Office & Hub Locations</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-[#1e3e8f] text-[11px] font-bold rounded-full border border-blue-200/60">
                    {locations.length} {locations.length === 1 ? "Location" : "Locations"}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Configure corporate headquarters, regional operations hubs, branch offices, and service centers.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddLocation}
                className="px-3.5 py-1.5 bg-[#1e3e8f] hover:bg-[#162f6d] text-white rounded-sm text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Location</span>
              </button>
            </div>

            {locations.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-sm text-center space-y-3 bg-slate-50/50">
                <p className="text-xs text-slate-500 font-medium">No office locations configured yet.</p>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-4 py-2 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add First Location</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {locations.map((loc, idx) => {
                  const isPrimary = idx === 0;
                  const isSecondary = idx === 1;
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50/80 border border-slate-200 rounded-sm space-y-3 relative group transition-all hover:border-slate-300 shadow-2xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isPrimary ? "bg-[#1e3e8f]" : isSecondary ? "bg-[#c22026]" : "bg-emerald-600"}`} />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                            Location #{idx + 1}
                            {isPrimary ? " — Primary Headquarters" : isSecondary ? " — Regional Hub" : " — Branch Office"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Reorder Buttons */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveLocation(idx, "up")}
                            title="Move Up in List"
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-25 disabled:cursor-not-allowed rounded hover:bg-slate-200/50 transition-colors cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            disabled={idx === locations.length - 1}
                            onClick={() => handleMoveLocation(idx, "down")}
                            title="Move Down in List"
                            className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-25 disabled:cursor-not-allowed rounded hover:bg-slate-200/50 transition-colors cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          <div className="h-4 w-px bg-slate-200 mx-1" />

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteLocation(idx)}
                            className="px-2 py-0.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded font-semibold cursor-pointer transition-colors"
                            title="Delete this location"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Office / Hub Title <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={loc.title}
                            onChange={(e) => handleUpdateLocation(idx, "title", e.target.value)}
                            placeholder="e.g. Al Khobar Headquarters, Riyadh Technology Hub, Jeddah Operations..."
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Physical Address & City <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            rows={2}
                            value={loc.address}
                            onChange={(e) => handleUpdateLocation(idx, "address", e.target.value)}
                            placeholder="Street, District, City, Kingdom of Saudi Arabia..."
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 font-normal resize-y"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Direct Telephone Exchange</label>
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Direct Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Operational Working Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gateway Text Tag</label>
                <input
                  type="text"
                  value={gatewayText}
                  onChange={(e) => setGatewayText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gateway Status Tag</label>
                <input
                  type="text"
                  value={gatewayStatus}
                  onChange={(e) => setGatewayStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-6 p-4 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Ready to save and publish updates to Office Addresses & Channels</span>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => saveSection("contact_info", {
                locations,
                hqTitle: locations[0]?.title || hqTitle,
                hqAddress: locations[0]?.address || hqAddress,
                hubTitle: locations[1]?.title || hubTitle,
                hubAddress: locations[1]?.address || hubAddress,
                telephone,
                email,
                workingHours,
                gatewayText,
                gatewayStatus
              }, "Office Addresses & Channels")}
              className="w-full sm:w-auto px-6 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Office Addresses Changes"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: HOME CONTACT SECTION */}
      {activeTab === "home" && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              Home Page Contact Section Header & Form
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tagline Badge</label>
                <input
                  type="text"
                  value={homeTagline}
                  onChange={(e) => setHomeTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Section Title</label>
                <input
                  type="text"
                  value={homeTitle}
                  onChange={(e) => setHomeTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Section Description</label>
              <textarea
                rows={2}
                value={homeDescription}
                onChange={(e) => setHomeDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Submit Button Label</label>
                <input
                  type="text"
                  value={homeSubmitBtn}
                  onChange={(e) => setHomeSubmitBtn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Form Success Title</label>
                <input
                  type="text"
                  value={homeSuccessTitle}
                  onChange={(e) => setHomeSuccessTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Form Success Body Message</label>
              <textarea
                rows={2}
                value={homeSuccessMessage}
                onChange={(e) => setHomeSuccessMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Operational Sectors Dropdown Options */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Operational Sector Dropdown Options</h2>
              <button
                type="button"
                onClick={() => setHomeSectors([...homeSectors, { value: `sector-${Date.now()}`, label: "New Operational Sector" }])}
                className="px-3 py-1.5 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] cursor-pointer transition-colors"
              >
                + Add Sector Option
              </button>
            </div>

            <div className="space-y-3">
              {homeSectors.map((sec, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3.5 border border-slate-200 rounded-sm bg-slate-50/50">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Option Value Key</label>
                    <input
                      type="text"
                      value={sec.value}
                      onChange={(e) => {
                        const updated = [...homeSectors];
                        updated[idx].value = e.target.value;
                        setHomeSectors(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Option Display Label</label>
                    <input
                      type="text"
                      value={sec.label}
                      onChange={(e) => {
                        const updated = [...homeSectors];
                        updated[idx].label = e.target.value;
                        setHomeSectors(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setHomeSectors(homeSectors.filter((_, i) => i !== idx))}
                    className="text-rose-600 hover:text-rose-800 font-medium text-xs shrink-0 cursor-pointer self-end sm:self-center px-1"
                  >
                    Remove Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-6 p-4 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
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
              className="w-full sm:w-auto px-6 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Home Contact Changes"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: DEDICATED CONTACT PAGE */}
      {activeTab === "contact_page" && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              Contact Page Hero Header & Form Titles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Tagline Badge</label>
                <input
                  type="text"
                  value={pageHeroTagline}
                  onChange={(e) => setPageHeroTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Title</label>
                <input
                  type="text"
                  value={pageHeroTitle}
                  onChange={(e) => setPageHeroTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Description Paragraph</label>
              <textarea
                rows={2}
                value={pageHeroDescription}
                onChange={(e) => setPageHeroDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hero Background Image Path or URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pageHeroBgImage}
                  onChange={(e) => setPageHeroBgImage(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
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
                  className="px-3.5 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white rounded-sm text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors"
                >
                  {uploadingField === "heroBgImage" ? "Uploading..." : "Upload File"}
                </label>
              </div>

              {/* Contact Hero Background Image Preview */}
              {pageHeroBgImage && pageHeroBgImage.trim() !== "" && (
                <div className="mt-3 w-fit max-w-xl rounded-sm border border-slate-200 bg-slate-50 p-1.5">
                  <img
                    src={formatImageUrl(pageHeroBgImage)}
                    alt="Contact Hero Preview"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = "none";
                    }}
                    className="h-36 sm:h-44 w-auto max-w-full rounded-sm object-contain block"
                  />
                </div>
              )}
            </div>

            {/* Left Side: Operations Hubs Section Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Operations Hubs Section Title</label>
                <input
                  type="text"
                  value={pageCommsTitle}
                  onChange={(e) => setPageCommsTitle(e.target.value)}
                  placeholder="e.g. Primary Operation Hubs"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Operations Hubs Description</label>
                <textarea
                  rows={2}
                  value={pageCommsDesc}
                  onChange={(e) => setPageCommsDesc(e.target.value)}
                  placeholder="e.g. Direct routing channels across our regional estimating centers..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Form Subheader Tagline</label>
                <input
                  type="text"
                  value={pageFormTagline}
                  onChange={(e) => setPageFormTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Form Subheader Title</label>
                <input
                  type="text"
                  value={pageFormTitle}
                  onChange={(e) => setPageFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Submit Button Label</label>
                <input
                  type="text"
                  value={pageSubmitBtn}
                  onChange={(e) => setPageSubmitBtn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Form Success Title</label>
                <input
                  type="text"
                  value={pageSuccessTitle}
                  onChange={(e) => setPageSuccessTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Form Success Body Message</label>
              <textarea
                rows={2}
                value={pageSuccessMessage}
                onChange={(e) => setPageSuccessMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Market Segments Dropdown Options */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Strategic Market Segment Dropdown Options</h2>
              <button
                type="button"
                onClick={() => setPageMarketSegments([...pageMarketSegments, { value: `segment-${Date.now()}`, label: "New Market Segment" }])}
                className="px-3 py-1.5 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] cursor-pointer transition-colors"
              >
                + Add Segment Option
              </button>
            </div>

            <div className="space-y-3">
              {pageMarketSegments.map((seg, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3.5 border border-slate-200 rounded-sm bg-slate-50/50">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Option Value Key</label>
                    <input
                      type="text"
                      value={seg.value}
                      onChange={(e) => {
                        const updated = [...pageMarketSegments];
                        updated[idx].value = e.target.value;
                        setPageMarketSegments(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Option Display Label</label>
                    <input
                      type="text"
                      value={seg.label}
                      onChange={(e) => {
                        const updated = [...pageMarketSegments];
                        updated[idx].label = e.target.value;
                        setPageMarketSegments(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPageMarketSegments(pageMarketSegments.filter((_, i) => i !== idx))}
                    className="text-rose-600 hover:text-rose-800 font-medium text-xs shrink-0 cursor-pointer self-end sm:self-center px-1"
                  >
                    Remove Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-6 p-4 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
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
              className="w-full sm:w-auto px-6 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Contact Page Changes"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: ENQUIRY PAGE */}
      {activeTab === "enquiry_page" && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
              Enquiry Page Header & Response Messages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Page Tagline Badge</label>
                <input
                  type="text"
                  value={enquiryTagline}
                  onChange={(e) => setEnquiryTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Page Title</label>
                <input
                  type="text"
                  value={enquiryTitle}
                  onChange={(e) => setEnquiryTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Page Description Paragraph</label>
              <textarea
                rows={2}
                value={enquiryDescription}
                onChange={(e) => setEnquiryDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Submit Button Label</label>
                <input
                  type="text"
                  value={enquirySubmitBtn}
                  onChange={(e) => setEnquirySubmitBtn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Success Screen Title</label>
                <input
                  type="text"
                  value={enquirySuccessTitle}
                  onChange={(e) => setEnquirySuccessTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Success Screen Body Message</label>
              <textarea
                rows={2}
                value={enquirySuccessMessage}
                onChange={(e) => setEnquirySuccessMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Application Purposes Dropdown Options */}
          <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Application Purpose Dropdown Options</h2>
              <button
                type="button"
                onClick={() => setEnquiryPurposes([...enquiryPurposes, { value: `purpose-${Date.now()}`, label: "New Application Purpose" }])}
                className="px-3 py-1.5 bg-[#1e3e8f] text-white text-xs font-semibold rounded-sm hover:bg-[#162f6d] cursor-pointer transition-colors"
              >
                + Add Purpose Option
              </button>
            </div>

            <div className="space-y-3">
              {enquiryPurposes.map((purp, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3.5 border border-slate-200 rounded-sm bg-slate-50/50">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Option Value Key</label>
                    <input
                      type="text"
                      value={purp.value}
                      onChange={(e) => {
                        const updated = [...enquiryPurposes];
                        updated[idx].value = e.target.value;
                        setEnquiryPurposes(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Option Display Label</label>
                    <input
                      type="text"
                      value={purp.label}
                      onChange={(e) => {
                        const updated = [...enquiryPurposes];
                        updated[idx].label = e.target.value;
                        setEnquiryPurposes(updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnquiryPurposes(enquiryPurposes.filter((_, i) => i !== idx))}
                    className="text-rose-600 hover:text-rose-800 font-medium text-xs shrink-0 cursor-pointer self-end sm:self-center px-1"
                  >
                    Remove Option
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Footer Action Bar */}
          <div className="mt-6 p-4 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
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
              className="w-full sm:w-auto px-6 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Enquiry Page Changes"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
