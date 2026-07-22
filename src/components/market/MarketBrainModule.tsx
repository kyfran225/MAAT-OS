import React, { useState, useEffect } from 'react';
import {
  Globe,
  Target,
  AlertCircle,
  ExternalLink,
  Plus,
  ShieldAlert,
  Zap,
  ChevronRight,
  Search
} from 'lucide-react';
import { MarketSignal, CompanyBrainConfig } from '../../types';

interface MarketBrainModuleProps {
  companyConfig: CompanyBrainConfig;
  onAddMission: (title: string, objective: string) => void;
}

export const MarketBrainModule: React.FC<MarketBrainModuleProps> = ({
  companyConfig,
  onAddMission
}) => {
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSignals();
  }, [companyConfig.competitors]);

  const loadSignals = async () => {
    setIsLoading(true);
    // In a real app, this would call BackendService.getInstance().getCompetitorSignals()
    // For now we simulate based on competitors
    const mockSignals: MarketSignal[] = (companyConfig.competitors || []).map(comp => ({
      id: `sig-${Math.random()}`,
      competitorName: comp.name,
      title: `Détection : Offensive sur le segment ${companyConfig.industry}`,
      content: `Le concurrent ${comp.name} a mis à jour ses tarifs et semble cibler vos clients actuels avec une offre de migration gratuite.`,
      timestamp: 'Il y a 2h',
      impactLevel: comp.threatLevel === 'Élevé' ? 'Critique' : 'Alerte',
      suggestedMission: `Riposte Stratégique : ${comp.name}`
    }));

    setSignals(mockSignals);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono-code font-bold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>MARKET BRAIN • VEILLE CONCURRENTIELLE</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Radar Stratégique & Intelligence Marché</h1>
          <p className="text-xs text-slate-400 mt-1">
            Surveillez les mouvements de vos concurrents et réagissez avec des Missions™ de riposte.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Protection Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competitors List */}
        <div className="glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-400" />
              Concurrents Sous Surveillance
            </h3>
            <span className="text-[10px] text-slate-500 font-mono-code">{companyConfig.competitors?.length || 0}/3</span>
          </div>

          <div className="space-y-3">
            {companyConfig.competitors && companyConfig.competitors.length > 0 ? (
              companyConfig.competitors.map((comp) => (
                <div key={comp.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{comp.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      comp.threatLevel === 'Élevé' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      comp.threatLevel === 'Modéré' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {comp.threatLevel}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    {comp.website}
                  </div>
                  <div className="text-[11px] text-slate-300 pt-1">
                    <strong>Force :</strong> {comp.strength}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs italic border border-dashed border-slate-800 rounded-2xl">
                Aucun concurrent configuré.
              </div>
            )}

            <button className="w-full py-3 rounded-xl border border-dashed border-slate-700 text-slate-500 text-xs font-bold hover:text-white hover:border-amber-500/50 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Gérer les Concurrents</span>
            </button>
          </div>
        </div>

        {/* Market Signals Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Signaux de Marché & Alertes CEO Agent
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrer les signaux..."
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-white focus:outline-none focus:border-amber-500/50 w-40"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="p-12 text-center text-slate-500 animate-pulse">Scanning du marché...</div>
            ) : signals.length > 0 ? (
              signals.map((sig) => (
                <div key={sig.id} className={`glass-panel p-5 rounded-3xl border-l-4 transition-all hover:translate-x-1 ${
                  sig.impactLevel === 'Critique' ? 'border-l-rose-500' : 'border-l-amber-500'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono-code font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10">
                          {sig.competitorName}
                        </span>
                        <span className="text-[10px] text-slate-500">{sig.timestamp}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{sig.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {sig.content}
                      </p>
                    </div>

                    <div className="shrink-0 text-right space-y-3">
                      <div className={`text-[10px] font-bold px-2 py-1 rounded-full inline-block ${
                        sig.impactLevel === 'Critique' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        Impact {sig.impactLevel}
                      </div>

                      <button
                        onClick={() => onAddMission(sig.suggestedMission || "Riposte Stratégique", sig.content)}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors group"
                      >
                        <span>Lancer Riposte</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-[11px] text-slate-300 italic">
                      <strong>Analyse CEO Agent :</strong> "La menace est réelle pour votre base client. Je recommande d'activer une mission de rétention immédiate."
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 glass-panel rounded-3xl">
                Aucune alerte critique détectée. Le marché semble stable pour vos segments clés.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
