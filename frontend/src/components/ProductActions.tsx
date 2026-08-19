"use client";

import Link from "next/link";

interface ProductActionsProps {
  productTitle: string;
  accentColor: string;
  layout?: "hero" | "footer";
}

export default function ProductActions({ productTitle, accentColor, layout = "hero" }: ProductActionsProps) {
  const enquiryUrl = `/enquire?solution=${encodeURIComponent(productTitle)}`;

  return (
    <>
      {layout === "hero" ? (
        <div className="flex flex-wrap gap-4 max-sm:flex-col">
          <Link 
            href={enquiryUrl}
            className="btn-primary w-auto max-sm:w-full inline-flex items-center justify-center py-3 px-9 text-[0.8rem] font-semibold uppercase tracking-wider text-white border transition-all duration-200 rounded-full hover:-translate-y-[1px] cursor-pointer" 
            style={{ backgroundColor: accentColor, borderColor: accentColor }}
          >
            Request Technical Quote
          </Link>
          <a 
            href="#contact" 
            className="inline-flex items-center justify-center py-3 px-9 text-[0.8rem] font-semibold uppercase tracking-wider text-slate-700 bg-white/20 border border-slate-200 cursor-pointer transition-all duration-200 rounded-full hover:border-slate-400 hover:bg-slate-50 hover:-translate-y-[1px] w-auto max-sm:w-full"
          >
            Contact Sales
          </a>
        </div>
      ) : (
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            href={enquiryUrl}
            className="btn-primary inline-flex items-center justify-center py-3 px-9 text-[0.8rem] font-semibold uppercase tracking-wider text-white border transition-all duration-200 rounded-full hover:-translate-y-[1px] cursor-pointer" 
            style={{ backgroundColor: accentColor, borderColor: accentColor }}
          >
            Request Project Quote
          </Link>
          <a 
            href="mailto:sales@eastwind.sa" 
            className="inline-flex items-center justify-center py-3 px-9 text-[0.8rem] font-semibold uppercase tracking-wider text-slate-700 bg-white/20 border border-slate-200 cursor-pointer transition-all duration-200 rounded-full hover:border-slate-400 hover:bg-slate-50 hover:-translate-y-[1px]"
          >
            Email Engineering Team
          </a>
        </div>
      )}
    </>
  );
}
