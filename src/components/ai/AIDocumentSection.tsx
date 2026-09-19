'use client';

import * as React from 'react';
import { FileText, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { analyzeAiDocument, DocumentAnalysisResponse } from '@/api/ai';

export function AIDocumentSection() {
  const [docFile, setDocFile] = React.useState<File | null>(null);
  const [docPrompt, setDocPrompt] = React.useState('');
  const [docLoading, setDocLoading] = React.useState(false);
  const [docResult, setDocResult] = React.useState<DocumentAnalysisResponse | null>(null);

  const handleAnalyzeDocument = async () => {
    if (!docFile || docLoading) return;
    setDocLoading(true);
    try {
      const res = await analyzeAiDocument(docFile, docPrompt || undefined);
      if (res.success && res.data) {
        setDocResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDocLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
        <FileText className="w-5 h-5 text-indigo-400" />
        Document, RFP & Invoice Intelligence (Multimodal PDF OCR)
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-8 text-center transition-colors">
            <Upload className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              {docFile ? docFile.name : 'Upload PDF Document or Invoice'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Maximum file size: 10MB (PDF, TXT)</p>
            <input
              type="file"
              accept=".pdf,text/*"
              onChange={(e) => setDocFile(e.target.files?.[0] || null)}
              className="hidden"
              id="doc-upload-sec"
            />
            <label
              htmlFor="doc-upload-sec"
              className="inline-block mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Select Document
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Custom Extraction Prompt (Optional)
            </label>
            <input
              type="text"
              value={docPrompt}
              onChange={(e) => setDocPrompt(e.target.value)}
              placeholder="e.g. Extract vendor GST, total billing amount, and payment terms"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            disabled={!docFile || docLoading}
            onClick={handleAnalyzeDocument}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {docLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{docLoading ? 'Analyzing Document with Gemini...' : 'Analyze Document'}</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Extracted Intelligence
          </h3>

          {docResult ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white">Document Type:</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                  {docResult.documentType}
                </span>
              </div>

              <div>
                <span className="font-bold text-white block mb-1">Executive Summary:</span>
                <p className="text-slate-300 leading-relaxed">{docResult.summary}</p>
              </div>

              {docResult.keyPoints && docResult.keyPoints.length > 0 && (
                <div>
                  <span className="font-bold text-white block mb-1">Key Observations:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    {docResult.keyPoints.map((kp, idx) => (
                      <li key={idx}>{kp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {docResult.extractedFields && Object.keys(docResult.extractedFields).length > 0 && (
                <div>
                  <span className="font-bold text-white block mb-1">Structured Fields:</span>
                  <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                    {JSON.stringify(docResult.extractedFields, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
              Upload a document and click Analyze Document to view results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
