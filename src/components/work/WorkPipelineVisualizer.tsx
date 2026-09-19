'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  CheckCircle2, 
  Database, 
  Layers, 
  Server, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { WorkProject } from '@/config/work';

interface WorkPipelineVisualizerProps {
  project: WorkProject;
}

export function WorkPipelineVisualizer({ project }: WorkPipelineVisualizerProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'step-1',
      title: '01 • TELEMETRY & INGESTION',
      label: 'Intake & Auth',
      metric: '< 12ms',
      description: project.introduction.scope[0] || 'High-throughput edge ingestion with token validation and rate-limiting.',
      icon: Zap
    },
    {
      id: 'step-2',
      title: '02 • TRANSACTION ISOLATION',
      label: 'Tenant Core',
      metric: '99.999% SLA',
      description: project.introduction.scope[1] || 'Tenant boundary enforcement with encrypted multi-region database replication.',
      icon: ShieldCheck
    },
    {
      id: 'step-3',
      title: '03 • STATE ENGINE & SYNC',
      label: 'Real-Time Sync',
      metric: 'Sub-Second',
      description: project.introduction.scope[2] || 'Bidirectional WebSockets queue distributing real-time state changes to all connected consoles.',
      icon: Activity
    },
    {
      id: 'step-4',
      title: '04 • EVENT DISPATCH',
      label: 'Audit & Ledgers',
      metric: 'Zero Data Loss',
      description: project.introduction.scope[3] || 'Immutable audit logging, automated reconciliation, and webhook dispatch.',
      icon: Database
    },
  ];

  return (
    <section className="py-14 sm:py-20 border-b border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
            METHODOLOGY • WORKFLOW PIPELINE
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
            How The Architecture Operates
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-sm">
          Interactive execution path from request entry to verified ledger persistence.
        </p>
      </div>

      {/* Step Buttons (Flat Hairline Tab Strip) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 sm:p-5 text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] ${
                isActive
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg'
                  : 'bg-[#111216]/60 border-white/10 text-slate-400 hover:text-white hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
                  {step.label}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>
              <div className="font-mono text-xs font-black tracking-tight text-white">
                {step.metric}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Showcase Frame */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-[#111216] border border-white/10 p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                {steps[activeStep].title}
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-4">
                {steps[activeStep].description}
              </h4>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 pt-4 border-t border-white/10">
                <div>
                  <span className="text-slate-500">RUNTIME: </span>
                  <span className="text-white">{project.architecture.frontend.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-slate-500">BACKEND: </span>
                  <span className="text-white">{project.architecture.services.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-slate-500">CORE DB: </span>
                  <span className="text-emerald-400">{project.architecture.database.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-black/60 p-5 border border-white/10 font-mono text-xs space-y-2.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                TELEMETRY ENFORCEMENT
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Verification:</span>
                <span className="text-emerald-400 font-bold">STRICT_ACID</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Encryption:</span>
                <span className="text-white font-bold">AES-256-GCM</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Throughput:</span>
                <span className="text-emerald-400 font-bold">{project.quickSpecs.targetThroughput}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
export default WorkPipelineVisualizer;
