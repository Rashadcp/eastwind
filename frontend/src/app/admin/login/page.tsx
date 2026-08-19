"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  
  const [otpRequired, setOtpRequired] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // If token exists, direct immediately to admin dashboard
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      if (!otpRequired) {
        // Stage 1: Send username/password
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Login verification failure");
        }

        if (data.otpRequired) {
          setOtpRequired(true);
        } else {
          // Direct fallback if OTP is bypassed on backend configuration
          localStorage.setItem("admin_token", data.token);
          localStorage.setItem("admin_username", data.username);
          router.push("/admin");
        }
      } else {
        // Stage 2: Verify OTP code
        const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, otp }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Verification code is incorrect or expired");
        }

        // Store JWT token and username
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_username", data.username);
        
        // Redirect to admin dashboard
        router.push("/admin");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to establish secure session.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    setError(null);
    setOtpRequired(false);
    setOtp("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 relative font-sans antialiased">
      {/* Decorative dynamic glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[120px] top-1/4 left-1/4 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] bottom-1/4 right-1/4 pointer-events-none" />

      {/* Light Glassmorphic Login Container */}
      <div className="w-full max-w-md bg-white border border-slate-200/80 p-8 rounded-[32px] shadow-[0_20px_50px_rgba(15,23,42,0.06)] relative z-10 space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2 select-none">
          <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center font-extrabold text-white text-lg tracking-wider mx-auto shadow-lg shadow-orange-600/10">
            EW
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800 mt-4">Eastwind Safety</h2>
          <p className="text-[10px] font-mono tracking-widest text-slate-450 uppercase">Operational Security Gateway</p>
        </div>

        {/* Informative message for OTP */}
        {otpRequired && (
          <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-2xl text-xs leading-relaxed text-center font-medium">
            🔒 Verification code sent to <strong className="text-orange-950">harik2021a@gmail.com</strong>.<br/>
            Please inspect your inbox or command console registers.
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl text-xs flex items-start gap-3">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!otpRequired ? (
            <>
              {/* STAGE 1: CREDENTIALS */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block pl-1">Admin Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none transition-all font-medium focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block pl-1">Admin Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none transition-all font-medium focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 bg-orange-600 hover:bg-orange-500 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-600/15 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing Session...
                  </>
                ) : (
                  <>
                    Authenticate Console
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* STAGE 2: OTP VERIFICATION CODE */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block pl-1">6-Digit Verification Code</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none transition-all font-medium focus:bg-white tracking-[0.25em] text-center font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-4 mt-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-600/15 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Validating Code...
                    </>
                  ) : (
                    <>
                      Verify Security Code
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                      </svg>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReturn}
                  className="w-full py-3 text-slate-500 hover:text-slate-850 hover:bg-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Return to Credentials Login
                </button>
              </div>
            </>
          )}

        </form>

      </div>
    </div>
  );
}
