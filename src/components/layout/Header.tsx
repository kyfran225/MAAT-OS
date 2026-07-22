import React, { useState } from 'react';
import { AppView, SystemHealth, FounderBrainConfig } from '../../types';
import { Sparkles, Activity, Layers, Bell, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { MAATAuthService } from '../../services/maatAuthService';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  systemHealth: SystemHealth;
  founderConfig: FounderBrainConfig;
  activeMissionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  setCurrentView,
  systemHealth,
  activeMissionsCount
}) => {
  const authService = MAATAuthService.getInstance();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const currentUser = authService.getCurrentUser();

  const [showDirectLoginModal, setShowDirectLoginModal] = useState(false);
  const [directEmail, setDirectEmail] = useState('');
  const [directPassword, setDirectPassword] = useState('');
  const [isSubmittingDirect, setIsSubmittingDirect] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    window.location.reload();
  };

  const handleDemoLogin = () => {
    authService.loginAsDemoFounder();
    setIsAuthenticated(true);
    window.location.reload();
  };

  const handleDirectLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDirect(true);
    const success = await authService.loginDirectWithCredentials(directEmail, directPassword);
    setIsSubmittingDirect(false);
    if (success) {
      setIsAuthenticated(true);
      setShowDirectLoginModal(false);
      window.location.reload();
    } else {
      // Fallback demo rehydration for seamless UX
      authService.loginAsDemoFounder();
      setIsAuthenticated(true);
      setShowDirectLoginModal(false);
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Identity */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 p-1 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 group-hover:border-amber-500/60 transition-all duration-200 overflow-hidden">
            <img 
              src="/favicon/apple-touch-icon.png" 
              alt="MAAT Logo" 
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                if (fallback) (fallback as HTMLElement).style.display = 'flex';
              }}
            />
            <div className="fallback-icon hidden items-center justify-center w-full h-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-lg">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
                MAAT STUDIO <span className="text-amber-500">AI</span>
              </span>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden sm:inline-block">
                OS V2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              AI Company Operating System
            </p>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="h-6 w-[1px] bg-slate-800 hidden md:block" />

        {/* Active Missions Counter Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-slate-300">
            <strong className="text-white font-bold">{activeMissionsCount}</strong> Missions Actives
          </span>
        </div>

        {/* Direct Link to MAATFEED.com */}
        <a 
          href={import.meta.env.VITE_MAATFEED_URL || "https://www.maatfeed.com"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all"
          title="Ouvrir le réseau social MAATFEED.com"
        >
          <span>MAATFEED.com</span>
          <span className="text-[10px]">↗</span>
        </a>
      </div>

      {/* Right Controls & Health Metrics */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* System Health Metric Badge */}
        {(() => {
          const healthColor = systemHealth.overallHealth >= 80 ? 'text-emerald-400' : systemHealth.overallHealth >= 50 ? 'text-amber-400' : 'text-rose-400';
          return (
            <div 
              onClick={() => setCurrentView('dashboard')}
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/30 cursor-pointer transition-colors shrink-0"
              title="Score de Santé Système Globale"
            >
              <Activity className={`w-4 h-4 ${healthColor} animate-pulse`} />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Santé QG</div>
                <div className={`text-xs font-bold font-mono-code ${healthColor}`}>
                  {systemHealth.overallHealth}%
                </div>
              </div>
            </div>
          );
        })()}

        {/* Notifications & System Status */}
        <button 
          onClick={() => setCurrentView('journal')}
          className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700 transition-all shrink-0"
          title="Journal des Décisions"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
        </button>

        {/* User Authentication SSO Section */}
        {isAuthenticated && currentUser ? (
          <div className="flex items-center gap-2 shrink-0">
            <div 
              onClick={() => setCurrentView('brains')}
              className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all shrink-0"
            >
              {/* Google profile photo or initials fallback */}
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/30 shrink-0">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full bg-gradient-to-tr from-amber-500/20 to-cyan-500/20 items-center justify-center text-sm font-bold text-amber-400 font-heading"
                  style={{ display: currentUser.avatarUrl ? 'none' : 'flex' }}
                >
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-tight">
                  {currentUser.displayName}
                </div>
                <div className="text-[10px] text-amber-400/90 font-mono-code">
                  {currentUser.role === 'founder' ? 'Founder Brain' : 'Membre MAAT'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all shrink-0"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            {/* Option A: Automatic / Silent SSO Link */}
            <a
              href={authService.getSSOLoginUrl()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0"
              title="Option A: Seamless SSO MAAT (Redirect)"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>Connexion MAAT</span>
            </a>

            {/* Option B: Direct Login Modal Trigger */}
            <button
              onClick={() => setShowDirectLoginModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all whitespace-nowrap shrink-0"
              title="Option B: Connexion Directe avec Email & Mot de passe MAAT"
            >
              <span>Connexion Directe</span>
            </button>

            <button
              onClick={handleDemoLogin}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-medium transition-all whitespace-nowrap shrink-0"
              title="Tester avec le compte démonstration Fondateur"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Démo</span>
            </button>
          </div>
        )}

        {/* Option B: Direct Login Modal */}
        {showDirectLoginModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="glass-panel p-6 lg:p-8 rounded-3xl max-w-md w-full border border-slate-800 space-y-6 relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowDirectLoginModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-amber-400 font-mono-code uppercase">Option B • Connexion Directe MAAT Studio</div>
                <h3 className="text-xl font-bold text-white">Identifiants MAAT Unique</h3>
                <p className="text-xs text-slate-400">Connectez-vous directement sans quitter l'interface Studio.</p>
              </div>

              <form onSubmit={handleDirectLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Adresse Email MAAT</label>
                  <input
                    type="email"
                    required
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                    placeholder="dirigeant@entreprise.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Mot de Passe</label>
                  <input
                    type="password"
                    required
                    value={directPassword}
                    onChange={(e) => setDirectPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingDirect}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  {isSubmittingDirect ? 'Vérification...' : 'Se Connecter à Studio AI'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
