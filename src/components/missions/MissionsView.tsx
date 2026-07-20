import React, { useState } from 'react';
import { Mission } from '../../types';
import { Target, PlusCircle, CheckCircle2, Clock, AlertCircle, Layers, BookOpen } from 'lucide-react';

interface MissionsViewProps {
  missions: Mission[];
  onOpenCreateModal: () => void;
  onTogglePlanStep: (missionId: string, stepId: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  onOpenCreateModal,
  onTogglePlanStep
}) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missions[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const selectedMission = missions.find(m => m.id === selectedMissionId) || missions[0];

  const filteredMissions = missions.filter(m => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono-code font-bold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>MOTEUR DE MISSIONS™ V2</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Missions Métiers & Workflows Cognitifs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Les logiciels exécutent des tâches. MAAT Studio AI accomplit des Missions découpées en 6 couches.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[3]" />
          <span>Nouvelle Mission™</span>
        </button>
      </div>

      {/* Main Grid: List on Left, Detail 6-Layers on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium overflow-x-auto">
            {['all', 'active', 'debating', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status === 'all' ? 'Toutes' : status === 'active' ? 'Actives' : status === 'debating' ? 'En Débat' : 'Terminées'}
              </button>
            ))}
          </div>

          {/* Missions List */}
          <div className="space-y-3">
            {filteredMissions.map((mission) => {
              const isSelected = mission.id === selectedMissionId;
              return (
                <div
                  key={mission.id}
                  onClick={() => setSelectedMissionId(mission.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {mission.category}
                    </span>
                    <span className="text-xs font-mono-code font-bold text-emerald-400">
                      Score {mission.healthScore}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{mission.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {mission.target}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {mission.timeline}
                    </span>
                    <span className="font-mono-code font-bold text-amber-400">{mission.progress}% Fait</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Column: The 6 Layers of a Mission */}
        <div className="lg:col-span-8 space-y-6">
          {selectedMission && (
            <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-8">
              {/* Mission Header Detail */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code font-bold text-amber-400 uppercase tracking-widest px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                      {selectedMission.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono-code">Créée le {selectedMission.createdAt}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-white mt-2">
                    {selectedMission.title}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedMission.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shrink-0">
                  <div className="text-[10px] text-slate-400 font-mono-code uppercase">Confiance IA</div>
                  <div className="text-xl font-bold font-mono-code text-emerald-400">
                    {selectedMission.confidenceScore}%
                  </div>
                </div>
              </div>

              {/* The 6 Layers Breakdown Grid */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold font-mono-code uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Structure des 6 Couches de la Mission™</span>
                </h3>

                {/* Layer 1: Objectif & Layer 2: Contraintes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Layer 1 */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-amber-400 font-mono-code uppercase">1. Objectif Métier</div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {selectedMission.objective}
                    </p>
                  </div>

                  {/* Layer 2 */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-amber-400 font-mono-code uppercase">2. Contraintes & Limites</div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {selectedMission.constraints.map((c, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Layer 3: Ressources & Layer 5: Exécution Agents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Layer 3 */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-cyan-400 font-mono-code uppercase">3. Ressources Mobilisées</div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {selectedMission.resources.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Layer 5 */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-emerald-400 font-mono-code uppercase">5. Agents Mobilisés</div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedMission.activeAgents.map((agId, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono-code">
                          ● {agId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Layer 4: Plan d'Action Interactif */}
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-amber-400 font-mono-code uppercase">4. Plan d'Action & Workflow Cognitif</div>
                    <span className="text-xs text-slate-400">Cliquez pour valider les étapes</span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedMission.planSteps.map((step) => (
                      <div
                        key={step.id}
                        onClick={() => onTogglePlanStep(selectedMission.id, step.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          step.status === 'completed'
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                            : step.status === 'in_progress'
                            ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            step.status === 'completed'
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'border-slate-700'
                          }`}>
                            {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold">{step.action}</div>
                            <div className="text-[10px] opacity-75">{step.department} • Assigné à {step.assignedAgent}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-bold ${
                          step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {step.status === 'completed' ? 'Validé' : step.status === 'in_progress' ? 'En cours' : 'En attente'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layer 6: Apprentissage (Learning Engine) */}
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono-code uppercase">
                    <BookOpen className="w-4 h-4" />
                    <span>6. Apprentissage Permanent (Learning Engine™)</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedMission.learnings.map((l, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">💡</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
