import React, { useState } from 'react';
import { ExecutiveAuditReport } from '../../types';
import { 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  Target, 
  Zap, 
  RefreshCw
} from 'lucide-react';

interface HealthAuditModuleProps {
  onAddMissionFromAudit?: (title: string, category: string, target: string, budget: number, objective: string) => void;
}

export const HealthAuditModule: React.FC<HealthAuditModuleProps> = ({
  onAddMissionFromAudit
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<ExecutiveAuditReport>({
    id: 'audit-2026-07',
    generatedAt: 'À l\'instant',
    overallScore: 88,
    scores: {
      strategicAlignment: 94,
      commercialConversion: 78,
      financialEfficiency: 91,
      governanceRisk: 96
    },
    agentDiagnostics: [
      {
        agentName: 'CEO Agent™',
        role: 'Directeur Exécutif',
        quote: 'L\'alignement avec la vision du Founder Brain est excellent (94%). Les priorités d\'expansion sur le segment PME sont clairement définies.',
        status: 'optimal'
      },
      {
        agentName: 'Marketing Director™',
        role: 'Directeur Marketing',
        quote: 'Le canal WhatsApp Business offre un taux d\'ouverture record (94%), mais le temps de réponse moyen reste à 48h. Une automatisation est nécessaire.',
        status: 'warning'
      },
      {
        agentName: 'Finance Director (CFO)™',
        role: 'Directeur Financier',
        quote: 'Le CAC est maîtrisé à $180/client. La marge brute moyenne de 68% permet une réallocation budgétaire de +20% vers l\'outreach commercial.',
        status: 'optimal'
      },
      {
        agentName: 'Risk & Governance Lead™',
        role: 'Gardien Conformité',
        quote: 'Toutes les allégations marketing et chartes tarifaires sont conformes aux règles non négociables fixées par le fondateur.',
        status: 'optimal'
      }
    ],
    bottlenecks: [
      {
        issue: 'Temps de qualification des leads WhatsApp jugé trop long (48h)',
        severity: 'Élevé',
        impact: 'Perte estimée à 15% des prospects à fort potentiel d\'achat.'
      },
      {
        issue: 'Sous-optimisation des grilles tarifaires B2B sur le segment intermédiaire',
        severity: 'Modéré',
        impact: 'Manque à gagner de $4,500/mois sur les contrats de consulting.'
      }
    ],
    actionPlan: [
      {
        title: 'Mission : Automatisation du Qualification Bot WhatsApp PME',
        targetDepartment: 'Marketing & Sales OS',
        estimatedROI: '+28% de conversion',
        priority: 'Urgent'
      },
      {
        title: 'Mission : Revalorisation des Grilles Tarifaires B2B 2026',
        targetDepartment: 'Finance OS',
        estimatedROI: '+$54,000 / an',
        priority: 'Haute'
      }
    ]
  });

  const handleRefreshAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setReport({
        ...report,
        generatedAt: 'À l\'instant',
        overallScore: 91,
        scores: {
          ...report.scores,
          commercialConversion: 84
        }
      });
      setIsAuditing(false);
    }, 1500);
  };

  const handleLaunchMissionFromPlan = (planItem: ExecutiveAuditReport['actionPlan'][0]) => {
    if (onAddMissionFromAudit) {
      onAddMissionFromAudit(
        planItem.title,
        'strategy',
        `Résoudre la friction : ${planItem.title}`,
        15000,
        `Mission générée à partir du Bilan Stratégique Automatisé. Objectif : ${planItem.estimatedROI}`
      );
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono-code font-bold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>BILAN STRATÉGIQUE AUTOMATISÉ • AUDIT CONSEIL IA</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Rapport d'Audit Exécutif & Santé de la PME</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyse à 360° générée par le Conseil d'Administration IA sur l'ensemble de vos données ingérées.
          </p>
        </div>

        <button
          onClick={handleRefreshAudit}
          disabled={isAuditing}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {isAuditing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Audit par le Conseil IA...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Relancer l'Audit Global</span>
            </>
          )}
        </button>
      </div>

      {/* Main Health Score Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Main Overall Health Card */}
        <div className="sm:col-span-2 lg:col-span-1 glass-panel p-5 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-950 space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono-code font-bold uppercase">Santé Globale PME</span>
            <div className="text-4xl font-extrabold text-emerald-400 font-mono-code mt-2">
              {report.overallScore}%
            </div>
          </div>
          <div className="text-[11px] text-emerald-300 font-mono-code flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Organisation Optimale</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-medium">Alignement Founder</div>
          <div className="text-2xl font-bold text-amber-400 font-mono-code">{report.scores.strategicAlignment}%</div>
          <div className="text-[10px] text-slate-500">ADN et Valeurs respectés</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-medium">Conversion Sales OS</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono-code">{report.scores.commercialConversion}%</div>
          <div className="text-[10px] text-slate-500">Performance du pipeline</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-medium">Efficacité Financière</div>
          <div className="text-2xl font-bold text-purple-400 font-mono-code">{report.scores.financialEfficiency}%</div>
          <div className="text-[10px] text-slate-500">Marge & CAC maîtrisés</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-medium">Conformité & Risk</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono-code">{report.scores.governanceRisk}%</div>
          <div className="text-[10px] text-slate-500">Zéro risque d'image</div>
        </div>
      </div>

      {/* AI Board Diagnostics */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-5">
        <h3 className="text-base font-bold font-heading text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bot className="w-5 h-5 text-purple-400" />
          <span>Diagnostic Individuel du Conseil d'Administration IA</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.agentDiagnostics.map((diag, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{diag.agentName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono-code">{diag.role}</span>
                </div>

                <span className={`text-[10px] font-mono-code font-bold px-2.5 py-0.5 rounded-full border ${
                  diag.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {diag.status === 'optimal' ? 'Validation Optimal' : 'Vigilance'}
                </span>
              </div>

              <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-900">
                "{diag.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottlenecks & Strategic Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bottlenecks Detected */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-amber-500/30">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Frictions & Goulots d'Étranglement Détectés ({report.bottlenecks.length})</span>
          </h3>

          <div className="space-y-3">
            {report.bottlenecks.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300">{item.issue}</h4>
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Sévérité : {item.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-cyan-500/30">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Plan d'Action Correctif Recommandé ({report.actionPlan.length})</span>
          </h3>

          <div className="space-y-3">
            {report.actionPlan.map((plan, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{plan.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono-code">{plan.targetDepartment} • ROI: {plan.estimatedROI}</span>
                  </div>

                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    {plan.priority}
                  </span>
                </div>

                <button
                  onClick={() => handleLaunchMissionFromPlan(plan)}
                  className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/30 transition-all"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Convertir en Mission™ 6-Couches</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
