'use client';

import * as React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, RefreshCw, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAiRecommendations, AiRecommendationResponse } from '@/api/ai';

export function AIRecommenderSection() {
  const [recIndustry, setRecIndustry] = React.useState('Healthcare');
  const [recBudget, setRecBudget] = React.useState<number>(50000);
  const [recScale, setRecScale] = React.useState<'STARTUP' | 'SME' | 'ENTERPRISE'>('SME');
  const [recQuery, setRecQuery] = React.useState('Multi-specialty clinic management with lab and pharmacy billing');
  const [recLoading, setRecLoading] = React.useState(false);
  const [recResult, setRecResult] = React.useState<AiRecommendationResponse | null>(null);

  const handleGetRecommendations = async () => {
    setRecLoading(true);
    try {
      const res = await getAiRecommendations({
        industry: recIndustry,
        budget: recBudget,
        organizationScale: recScale,
        query: recQuery,
      });
      if (res.success && res.data) {
        setRecResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRecLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
          <Compass className="w-5 h-5 text-indigo-400" />
          Solution Requirements Wizard
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Industry Sector</label>
            <select
              value={recIndustry}
              onChange={(e) => setRecIndustry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Healthcare">Healthcare & Hospitals</option>
              <option value="Education">Education & Institutes</option>
              <option value="ERP & HR">Enterprise ERP & HR</option>
              <option value="Retail & POS">Retail, Supermarket & POS</option>
              <option value="E-Commerce">E-Commerce & Marketplaces</option>
              <option value="Services & Booking">Services, Gym & Booking</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              Budget Constraint: ₹{recBudget.toLocaleString()}
            </label>
            <input
              type="range"
              min="20000"
              max="150000"
              step="5000"
              value={recBudget}
              onChange={(e) => setRecBudget(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>₹20,000</span>
              <span>₹75,000</span>
              <span>₹1,50,000+</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Organization Scale</label>
            <div className="grid grid-cols-3 gap-2">
              {(['STARTUP', 'SME', 'ENTERPRISE'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRecScale(s)}
                  className={cn(
                    'py-2 rounded-xl border text-center font-bold transition-colors',
                    recScale === s
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Specific Operational Needs</label>
            <textarea
              rows={4}
              value={recQuery}
              onChange={(e) => setRecQuery(e.target.value)}
              placeholder="Describe workflows, branch count, or required integrations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            disabled={recLoading}
            onClick={handleGetRecommendations}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {recLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Recommendations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Solution Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Tailored Architecture & Software Fit
        </h2>

        {recResult ? (
          <div className="space-y-6 text-sm">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 leading-relaxed text-slate-200">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                Architectural Assessment
              </h3>
              <div className="whitespace-pre-wrap">{recResult.summary}</div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Selected Turnkey Platform Matches
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {recResult.recommendations.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-500/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">{p.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">
                          {p.serviceType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-emerald-400 font-mono font-bold text-base">
                        ₹{p.price?.toLocaleString()}
                      </span>
                      <Link
                        href="/products"
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-indigo-400 uppercase">Implementation</span>
                <p className="text-xs text-slate-300 mt-1">{recResult.implementationAdvice}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-indigo-400 uppercase">Timeline</span>
                <p className="text-xs text-slate-300 mt-1">{recResult.estimatedTimeline}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
            <Compass className="w-12 h-12 text-slate-700" />
            <p className="text-sm">
              Configure parameters and click <strong>Generate AI Solution Plan</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
