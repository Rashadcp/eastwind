// src/components/Hero.tsx
"use client";

import { useEffect, useRef, useState } from "react";

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

  // Dynamic Captions State
  const [slide1Tagline, setSlide1Tagline] = useState<string>("Safety Arabia Infrastructure");
  const [slide1Title, setSlide1Title] = useState<string>("Fusing Industry AI & Critical Safety");
  const [slide1Desc, setSlide1Desc] = useState<string>("We engineer intelligent, cyber-physical safety systems. From explosion-proof IIoT mobility to predictive threat analytics, we safeguard heavy industrial infrastructure.");
  const [slide1Btn1Text, setSlide1Btn1Text] = useState<string>("Operations Center");
  const [slide1Btn2Text, setSlide1Btn2Text] = useState<string>("Our Capabilities");

  const [slide2Tagline, setSlide2Tagline] = useState<string>("IIoT Data Telemetry Loops");
  const [slide2Title, setSlide2Title] = useState<string>("Real-time Edge Acquisition");
  const [slide2Desc, setSlide2Desc] = useState<string>("Deploying intrinsically safe wireless sensor webs inside explosive gas zones. Fusing critical network monitoring architecture protocols into a unified digital operations environment.");
  const [slide2Btn1Text, setSlide2Btn1Text] = useState<string>("Explore MIMES Wireless");

  useEffect(() => {
    async function loadHeroData() {
      try {
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
      } catch (err) {
        console.error("Hero data fetch error:", err);
      }
    }
    loadHeroData();
  }, []);

  useEffect(() => {
    const imgArray: HTMLImageElement[] = [];
    const preloadImages = async () => {
      const firstImg = new Image();
      firstImg.src = getFrameUrl(0);
      imgArray[0] = firstImg;
      setImages([firstImg]);

      const promises = Array.from({ length: TOTAL_FRAMES - 1 }).map((_, index) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = getFrameUrl(index + 1);
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
        });
      });

      const loadedImages = await Promise.all(promises);
      setImages([firstImg, ...loadedImages]);
    };
    preloadImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = (progress: number) => {
      // 1. Slide 1 (0% to 35%): Show fixed banner image
      // 2. Transition (35% to 50%): Cross-fade fixed banner to 3D canvas animation
      // 3. Slide 2 (35% to 100%): Scrub 85 frame 3D animation
      if (bannerImgRef.current) {
        const bannerOpacity = progress <= 0.35 ? 1 : Math.max(0, 1 - (progress - 0.35) / 0.15);
        bannerImgRef.current.style.opacity = String(bannerOpacity);
      }

      if (canvasRef.current) {
        const canvasOpacity = progress > 0.35 ? Math.min(1, (progress - 0.35) / 0.15) : 0;
        canvasRef.current.style.opacity = String(canvasOpacity);
      }

      if (progress > 0.30) {
        const slide2Progress = Math.min(1, (progress - 0.30) / 0.65);
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(slide2Progress * TOTAL_FRAMES)
        );
        
        const img = images[frameIndex] || images[0];
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
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollHeight = container.scrollHeight - window.innerHeight;
      
      let progress = -rect.top / scrollHeight;
      progress = Math.max(0, Math.min(1, progress));
      
      drawFrame(progress);
      updateDOM(progress);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
            src="/hero section.png"
            alt="Safety Arabia Hero Banner"
            className="w-full h-full object-cover object-right-top sm:object-right"
          />
        </div>

        {/* Slide 2 Canvas 3D Frame Animation */}
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full object-cover z-10 bg-black opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 z-15 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(to bottom, rgba(0, 240, 255, 0.01) 0px, rgba(0, 240, 255, 0.01) 1px, transparent 1px, transparent 4px)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090c]/70 via-[#08090c]/20 to-[#08090c]/75 z-20 pointer-events-none" />

        <div className="max-w-[1240px] w-full mx-auto h-full px-6 relative z-30 flex items-center">
          <div className="relative h-[70vh] w-full max-w-[680px] flex flex-col justify-center">
            
            <div ref={frame1Ref} className="absolute top-1/2 left-0 w-full" style={{ opacity: 1, transform: "translate3d(0, -50%, 0)", pointerEvents: "auto" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[0.7rem] font-mono font-bold uppercase tracking-widest mb-6">{slide1Tagline}</div>
              <h1 className="text-[3.5rem] max-md:text-[2.8rem] max-sm:text-[2.1rem] font-bold text-white mb-6 leading-none uppercase tracking-tight">{slide1Title}</h1>
              <p className="text-[1.05rem] text-slate-200 mb-10 max-w-[540px] leading-relaxed">{slide1Desc}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#solutions" className="btn-primary">{slide1Btn1Text}</a>
                <a href="#solutions" className="btn-secondary text-white border-white/40 hover:border-white hover:bg-white/10">{slide1Btn2Text}</a>
              </div>
            </div>

            <div ref={frame2Ref} className="absolute top-1/2 left-0 w-full" style={{ opacity: 0, transform: "translate3d(0, -50%, 0)", pointerEvents: "none" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[0.7rem] font-mono font-bold uppercase tracking-widest mb-6">{slide2Tagline}</div>
              <h2 className="text-[3.5rem] max-md:text-[2.6rem] max-sm:text-[2.0rem] font-bold text-white mb-6 leading-none uppercase tracking-tight">{slide2Title}</h2>
              <p className="text-[1.05rem] text-slate-200 mb-10 max-w-[540px] leading-relaxed">{slide2Desc}</p>
              <a href="#solutions" className="btn-primary">{slide2Btn1Text}</a>
            </div>

          </div>
        </div>

        <div ref={indicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40 transition-opacity duration-300 pointer-events-none">
          <span className="font-mono text-[0.65rem] uppercase text-white/60 tracking-widest">Scroll to explore model</span>
          <div className="w-5 h-9 rounded-[10px] border-2 border-white/40 relative">
            <div className="w-1 h-2 bg-sky-400 rounded-[2px] absolute top-1.5 left-1/2 -translate-x-1/2 animate-[scrollMouse_1.5s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}