'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  FileText, 
  Activity, 
  Layers, 
  RefreshCw,
  Database,
  ArrowRight,
  Lock,
  Search,
  MessageSquare,
  TrendingUp,
  Info
} from 'lucide-react';
import { AI_INNOVATION_CAPABILITIES, AiCapability } from '@/config/technology';

export function AiInnovationExperience() {
  const [selectedAiIndex, setSelectedAiIndex] = useState<number>(0);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationType, setSimulationType] = useState<'kyc' | 'rx' | 'stock'>('kyc');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const currentAi: AiCapability = AI_INNOVATION_CAPABILITIES[selectedAiIndex] || AI_INNOVATION_CAPABILITIES[0];

  const handleRunSimulator = (type: 'kyc' | 'rx' | 'stock') => {
    setSimulationType(type);
    setSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      setSimulating(false);
      if (type === 'kyc') {
        setSimulationResult(JSON.stringify({
          status: 'SUCCESS_VERIFIED',
          documentType: 'Aadhaar / Indian UID',
          extractedData: {
            name: 'Priyanka Sharma',
            uidLast4: '8841',
            dob: '1992-07-14',
            addressPincode: '751024',
            ocrConfidence: '99.4%'
          },
          fraudRiskScore: 'Low (0.02)',
          creditAmortizationEligible: 'APPROVED_₹3,50,000',
          executionLatency: '3.8 seconds'
        }, null, 2));
      } else if (type === 'rx') {
        setSimulationResult(JSON.stringify({
          status: 'SUCCESS_VERIFIED',
          inputChiefComplaint: 'Acute pharyngitis with fever and dry cough for 3 days',
          mappedIcd10: [
            { code: 'J02.9', description: 'Acute pharyngitis, unspecified', vectorSimilarity: 0.96 },
            { code: 'R05.1', description: 'Acute cough', vectorSimilarity: 0.91 }
          ],
          drugAllergyCheck: 'PASSED (Zero Penicillin cross-reactions)',
          prescribedRx: ['Azithromycin 500mg (OD x 3d)', 'Paracetamol 650mg SOS'],
          doctorSignatureRequired: true,
          executionLatency: '14.2 milliseconds'
        }, null, 2));
      } else {
        setSimulationResult(JSON.stringify({
          status: 'SUCCESS_VERIFIED',
          sku: 'SKU-88219 (Organic Arabica Coffee 500g)',
          currentShelfStock: '14 Units',
          depotSafetyFloor: '30 Units',
          salesVelocity7d: '18 Units / Day',
          suggestedReorderQuantity: '150 Units',
          automatedPoDispatch: 'DISPATCHED_TO_SUPPLIER_PO#40891',
          executionLatency: '86.4 milliseconds'
        }, null, 2));
      }
    }, 900);
  };

  return (
    <section id="ai-experience" className="mb-20 sm:mb-28">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>PRACTICAL ENTERPRISE AI • DETERMINISTIC AUTOMATION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            AI &amp; Intelligent Automation
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md">
          Pragmatic machine intelligence engineered for document parsing, semantic routing, and predictive business heuristics with zero hallucination risk.
        </p>
      </div>

      {/* Realistic AI Disclosure Banner */}
      <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-start gap-3.5 text-xs font-mono">
        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-purple-300 font-bold uppercase tracking-wider block">
            ARCHITECTURAL DISCLOSURE: GROUNDED &amp; COMPLIANT MACHINE INTELLIGENCE
          </span>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            OHO TECH does not deploy unverified artificial intelligence or make unsupported generative claims. All AI integrations are architected with <strong>deterministic rule-based fallbacks</strong>, private tenant vector sandboxing, and strict human-in-the-loop oversight to ensure 100% compliance with financial, clinical, and data privacy regulations.
          </p>
        </div>
      </div>

      {/* 4 AI Capabilities Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {AI_INNOVATION_CAPABILITIES.map((cap, idx) => {
          const isSelected = selectedAiIndex === idx;
          return (
            <button
              key={cap.id}
              onClick={() => setSelectedAiIndex(idx)}
              className={`p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#181524] border-purple-500/60 shadow-xl ring-1 ring-purple-500/30 text-white'
                  : 'bg-[#111215]/80 border-white/10 hover:border-white/25 text-slate-400 hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] mb-2">
                  <span className={isSelected ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                    CAPABILITY // 0{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 uppercase">
                    {cap.category.split(' ')[0]}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug mb-1 font-sans">
                  {cap.title}
                </h3>
              </div>

              <div className="font-mono text-[11px] text-purple-300 font-bold uppercase tracking-wider mt-4">
                {cap.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active AI Deep Inspector Card */}
      <div className="rounded-3xl bg-[#121318]/95 border border-white/15 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden mb-12">
        {/* Purple Ambient Aura */}
        <div className="absolute -top-32 -right-32 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-purple-500/15 rounded-full blur-[170px] pointer-events-none" />

        {/* Top Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8 font-mono text-xs">
          <div>
            <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-widest block mb-1">
              {currentAi.category} // AUTOMATION BLUEPRINT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
              {currentAi.title}
            </h3>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold">
            ZERO-HALLUCINATION GUARDRAILS ACTIVE
          </div>
        </div>

        {/* Narrative & Description */}
        <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed mb-8 max-w-4xl">
          {currentAi.description}
        </p>

        {/* 3 Benchmarks Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {currentAi.benchmarks.map((b, bIdx) => (
            <div key={bIdx} className="p-5 rounded-2xl bg-black/50 border border-white/10 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                {b.label}
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-400 mb-1">
                {b.value}
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                {b.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Deep Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/10 font-mono text-xs">
          
          {/* Left Column: Pipeline Architecture */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-purple-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>EXECUTION PIPELINE &amp; INGESTION</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                {currentAi.architecture}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="text-emerald-400 font-bold uppercase mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>DETERMINISTIC FALLBACK &amp; SAFETY GUARD</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                {currentAi.deterministicFallback}
              </p>
            </div>
          </div>

          {/* Right Column: Stack & Enterprise Verification */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-slate-400 uppercase font-bold text-[10px] mb-2">PRODUCTION TECHNOLOGY RUNTIME</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {currentAi.stack.map((s, sIdx) => (
                  <span key={sIdx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                    {s}
                  </span>
                ))}
              </div>

              <div className="text-slate-400 uppercase font-bold text-[10px] mb-1">ENTERPRISE APPLICATIONS</div>
              <div className="text-slate-200 font-sans text-xs mb-3">
                {currentAi.enterpriseApplication}
              </div>

              <div className="text-slate-400 uppercase font-bold text-[10px] mb-1">VERIFICATION GROUNDING</div>
              <div className="text-slate-300 font-sans text-xs">
                {currentAi.groundedVerification}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive AI Architecture Pipeline Simulator */}
      <div className="rounded-3xl bg-[#0d0e12] border border-white/15 p-6 sm:p-10 shadow-2xl font-mono">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>LIVE AI PIPELINE SIMULATOR &amp; TELEMETRY HARNESS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
              Test Deterministic AI Processing
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleRunSimulator('kyc')}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all ${
                simulationType === 'kyc' ? 'bg-purple-500 text-black' : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              KYC OCR SIMULATOR
            </button>
            <button
              onClick={() => handleRunSimulator('rx')}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all ${
                simulationType === 'rx' ? 'bg-purple-500 text-black' : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              CLINICAL RX NLP
            </button>
            <button
              onClick={() => handleRunSimulator('stock')}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all ${
                simulationType === 'stock' ? 'bg-purple-500 text-black' : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              STOCK REORDER HEURISTICS
            </button>
          </div>
        </div>

        {/* Pipeline Execution Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-8 text-xs">
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between">
            <span className="text-purple-400 font-bold block mb-1">STEP 01</span>
            <div className="text-white font-bold mb-1">Payload Ingress</div>
            <span className="text-[10px] text-slate-400">REST / Meta Webhook Ingestion</span>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between">
            <span className="text-purple-400 font-bold block mb-1">STEP 02</span>
            <div className="text-white font-bold mb-1">OCR &amp; Tokenizer</div>
            <span className="text-[10px] text-slate-400">Image Prep &amp; Field Detection</span>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between">
            <span className="text-purple-400 font-bold block mb-1">STEP 03</span>
            <div className="text-white font-bold mb-1">Vector Similarity</div>
            <span className="text-[10px] text-slate-400">pgvector HNSW Match</span>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between">
            <span className="text-purple-400 font-bold block mb-1">STEP 04</span>
            <div className="text-white font-bold mb-1">Rule Fallback Check</div>
            <span className="text-[10px] text-slate-400">Hard Constraint Validator</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
            <span className="text-emerald-400 font-bold block mb-1">STEP 05</span>
            <div className="text-white font-bold mb-1">ACID Ledger Commit</div>
            <span className="text-[10px] text-emerald-400">Immutable JSONB Write</span>
          </div>
        </div>

        {/* Live Output Terminal */}
        <div className="rounded-2xl bg-black/90 border border-white/10 p-5 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-slate-400">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
              <span>pipeline-execution-trace.json</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">
              {simulating ? 'PROCESSING TENSORS...' : 'DETERMINISTIC EXECUTION COMPLETE'}
            </span>
          </div>

          {simulating ? (
            <div className="py-12 text-center text-purple-300 font-bold animate-pulse">
              Running neural tokenizer, pgvector match, and deterministic fallback validation...
            </div>
          ) : (
            <pre className="text-[11px] text-emerald-300 overflow-x-auto leading-relaxed p-3 rounded-xl bg-white/[0.02] border border-white/5">
              {simulationResult || JSON.stringify({
                status: 'READY_TO_TEST',
                selectedPipeline: simulationType.toUpperCase(),
                message: 'Click any simulator button above to run real-time inference telemetry and inspect structured JSON verification output.'
              }, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
