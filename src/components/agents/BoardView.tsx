import React, { useState } from 'react';
import { Agent } from '../../types';
import { Users, MessageSquare } from 'lucide-react';

interface BoardViewProps {
  agents: Agent[];
  onTriggerDebate: (topic: string) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  agents,
  onTriggerDebate
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [debateTopic] = useState('Arbitrage Budget Publicitaire vs Contenu Éducatif');
  const [isDebating, setIsDebating] = useState(false);
  const [debateLog, setDebateLog] = useState<{ agent: string; message: string; confidence: number }[] | null>(null);

  const handleRunDebate = () => {
    onTriggerDebate(debateTopic);
    setIsDebating(true);
    setDebateLog(null);

    setTimeout(() => {
      setDebateLog([
        {
          agent: 'Marketing Director™',
          message: 'Je recommande de doubler les budgets sur la campagne vidéo. La traction actuelle montre 3.8x plus d\'engagements sur le marché cible.',
          confidence: 91
        },
        {
          agent: 'Finance Director (CFO)™',
          message: 'Objection. Le coût d\'acquisition (CAC) a augmenté de 14% la semaine passée. Un versement immédiat dégraderait la marge nette. Je préconise un déblocage par paliers.',
          confidence: 95
        },
        {
          agent: 'CEO Agent™',
          message: 'Arbitrage retenu : Déblocage de 50% de l\'augmentation sous condition de maintien du CAC sous $35. Validation accordée.',
          confidence: 96
        }
      ]);
      setIsDebating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono-code font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>AI BOARD OF DIRECTORS™</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Conseil d'Administration IA & Directeurs Métiers</h1>
          <p className="text-xs text-slate-400 mt-1">
            Chaque agent spécialisé possède un niveau d'autorité, une mémoire et une grille d'analyse propre.
          </p>
        </div>

        <button
          onClick={handleRunDebate}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Simuler Débat du Conseil</span>
        </button>
      </div>

      {/* Grid: Agents Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`glass-card-interactive p-5 rounded-2xl border cursor-pointer space-y-4 ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                    {agent.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                    <p className="text-xs text-slate-400">{agent.role}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {agent.confidence}%
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic">
                "{agent.lastQuote}"
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[10px] uppercase font-mono-code font-bold text-slate-500">Responsabilités</div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.responsibilities.map((r, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Debate Simulator Panel */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>Moteur de Débat Inter-Agents en Temps Réel</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Les directeurs IA ne sont pas toujours d'accord. Le débat fait émerger la décision optimale.
            </p>
          </div>

          <button
            onClick={handleRunDebate}
            disabled={isDebating}
            className="px-4 py-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 font-bold text-xs border border-slate-700"
          >
            {isDebating ? 'Analyse du conseil...' : 'Relancer le Débat'}
          </button>
        </div>

        {isDebating && (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono-code text-slate-400">Le Conseil d'Administration IA analyse les arguments...</p>
          </div>
        )}

        {debateLog && !isDebating && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-amber-400 font-mono-code uppercase">
              Transcription du Débat • Sujet : {debateTopic}
            </div>

            <div className="space-y-3">
              {debateLog.map((log, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{log.agent}</span>
                    <span className="text-[10px] font-mono-code text-emerald-400 font-bold">
                      Confiance : {log.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Décision Finale Adoptée par le CEO Agent</span>
              <span className="font-mono-code">Decision Confidence Score : 96%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
