import React from 'react';
import { AppView } from '../../types';
import { LayoutDashboard, Target, Users, Brain, Cpu, FileText, Zap, Activity, FileDown } from 'lucide-react';

interface MobileNavProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeMissionsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  setCurrentView,
  activeMissionsCount
}) => {
  const items: { id: AppView; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'QG', icon: LayoutDashboard },
    { id: 'audit', label: 'Audit', icon: Activity },
    { id: 'missions', label: 'Missions', icon: Target, badge: activeMissionsCount },
    { id: 'actions', label: 'Actions', icon: Zap },
    { id: 'agents', label: 'Conseil', icon: Users },
    { id: 'sales_os', label: 'Sales CRM', icon: Users },
    { id: 'brains', label: 'Brains', icon: Brain },
    { id: 'simulation', label: 'Simu', icon: Cpu },
    { id: 'journal', label: 'Journal', icon: FileText },
    { id: 'export_center', label: 'Export', icon: FileDown }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-800 bg-slate-950/95 px-2 py-2">
      <div className="grid grid-cols-10 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-400 bg-amber-500/10 font-bold border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center font-mono-code">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
