"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [enquiryRecipientEmail, setEnquiryRecipientEmail] = useState<string>("");
  const [smtpHost, setSmtpHost] = useState<string>("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState<string>("587");
  const [smtpSecure, setSmtpSecure] = useState<boolean>(false);
  const [smtpUser, setSmtpUser] = useState<string>("");
  const [smtpPassword, setSmtpPassword] = useState<string>("");
  const [hasSmtpPassword, setHasSmtpPassword] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(true);
  const [emailSaving, setEmailSaving] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate confirmation matching
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation fields do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password length must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authorization token found. Please re-login.");
      }

      const res = await fetch(`${baseUrl}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      setSuccess("Administrator password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit password update.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmailSettings = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${baseUrl}/api/email-settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEnquiryRecipientEmail(data.enquiryRecipientEmail || "");
          setSmtpHost(data.smtpHost || "smtp.gmail.com");
          setSmtpPort(String(data.smtpPort || 587));
          setSmtpSecure(Boolean(data.smtpSecure));
          setSmtpUser(data.smtpUser || "");
          setHasSmtpPassword(Boolean(data.hasSmtpPassword));
        }
      } catch (err) {
        console.error("Unable to load email notification settings:", err);
      } finally {
        setEmailLoading(false);
      }
    };
    fetchEmailSettings();
  }, []);

  const handleEmailSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const recipient = enquiryRecipientEmail.trim();
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      setError("Enter a valid email address for enquiry notifications.");
      return;
    }

    setEmailSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No authorization token found. Please re-login.");

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/email-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          enquiryRecipientEmail: recipient,
          smtpHost: smtpHost.trim(),
          smtpPort: Number(smtpPort),
          smtpSecure,
          smtpUser: smtpUser.trim(),
          smtpPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update enquiry recipient.");

      setEnquiryRecipientEmail(data.enquiryRecipientEmail || recipient);
      setSmtpHost(data.smtpHost || smtpHost);
      setSmtpPort(String(data.smtpPort || smtpPort));
      setSmtpSecure(Boolean(data.smtpSecure));
      setSmtpUser(data.smtpUser || smtpUser);
      setHasSmtpPassword(Boolean(data.hasSmtpPassword));
      setSmtpPassword("");
      setSuccess("Email delivery settings updated successfully.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update enquiry notification settings.");
    } finally {
      setEmailSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl font-sans text-slate-800">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Security & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage administrator account credentials and access security</p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 text-rose-500 hover:text-rose-800 rounded-sm hover:bg-rose-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="p-1 text-emerald-500 hover:text-emerald-800 rounded-sm hover:bg-emerald-100 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Enquiry Notifications Card */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 m-0">Enquiry Email Delivery</h2>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Configure where enquiries are delivered and the SMTP server used to send them. The password is encrypted before storage and is never displayed again.
          </p>
        </div>

        <form onSubmit={handleEmailSettingsSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Recipient Email Address *</label>
            <input
              type="email"
              required
              disabled={emailLoading}
              placeholder="enquiries@yourcompany.com"
              value={enquiryRecipientEmail}
              onChange={(e) => setEnquiryRecipientEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:border-[#1e3e8f] focus:outline-none transition-colors disabled:bg-slate-50"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">SMTP Host *</label>
              <input type="text" required value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} disabled={emailLoading} placeholder="smtp.gmail.com" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-[#1e3e8f] focus:outline-none disabled:bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">SMTP Port *</label>
              <input type="number" required min="1" max="65535" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} disabled={emailLoading} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-[#1e3e8f] focus:outline-none disabled:bg-slate-50" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">SMTP Username / Sending Email *</label>
            <input type="email" required value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} disabled={emailLoading} placeholder="your-gmail-address@gmail.com" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-[#1e3e8f] focus:outline-none disabled:bg-slate-50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">SMTP Password / Gmail App Password {hasSmtpPassword ? "(saved — leave blank to keep)" : "*"}</label>
            <input type="password" required={!hasSmtpPassword} value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} disabled={emailLoading} autoComplete="new-password" placeholder={hasSmtpPassword ? "Leave blank to keep the saved password" : "Enter SMTP or Gmail App Password"} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-[#1e3e8f] focus:outline-none disabled:bg-slate-50" />
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer w-fit">
            <input type="checkbox" checked={smtpSecure} onChange={(e) => setSmtpSecure(e.target.checked)} disabled={emailLoading} className="accent-[#1e3e8f]" />
            Use SSL/TLS (normally enabled for port 465; off for Gmail port 587)
          </label>
          <div className="pt-2">
            <button
              type="submit"
              disabled={emailLoading || emailSaving}
              className="flex items-center gap-2 py-2 px-6 rounded-sm bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
            >
              {emailSaving ? "Saving Email Settings..." : "Save Email Settings"}
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Card */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-5">
        
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 m-0">Change Administrator Password</h2>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Ensure you use a secure, strong password to protect the East Wind administration portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Current Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:border-[#1e3e8f] focus:outline-none transition-colors"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">New Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:border-[#1e3e8f] focus:outline-none transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Confirm New Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:border-[#1e3e8f] focus:outline-none transition-colors"
            />
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 py-2 px-6 rounded-sm bg-[#1e3e8f] hover:bg-[#162f6d] text-white text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Update Password</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
