import React, { useState } from 'react';
import { Agent } from '../../types';
import { Users, MessageSquare, Send, Cpu } from 'lucide-react';
import { BackendService } from '../../services/backendService';

interface BoardViewProps {
  agents: Agent[];
  onTriggerDebate: (topic: string) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  agents,
  onTriggerDebate
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [debateTopic, setDebateTopic] = useState('Arbitrage Budget Publicitaire vs Contenu Éducatif');
  const [isDebating, setIsDebating] = useState(false);
  const [debateLog, setDebateLog] = useState<{ agent: string; message: string; confidence: number }[] | null>(null);
  const [finalDecision, setFinalDecision] = useState<string | null>(null);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  const handleRunDebate = async () => {
    if (!debateTopic.trim()) return;
    onTriggerDebate(debateTopic);
    setIsDebating(true);
    setDebateLog(null);
    setFinalDecision(null);

    const backendRes = await BackendService.getInstance().runBoardDebate(debateTopic);

    if (backendRes) {
      setDebateLog(backendRes.turns);
      setFinalDecision(backendRes.finalDecision);
      setIsLiveApi(true);
      setIsDebating(false);
    } else {
      // Fallback local simulation
      setIsLiveApi(false);
      setTimeout(() => {
        setDebateLog([
          {
            agent: 'Marketing Director™',
            message: `Sur le sujet "${debateTopic}", je recommande de doubler les budgets de la campagne. La traction actuelle montre un fort engagement.`,
            confidence: 91
          },
          {
            agent: 'Finance Director (CFO)™',
            message: 'Objection. Le coût d\'acquisition (CAC) doit rester sous contrôle. Je préconise un déblocage par paliers sous condition de ROI.',
            confidence: 95
          },
          {
            agent: 'CEO Agent™',
            message: `Arbitrage retenu : Validation conditionnelle sur "${debateTopic}" avec déblocage budgétaire selon les jalons d'acquisition.`,
            confidence: 96
          }
        ]);
        setFinalDecision(`Arbitrage du CEO Agent pour "${debateTopic}" (Validation conditionnelle par paliers).`);
        setIsDebating(false);
      }, 1000);
    }
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
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span>Moteur de Débat Inter-Agents en Temps Réel</span>
              </h2>
              {isLiveApi && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono-code font-bold flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  API FASTAPI LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Saisissez un sujet stratégique pour soumettre une question arbitrage au Conseil d'Administration IA.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={debateTopic}
              onChange={(e) => setDebateTopic(e.target.value)}
              placeholder="Ex: Lancer une offre Freemium..."
              className="flex-1 md:w-80 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <button
              onClick={handleRunDebate}
              disabled={isDebating || !debateTopic.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isDebating ? 'Analyse...' : 'Lancer le Débat'}</span>
            </button>
          </div>
        </div>

        {isDebating && (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono-code text-slate-400">Le Conseil d'Administration IA délibère en temps réel...</p>
          </div>
        )}

        {debateLog && !isDebating && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-amber-400 font-mono-code uppercase flex items-center justify-between">
              <span>Transcription du Débat • Sujet : {debateTopic}</span>
              <span className="text-slate-500 font-normal">{debateLog.length} interventions</span>
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

            {finalDecision && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold text-emerald-400">
                <span>{finalDecision}</span>
                <span className="font-mono-code shrink-0">Decision Confidence Score : 96%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
