'use client';

import * as React from 'react';
import { Cpu } from 'lucide-react';
import { classifyCustomerQuery, AiClassificationResponse } from '@/api/ai';

export function AIClassifierSection() {
  const [classifierInput, setClassifierInput] = React.useState(
    'I want to track the deployment status of our Hospital ERP order #1049'
  );
  const [classifierLoading, setClassifierLoading] = React.useState(false);
  const [classifierResult, setClassifierResult] = React.useState<AiClassificationResponse | null>(null);

  const handleClassify = async () => {
    if (!classifierInput.trim() || classifierLoading) return;
    setClassifierLoading(true);
    try {
      const res = await classifyCustomerQuery(classifierInput.trim());
      if (res.success && res.data) {
        setClassifierResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setClassifierLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
        <Cpu className="w-5 h-5 text-indigo-400" />
        Customer Query Classification & Routing Engine
      </h2>

      <div className="space-y-4 max-w-2xl">
        <label className="block text-xs font-semibold text-slate-400">Test Customer Inquiry</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={classifierInput}
            onChange={(e) => setClassifierInput(e.target.value)}
            placeholder="Enter sample customer message..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            disabled={classifierLoading}
            onClick={handleClassify}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 shrink-0"
          >
            {classifierLoading ? 'Classifying...' : 'Classify Intent'}
          </button>
        </div>
      </div>

      {classifierResult && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-slate-400 font-semibold">Detected Category</span>
            <span className="px-3 py-1 rounded-full font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs">
              {classifierResult.category}
            </span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-slate-400 font-semibold">Classification Confidence</span>
            <span className="font-mono text-emerald-400 font-bold text-xs">
              {(classifierResult.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-slate-400 font-semibold">Intent Code</span>
            <span className="font-mono text-slate-200">{classifierResult.intent}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold">Suggested Backend Action</span>
            <span className="font-mono text-blue-400 font-bold">{classifierResult.suggestedAction}</span>
          </div>
        </div>
      )}
    </div>
  );
}
