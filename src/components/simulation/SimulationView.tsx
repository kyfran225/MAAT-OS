import React, { useState } from 'react';
import { SimulationScenario } from '../../types';
import { Cpu, PlayCircle, ArrowRight } from 'lucide-react';

interface SimulationViewProps {
  scenarios: SimulationScenario[];
  onRunNewSimulation: (title: string, variable: string, budgetChange: string) => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  scenarios,
  onRunNewSimulation
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || '');

  // Form states for new scenario
  const [customTitle, setCustomTitle] = useState('');
  const [customVariable] = useState('Budget publicitaire (+30%)');

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleCreateScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTitle.trim()) {
      onRunNewSimulation(customTitle.trim(), customVariable, '+$8,000');
      setCustomTitle('');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono-code font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>MODE SIMULATION™ • WHAT-IF ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Simulateur de Scénarios ROI & Risques</h1>
          <p className="text-xs text-slate-400 mt-1">
            Testez l'impact des décisions stratégiques avant d'engager du capital réel.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-mono-code text-cyan-400 font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            Moteur Prédictif Actif
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Scenarios */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-mono-code font-bold text-slate-400 uppercase tracking-wider px-1">
            Scénarios de Simulation ({scenarios.length})
          </h3>

          <div className="space-y-3">
            {scenarios.map((scen) => {
              const isSelected = scen.id === selectedScenarioId;
              return (
                <div
                  key={scen.id}
                  onClick={() => setSelectedScenarioId(scen.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {scen.variable}
                    </span>
                    <span className="text-xs font-mono-code font-bold text-emerald-400">
                      ROI {scen.estimatedROI}x
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{scen.title}</h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Risque : <strong className={scen.riskLevel === 'Faible' ? 'text-emerald-400' : 'text-amber-400'}>{scen.riskLevel}</strong></span>
                    <span className="font-mono-code text-cyan-300 font-bold">{scen.confidenceScore}% Confiance</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form to Launch Custom Simulation */}
          <form onSubmit={handleCreateScenario} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white font-mono-code uppercase">Lancer une Nouvelle Simulation</h4>
            <input
              type="text"
              placeholder="ex: Passer le prix de l'abonnement PME à $99/mois"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Calculer les Projections ROI</span>
            </button>
          </form>
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-8">
          {selectedScenario && (
            <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono-code font-bold text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                    Variable : {selectedScenario.variable}
                  </span>
                  <h2 className="text-2xl font-bold font-heading text-white mt-2">
                    {selectedScenario.title}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedScenario.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
                  <div className="text-[10px] text-slate-400 font-mono-code uppercase">ROI Estimé</div>
                  <div className="text-2xl font-bold font-mono-code text-emerald-400">
                    {selectedScenario.estimatedROI}x
                  </div>
                </div>
              </div>

              {/* Metrics Grid Projections */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono-code uppercase">Revenu Additionnel</div>
                  <div className="text-lg font-bold font-mono-code text-white">{selectedScenario.projections.revenueIncrease}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono-code uppercase">Acquisition Client</div>
                  <div className="text-lg font-bold font-mono-code text-cyan-400">{selectedScenario.projections.customerAcquisition}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono-code uppercase">Délai Rentabilité</div>
                  <div className="text-lg font-bold font-mono-code text-amber-400">{selectedScenario.projections.timeline}</div>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 font-mono-code uppercase">
                  <span>Recommandation du Decision Engine™</span>
                  <span>Confiance : {selectedScenario.confidenceScore}%</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {selectedScenario.recommendation}
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button 
                  onClick={() => alert('Scenario validé et transformé en Mission Métier Active !')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Transformer cette Simulation en Mission Actives</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
