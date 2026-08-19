"use client";

import { useEffect, useState } from "react";

export default function AdminHeroPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Slide 1 Captions
  const [slide1Tagline, setSlide1Tagline] = useState<string>("Safety Arabia Infrastructure");
  const [slide1Title, setSlide1Title] = useState<string>("Fusing Industry AI & Critical Safety");
  const [slide1Desc, setSlide1Desc] = useState<string>("We engineer intelligent, cyber-physical safety systems. From explosion-proof IIoT mobility to predictive threat analytics, we safeguard heavy industrial infrastructure.");
  const [slide1Btn1Text, setSlide1Btn1Text] = useState<string>("Operations Center");
  const [slide1Btn2Text, setSlide1Btn2Text] = useState<string>("Our Capabilities");

  // Slide 2 Captions
  const [slide2Tagline, setSlide2Tagline] = useState<string>("IIoT Data Telemetry Loops");
  const [slide2Title, setSlide2Title] = useState<string>("Real-time Edge Acquisition");
  const [slide2Desc, setSlide2Desc] = useState<string>("Deploying intrinsically safe wireless sensor webs inside explosive gas zones. Fusing critical network monitoring architecture protocols into a unified digital operations environment.");
  const [slide2Btn1Text, setSlide2Btn1Text] = useState<string>("Explore MIMES Wireless");

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/hero`);
      if (res.ok) {
        const data = await res.json();
        if (data.slide1Tagline) setSlide1Tagline(data.slide1Tagline);
        if (data.slide1Title) setSlide1Title(data.slide1Title);
        if (data.slide1Desc) setSlide1Desc(data.slide1Desc);
        if (data.slide1Btn1Text) setSlide1Btn1Text(data.slide1Btn1Text);
        if (data.slide1Btn2Text) setSlide1Btn2Text(data.slide1Btn2Text);

        if (data.slide2Tagline) setSlide2Tagline(data.slide2Tagline);
        if (data.slide2Title) setSlide2Title(data.slide2Title);
        if (data.slide2Desc) setSlide2Desc(data.slide2Desc);
        if (data.slide2Btn1Text) setSlide2Btn1Text(data.slide2Btn1Text);
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to Hero settings API node. Showing defaults.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setSaving(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const payload = {
        slide1Tagline,
        slide1Title,
        slide1Desc,
        slide1Btn1Text,
        slide1Btn2Text,
        slide2Tagline,
        slide2Title,
        slide2Desc,
        slide2Btn1Text
      };

      const res = await fetch(`${baseUrl}/api/hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update Hero captions");

      setSuccess("Homepage Hero slide captions updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save Hero section changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading Homepage Hero Captions Node...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              Homepage CMS
            </span>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Hero Section Captions</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Edit text titles, sub-taglines, descriptions, and call-to-action button labels for both homepage hero slides.
          </p>
        </div>

        <button
          onClick={handleSaveHero}
          disabled={saving}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-md cursor-pointer transition-all shrink-0"
        >
          {saving ? "Saving Changes..." : "Save Hero Slide Captions"}
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-800">✕</button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex justify-between items-center">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-800">✕</button>
        </div>
      )}

      <form onSubmit={handleSaveHero} className="space-y-8">
        
        {/* ================= HERO SLIDE 1 ================= */}
        <div className="bg-white p-8 border border-slate-200 rounded-2xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                SLIDE 1 CAPTIONS
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-2">Hero Slide 1 (Safety Arabia Infrastructure)</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-2">Top Tagline / Sub-label *</label>
              <input
                type="text"
                required
                value={slide1Tagline}
                onChange={(e) => setSlide1Tagline(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl font-mono text-amber-700 bg-slate-50"
                placeholder="e.g. SAFETY ARABIA INFRASTRUCTURE"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Main Slide Title *</label>
              <input
                type="text"
                required
                value={slide1Title}
                onChange={(e) => setSlide1Title(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl font-bold text-slate-900"
                placeholder="e.g. FUSING INDUSTRY AI & CRITICAL SAFETY"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">Description Paragraph *</label>
            <textarea
              rows={3}
              required
              value={slide1Desc}
              onChange={(e) => setSlide1Desc(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl text-xs leading-relaxed"
              placeholder="Enter slide 1 description text..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-4 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-2">Primary Button Text</label>
              <input
                type="text"
                value={slide1Btn1Text}
                onChange={(e) => setSlide1Btn1Text(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl font-bold text-red-600"
                placeholder="e.g. OPERATIONS CENTER"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Secondary Button Text</label>
              <input
                type="text"
                value={slide1Btn2Text}
                onChange={(e) => setSlide1Btn2Text(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl font-bold text-slate-700"
                placeholder="e.g. OUR CAPABILITIES"
              />
            </div>
          </div>
        </div>

        {/* ================= HERO SLIDE 2 ================= */}
        <div className="bg-white p-8 border border-slate-200 rounded-2xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                SLIDE 2 CAPTIONS
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-2">Hero Slide 2 (IIoT Edge Telemetry)</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-2">Top Tagline / Sub-label *</label>
              <input
                type="text"
                required
                value={slide2Tagline}
                onChange={(e) => setSlide2Tagline(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl font-mono text-sky-700 bg-slate-50"
                placeholder="e.g. IIOT DATA TELEMETRY LOOPS"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Main Slide Title *</label>
              <input
                type="text"
                required
                value={slide2Title}
                onChange={(e) => setSlide2Title(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl font-bold text-slate-900"
                placeholder="e.g. REAL-TIME EDGE ACQUISITION"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">Description Paragraph *</label>
            <textarea
              rows={3}
              required
              value={slide2Desc}
              onChange={(e) => setSlide2Desc(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl text-xs leading-relaxed"
              placeholder="Enter slide 2 description text..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs">
            <label className="block font-bold text-slate-700 mb-2">Primary Button Text</label>
            <input
              type="text"
              value={slide2Btn1Text}
              onChange={(e) => setSlide2Btn1Text(e.target.value)}
              className="w-full max-w-md px-4 py-3 border rounded-xl font-bold text-red-600"
              placeholder="e.g. EXPLORE MIMES WIRELESS"
            />
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase rounded-xl shadow-lg cursor-pointer transition-all"
          >
            {saving ? "Saving Changes..." : "Save Hero Slide Captions"}
          </button>
        </div>

      </form>
    </div>
  );
}
