import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Clock, CheckCircle2 } from 'lucide-react';

interface CareerDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function CareerDetailPage({ params }: CareerDetailProps) {
  const { slug } = await params;
  const formattedTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Positions
        </Link>

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Engineering Position
            </span>
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Noida, India / Remote
            </span>
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Full-time
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#0d0d0e] mb-4">
            {formattedTitle}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed mb-8">
            Join the engineering team at OHO TECH to architect dependable, high-performance software applications, web platforms, and business systems.
          </p>

          <a
            href="mailto:careers@ohotech.com?subject=Application for Position"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            Apply for this Role →
          </a>
        </div>

        {/* Role Responsibilities */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[#0d0d0e] mb-4">What You Will Do</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Collaborate directly with product architects to design scalable software architecture.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Engineer clean, maintainable, and well-documented codebases for client applications.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Perform thorough quality assurance and code reviews to ensure system reliability.</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-[#0d0d0e] mb-4">How to Apply</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Send an email to <strong className="text-[#0d0d0e]">careers@ohotech.com</strong> with your resume, GitHub profile or portfolio link, and a brief description of key technical projects you have built.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
