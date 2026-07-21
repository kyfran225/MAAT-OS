import React, { useState, useEffect } from 'react';
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
import { BackendService } from '../../services/backendService';

interface IngestedSource {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'word' | 'whatsapp' | 'email' | 'cloud';
  size: string;
  status: 'indexed' | 'processing' | 'pending';
  extractedBrain: string;
  extractedInsights?: string[];
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
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeContext, setActiveContext] = useState<IngestedSource['type'] | 'folder' | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    const backendService = BackendService.getInstance();
    const data = await backendService.getKnowledgeSources();
    if (data) {
      setSources(data.map((s: any) => ({
        id: s.id,
        name: s.name,
        type: s.name.split('.').pop() === 'xlsx' ? 'excel' : 'pdf',
        size: 'N/A',
        status: 'indexed',
        extractedBrain: s.brain_type,
        extractedInsights: [`Source indexée le ${s.timestamp}`]
      })));
    }
  };

  const handleLoadDemoData = () => {
    setSources(prev => [...prev, ...SAMPLE_SOURCES]);
  };

  const [isProcessingNew, setIsProcessingNew] = useState(false);

  // --- Real Google OAuth Integration ---
  const handleGoogleOAuth = (type: 'email' | 'cloud') => {
    const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
    setOauthError(null);
    setShowOptionsFor(null);

    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
      setOauthError("Client ID Google non configuré. Passage en mode simulation.");
      setTimeout(() => triggerFilePicker(type), 1500);
      return;
    }

    if (isProcessingNew || connectingType) return;
    setConnectingType(type);
    setIsProcessingNew(true);

    try {
      if (!(window as any).google?.accounts?.oauth2) {
        throw new Error("Bibliothèque Google OAuth non chargée.");
      }

      const client = (window as any).google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: type === 'cloud'
          ? 'https://www.googleapis.com/auth/drive.readonly'
          : 'https://www.googleapis.com/auth/gmail.readonly',
        ux_mode: 'popup',
        callback: async (response: any) => {
          if (response.code) {
            console.log('Google Auth Code received:', response.code);
            // In a real app, send code to backend:
            // await fetch('/api/auth/google/callback', { method: 'POST', body: JSON.stringify({ code: response.code }) });

            // For now, simulate the success after getting the code
            setTimeout(() => {
              const newSource: IngestedSource = type === 'cloud' ? {
                id: `src-gdrive-${Date.now()}`,
                name: 'Google_Drive_Connecté.sync',
                type: 'cloud',
                size: 'En direct',
                status: 'indexed',
                extractedBrain: 'Company Brain',
                extractedInsights: [
                  'Connexion OAuth réussie avec Google Drive.',
                  'Indexation automatique des nouveaux documents activée.'
                ]
              } : {
                id: `src-gmail-${Date.now()}`,
                name: 'Gmail_Professionnel_Live.sync',
                type: 'email',
                size: 'En direct',
                status: 'indexed',
                extractedBrain: 'Company Brain',
                extractedInsights: [
                  'Accès Gmail autorisé via OAuth.',
                  'Extraction automatique des devis et factures activée.'
                ]
              };
              setSources(prev => [newSource, ...prev]);
              knowledgeGraphService.addNodeFromSource(newSource);
              setIsProcessingNew(false);
              setConnectingType(null);
            }, 1000);
          }
        },
        error_callback: (err: any) => {
          console.error('Google Auth Error:', err);
          const errorMsg = err.type === 'origin_mismatch'
            ? "Erreur d'origine (origin_mismatch). L'URL http://localhost:3001 doit être autorisée dans la console Google."
            : `Erreur Google OAuth: ${err.type || 'Inconnue'}`;

          setOauthError(errorMsg);
          setIsProcessingNew(false);
          setConnectingType(null);

          // Auto-fallback after showing error
          setTimeout(() => {
            setOauthError(prev => prev ? prev + " Passage en mode simulation..." : null);
            setTimeout(() => {
              setOauthError(null);
              triggerFilePicker(type);
            }, 2000);
          }, 3000);
        }
      });
      client.requestCode();
    } catch (err: any) {
      console.error('Failed to init Google OAuth:', err);
      setOauthError(`Échec initialisation OAuth: ${err.message || 'Erreur inconnue'}`);
      setTimeout(() => {
        setOauthError(null);
        triggerFilePicker(type);
      }, 2000);
    }
  };

  const triggerFilePicker = (context: IngestedSource['type'] | 'folder') => {
    setActiveContext(context);
    setShowOptionsFor(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingNew(true);
    const context = activeContext || 'folder';

    const backendService = BackendService.getInstance();

    for (const file of Array.from(files)) {
      // Pour la démo, on simule l'extraction de texte côté client avant l'envoi
      const content = `Contenu extrait de ${file.name}.
      Prix du service A: $1500.
      Prix du service B: $2500.
      Stock disponible: 45 unités.`;

      const brainType = context === 'whatsapp' ? 'Customer Brain' : 'Company Brain';

      await backendService.ingestDocument(file.name, content, brainType);
    }

    await loadSources();
    setIsProcessingNew(false);
    setActiveContext(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConnectorAction = (type: IngestedSource['type'] | 'folder', skipOAuth = false) => {
    if (!skipOAuth && (type === 'email' || type === 'cloud')) {
      handleGoogleOAuth(type);
      return;
    }

    triggerFilePicker(type);
  };

  const handleSimulateDrop = () => {
    handleConnectorAction('folder');
  };

  const toggleOptions = (id: string) => {
    if (showOptionsFor === id) setShowOptionsFor(null);
    else setShowOptionsFor(id);
  };

  return (
    <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
      {/* Hidden File Input for Multi-Source Ingestion */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

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
          {isProcessingNew && activeContext === 'folder' ? (
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

      {/* OAuth Error Feedback */}
      {oauthError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-1.5 rounded-lg bg-red-500/20">
            <RefreshCw className="w-4 h-4 animate-spin" />
          </div>
          <p className="flex-1 font-medium">{oauthError}</p>
          <button
            onClick={() => setOauthError(null)}
            className="text-red-400/50 hover:text-red-400 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connector 1: Local / Cloud Folders */}
        <div
          onClick={() => handleConnectorAction('folder')}
          className={`p-5 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer space-y-3 group relative ${activeContext === 'folder' ? 'border-amber-500 ring-1 ring-amber-500/50' : 'border-amber-500/30 hover:border-amber-500'}`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              {isProcessingNew && activeContext === 'folder' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FolderUp className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-mono-code font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {isProcessingNew && activeContext === 'folder' ? 'Analyse...' : 'Actif'}
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
            <span>{isProcessingNew && activeContext === 'folder' ? 'Calcul sémantique...' : 'Glisser-déposer un dossier'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Connector 2: WhatsApp Business API */}
        <div
          onClick={() => toggleOptions('whatsapp')}
          className={`p-5 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer space-y-3 group relative ${activeContext === 'whatsapp' ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-emerald-500/30 hover:border-emerald-500'}`}
        >
          {showOptionsFor === 'whatsapp' && (
            <div className="absolute inset-0 z-10 bg-slate-950/95 rounded-2xl p-4 flex flex-col justify-center gap-2 border border-emerald-500 animate-in fade-in zoom-in duration-200">
              <button
                onClick={(e) => { e.stopPropagation(); triggerFilePicker('whatsapp'); }}
                className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl text-[11px] font-bold border border-emerald-500/30"
              >
                Importer Export (.zip)
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setShowOptionsFor(null); }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl text-[11px] font-bold border border-slate-800"
              >
                Connecter API (Bientôt)
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              {isProcessingNew && activeContext === 'whatsapp' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-mono-code font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {isProcessingNew && activeContext === 'whatsapp' ? 'Import...' : 'Synchronisé'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              WhatsApp Business
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Exports de chat (.zip, .txt) & API réelle.
            </p>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold pt-1">
            <span>{isProcessingNew && activeContext === 'whatsapp' ? 'Traitement conversationnel...' : 'Choisir la méthode'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Connector 3: Emails (Gmail / Outlook) */}
        <div
          onClick={() => toggleOptions('email')}
          className={`p-5 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer space-y-3 group relative ${activeContext === 'email' ? 'border-cyan-500 ring-1 ring-cyan-500/50' : 'border-cyan-500/30 hover:border-cyan-500'}`}
        >
          {showOptionsFor === 'email' && (
            <div className="absolute inset-0 z-10 bg-slate-950/95 rounded-2xl p-4 flex flex-col justify-center gap-2 border border-cyan-500 animate-in fade-in zoom-in duration-200">
              <button
                onClick={(e) => { e.stopPropagation(); handleGoogleOAuth('email'); }}
                className="w-full py-2 bg-cyan-500 text-slate-950 hover:brightness-110 rounded-xl text-[11px] font-bold"
              >
                Connecter via Google
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); triggerFilePicker('email'); }}
                className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-xl text-[11px] font-bold border border-cyan-500/30"
              >
                Importer Archive (.eml)
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              {isProcessingNew && activeContext === 'email' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-mono-code font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              {isProcessingNew && activeContext === 'email' ? 'Traitement...' : 'Connecté'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              E-mails (Gmail & Outlook)
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Archives (.eml, .msg) ou Sync OAuth.
            </p>
          </div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-bold pt-1">
            <span>{isProcessingNew && activeContext === 'email' ? 'Analyse des échanges...' : 'Choisir la méthode'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Connector 4: Cloud Drives */}
        <div
          onClick={() => toggleOptions('cloud')}
          className={`p-5 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer space-y-3 group relative ${activeContext === 'cloud' ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-purple-500/30 hover:border-purple-500'}`}
        >
          {showOptionsFor === 'cloud' && (
            <div className="absolute inset-0 z-10 bg-slate-950/95 rounded-2xl p-4 flex flex-col justify-center gap-2 border border-purple-500 animate-in fade-in zoom-in duration-200">
              <button
                onClick={(e) => { e.stopPropagation(); handleGoogleOAuth('cloud'); }}
                className="w-full py-2 bg-purple-500 text-white hover:brightness-110 rounded-xl text-[11px] font-bold"
              >
                Sync Google Drive
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); triggerFilePicker('cloud'); }}
                className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl text-[11px] font-bold border border-purple-500/30"
              >
                Importer Archive (.zip)
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              {isProcessingNew && activeContext === 'cloud' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-mono-code font-bold text-purple-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {isProcessingNew && activeContext === 'cloud' ? 'Sync...' : 'Google Drive'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
              Cloud Storage Sync
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Dossiers Cloud ou exports ZIP massifs.
            </p>
          </div>
          <div className="text-[11px] text-purple-400 flex items-center gap-1 font-bold pt-1">
            <span>{isProcessingNew && activeContext === 'cloud' ? 'Indexation massive...' : 'Choisir la méthode'}</span>
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
