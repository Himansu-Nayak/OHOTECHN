import Link from 'next/link';
import { FileQuestion, ArrowRight, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen flex items-center justify-center px-4 py-16 selection:bg-[#0d0d0e] selection:text-white">
      <div className="max-w-xl w-full bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 shadow-sm text-center relative overflow-hidden grid-pattern-light">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-5">
          <FileQuestion className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>404 — PAGE NOT FOUND</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight leading-tight mb-3">
          Lost in the Digital Landscape.
        </h1>

        <p className="text-xs sm:text-base text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
          The page or resource you are looking for has been relocated, removed, or never existed in our directory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:scale-105"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#f0f0eb] hover:bg-[#e4e4df] text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all hover:scale-105"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>

        <p className="text-[11px] font-mono text-slate-400 mt-8">
          Need immediate assistance? <Link href="/contact" className="text-emerald-600 hover:underline">Contact our technical team</Link>.
        </p>

      </div>
    </div>
  );
}
