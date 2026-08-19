// src/components/Hero.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cachedFetch } from "@/utils/apiCache";

const TOTAL_FRAMES = 85;

const getFrameUrl = (index: number) => {
  let fileNum = index + 1;
  if (fileNum >= 82) {
    fileNum = fileNum + 7;
  }
  const padNum = String(fileNum).padStart(5, "0");
  return `/hero-frames/${padNum}.webp`;
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bannerImgRef = useRef<HTMLDivElement>(null);
  const frame1Ref = useRef<HTMLDivElement>(null);
  const frame2Ref = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // Dynamic Captions State (Loaded purely from backend CMS)
  const [slide1Tagline, setSlide1Tagline] = useState<string>("");
  const [slide1Title, setSlide1Title] = useState<string>("");
  const [slide1Desc, setSlide1Desc] = useState<string>("");
  const [slide1Btn1Text, setSlide1Btn1Text] = useState<string>("");
  const [slide1Btn2Text, setSlide1Btn2Text] = useState<string>("");

  const [slide2Tagline, setSlide2Tagline] = useState<string>("");
  const [slide2Title, setSlide2Title] = useState<string>("");
  const [slide2Desc, setSlide2Desc] = useState<string>("");
  const [slide2Btn1Text, setSlide2Btn1Text] = useState<string>("");

  useEffect(() => {
    async function loadHeroData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const data = await cachedFetch<any>(`${baseUrl}/api/hero`, { fallback: null });
        if (data) {
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
      } catch (err) {
        console.error("Hero data fetch error:", err);
      }
    }
    loadHeroData();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const loadedMap: HTMLImageElement[] = [];

    // Preload starting frame 50 immediately for instant transition
    const startImg = new Image();
    startImg.src = getFrameUrl(50);
    loadedMap[50] = startImg;
    setImages([...loadedMap]);

    // Stream the remaining active animation frames (51 to 84) progressively in idle time
    const loadRemainingFrames = () => {
      const activeFrameIndices: number[] = [];
      for (let i = 51; i < TOTAL_FRAMES; i++) {
        activeFrameIndices.push(i);
      }

      let currentIndex = 0;
      function loadNextBatch() {
        if (isCancelled || currentIndex >= activeFrameIndices.length) return;
        const batch = activeFrameIndices.slice(currentIndex, currentIndex + 4);
        currentIndex += 4;

        batch.forEach((idx) => {
          const img = new Image();
          img.src = getFrameUrl(idx);
          img.onload = () => {
            if (!isCancelled) {
              loadedMap[idx] = img;
              setImages([...loadedMap]);
            }
          };
        });

        if (currentIndex < activeFrameIndices.length) {
          if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            (window as any).requestIdleCallback(() => loadNextBatch(), { timeout: 1000 });
          } else {
            setTimeout(loadNextBatch, 80);
          }
        }
      }

      // Start streaming shortly after initial render
      setTimeout(loadNextBatch, 300);
    };

    loadRemainingFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const START_FRAME = 50; // Start slide 2 animation from frame 50 (00051.webp)

    const drawFrame = (progress: number) => {
      // 1. Slide 1 (0% to 35%): Show fixed banner image
      // 2. Transition (35% to 50%): Cross-fade fixed banner to 3D canvas animation
      // 3. Slide 2 (35% to 100%): Scrub 3D animation starting from frame 50
      if (bannerImgRef.current) {
        const bannerOpacity = progress <= 0.35 ? 1 : Math.max(0, 1 - (progress - 0.35) / 0.15);
        bannerImgRef.current.style.opacity = String(bannerOpacity);
      }

      if (canvasRef.current) {
        const canvasOpacity = progress > 0.35 ? Math.min(1, (progress - 0.35) / 0.15) : 0;
        canvasRef.current.style.opacity = String(canvasOpacity);
      }

      const slide2Progress = Math.max(0, Math.min(1, (progress - 0.30) / 0.65));
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        START_FRAME + Math.floor(slide2Progress * (TOTAL_FRAMES - 1 - START_FRAME))
      );

      const img = images[frameIndex] || images[START_FRAME];
      if (img && img.complete) {
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, drawX, drawY;

        if (imgRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      }
    };

    const updateDOM = (progress: number) => {
      if (frame1Ref.current) {
        const opacity = progress <= 0.45 ? 1 - (progress / 0.45) : 0;
        frame1Ref.current.style.opacity = String(opacity);
        frame1Ref.current.style.pointerEvents = progress <= 0.35 ? "auto" : "none";
        frame1Ref.current.style.transform = `translate3d(0, calc(-50% - ${progress * 60}px), 0)`;
      }

      if (frame2Ref.current) {
        const opacity = progress > 0.45 ? Math.min(1, (progress - 0.45) / 0.10) : 0;
        frame2Ref.current.style.opacity = String(opacity);
        frame2Ref.current.style.pointerEvents = progress > 0.50 ? "auto" : "none";
        frame2Ref.current.style.transform = `translate3d(0, calc(-50% - ${(progress - 0.75) * 60}px), 0)`;
      }

      if (indicatorRef.current) {
        indicatorRef.current.style.opacity = String(Math.max(0, 1 - progress * 6));
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      requestAnimationFrame(() => {
        drawFrame(progress);
        updateDOM(progress);
      });
    };

    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      handleScroll();
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", handleScroll, { passive: true });
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [images]);

  return (
    <div ref={containerRef} className="h-[200vh] relative bg-white w-full" id="hero">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Slide 1 Fixed Banner Image */}
        <div
          ref={bannerImgRef}
          className="absolute top-0 left-0 w-full h-full z-10 transition-opacity duration-300 pointer-events-none bg-[#08090c]"
        >
          <img
            src="/hero-section.webp"
            alt="Safety Arabia Hero Banner"
            className="w-full h-full object-cover object-right-top sm:object-right"
          />
        </div>

        {/* Slide 2 Canvas 3D Frame Animation */}
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover z-10 bg-black opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 z-15 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(to bottom, rgba(0, 240, 255, 0.01) 0px, rgba(0, 240, 255, 0.01) 1px, transparent 1px, transparent 4px)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090c]/70 via-[#08090c]/20 to-[#08090c]/75 z-20 pointer-events-none" />

        <div className="max-w-[1240px] w-full mx-auto h-full px-6 sm:px-8 lg:px-12 relative z-30 flex items-center">
          <div className="relative h-[68vh] w-full max-w-[600px] lg:max-w-[640px] flex flex-col justify-center">

            <div ref={frame1Ref} className="absolute top-1/2 left-0 w-full" style={{ opacity: 1, transform: "translate3d(0, -50%, 0)", pointerEvents: "auto" }}>
              {slide1Tagline && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[0.72rem] font-mono font-bold uppercase tracking-wider rounded-md mb-4 backdrop-blur-sm">
                  {slide1Tagline}
                </div>
              )}
              {slide1Title && (
                <h1 className="text-3xl sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem] font-extrabold text-white mb-4 leading-[1.12] tracking-tight uppercase">
                  {slide1Title}
                </h1>
              )}
              {slide1Desc && (
                <p className="text-sm sm:text-[0.98rem] text-slate-200 mb-8 max-w-[520px] leading-relaxed font-normal">
                  {slide1Desc}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3.5">
                {slide1Btn1Text && (
                  <a href="#solutions" className="btn-primary !py-3 !px-7 !text-[0.78rem] shadow-lg">
                    {slide1Btn1Text}
                  </a>
                )}
                {slide1Btn2Text && (
                  <a href="#solutions" className="btn-secondary !py-3 !px-7 !text-[0.78rem] text-white border-white/35 hover:border-white hover:bg-white/10">
                    {slide1Btn2Text}
                  </a>
                )}
              </div>
            </div>

            <div ref={frame2Ref} className="absolute top-1/2 left-0 w-full" style={{ opacity: 0, transform: "translate3d(0, -50%, 0)", pointerEvents: "none" }}>
              {slide2Tagline && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[0.72rem] font-mono font-bold uppercase tracking-wider rounded-md mb-4 backdrop-blur-sm">
                  {slide2Tagline}
                </div>
              )}
              {slide2Title && (
                <h2 className="text-3xl sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem] font-extrabold text-white mb-4 leading-[1.12] tracking-tight uppercase">
                  {slide2Title}
                </h2>
              )}
              {slide2Desc && (
                <p className="text-sm sm:text-[0.98rem] text-slate-200 mb-8 max-w-[520px] leading-relaxed font-normal">
                  {slide2Desc}
                </p>
              )}
              {slide2Btn1Text && (
                <div>
                  <a href="#solutions" className="btn-primary !py-3 !px-7 !text-[0.78rem] shadow-lg">
                    {slide2Btn1Text}
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>

        <div ref={indicatorRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-40 transition-opacity duration-300 pointer-events-none">
          <span className="font-mono text-[0.6rem] uppercase text-white/50 tracking-widest">Scroll to explore</span>
          <div className="w-4 h-7 rounded-[8px] border border-white/30 relative">
            <div className="w-0.5 h-1.5 bg-sky-400 rounded-[1px] absolute top-1 left-1/2 -translate-x-1/2 animate-[scrollMouse_1.5s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}