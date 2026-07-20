import React from 'react';
import { AppView } from '../../types';
import { LayoutDashboard, Target, Users, Brain, Cpu, FileText, Globe } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeMissionsCount: number;
  unresolvedDecisionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  activeMissionsCount,
  unresolvedDecisionsCount
}) => {
  const navItems: { id: AppView; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    { id: 'dashboard', label: 'QG Studio', icon: LayoutDashboard },
    { id: 'missions', label: 'Missions™', icon: Target, badge: activeMissionsCount },
    { id: 'agents', label: 'Conseil IA', icon: Users },
    { id: 'brains', label: 'Multi-Brain', icon: Brain },
    { id: 'simulation', label: 'Mode Simulation', icon: Cpu, badge: 'IA' },
    { id: 'journal', label: 'Journal de Bord', icon: FileText, badge: unresolvedDecisionsCount },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-slate-800 min-h-[calc(100vh-65px)] p-4 justify-between">
      <div className="space-y-6">
        {/* Navigation Category Label */}
        <div>
          <h4 className="text-[10px] uppercase font-mono-code font-bold tracking-widest text-slate-500 px-3 mb-3">
            Système d'Exploitation
          </h4>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/5 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-bold ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* MAATFEED Ecosystem Link Banner */}
        <a 
          href={import.meta.env.VITE_MAATFEED_URL || "https://www.maatfeed.com"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block p-3.5 rounded-2xl glass-panel-gold space-y-2.5 hover:border-amber-500/50 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>MAATFEED.com</span>
            </div>
            <span className="text-[10px] group-hover:translate-x-0.5 transition-transform">↗</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Human Intelligence Layer™ connecté. Synchronisation temps réel des signaux culturels.
          </p>
          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono-code pt-1">
            <span>● Synchronisé</span>
            <span>Accéder au Réseau</span>
          </div>
        </a>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500 space-y-1">
        <p className="font-mono-code font-semibold">MAAT STUDIO AI™ v2.4</p>
        <p className="text-[10px]">Zero UI Morte • Logic-First</p>
      </div>
    </aside>
  );
};
