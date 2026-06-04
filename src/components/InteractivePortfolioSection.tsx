"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface BenefitItem {
  value: string;
  label: string;
}

export interface PortfolioItem {
  id: string;
  name: string;
  category: string;
  imageTone: "blue" | "steel" | "green" | "red" | "amber" | "slate" | "orange";
  overview: string[];
  features: string[];
  applications: string[];
  benefits: BenefitItem[];
}

export const toneStyles: Record<
  PortfolioItem["imageTone"],
  { base: string; accent: string; soft: string }
> = {
  blue: { base: "#0f5f93", accent: "#38bdf8", soft: "#e0f2fe" },
  steel: { base: "#334155", accent: "#94a3b8", soft: "#e2e8f0" },
  green: { base: "#166534", accent: "#22c55e", soft: "#dcfce7" },
  red: { base: "#991b1b", accent: "#ef4444", soft: "#fee2e2" },
  amber: { base: "#92400e", accent: "#f59e0b", soft: "#fef3c7" },
  slate: { base: "#1e293b", accent: "#64748b", soft: "#e2e8f0" },
  orange: { base: "#c2410c", accent: "#f97316", soft: "#ffedd5" },
};

interface InteractivePortfolioSectionProps {
  sectionId: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionDesc: string;
  items: PortfolioItem[];
  backgroundColor?: string;
  cta1Label?: string;
  cta1OnClick?: (item: PortfolioItem) => void;
  cta2Label?: string;
  cta2OnClick?: (item: PortfolioItem) => void;
  renderVisual?: (
    item: PortfolioItem,
    tone: { base: string; accent: string; soft: string },
    state: {
      activeId: string;
      setActiveId: (id: string) => void;
      items: PortfolioItem[];
    }
  ) => React.ReactNode;
  hideSidebar?: boolean;
  isFullHeight?: boolean;
}

