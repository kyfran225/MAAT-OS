import React, { useState } from 'react';
import { 
  FolderUp, 
  FileText, 
  FileSpreadsheet, 
  MessageSquare, 
  Mail, 
  Cloud, 
  Sparkles, 
  CheckCircle2, 
  Bot, 
  Database, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface IngestedSource {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'word' | 'whatsapp' | 'email' | 'cloud';
  size: string;
  status: 'indexed' | 'processing' | 'pending';
  extractedBrain: 'Company Brain' | 'Customer Brain' | 'Founder Brain' | 'Finance OS';
  extractedInsights: string[];
}

export const SAMPLE_SOURCES: IngestedSource[] = [
  {
    id: 'src-1',
    name: 'Catalogue_Produits_et_Tarifs_2026.pdf',
    type: 'pdf',
    size: '2.4 MB',
    status: 'indexed',
    extractedBrain: 'Company Brain',
    extractedInsights: [
      'Grille tarifaire de 12 produits et services extraite.',
      'Conditions d\'abonnement et remises sur volume identifiées.'
    ]
  },
  {
    id: 'src-2',
    name: 'Export_WhatsApp_Business_Clients.txt',
    type: 'whatsapp',
    size: '850 KB',
    status: 'indexed',
    extractedBrain: 'Customer Brain',
    extractedInsights: [
      '3 objections de vente majeures identifiées (prix & délais).',
      'Canal WhatsApp préféré par 84% des prospects PME.'
    ]
  },
  {
    id: 'src-3',
    name: 'Charte_Marque_et_Vision_Fondateur.docx',
    type: 'word',
    size: '1.1 MB',
    status: 'indexed',
    extractedBrain: 'Founder Brain',
    extractedInsights: [
      'Ton de marque défini comme "Visionnaire, Exécutif et Direct".',
      '3 règles d\'or stratégiques enregistrées.'
    ]
  },
  {
    id: 'src-4',
    name: 'Bilan_Comptable_et_Budget_2025.xlsx',
    type: 'excel',
    size: '3.8 MB',
    status: 'indexed',
    extractedBrain: 'Finance OS',
    extractedInsights: [
      'Seuil de rentabilité mensuel calculé à $14,500.',
      'Marge brute moyenne de 68% sur les prestations B2B.'
    ]
  }
];

export const SmartIngestionCenter: React.FC = () => {
  const [sources, setSources] = useState<IngestedSource[]>([]);
  const [connectingType, setConnectingType] = useState<string | null>(null);

  const handleLoadDemoData = () => {
    setSources(SAMPLE_SOURCES);
  };

  const [isProcessingNew, setIsProcessingNew] = useState(false);

  const handleConnectorAction = (type: IngestedSource['type'] | 'folder') => {
    if (isProcessingNew || connectingType) return;

    setConnectingType(type);
    setIsProcessingNew(true);

    setTimeout(() => {
      let newSource: IngestedSource;

      switch(type) {
        case 'whatsapp':
          newSource = {
            id: `src-wa-${Date.now()}`,
            name: 'Flux_WhatsApp_Business_Live.stream',
            type: 'whatsapp',
            size: 'En continu',
            status: 'indexed',
            extractedBrain: 'Customer Brain',
            extractedInsights: [
              'Analyse en temps réel de 45 conversations actives.',
              'Sentiment client global : Très Positif (8.4/10).'
            ]
          };
          break;
        case 'email':
          newSource = {
            id: `src-mail-${Date.now()}`,
            name: 'Archive_Outlook_Négociations_Ventes.eml',
            type: 'email',
            size: '12.4 MB',
            status: 'indexed',
            extractedBrain: 'Company Brain',
            extractedInsights: [
              'Extraction de 12 cycles de vente en cours.',
              'Détection automatique des dates d\'échéance des contrats.'
            ]
          };
          break;
        case 'cloud':
          newSource = {
            id: `src-cloud-${Date.now()}`,
            name: 'Google_Drive_Synchronisation_PME.sync',
            type: 'cloud',
            size: '450 MB',
            status: 'indexed',
            extractedBrain: 'Knowledge Graph',
            extractedInsights: [
              'Indexation de 1,200 documents via le Knowledge Graph.',
              'Cartographie sémantique du département Opérations terminée.'
            ]
          };
          // Cast to any because the interface expects specific brains, but Knowledge Graph fits the context
          (newSource as any).extractedBrain = 'Company Brain';
          break;
        default:
          newSource = {
            id: `src-zip-${Date.now()}`,
            name: 'Dossier_Nouveaux_Devis_et_Contrats.zip',
            type: 'cloud',
            size: '5.2 MB',
            status: 'indexed',
            extractedBrain: 'Company Brain',
            extractedInsights: [
              '8 nouveaux modèles de devis analysés et indexés.',
              'Clauses de garantie 30 jours enregistrées par le Cerveau.'
            ]
          };
      }

      setSources(prev => [newSource, ...prev]);
      setIsProcessingNew(false);
      setConnectingType(null);
    }, 1500);
  };

  return (
    <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono-code font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SMART INGESTION CENTER™ • ZERO SAISIE MANUELLE</span>
          </div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            Collecte Intelligente Multi-Source PME
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Indiquez vos dossiers de documents ou vos canaux de communication : l'IA moissonne, structure et nourrit vos Cerveaux automatiquement.
          </p>
        </div>

        <button
          onClick={() => handleConnectorAction('folder')}
          disabled={isProcessingNew}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {isProcessingNew && connectingType === 'folder' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyse RAG en cours...</span>
            </>
          ) : (
            <>
              <FolderUp className="w-4 h-4" />
              <span>Analyser un Dossier / Fichier</span>
            </>
          )}
        </button>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connector 1: Local / Cloud Folders */}
        <div 
          onClick={() => handleConnectorAction('folder')}
          className={`p-5 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer space-y-3 group ${connectingType === 'folder' ? 'border-amber-500 ring-1 ring-amber-500/50' : 'border-amber-500/30 hover:border-amber-500'}`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              {connectingType === 'folder' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FolderUp className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-mono-code font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {connectingType === 'folder' ? 'Analyse...' : 'Actif'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
              Dossiers & Fichiers
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              PDF, Word (.docx), Excel (.xlsx), TXT, PPTX.
            </p>
          </div>
          <div className="text-[11px] text-amber-400 flex items-center gap-1 font-bold pt-1">
            <span>{connectingType === 'folder' ? 'Calcul sémantique...' : 'Glisser-déposer un dossier'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Connector 2: WhatsApp Business API */}
        <div 
          onClick={() => handleConnectorAction('whatsapp')}
          className={`p-5 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer space-y-3 group ${connectingType === 'whatsapp' ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-emerald-500/30 hover:border-emerald-500'}`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              {connectingType === 'whatsapp' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-mono-code font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {connectingType === 'whatsapp' ? 'OAuth...' : 'Synchronisé'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              WhatsApp Business
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Conversations, vocaux & requêtes clients réelles.
            </p>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold pt-1">
            <span>{connectingType === 'whatsapp' ? 'Authentification Meta...' : 'Customer Brain alimenté'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Connector 3: Emails (Gmail / Outlook) */}
        <div 
          onClick={() => handleConnectorAction('email')}
          className={`p-5 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer space-y-3 group ${connectingType === 'email' ? 'border-cyan-500 ring-1 ring-cyan-500/50' : 'border-cyan-500/30 hover:border-cyan-500'}`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              {connectingType === 'email' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-mono-code font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              {connectingType === 'email' ? 'OAuth...' : 'Connecté'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              E-mails (Gmail & Outlook)
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Négociations, devis envoyés & échanges clé.
            </p>
          </div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-bold pt-1">
            <span>{connectingType === 'email' ? 'Synchronisation IMAP...' : 'Extraction du ton & prix'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Connector 4: Cloud Drives */}
        <div 
          onClick={() => handleConnectorAction('cloud')}
          className={`p-5 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer space-y-3 group ${connectingType === 'cloud' ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-purple-500/30 hover:border-purple-500'}`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              {connectingType === 'cloud' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-mono-code font-bold text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
              {connectingType === 'cloud' ? 'OAuth...' : 'Google Drive / OneDrive'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
              Cloud Storage Sync
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Indexation continue des sous-dossiers PME.
            </p>
          </div>
          <div className="text-[11px] text-purple-400 flex items-center gap-1 font-bold pt-1">
            <span>{connectingType === 'cloud' ? 'Exploration Drive...' : 'Knowledge Graph vivant'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>


      {/* Ingestion & RAG Results List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Sources Indexées & Connaissances Extraites par l'IA</span>
          </h3>
          <span className="text-xs font-mono-code text-slate-400 font-bold">
            {sources.length} Sources actives • Auto-ventilation activée
          </span>
        </div>

        {sources.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/80 border border-dashed border-slate-800 text-center space-y-4 flex flex-col items-center justify-center min-h-[220px]">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400">
              <Database className="w-6 h-6 text-amber-400" />
            </div>

            <div className="max-w-md space-y-1">
              <h4 className="text-sm font-bold text-white">Aucune source de données ajoutée pour le moment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Votre Multi-Brain est prêt à ingérer vos connaissances PME. Glissez vos fichiers (PDF, Excel, Word, TXT) ou connectez un canal ci-dessus.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSimulateDrop}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-2 shadow-md"
              >
                <FolderUp className="w-3.5 h-3.5" />
                <span>Déposer un premier fichier</span>
              </button>

              <button
                onClick={handleLoadDemoData}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs border border-amber-500/30 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Charger les exemples de Démo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((src) => (
              <div key={src.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {src.type === 'pdf' && <FileText className="w-5 h-5 text-red-400 shrink-0" />}
                    {src.type === 'excel' && <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {src.type === 'word' && <FileText className="w-5 h-5 text-blue-400 shrink-0" />}
                    {src.type === 'whatsapp' && <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {src.type === 'cloud' && <Cloud className="w-5 h-5 text-purple-400 shrink-0" />}

                    <div>
                      <h4 className="text-xs font-bold text-white">{src.name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono-code">{src.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-code font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Alimente : {src.extractedBrain}
                    </span>
                    <span className="text-[10px] font-mono-code font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 flex items-center gap-1 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Indexé</span>
                    </span>
                  </div>
                </div>

                {/* Insights extracted automatically */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>Enseignements extraits par l'IA :</span>
                  </div>
                  {src.extractedInsights.map((insight, idx) => (
                    <div key={idx} className="text-[11px] text-slate-400 flex items-center gap-2 pl-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
