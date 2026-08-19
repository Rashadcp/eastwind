"use client";

import { useEffect, useState } from "react";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any | null>(null);

  // Form states
  const [formId, setFormId] = useState<string>("");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("");
  const [formTagline, setFormTagline] = useState<string>("");
  const [formOverview, setFormOverview] = useState<string>("");
  const [formAccentHex, setFormAccentHex] = useState<string>("#38bdf8");

  // Sub-object lists
  const [formCapabilities, setFormCapabilities] = useState<{ title: string; body: string }[]>([]);
  const [capTitle, setCapTitle] = useState<string>("");
  const [capBody, setCapBody] = useState<string>("");

  const [formUseCases, setFormUseCases] = useState<string[]>([]);
  const [useCaseInput, setUseCaseInput] = useState<string>("");

  const [formMetrics, setFormMetrics] = useState<{ value: string; label: string }[]>([]);
  const [metricValue, setMetricValue] = useState<string>("");
  const [metricLabel, setMetricLabel] = useState<string>("");

  const fetchApplications = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/applications`);
      if (!res.ok) throw new Error("Failed to fetch applications");
      const list = await res.json();
      setApplications(list);
    } catch (err: any) {
      console.error(err);
      setError("Failed to retrieve applications from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleOpenCreate = () => {
    clearMessages();
    setIsEdit(false);
    setFormId("");
    setFormTitle("");
    setFormCategory("");
    setFormTagline("");
    setFormOverview("");
    setFormAccentHex("#38bdf8");
    setFormCapabilities([]);
    setFormUseCases([]);
    setFormMetrics([]);
    setCapTitle("");
    setCapBody("");
    setUseCaseInput("");
    setMetricValue("");
    setMetricLabel("");
    setShowModal(true);
  };

  const handleOpenEdit = (item: any) => {
    clearMessages();
    setIsEdit(true);
    setFormId(item.id);
    setFormTitle(item.title);
    setFormCategory(item.category || "");
    setFormTagline(item.tagline || "");
    setFormOverview(item.overview || "");
    setFormAccentHex(item.accentHex || "#38bdf8");
    setFormCapabilities(item.capabilities || []);
    setFormUseCases(item.useCases || []);
    setFormMetrics(item.metrics || []);
    setCapTitle("");
    setCapBody("");
    setUseCaseInput("");
    setMetricValue("");
    setMetricLabel("");
    setShowModal(true);
  };

  const addCapability = () => {
    if (capTitle.trim() && capBody.trim()) {
      setFormCapabilities([...formCapabilities, { title: capTitle.trim(), body: capBody.trim() }]);
      setCapTitle("");
      setCapBody("");
    }
  };

  const removeCapability = (idx: number) => {
    setFormCapabilities(formCapabilities.filter((_, i) => i !== idx));
  };

  const addUseCase = () => {
    if (useCaseInput.trim()) {
      setFormUseCases([...formUseCases, useCaseInput.trim()]);
      setUseCaseInput("");
    }
  };

  const removeUseCase = (idx: number) => {
    setFormUseCases(formUseCases.filter((_, i) => i !== idx));
  };

  const addMetric = () => {
    if (metricValue.trim() && metricLabel.trim()) {
      setFormMetrics([...formMetrics, { value: metricValue.trim(), label: metricLabel.trim() }]);
      setMetricValue("");
      setMetricLabel("");
    }
  };

  const removeMetric = (idx: number) => {
    setFormMetrics(formMetrics.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!formId || !formTitle || !formTagline || !formOverview) {
      setError("Please fill in all required parameters.");
      return;
    }

    const payload = {
      id: formId.trim().toLowerCase().replace(/\s+/g, "-"),
      title: formTitle.trim(),
      category: formCategory.trim(),
      tagline: formTagline.trim(),
      overview: formOverview.trim(),
      accentHex: formAccentHex,
      capabilities: formCapabilities,
      useCases: formUseCases,
      metrics: formMetrics,
      relatedSolutions: [] // Stays blank or matches schema
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      let res;
      if (isEdit) {
        res = await fetch(`${baseUrl}/api/applications/${payload.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${baseUrl}/api/applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save operation failed");

      setSuccess(`Application '${payload.title}' successfully ${isEdit ? "updated" : "created"}.`);
      setShowModal(false);
      fetchApplications();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to commit changes to database.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    clearMessages();

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("admin_token");

      const res = await fetch(`${baseUrl}/api/applications/${deleteTarget}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete operation failed");

      setSuccess("Application deleted successfully.");
      setDeleteTarget(null);
      fetchApplications();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete application.");
      setDeleteTarget(null);
    }
  };

  const filteredApplications = applications.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 font-sans text-white select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight m-0 text-white">Application Operations</h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Manage system integration and digitization application records</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 py-3 px-6 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-sky-600/10 active:translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Application Node
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs">
          {success}
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative max-w-md w-full">
        <span className="absolute left-4 top-3 text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search applications by title, category or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none transition-all font-medium"
        />
      </div>

      {/* Applications list */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs font-medium">
            No application nodes registered in this database. Click &quot;Add Application Node&quot; to begin.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left m-0">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Code (ID)</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Title</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Accent Color</th>
                  <th className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {paginatedApplications.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{item.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-100 max-w-xs truncate">{item.title}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">{item.category}</td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: item.accentHex }} />
                        {item.accentHex}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => setViewItem(item)}
                        className="py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/5 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer border border-emerald-500/20"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/5 hover:bg-sky-500 hover:text-white transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item.id)}
                        className="py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-white/5 bg-white/[0.01]">
                <span className="text-xs text-slate-400 font-medium">
                  Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} entries
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="py-1.5 px-3.5 rounded-xl border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-wider text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-sky-600 text-white shadow-md shadow-sky-600/10"
                          : "border border-white/10 hover:border-white/20 text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="py-1.5 px-3.5 rounded-xl border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-wider text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CRUD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 w-full max-w-3xl rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 flex-shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white m-0">
                {isEdit ? `Configure Application: ${formId}` : "Create Application Node"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Application Slug ID *</label>
                  <input
                    type="text"
                    required
                    disabled={isEdit}
                    placeholder="e.g. smart-refinery"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-650 focus:border-sky-500 focus:outline-none transition-colors font-medium disabled:opacity-45"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Application Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter visual title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-650 focus:border-sky-500 focus:outline-none transition-colors font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Category Classification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Safety Systems Integration"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-650 focus:border-sky-500 focus:outline-none transition-colors font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Tagline statement *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter short tagline statement"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-650 focus:border-sky-500 focus:outline-none transition-colors font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Accent Hex Theme Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={formAccentHex}
                      onChange={(e) => setFormAccentHex(e.target.value)}
                      className="w-12 h-10 bg-slate-900 border border-white/5 rounded-2xl cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#38bdf8"
                      value={formAccentHex}
                      onChange={(e) => setFormAccentHex(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-650 focus:border-sky-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Overview Summary *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter detailed application overview"
                  value={formOverview}
                  onChange={(e) => setFormOverview(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Capabilities (Title and Body pairs) */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Key Operational Capabilities</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Capability Title"
                    value={capTitle}
                    onChange={(e) => setCapTitle(e.target.value)}
                    className="px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                  <div className="md:col-span-2 flex gap-4">
                    <input
                      type="text"
                      placeholder="Capability detailed description statement"
                      value={capBody}
                      onChange={(e) => setCapBody(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCapability}
                      className="px-5 py-3 rounded-2xl bg-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {formCapabilities.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">{item.title}</span>
                        <p className="text-[11px] text-slate-400 font-light leading-relaxed m-0">{item.body}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCapability(idx)}
                        className="text-rose-500 hover:text-rose-455 font-bold uppercase text-[9px] tracking-wider cursor-pointer border-none bg-transparent"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases (Bullet List) */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Primary Use Cases</span>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter operational scenario or use case"
                    value={useCaseInput}
                    onChange={(e) => setUseCaseInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={addUseCase}
                    className="px-5 py-3 bg-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <ul className="flex flex-col gap-2 pl-0 list-none m-0">
                  {formUseCases.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs">
                      <span className="text-slate-350 leading-relaxed font-light">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeUseCase(idx)}
                        className="text-rose-500 hover:text-rose-400 font-bold uppercase text-[9px] tracking-wider cursor-pointer border-none bg-transparent"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics (Value and Label) */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block pl-1">Performance Metrics Grid</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Metric Value (e.g. 99.99%)"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    className="px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                  <div className="md:col-span-2 flex gap-4">
                    <input
                      type="text"
                      placeholder="Metric label (e.g. System Uptime SLA)"
                      value={metricLabel}
                      onChange={(e) => setMetricLabel(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-900 border border-white/5 rounded-2xl text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addMetric}
                      className="px-5 py-3 rounded-2xl bg-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formMetrics.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center space-y-2 relative group">
                      <button
                        type="button"
                        onClick={() => removeMetric(idx)}
                        className="absolute right-3 top-3 text-[10px] text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer font-bold"
                      >
                        ✕
                      </button>
                      <span className="text-xl font-extrabold tracking-tight" style={{ color: formAccentHex }}>{item.value}</span>
                      <span className="text-[9px] font-mono text-slate-450 block uppercase tracking-wider leading-relaxed">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form submit/cancel */}
              <div className="pt-6 border-t border-white/5 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-full text-slate-400 border border-white/10 hover:border-white/20 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-lg shadow-sky-600/10"
                >
                  {isEdit ? "Update Application" : "Save Application"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 p-8 rounded-3xl w-full max-w-md text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 text-lg mx-auto">
              ⚠️
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight m-0">Confirm Node Deletion</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light m-0">
                Are you sure you want to permanently delete application node `{deleteTarget}`? This takes effect immediately.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-full border border-white/10 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Abort
              </button>
              <button
                onClick={handleDelete}
                className="px-7 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Delete Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL OVERLAY */}
      {viewItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="h-16 flex items-center justify-between px-8 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 m-0">
                Application Details Node: {viewItem.id}
              </h3>
              <button
                onClick={() => setViewItem(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Application Title</span>
                  <h2 className="text-base font-bold text-slate-900 m-0 mt-0.5">{viewItem.title}</h2>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Category Tagline</span>
                  <p className="text-xs text-slate-700 font-semibold m-0 mt-0.5">{viewItem.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Accent Color Hex</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: viewItem.accentHex }} />
                    <span className="text-xs font-mono font-bold text-slate-800">{viewItem.accentHex}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Section Tagline</span>
                  <p className="text-xs text-slate-700 font-semibold m-0 mt-0.5">{viewItem.tagline}</p>
                </div>
              </div>

              {/* Overview */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Overview Description</span>
                <p className="text-xs text-slate-650 leading-relaxed font-light m-0">{viewItem.overview}</p>
              </div>

              {/* Capabilities */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">Core Capabilities</span>
                {viewItem.capabilities && viewItem.capabilities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {viewItem.capabilities.map((cap: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl relative">
                        <h4 className="text-xs font-bold text-slate-800 mb-1">{cap.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-light m-0">{cap.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-light m-0">No capabilities defined.</p>
                )}
              </div>

              {/* Use Cases & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">Operational Use Cases</span>
                  {viewItem.useCases && viewItem.useCases.length > 0 ? (
                    <ul className="space-y-2 pl-0 list-none m-0 text-xs text-slate-650">
                      {viewItem.useCases.map((uc: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                          <span>{uc}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 font-light m-0">No use cases logged.</p>
                  )}
                </div>

                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3">Performance Metrics</span>
                  {viewItem.metrics && viewItem.metrics.length > 0 ? (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                      <table className="w-full border-collapse text-left m-0 text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-2 font-bold text-slate-650">Metric Label</th>
                            <th className="px-4 py-2 font-bold text-slate-650 text-right">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {viewItem.metrics.map((met: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-4 py-2 text-slate-600 font-light">{met.label}</td>
                              <td className="px-4 py-2 text-orange-600 font-bold text-right">{met.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-light m-0">No metrics specified.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="h-16 flex items-center justify-end px-8 border-t border-slate-100 flex-shrink-0 bg-slate-50">
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-6 py-2.5 rounded-full bg-slate-850 text-white hover:bg-slate-700 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
