"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

interface FooterLink {
  name: string;
  href: string;
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
  const [hqTitle, setHqTitle] = useState<string>("Al Khobar Headquarters");
  const [hqAddress, setHqAddress] = useState<string>("King Faisal West Road, Bandariyah District, Al Khobar, Kingdom of Saudi Arabia");
  const [hubTitle, setHubTitle] = useState<string>("Riyadh Technology Hub");
  const [hubAddress, setHubAddress] = useState<string>("Olaya District, Riyadh, Kingdom of Saudi Arabia");
  const [telephone, setTelephone] = useState<string>("+966 13 889 XXXX");
  const [email, setEmail] = useState<string>("info@eastwindsafety.com");
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
    { name: "Marine & Industrial Compliance", href: "/solutions" },
    { name: "Privacy Policy", href: "/about" },
    { name: "Admin Portal", href: "/admin/login" }
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
        }

        if (contactDoc) {
          if (contactDoc.hqTitle) setHqTitle(contactDoc.hqTitle);
          if (contactDoc.hqAddress) setHqAddress(contactDoc.hqAddress);
          if (contactDoc.hubTitle) setHubTitle(contactDoc.hubTitle);
          if (contactDoc.hubAddress) setHubAddress(contactDoc.hubAddress);
          if (contactDoc.telephone) setTelephone(contactDoc.telephone);
          if (contactDoc.email) setEmail(contactDoc.email);
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
        hqTitle,
        hqAddress,
        hubTitle,
        hubAddress,
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
          <span>⚠️ {error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-xs flex items-center gap-2">
          <span>✓ {success}</span>
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

        {/* SECTION 2: SOLUTIONS COLUMN */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            2. Safety Solutions Column
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Column Header Title</label>
            <input
              type="text"
              value={solutionsTitle}
              onChange={(e) => setSolutionsTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
              placeholder="e.g. Safety Solutions"
            />
          </div>

          {/* Solutions Links List */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-700">Quick Links List ({solutionsLinks.length})</span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {solutionsLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => {
                      const updated = [...solutionsLinks];
                      updated[idx].name = e.target.value;
                      setSolutionsLinks(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold"
                    placeholder="Link Title"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => {
                      const updated = [...solutionsLinks];
                      updated[idx].href = e.target.value;
                      setSolutionsLinks(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono text-[11px]"
                    placeholder="/solutions/page"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSolLink(idx)}
                    className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg shrink-0"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Add Solution Link */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Link Title (e.g. Oil & Gas Industry)"
                value={newSolName}
                onChange={(e) => setNewSolName(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="URL (e.g. /solutions/oil-and-gas)"
                value={newSolHref}
                onChange={(e) => setNewSolHref(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddSolLink}
                style={{ color: "#ffffff" }}
                className="px-5 py-2.5 bg-[#1e3e8f] hover:bg-[#152e6f] !text-white text-xs font-extrabold rounded-xl shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all flex items-center gap-1"
              >
                <span style={{ color: "#ffffff" }}>➕ Add Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: OPERATIONS & CONTACT DETAILS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            3. Operations & Contact Hub Details
          </h3>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">HQ Title</label>
              <input
                type="text"
                value={hqTitle}
                onChange={(e) => setHqTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
              />
              <label className="block text-xs font-bold text-slate-700 mt-2 mb-1">HQ Address</label>
              <textarea
                rows={2}
                value={hqAddress}
                onChange={(e) => setHqAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tech Hub Title</label>
              <input
                type="text"
                value={hubTitle}
                onChange={(e) => setHubTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
              />
              <label className="block text-xs font-bold text-slate-700 mt-2 mb-1">Tech Hub Address</label>
              <textarea
                rows={2}
                value={hubAddress}
                onChange={(e) => setHubAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium resize-y"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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

        {/* SECTION 4: BOTTOM LEGAL & COPYRIGHT */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            4. Bottom Copyright & Legal Links
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
                    className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg shrink-0"
                  >
                    🗑️
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
                className="px-5 py-2.5 bg-[#1e3e8f] hover:bg-[#152e6f] !text-white text-xs font-extrabold rounded-xl shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all flex items-center gap-1"
              >
                <span style={{ color: "#ffffff" }}>➕ Add Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="py-3.5 px-8 bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-600/20 cursor-pointer disabled:opacity-50 transition-all"
          >
            {saving ? "Saving Changes..." : "✓ Save Footer Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
