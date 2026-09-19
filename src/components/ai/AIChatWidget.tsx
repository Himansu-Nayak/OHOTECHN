'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, X, Send, Bot, User, ArrowRight, RefreshCw, MessageSquare, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatWithAi, AiChatResponse } from '@/api/ai';
import { ProductDto } from '@/api/types';

interface MessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  executedTools?: string[];
  products?: ProductDto[];
  timestamp: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [conversationId, setConversationId] = React.useState<number | undefined>();
  const [messages, setMessages] = React.useState<MessageItem[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: 'Welcome to OHO TECH Technical Advisory. How can we assist you with our turnkey software platforms, custom system architecture, or solution deployments today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: MessageItem = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await chatWithAi({
        message: textToSend.trim(),
        conversationId,
        feature: 'CHATBOT',
      });

      if (res.success && res.data) {
        setConversationId(res.data.conversationId);
        const botMessage: MessageItem = {
          id: 'model-' + Date.now(),
          role: 'model',
          content: res.data.message,
          executedTools: res.data.executedTools,
          products: res.data.products,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(res.message || 'Unable to connect to AI engine');
      }
    } catch (e: any) {
      const errorMessage: MessageItem = {
        id: 'err-' + Date.now(),
        role: 'model',
        content: e.message || 'The advisory desk is momentarily busy. Please try again shortly or contact our team directly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setConversationId(undefined);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'model',
        content: 'New session started. How can we assist you in exploring OHO TECH architecture and solutions today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open OHO TECH Technical Advisory Desk"
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-full shadow-[0_10px_35px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 border border-indigo-400/30"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-700 animate-pulse" />
          </div>
          <span className="text-xs font-semibold tracking-wide">OHO Advisory Desk</span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-200 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Slide-over Chat Box */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[580px] max-h-[85vh] bg-slate-950/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-wide">OHO Advisory Desk</h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Architecture &amp; Solutions Consultation</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={startNewChat}
                title="Start New Conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <Link
                href="/ai"
                title="Full AI Intelligence Hub"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex gap-2.5 max-w-[88%]',
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white mt-0.5',
                    m.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-br from-indigo-500 to-violet-600'
                  )}
                >
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={cn(
                      'px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap',
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800/80 rounded-tl-sm'
                    )}
                  >
                    {m.content}
                  </div>

                  {/* Executed Tools Badge */}
                  {m.executedTools && m.executedTools.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {m.executedTools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-900 text-slate-400 border border-slate-800 font-mono"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Product Recommendations Cards */}
                  {m.products && m.products.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                        Matching Turnkey Solutions:
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {m.products.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products`}
                            className="block p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-200 group-hover:text-white truncate">
                                {p.name}
                              </span>
                              <span className="text-emerald-400 font-mono text-[11px] shrink-0 ml-2">
                                ₹{p.price?.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {p.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 mr-auto max-w-[85%]">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 text-white mt-0.5">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-900 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              'ERP Solutions',
              'Hospital Management',
              'Order Status',
              'Custom Development',
            ].map((prompt, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-2">
            <input
              type="text"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about 28+ software solutions or orders..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              disabled={loading || !input.trim()}
              onClick={() => handleSend()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-40 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
