"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLocation {
  title: string;
  address: string;
}

export default function AdminFooterPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Footer fields state
  const [logoUrl, setLogoUrl] = useState<string>("/logo.png");
  const [tagline, setTagline] = useState<string>("");
  const [badgeText, setBadgeText] = useState<string>("Certified Marine & Industrial Safety Partner");
  const [solutionsTitle, setSolutionsTitle] = useState<string>("Safety Solutions");
  const [operationsTitle, setOperationsTitle] = useState<string>("Operations");

  // Dynamic Locations list
  const [locations, setLocations] = useState<FooterLocation[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const [telephone, setTelephone] = useState<string>("+966 570 833 214");
  const [email, setEmail] = useState<string>("enquiry@eastwind.sa");
  const [copyright, setCopyright] = useState<string>(`© ${new Date().getFullYear()} East Wind Safety. All rights reserved. Premium Safety Products & Solutions Integrator.`);

  // Custom links
  const [solutionsLinks, setSolutionsLinks] = useState<FooterLink[]>([]);

  const [bottomLinks, setBottomLinks] = useState<FooterLink[]>([
    { name: "Privacy Policy", href: "/privacy-policy" }
  ]);

  // Input states for adding new links
  const [newSolName, setNewSolName] = useState<string>("");
  const [newSolHref, setNewSolHref] = useState<string>("");
  const [newBtmName, setNewBtmName] = useState<string>("");
  const [newBtmHref, setNewBtmHref] = useState<string>("");

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const fetchFooterSettings = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/contact-settings`);
      if (res.ok) {
        const list = await res.json();
        const footerDoc = list.find((item: any) => item.id === "footer");
        const contactDoc = list.find((item: any) => item.id === "contact_info");

        if (footerDoc) {
          if (footerDoc.logoUrl !== undefined) setLogoUrl(footerDoc.logoUrl || "");
          if (typeof footerDoc.tagline === "string") setTagline(footerDoc.tagline);
          if (typeof footerDoc.badgeText === "string") setBadgeText(footerDoc.badgeText);
          if (typeof footerDoc.solutionsTitle === "string") setSolutionsTitle(footerDoc.solutionsTitle);
          if (typeof footerDoc.operationsTitle === "string") setOperationsTitle(footerDoc.operationsTitle);
          if (typeof footerDoc.copyright === "string") setCopyright(footerDoc.copyright);
          if (Array.isArray(footerDoc.solutionsLinks)) setSolutionsLinks(footerDoc.solutionsLinks);
          if (Array.isArray(footerDoc.bottomLinks)) setBottomLinks(footerDoc.bottomLinks);
          if (typeof footerDoc.telephone === "string") setTelephone(footerDoc.telephone);
          if (typeof footerDoc.email === "string") setEmail(footerDoc.email);
        }

        if (contactDoc) {
          if (!footerDoc?.telephone && contactDoc.telephone) setTelephone(contactDoc.telephone);
          if (!footerDoc?.email && contactDoc.email) setEmail(contactDoc.email);
        }

        // Initialize locations from footer, contactDoc or legacy fields
        if (footerDoc && Array.isArray(footerDoc.locations)) {
          setLocations(footerDoc.locations);
        } else if (contactDoc && Array.isArray(contactDoc.locations)) {
          setLocations(contactDoc.locations);
        } else {
          const initialLocs: FooterLocation[] = [];
          const hqT = footerDoc?.hqTitle || contactDoc?.hqTitle;
          const hqA = footerDoc?.hqAddress || contactDoc?.hqAddress;
          const hubT = footerDoc?.hubTitle || contactDoc?.hubTitle;
          const hubA = footerDoc?.hubAddress || contactDoc?.hubAddress;

          if (hqT || hqA) initialLocs.push({ title: hqT || "", address: hqA || "" });
          if (hubT || hubA) initialLocs.push({ title: hubT || "", address: hubA || "" });
          setLocations(initialLocs);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch footer settings from backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  // Warn user if navigating or refreshing with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Upload handler for Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearMessages();
    setUploading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("image", file);

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.imageUrl || data.url || (data.filename ? `/uploads/${data.filename}` : "");
        if (uploadedUrl) {
          setLogoUrl(uploadedUrl);
          setSuccess(`Footer logo '${file.name}' uploaded successfully.`);
          setUploading(false);
          return;
        }
      }

      // Canvas fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            setLogoUrl(canvas.toDataURL("image/png"));
            setSuccess(`Footer logo '${file.name}' previewed successfully.`);
          }
          setUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setError("Failed to upload footer logo.");
      setUploading(false);
    }
  };

  // Add Solutions Link
  const handleAddSolLink = () => {
    if (!newSolName.trim() || !newSolHref.trim()) return;
    setSolutionsLinks([...solutionsLinks, { name: newSolName.trim(), href: newSolHref.trim() }]);
    setNewSolName("");
    setNewSolHref("");
  };

  const handleRemoveSolLink = (idx: number) => {
    setSolutionsLinks(solutionsLinks.filter((_, i) => i !== idx));
  };

  // Add Bottom Link
  const handleAddBtmLink = () => {
    if (!newBtmName.trim() || !newBtmHref.trim()) return;
    setBottomLinks([...bottomLinks, { name: newBtmName.trim(), href: newBtmHref.trim() }]);
    setNewBtmName("");
    setNewBtmHref("");
  };

  const handleRemoveBtmLink = (idx: number) => {
    setBottomLinks(bottomLinks.filter((_, i) => i !== idx));
  };

  // Dynamic Locations Handlers
  const handleAddLocation = () => {
    setLocations([
      ...locations,
      {
        title: "New Office / Hub Location",
        address: "Address & Industrial Zone, Kingdom of Saudi Arabia"
      }
    ]);
    setHasUnsavedChanges(true);
  };

  const handleUpdateLocation = (index: number, field: "title" | "address", value: string) => {
    const updated = [...locations];
    updated[index] = { ...updated[index], [field]: value };
    setLocations(updated);
    setHasUnsavedChanges(true);
  };

  const handleDeleteLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  // Save Footer Settings to Backend
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setSaving(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const payload = {
        logoUrl,
        tagline,
        badgeText,
        solutionsTitle,
        operationsTitle,
        locations,
        hqTitle: locations[0]?.title || "",
        hqAddress: locations[0]?.address || "",
        hubTitle: locations[1]?.title || "",
        hubAddress: locations[1]?.address || "",
        telephone,
        email,
        copyright,
        solutionsLinks,
        bottomLinks
      };

      const res = await fetch(`${baseUrl}/api/contact-settings/footer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update footer configuration");
      }

      // Keep contact_info synced as well
      await fetch(`${baseUrl}/api/contact-settings/contact_info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          locations,
          hqTitle: locations[0]?.title || "",
          hqAddress: locations[0]?.address || "",
          hubTitle: locations[1]?.title || "",
          hubAddress: locations[1]?.address || "",
          telephone,
          email
        })
      }).catch(() => null);

      setHasUnsavedChanges(false);
      setSuccess("Footer configuration saved permanently to active website!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save footer settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#1e3e8f] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading Footer Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Footer Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure dynamic footer content, links, locations, and brand assets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#1e3e8f] hover:underline self-start sm:self-auto"
          >
            Preview Live Site ↗
          </a>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-4 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
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

      <form onSubmit={handleSave} className="space-y-6">

        {/* SECTION 1: BRAND & LOGO */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Brand Assets & Mission Statement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Footer Brand Logo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                  placeholder="/logo.png or image URL"
                />
                <label className="px-3.5 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-semibold rounded-sm cursor-pointer shrink-0 transition-colors">
                  {uploading ? "Uploading..." : "Upload Logo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>

              {/* Logo Preview */}
              <div className="mt-3 h-16 bg-slate-50 rounded-sm border border-slate-200 flex items-center justify-center p-2.5">
                <img src={formatImageUrl(logoUrl, "/logo.png")} alt="Logo Preview" className="max-h-full object-contain" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Certification Badge Text</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
                placeholder="e.g. Certified Marine & Industrial Safety Partner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Footer Mission Paragraph</label>
            <textarea
              rows={3}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900 resize-y leading-relaxed"
              placeholder="Enter company description summary for footer"
            />
          </div>
        </div>

        {/* SECTION 2: OPERATIONS & CONTACT DETAILS */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 m-0">
                Operations & Contact Hub Details
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Manage operational offices, physical hubs, telephone numbers, and email.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddLocation}
              className="px-3 py-1.5 bg-[#1e3e8f] hover:bg-[#162f6d] text-white rounded-sm text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Location</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Column Header Title</label>
            <input
              type="text"
              value={operationsTitle}
              onChange={(e) => {
                setOperationsTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
            />
          </div>

          {/* Dynamic Locations Cards List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Operating Offices & Locations ({locations.length})
              </label>
            </div>

            {hasUnsavedChanges && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs font-medium text-amber-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>You have unsaved changes! Click &quot;Save Footer Configuration&quot; below to apply your updates.</span>
              </div>
            )}

            {locations.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-sm text-center text-xs text-slate-400 bg-slate-50/50">
                No physical locations configured. Click &quot;Add Location&quot; above to add one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50/50 border border-slate-200 rounded-sm space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1e3e8f] inline-block" />
                        Location #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteLocation(idx)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-medium cursor-pointer"
                        title="Delete this location"
                      >
                        Delete
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Office / Hub Title</label>
                      <input
                        type="text"
                        value={loc.title}
                        onChange={(e) => handleUpdateLocation(idx, "title", e.target.value)}
                        placeholder="e.g. Dammam, Kingdom of Saudi Arabia"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs text-slate-800 focus:outline-none focus:border-[#1e3e8f]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Physical Address</label>
                      <textarea
                        rows={2}
                        value={loc.address}
                        onChange={(e) => handleUpdateLocation(idx, "address", e.target.value)}
                        placeholder="e.g. P14, 2nd Industrial City, Dammam Kingdom of Saudi Arabia"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs text-slate-800 focus:outline-none focus:border-[#1e3e8f] resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Telephone Number</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Email Address</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BOTTOM LEGAL & COPYRIGHT */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Bottom Copyright & Legal Links
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Copyright Notice Text</label>
            <input
              type="text"
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:border-[#1e3e8f] focus:outline-none bg-white text-slate-900"
              placeholder="e.g. © 2026 East Wind Safety. All rights reserved."
            />
          </div>

          {/* Bottom Links */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-700">Bottom Quick Links ({bottomLinks.length})</span>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {bottomLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-sm border border-slate-200 text-xs">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => {
                      const updated = [...bottomLinks];
                      updated[idx].name = e.target.value;
                      setBottomLinks(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-sm bg-white font-medium"
                    placeholder="Link Name"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => {
                      const updated = [...bottomLinks];
                      updated[idx].href = e.target.value;
                      setBottomLinks(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-sm bg-white font-mono text-[11px]"
                    placeholder="/path"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBtmLink(idx)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-sm shrink-0 transition-colors cursor-pointer"
                    title="Remove Link"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Link Name (e.g. Privacy Policy)"
                value={newBtmName}
                onChange={(e) => setNewBtmName(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-sm text-xs bg-white"
              />
              <input
                type="text"
                placeholder="URL (e.g. /privacy)"
                value={newBtmHref}
                onChange={(e) => setNewBtmHref(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-sm text-xs font-mono bg-white"
              />
              <button
                type="button"
                onClick={handleAddBtmLink}
                className="px-3.5 py-1.5 bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-semibold rounded-sm shrink-0 cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="mt-6 p-4 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className={`w-2 h-2 rounded-full ${hasUnsavedChanges ? "bg-amber-500" : "bg-emerald-500"} shrink-0`} />
            <span>
              {hasUnsavedChanges
                ? "You have unsaved changes — save now to persist across the live website."
                : "All footer settings are synced."}
            </span>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2 bg-[#1e3e8f] hover:bg-[#162f6d] text-white font-semibold text-xs rounded-sm shadow-xs cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{saving ? "Saving Changes..." : "Save Footer Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
