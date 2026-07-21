import React, { useState } from 'react';
import { CRMContact, GeneratedAction, GeneratedActionType } from '../../types';
import { 
  Zap, 
  FileText, 
  MessageSquare, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Bot
} from 'lucide-react';

interface ActionGeneratorModuleProps {
  contacts: CRMContact[];
  onAddMissionFromAction?: (actionTitle: string, actionDescription: string) => void;
}

export const SAMPLE_ACTIONS: GeneratedAction[] = [
  {
    id: 'act-01',
    type: 'devis_proposition',
    title: 'Proposition Commerciale Sur-Mesure • Groupe Diallo & Co',
    targetContactName: 'Amadou Diallo',
    targetCompany: 'Groupe Diallo & Co',
    assignedAgent: 'Sales Director Agent™',
    content: `OBJET : Proposition d'Accompagnement OS & Automatisation Distribution

Bonjour M. Amadou Diallo,

Suite à l'analyse de vos besoins d'automatisation et aux éléments de votre catalogue produits 2026, l'équipe MAAT Studio AI a formulé la proposition suivante :

1. DÉPLOIEMENT SALES OS & WHATSAPP BUSINESS
   - Interconnexion du canal WhatsApp pour vos revendeurs.
   - Qualification automatique des commandes de stock par l'IA.
   - Budget alloué : $18,000 (Payable en 3 jalons mensuels).

2. RÉSULTATS ESTIMÉS (CONSEIL IA)
   - Réduction du délai de prise de commande : de 48h à < 2 minutes.
   - Gain d'efficacité opérationnelle : +35% dès le premier mois.

Restant à votre entière disposition pour valider ce jalon.`,
    metadata: {
      estimatedAmount: 18000,
      recommendedChannel: 'WhatsApp & E-mail',
      confidenceScore: 96,
      sourceDocument: 'Catalogue_Produits_et_Tarifs_2026.pdf'
    },
    createdAt: 'À l\'instant',
    status: 'approved'
  },
  {
    id: 'act-02',
    type: 'relance_whatsapp',
    title: 'Message de Relance WhatsApp • InnovTech Solutions',
    targetContactName: 'Sarah Benali',
    targetCompany: 'InnovTech Solutions',
    assignedAgent: 'Marketing Director™',
    content: `Bonjour Sarah ! J'espère que vous allez bien. 

Notre Directeur Financier (CFO Agent) a validé l'avenant tarifaire avec la remise de 10% sur l'abonnement annuel MAAT Studio AI. 

Le contrat d'intégration API avec vos utilisateurs est prêt. Souhaitez-vous que nous planifiions la session de démarrage ce jeudi à 14h ?`,
    metadata: {
      recommendedChannel: 'WhatsApp Direct',
      confidenceScore: 92,
      sourceDocument: 'Export_WhatsApp_Business_Clients.txt'
    },
    createdAt: 'Il y a 10 min',
    status: 'draft'
  }
];

