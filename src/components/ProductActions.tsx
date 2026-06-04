"use client";

import { useState } from "react";

interface ProductActionsProps {
  productTitle: string;
  accentColor: string;
  layout?: "hero" | "footer";
}

export default function ProductActions({ productTitle, accentColor, layout = "hero" }: ProductActionsProps) {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsEnquiryModalOpen(false);
        setSubmitSuccess(false);
        setFormData({ name: "", email: "", company: "", message: "" });
      }, 2000);
    }, 1200);
  };

  return (
    <>
      {layout === "hero" ? (
        <div className="flex gap-4">
          <button 
            onClick={() => setIsEnquiryModalOpen(true)}
            className="btn-primary" 
            style={{ backgroundColor: accentColor, borderColor: accentColor }}
          >
            Request Technical Quote
          </button>
          <a href="#contact" className="btn-secondary">
            Contact Sales
          </a>
        </div>
      ) : (
        <div className="flex gap-4 justify-center flex-wrap">
          <button 
            onClick={() => setIsEnquiryModalOpen(true)}
            className="btn-primary" 
            style={{ backgroundColor: accentColor, borderColor: accentColor }}
          >
            Request Project Quote
          </button>
          <a href="mailto:sales@eastwind.sa" className="btn-secondary">
            Email Engineering Team
          </a>
        </div>
      )}

      {/* Quote Request Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-[4px] flex items-center justify-center z-[9999] p-6">
          <div className="bg-white rounded-2xl p-10 max-sm:p-6 max-w-[500px] w-full shadow-2xl relative">
            <button 
              onClick={() => setIsEnquiryModalOpen(false)}
              className="absolute top-5 right-5 bg-none border-none text-[1.5rem] cursor-pointer text-slate-400 hover:text-slate-600"
            >
              ×
            </button>

            {submitSuccess ? (
              <div className="text-center py-10">
                <span className="text-5xl text-accent-red">✓</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-4 mb-3">Quote Request Received</h3>
                <p className="text-slate-500 m-0 leading-normal">Thank you. Our industrial engineering team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry}>
                <h3 className="text-[1.6rem] font-bold text-slate-900 mb-2">Request Technical Quote</h3>
                <p className="text-[0.85rem] text-slate-500 mb-6 font-semibold">{productTitle}</p>

                <div className="flex flex-col gap-4 mb-7">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="p-[12px_16px] rounded-lg border border-slate-200 text-[0.95rem] outline-none focus:border-slate-400 transition-colors" 
                  />
                  <input 
                    type="email" 
                    placeholder="Corporate Email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="p-[12px_16px] rounded-lg border border-slate-200 text-[0.95rem] outline-none focus:border-slate-400 transition-colors" 
                  />
                  <input 
                    type="text" 
                    placeholder="Company Name" 
                    required 
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="p-[12px_16px] rounded-lg border border-slate-200 text-[0.95rem] outline-none focus:border-slate-400 transition-colors" 
                  />
                  <textarea 
                    placeholder="Enquiry Details" 
                    rows={4} 
                    required 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="p-[12px_16px] rounded-lg border border-slate-200 text-[0.95rem] outline-none focus:border-slate-400 transition-colors resize-none" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full h-12" 
                  style={{ backgroundColor: accentColor, borderColor: accentColor }}
                >
                  {isSubmitting ? "Submitting Request..." : "Submit Quote Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
