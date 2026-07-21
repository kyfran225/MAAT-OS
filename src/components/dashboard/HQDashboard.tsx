import React from 'react';
import { SystemHealth, Mission, DecisionLog, Agent, AppView } from '../../types';
import { Target, Users, Cpu, FileText, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Flame, PlusCircle, TrendingUp, Globe, Sparkles } from 'lucide-react';
import { MAATFEEDIntelligenceService } from '../../services/maatfeedIntelligenceService';

interface HQDashboardProps {
  systemHealth: SystemHealth;
  missions: Mission[];
  decisionLogs: DecisionLog[];
  agents: Agent[];
  onOpenCreateMission: () => void;
  setCurrentView: (view: AppView) => void;
  onExecuteRecommendation: (title: string) => void;
}

export const HQDashboard: React.FC<HQDashboardProps> = ({
  systemHealth,
  missions,
  decisionLogs,
  agents,
  onOpenCreateMission,
  setCurrentView,
  onExecuteRecommendation
}) => {
  const activeMissions = missions ? missions.filter(m => m.status === 'active') : [];
  const ceoAgent = (agents && agents.find(a => a.id === 'ceo-agent')) || (agents && agents[0]) || { lastQuote: 'Système d\'exploitation d\'entreprise opérationnel.', name: 'CEO Agent' };

  return (
    <div className="space-y-6 pb-12">
      {/* CEO Morning Brief Panel */}
      <section className="glass-panel-gold rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono-code font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>CEO MORNING BRIEF™ • 08:30 UTC</span>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Bonjour Franck. Voici le statut de votre organisation aujourd'hui.
            </h1>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-300 text-sm leading-relaxed space-y-2">
              <p className="font-semibold text-amber-300">
                "{ceoAgent?.lastQuote || 'Système d\'exploitation d\'entreprise prêt.'}"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Acquisition : <strong>+18%</strong> ce mois</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Conversion PME : <strong>-7% (Action Requis)</strong></span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Signaux MAATFEED : <strong>2 Nouveaux</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onExecuteRecommendation('Optimisation Tunnel PME')}
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
              <span>Créer une Mission™</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid Section: System Health Scores & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Card */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-heading font-bold text-sm xl:text-base text-white flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Score Santé Système</span>
            </h3>
            <span className="text-xs font-mono-code font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap shrink-0">
              {systemHealth.overallHealth}% Global
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Vision Stratégique', score: systemHealth.strategicScore, color: 'bg-emerald-500' },
              { label: 'Création de Contenu', score: systemHealth.contentScore, color: 'bg-emerald-500' },
              { label: 'SEO & Visibilité', score: systemHealth.seoScore, color: 'bg-amber-500' },
              { label: 'Taux de Conversion', score: systemHealth.conversionScore, color: 'bg-rose-500' },
              { label: 'Automatisation IA', score: systemHealth.automationScore, color: 'bg-emerald-500' },
              { label: 'Cohérence de Marque', score: systemHealth.brandConsistency, color: 'bg-amber-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-mono-code font-bold text-white">{item.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
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
                <span>Mode Simulation™</span>
              </h3>
              <span className="text-xs font-mono-code text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 whitespace-nowrap shrink-0">
                What-If Engine
              </span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Testez des scénarios financiers et stratégiques avant d'engager du budget. Calculez les ROI prévisionnels avec le Moteur de Simulation.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <div className="font-bold text-white">Scénario en cours :</div>
              <div className="text-slate-400">"Augmenter le budget Meta de 50% sur l'Afrique de l'Ouest"</div>
              <div className="text-emerald-400 font-mono-code font-bold pt-1">ROI estimé : 3.4x (Confiance 89%)</div>
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
          {MAATFEEDIntelligenceService.getInstance().getLiveCulturalSignals().map((sig) => (
            <div key={sig.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code text-slate-500">{sig.timestamp}</span>
                  <span className="text-xs font-mono-code font-bold text-emerald-400">{sig.volumeGrowth} Volume</span>
                </div>

                <h4 className="text-xs font-bold text-white">{sig.topic}</h4>
                <p className="text-[11px] text-slate-300 italic border-l-2 border-amber-500/40 pl-2.5">
                  {sig.samplePostSnippet}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900 space-y-2">
                <div className="text-[10px] font-mono-code font-bold text-amber-400">Action Recommandée :</div>
                <p className="text-[11px] text-slate-200 font-medium">{sig.recommendedMissionAction}</p>
                <button
                  onClick={() => onExecuteRecommendation(sig.topic)}
                  className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Transformer en Mission</span>
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
              <span>Missions™ Métiers Actives ({activeMissions.length})</span>
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
      </section>
    </div>
  );
};
