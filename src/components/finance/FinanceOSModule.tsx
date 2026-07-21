import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  Zap,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { FinanceStats } from '../../types';

interface FinanceOSModuleProps {
  stats: FinanceStats;
}

export const FinanceOSModule: React.FC<FinanceOSModuleProps> = ({ stats }) => {
  const roi = stats.total_cost > 0
    ? ((stats.total_revenue - stats.total_cost) / stats.total_cost * 100).toFixed(1)
    : '0';

  const profit = stats.total_revenue - stats.total_cost;

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono-code font-bold mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            <span>FINANCE OS • TEMPS RÉEL (XOF)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Tableau de Bord ROI & Efficacité IA</h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualisez précisément combien chaque mission rapporte par rapport au coût des API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Derniers 30 Jours</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-purple-500">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Coût total IA</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">
            {stats.total_cost.toLocaleString()} <span className="text-sm font-normal text-slate-500">XOF</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono-code">
            Consommation API Conseil & Agents
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-emerald-500">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Revenu généré (Quotes)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono-code">
            {stats.total_revenue.toLocaleString()} <span className="text-sm font-normal text-slate-500">XOF</span>
          </div>
          <div className="text-[10px] text-emerald-500/70 font-mono-code">
            Basé sur les devis acceptés (Sales OS)
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-cyan-500">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Index ROI IA</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono-code">
            {roi}%
          </div>
          <div className="text-[10px] text-cyan-500/70 font-mono-code flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            Performance stratégique
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-amber-500">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Bénéfice Net IA</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono-code">
            {profit.toLocaleString()} <span className="text-sm font-normal text-slate-500">XOF</span>
          </div>
          <div className="text-[10px] text-amber-500/70 font-mono-code">
            Valeur ajoutée nette pour la PME
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events List */}
        <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              Historique des Transactions IA & Business
            </h3>
            <button className="text-[10px] text-cyan-400 font-bold hover:underline">Voir tout l'historique</button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {stats.events.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs italic">
                Aucune transaction enregistrée pour le moment.
              </div>
            ) : (
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="sticky top-0 bg-slate-950/80 backdrop-blur-md text-slate-500 font-mono-code uppercase text-[9px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-6">Date & Type</th>
                    <th className="py-3 px-6">Détails de l'Action</th>
                    <th className="py-3 px-6 text-right">Montant (XOF)</th>
                    <th className="py-3 px-6 text-center">Impact ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {stats.events.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-200">{event.timestamp.split(' ')[0]}</div>
                        <div className="text-[9px] text-slate-500 font-mono-code">{event.type}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white">{event.title}</div>
                      </td>
                      <td className={`py-4 px-6 text-right font-mono-code font-bold ${event.is_cost ? 'text-purple-400' : 'text-emerald-400'}`}>
                        {event.is_cost ? '-' : '+'}{event.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {event.is_cost ? (
                          <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <ArrowDownRight className="w-3 h-3" /> Investissement
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ArrowUpRight className="w-3 h-3" /> Revenu
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ROI Breakdown Chart (Simulated/Visual) */}
        <div className="glass-panel p-6 rounded-3xl space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-400" />
            Répartition de l'Efficacité
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Marketing & Acquisition</span>
                <span className="text-white font-bold">42%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Opérations & Conseil IA</span>
                <span className="text-white font-bold">35%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">R&D / Knowledge Graph</span>
                <span className="text-white font-bold">23%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Conseil du CFO Agent™</div>
            <p className="text-[11px] text-slate-300 leading-relaxed italic">
              "L'augmentation des débats sur le segment Marketing a généré 2.8x plus de conversions ce mois-ci. Je recommande de maintenir ce rythme d'investissement API."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
