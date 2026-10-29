import { Menu, User, Sparkles, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { state, dispatch } = useApp();

  const toggleMode = (demo: boolean) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { demoMode: demo },
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 h-14 flex items-center justify-between shrink-0 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#F1F5F9] text-[#0F172A]"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-[#0F172A]">CareConnect AI</span>
          <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Healthcare Portal
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Demo vs Real AI Toggle Switch */}
        <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => toggleMode(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              state.settings.demoMode
                ? 'bg-white text-blue-700 shadow-xs border border-[#E2E8F0]'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="Use local offline demo knowledge base"
          >
            <Database size={13} className={state.settings.demoMode ? 'text-blue-600' : ''} />
            <span>Demo Mode</span>
          </button>
          <button
            type="button"
            onClick={() => toggleMode(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              !state.settings.demoMode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title={state.settings.apiKey ? 'Connected to live Gemini AI' : 'Live Real AI Mode (requires API Key in Settings)'}
          >
            <Sparkles size={13} />
            <span>Live AI</span>
            {!state.settings.demoMode && !state.settings.apiKey && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" title="API Key Required" />
            )}
          </button>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 text-sm text-[#0F172A] pl-1 border-l border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-xs shadow-xs">
            <User size={15} />
          </div>
          <span className="hidden md:inline text-sm font-medium text-[#0F172A]">{state.profile.name}</span>
        </div>
      </div>
    </header>
  );
}
