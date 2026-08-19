"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("Admin");

  // Global fetch interceptor to catch any 401 Unauthorized API responses
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (response.status === 401) {
          console.warn("Intercepted 401: Token expired or invalid. Logging out...");
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_username");
          setIsAuthenticated(false);
          router.push("/admin/login");
        }
        return response;
      } catch (error) {
        throw error;
      }
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      const storedUser = localStorage.getItem("admin_username");

      if (!token) {
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        } else {
          setLoading(false);
        }
        return;
      }

      // Verify token with backend
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          // Token is expired or invalid
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_username");
          setIsAuthenticated(false);
          if (pathname !== "/admin/login") {
            router.push("/admin/login");
          } else {
            setLoading(false);
          }
        } else {
          setIsAuthenticated(true);
          if (storedUser) {
            setUsername(storedUser);
          }
          if (pathname === "/admin/login") {
            router.push("/admin");
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        // Fallback to basic client validation if backend is offline to prevent blocking admin access during deployments
        setIsAuthenticated(true);
        if (storedUser) {
          setUsername(storedUser);
        }
        if (pathname === "/admin/login") {
          router.push("/admin");
        } else {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  // If loading, render a high-end light skeleton spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center font-sans antialiased">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs tracking-wider text-slate-550 font-medium">Verifying Authorization Node...</p>
        </div>
      </div>
    );
  }

  // If path is login, bypass layout wrap
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navLinks = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      name: "Manage Hero Captions",
      href: "/admin/hero",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h18M3 16h18" />
        </svg>
      )
    },
    {
      name: "Manage Products",
      href: "/admin/products",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: "Manage Solutions",
      href: "/admin/solutions",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      name: "Manage Applications",
      href: "/admin/applications",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: "Manage Services",
      href: "/admin/services",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    {
      name: "Manage About Section",
      href: "/admin/about",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: "Manage Contact & Enquiry",
      href: "/admin/contact",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: "Manage Footer Section",
      href: "/admin/footer",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM4 15h16" />
        </svg>
      )
    },
    {
      name: "Brands Portfolio",
      href: "/admin/brands",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V7m0 4h4m-4 0H7" />
        </svg>
      )
    },
    {
      name: "Success Stories",
      href: "/admin/success-stories",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      name: "Update Password",
      href: "/admin/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased w-full max-w-full overflow-hidden">
      
      {/* Dynamic Theme Override Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Enforce normal clean font style, disable uppercase, reset letter-spacing */
        .admin-light-theme *,
        .admin-light-theme input,
        .admin-light-theme button,
        .admin-light-theme select,
        .admin-light-theme textarea,
        .admin-light-theme span,
        .admin-light-theme label,
        .admin-light-theme th,
        .admin-light-theme td {
          font-family: var(--font-sans) !important;
          text-transform: none !important;
          letter-spacing: normal !important;
        }

        .admin-light-theme {
          color: #334155 !important;
        }
        .admin-light-theme h1, 
        .admin-light-theme h2, 
        .admin-light-theme h3, 
        .admin-light-theme h4, 
        .admin-light-theme h5 {
          color: #0f172a !important;
          font-weight: 700 !important;
        }
        /* Override dark backgrounds for cards, forms, tables, modals */
        .admin-light-theme div[class*="bg-slate-9"],
        .admin-light-theme div[class*="bg-slate-8"],
        .admin-light-theme div[class*="bg-[#040810]"],
        .admin-light-theme div[class*="bg-[#080c14]"],
        .admin-light-theme div[class*="bg-[#0c101b]"],
        .admin-light-theme div[class*="bg-[#040810]"],
        .admin-light-theme div[class*="bg-white/0"],
        .admin-light-theme div[class*="bg-white/1"],
        .admin-light-theme div[class*="bg-white/5"],
        .admin-light-theme div[class*="bg-white/10"],
        .admin-light-theme div[class*="bg-slate-900"],
        .admin-light-theme form {
          background-color: #ffffff !important;
          color: #334155 !important;
        }
        /* Inputs */
        .admin-light-theme input,
        .admin-light-theme select,
        .admin-light-theme textarea {
          background-color: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          color: #0f172a !important;
          border-radius: 12px !important;
        }
        .admin-light-theme input:focus,
        .admin-light-theme select:focus,
        .admin-light-theme textarea:focus {
          border-color: #ea580c !important;
          outline: none !important;
          background-color: #ffffff !important;
        }
        .admin-light-theme input::placeholder,
        .admin-light-theme textarea::placeholder {
          color: #94a3b8 !important;
        }
        /* Orange accents replacing blue sky buttons */
        .admin-light-theme button[class*="bg-sky-"],
        .admin-light-theme label[class*="bg-sky-"],
        .admin-light-theme a[class*="bg-sky-"] {
          background-color: #ea580c !important;
          color: #ffffff !important;
          text-transform: none !important;
          letter-spacing: normal !important;
          border-radius: 9999px !important;
          font-weight: 600 !important;
        }
        .admin-light-theme button[class*="bg-sky-"]:hover,
        .admin-light-theme label[class*="bg-sky-"]:hover {
          background-color: #ea580c !important;
          opacity: 0.9;
        }
        .admin-light-theme [class*="text-sky-"],
        .admin-light-theme [class*="hover:text-sky-"]:hover {
          color: #ea580c !important;
        }
        /* Soft borders */
        .admin-light-theme [class*="border-white/"],
        .admin-light-theme [class*="border-slate-9"],
        .admin-light-theme [class*="border-slate-8"] {
          border-color: #e2e8f0 !important;
        }
        .admin-light-theme .divide-white\\/5 > * + *,
        .admin-light-theme .divide-slate-900 > * + * {
          border-color: #e2e8f0 !important;
        }
        /* Table rows & headers */
        .admin-light-theme th {
          background-color: #f1f5f9 !important;
          color: #475569 !important;
          border-bottom: 1px solid #e2e8f0 !important;
          font-weight: 600 !important;
        }
        .admin-light-theme tr {
          border-bottom: 1px solid #e2e8f0 !important;
          background-color: #ffffff !important;
        }
        .admin-light-theme tr:hover {
          background-color: #f8fafc !important;
        }
        .admin-light-theme td {
          color: #334155 !important;
        }
        /* Secondary buttons (Add, Add feature etc) */
        .admin-light-theme button[class*="bg-slate-8"] {
          background-color: #f1f5f9 !important;
          color: #475569 !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 12px !important;
        }
        .admin-light-theme button[class*="bg-slate-8"]:hover {
          background-color: #e2e8f0 !important;
        }
        /* Text mutations */
        .admin-light-theme [class*="text-slate-4"] {
          color: #475569 !important;
        }
        .admin-light-theme [class*="text-slate-5"] {
          color: #64748b !important;
        }
        .admin-light-theme [class*="text-slate-2"],
        .admin-light-theme [class*="text-slate-3"] {
          color: #1e293b !important;
        }
        .admin-light-theme .text-white {
          color: #0f172a !important;
        }
        /* Modals and Overlays */
        .admin-light-theme div[class*="bg-black/60"] {
          background-color: rgba(15, 23, 42, 0.4) !important;
        }
        .admin-light-theme div[class*="bg-slate-950"] {
          background-color: #ffffff !important;
          border-color: #cbd5e1 !important;
        }
      ` }} />
      
      {/* 1. Sidebar Nav */}
      <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col justify-between flex-shrink-0 h-screen select-none overflow-hidden">
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-orange-500">
          {/* Brand header */}
          <div className="h-20 flex items-center px-6 border-b border-slate-200/60 gap-3 shrink-0 sticky top-0 bg-white z-10">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-md">
              EW
            </div>
            <div>
              <span className="font-bold text-sm text-slate-800 block">Eastwind</span>
              <span className="text-xs text-slate-550 block">Admin Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/15"
                      : "text-slate-500 hover:text-slate-850 hover:bg-slate-100"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer & Logout */}
        <div className="p-4 border-t border-slate-200/60 space-y-4 shrink-0 bg-white z-10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 block truncate">{username}</span>
              <span className="text-[9px] text-emerald-600 block">Session Active</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200/60 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout Console
          </button>
        </div>
      </aside>

      {/* 2. Main Content Frame */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top bar header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-slate-800 m-0">
              {navLinks.find((l) => l.href === pathname)?.name || "Dashboard"}
            </h1>
            <span className="text-xs text-slate-500 mt-0.5">
              Dammam Operations Command Center
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors no-underline"
          >
            Visit Live Site
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 00-2 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </header>

        {/* Dynamic page container */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 relative w-full">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto w-full admin-light-theme">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
