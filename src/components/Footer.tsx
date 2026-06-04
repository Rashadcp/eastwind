export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-surface border-t border-border-color rounded-t-lg py-[100px] px-10 max-sm:px-5 relative z-10 mt-[50px]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[60px] max-sm:gap-10 mb-20">
        
        {/* Brand & Mission */}
        <div className="col-span-2 max-lg:col-span-1">
          <div className="flex items-center gap-3 font-semibold text-xl tracking-normal text-text-primary mb-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Swoosh (Blue) */}
              <path d="M35,15 C20,25 10,45 10,65 C10,78 18,85 25,85 C20,75 18,60 23,45 C28,30 35,20 35,15 Z" fill="#1e3e8f" />
              {/* Right Swoosh (Red) */}
              <path d="M50,20 C35,30 25,50 25,70 C25,80 30,85 35,85 C30,78 28,65 35,50 C42,35 50,25 50,20 Z" fill="#c22026" />
            </svg>
            <span className="flex flex-col">
              <span className="leading-none font-bold text-[1.2rem] text-[#1e3e8f] tracking-tight">East Wind</span>
              <span className="text-[0.6rem] text-[#c22026] tracking-[0.3em] leading-normal font-bold uppercase">
                SAFETY
              </span>
            </span>
          </div>
          <p className="text-[0.95rem] text-slate-600 mb-8 max-w-[480px] leading-relaxed m-0">
            Sales, renting, and servicing of world-class safety products and engineered solutions for the Marine, Oil & Gas, Petrochemical, and Civil Defense sectors.
          </p>
          <div className="flex gap-4">
            <span className="inline-block text-[0.7rem] font-mono text-accent-red font-bold tracking-widest border border-red-600/20 py-1.5 px-3 bg-red-600/[0.03] rounded-[8px]">
              CERTIFIED MARINE & INDUSTRIAL SAFETY PARTNER
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <span className="tech-label block mb-6 text-text-primary">
            Quick Links
          </span>
          <ul className="list-none flex flex-col gap-3.5 text-[0.9rem] p-0 m-0">
            <li>
              <a href="/products/gas-detection" className="text-slate-600 hover:text-accent-red no-underline transition-colors duration-200">
                Gas Detection Systems
              </a>
            </li>
            <li>
              <a href="/products/breathing-air-compressor" className="text-slate-600 hover:text-accent-red no-underline transition-colors duration-200">
                Breathing Air Compressors
              </a>
            </li>
            <li>
              <a href="/products/self-contained-breathing-apparatus" className="text-slate-600 hover:text-accent-red no-underline transition-colors duration-200">
                SCBA Systems
              </a>
            </li>
            <li>
              <a href="/products/temporary-refuge-shelters" className="text-slate-600 hover:text-accent-red no-underline transition-colors duration-200">
                Temporary Refuge Shelters
              </a>
            </li>
            <li>
              <a href="/products/testing-maintenance" className="text-slate-600 hover:text-accent-red no-underline transition-colors duration-200">
                Testing & Maintenance
              </a>
            </li>
            <li>
              <a href="/products/calibration" className="text-slate-600 hover:text-accent-red no-underline transition-colors duration-200">
                Calibration Services
              </a>
            </li>
          </ul>
        </div>

        {/* Regional Offices */}
        <div>
          <span className="tech-label block mb-6 text-text-primary">
            Operations
          </span>
          <div className="flex flex-col gap-5 text-[0.9rem] text-slate-600">
            <div>
              <strong className="text-text-primary block mb-1 font-bold">Al Khobar Headquarters</strong>
              King Faisal West Road, Bandariyah District,<br />
              Al Khobar, Kingdom of Saudi Arabia
            </div>
            <div>
              <strong className="text-text-primary block mb-1 font-bold">Riyadh Technology Hub</strong>
              Olaya District, Riyadh,<br />
              Kingdom of Saudi Arabia
            </div>
            <div className="border-t border-border-color pt-4">
              <strong className="text-text-primary block mb-1 font-bold">Contact Portal</strong>
              Email: <a href="mailto:info@eastwindsafety.com" className="text-accent-red hover:underline no-underline">info@eastwindsafety.com</a><br />
              Secure Tel: +966 13 889 XXXX
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="max-w-[1400px] mx-auto pt-10 border-t border-border-color flex flex-wrap justify-between items-center gap-6 text-[0.8rem] text-text-muted">
        <div>
          © {currentYear} East Wind Safety. All rights reserved. Premium Safety Products & Solutions Integrator.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-text-muted hover:text-text-primary no-underline transition-colors duration-200">
            Marine & Industrial Compliance
          </a>
          <a href="#" className="text-text-muted hover:text-text-primary no-underline transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="#" className="text-text-muted hover:text-text-primary no-underline transition-colors duration-200">
            Portal Login
          </a>
        </div>
      </div>
    </footer>
  );
}
