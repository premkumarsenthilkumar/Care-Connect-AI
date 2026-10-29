import { useState } from 'react';
import { AlertCircle, Trash2, Info, CheckCircle, Sparkles, Database, Key, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Settings() {
  const { state, dispatch } = useApp();
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleReset = () => {
    if (
      confirm(
        'Reset all demo data? This will restore sample appointments, conversations, and clear saved articles and checklist.'
      )
    ) {
      dispatch({ type: 'RESET' });
      setStatusBanner('Demo data has been reset to default.');
      setTimeout(() => setStatusBanner(null), 3500);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear all conversation history?')) {
      state.conversations.forEach((c) => {
        dispatch({ type: 'DELETE_CONVERSATION', id: c.id });
      });
      setStatusBanner('Conversation history cleared.');
      setTimeout(() => setStatusBanner(null), 3500);
    }
  };

  const toggleMode = (demo: boolean) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { demoMode: demo },
    });
    setStatusBanner(demo ? 'Switched to Demo Mode (offline knowledge base).' : 'Switched to Real Live AI Mode.');
    setTimeout(() => setStatusBanner(null), 3500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Settings</h1>
        <p className="text-sm text-[#64748B] mt-1">Configure AI engine modes, API credentials, and application preferences.</p>
      </div>

      {statusBanner && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-800 shadow-xs">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          {statusBanner}
        </div>
      )}

      {/* AI Assistant Mode & API Key */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-5">
        <div>
          <h2 className="font-semibold text-[#0F172A] flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" />
            AI Assistant Engine Mode
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Choose whether the conversational assistant runs in local deterministic demo mode or connects live to Google Gemini.
          </p>
        </div>

        {/* Mode Switch Cards */}
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => toggleMode(true)}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              state.settings.demoMode
                ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-sm text-[#0F172A] flex items-center gap-1.5">
                <Database size={15} className="text-blue-600" /> Demo Mode
              </span>
              {state.settings.demoMode && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Zero setup required. Generates deterministic responses from verified clinical categories with emergency triage guardrails.
            </p>
          </button>

          <button
            type="button"
            onClick={() => toggleMode(false)}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              !state.settings.demoMode
                ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-sm text-[#0F172A] flex items-center gap-1.5">
                <Sparkles size={15} className="text-blue-600" /> Real AI Mode
              </span>
              {!state.settings.demoMode && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Connects live to Google Gemini 1.5 Flash for dynamic health Q&A while maintaining strict clinical safety guardrails.
            </p>
          </button>
        </div>

        {/* API Key Input Field */}
        <div className="pt-2 border-t border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
              <Key size={15} className="text-[#64748B]" />
              Google Gemini API Key
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Get free API key <ExternalLink size={12} />
            </a>
          </div>

          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={state.settings.apiKey ?? ''}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_SETTINGS',
                  settings: { apiKey: e.target.value },
                })
              }
              placeholder="AIzaSy... (Paste your Google Gemini API Key here)"
              className="w-full rounded-lg border border-[#E2E8F0] pl-3.5 pr-10 py-2.5 text-sm font-mono placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] p-1"
              aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
            >
              {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="text-xs text-[#64748B] space-y-1 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
            <p>
              • In <strong>Demo Mode</strong>, this key is optional; responses work without an API key.
            </p>
            <p>
              • In <strong>Real AI Mode</strong>, this key connects to Gemini 1.5 Flash.
            </p>
            <p className="text-slate-500">
              🔒 Your key is securely preserved only inside your browser’s LocalStorage and is never shared.
            </p>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
        <h2 className="font-semibold text-[#0F172A]">Demo Patient Profile</h2>
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1">Display name</label>
          <input
            value={state.profile.name}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_PROFILE', profile: { name: e.target.value } })
            }
            className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1">Email address</label>
          <input
            value={state.profile.email}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_PROFILE', profile: { email: e.target.value } })
            }
            className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
      </section>

      {/* Accessibility */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
        <h2 className="font-semibold text-[#0F172A]">Accessibility</h2>
        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-sm text-[#0F172A]">Larger text (18px root scale)</span>
          <input
            type="checkbox"
            checked={state.settings.fontSize === 'large'}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_SETTINGS',
                settings: { fontSize: e.target.checked ? 'large' : 'normal' },
              })
            }
            className="w-4 h-4 accent-blue-600 rounded"
          />
        </label>
        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <span className="text-sm text-[#0F172A]">Reduce motion (disable animations)</span>
          <input
            type="checkbox"
            checked={state.settings.reducedMotion}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_SETTINGS',
                settings: { reducedMotion: e.target.checked },
              })
            }
            className="w-4 h-4 accent-blue-600 rounded"
          />
        </label>
      </section>

      {/* Data controls */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
        <h2 className="font-semibold text-[#0F172A]">Data & Storage Controls</h2>
        <button
          onClick={handleClearHistory}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
        >
          Clear conversation history
        </button>
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} />
          Reset all demo data
        </button>
      </section>

      {/* About & disclaimer */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
        <h2 className="font-semibold text-[#0F172A] flex items-center gap-2">
          <Info size={18} className="text-blue-600" /> About CareConnect AI
        </h2>
        <p className="text-sm text-[#64748B] leading-relaxed">
          <strong>CareConnect AI</strong> is an educational prototype demonstrating conversational
          healthcare assistance for health literacy, appointment planning, and patient support. It is not affiliated
          with any hospital or healthcare provider.
        </p>
        <div className="flex items-start gap-2.5 text-sm text-[#64748B] bg-blue-50/60 rounded-xl p-3.5 border border-blue-100">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-blue-600" />
          <p className="text-xs leading-relaxed text-blue-950">
            This AI assistant provides educational guidance only. It does not diagnose medical conditions
            or prescribe medications. In any life-threatening or urgent medical emergency, call 112 (India)
            or your local emergency services immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
