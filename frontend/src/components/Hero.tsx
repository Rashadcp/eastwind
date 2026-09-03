// src/components/Hero.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cachedFetch } from "@/utils/apiCache";
import { formatImageUrl } from "@/utils/image";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerImgRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frame1Ref = useRef<HTMLDivElement>(null);
  const frame2Ref = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  // Dynamic Captions State (Loaded purely from backend CMS)
  const [slide1Tagline, setSlide1Tagline] = useState<string>("");
  const [slide1Title, setSlide1Title] = useState<string>("");
  const [slide1Desc, setSlide1Desc] = useState<string>("");
  const [slide1Btn1Text, setSlide1Btn1Text] = useState<string>("");
  const [slide1Btn1Link, setSlide1Btn1Link] = useState<string>("#solutions");
  const [slide1Btn2Text, setSlide1Btn2Text] = useState<string>("");
  const [slide1Btn2Link, setSlide1Btn2Link] = useState<string>("#solutions");

  const [slide2Tagline, setSlide2Tagline] = useState<string>("");
  const [slide2Title, setSlide2Title] = useState<string>("");
  const [slide2Desc, setSlide2Desc] = useState<string>("");
  const [slide2Btn1Text, setSlide2Btn1Text] = useState<string>("");
  const [slide2Btn1Link, setSlide2Btn1Link] = useState<string>("/solutions/mimes");

  // Dynamic Media Sources
  const [bannerImg, setBannerImg] = useState<string>("/hero-section.webp");
  const [videoSrc, setVideoSrc] = useState<string>("/hero-video.mp4");

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setVideoSrc("/hero-video-mobile.mp4");
    }
  }, []);

  useEffect(() => {
    async function loadHeroData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const data = await cachedFetch<any>(`${baseUrl}/api/hero`, { fallback: null });
        if (data) {
          if (data.bannerImg) setBannerImg(data.bannerImg);
          if (data.videoSrc && (typeof window === "undefined" || window.innerWidth >= 768)) {
            setVideoSrc(data.videoSrc);
          }
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
      } catch (err) {
        console.error("Hero data fetch error:", err);
      }
    }
    loadHeroData();
  }, []);

  // Rock-solid, mobile-optimized Apple-style scroll scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.pause();
      video.currentTime = 0;
    }

    const onSeeking = () => {
      isSeekingRef.current = true;
    };
    const onSeeked = () => {
      isSeekingRef.current = false;
    };

    video?.addEventListener("seeking", onSeeking);
    video?.addEventListener("seeked", onSeeked);

    const updateDOM = (progress: number) => {
      // 1. Cross-fade first banner image to video
      if (bannerImgRef.current) {
        const bannerOpacity = progress <= 0.22 ? 1 : Math.max(0, 1 - (progress - 0.22) / 0.18);
        bannerImgRef.current.style.opacity = String(bannerOpacity);
      }

      if (videoContainerRef.current) {
        const videoOpacity = progress <= 0.20 ? 0 : Math.min(1, (progress - 0.20) / 0.18);
        videoContainerRef.current.style.opacity = String(videoOpacity);
      }

      // 2. Slide 1 text: fully visible on first image, floats up & fades on scroll
      if (frame1Ref.current) {
        const opacity = progress <= 0.35 ? Math.max(0, 1 - progress / 0.28) : 0;
        frame1Ref.current.style.opacity = String(opacity);
        frame1Ref.current.style.pointerEvents = progress <= 0.24 ? "auto" : "none";
        frame1Ref.current.style.transform = `translate3d(0, calc(-50% - ${progress * 70}px), 0)`;
      }

      // 3. Slide 2 text: fades in as video progresses
      if (frame2Ref.current) {
        const opacity = progress > 0.42 ? Math.min(1, (progress - 0.42) / 0.16) : 0;
        frame2Ref.current.style.opacity = String(opacity);
        frame2Ref.current.style.pointerEvents = progress > 0.50 ? "auto" : "none";
        frame2Ref.current.style.transform = `translate3d(0, calc(-50% - ${(progress - 0.75) * 60}px), 0)`;
      }

      // 4. Scroll indicator
      if (indicatorRef.current) {
        indicatorRef.current.style.opacity = String(Math.max(0, 1 - progress * 5));
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      // Map progress (from 0.20 to 1.0) to video timeline
      if (videoRef.current && videoRef.current.duration) {
        const videoProgress = Math.max(0, Math.min(1, (progress - 0.20) / 0.80));
        targetTimeRef.current = videoProgress * videoRef.current.duration;
      }

      updateDOM(progress);
    };

    // Smooth lerp loop with Apple-style fastSeek optimization
    let animId: number;
    const renderLoop = () => {
      const vid = videoRef.current;
      if (vid && !isNaN(vid.duration) && vid.duration > 0) {
        const diff = targetTimeRef.current - vid.currentTime;
        // Check if seek is pending to avoid overloading mobile decoder queue
        if (Math.abs(diff) > 0.02 && !isSeekingRef.current && !vid.seeking) {
          const nextTime = vid.currentTime + diff * 0.32;
          try {
            if ("fastSeek" in vid && typeof (vid as any).fastSeek === "function") {
              (vid as any).fastSeek(nextTime);
            } else {
              vid.currentTime = nextTime;
            }
          } catch {
            vid.currentTime = nextTime;
          }
        }
      }
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      video?.removeEventListener("seeking", onSeeking);
      video?.removeEventListener("seeked", onSeeked);
    };
  }, [videoSrc]);

  return (
    <div ref={containerRef} className="h-[240vh] relative bg-[#08090c] w-full" id="hero">
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden">

        {/* 1. First Hero Image (Visible at top, fades out on scroll) */}
        <div
          ref={bannerImgRef}
          className="absolute top-0 left-0 w-full h-full z-10 transition-opacity duration-300 pointer-events-none bg-[#08090c]"
          style={{ opacity: 1 }}
        >
          <img
            src={formatImageUrl(bannerImg)}
            alt="Safety Arabia Hero Banner"
            className="w-full h-full object-cover object-center sm:object-right"
            loading="eager"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/hero-section.webp";
            }}
          />
        </div>

        {/* 2. Apple-style Scroll Video (Mobile & Desktop hardware accelerated) */}
        <div
          ref={videoContainerRef}
          className="absolute top-0 left-0 w-full h-full overflow-hidden bg-[#08090c] z-10 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <video
            ref={videoRef}
            src={formatImageUrl(videoSrc)}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            className="w-full h-full object-cover scale-[1.03] select-none"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
          />
        </div>

        {/* Ambient Scanlines & Dynamic Dark Vignette for Contrast */}
        <div
          className="absolute inset-0 z-15 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0, 240, 255, 0.01) 0px, rgba(0, 240, 255, 0.01) 1px, transparent 1px, transparent 4px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090c]/75 via-[#08090c]/25 to-[#08090c]/85 z-20 pointer-events-none" />

        {/* Floating Narrative Content */}
        <div className="max-w-[1240px] w-full mx-auto h-full px-6 sm:px-8 lg:px-12 relative z-30 flex items-center">
          <div className="relative h-[68vh] w-full max-w-[600px] lg:max-w-[640px] flex flex-col justify-center">

            {/* Frame 1: Opening Perspective (Paired with First Image) */}
            <div
              ref={frame1Ref}
              className="absolute top-1/2 left-0 w-full"
              style={{ opacity: 1, transform: "translate3d(0, -50%, 0)", pointerEvents: "auto" }}
            >
              {slide1Title && (
                <h1 className="text-2xl sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem] font-extrabold text-white mb-4 leading-[1.15] tracking-tight uppercase">
                  {slide1Title}
                </h1>
              )}
              {slide1Desc && (
                <p className="text-xs sm:text-[0.98rem] text-slate-200 mb-6 sm:mb-8 max-w-[520px] leading-relaxed font-normal">
                  {slide1Desc}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {slide1Btn1Text && (
                  <a href={slide1Btn1Link} className="btn-primary !py-2.5 sm:!py-3 !px-5 sm:!px-7 !text-[0.76rem] sm:!text-[0.78rem] shadow-lg">
                    {slide1Btn1Text}
                  </a>
                )}
                {slide1Btn2Text && (
                  <a
                    href={slide1Btn2Link}
                    className="btn-secondary !py-2.5 sm:!py-3 !px-5 sm:!px-7 !text-[0.76rem] sm:!text-[0.78rem] text-white border-white/35 hover:border-white hover:bg-white/10"
                  >
                    {slide1Btn2Text}
                  </a>
                )}
              </div>
            </div>

            {/* Frame 2: Advanced Telemetry Perspective (Paired with Video) */}
            <div
              ref={frame2Ref}
              className="absolute top-1/2 left-0 w-full"
              style={{ opacity: 0, transform: "translate3d(0, -50%, 0)", pointerEvents: "none" }}
            >
              {slide2Title && (
                <h2 className="text-2xl sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem] font-extrabold text-white mb-4 leading-[1.15] tracking-tight uppercase">
                  {slide2Title}
                </h2>
              )}
              {slide2Desc && (
                <p className="text-xs sm:text-[0.98rem] text-slate-200 mb-6 sm:mb-8 max-w-[520px] leading-relaxed font-normal">
                  {slide2Desc}
                </p>
              )}
              {slide2Btn1Text && (
                <div>
                  <a href={slide2Btn1Link} className="btn-primary !py-2.5 sm:!py-3 !px-5 sm:!px-7 !text-[0.76rem] sm:!text-[0.78rem] shadow-lg">
                    {slide2Btn1Text}
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Scroll To Explore Indicator */}
        <div
          ref={indicatorRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-40 transition-opacity duration-300 pointer-events-none"
        >
          <span className="font-mono text-[0.6rem] uppercase text-white/50 tracking-widest">Scroll to explore</span>
          <div className="w-4 h-7 rounded-[8px] border border-white/30 relative">
            <div className="w-0.5 h-1.5 bg-sky-400 rounded-[1px] absolute top-1 left-1/2 -translate-x-1/2 animate-[scrollMouse_1.5s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}