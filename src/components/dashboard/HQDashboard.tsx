import React, { useState, useEffect } from 'react';
import { SystemHealth, Mission, DecisionLog, Agent, AppView } from '../../types';
import { Target, Users, Cpu, FileText, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Flame, PlusCircle, TrendingUp, Globe, Sparkles, Database, Wallet } from 'lucide-react';
import { MAATFEEDIntelligenceService } from '../../services/maatfeedIntelligenceService';
import { MAATAuthService } from '../../services/maatAuthService';
import { knowledgeGraphService } from '../../services/knowledgeGraphService';
import { BackendService } from '../../services/backendService';

interface HQDashboardProps {
  systemHealth: SystemHealth;
  missions: Mission[];
  decisionLogs: DecisionLog[];
  agents: Agent[];
  onOpenCreateMission: () => void;
  setCurrentView: (view: AppView) => void;
  onExecuteRecommendation: (title: string) => void;
  financeStats?: any;
}

export const HQDashboard: React.FC<HQDashboardProps> = ({
  systemHealth,
  missions,
  decisionLogs,
  agents,
  onOpenCreateMission,
  setCurrentView,
  onExecuteRecommendation,
  financeStats
}) => {
  const [ingestedAssets, setIngestedAssets] = useState<{ id: string; name: string; type: string }[]>([]);
  const [liveSignals, setLiveSignals] = useState<any[]>([]);
  const [isAnalyzingSignal, setIsAnalyzingSignal] = useState<string | null>(null);

  useEffect(() => {
    loadSignals();
    const unsubscribe = knowledgeGraphService.subscribe((newNode) => {
      if (newNode.category === 'document') {
        setIngestedAssets(prev => [{ id: newNode.id, name: newNode.label, type: newNode.type }, ...prev].slice(0, 5));
      }
    });
    return () => unsubscribe();
  }, []);

  const loadSignals = async () => {
    const data = await BackendService.getInstance().getCulturalSignals();
    if (data) setLiveSignals(data);
  };

  const handleTransformSignal = async (signalId: string) => {
    setIsAnalyzingSignal(signalId);
    const analysis = await BackendService.getInstance().analyzeSignal(signalId);
    if (analysis && analysis.recommended_mission) {
      const mission = analysis.recommended_mission;
      onExecuteRecommendation(mission.title); // This currently triggers a generic mission creation
      // In a more advanced version, we would pre-fill a modal with 'mission' data
    }
    setIsAnalyzingSignal(null);
  };

  const authService = MAATAuthService.getInstance();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const activeMissions = missions ? missions.filter(m => m.status === 'active') : [];
  const ceoAgent = (agents && agents.find(a => a.id === 'ceo-agent')) || (agents && agents[0]) || { lastQuote: 'Système d\'exploitation d\'entreprise opérationnel.', name: 'CEO Agent' };

  const userNameDisplay = currentUser
    ? currentUser.displayName
    : 'Dirigeant';

  const liveSignalsCount = liveSignals.length;

  return (
    <div className="space-y-6 pb-12">
      {/* CEO Morning Brief Panel */}
      <section className="glass-panel-gold rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono-code font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>CEO MORNING BRIEF • 08:30 UTC</span>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {isAuthenticated
                ? `Bonjour ${userNameDisplay}. Voici le statut de votre organisation aujourd'hui.`
                : `Bienvenue sur MAAT Studio AI. Votre système d'exploitation d'entreprise.`}
            </h1>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-300 text-sm leading-relaxed space-y-2">
              <p className="font-semibold text-amber-300">
                "{ceoAgent?.lastQuote || 'Système d\'exploitation d\'entreprise prêt.'}"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Missions Actives : <strong>{activeMissions.length}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Conseil IA : <strong>{agents.length} Directeurs</strong></span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Signaux MAATFEED : <strong>{liveSignalsCount} Nouveaux</strong></span>
                </div>
              </div>
            </div>

            {/* Competitor Alert Banner */}
            <div
              onClick={() => setCurrentView('market_brain')}
              className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between cursor-pointer hover:bg-rose-500/20 transition-all animate-pulse"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <div>
                  <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Alerte Stratégique Market Brain™</div>
                  <div className="text-xs text-white font-semibold">Mouvement agressif détecté chez un concurrent direct.</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-rose-400" />
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onExecuteRecommendation('Optimisation Stratégique PME')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Lancer Recommandation CEO</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
            
            <button
              onClick={onOpenCreateMission}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Créer une Mission</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid Section: System Health Scores & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Finance OS / ROI Summary Card */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between border-t-2 border-t-emerald-500">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-heading font-bold text-sm xl:text-base text-white flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Performance Finance OS</span>
              </h3>
              <span className="text-[10px] font-mono-code text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 whitespace-nowrap shrink-0">
                ROI LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Investissement IA</div>
                <div className="text-sm font-mono-code font-bold text-purple-400">
                  {financeStats?.total_cost?.toLocaleString() || '0'} <span className="text-[8px]">XOF</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Revenu Généré</div>
                <div className="text-sm font-mono-code font-bold text-emerald-400">
                  {financeStats?.total_revenue?.toLocaleString() || '0'} <span className="text-[8px]">XOF</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300">Index ROI Stratégique</div>
              <div className="text-lg font-mono-code font-bold text-emerald-400">
                {financeStats?.total_cost > 0
                  ? ((financeStats.total_revenue - financeStats.total_cost) / financeStats.total_cost * 100).toFixed(0)
                  : '0'}%
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('finance_os')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-emerald-400 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Voir Détails Financiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* C-Suite Board Overview */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-heading font-bold text-xs sm:text-sm xl:text-base text-white flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Conseil d'Administration IA</span>
            </h3>
            <button 
              onClick={() => setCurrentView('agents')}
              className="text-xs font-bold text-amber-400 hover:underline whitespace-nowrap shrink-0"
            >
              Voir Tout ({agents.length})
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {agents.slice(0, 4).map((agent) => (
              <div 
                key={agent.id} 
                onClick={() => setCurrentView('agents')}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-2 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg shrink-0">
                    {agent.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{agent.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{agent.role}</div>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap shrink-0 inline-block">
                    {agent.confidence}% Confiance
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mode Simulation Quick Box */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-heading font-bold text-sm xl:text-base text-white flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Mode Simulation</span>
              </h3>
              <span className="text-xs font-mono-code text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 whitespace-nowrap shrink-0">
                What-If Engine™
              </span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Testez des scénarios financiers et stratégiques avant d'engager du budget avec le Moteur de Simulation.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <div className="font-bold text-white">Simulations actives :</div>
              <div className="text-slate-400">Lancez vos propres tests de scénarios ROI stratégiques.</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('simulation')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-400 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Accéder aux Simulations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Finance OS / Ingested Assets Quick View */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-heading font-bold text-sm xl:text-base text-white flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Finance OS & Actifs</span>
              </h3>
              <span className="text-[10px] font-mono-code text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 whitespace-nowrap shrink-0">
                ACTIFS RÉELS
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Derniers documents financiers et légaux ingérés par le Multi-Brain System.
            </p>

            <div className="mt-4 space-y-2">
              {ingestedAssets.length > 0 ? ingestedAssets.map((asset) => (
                <div key={asset.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] flex items-center justify-between group">
                  <div className="flex items-center gap-2 min-w-0">
                    <Database className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="text-slate-300 truncate font-bold">{asset.name}</span>
                  </div>
                  <span className="text-emerald-500/70 font-mono-code shrink-0 uppercase">{asset.type.split(' ')[0]}</span>
                </div>
              )) : (
                <div className="p-3 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-[10px] text-slate-500 text-center">
                  Aucun actif financier ingéré aujourd'hui.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('brain')}
            className="w-full mt-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Explorer le Multi-Brain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MAATFEED Cultural Intelligence Layer Widget */}
      <section className="glass-panel-gold rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold font-heading text-white leading-snug">
                Passerelle MAATFEED - Human Intelligence Layer™
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Signaux culturels et conversations humaines captées en temps réel sur MAATFEED.
            </p>
          </div>

          <span className="text-[10px] font-mono-code font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 whitespace-nowrap shrink-0 self-start sm:self-auto">
            ● Synchro Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {liveSignals.map((sig) => (
            <div key={sig.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code text-slate-500">{sig.region}</span>
                  <span className="text-xs font-mono-code font-bold text-emerald-400">{sig.volume_growth} Volume</span>
                </div>

                <h4 className="text-xs font-bold text-white">{sig.topic}</h4>
                <p className="text-[11px] text-slate-300 italic border-l-2 border-amber-500/40 pl-2.5">
                  {sig.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900 space-y-2">
                <div className="text-[10px] font-mono-code font-bold text-amber-400">Analyse de Secteur :</div>
                <p className="text-[11px] text-slate-200 font-medium">{sig.sector}</p>
                <button
                  onClick={() => handleTransformSignal(sig.id)}
                  disabled={isAnalyzingSignal === sig.id}
                  className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                >
                  {isAnalyzingSignal === sig.id ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>{isAnalyzingSignal === sig.id ? 'Analyse Opportunité...' : 'Transformer en Mission'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Missions Section */}
      <section className="glass-panel rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center gap-2 leading-snug">
              <Target className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Missions Métiers Actives ({activeMissions.length})</span>
            </h2>
            <p className="text-xs text-slate-400 leading-normal">
              Chaque Mission est guidée par le Moteur Cognitif et ses 6 couches fonctionnelles.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('missions')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>Voir Toutes les Missions</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        {activeMissions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/80 border border-dashed border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Aucune Mission Métier Active</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Votre espace de travail est prêt pour votre PME. Créez votre première Mission Métier pour activer l'analyse et l'exécution de votre Conseil d'Administration IA.
            </p>
            <button
              onClick={onOpenCreateMission}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer ma première Mission</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {activeMissions.map((mission) => (
              <div 
                key={mission.id}
                onClick={() => setCurrentView('missions')}
                className="glass-card-interactive p-5 rounded-2xl bg-slate-900/90 border border-slate-800 cursor-pointer space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {mission.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{mission.title}</h3>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs font-mono-code font-bold text-emerald-400">
                      Score {mission.healthScore}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {mission.target}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-mono-code">
                    <span className="text-slate-400">Progression</span>
                    <span className="text-amber-400 font-bold">{mission.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Budget : <strong>${mission.spentBudget}</strong> / ${mission.budget}</span>
                  <span>Délai : <strong>{mission.timeline}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Decision Logs Stream */}
      <section className="glass-panel rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base sm:text-xl font-bold font-heading text-white flex items-center gap-2 leading-snug">
            <FileText className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Journal de Bord Temps Réel (Décisions IA)</span>
          </h2>

          <button
            onClick={() => setCurrentView('journal')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>Ouvrir le Journal Complet</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        {decisionLogs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
            Aucune décision encore enregistrée. Lancez un Débat du Conseil IA ou créez une Mission pour alimenter la traçabilité.
          </div>
        ) : (
          <div className="space-y-3">
            {decisionLogs.map((log) => (
              <div 
                key={log.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono-code text-slate-500 whitespace-nowrap">{log.timestamp}</span>
                    <span className="text-xs font-bold text-amber-400 whitespace-nowrap">{log.agentName}</span>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-800 text-slate-400 whitespace-nowrap shrink-0">
                      {log.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{log.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{log.reasoning}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono-code font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap shrink-0">
                    {log.confidenceScore}% Confiance
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
