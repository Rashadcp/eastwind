"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 113;

// Helper to map index to WEBP filenames, skipping the gap between 81 and 89
const getFrameUrl = (index: number) => {
  let fileNum = index + 1;
  if (fileNum >= 82) {
    fileNum = fileNum + 7; // Skip missing frames 82-88
  }
  const padNum = String(fileNum).padStart(5, "0");
  return `/hero-frames/${padNum}.webp`;
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame1Ref = useRef<HTMLDivElement>(null);
  const frame2Ref = useRef<HTMLDivElement>(null);
  const frame3Ref = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // Preload images
  useEffect(() => {
    const imgArray: HTMLImageElement[] = [];

    const preloadImages = async () => {
      const decodeImage = async (img: HTMLImageElement) => {
        if (typeof img.decode === "function") {
          try {
            await img.decode();
          } catch (e) {
            // Ignore decoding failures
          }
        }
      };

      // First, load frame 0 to render instantly
      const firstImg = new Image();
      firstImg.src = getFrameUrl(0);
      await new Promise<void>((resolve) => {
        firstImg.onload = async () => {
          await decodeImage(firstImg);
          resolve();
        };
        firstImg.onerror = () => resolve();
      });
      imgArray[0] = firstImg;
      setImages([firstImg]);

      // Then load all remaining frames in the background
      const promises = Array.from({ length: TOTAL_FRAMES }).map((_, index) => {
        if (index === 0) return Promise.resolve(firstImg);
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = getFrameUrl(index);
          img.onload = async () => {
            await decodeImage(img);
            resolve(img);
          };
          img.onerror = () => resolve(img);
          imgArray[index] = img;
        });
      });

      const allImgs = await Promise.all(promises);
      setImages(allImgs);
    };

    preloadImages();
  }, []);

  // Handle drawing frames on scroll and resizing with smooth, frame-rate independent lerp interpolation
  useEffect(() => {
    if (images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetProgressRef = { current: 0 };
    const currentProgressRef = { current: 0 };
    let animationFrameId: number | null = null;
    let isAnimating = false;
    let lastTime = performance.now();

    const drawFrame = (progress: number) => {
      // Map progress from [0, 0.75] to [0, 1] for animation frames, and clamp at 1 for progress > 0.75
      const animProgress = Math.min(1, progress / 0.75);
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(animProgress * TOTAL_FRAMES)
      );
      
      const img = images[frameIndex] || images[0];
      if (!img || !img.complete) return;

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
    };

    const updateDOM = (progress: number) => {
      // Frame 1: Hero Pitch (Scroll 0% to 25%)
      if (frame1Ref.current) {
        const opacity = progress <= 0.25 ? 1 - (progress / 0.25) : 0;
        frame1Ref.current.style.opacity = String(opacity);
        frame1Ref.current.style.pointerEvents = progress <= 0.2 ? "auto" : "none";
        
        // GPU-accelerated translation parallax
        const yOffset = progress * 80;
        frame1Ref.current.style.transform = `translate3d(0, calc(-50% - ${yOffset}px), 0)`;
      }

      // Frame 2: Wireless & Digital (Scroll 25% to 55%)
      if (frame2Ref.current) {
        const opacity = progress > 0.25 && progress <= 0.55
          ? Math.min(1, (progress - 0.25) / 0.1) * (1 - (progress - 0.45) / 0.1)
          : 0;
        frame2Ref.current.style.opacity = String(opacity);
        frame2Ref.current.style.pointerEvents = progress > 0.3 && progress <= 0.5 ? "auto" : "none";
        
        // GPU-accelerated translation parallax centered around progress 0.4
        const yOffset = (progress - 0.4) * 80;
        frame2Ref.current.style.transform = `translate3d(0, calc(-50% - ${yOffset}px), 0)`;
      }

      // Frame 3: Heavy Fire Engineering & AI (Scroll 55% to 100%)
      if (frame3Ref.current) {
        const opacity = progress > 0.55 ? Math.min(1, (progress - 0.55) / 0.1) : 0;
        frame3Ref.current.style.opacity = String(opacity);
        frame3Ref.current.style.pointerEvents = progress > 0.6 ? "auto" : "none";
        
        // GPU-accelerated translation parallax centered around progress 0.75
        const yOffset = (progress - 0.75) * 80;
        frame3Ref.current.style.transform = `translate3d(0, calc(-50% - ${yOffset}px), 0)`;
      }

      // Scroll Indicator
      if (indicatorRef.current) {
        const opacity = Math.max(0, 1 - progress * 4); // Fade out quickly on scroll
        indicatorRef.current.style.opacity = String(opacity);
      }
    };

    const renderLoop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000); // Clamp dt to avoid huge jumps
      lastTime = time;

      const diff = targetProgressRef.current - currentProgressRef.current;
      
      if (Math.abs(diff) > 0.0001) {
        // Control constant for frame-rate independent lerp (lambda = 8 for premium, smooth deceleration)
        const lambda = 8;
        const lerpFactor = 1 - Math.exp(-lambda * dt);
        currentProgressRef.current += diff * lerpFactor;
        
        drawFrame(currentProgressRef.current);
        updateDOM(currentProgressRef.current);
        
        animationFrameId = requestAnimationFrame(renderLoop);
      } else {
        currentProgressRef.current = targetProgressRef.current;
        drawFrame(currentProgressRef.current);
        updateDOM(currentProgressRef.current);
        isAnimating = false;
        animationFrameId = null;
      }
    };

    const startAnimationLoop = () => {
      if (!isAnimating) {
        isAnimating = true;
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Ensure we redraw/update on resize
      drawFrame(currentProgressRef.current);
      updateDOM(currentProgressRef.current);
    };

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollHeight = container.scrollHeight - window.innerHeight;
      
      let progress = -rect.top / scrollHeight;
      progress = Math.max(0, Math.min(1, progress));
      
      targetProgressRef.current = progress;
      startAnimationLoop();
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", handleScroll);
    
    // Initial resize and draw
    resizeCanvas();
    
    // Perform initial DOM placement
    drawFrame(currentProgressRef.current);
    updateDOM(currentProgressRef.current);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      className="h-[350vh] relative bg-bg-base"
      id="hero"
    >
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 left-0 w-screen h-screen overflow-hidden">
        {/* The Scroll-Scrub Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
        />

        {/* Scanline overlay (replaces high-overhead canvas-based loop drawing) */}
        <div 
          className="absolute inset-0 z-15 pointer-events-none" 
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, rgba(0, 240, 255, 0.02) 0px, rgba(0, 240, 255, 0.02) 1px, transparent 1px, transparent 4px)",
          }}
        />

        {/* Cinematic dark gradients on top of the canvas to blend with dark frames */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090c]/60 via-[#08090c]/25 to-[#08090c]/70 z-20 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto h-full px-10 max-sm:px-5 relative z-30 flex items-center">
          {/* Left Side: Typography & Storytelling */}
          <div className="relative h-[70vh] w-full max-w-[680px] flex flex-col justify-center">
            {/* Frame 1: Hero Pitch (Scroll 0% to 25%) */}
            <div
              ref={frame1Ref}
              className="absolute top-1/2 left-0 w-full"
              style={{
                opacity: 1,
                transform: "translate3d(0, -50%, 0)",
                pointerEvents: "auto",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[0.7rem] font-mono font-bold uppercase tracking-widest mb-6">
                Safety Intelligence
              </div>

              <h1 className="text-[3.8rem] max-md:text-[2.8rem] max-sm:text-[2.1rem] font-bold text-white mb-6 leading-none uppercase tracking-tight">
                Fusing Industry <span className="text-red-500">AI</span> & Critical Safety
              </h1>

              <p className="text-[1.05rem] text-slate-200 mb-10 max-w-[540px] leading-relaxed">
                We engineer intelligent, cyber-physical safety systems. From explosion-proof IIoT mobility to predictive threat analytics, we safeguard heavy industrial infrastructure.
              </p>

              <div className="flex gap-4">
                <a href="#operational-impact" className="btn-primary">
                  Operations Center
                </a>
                <a href="#divisions" className="btn-secondary text-white border-white/40 hover:border-white hover:bg-white/10">
                  Our Capabilities
                </a>
              </div>
            </div>

            {/* Frame 2: Wireless & Digital (Scroll 25% to 55%) */}
            <div
              ref={frame2Ref}
              className="absolute top-1/2 left-0 w-full"
              style={{
                opacity: 0,
                transform: "translate3d(0, -50%, 0)",
                pointerEvents: "none",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[0.7rem] font-mono font-bold uppercase tracking-widest mb-6">
                IIoT Data Telemetry
              </div>

              <h2 className="text-[3.5rem] max-md:text-[2.6rem] max-sm:text-[2.0rem] font-bold text-white mb-6 leading-none uppercase tracking-tight">
                Real-time Edge Acquisition
              </h2>

              <p className="text-[1.05rem] text-slate-200 mb-10 max-w-[540px] leading-relaxed">
                Deploying intrinsically safe wireless sensor webs inside explosive gas zones. Fusing Honeywell and FreeWave hardware protocols into a unified digital operations environment.
              </p>

              <a href="#ecosystem" className="btn-primary">
                Explore MIMES Wireless
              </a>
            </div>

            {/* Frame 3: Heavy Fire Engineering & AI (Scroll 55% to 100%) */}
            <div
              ref={frame3Ref}
              className="absolute top-1/2 left-0 w-full"
              style={{
                opacity: 0,
                transform: "translate3d(0, -50%, 0)",
                pointerEvents: "none",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[0.7rem] font-mono font-bold uppercase tracking-widest mb-6">
                Safety Engineering
              </div>

              <h2 className="text-[3.5rem] max-md:text-[2.6rem] max-sm:text-[2.0rem] font-bold text-white mb-6 leading-none uppercase tracking-tight">
                Predictive AI & Heavy Rescue
              </h2>

              <p className="text-[1.05rem] text-slate-200 mb-10 max-w-[540px] leading-relaxed">
                Combining high-pressure compressed air foam (CAFS) systems, Rosenbauer vehicle engineering, and AI predictive maintenance to respond to events before they compromise operations.
              </p>

              <a href="#solutions" className="btn-primary">
                View Industry Solutions
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={indicatorRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: 1,
          }}
        >
          <span className="font-mono text-[0.65rem] uppercase text-white/60 tracking-widest">
            Scroll to scrub model
          </span>
          <div className="w-5 h-9 rounded-[10px] border-2 border-white/40 relative">
            <div className="w-1 h-2 bg-sky-400 rounded-[2px] absolute top-1.5 left-1/2 -translate-x-1/2 animate-[scrollMouse_1.5s_infinite]" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scrollMouse {
          0% { top: 6px; opacity: 1; }
          50% { top: 16px; opacity: 0; }
          100% { top: 6px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
