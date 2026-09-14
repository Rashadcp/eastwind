import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white pt-20">
        <h1 className="text-7xl sm:text-8xl font-bold tracking-tight text-[#1e3e8f] leading-none select-none">
          404
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-semibold mt-4 mb-8">
          Page Not Found
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#1e3e8f] hover:bg-[#152e6d] shadow-sm transition-all duration-200 no-underline hover:-translate-y-0.5"
        >
          Back to Home
        </Link>
      </main>
    </>
  );
}
