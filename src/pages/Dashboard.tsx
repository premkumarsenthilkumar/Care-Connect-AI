import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Calendar,
  BookOpen,
  Pill,
  ClipboardList,
  Stethoscope,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Database,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ARTICLES } from '../data/articles';

export function Dashboard() {
  const { state } = useApp();

  const upcomingCount = state.appointments.filter((a) => a.status === 'upcoming').length;
  const savedCount = state.savedArticleIds.length;
  const recentConvCount = state.conversations.length;

  const quickActions = [
    { to: '/chat', label: 'Ask a Health Question', icon: MessageSquare, color: 'bg-blue-600' },
    { to: '/chat', label: 'Understand a Symptom', icon: Stethoscope, color: 'bg-indigo-600' },
    { to: '/support', label: 'Prepare for a Doctor Visit', icon: ClipboardList, color: 'bg-slate-800' },
    { to: '/library', label: 'Explore Health Articles', icon: BookOpen, color: 'bg-emerald-600' },
    { to: '/medications', label: 'Review Medication Info', icon: Pill, color: 'bg-amber-600' },
    { to: '/appointments', label: 'Book a Demo Appointment', icon: Calendar, color: 'bg-sky-600' },
  ];

  const recentActivity = [
    ...state.conversations.slice(0, 2).map((c) => ({
      id: c.id,
      type: 'conversation' as const,
      title: c.title,
      time: c.updatedAt,
    })),
    ...state.appointments
      .filter((a) => a.status === 'upcoming')
      .slice(0, 2)
      .map((a) => ({
        id: a.id,
        type: 'appointment' as const,
        title: `${a.purpose} – ${a.provider}`,
        time: a.date,
      })),
    ...state.savedArticleIds.slice(0, 2).map((id) => {
      const art = ARTICLES.find((a) => a.id === id);
      return {
        id,
        type: 'article' as const,
        title: art?.title ?? 'Saved article',
        time: '',
      };
    }),
  ].slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Welcome to CareConnect AI
          </h1>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {state.settings.demoMode ? (
              <>
                <Database size={12} className="text-blue-600" /> Demo Engine Active
              </>
            ) : (
              <>
                <Sparkles size={12} className="text-blue-600" /> Live AI Engine Active
              </>
            )}
          </div>
        </div>

        <p className="mt-2 text-[#64748B] max-w-2xl leading-relaxed text-sm sm:text-base">
          Your conversational assistant for general healthcare information, appointment
          planning, and patient-education resources. Switch between verified Demo knowledge and Live Gemini AI.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-xs"
          >
            <MessageSquare size={18} />
            Start Health Chat
          </Link>
          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] font-medium hover:bg-[#F8FAFC] transition-colors"
          >
            <Calendar size={18} />
            View Appointments
          </Link>
        </div>

        <div className="mt-5 flex items-start gap-2.5 text-xs sm:text-sm text-[#64748B] bg-blue-50/50 rounded-lg p-3.5 border border-blue-100">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-blue-600" />
          <p className="text-blue-950">
            This AI assistant provides educational healthcare guidance. It does not diagnose medical conditions
            or prescribe treatments. In any acute emergency, immediately call local emergency services (112 in India).
          </p>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Demo Appointments', value: upcomingCount, to: '/appointments' },
          { label: 'Saved Health Articles', value: savedCount, to: '/library' },
          { label: recentConvCount === 1 ? 'Recent Conversation' : 'Recent Conversations', value: recentConvCount, to: '/chat' },
          { label: 'Support Topics', value: 6, to: '/support' },
        ].map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs hover:border-blue-500/50 hover:shadow-sm transition-all"
          >
            <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{card.value}</div>
            <div className="mt-1 text-xs sm:text-sm text-[#64748B] font-medium">{card.label}</div>
          </Link>
        ))}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-lg font-bold text-[#0F172A] mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="flex items-center gap-3 bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs hover:border-blue-500/40 hover:shadow-sm transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                <action.icon size={20} />
              </div>
              <span className="font-semibold text-sm text-[#0F172A] flex-1">{action.label}</span>
              <ArrowRight size={16} className="text-[#64748B] group-hover:text-blue-600 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="text-lg font-bold text-[#0F172A] mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs divide-y divide-[#E2E8F0]">
          {recentActivity.length === 0 ? (
            <div className="p-6 text-center text-[#64748B] text-sm">No recent activity yet.</div>
          ) : (
            recentActivity.map((item) => (
              <div key={item.id + item.type} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#0F172A] truncate">{item.title}</div>
                  <div className="text-xs text-[#64748B] capitalize mt-0.5">{item.type}</div>
                </div>
                {item.time && (
                  <div className="text-xs text-[#64748B] shrink-0 font-medium">
                    {item.time.slice(0, 10)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
