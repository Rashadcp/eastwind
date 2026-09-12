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
  const [tagline, setTagline] = useState<string>("Sales, renting, and servicing of world-class safety products and engineered solutions for the Marine, Oil & Gas, Petrochemical, and Civil Defense sectors.");
  const [badgeText, setBadgeText] = useState<string>("Certified Marine & Industrial Safety Partner");
  const [solutionsTitle, setSolutionsTitle] = useState<string>("Safety Solutions");
  const [operationsTitle, setOperationsTitle] = useState<string>("Operations");

  // Dynamic Locations list
  const [locations, setLocations] = useState<FooterLocation[]>([
    {
      title: "Dammam, Kingdom of Saudi Arabia",
      address: "P14, 2nd Industrial City, Dammam\nKingdom of Saudi Arabia"
    },
    {
      title: "Riyadh Technology Hub",
      address: "Olaya District, Riyadh, Kingdom of Saudi Arabia"
    }
  ]);

  const [telephone, setTelephone] = useState<string>("+966 570 833 214");
  const [email, setEmail] = useState<string>("enquiry@eastwind.sa");
  const [copyright, setCopyright] = useState<string>(`© ${new Date().getFullYear()} East Wind Safety. All rights reserved. Premium Safety Products & Solutions Integrator.`);

  // Custom links
  const [solutionsLinks, setSolutionsLinks] = useState<FooterLink[]>([
    { name: "Oil & Gas Industry", href: "/solutions/oil-and-gas" },
    { name: "Petrochemical Infrastructure", href: "/solutions/petrochemicals" },
    { name: "Civil Defense & Military", href: "/solutions/civil-defense" },
    { name: "Marine & Offshore Platforms", href: "/solutions/marine-offshore" },
    { name: "Utility & Power Grids", href: "/solutions/utility-power" }
  ]);

  const [bottomLinks, setBottomLinks] = useState<FooterLink[]>([
    { name: "Privacy Policy", href: "/about" }
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
          if (footerDoc.logoUrl) setLogoUrl(footerDoc.logoUrl);
          if (footerDoc.tagline) setTagline(footerDoc.tagline);
          if (footerDoc.badgeText) setBadgeText(footerDoc.badgeText);
          if (footerDoc.solutionsTitle) setSolutionsTitle(footerDoc.solutionsTitle);
          if (footerDoc.operationsTitle) setOperationsTitle(footerDoc.operationsTitle);
          if (footerDoc.copyright) setCopyright(footerDoc.copyright);
          if (footerDoc.solutionsLinks && Array.isArray(footerDoc.solutionsLinks)) setSolutionsLinks(footerDoc.solutionsLinks);
          if (footerDoc.bottomLinks && Array.isArray(footerDoc.bottomLinks)) setBottomLinks(footerDoc.bottomLinks);
          if (footerDoc.telephone) setTelephone(footerDoc.telephone);
          if (footerDoc.email) setEmail(footerDoc.email);
        }

        if (contactDoc) {
          if (!footerDoc?.telephone && contactDoc.telephone) setTelephone(contactDoc.telephone);
          if (!footerDoc?.email && contactDoc.email) setEmail(contactDoc.email);
        }

        // Initialize locations from footer, contactDoc or legacy fields
        if (footerDoc?.locations && Array.isArray(footerDoc.locations) && footerDoc.locations.length > 0) {
          setLocations(footerDoc.locations);
        } else if (contactDoc?.locations && Array.isArray(contactDoc.locations) && contactDoc.locations.length > 0) {
          setLocations(contactDoc.locations);
        } else {
          const initialLocs: FooterLocation[] = [];
          const hqT = footerDoc?.hqTitle || contactDoc?.hqTitle || "Dammam, Kingdom of Saudi Arabia";
          const hqA = footerDoc?.hqAddress || contactDoc?.hqAddress || "P14, 2nd Industrial City, Dammam\nKingdom of Saudi Arabia";
          const hubT = footerDoc?.hubTitle || contactDoc?.hubTitle || "Riyadh Technology Hub";
          const hubA = footerDoc?.hubAddress || contactDoc?.hubAddress || "Olaya District, Riyadh, Kingdom of Saudi Arabia";

          if (hqT || hqA) initialLocs.push({ title: hqT, address: hqA });
          if (hubT || hubA) initialLocs.push({ title: hubT, address: hubA });
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
  };

  const handleUpdateLocation = (index: number, field: "title" | "address", value: string) => {
    const updated = [...locations];
    updated[index] = { ...updated[index], [field]: value };
    setLocations(updated);
  };

  const handleDeleteLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
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
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Loading Footer Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight m-0 text-slate-900">Manage Footer Section</h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
            Configure dynamic footer content, links, addresses & branding assets
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
        >
          Visit Live Site ↗
        </a>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs flex items-center gap-2">
          <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-xs flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* SECTION 1: BRAND & LOGO */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            1. Brand Assets & Mission Text
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Footer Brand Logo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  placeholder="/logo.png or image URL"
                />
                <label className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0">
                  {uploading ? "Uploading..." : "Upload Logo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>

              {/* Logo Preview */}
              <div className="mt-3 h-20 bg-slate-900 rounded-xl border border-slate-200 flex items-center justify-center p-3">
                <img src={formatImageUrl(logoUrl, "/logo.png")} alt="Logo Preview" className="max-h-full object-contain" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Certification Badge Text</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
                placeholder="e.g. Certified Marine & Industrial Safety Partner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Footer Mission Paragraph</label>
            <textarea
              rows={3}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium resize-y"
              placeholder="Enter company description summary for footer"
            />
          </div>
        </div>

        {/* SECTION 2: OPERATIONS & CONTACT DETAILS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 m-0">
                2. Operations & Contact Hub Details
              </h3>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                Manage operational offices, physical hubs, emergency telephone numbers & emails
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddLocation}
              className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0 self-start sm:self-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add Location</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Column Header Title</label>
            <input
              type="text"
              value={operationsTitle}
              onChange={(e) => setOperationsTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
              placeholder="e.g. Operations"
            />
          </div>

          {/* Dynamic Locations List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Operational Office & Hub Locations ({locations.length})
              </label>
            </div>

            {locations.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400 bg-slate-50/50">
                No physical locations configured. Click &quot;+ Add Location&quot; above to add one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50/60 border border-slate-200/90 rounded-2xl space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                        Location #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteLocation(idx)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="Delete this location"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Office / Hub Title</label>
                      <input
                        type="text"
                        value={loc.title}
                        onChange={(e) => handleUpdateLocation(idx, "title", e.target.value)}
                        placeholder="e.g. Dammam, Kingdom of Saudi Arabia"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Physical Address</label>
                      <textarea
                        rows={2}
                        value={loc.address}
                        onChange={(e) => handleUpdateLocation(idx, "address", e.target.value)}
                        placeholder="e.g. P14, 2nd Industrial City, Dammam Kingdom of Saudi Arabia"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-orange-500 resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Telephone Number</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email Address</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BOTTOM LEGAL & COPYRIGHT */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            3. Bottom Copyright & Legal Links
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Copyright Notice Text</label>
            <input
              type="text"
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
              placeholder="e.g. © 2026 East Wind Safety. All rights reserved."
            />
          </div>

          {/* Bottom Links */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-700">Bottom Quick Links ({bottomLinks.length})</span>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {bottomLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => {
                      const updated = [...bottomLinks];
                      updated[idx].name = e.target.value;
                      setBottomLinks(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold"
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
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                    placeholder="/path"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBtmLink(idx)}
                    className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg shrink-0 transition-colors"
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
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="URL (e.g. /privacy)"
                value={newBtmHref}
                onChange={(e) => setNewBtmHref(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddBtmLink}
                style={{ color: "#ffffff" }}
                className="px-5 py-2.5 bg-[#1e3e8f] hover:bg-[#152e6f] !text-white text-xs font-extrabold rounded-xl shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* STICKY SAVE BAR */}
        <div className="sticky bottom-6 z-40 flex justify-end mt-8">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-orange-100 flex items-center gap-4">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
              Remember to save your footer updates before leaving
            </span>
            <button
              type="submit"
              disabled={saving}
              className="py-3.5 px-8 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg cursor-pointer disabled:opacity-50 transition-all flex items-center gap-2 hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{saving ? "Saving Changes..." : "Save Footer Configuration"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
