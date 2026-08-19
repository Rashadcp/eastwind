"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

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
  solutions?: { name: string; href: string }[];
  num?: string;
  accent?: string;
  icon?: React.ReactNode;
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

const getRgbFromHex = (hex: string) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

interface InteractivePortfolioSectionProps<T extends PortfolioItem = PortfolioItem> {
  sectionId: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionDesc: string;
  items: T[];
  backgroundColor?: string;
  cta1Label?: string;
  cta1OnClick?: (item: T) => void;
  cta2Label?: string;
  cta2OnClick?: (item: T) => void;
  renderVisual?: (
    item: T,
    tone: { base: string; accent: string; soft: string },
    state: {
      activeId: string;
      setActiveId: (id: string) => void;
      items: T[];
    }
  ) => React.ReactNode;
  renderSolutions?: (item: T) => React.ReactNode;
  hideSidebar?: boolean;
  isFullHeight?: boolean;
  hideOverview?: boolean;
  isDark?: boolean;
  topTabControl?: React.ReactNode;
  customContent?: React.ReactNode;
}

export default function InteractivePortfolioSection<T extends PortfolioItem = PortfolioItem>({
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
  renderSolutions,
  hideSidebar = false,
  isFullHeight = false,
  hideOverview = false,
  isDark = false,
  topTabControl,
  customContent,
}: InteractivePortfolioSectionProps<T>) {
  const [activeId, setActiveId] = useState(items[0]?.id || "");
  const activeProduct = items.find((product) => product.id === activeId) || items[0];

  if (!activeProduct) return null;

  const activeTone = toneStyles[activeProduct.imageTone] || toneStyles.blue;
  const hasSidebar = !hideSidebar;

  return (
    <section
      id={sectionId}
      className={`relative z-10 w-full border-t border-b ${
        isDark ? "border-white/10" : "border-black/5"
      } overflow-x-clip ${
        isFullHeight
          ? "lg:h-screen lg:min-h-screen lg:max-h-screen flex flex-col py-10 max-lg:py-20 max-lg:h-auto"
          : "py-16"
      }`}
      style={{
        "--active-base": activeTone.base,
        "--active-accent": activeTone.accent,
        "--active-soft": activeTone.soft,
        "--active-accent-rgb": getRgbFromHex(activeTone.base),
        backgroundColor: backgroundColor,
      } as React.CSSProperties}
    >
      {/* Dynamic Ambient Background Glows behind the glass panels */}
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none transition-all duration-700" style={{ backgroundColor: activeTone.base }} />
      <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] rounded-full blur-[120px] opacity-[0.04] pointer-events-none transition-all duration-700" style={{ backgroundColor: activeTone.accent }} />

      <div className={`max-w-[1400px] mx-auto px-10 max-sm:px-5 w-full relative z-10 ${
        isFullHeight ? "flex flex-col flex-grow overflow-hidden" : ""
      }`}>
        {/* Header Block */}
        <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0 ${isFullHeight ? "mb-10" : "mb-14"}`}>
          <div className="max-w-[780px]">
            <span className="block mb-3.5 text-[var(--active-base)] uppercase font-mono text-[0.75rem] font-bold tracking-widest">
              {sectionLabel}
            </span>
            <h2 className={`text-[3rem] max-md:text-[2.2rem] mb-5 uppercase font-extrabold tracking-tight leading-none ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              {sectionTitle}
            </h2>
            <p className={`text-[1.08rem] leading-relaxed m-0 font-medium ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}>
              {sectionDesc}
            </p>
          </div>
          {topTabControl && (
            <div className="flex shrink-0 max-lg:w-full max-lg:justify-center">
              {topTabControl}
            </div>
          )}
        </div>

        {customContent ? (
          customContent
        ) : hasSidebar ? (
          /* Standard 2-Column Sidebar tabs layout */
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,0.3fr)_minmax(0,0.7fr)] gap-8.5 items-start">
            {/* Sidebar Selector buttons */}
            <aside
              className="portfolio-selector spatial-panel p-4 sticky top-28 z-10 max-lg:static max-lg:grid max-lg:grid-cols-2 max-lg:gap-2.5 max-sm:grid-cols-1 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin"
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
                        ? "border border-slate-200 bg-white/70 shadow-sm translate-y-0"
                        : "border border-transparent bg-transparent hover:bg-slate-100/50 hover:-translate-y-[1px]"
                    }`}
                    style={{
                      "--btn-border": tone.base,
                      "--btn-soft": tone.soft,
                    } as React.CSSProperties}
                    aria-pressed={isActive}
                  >
                    <span>
                      <span className={`block text-[0.92rem] font-extrabold tracking-normal ${
                        isActive ? "text-slate-900 font-extrabold" : "text-slate-600"
                      }`}>
                        {product.name}
                      </span>
                      <span className={`block mt-1.25 text-[0.72rem] font-bold ${
                        isActive ? "text-[var(--btn-border)] font-bold" : "text-slate-400"
                      }`}>
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
            <div className="spatial-panel overflow-hidden">
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
                    <div className="product-visual min-h-[320px] max-sm:min-h-[250px] rounded-[20px] border border-black/5 bg-gradient-to-br from-white/20 via-transparent to-slate-200/20 mb-8.5 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-7 border border-slate-200/50 rounded-2xl" />
                      <div className="product-visual-device w-[min(520px,78%)] max-sm:w-[82%] min-h-[190px] max-sm:min-h-[160px] rounded-2xl bg-white/60 border border-slate-200 shadow-md relative p-7 max-sm:p-5.5">
                        <div className="flex gap-2.5 mb-6">
                          {[0, 1, 2].map((item) => (
                            <span
                              key={item}
                              className={`w-3 h-3 rounded-full ${
                                item === 0 ? "bg-[var(--active-base)]" : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-[1fr_0.72fr] gap-5 items-end">
                          <div>
                            <div className="h-4 w-[68%] rounded-full bg-[var(--active-base)] mb-3.5" />
                            <div className="h-2.5 w-[88%] rounded-full bg-slate-100 mb-2.5" />
                            <div className="h-2.5 w-[58%] rounded-full bg-slate-50" />
                          </div>
                          <div className="h-24 rounded-xl border border-[var(--active-accent)]/40 bg-[var(--active-soft)]/20 grid grid-cols-3 gap-2 p-3.5 items-end">
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
                            className="min-h-[74px] flex items-center gap-3 p-4 border border-slate-200/60 rounded-2xl bg-white/40 text-slate-700 text-[0.9rem] font-bold"
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
                              className="inline-flex items-center min-h-[34px] px-3.25 rounded-full bg-white/40 border border-slate-200/60 text-slate-700 text-[0.78rem] font-extrabold"
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
                              className="p-4.5 rounded-2xl border border-slate-200/60 bg-white/40 shadow-sm"
                            >
                              <div className="text-[1.55rem] text-[var(--active-base)] font-extrabold leading-none">
                                {benefit.value}
                              </div>
                              <div className="mt-1.75 text-slate-500 text-[0.82rem] font-bold">
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
                            className="min-h-[48px] px-5 border border-slate-200 rounded-full bg-slate-100/80 text-slate-800 text-[0.9rem] font-extrabold cursor-pointer hover:bg-slate-200/80 active:scale-98 transition-all"
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
          <div className={`grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-stretch w-full ${
            isFullHeight ? "flex-grow min-h-0" : ""
          }`}>
            {/* Mobile Selector Accordion: shown only when hideSidebar is true and screen is mobile/tablet (< lg) */}
            <div className="lg:hidden w-full flex flex-col gap-4">
              {items.map((product) => {
                const isActive = product.id === activeId;
                const tone = toneStyles[product.imageTone] || toneStyles.blue;
                const indIcon = product.icon;
                const indAccent = product.accent || tone.base;
                const indSoft = tone.soft;

                return (
                  <div
                    key={product.id}
                    className={`${
                      isDark ? "spatial-panel" : "bg-[#f2f4f2] border border-[#e2e6e3] rounded-2xl shadow-3xs"
                    } overflow-hidden transition-all duration-300 ${
                      isActive ? "border-slate-350 shadow-md scale-[1.01]" : "border-slate-200/40"
                    }`}
                    style={{
                      "--active-base": indAccent,
                      "--active-accent": tone.accent,
                      "--active-soft": indSoft,
                      "--active-accent-rgb": getRgbFromHex(indAccent),
                      background: isDark
                        ? (isActive 
                            ? `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, ${indAccent}08 100%)` 
                            : "rgba(255, 255, 255, 0.45)")
                        : undefined,
                    } as React.CSSProperties}
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => setActiveId(isActive ? "" : product.id)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors duration-200 focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isActive
                              ? "bg-white shadow-sm"
                              : "bg-slate-200/40 text-slate-500"
                          }`}
                          style={{ color: isActive ? indAccent : undefined }}
                        >
                          {indIcon}
                        </span>
                        <div>
                          <h3 className="text-[1.05rem] text-slate-900 font-extrabold tracking-tight uppercase leading-tight m-0">
                            {product.name}
                          </h3>
                          <span className={`block text-[0.68rem] font-bold tracking-wide mt-1 transition-colors duration-200 ${
                            isActive ? "text-[var(--active-base)]" : "text-slate-400"
                          }`}>
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Expand / Collapse Chevron */}
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0 ${
                        isActive
                          ? "border-[var(--active-base)] bg-[var(--active-base)] text-white rotate-180"
                          : "border-slate-300 bg-transparent text-slate-400"
                      }`}
                      style={{
                        borderColor: isActive ? indAccent : undefined,
                        backgroundColor: isActive ? indAccent : undefined,
                      }}
                      >
                        <svg
                          className="w-3.5 h-3.5 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>

                    {/* Accordion Body (Expanded Content) */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden border-t border-slate-200/40"
                        >
                          <div className="p-6 flex flex-col gap-6">
                            {/* Overview */}
                            {!hideOverview && (
                              <div>
                                <h4 className="text-[0.72rem] text-slate-400 font-mono tracking-widest uppercase mb-2">
                                  Overview
                                </h4>
                                {product.overview.map((paragraph) => (
                                  <p key={paragraph} className="text-[0.88rem] text-slate-600 leading-relaxed mb-3 last:mb-0">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Custom Solutions or Key Features */}
                            {product.solutions ? (
                              <div>
                                <h4 className="text-[0.72rem] text-slate-400 font-mono tracking-widest uppercase mb-3 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-[var(--active-base)] rounded-full shrink-0" />
                                  Tailored Operations & Solutions
                                </h4>
                                {renderSolutions ? (
                                  renderSolutions(product)
                                ) : (
                                  <div className="grid grid-cols-1 gap-2.5">
                                    {product.solutions.map((sol, idx) => (
                                      <Link
                                        key={sol.name}
                                        href={sol.href}
                                        className="premium-solution-tile group cursor-pointer"
                                      >
                                        <div className="flex items-center gap-3">
                                          <span className="font-mono text-[0.75rem] font-extrabold text-[var(--active-base)]/50 group-hover:text-[var(--active-base)] transition-colors duration-200">
                                            {(idx + 1).toString().padStart(2, '0')}
                                          </span>
                                          <span className="text-[0.84rem] font-bold text-slate-800 group-hover:text-slate-950 transition-colors duration-200">
                                            {sol.name}
                                          </span>
                                        </div>
                                        <span className="premium-solution-tile-arrow">
                                          <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                          </svg>
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <h4 className="text-[0.72rem] text-slate-400 font-mono tracking-widest uppercase mb-2.5">
                                  Key Features
                                </h4>
                                <div className="flex flex-col gap-2">
                                  {product.features.map((feature) => (
                                    <div
                                      key={feature}
                                      className="flex items-center gap-2.5 text-slate-600 font-semibold"
                                    >
                                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--active-soft)] text-[var(--active-base)] text-[0.72rem] shrink-0 font-bold">✓</span>
                                      <span className="text-[0.82rem]">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Divider line */}
                            <div className="border-t border-slate-200/40 my-1" />

                            {/* Applications & Benefits Row */}
                            {!product.solutions && (
                              <div className="grid grid-cols-2 gap-4">
                                {/* Applications */}
                                <div>
                                  <h4 className="text-[0.72rem] text-slate-400 font-mono tracking-widest uppercase mb-2">
                                    Applications
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {product.applications.map((application) => (
                                      <span
                                        key={application}
                                        className="inline-flex items-center rounded bg-white/40 border border-slate-200/60 text-slate-700 font-extrabold min-h-[24px] px-2.5 text-[0.66rem]"
                                      >
                                        {application}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Business Benefits */}
                                <div>
                                  <h4 className="text-[0.72rem] text-slate-400 font-mono tracking-widest uppercase mb-2">
                                    Business Benefits
                                  </h4>
                                  <div className="grid grid-cols-1">
                                    {product.benefits.slice(0, 1).map((benefit) => (
                                      <div
                                        key={`${benefit.value}-${benefit.label}`}
                                        className="flex items-baseline gap-2"
                                      >
                                        <span className="text-[var(--active-base)] font-extrabold leading-none text-[1.4rem]" style={{ color: indAccent }}>
                                          {benefit.value}
                                        </span>
                                        <span className="text-slate-500 font-semibold text-[0.68rem] leading-tight">
                                          {benefit.label}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="portfolio-actions flex gap-3 flex-wrap mt-2">
                              {cta1OnClick && (
                                <button
                                  type="button"
                                  onClick={() => cta1OnClick(product)}
                                  className="min-h-[40px] px-5 border border-transparent rounded-full text-white text-[0.82rem] font-extrabold cursor-pointer shadow-md hover:brightness-110 active:scale-98 transition-all"
                                  style={{ backgroundColor: indAccent }}
                                >
                                  {cta1Label}
                                </button>
                              )}
                              {cta2OnClick && (
                                <button
                                  type="button"
                                  onClick={() => cta2OnClick(product)}
                                  className="min-h-[40px] px-5 border border-slate-200 rounded-full bg-slate-100/80 text-slate-800 text-[0.82rem] font-extrabold cursor-pointer hover:bg-slate-200/80 active:scale-98 transition-all"
                                >
                                  {cta2Label}
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Left Column: Custom Visual (SVG) wrapped in spatial panel (desktop only) */}
            <div className={`hidden lg:flex ${
              isDark ? "spatial-panel" : "bg-[#f2f4f2] border border-[#e2e6e3] rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.04)]"
            } p-8 max-sm:p-4 w-full flex-col justify-center items-stretch ${
              isFullHeight ? "min-h-0" : ""
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

            {/* Right Column: Details Panel wrapped in spatial panel (desktop only) */}
            <div className={`hidden lg:flex ${
              isDark ? "spatial-panel" : "bg-[#f2f4f2] border border-[#e2e6e3] rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.04)]"
            } p-9 max-sm:p-6 flex-col justify-between overflow-y-auto ${
              isFullHeight ? "h-full min-h-0" : ""
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
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--active-soft)] border border-[var(--active-accent)]/35 text-[var(--active-base)] text-[0.72rem] font-extrabold tracking-wider uppercase mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--active-base)] animate-pulse shrink-0" />
                        {activeProduct.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Stack */}
                  <div className={`portfolio-content-grid flex flex-col justify-between flex-grow ${
                    isFullHeight ? "gap-3" : "gap-4"
                  }`}>
                    {/* Section 1: Overview & Solutions/Features */}
                    <div className={`flex flex-col ${isFullHeight ? "gap-2.5" : "gap-4"}`}>
                      {/* Overview */}
                      {!hideOverview && (
                        <div>
                          <h4 className={`text-slate-500 font-mono tracking-widest uppercase m-0 ${isFullHeight ? "text-[0.72rem] mb-1" : "text-[0.8rem] mb-2.5"}`}>
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
                      )}

                      {activeProduct.solutions ? (
                        /* Solutions List Grid */
                        <div>
                          <h4 className={`text-slate-500 font-mono text-[0.72rem] tracking-widest uppercase m-0 flex items-center gap-2 ${isFullHeight ? "mb-2" : "mb-3.5"}`}>
                            <span className="w-1.5 h-1.5 bg-[var(--active-base)] rounded-sm" />
                            Tailored Operations & Solutions
                          </h4>
                          {renderSolutions ? (
                            renderSolutions(activeProduct)
                          ) : (
                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                               {activeProduct.solutions.map((sol, idx) => (
                                <Link
                                  key={sol.name}
                                  href={sol.href}
                                  className="premium-solution-tile group cursor-pointer"
                                >
                                  <div className="flex items-center gap-3.5">
                                    <span className="font-mono text-[0.75rem] font-extrabold text-[var(--active-base)]/50 group-hover:text-[var(--active-base)] transition-colors duration-200">
                                      {(idx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-[0.88rem] font-bold text-slate-800 group-hover:text-slate-950 transition-colors duration-200 leading-tight">
                                      {sol.name}
                                    </span>
                                  </div>
                                  <span className="premium-solution-tile-arrow">
                                    <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Key Features */
                        <div>
                          <h4 className={`text-slate-500 font-mono tracking-widest uppercase m-0 ${isFullHeight ? "text-[0.72rem] mb-1.5" : "text-[0.8rem] mb-2.5"}`}>
                            Key Features
                          </h4>
                          <div className={`feature-grid ${
                            isFullHeight ? "flex flex-col gap-2" : "grid grid-cols-1 gap-2.5"
                          }`}>
                            {activeProduct.features.map((feature) => (
                              <div
                                key={feature}
                                className="flex items-center gap-2.5 text-slate-600 font-semibold"
                                >
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--active-soft)] text-[var(--active-base)] text-[0.72rem] shrink-0 font-bold">✓</span>
                                <span className={isFullHeight ? "text-[0.82rem]" : "text-[0.88rem]"}>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 2: Applications, Benefits & Actions */}
                    <div className={`flex flex-col ${isFullHeight ? "pt-2.5 border-t border-black/5 gap-3" : "border-t border-black/10 pt-4 gap-3.5"}`}>
                      {!activeProduct.solutions && (
                        /* Applications & Benefits Row */
                        <div className={`grid ${isFullHeight ? "grid-cols-2 gap-4" : "grid-cols-1 gap-3.5"} mb-2`}>
                          {/* Applications */}
                          <div>
                            <h4 className={`text-slate-500 font-mono tracking-widest uppercase m-0 ${isFullHeight ? "text-[0.72rem] mb-1.5" : "text-[0.8rem] mb-2.5"}`}>
                              Applications
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {activeProduct.applications.map((application) => (
                                <span
                                  key={application}
                                  className={`inline-flex items-center rounded bg-white/40 border border-slate-200/60 text-slate-700 font-extrabold ${
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
                            <h4 className={`text-slate-500 font-mono tracking-widest uppercase m-0 ${isFullHeight ? "text-[0.72rem] mb-1.5" : "text-[0.8rem] mb-2.5"}`}>
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
                      )}

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
                            className="min-h-[40px] px-5 border border-slate-200 rounded-full bg-slate-100/80 text-slate-800 text-[0.85rem] font-extrabold cursor-pointer hover:bg-slate-200/80 active:scale-98 transition-all"
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
