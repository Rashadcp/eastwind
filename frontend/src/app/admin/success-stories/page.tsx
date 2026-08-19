"use client";

import { useEffect, useState } from "react";

export interface StoryResult {
  label: string;
  value: string;
}

export interface SuccessStoryItem {
  id: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  results: StoryResult[];
  imageUrl: string;
  featured?: boolean;
  year?: string;
}

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewStory, setViewStory] = useState<SuccessStoryItem | null>(null);

  // Form state
  const [formId, setFormId] = useState<string>("");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formClient, setFormClient] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("Fire Fighting & Suppression");
  const [formYear, setFormYear] = useState<string>("2025");
  const [formSummary, setFormSummary] = useState<string>("");
  const [formChallenge, setFormChallenge] = useState<string>("");
  const [formSolution, setFormSolution] = useState<string>("");
  const [formImageUrl, setFormImageUrl] = useState<string>("");
  const [formFeatured, setFormFeatured] = useState<boolean>(true);

  // Form Results metrics state
  const [formResults, setFormResults] = useState<StoryResult[]>([]);
  const [resLabel, setResLabel] = useState<string>("");
  const [resValue, setResValue] = useState<string>("");

  // File Upload State
  const [uploading, setUploading] = useState<boolean>(false);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/success-stories`);
      if (!res.ok) throw new Error("Failed to load success stories");
      const data = await res.json();
      setStories(data);
    } catch (err: any) {
      setError(err.message || "Could not fetch success stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleOpenAddModal = () => {
    clearMessages();
    setIsEdit(false);
    setFormId(`story-${Date.now()}`);
    setFormTitle("");
    setFormClient("");
    setFormCategory("Fire Fighting & Suppression");
    setFormYear("2025");
    setFormSummary("");
    setFormChallenge("");
    setFormSolution("");
    setFormImageUrl("/products/default-fire-fighting-rescue.png");
    setFormFeatured(true);
    setFormResults([
      { label: "Water Saved", value: "90% Reduction" },
      { label: "HCIS Standard", value: "100% Certified" }
    ]);
    setShowModal(true);
  };

  const handleOpenEditModal = (story: SuccessStoryItem) => {
    clearMessages();
    setIsEdit(true);
    setFormId(story.id);
    setFormTitle(story.title);
    setFormClient(story.client);
    setFormCategory(story.category || "Industrial Safety");
    setFormYear(story.year || "2025");
    setFormSummary(story.summary || "");
    setFormChallenge(story.challenge || "");
    setFormSolution(story.solution || "");
    setFormImageUrl(story.imageUrl || "/products/default-fire-fighting-rescue.png");
    setFormFeatured(story.featured ?? true);
    setFormResults(story.results || []);
    setShowModal(true);
  };

  const handleAddResultMetric = () => {
    if (!resLabel.trim() || !resValue.trim()) return;
    setFormResults((prev) => [...prev, { label: resLabel.trim(), value: resValue.trim() }]);
    setResLabel("");
    setResValue("");
  };

  const handleRemoveResultMetric = (index: number) => {
    setFormResults((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    clearMessages();

    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("image", file);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      setFormImageUrl(data.imageUrl || data.url);
      setSuccess("Image uploaded successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!formTitle.trim() || !formClient.trim() || !formSummary.trim()) {
      setError("Title, Client Name, and Summary are required.");
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const payload = {
        id: formId,
        title: formTitle.trim(),
        client: formClient.trim(),
        category: formCategory.trim(),
        year: formYear.trim(),
        summary: formSummary.trim(),
        challenge: formChallenge.trim(),
        solution: formSolution.trim(),
        imageUrl: formImageUrl.trim() || "/products/default-fire-fighting-rescue.png",
        featured: formFeatured,
        results: formResults,
      };

      const url = isEdit ? `${baseUrl}/api/success-stories/${formId}` : `${baseUrl}/api/success-stories`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save success story.");

      setSuccess(`Success story "${formTitle}" ${isEdit ? "updated" : "created"} successfully!`);
      setShowModal(false);
      fetchStories();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  };

  const handleDeleteStory = async (id: string) => {
    clearMessages();
    try {
      const token = localStorage.getItem("admin_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/success-stories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete story");

      setSuccess("Success story removed!");
      setDeleteTarget(null);
      fetchStories();
    } catch (err: any) {
      setError(err.message || "Failed to delete story");
    }
  };

  const filteredStories = stories.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              CMS Module
            </span>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Success Stories Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage public success story case studies displayed on the About Us page.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <span>+ Add New Story</span>
        </button>
      </div>

      {/* Alert Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-800">✕</button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex justify-between items-center">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-800">✕</button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <input
          type="text"
          placeholder="Search case studies by title, client, or category..."
          value={searchQuery}
          aria-label="Search case studies"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
        />
        <span className="text-xs font-mono font-bold text-slate-400">
          Showing {filteredStories.length} Stories
        </span>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-mono">Loading Success Stories...</div>
      ) : filteredStories.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs font-medium">
          No success stories found. Click "+ Add New Story" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div key={story.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
              {/* IMAGE THUMBNAIL BANNER (WHOLE IMAGE UNCROPPED) */}
              <div className="h-48 relative overflow-hidden bg-slate-950 flex items-center justify-center p-2">
                <img
                  src={story.imageUrl || "/emergency_vehicle.webp"}
                  alt={story.title}
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-orange-600 bg-white/95 backdrop-blur-md border border-orange-200 px-2.5 py-1 rounded-md shadow-sm">
                    {story.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-white/95 backdrop-blur-md px-2 py-1 rounded-md shadow-sm">
                    📅 {story.year || "2025"}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-slate-800 leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {story.summary}
                  </p>
                </div>

                {story.results && story.results.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {story.results.map((r, idx) => (
                      <span key={idx} className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
                        {r.label}: <strong className="text-orange-600">{r.value}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setViewStory(story)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleOpenEditModal(story)}
                  className="px-3 py-1.5 text-xs font-bold text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(story.id)}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800">
                {isEdit ? "Edit Success Story Case Study" : "Add New Success Story"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Story Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. One Seven CAFS Deployment for Petrochemical Depot"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Client / Location *</label>
                  <input
                    type="text"
                    required
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="e.g. Major Energy Terminal, Jubail"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Fire Fighting & Suppression"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="e.g. 2025"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Overview of engineered package delivered..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Industrial Challenge</label>
                  <textarea
                    rows={3}
                    value={formChallenge}
                    onChange={(e) => setFormChallenge(e.target.value)}
                    placeholder="Challenges faced by the client..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Engineered Solution</label>
                  <textarea
                    rows={3}
                    value={formSolution}
                    onChange={(e) => setFormSolution(e.target.value)}
                    placeholder="Solution and equipment installed..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Product / Project Image</label>
                
                {/* Live Image Preview */}
                {formImageUrl && (
                  <div className="h-36 w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-200 relative">
                    <img
                      src={formImageUrl}
                      alt="Story Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="/emergency_vehicle.webp"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer shrink-0">
                    {uploading ? "Uploading..." : "Upload File"}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Dynamic Key Results Builder */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="block font-bold text-slate-800">Key Measured Results (Metrics)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Result Label (e.g. Water Saved)"
                    value={resLabel}
                    onChange={(e) => setResLabel(e.target.value)}
                    className="w-1/2 p-2 border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Metric Value (e.g. 90% Reduction)"
                    value={resValue}
                    onChange={(e) => setResValue(e.target.value)}
                    className="w-1/2 p-2 border border-slate-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddResultMetric}
                    className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 shrink-0"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formResults.map((res, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg font-mono">
                      <strong>{res.label}:</strong> <span className="text-orange-600">{res.value}</span>
                      <button type="button" onClick={() => handleRemoveResultMetric(i)} className="text-red-500 font-bold ml-1">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md"
                >
                  {isEdit ? "Save Changes" : "Create Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded">
                {viewStory.category} ({viewStory.year || "2025"})
              </span>
              <button onClick={() => setViewStory(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            {/* IMAGE BANNER IN MODAL (WHOLE IMAGE UNCROPPED) */}
            <div className="h-64 relative overflow-hidden bg-slate-950 rounded-xl flex items-center justify-center p-3 border border-slate-800">
              <img
                src={viewStory.imageUrl || "/emergency_vehicle.webp"}
                alt={viewStory.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-md rounded-lg"
              />
            </div>

            <h2 className="text-lg font-extrabold text-slate-800">{viewStory.title}</h2>
            <p className="text-xs font-mono font-bold text-slate-500">Client / Location: {viewStory.client}</p>

            <p className="text-xs text-slate-600 leading-relaxed">{viewStory.summary}</p>

            {viewStory.challenge && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <strong className="block text-red-600 mb-1">Challenge:</strong>
                <p className="text-slate-600">{viewStory.challenge}</p>
              </div>
            )}

            {viewStory.solution && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <strong className="block text-blue-600 mb-1">Solution:</strong>
                <p className="text-slate-600">{viewStory.solution}</p>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button onClick={() => setViewStory(null)} className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-base font-bold text-slate-800">Remove Success Story?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this case study? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs">
                Cancel
              </button>
              <button onClick={() => handleDeleteStory(deleteTarget)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
