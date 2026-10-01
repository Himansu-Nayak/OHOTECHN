'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Calendar,
  Layers,
  Building2,
  ShoppingBag,
  Code2,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatWithAi, getAiHealth } from '@/api/ai';
import { ProductDto } from '@/api/types';

interface MessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  executedTools?: string[];
  products?: ProductDto[];
  timestamp: string;
  isError?: boolean;
  canRetry?: boolean;
  lastPrompt?: string;
}

type ConnectionState = 'ONLINE' | 'CONNECTING' | 'BUSY' | 'UNAVAILABLE' | 'NOT_CONFIGURED';

function renderInlineStyles(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[11px]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && match[2] && match[3]) {
      const linkText = match[2];
      const linkHref = match[3];
      parts.push(
        <a
          key={match.index}
          href={linkHref}
          target={linkHref.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
        >
          {linkText}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function AiMarkdownText({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-white text-xs mt-2 mb-1">
              {renderInlineStyles(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-white text-sm mt-2 mb-1">
              {renderInlineStyles(trimmed.slice(3))}
            </h3>
          );
        }

        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
              <span className="text-indigo-400 font-bold shrink-0 mt-0.5 text-[10px]">•</span>
              <span className="flex-1 text-slate-200">
                {renderInlineStyles(trimmed.replace(/^[•\-\*]\s*/, ''))}
              </span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
              <span className="text-indigo-400 font-semibold font-mono shrink-0 text-[10px]">
                {numMatch[1]}.
              </span>
              <span className="flex-1 text-slate-200">
                {renderInlineStyles(numMatch[2])}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-200">
            {renderInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
}

function formatToolAction(tool: string): string {
  if (!tool) return '';
  if (tool === 'searchProducts') return 'Finding matching OHO TECH solutions…';
  if (tool === 'getOrderStatus') return 'Checking your order details…';
  if (tool === 'customEngineering' || tool === 'customDev') return 'Reviewing your custom development requirements…';
  if (tool === 'techArchitecture' || tool === 'techAdvisory') return 'Analyzing system architecture…';
  return tool;
}

function formatAiErrorMessage(error: any): string {
  if (error?.name === 'AbortError') return '';
  const msg = error?.message?.toLowerCase() || '';
  if (msg.includes('rate limit') || msg.includes('429')) {
    return "We're receiving a high number of requests. Please try again shortly.";
  }
  if (msg.includes('timeout') || msg.includes('timed out')) {
    return 'The request took longer than expected. Please try again.';
  }
  if (msg.includes('sign in') || msg.includes('login') || msg.includes('auth')) {
    return 'Please sign in to access that information.';
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
    return 'Our AI advisor is temporarily unavailable. Please try again in a moment.';
  }
  return "I couldn't complete that request. You can also contact the OHO TECH team for assistance at hello@ohotech.com.";
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [conversationId, setConversationId] = React.useState<number | undefined>();
  const [sessionId, setSessionId] = React.useState<string>('');
  const [connectionState, setConnectionState] = React.useState<ConnectionState>('CONNECTING');

  const [messages, setMessages] = React.useState<MessageItem[]>([]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Initialize or retrieve persistent anonymous session ID
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let stored = localStorage.getItem('oho_ai_session_id');
      if (!stored) {
        stored = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'sess_' + Date.now();
        localStorage.setItem('oho_ai_session_id', stored);
      }
      setSessionId(stored);
    }
  }, []);

  // Health check on mount / open
  React.useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function checkHealth() {
      try {
        const res = await getAiHealth();
        if (isMounted) {
          if (res.success && res.data) {
            if (res.data.status === 'READY') {
              setConnectionState('ONLINE');
            } else if (res.data.status === 'NOT_CONFIGURED') {
              setConnectionState('NOT_CONFIGURED');
            } else {
              setConnectionState('ONLINE');
            }
          } else {
            setConnectionState('UNAVAILABLE');
          }
        }
      } catch {
        if (isMounted) {
          setConnectionState('ONLINE');
        }
      }
    }

    checkHealth();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Handle ESC key to close widget
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clean up abort controller on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 15-second client timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    const userMessage: MessageItem = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInput('');
    setLoading(true);
    setConnectionState('BUSY');

    try {
      const res = await chatWithAi(
        {
          message: textToSend.trim(),
          conversationId,
          sessionId,
          feature: 'CHATBOT',
        },
        controller.signal
      );

      clearTimeout(timeoutId);

      if (res.success && res.data) {
        setConversationId(res.data.conversationId);
        setConnectionState('ONLINE');
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
        throw new Error(res.message || 'Unable to connect to AI advisory service');
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e?.name === 'AbortError') {
        const timeoutError: MessageItem = {
          id: 'err-' + Date.now(),
          role: 'model',
          content: 'The advisory request took longer than expected to process. Please retry your question.',
          isError: true,
          canRetry: true,
          lastPrompt: textToSend.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, timeoutError]);
        setConnectionState('ONLINE');
        return;
      }
      setConnectionState('UNAVAILABLE');
      const safeErrorText = formatAiErrorMessage(e);
      const errorMessage: MessageItem = {
        id: 'err-' + Date.now(),
        role: 'model',
        content: safeErrorText,
        isError: true,
        canRetry: true,
        lastPrompt: textToSend.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const startNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newSessionId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'sess_' + Date.now();
    if (typeof window !== 'undefined') {
      localStorage.setItem('oho_ai_session_id', newSessionId);
    }
    setSessionId(newSessionId);
    setConversationId(undefined);
    setMessages([]);
    setConnectionState('ONLINE');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-expanded={false}
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
        <div
          role="dialog"
          aria-modal="true"
          aria-label="OHO TECH AI Technical Advisory Desk"
          className="w-[380px] sm:w-[440px] h-[640px] max-h-[88vh] bg-slate-950/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
        >
          {/* HEADER */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-wide">OHO Advisory Desk</h3>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 text-[9px] font-mono rounded border uppercase font-medium',
                      connectionState === 'ONLINE' && 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                      connectionState === 'CONNECTING' && 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                      connectionState === 'BUSY' && 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 animate-pulse',
                      connectionState === 'UNAVAILABLE' && 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                      connectionState === 'NOT_CONFIGURED' && 'bg-slate-800 text-slate-300 border-slate-700'
                    )}
                  >
                    {connectionState === 'NOT_CONFIGURED' ? 'OFFLINE' : connectionState}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Architecture &amp; Solutions Consultation</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={startNewChat}
                title="Start New Conversation"
                aria-label="Reset Conversation"
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
                title="Close chat (Esc)"
                aria-label="Close Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CONVERSATION AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* EMPTY STATE */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950 border border-indigo-900/30 text-slate-300 space-y-3">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>How can OHO TECH help?</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    I am your AI Technology Advisor. You can ask me to:
                  </p>
                  <ul className="text-[11px] space-y-1.5 text-slate-300">
                    <li
                      onClick={() => handleSend('What software solutions does OHO TECH provide?')}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-indigo-950/50 cursor-pointer transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="group-hover:text-white">Find software solutions across 28+ turnkey platforms</span>
                    </li>
                    <li
                      onClick={() => handleSend('Compare hospital software and school ERP solutions.')}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-indigo-950/50 cursor-pointer transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="group-hover:text-white">Compare healthcare, ERP, and retail architectures</span>
                    </li>
                    <li
                      onClick={() => handleSend('I need custom software development for our business.')}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-indigo-950/50 cursor-pointer transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="group-hover:text-white">Discuss custom development &amp; cloud deployment</span>
                    </li>
                    <li
                      onClick={() => handleSend('Explain OHO TECH system architecture and tech stack.')}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-indigo-950/50 cursor-pointer transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="group-hover:text-white">Explain enterprise architecture &amp; distributed runtimes</span>
                    </li>
                    <li
                      onClick={() => handleSend('Can you help me check my order?')}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-indigo-950/50 cursor-pointer transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="group-hover:text-white">Check order information and invoices</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* MESSAGES FEED */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex gap-2.5 max-w-[92%]',
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white mt-0.5',
                    m.role === 'user'
                      ? 'bg-blue-600'
                      : m.isError
                      ? 'bg-amber-600'
                      : 'bg-gradient-to-br from-indigo-500 to-violet-600'
                  )}
                >
                  {m.role === 'user' ? (
                    <User className="w-3.5 h-3.5" />
                  ) : m.isError ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="space-y-2 max-w-[88%]">
                  <div
                    className={cn(
                      'px-3.5 py-2.5 rounded-2xl leading-relaxed',
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm whitespace-pre-wrap'
                        : m.isError
                        ? 'bg-amber-950/40 text-amber-200 border border-amber-800/50 rounded-tl-sm'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800/80 rounded-tl-sm'
                    )}
                  >
                    {m.role === 'user' ? m.content : <AiMarkdownText content={m.content} />}

                    {m.isError && m.canRetry && m.lastPrompt && (
                      <div className="mt-2 pt-2 border-t border-amber-800/40 flex justify-end">
                        <button
                          onClick={() => handleSend(m.lastPrompt)}
                          disabled={loading}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-800 text-amber-100 text-[10px] font-medium transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Retry Question</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Executed Tools / Customer Action Status */}
                  {m.executedTools && m.executedTools.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {m.executedTools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-slate-900/90 text-indigo-300 border border-indigo-900/40"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          <span>{formatToolAction(tool)}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* COMPACT PRODUCT CARDS */}
                  {m.products && m.products.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-indigo-400" />
                        Verified Turnkey Platforms:
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {m.products.map((p) => (
                          <div
                            key={p.id}
                            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-1.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-semibold text-white text-xs block">
                                  {p.name}
                                </span>
                                {p.categoryName && (
                                  <span className="text-[9px] text-indigo-400 font-mono">
                                    {p.categoryName}
                                  </span>
                                )}
                              </div>
                              {p.price != null && p.price > 0 ? (
                                <span className="text-emerald-400 font-mono text-[11px] shrink-0 font-semibold">
                                  ₹{p.price.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10px] shrink-0 font-medium">
                                  Contact us for pricing
                                </span>
                              )}
                            </div>
                            {p.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-2">
                                {p.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                              <Link
                                href={`/products/${p.id}`}
                                className="inline-flex items-center text-[10px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                              >
                                <span>View Solution</span>
                                <ChevronRight className="w-3 h-3 ml-0.5" />
                              </Link>
                              <Link
                                href="/book-demo"
                                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white transition-colors"
                              >
                                <Calendar className="w-2.5 h-2.5" />
                                <span>Request Demo</span>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {loading && (
              <div className="flex gap-2.5 mr-auto max-w-[85%]">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 text-white mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-300">OHO AI Thinking…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK ACTIONS */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-900 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { label: 'Explore Software', prompt: 'What software solutions does OHO TECH provide?' },
              { label: 'Get a Recommendation', prompt: 'Can you recommend software for a hospital or school?' },
              { label: 'Custom Development', prompt: 'I need custom software development for our platform.' },
              { label: 'Order Help', prompt: 'Can you help me check my order status?' },
            ].map((action, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSend(action.prompt)}
                className="px-2.5 py-1 rounded-full text-[10px] bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-white border border-slate-800 shrink-0 transition-colors disabled:opacity-50 hover:border-indigo-500/40 cursor-pointer"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
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
              placeholder="Ask OHO TECH..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              disabled={loading || !input.trim()}
              onClick={() => handleSend()}
              aria-label="Send message"
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-40 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