export const ActionGeneratorModule: React.FC<ActionGeneratorModuleProps> = ({
  contacts,
  onAddMissionFromAction
}) => {
  const [actions, setActions] = useState<GeneratedAction[]>([]);

  const handleLoadDemoActions = () => {
    setActions(SAMPLE_ACTIONS);
  };

  const [selectedActionType, setSelectedActionType] = useState<GeneratedActionType>('devis_proposition');
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const contact = contacts.find(c => c.id === selectedContactId) || {
      name: 'Prospect PME',
      company: 'PME Partenaire',
      estimatedBudget: 15000
    };

    setTimeout(() => {
      let newTitle = '';
      let newContent = '';

      if (selectedActionType === 'devis_proposition') {
        newTitle = `Proposition Commerciale IA • ${contact.company}`;
        newContent = `PROPOSITION STRATÉGIQUE MAAT STUDIO AI

Pour : ${contact.name} (${contact.company})
Agent Référent : Sales Director Agent™

1. DIAGNOSTIC & CONSEIL IA
Sur la base de vos documents ingérés et de vos échanges récents, nous recommandons le déploiement du système d'exploitation d'entreprise avec un budget estimé à $${contact.estimatedBudget.toLocaleString()}.

2. PLAN D'ACTION IMMÉDIAT
- Jalon 1 : Ingestion du Founder Brain & Company Brain (7 jours).
- Jalon 2 : Configuration du Sales OS & Pipeline commercial (14 jours).
- Jalon 3 : Onboarding des équipes et suivi du ROI (15 jours).

3. ENGAGEMENT DE CONFORT
- Score de confiance IA : 94%.
- Suivi du rendement garanti par le Finance Director (CFO).`;
      } else if (selectedActionType === 'relance_whatsapp') {
        newTitle = `Relance Personnalisée WhatsApp • ${contact.name}`;
        newContent = `Bonjour ${contact.name}, suite à l'analyse de votre dossier par notre Conseil IA, nous sommes prêts à lancer la configuration de ${contact.company}. Le plan d'action personnalisé est disponible. Souhaitez-vous un appel rapide de 5 minutes pour finaliser ?`;
      } else {
        newTitle = `Mission Structurée : Stratégie Croissance ${contact.company}`;
        newContent = `MISSION ÉNERGISÉE PAR L'IA :
- Objectif : Accélérer la conversion des prospects qualifiés pour ${contact.company}.
- Contraintes : Budget plafonné à $${contact.estimatedBudget.toLocaleString()}.
- Couches de la Mission : 1. Analyse RAG ➔ 2. Débat Conseil ➔ 3. Outreach.`;
      }

      const newAction: GeneratedAction = {
        id: `act-${Date.now()}`,
        type: selectedActionType,
        title: newTitle,
        targetContactName: contact.name,
        targetCompany: contact.company,
        assignedAgent: selectedActionType === 'relance_whatsapp' ? 'Marketing Director™' : 'Sales Director Agent™',
        content: newContent,
        metadata: {
          estimatedAmount: contact.estimatedBudget,
          recommendedChannel: selectedActionType === 'relance_whatsapp' ? 'WhatsApp' : 'E-mail Pro',
          confidenceScore: 94,
          sourceDocument: 'Smart Ingestion Center'
        },
        createdAt: 'À l\'instant',
        status: 'draft'
      };

      setActions([newAction, ...actions]);
      setIsGenerating(false);
      setCustomPrompt('');
    }, 1500);
  };

  const handleCopyContent = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTransformToMission = (action: GeneratedAction) => {
    if (onAddMissionFromAction) {
      onAddMissionFromAction(action.title, action.content);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono-code font-bold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>MOTEUR D'ACTIONS AUTOMATIQUES • CONSEIL ➔ PLAN ➔ ACTION</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Génération d'Actions & Devis par l'IA</h1>
          <p className="text-xs text-slate-400 mt-1">
            Transformez instantanément les données ingérées (fichiers & comms) en devis, relances et missions exécutables.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-code text-cyan-400 font-bold flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <span>Agents Opérationnels Actifs</span>
        </div>
      </div>

      {/* Generator Form Panel */}
      <form onSubmit={handleGenerate} className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6 border border-cyan-500/30">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Générer une Nouvelle Action Métier</span>
          </h2>

          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Génération Cognitives...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Générer par l'IA</span>
              </>
            )}
          </button>
        </div>

        {/* Mode Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setSelectedActionType('devis_proposition')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
              selectedActionType === 'devis_proposition'
                ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <FileText className="w-5 h-5 text-cyan-400" />
              {selectedActionType === 'devis_proposition' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <h4 className="text-xs font-bold">Devis & Proposition Pro</h4>
            <p className="text-[11px] text-slate-400">Calcul automatique basé sur les tarifs PDF ingérés.</p>
          </div>

          <div
            onClick={() => setSelectedActionType('relance_whatsapp')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
              selectedActionType === 'relance_whatsapp'
                ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              {selectedActionType === 'relance_whatsapp' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <h4 className="text-xs font-bold">Relance WhatsApp / Email</h4>
            <p className="text-[11px] text-slate-400">Rédigé avec le ton exact du Founder Brain.</p>
          </div>

          <div
            onClick={() => setSelectedActionType('synthese_mission')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
              selectedActionType === 'synthese_mission'
                ? 'bg-purple-500/10 border-purple-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <Target className="w-5 h-5 text-purple-400" />
              {selectedActionType === 'synthese_mission' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
            </div>
            <h4 className="text-xs font-bold">Convertir en Mission™</h4>
            <p className="text-[11px] text-slate-400">Génère une fiche de mission 6-couches exécutable.</p>
          </div>
        </div>

        {/* Target Prospect & Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Prospect / PME Cible *</label>
            <select
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company} (Budget: ${c.estimatedBudget.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Consigne Particulière (Optionnel)</label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="ex: Insister sur la garantie 30 jours et le paiement échelonné"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </form>

      {/* Generated Actions List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Historique des Actions Générées ({actions.length})</span>
          </span>
          <span className="text-xs font-mono-code text-slate-400">Prêt pour envoi ou conversion</span>
        </h3>

        {actions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/80 border border-dashed border-slate-800 text-center space-y-4 flex flex-col items-center justify-center min-h-[200px]">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>

            <div className="max-w-md space-y-1">
              <h4 className="text-sm font-bold text-white">Aucune action générée pour le moment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utilisez le générateur ci-dessus pour produire une proposition commercial sur-mesure ou une relance WhatsApp.
              </p>
            </div>

            <button
              onClick={handleLoadDemoActions}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold text-xs border border-cyan-500/30 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Charger la Démo des Actions</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {actions.map((act) => (
              <div key={act.id} className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{act.title}</h4>
                      <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {act.assignedAgent}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Source: {act.metadata.sourceDocument || 'Smart Ingestion'}</span>
                      <span>• Score Confiance: <strong className="text-purple-400 font-mono-code">{act.metadata.confidenceScore}%</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyContent(act.id, act.content)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-800"
                    >
                      {copiedId === act.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedId === act.id ? 'Copié' : 'Copier'}</span>
                    </button>

                    <button
                      onClick={() => handleTransformToMission(act)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1.5 border border-cyan-500/30"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Créer Mission™</span>
                    </button>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 font-mono-code text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {act.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
