import { useEffect, useRef, useState } from 'react';
import {
  Send,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  MessageSquare,
  History,
  X,
  Sparkles,
  Database,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SUGGESTIONS = [
  'What is the difference between a cold and the flu?',
  'What does dehydration mean?',
  'How can I prepare for a doctor\'s appointment?',
  'Explain blood pressure in simple terms.',
  'What questions should I ask my pharmacist about a medication?',
  'How do I book a routine appointment?',
];

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
          return (
            <div key={idx} className="font-semibold text-slate-900 pt-1 text-sm sm:text-base">
              {trimmed.slice(2, -2)}
            </div>
          );
        }
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-blue-600 font-bold select-none">•</span>
              <span>{renderInlineMarkdown(trimmed.slice(2))}</span>
            </div>
          );
        }
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-blue-600 font-semibold text-xs pt-0.5 select-none">{numMatch[1]}.</span>
              <span>{renderInlineMarkdown(numMatch[2])}</span>
            </div>
          );
        }
        if (trimmed.startsWith('*') && trimmed.endsWith('*') && trimmed.length > 2) {
          return (
            <div key={idx} className="text-xs text-slate-500 italic pt-1">
              {trimmed.slice(1, -1)}
            </div>
          );
        }
        return <p key={idx}>{renderInlineMarkdown(trimmed)}</p>;
      })}
    </div>
  );
}

export function Chat() {
  const { state, dispatch, sendMessage, isTyping } = useApp();
  const [input, setInput] = useState('');
  const [showMobileList, setShowMobileList] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const active = state.conversations.find((c) => c.id === state.activeConversationId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    await sendMessage(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleDemoMode = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { demoMode: !state.settings.demoMode },
    });
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6.5rem)] flex gap-4">
      {/* Conversation list - desktop */}
      <div className="hidden md:flex w-60 shrink-0 flex-col bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-3 border-b border-[#E2E8F0] flex items-center justify-between">
          <span className="text-sm font-semibold text-[#0F172A]">Conversations</span>
          <button
            onClick={() => dispatch({ type: 'NEW_CONVERSATION' })}
            className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
            aria-label="New conversation"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {state.conversations.length === 0 && (
            <p className="text-xs text-[#64748B] p-2">No conversations yet.</p>
          )}
          {state.conversations.map((c) => (
            <div
              key={c.id}
              className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-all ${
                c.id === state.activeConversationId
                  ? 'bg-blue-50 text-blue-900 font-medium border border-blue-100'
                  : 'text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
            >
              <button
                onClick={() => dispatch({ type: 'SET_ACTIVE_CONVERSATION', id: c.id })}
                className="flex-1 text-left truncate mr-1"
              >
                {c.title || 'Untitled'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'DELETE_CONVERSATION', id: c.id });
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 rounded transition-opacity"
                aria-label={`Delete ${c.title || 'conversation'}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile conversation modal */}
      {showMobileList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 md:hidden">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="font-semibold text-[#0F172A]">Conversations</span>
              <button
                onClick={() => setShowMobileList(false)}
                className="p-1 rounded hover:bg-[#F1F5F9]"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-3 border-b border-[#E2E8F0]">
              <button
                onClick={() => {
                  dispatch({ type: 'NEW_CONVERSATION' });
                  setShowMobileList(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                <Plus size={16} /> New Conversation
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {state.conversations.length === 0 && (
                <p className="text-xs text-[#64748B] p-3 text-center">No conversations yet.</p>
              )}
              {state.conversations.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                    c.id === state.activeConversationId
                      ? 'bg-blue-50 text-blue-900 font-medium border border-blue-100'
                      : 'text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <button
                    onClick={() => {
                      dispatch({ type: 'SET_ACTIVE_CONVERSATION', id: c.id });
                      setShowMobileList(false);
                    }}
                    className="flex-1 text-left truncate mr-2"
                  >
                    {c.title || 'Untitled'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'DELETE_CONVERSATION', id: c.id });
                    }}
                    className="p-1 text-[#64748B] hover:text-red-600"
                    aria-label={`Delete ${c.title || 'conversation'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main chat */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden min-w-0">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold text-[#0F172A] flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600 shrink-0" />
              <span className="truncate">{state.settings.assistantName}</span>
              {state.settings.demoMode ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <Database size={11} className="text-blue-600" /> Demo Engine
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles size={11} className="text-blue-600" />
                  {state.settings.apiKey ? 'Gemini Live' : 'Live (No API Key)'}
                </span>
              )}
            </div>
            <div className="text-xs text-[#64748B] mt-0.5 flex items-center gap-2">
              <span>{state.settings.demoMode ? 'Local deterministic triage & education' : 'Google Gemini 1.5 Flash assistant'}</span>
              <button
                type="button"
                onClick={toggleDemoMode}
                className="text-blue-600 hover:text-blue-700 font-medium underline text-[11px]"
              >
                Switch to {state.settings.demoMode ? 'Live AI' : 'Demo'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowMobileList(true)}
              className="md:hidden p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"
              aria-label="View all conversations"
            >
              <History size={18} />
            </button>
            <button
              onClick={() => dispatch({ type: 'NEW_CONVERSATION' })}
              className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"
              aria-label="New chat"
            >
              <Plus size={18} />
            </button>
            {active && active.messages.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear messages in this conversation?')) {
                    dispatch({ type: 'CLEAR_CONVERSATION', id: active.id });
                  }
                }}
                className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"
                aria-label="Clear conversation"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Live AI Alert if no API key */}
        {!state.settings.demoMode && !state.settings.apiKey && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-blue-600 shrink-0" />
              <span>Real AI Mode is active without an API key. Add one in Settings to activate Gemini responses.</span>
            </div>
            <Link to="/settings" className="font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 shrink-0 ml-2">
              Configure <ArrowRight size={12} />
            </Link>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
          {(!active || active.messages.length === 0) && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600 shadow-xs border border-blue-100">
                <MessageSquare size={26} />
              </div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                How can I help you today?
              </h2>
              <p className="mt-2 text-sm text-[#64748B] max-w-md">
                Ask about symptoms, health questions, appointment preparation, or
                medication instructions. I provide educational information only.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                    className="text-left text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#E2E8F0] hover:border-blue-500 hover:bg-blue-50/50 text-[#0F172A] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {active?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-[#0F172A] text-white rounded-br-md whitespace-pre-wrap shadow-xs'
                    : msg.isEmergency
                      ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-md shadow-xs'
                      : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-bl-md shadow-xs'
                  }`}
              >
                {msg.isEmergency && (
                  <div className="flex items-center gap-1.5 font-bold mb-2 pb-1.5 border-b border-red-200 text-red-700">
                    <AlertTriangle size={16} className="text-red-600 shrink-0" />
                    Urgent Medical Guidance
                  </div>
                )}
                {msg.role === 'user' ? msg.content : <FormattedMessage content={msg.content} />}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2 text-sm text-[#64748B] shadow-xs">
                <Loader2 size={16} className="animate-spin text-blue-600" />
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-[#E2E8F0] text-xs text-[#64748B] flex items-start gap-1.5">
          <AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-500" />
          <span>
            General health education only · Not clinical diagnosis or prescribing · Seek emergency care for severe symptoms
          </span>
        </div>

        {/* Composer */}
        <div className="p-3 sm:p-4 border-t border-[#E2E8F0]">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={state.settings.demoMode ? "Ask a health question (Demo engine active)…" : "Ask a health question (Live Gemini AI active)…"}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 max-h-32 transition-all"
              style={{ minHeight: '44px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="shrink-0 w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
