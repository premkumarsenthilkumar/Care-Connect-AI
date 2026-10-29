import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  BookOpen,
  Pill,
  LifeBuoy,
  Settings,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'AI Health Chat', icon: MessageSquare },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/library', label: 'Health Library', icon: BookOpen },
  { to: '/medications', label: 'Medication Info', icon: Pill },
  { to: '/support', label: 'Patient Support', icon: LifeBuoy },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#0B192C] text-white flex flex-col shrink-0
          transform transition-transform duration-200 ease-out border-r border-[#1E293B]
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div>
            <div className="font-semibold text-lg tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              CareConnect AI
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Healthcare Assistant Portal</div>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-white/10"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
          General health education only. Not a substitute for professional medical advice.
        </div>
      </aside>
    </>
  );
}
