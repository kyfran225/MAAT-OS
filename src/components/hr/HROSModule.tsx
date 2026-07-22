import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Search,
  ChevronRight,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { HRData, FounderBrainConfig } from '../../types';

interface HROSModuleProps {
  hrData: HRData;
  founderConfig: FounderBrainConfig;
  onCreateJob: (title: string) => void;
  onScreenCandidates: (jobId: string) => void;
  onGenerateOnboarding: (name: string, role: string) => void;
}

export const HROSModule: React.FC<HROSModuleProps> = ({
  hrData,
  founderConfig,
  onCreateJob,
  onScreenCandidates,
  onGenerateOnboarding
}) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'onboarding'>('jobs');
  const [newJobTitle, setNewJobTitle] = useState('');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle) return;
    onCreateJob(newJobTitle);
    setNewJobTitle('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono-code font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>RH EXPANSION • L'AGENT RECRUTEUR™</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Gestion des Talents & Culture Company</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automatisez le recrutement et l'onboarding pour infuser votre culture en 24h.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Culture Fit: {founderConfig.founderName ? 'Connecté' : 'Non configuré'}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-full sm:w-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'jobs' ? 'bg-indigo-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Offres d'Emploi
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'candidates' ? 'bg-indigo-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Candidats Qualifiés
        </button>
        <button
          onClick={() => setActiveTab('onboarding')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'onboarding' ? 'bg-purple-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Onboarding 24h
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <form onSubmit={handleCreateJob} className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Générer une nouvelle fiche de poste</label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="ex: Responsable Commercial Afrique de l'Ouest"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Générer via l'IA</span>
                </button>
              </form>

              <div className="grid grid-cols-1 gap-4">
                {hrData.jobs.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs italic glass-panel rounded-3xl">
                    Aucune offre d'emploi active pour le moment.
                  </div>
                ) : (
                  hrData.jobs.map((job) => (
                    <div key={job.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{job.title}</h3>
                            <div className="text-[10px] text-slate-500 font-mono-code uppercase">{job.status} • {job.createdAt}</div>
                          </div>
                        </div>
                        <button className="text-[11px] font-bold text-indigo-400 hover:underline">Modifier</button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {job.description}
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <button
                          onClick={() => onScreenCandidates(job.id)}
                          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                          <Search className="w-4 h-4 text-indigo-400" />
                          <span>Analyser les CV reçus</span>
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>Partager l'offre</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">Pipeline de Recrutement IA</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-500 font-mono-code uppercase text-[9px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-6">Candidat</th>
                      <th className="py-3 px-6">Poste Visé</th>
                      <th className="py-3 px-6 text-center">Score Culture Fit</th>
                      <th className="py-3 px-6">Statut</th>
                      <th className="py-3 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {hrData.candidates.length > 0 ? hrData.candidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">{c.name}</td>
                        <td className="py-4 px-6 text-slate-400">{c.role}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`font-mono-code font-bold ${c.matchScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {c.matchScore}%
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="capitalize px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">{c.status}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => onGenerateOnboarding(c.name, c.role)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold hover:bg-indigo-500/20 transition-all"
                          >
                            Recruter & Onboarder
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500 italic">Aucun candidat dans le pipeline.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'onboarding' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hrData.onboarding_plans.length > 0 ? hrData.onboarding_plans.map((plan, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-3xl border border-purple-500/20 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{plan.candidateName}</h4>
                      <div className="text-[10px] text-slate-500 font-mono-code uppercase">Plan Onboarding 24h • {plan.role}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {plan.schedule.map((item: any, sIdx: number) => (
                      <div key={sIdx} className="flex items-start gap-3">
                        <div className="text-[10px] font-mono-code font-bold text-purple-400 w-12 pt-1">{item.time}</div>
                        <div className="flex-1 text-[11px] text-slate-300 leading-snug flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-slate-600 shrink-0" />
                          <span>{item.activity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Exporter Plan PDF</span>
                  </button>
                </div>
              )) : (
                <div className="col-span-full p-12 text-center text-slate-500 italic glass-panel rounded-3xl">
                  Aucun plan d'onboarding actif. Recrutez un candidat pour commencer.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4 border-t-4 border-t-indigo-500">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              L'Agent Recruteur IA
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mon rôle est de garantir que chaque nouvel humain rejoignant votre PME est en parfaite résonance avec votre vision du Founder Brain.
            </p>
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Critères Culturels Actifs :</div>
              <ul className="space-y-2">
                {founderConfig.coreValues.length > 0 ? founderConfig.coreValues.map((val, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    {val}
                  </li>
                )) : (
                  <li className="text-[10px] text-slate-500 italic">Configurez le Founder Brain pour activer le filtrage culturel.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Prochaines Actions RH
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[10px] flex items-center justify-between group cursor-pointer hover:border-indigo-500/50 transition-all">
                <span className="text-slate-300">Publier sur LinkedIn</span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[10px] flex items-center justify-between group cursor-pointer hover:border-indigo-500/50 transition-all">
                <span className="text-slate-300">Relancer Candidats Rejetés</span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
