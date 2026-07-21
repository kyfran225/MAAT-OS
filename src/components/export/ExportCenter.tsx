import React, { useState } from 'react';
import {
  Mission,
  SystemHealth,
  FounderBrainConfig,
  CompanyBrainConfig,
  CRMContact,
  SimulationScenario,
  DecisionLog,
  Agent
} from '../../types';
import {
  FileDown,
  FileText,
  Users,
  TrendingUp,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Loader2,
  Shield,
  Target,
  Cpu
} from 'lucide-react';
import {
  exportMissionPDF,
  exportHealthReportPDF,
  exportCRMContactPDF,
  exportSimulationPDF,
  exportDecisionLogPDF
} from '../../services/pdfExportService';

interface ExportCenterProps {
  missions: Mission[];
  systemHealth: SystemHealth;
  founderConfig: FounderBrainConfig;
  companyConfig: CompanyBrainConfig;
  crmContacts: CRMContact[];
  simulations: SimulationScenario[];
  decisionLogs: DecisionLog[];
  agents: Agent[];
}

type ExportStatus = 'idle' | 'generating' | 'done';

export const ExportCenter: React.FC<ExportCenterProps> = ({
  missions,
  systemHealth,
  founderConfig,
  companyConfig,
  crmContacts,
  simulations,
  decisionLogs,
  agents
}) => {
  const [jobs, setJobs] = useState<Record<string, ExportStatus>>({});
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missions[0]?.id || '');
  const [selectedContactId, setSelectedContactId] = useState<string>(crmContacts[0]?.id || '');
  const [selectedSimId, setSelectedSimId] = useState<string>(simulations[0]?.id || '');

  const setJobStatus = (id: string, status: ExportStatus) =>
    setJobs(prev => ({ ...prev, [id]: status }));

  const runExport = async (id: string, fn: () => void) => {
    setJobStatus(id, 'generating');
    await new Promise(r => setTimeout(r, 600));
    try {
      fn();
      setJobStatus(id, 'done');
      setTimeout(() => setJobStatus(id, 'idle'), 4000);
    } catch (e) {
      console.error(e);
      setJobStatus(id, 'idle');
    }
  };

  const btnClass = (id: string) =>
    `w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
      jobs[id] === 'generating'
        ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
        : jobs[id] === 'done'
        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
    }`;

  const btnIcon = (id: string) => {
    if (jobs[id] === 'generating') return <Loader2 className="w-4 h-4 animate-spin" />;
    if (jobs[id] === 'done') return <CheckCircle2 className="w-4 h-4" />;
    return <FileDown className="w-4 h-4" />;
  };

  const btnLabel = (id: string, label: string) => {
    if (jobs[id] === 'generating') return 'Génération en cours...';
    if (jobs[id] === 'done') return 'PDF Téléchargé !';
    return label;
  };

  const selectedMission = missions.find(m => m.id === selectedMissionId);
  const selectedContact = crmContacts.find(c => c.id === selectedContactId);
  const selectedSim = simulations.find(s => s.id === selectedSimId);

  const EXPORT_CARDS = [
    {
      id: 'health',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: 'Rapport de Santé Exécutif',
      subtitle: 'Scores système, Founder Brain, portefeuille de Missions',
      color: 'border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-400',
      available: true,
      selector: null,
      exportFn: () => exportHealthReportPDF(systemHealth, founderConfig, companyConfig, missions, agents),
      exportLabel: 'Exporter le Bilan Stratégique'
    },
    {
      id: 'mission',
      icon: <Target className="w-5 h-5 text-amber-400" />,
      title: 'Briefing de Mission',
      subtitle: 'Plan d\'exécution 6-couches, KPIs, contraintes et apprentissages',
      color: 'border-amber-500/30',
      badge: 'bg-amber-500/10 text-amber-400',
      available: missions.length > 0,
      selector: (
        <select
          value={selectedMissionId}
          onChange={e => setSelectedMissionId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          {missions.map(m => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
      ),
      exportFn: () => selectedMission && exportMissionPDF(selectedMission),
      exportLabel: 'Exporter la Mission'
    },
    {
      id: 'contact',
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      title: 'Fiche Contact CRM',
      subtitle: 'Scores IA, insights, prochaine action et notes de vente',
      color: 'border-cyan-500/30',
      badge: 'bg-cyan-500/10 text-cyan-400',
      available: crmContacts.length > 0,
      selector: (
        <select
          value={selectedContactId}
          onChange={e => setSelectedContactId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
        >
          {crmContacts.map(c => (
            <option key={c.id} value={c.id}>{c.name} - {c.company}</option>
          ))}
        </select>
      ),
      exportFn: () => selectedContact && exportCRMContactPDF(selectedContact),
      exportLabel: 'Exporter la Fiche Contact'
    },
    {
      id: 'simulation',
      icon: <TrendingUp className="w-5 h-5 text-purple-400" />,
      title: 'Rapport de Simulation ROI',
      subtitle: 'Scénario What-If, projections financières et recommandation CFO',
      color: 'border-purple-500/30',
      badge: 'bg-purple-500/10 text-purple-400',
      available: simulations.length > 0,
      selector: (
        <select
          value={selectedSimId}
          onChange={e => setSelectedSimId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
        >
          {simulations.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      ),
      exportFn: () => selectedSim && exportSimulationPDF(selectedSim),
      exportLabel: 'Exporter le Scénario ROI'
    },
    {
      id: 'journal',
      icon: <BookOpen className="w-5 h-5 text-slate-300" />,
      title: 'Journal de Bord Complet',
      subtitle: 'Registre de toutes les décisions IA avec indices de confiance',
      color: 'border-slate-700',
      badge: 'bg-slate-700/40 text-slate-300',
      available: decisionLogs.length > 0,
      selector: null,
      exportFn: () => exportDecisionLogPDF(decisionLogs),
      exportLabel: `Exporter ${decisionLogs.length} Décisions`
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono-code font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>EXPORT CENTER™ - EXECUTIVE BRIEFINGS</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Centre d'Export PDF</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generez et telechargez instantanement des rapports executifs de haute qualite directement depuis l'OS.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400">Documents disponibles</div>
            <div className="text-2xl font-bold font-mono-code text-amber-400">
              {EXPORT_CARDS.filter(c => c.available).length}
              <span className="text-slate-500 text-sm font-normal">/{EXPORT_CARDS.length}</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <FileDown className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-400">Generation 100% locale.</strong> Aucun document n'est transmis a un serveur externe. Les PDF sont generes directement dans votre navigateur en moins d'une seconde, avec la charte graphique MAAT Studio AI.
        </p>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {EXPORT_CARDS.map(card => (
          <div
            key={card.id}
            className={`glass-panel p-6 rounded-2xl border space-y-4 flex flex-col ${card.color} ${!card.available ? 'opacity-50' : ''}`}
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{card.title}</h3>
                  <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full ${card.badge}`}>
                    {card.available ? 'Disponible' : 'Aucune donnee'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed flex-1">
              {card.subtitle}
            </p>

            {/* Selector if needed */}
            {card.selector && card.available && (
              <div>
                <label className="text-[10px] font-mono-code text-slate-500 uppercase font-bold block mb-1">
                  Selectionner un document
                </label>
                {card.selector}
              </div>
            )}

            {/* Export Button */}
            <button
              disabled={!card.available || jobs[card.id] === 'generating'}
              onClick={() => card.available && runExport(card.id, card.exportFn)}
              className={btnClass(card.id)}
            >
              {btnIcon(card.id)}
              <span>{btnLabel(card.id, card.exportLabel)}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Quick Export All CTA */}
      {missions.length > 0 && (
        <div className="glass-panel-gold p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export CEO Pack Complet</h3>
              <p className="text-xs text-slate-400">Rapport de Sante + Toutes les Missions en un clic</p>
            </div>
          </div>

          <button
            disabled={jobs['all'] === 'generating'}
            onClick={() => runExport('all', () => {
              exportHealthReportPDF(systemHealth, founderConfig, companyConfig, missions, agents);
              if (decisionLogs.length > 0) exportDecisionLogPDF(decisionLogs);
            })}
            className={`shrink-0 px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              jobs['all'] === 'generating'
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : jobs['all'] === 'done'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
            }`}
          >
            {btnIcon('all')}
            <span>{btnLabel('all', 'Exporter le CEO Pack')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
