'use client';

import * as React from 'react';
import {
  Sparkles,
  Bot,
  FileText,
  TrendingUp,
  RefreshCw,
  Save,
  Database
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import {
  generateAdminProductCopy,
  applyAdminProductCopy,
  summarizeAdminEnquiries,
  getAdminAnalyticsAiInsight,
  syncAdminProductEmbeddings,
  ProductAiGenerationResponse,
  AnalyticsInsightResponse
} from '@/api/ai';
import { getAdminProductsApi } from '@/api/products';
import { ProductDto } from '@/api/types';

export function AdminAiTab() {
  const { showToast } = useToast();

  // Generator State
  const [productName, setProductName] = React.useState('Hospital & Clinic Management Suite');
  const [category, setCategory] = React.useState('Healthcare');
  const [targetAudience, setTargetAudience] = React.useState('Hospitals, Specialty Clinics, Diagnostic Centers');
  const [keyFeatures, setKeyFeatures] = React.useState('OPD/IPD management, EMR, NABH compliance, pharmacy & lab integration, automated billing');
  const [specifications, setSpecifications] = React.useState('PostgreSQL, Cloud Native, Multi-branch sync, REST APIs');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedCopy, setGeneratedCopy] = React.useState<ProductAiGenerationResponse | null>(null);

  // Products for applying copy
  const [productsList, setProductsList] = React.useState<ProductDto[]>([]);
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(null);
  const [isApplying, setIsApplying] = React.useState(false);

  // Enquiries summary state
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [enquiriesSummary, setEnquiriesSummary] = React.useState<{ summary: string; totalEnquiries: number } | null>(null);

  // Analytics insight state
  const [isInsightsLoading, setIsInsightsLoading] = React.useState(false);
  const [analyticsInsight, setAnalyticsInsight] = React.useState<AnalyticsInsightResponse | null>(null);

  // Embedding sync state
  const [isSyncing, setIsSyncing] = React.useState(false);

  // Load products on mount
  React.useEffect(() => {
    getAdminProductsApi(0, 50).then((res) => {
      if (res.success && res.data?.content) {
        setProductsList(res.data.content);
        if (res.data.content.length > 0) {
          setSelectedProductId(res.data.content[0].id);
        }
      }
    }).catch(() => {});
  }, []);

  const handleGenerateCopy = async () => {
    if (!productName.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await generateAdminProductCopy({
        productName,
        category,
        targetAudience,
        keyFeatures,
        specifications,
      });
      if (res.success && res.data) {
        setGeneratedCopy(res.data);
        showToast('AI descriptions generated successfully!', 'success');
      } else {
        throw new Error(res.message);
      }
    } catch (e: any) {
      showToast(e.message || 'Generation failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToProduct = async () => {
    if (!selectedProductId || !generatedCopy) return;
    setIsApplying(true);
    try {
      const res = await applyAdminProductCopy(selectedProductId, generatedCopy);
      if (res.success) {
        showToast('Generated AI copy applied to Product #' + selectedProductId, 'success');
      } else {
        throw new Error(res.message);
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to apply copy', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSummarizeEnquiries = async () => {
    setIsSummarizing(true);
    try {
      const res = await summarizeAdminEnquiries();
      if (res.success && res.data) {
        setEnquiriesSummary(res.data);
        showToast('Enquiries summarized by Gemini AI', 'success');
      }
    } catch (e: any) {
      showToast(e.message || 'Summarization failed', 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGetAnalyticsInsights = async () => {
    setIsInsightsLoading(true);
    try {
      const res = await getAdminAnalyticsAiInsight();
      if (res.success && res.data) {
        setAnalyticsInsight(res.data);
        showToast('Strategic insights generated', 'success');
      }
    } catch (e: any) {
      showToast(e.message || 'Insights generation failed', 'error');
    } finally {
      setIsInsightsLoading(false);
    }
  };

  const handleSyncEmbeddings = async () => {
    setIsSyncing(true);
    try {
      const res = await syncAdminProductEmbeddings();
      if (res.success) {
        showToast('Catalog embeddings synced for semantic vector search', 'success');
      }
    } catch (e: any) {
      showToast(e.message || 'Embedding sync failed', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">OHO TECH AI Admin Intelligence Suite</h2>
            <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              ROLE_ADMIN ONLY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated catalog generation, executive enquiry synthesis, RAG vector indexing, and growth analytics.
          </p>
        </div>

        <button
          disabled={isSyncing}
          onClick={handleSyncEmbeddings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors shrink-0 disabled:opacity-50"
        >
          {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{isSyncing ? 'Syncing Embeddings...' : 'Sync RAG Vector Catalog'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">AI Product Description & Catalog Generator</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Key Capabilities & Features</label>
              <textarea
                rows={2}
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Tech Specs & Architecture</label>
              <input
                type="text"
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              disabled={isGenerating}
              onClick={handleGenerateCopy}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isGenerating ? 'Generating with Gemini...' : 'Generate Structured Copy & SEO'}</span>
            </button>
          </div>

          {generatedCopy && (
            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">Generated Preview</span>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedProductId || ''}
                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                  >
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        Apply to: #{p.id} - {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={isApplying}
                    onClick={handleApplyToProduct}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3 h-3" />
                    <span>Apply & Save</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 max-h-60 overflow-y-auto">
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Short Pitch</span>
                  <p className="text-slate-200">{generatedCopy.shortDescription}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Long Description</span>
                  <p className="text-slate-300 whitespace-pre-wrap">{generatedCopy.longDescription}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">SEO Meta</span>
                  <p className="text-indigo-300 font-mono text-[11px]">{generatedCopy.seoTitle}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{generatedCopy.seoDescription}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Customer Enquiries & Lead Synthesis</h3>
              </div>
              <button
                disabled={isSummarizing}
                onClick={handleSummarizeEnquiries}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSummarizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>Summarize</span>
              </button>
            </div>

            {enquiriesSummary ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                  <span>Total Enquiries: {enquiriesSummary.totalEnquiries}</span>
                  <span className="text-emerald-400 font-semibold">Gemini Synthesized</span>
                </div>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{enquiriesSummary.summary}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Click Summarize to analyze customer messages, extract demand patterns, and highlight urgent inquiries.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Executive AI Growth & Business Intelligence</h3>
              </div>
              <button
                disabled={isInsightsLoading}
                onClick={handleGetAnalyticsInsights}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isInsightsLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>Generate Report</span>
              </button>
            </div>

            {analyticsInsight ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Executive Summary</span>
                  <p className="text-slate-200 mt-1 leading-relaxed">{analyticsInsight.executiveSummary}</p>
                </div>

                {analyticsInsight.strategicOpportunities && (
                  <div>
                    <span className="font-bold text-emerald-400 uppercase text-[10px]">Strategic Opportunities</span>
                    <ul className="list-disc pl-4 text-slate-300 mt-1 space-y-1">
                      {analyticsInsight.strategicOpportunities.map((op, i) => (
                        <li key={i}>{op}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analyticsInsight.recommendedNextSteps && (
                  <div>
                    <span className="font-bold text-indigo-400 uppercase text-[10px]">Recommended Actions</span>
                    <ul className="list-disc pl-4 text-slate-300 mt-1 space-y-1">
                      {analyticsInsight.recommendedNextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Click Generate Report to produce real-time executive insights based on orders, users, and platform revenue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