export default function InteractivePortfolioSection({
  sectionId,
  sectionLabel,
  sectionTitle,
  sectionDesc,
  items,
  backgroundColor = "#F8FAFC",
  cta1Label = "Request Quote",
  cta1OnClick,
  cta2Label = "Talk To Expert",
  cta2OnClick,
  renderVisual,
  hideSidebar = false,
  isFullHeight = false,
}: InteractivePortfolioSectionProps) {
  const [activeId, setActiveId] = useState(items[0]?.id || "");
  const activeProduct = items.find((product) => product.id === activeId) || items[0];

  if (!activeProduct) return null;

  const activeTone = toneStyles[activeProduct.imageTone] || toneStyles.blue;
  const hasSidebar = !hideSidebar;

  return (
    <section
      id={sectionId}
      className={`relative z-10 w-full border-t border-b border-slate-200 overflow-hidden ${
        isFullHeight
          ? "lg:h-screen lg:min-h-screen lg:max-h-screen flex flex-col py-10 max-lg:py-20 max-lg:h-auto"
          : "py-16"
      }`}
      style={{
        backgroundColor,
        "--active-base": activeTone.base,
        "--active-accent": activeTone.accent,
        "--active-soft": activeTone.soft,
      } as React.CSSProperties}
    >
      <div className={`max-w-[1400px] mx-auto px-10 max-sm:px-5 w-full ${
        isFullHeight ? "flex flex-col flex-grow overflow-hidden" : ""
      }`}>
        {/* Header Block */}
        <div className={`max-w-[780px] shrink-0 ${isFullHeight ? "mb-10" : "mb-14"}`}>
          <span className="block mb-3.5 text-[#0F5F93] uppercase font-mono text-[0.75rem] font-bold tracking-widest">
            {sectionLabel}
          </span>
          <h2 className="text-[3rem] max-md:text-[2.2rem] text-slate-900 mb-5 uppercase font-extrabold tracking-tight leading-none">
            {sectionTitle}
          </h2>
          <p className="text-[1.08rem] text-slate-600 leading-relaxed m-0">
            {sectionDesc}
          </p>
        </div>

        {hasSidebar ? (
          /* Standard 2-Column Sidebar tabs layout */
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,0.3fr)_minmax(0,0.7fr)] gap-8.5 items-start">
            {/* Sidebar Selector buttons */}
            <aside
              className="portfolio-selector bg-white border border-slate-200 rounded-[20px] shadow-sm p-4 sticky top-24 z-10 max-lg:static max-lg:grid max-lg:grid-cols-2 max-lg:gap-2.5 max-sm:grid-cols-1"
              aria-label="Selection tabs"
            >
              {items.map((product) => {
                const isActive = product.id === activeId;
                const tone = toneStyles[product.imageTone] || toneStyles.blue;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveId(product.id)}
                    className={`portfolio-selector-button w-full min-h-[68px] flex items-center justify-between gap-3.5 p-[15px_16px] rounded-2xl cursor-pointer text-left transition-all duration-180 max-lg:mb-0 ${
                      isActive
                        ? "border border-[var(--btn-border)] bg-[var(--btn-soft)] shadow-sm translate-y-0"
                        : "border border-transparent bg-white hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-[1px]"
                    }`}
                    style={{
                      "--btn-border": tone.base,
                      "--btn-soft": tone.soft,
                    } as React.CSSProperties}
                    aria-pressed={isActive}
                  >
                    <span>
                      <span className="block text-[0.92rem] font-extrabold tracking-normal text-slate-900">
                        {product.name}
                      </span>
                      <span className="block mt-1.25 text-[0.72rem] text-slate-500 font-bold">
                        {product.category}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`w-2.5 h-2.5 rounded-full ${
                        isActive ? "bg-[var(--btn-base)]" : "bg-slate-300"
                      }`}
                      style={{
                        "--btn-base": tone.base,
                      } as React.CSSProperties}
                    />
                  </button>
                );
              })}
            </aside>

            {/* Details Card Panel */}
            <div className="bg-white border border-slate-200 rounded-[20px] shadow-md overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeProduct.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="p-10.5 max-sm:p-6"
                >
                  {/* Product Header */}
                  <div className="portfolio-panel-header flex justify-between items-start gap-6 mb-7.5 max-sm:flex-col">
                    <div>
                      <h3 className="text-[clamp(2.25rem,5vw,4.8rem)] leading-[0.94] text-slate-900 m-0 mb-4.5 font-extrabold tracking-normal uppercase">
                        {activeProduct.name}
                      </h3>
                      <span className="inline-flex items-center min-h-[34px] px-3.5 rounded-full bg-[var(--active-soft)] border border-[var(--active-accent)]/35 text-[var(--active-base)] text-[0.78rem] font-extrabold">
                        {activeProduct.category}
                      </span>
                    </div>
                  </div>

                  {/* Render Custom or Default Visual */}
                  {renderVisual ? (
                    renderVisual(activeProduct, activeTone, {
                      activeId,
                      setActiveId,
                      items,
                    })
                  ) : (
                    <div className="product-visual min-h-[320px] max-sm:min-h-[250px] rounded-[20px] border border-slate-200 bg-gradient-to-br from-[var(--active-soft)] via-white to-slate-100 mb-8.5 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-7 border border-slate-900/10 rounded-2xl" />
                      <div className="product-visual-device w-[min(520px,78%)] max-sm:w-[82%] min-h-[190px] max-sm:min-h-[160px] rounded-2xl bg-white border border-slate-300 shadow-lg relative p-7 max-sm:p-5.5">
                        <div className="flex gap-2.5 mb-6">
                          {[0, 1, 2].map((item) => (
                            <span
                              key={item}
                              className={`w-3 h-3 rounded-full ${
                                item === 0 ? "bg-[var(--active-base)]" : "bg-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-[1fr_0.72fr] gap-5 items-end">
                          <div>
                            <div className="h-4 w-[68%] rounded-full bg-[var(--active-base)] mb-3.5" />
                            <div className="h-2.5 w-[88%] rounded-full bg-slate-300 mb-2.5" />
                            <div className="h-2.5 w-[58%] rounded-full bg-slate-200" />
                          </div>
                          <div className="h-24 rounded-xl border border-[var(--active-accent)]/40 bg-[var(--active-soft)] grid grid-cols-3 gap-2 p-3.5 items-end">
                            {[44, 68, 88].map((height) => (
                              <span
                                key={height}
                                className="rounded-t-lg rounded-b-sm bg-[var(--active-base)]"
                                style={{ height: `${height}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Grid */}
                  <div className="portfolio-content-grid grid grid-cols-[1.2fr_0.8fr] gap-8.5 max-sm:grid-cols-1">
                    <div>
                      <h4 className="text-[1.05rem] text-slate-900 m-0 mb-3.5 font-extrabold">Overview</h4>
                      <div className="flex flex-col gap-3.5 mb-7.5">
                        {activeProduct.overview.map((paragraph) => (
                          <p key={paragraph} className="text-[0.98rem] text-slate-600 leading-relaxed m-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      <h4 className="text-[1.05rem] text-slate-900 m-0 mb-3.5 font-extrabold">Key Features</h4>
                      <div className="feature-grid grid grid-cols-2 max-sm:grid-cols-1 gap-3">
                        {activeProduct.features.map((feature) => (
                          <div
                            key={feature}
                            className="min-h-[74px] flex items-center gap-3 p-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 text-[0.9rem] font-bold"
                          >
                            <span className="text-[var(--active-base)] font-black">✓</span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-7">
                        <h4 className="text-[1.05rem] text-slate-900 m-0 mb-3.5 font-extrabold">Applications</h4>
                        <div className="flex flex-wrap gap-2.5">
                          {activeProduct.applications.map((application) => (
                            <span
                              key={application}
                              className="inline-flex items-center min-h-[34px] px-3.25 rounded-full bg-white border border-slate-300 text-slate-700 text-[0.78rem] font-extrabold"
                            >
                              {application}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-7.5">
                        <h4 className="text-[1.05rem] text-slate-900 m-0 mb-3.5 font-extrabold">Business Benefits</h4>
                        <div className="grid gap-3">
                          {activeProduct.benefits.map((benefit) => (
                            <div
                              key={`${benefit.value}-${benefit.label}`}
                              className="p-4.5 rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                              <div className="text-[1.55rem] text-[var(--active-base)] font-extrabold leading-none">
                                {benefit.value}
                              </div>
                              <div className="mt-1.75 text-slate-600 text-[0.82rem] font-bold">
                                {benefit.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="portfolio-actions flex gap-3 flex-wrap">
                        {cta1OnClick && (
                          <button
                            type="button"
                            onClick={() => cta1OnClick(activeProduct)}
                            className="min-h-[48px] px-5 border border-transparent rounded-full bg-[var(--active-base)] text-white text-[0.9rem] font-extrabold cursor-pointer shadow-md hover:brightness-110 active:scale-98 transition-all"
                          >
                            {cta1Label}
                          </button>
                        )}
                        {cta2OnClick && (
                          <button
                            type="button"
                            onClick={() => cta2OnClick(activeProduct)}
                            className="min-h-[48px] px-5 border border-slate-300 rounded-full bg-white text-slate-900 text-[0.9rem] font-extrabold cursor-pointer hover:bg-slate-50 active:scale-98 transition-all"
                          >
                            {cta2Label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* SVG / Graphic-Selector centered layout - OPEN FULL SCREEN LAYOUT */
          <div className={`grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center w-full ${
            isFullHeight ? "flex-grow min-h-0" : ""
          }`}>
            {/* Left Column: Custom Visual (SVG) */}
            <div className={`flex items-center justify-center ${
              isFullHeight ? "h-full min-h-0" : ""
            }`}>
              {renderVisual ? (
                renderVisual(activeProduct, activeTone, {
                  activeId,
                  setActiveId,
                  items,
                })
              ) : (
                null
              )}
            </div>

            {/* Right Column: Details Panel */}
            <div className={`flex flex-col justify-between ${
              isFullHeight ? "h-full min-h-0 overflow-y-auto" : ""
            }`}>
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeProduct.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="flex flex-col justify-between flex-grow"
                >
                  {/* Product Header */}
                  <div className={`portfolio-panel-header flex justify-between items-start gap-4 max-sm:flex-col ${
                    isFullHeight ? "mb-3" : "mb-4"
                  }`}>
                    <div>
                      <h3 className={`leading-[0.95] text-slate-900 m-0 font-extrabold tracking-normal uppercase ${
                        isFullHeight ? "text-[clamp(1.4rem,2.2vw,1.85rem)] mb-1.5" : "text-[clamp(2.1rem,4vw,3.2rem)] mb-4.5"
                      }`}>
                        {activeProduct.name}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--active-soft)] border border-[var(--active-accent)]/35 text-[var(--active-base)] text-[0.72rem] font-bold tracking-wide mt-0.5">
                        {activeProduct.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Stack */}
                  <div className={`portfolio-content-grid flex flex-col justify-between flex-grow ${
                    isFullHeight ? "gap-3" : "gap-4"
                  }`}>
                    {/* Section 1: Overview & Features */}
                    <div className={`flex flex-col ${isFullHeight ? "gap-2.5" : "gap-2.5"}`}>
                      {/* Overview */}
                      <div>
                        <h4 className={`text-slate-400 font-mono tracking-widest uppercase m-0 ${isFullHeight ? "text-[0.72rem] mb-1" : "text-[0.8rem] mb-2.5"}`}>
                          Overview
                        </h4>
                        <div className="flex flex-col gap-3.5">
                          {activeProduct.overview.map((paragraph) => (
                            <p key={paragraph} className={`text-slate-600 leading-relaxed m-0 ${
                              isFullHeight ? "text-[0.84rem]" : "text-[0.96rem]"
                            }`}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Key Features */}
                      <div>
                        <h4 className={`text-slate-400 font-mono tracking-widest uppercase m-0 ${isFullHeight ? "text-[0.72rem] mb-1.5" : "text-[0.8rem] mb-2.5"}`}>
                          Key Features
                        </h4>
                        <div className={`feature-grid ${
                          isFullHeight ? "flex flex-col gap-2" : "grid grid-cols-1 gap-2.5"
                        }`}>
                          {activeProduct.features.map((feature) => (
                            <div
                              key={feature}
                              className="flex items-center gap-2.5 text-slate-700 font-semibold"
                              >
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--active-soft)] text-[var(--active-base)] text-[0.72rem] shrink-0 font-bold">✓</span>
                              <span className={isFullHeight ? "text-[0.82rem]" : "text-[0.88rem]"}>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Applications, Benefits & Actions */}
                    <div className={`flex flex-col ${isFullHeight ? "pt-2.5 border-t border-slate-100 gap-3" : "border-t border-slate-100 pt-4 gap-3"}`}>
                      {/* Applications & Benefits Row */}
                      <div className={`grid ${isFullHeight ? "grid-cols-2 gap-4" : "grid-cols-1 gap-3.5"}`}>
                        {/* Applications */}
                        <div>
                          <h4 className={`text-slate-400 font-mono tracking-widest uppercase m-0 ${isFullHeight ? "text-[0.72rem] mb-1.5" : "text-[0.8rem] mb-2.5"}`}>
                            Applications
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {activeProduct.applications.map((application) => (
                              <span
                                key={application}
                                className={`inline-flex items-center rounded bg-slate-100 text-slate-700 font-extrabold ${
                                  isFullHeight ? "min-h-[24px] px-2.5 text-[0.66rem]" : "min-h-[28px] px-3 text-[0.72rem]"
                                }`}
                              >
                                {application}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Business Benefits */}
                        <div>
                          <h4 className={`text-slate-400 font-mono tracking-widest uppercase m-0 ${isFullHeight ? "text-[0.72rem] mb-1.5" : "text-[0.8rem] mb-2.5"}`}>
                            Business Benefits
                          </h4>
                          <div className="grid grid-cols-1">
                            {activeProduct.benefits.slice(0, 1).map((benefit) => (
                              <div
                                key={`${benefit.value}-${benefit.label}`}
                                className="flex items-baseline gap-2"
                              >
                                <span className={`text-[var(--active-base)] font-extrabold leading-none ${
                                  isFullHeight ? "text-[1.5rem]" : "text-[1.8rem]"
                                }`}>
                                  {benefit.value}
                                </span>
                                <span className={`text-slate-500 font-semibold ${
                                  isFullHeight ? "text-[0.7rem] leading-tight" : "text-[0.78rem]"
                                }`}>
                                  {benefit.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className={`portfolio-actions flex gap-3 flex-wrap ${isFullHeight ? "mt-0.5" : ""}`}>
                        {cta1OnClick && (
                          <button
                            type="button"
                            onClick={() => cta1OnClick(activeProduct)}
                            className="min-h-[40px] px-5 border border-transparent rounded-full bg-[var(--active-base)] text-white text-[0.85rem] font-extrabold cursor-pointer shadow-md hover:brightness-110 active:scale-98 transition-all"
                          >
                            {cta1Label}
                          </button>
                        )}
                        {cta2OnClick && (
                          <button
                            type="button"
                            onClick={() => cta2OnClick(activeProduct)}
                            className="min-h-[40px] px-5 border border-slate-300 rounded-full bg-white text-slate-900 text-[0.85rem] font-extrabold cursor-pointer hover:bg-slate-50 active:scale-98 transition-all"
                          >
                            {cta2Label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
