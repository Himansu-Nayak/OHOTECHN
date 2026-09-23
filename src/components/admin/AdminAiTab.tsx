'use client';

import * as React from 'react';
import {
  Sparkles,
  Bot,
  FileText,
  TrendingUp,
  RefreshCw,
  Save,
  Database,
  Cpu,
  Activity,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import {
  generateAdminProductCopy,
  applyAdminProductCopy,
  summarizeAdminEnquiries,
  getAdminAnalyticsAiInsight,
  syncAdminProductEmbeddings,
  getAdminAiUsageApi,
  getAdminAiConversationsApi,
  ProductAiGenerationResponse,
  AnalyticsInsightResponse
} from '@/api/ai';
import { getAdminProductsApi } from '@/api/products';
import { ProductDto } from '@/api/types';
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminInput,
  AdminSelect,
  AdminEmptyState,
  AdminTableSkeleton
} from './AdminUiPrimitives';

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

  // Telemetry state
  const [usageLogs, setUsageLogs] = React.useState<any[]>([]);
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [loadingTelemetry, setLoadingTelemetry] = React.useState(false);

  const fetchTelemetry = async () => {
    setLoadingTelemetry(true);
    try {
      const [usageRes, convRes] = await Promise.all([
        getAdminAiUsageApi().catch(() => ({ success: false, data: [] })),
        getAdminAiConversationsApi().catch(() => ({ success: false, data: [] })),
      ]);
      if (usageRes.success && usageRes.data) {
        setUsageLogs(usageRes.data);
      }
      if (convRes.success && convRes.data) {
        setConversations(convRes.data);
      }
    } catch {
      // Telemetry fetch non-blocking
    } finally {
      setLoadingTelemetry(false);
    }
  };

  // Load products & telemetry on mount
  React.useEffect(() => {
    getAdminProductsApi(0, 50).then((res) => {
      if (res.success && res.data?.content) {
        setProductsList(res.data.content);
        if (res.data.content.length > 0) {
          setSelectedProductId(res.data.content[0].id);
        }
      }
    }).catch(() => {});

    fetchTelemetry();
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
        fetchTelemetry();
      } else {
        throw new Error(res.message);
      }
    } catch (e: any) {
      showToast(e?.message || 'Generation failed', 'error');
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
      showToast(e?.message || 'Failed to apply copy', 'error');
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
        fetchTelemetry();
      }
    } catch (e: any) {
      showToast(e?.message || 'Summarization failed', 'error');
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
        fetchTelemetry();
      }
    } catch (e: any) {
      showToast(e?.message || 'Insights generation failed', 'error');
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
        fetchTelemetry();
      }
    } catch (e: any) {
      showToast(e?.message || 'Embedding sync failed', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Aggregated usage numbers
  const totalTokens = usageLogs.reduce((acc, u) => acc + (u.totalTokens || 0), 0);
  const promptTokens = usageLogs.reduce((acc, u) => acc + (u.promptTokens || 0), 0);
  const completionTokens = usageLogs.reduce((acc, u) => acc + (u.candidateTokens || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Operations &amp; Intelligence Suite</h1>
            <AdminBadge variant="primary">Gemini 2.5 Flash</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            Automated catalog generation, executive inquiry synthesis, RAG vector indexing, and token telemetry.
          </p>
        </div>

        <AdminButton
          variant="secondary"
          size="sm"
          disabled={isSyncing}
          onClick={handleSyncEmbeddings}
          leftIcon={isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5 text-slate-600" />}
        >
          {isSyncing ? 'Syncing Embeddings...' : 'Sync Vector Catalog'}
        </AdminButton>
      </div>

      {/* Main AI Generation Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Copy Generator */}
        <div className="lg:col-span-6">
          <AdminCard className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <Bot className="w-5 h-5 text-slate-700" />
              <h2 className="font-bold text-slate-900 text-sm">Product Description &amp; Catalog Generator</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Product Name</label>
                <AdminInput
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <AdminInput
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                  <AdminInput
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Key Capabilities &amp; Features</label>
                <textarea
                  rows={2}
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tech Specs &amp; Architecture</label>
                <AdminInput
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                />
              </div>

              <AdminButton
                variant="primary"
                disabled={isGenerating}
                onClick={handleGenerateCopy}
                className="w-full justify-center"
                leftIcon={isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              >
                {isGenerating ? 'Generating with Gemini...' : 'Generate Structured Copy & SEO'}
              </AdminButton>
            </div>

            {generatedCopy && (
              <div className="pt-4 border-t border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Generated Preview</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedProductId || ''}
                      onChange={(e) => setSelectedProductId(Number(e.target.value))}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs focus:outline-none"
                    >
                      {productsList.map((p) => (
                        <option key={p.id} value={p.id}>
                          Apply to: #{p.id} - {p.name}
                        </option>
                      ))}
                    </select>
                    <AdminButton
                      variant="primary"
                      size="sm"
                      disabled={isApplying}
                      onClick={handleApplyToProduct}
                      leftIcon={<Save className="w-3 h-3" />}
                    >
                      Apply &amp; Save
                    </AdminButton>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 max-h-60 overflow-y-auto">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Short Pitch</span>
                    <p className="text-slate-800 font-medium">{generatedCopy.shortDescription}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Long Description</span>
                    <p className="text-slate-600 whitespace-pre-wrap">{generatedCopy.longDescription}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">SEO Meta</span>
                    <p className="text-slate-900 font-mono text-[11px] font-semibold">{generatedCopy.seoTitle}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{generatedCopy.seoDescription}</p>
                  </div>
                </div>
              </div>
            )}
          </AdminCard>
        </div>

        {/* Right Column: Inquiries Summary & Strategic Growth */}
        <div className="lg:col-span-6 space-y-6">
          <AdminCard className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-700" />
                <h2 className="font-bold text-slate-900 text-sm">Customer Inquiries &amp; Lead Synthesis</h2>
              </div>
              <AdminButton
                variant="secondary"
                size="sm"
                disabled={isSummarizing}
                onClick={handleSummarizeEnquiries}
                leftIcon={isSummarizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              >
                Summarize
              </AdminButton>
            </div>

            {enquiriesSummary ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-500 text-xs border-b border-slate-200 pb-2">
                  <span>Total Inquiries: <strong className="text-slate-900">{enquiriesSummary.totalEnquiries}</strong></span>
                  <AdminBadge variant="success">Gemini Synthesized</AdminBadge>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{enquiriesSummary.summary}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Click Summarize to analyze customer messages, extract demand patterns, and highlight urgent inquiries.
              </p>
            )}
          </AdminCard>

          <AdminCard className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h2 className="font-bold text-slate-900 text-sm">Executive AI Growth &amp; Intelligence</h2>
              </div>
              <AdminButton
                variant="primary"
                size="sm"
                disabled={isInsightsLoading}
                onClick={handleGetAnalyticsInsights}
                leftIcon={isInsightsLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              >
                Generate Report
              </AdminButton>
            </div>

            {analyticsInsight ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Executive Summary</span>
                  <p className="text-slate-800 mt-1 leading-relaxed">{analyticsInsight.executiveSummary}</p>
                </div>

                {analyticsInsight.strategicOpportunities && (
                  <div>
                    <span className="font-bold text-emerald-700 uppercase text-[10px]">Strategic Opportunities</span>
                    <ul className="list-disc pl-4 text-slate-700 mt-1 space-y-1">
                      {analyticsInsight.strategicOpportunities.map((op, i) => (
                        <li key={i}>{op}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analyticsInsight.recommendedNextSteps && (
                  <div>
                    <span className="font-bold text-slate-900 uppercase text-[10px]">Recommended Actions</span>
                    <ul className="list-disc pl-4 text-slate-700 mt-1 space-y-1">
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
          </AdminCard>
        </div>
      </div>

      {/* Real AI Telemetry & Usage Logs */}
      <AdminCard className="p-5 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-slate-900 text-sm">Real AI Telemetry &amp; Token Accounting</h2>
          </div>
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={fetchTelemetry}
            disabled={loadingTelemetry}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loadingTelemetry ? 'animate-spin' : ''}`} />}
          >
            Refresh Telemetry
          </AdminButton>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Tokens</span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">{totalTokens.toLocaleString()}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Prompt Tokens</span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">{promptTokens.toLocaleString()}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Completion Tokens</span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">{completionTokens.toLocaleString()}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Invocations</span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">{usageLogs.length}</div>
          </div>
        </div>

        {/* Recent Invocations Table */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent AI Invocations</span>
          {usageLogs.length === 0 ? (
            <AdminEmptyState
              title="No AI requests recorded"
              description="Generate a product description or executive insights above to initialize telemetry."
              icon={<Cpu className="w-6 h-6 text-slate-400" />}
            />
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Timestamp</th>
                    <th className="px-4 py-2.5">Feature</th>
                    <th className="px-4 py-2.5">Model</th>
                    <th className="px-4 py-2.5">Prompt Tokens</th>
                    <th className="px-4 py-2.5">Completion Tokens</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usageLogs.slice(0, 10).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-2 text-slate-500 font-mono text-[11px]">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN') : '—'}
                      </td>
                      <td className="px-4 py-2 font-semibold text-slate-900">{log.feature}</td>
                      <td className="px-4 py-2 font-mono text-[11px] text-slate-600">{log.model}</td>
                      <td className="px-4 py-2 font-mono text-slate-600">{log.promptTokens || 0}</td>
                      <td className="px-4 py-2 font-mono text-slate-600">{log.candidateTokens || 0}</td>
                      <td className="px-4 py-2 font-mono text-right font-bold text-slate-900">{log.totalTokens || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminCard>
    </div>
  );
}
