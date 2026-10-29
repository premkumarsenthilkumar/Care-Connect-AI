import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useApp } from '../context/AppContext';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state } = useApp();

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', state.settings.fontSize === 'large');
    document.documentElement.classList.toggle('reduced-motion', state.settings.reducedMotion);
  }, [state.settings.fontSize, state.settings.reducedMotion]);

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC] text-[#0F172A]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
