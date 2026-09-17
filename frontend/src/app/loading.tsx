export default function GlobalLoading() {
  // Keep the page visually stable while the next route's server data and
  // JavaScript arrive. The previous empty boundary appeared as a blank page.
  return (
    <main
      className="min-h-screen bg-[#f8fafc] text-slate-900 pt-28 sm:pt-32"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="fixed top-0 inset-x-0 z-50 h-[72px] sm:h-[88px] bg-white/95 border-b border-slate-200/70 shadow-sm">
        <div className="max-w-[1240px] mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
          <div className="h-9 w-32 rounded-lg bg-slate-200 animate-pulse" />
          <div className="hidden sm:flex gap-5">
            <div className="h-3 w-14 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-[4.5rem] rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-14 rounded bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
      <section className="max-w-[1240px] mx-auto px-5 sm:px-8 py-12 sm:py-20">
        <div className="max-w-3xl">
          <div className="h-3 w-28 rounded bg-[#c22026]/20 animate-pulse mb-6" />
          <div className="h-11 sm:h-16 w-full max-w-2xl rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-11 sm:h-16 w-3/4 mt-3 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-4 w-full mt-8 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-5/6 mt-3 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-52 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </section>
      <span className="sr-only">Loading page content</span>
    </main>
  );
}
