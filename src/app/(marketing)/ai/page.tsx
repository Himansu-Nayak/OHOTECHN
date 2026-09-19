'use client';

import * as React from 'react';
import { Sparkles, Bot, Compass, FileText, Image as ImageIcon, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIChatSection } from '@/components/ai/AIChatSection';
import { AIRecommenderSection } from '@/components/ai/AIRecommenderSection';
import { AIDocumentSection } from '@/components/ai/AIDocumentSection';
import { AIImageSection } from '@/components/ai/AIImageSection';
import { AIClassifierSection } from '@/components/ai/AIClassifierSection';

export default function AiIntelligencePage() {
  const [activeTab, setActiveTab] = React.useState<
    'chat' | 'recommender' | 'document' | 'image' | 'classifier'
  >('chat');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini AI Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400 text-[11px]">Server-Side Isolated</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              OHO TECH <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">AI Intelligence Hub</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Experience the next generation of enterprise automation. Seamlessly query 28+ turnkey software products, analyze technical documents, extract visual metadata, and discover customized digital solutions.
            </p>
          </div>

          {/* Module Navigation Tabs */}
          <div className="relative z-10 pt-8 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/80 mt-8">
            {[
              { id: 'chat', label: 'AI Copilot & Support', icon: Bot },
              { id: 'recommender', label: 'Solution Recommender', icon: Compass },
              { id: 'document', label: 'Document & Invoice OCR', icon: FileText },
              { id: 'image', label: 'Vision & Asset Inspector', icon: ImageIcon },
              { id: 'classifier', label: 'Query Intent Classifier', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border',
                    active
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Modules */}
        {activeTab === 'chat' && <AIChatSection />}
        {activeTab === 'recommender' && <AIRecommenderSection />}
        {activeTab === 'document' && <AIDocumentSection />}
        {activeTab === 'image' && <AIImageSection />}
        {activeTab === 'classifier' && <AIClassifierSection />}

      </div>
    </div>
  );
}
