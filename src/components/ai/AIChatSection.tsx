'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bot, Send, User, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatWithAi } from '@/api/ai';
import { ProductDto } from '@/api/types';

export function AIChatSection() {
  const [chatMessages, setChatMessages] = React.useState<Array<{
    id: string;
    role: 'user' | 'model';
    content: string;
    tools?: string[];
    products?: ProductDto[];
    time: string;
  }>>([
    {
      id: 'init-1',
      role: 'model',
      content: 'Welcome to OHO TECH AI Intelligence. Powered by Google Gemini, I am ready to advise you on enterprise systems architecture, 28+ turnkey software products, or custom engineering.',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = React.useState('');
  const [chatLoading, setChatLoading] = React.useState(false);
  const [conversationId, setConversationId] = React.useState<number | undefined>();
  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = async (override?: string) => {
    const text = override || chatInput;
    if (!text.trim() || chatLoading) return;

    const userEntry = {
      id: 'usr-' + Date.now(),
      role: 'user' as const,
      content: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userEntry]);
    if (!override) setChatInput('');
    setChatLoading(true);

    try {
      const res = await chatWithAi({
        message: text.trim(),
        conversationId,
        feature: 'CHATBOT',
      });

      if (res.success && res.data) {
        const responseData = res.data;
        setConversationId(responseData.conversationId);
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'mod-' + Date.now(),
            role: 'model',
            content: responseData.message,
            tools: responseData.executedTools,
            products: responseData.products,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(res.message);
      }
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'model',
          content: e.message || 'AI service is temporarily unavailable. Please retry.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            Conversational AI Assistant
          </h2>
          <p className="text-xs text-slate-400">
            Real-time knowledge across 28+ OHO TECH turnkey platforms, order tracking, and custom engineering.
          </p>
        </div>
        <button
          onClick={() => {
            setConversationId(undefined);
            setChatMessages([
              {
                id: 'new-' + Date.now(),
                role: 'model',
                content: 'Session reset. How can I assist your enterprise today?',
                time: 'Just now',
              },
            ]);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </div>

      <div className="h-[460px] overflow-y-auto space-y-4 pr-2 text-xs">
        {chatMessages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex gap-3 max-w-[85%]',
              m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            )}
          >
            <div
              className={cn(
                'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white mt-0.5',
                m.role === 'user'
                  ? 'bg-blue-600'
                  : 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20'
              )}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2">
              <div
                className={cn(
                  'px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-wrap text-sm',
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-md'
                )}
              >
                {m.content}
              </div>

              {m.tools && m.tools.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {m.tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-slate-900 text-indigo-300 border border-indigo-500/20 font-mono"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Tool: {t}
                    </span>
                  ))}
                </div>
              )}

              {m.products && m.products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {m.products.map((p) => (
                    <Link
                      key={p.id}
                      href="/products"
                      className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-emerald-400 font-mono text-xs shrink-0 font-bold">
                          ₹{p.price?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {p.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 text-white mt-0.5">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800">
        {[
          'Show me hospital & healthcare software',
          'What is included in School ERP?',
          'How do I track order status?',
          'Multi-vendor e-commerce platform pricing',
        ].map((qp, idx) => (
          <button
            key={idx}
            disabled={chatLoading}
            onClick={() => handleSendChat(qp)}
            className="px-3 py-1.5 rounded-full text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 shrink-0 transition-colors disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={chatInput}
          disabled={chatLoading}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendChat();
            }
          }}
          placeholder="Ask about software features, pricing, architecture, or order statuses..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          disabled={chatLoading || !chatInput.trim()}
          onClick={() => handleSendChat()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
