import React, { useState } from 'react';
import { DecisionLog } from '../../types';
import { FileText, Search, Filter, CheckCircle2 } from 'lucide-react';

interface JournalBoardProps {
  logs: DecisionLog[];
}

export const JournalBoard: React.FC<JournalBoardProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minConfidence, setMinConfidence] = useState<number>(0);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.reasoning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConfidence = log.confidenceScore >= minConfidence;
    return matchesSearch && matchesConfidence;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono-code font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>JOURNAL DE BORD™ • DECISION LOGS</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Journal des Décisions & Traçabilité IA</h1>
          <p className="text-xs text-slate-400 mt-1">
            Chaque recommandation est expliquée avec son indice de confiance et son argumentation sous-jacente.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono-code font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            {logs.length} Décisions Traçables
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass-panel p-4 rounded-2xl">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher une décision, un agent ou un mot-clé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Confidence Filter */}
        <div className="flex items-center gap-2 text-xs font-mono-code">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Confiance Min :</span>
          {[0, 85, 90].map((level) => (
            <button
              key={level}
              onClick={() => setMinConfidence(level)}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                minConfidence === level
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {level === 0 ? 'Toutes' : `>${level}%`}
            </button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-code text-slate-500">{log.timestamp}</span>
                <span className="text-xs font-bold text-amber-400">{log.agentName}</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {log.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {log.confidenceScore}% Confiance
                </span>
                <span className={`text-[10px] font-mono-code px-2 py-1 rounded font-bold uppercase ${
                  log.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {log.status}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1">{log.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {log.reasoning}
              </p>
            </div>

            {log.impacts.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="text-[10px] font-mono-code uppercase font-bold text-slate-500">Impacts & Bénéfices Calculés</div>
                <ul className="flex flex-wrap gap-2">
                  {log.impacts.map((imp, idx) => (
                    <li key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1.5 font-mono-code">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
