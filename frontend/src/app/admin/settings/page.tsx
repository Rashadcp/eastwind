"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

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

  return (
    <div className="space-y-6 max-w-2xl font-sans text-slate-800 select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-tight m-0 text-slate-800">System Settings</h2>
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Configure credentials and console keys</p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-4 rounded-2xl text-xs">
          {success}
        </div>
      )}

      {/* Password Change Card */}
      <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-6 shadow-3xs">
        
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 m-0">Change Administrator Password</h3>
          <p className="text-[10px] text-slate-455 leading-relaxed font-light mt-1">
            Updating your password modifies the security database immediately. Make sure to keep note of your new credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block pl-1">Current Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:bg-white transition-all font-medium"
            />
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block pl-1">New Secure Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block pl-1">Confirm New Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 py-3.5 px-8 mt-6 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-orange-600/10 active:translate-y-0.5 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Commiting Credentials...
              </>
            ) : (
              <>
                Update Password Registers
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
