"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/utils/image";

export default function AdminHeroPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [uploadingVideo, setUploadingVideo] = useState<boolean>(false);
  const [videoStats, setVideoStats] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Hero Media State
  const [bannerImg, setBannerImg] = useState<string>("/hero-section.webp");
  const [videoSrc, setVideoSrc] = useState<string>("/hero-video.mp4");

  // Slide 1 Captions & Links
  const [slide1Tagline, setSlide1Tagline] = useState<string>("Safety Arabia Infrastructure");
  const [slide1Title, setSlide1Title] = useState<string>("Fusing Industry AI & Critical Safety");
  const [slide1Desc, setSlide1Desc] = useState<string>("We engineer intelligent, cyber-physical safety systems. From explosion-proof IIoT mobility to predictive threat analytics, we safeguard heavy industrial infrastructure.");
  const [slide1Btn1Text, setSlide1Btn1Text] = useState<string>("Operations Center");
  const [slide1Btn1Link, setSlide1Btn1Link] = useState<string>("#solutions");
  const [slide1Btn2Text, setSlide1Btn2Text] = useState<string>("Our Capabilities");
  const [slide1Btn2Link, setSlide1Btn2Link] = useState<string>("#solutions");

  // Slide 2 Captions & Links
  const [slide2Tagline, setSlide2Tagline] = useState<string>("IIoT Data Telemetry Loops");
  const [slide2Title, setSlide2Title] = useState<string>("Real-time Edge Acquisition");
  const [slide2Desc, setSlide2Desc] = useState<string>("Deploying intrinsically safe wireless sensor webs inside explosive gas zones. Fusing critical network monitoring architecture protocols into a unified digital operations environment.");
  const [slide2Btn1Text, setSlide2Btn1Text] = useState<string>("Explore MIMES Wireless");
  const [slide2Btn1Link, setSlide2Btn1Link] = useState<string>("/solutions/mimes");

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
        if (data.bannerImg) setBannerImg(data.bannerImg);
        if (data.videoSrc) setVideoSrc(data.videoSrc);
        if (data.slide1Tagline) setSlide1Tagline(data.slide1Tagline);
        if (data.slide1Title) setSlide1Title(data.slide1Title);
        if (data.slide1Desc) setSlide1Desc(data.slide1Desc);
        if (data.slide1Btn1Text) setSlide1Btn1Text(data.slide1Btn1Text);
        if (data.slide1Btn1Link) setSlide1Btn1Link(data.slide1Btn1Link);
        if (data.slide1Btn2Text) setSlide1Btn2Text(data.slide1Btn2Text);
        if (data.slide1Btn2Link) setSlide1Btn2Link(data.slide1Btn2Link);

        if (data.slide2Tagline) setSlide2Tagline(data.slide2Tagline);
        if (data.slide2Title) setSlide2Title(data.slide2Title);
        if (data.slide2Desc) setSlide2Desc(data.slide2Desc);
        if (data.slide2Btn1Text) setSlide2Btn1Text(data.slide2Btn1Text);
        if (data.slide2Btn1Link) setSlide2Btn1Link(data.slide2Btn1Link);
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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearMessages();
    setUploadingImage(true);

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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      setBannerImg(data.url);
      setSuccess("Banner image uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload banner image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearMessages();
    setUploadingVideo(true);
    setVideoStats(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload and compress video");

      const finalVideoPath = data.url || data.videoUrl || `/uploads/${data.filename}`;
      setVideoSrc(finalVideoPath);

      if (data.compressedSizeKb && data.reduction) {
        setVideoStats(`Compressed to ${data.compressedSizeKb} (${data.reduction} smaller)`);
      }
      setSuccess(`Video compressed and uploaded successfully! (${data.compressedSizeKb || "Optimized"})`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload and compress video.");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setSaving(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const payload = {
        bannerImg,
        videoSrc,
        slide1Tagline,
        slide1Title,
        slide1Desc,
        slide1Btn1Text,
        slide1Btn1Link,
        slide1Btn2Text,
        slide1Btn2Link,
        slide2Tagline,
        slide2Title,
        slide2Desc,
        slide2Btn1Text,
        slide2Btn1Link
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

      setSuccess("Homepage Hero media and slide captions updated successfully!");
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
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 text-red-500 hover:text-red-800 rounded-lg hover:bg-red-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="p-1 text-emerald-500 hover:text-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSaveHero} className="space-y-8">
        
        {/* ================= HERO MEDIA ================= */}
        <div className="bg-white p-8 border border-slate-200 rounded-2xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                HERO MEDIA ASSETS
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-2">Banner Image & Background Video</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
            {/* 1. Poster Banner Image Upload */}
            <div className="space-y-3">
              <label className="block font-bold text-slate-800 text-sm">
                Poster / Banner Image (Slide 1)
              </label>
              <div className="flex gap-2.5 items-center">
                <input
                  type="text"
                  value={bannerImg}
                  onChange={(e) => setBannerImg(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl font-mono text-slate-800 bg-slate-50 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="/hero-section.webp"
                />
                <label className="px-5 py-3 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold rounded-xl cursor-pointer text-xs shrink-0 flex items-center justify-center gap-2 transition-all shadow-md">
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-white font-bold tracking-wide">
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-400">
                Supports JPG, PNG, WEBP, SVG. Images are automatically compressed to high-efficiency WebP.
              </p>
              {bannerImg && (
                <div className="mt-2 w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 relative shadow-inner">
                  <img
                    src={formatImageUrl(bannerImg)}
                    alt="Hero Banner Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/hero-section.webp";
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/75 text-[10px] text-white font-mono rounded-md backdrop-blur-xs">
                    Slide 1 Poster Image
                  </div>
                </div>
              )}
            </div>

            {/* 2. Background Scroll Video Upload with Auto-Compression */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800 text-sm">
                  Background Scroll Video (Slide 2)
                </label>
                {videoStats && (
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                    ✓ {videoStats}
                  </span>
                )}
              </div>
              <div className="flex gap-2.5 items-center">
                <input
                  type="text"
                  value={videoSrc}
                  onChange={(e) => setVideoSrc(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl font-mono text-slate-800 bg-slate-50 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="/hero-video.mp4"
                />
                <label className="px-5 py-3 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold rounded-xl cursor-pointer text-xs shrink-0 flex items-center justify-center gap-2 transition-all shadow-md">
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white font-bold tracking-wide">
                    {uploadingVideo ? "Compressing & Uploading..." : "Upload Video"}
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-500 flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong>Automatic Video Compression:</strong> Uploaded MP4/MOV videos are automatically re-encoded using <strong>FFmpeg H.264 (faststart)</strong> to optimize file size and guarantee instant, smooth scroll scrubbing.
                </span>
              </p>
              {videoSrc && (
                <div className="mt-2 w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 relative shadow-inner">
                  <video
                    src={formatImageUrl(videoSrc)}
                    controls
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/75 text-[10px] text-white font-mono rounded-md backdrop-blur-xs pointer-events-none">
                    Slide 2 Video Player Preview
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
            <div className="space-y-3">
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
                <label className="block font-bold text-slate-700 mb-1">Primary Button Link / URL</label>
                <input
                  type="text"
                  value={slide1Btn1Link}
                  onChange={(e) => setSlide1Btn1Link(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl font-mono text-slate-700 bg-slate-50 text-xs"
                  placeholder="#solutions or /contact"
                />
              </div>
            </div>

            <div className="space-y-3">
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
              <div>
                <label className="block font-bold text-slate-700 mb-1">Secondary Button Link / URL</label>
                <input
                  type="text"
                  value={slide1Btn2Link}
                  onChange={(e) => setSlide1Btn2Link(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl font-mono text-slate-700 bg-slate-50 text-xs"
                  placeholder="#solutions or /about"
                />
              </div>
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

          <div className="pt-4 border-t border-slate-100 text-xs space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-2">Primary Button Text</label>
              <input
                type="text"
                value={slide2Btn1Text}
                onChange={(e) => setSlide2Btn1Text(e.target.value)}
                className="w-full max-w-md px-4 py-3 border rounded-xl font-bold text-red-600"
                placeholder="e.g. EXPLORE MIMES WIRELESS"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Button Link / URL</label>
              <input
                type="text"
                value={slide2Btn1Link}
                onChange={(e) => setSlide2Btn1Link(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 border rounded-xl font-mono text-slate-700 bg-slate-50 text-xs"
                placeholder="/solutions/mimes"
              />
            </div>
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
