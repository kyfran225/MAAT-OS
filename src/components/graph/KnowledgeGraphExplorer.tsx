import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Sparkles, 
  Brain, 
  FileText, 
  Users, 
  Target, 
  Globe, 
  Database,
  ArrowRight,
  Zap,
  Layers
} from 'lucide-react';

export interface GraphNode {
  id: string;
  label: string;
  category: 'brain' | 'document' | 'contact' | 'mission' | 'signal';
  type: string;
  connections: string[];
  details: {
    description: string;
    impactScore: number;
    lastUpdated: string;
    keyAttributes: string[];
  };
}

export const SAMPLE_GRAPH_NODES: GraphNode[] = [
  {
    id: 'node-founder',
    label: 'Founder Brain™ (Franck)',
    category: 'brain',
    type: 'Digital Twin Dirigeant',
    connections: ['node-doc-charte', 'node-mission-01', 'node-company'],
    details: {
      description: 'Nœud Racine de la vision du fondateur. Définit le niveau de risque Audacieux et les règles d\'or.',
      impactScore: 98,
      lastUpdated: 'Aujourd\'hui',
      keyAttributes: ['Risque: Audacieux', 'Zéro UI Morte', 'Focus ROI']
    }
  },
  {
    id: 'node-company',
    label: 'Company Brain™ (Identité)',
    category: 'brain',
    type: 'ADN Entreprise',
    connections: ['node-doc-tarifs', 'node-doc-charte', 'node-contact-diallo'],
    details: {
      description: 'Contient l\'identité officielle, la proposition de valeur unique et les offres MAAT Studio AI.',
      impactScore: 95,
      lastUpdated: 'Hier',
      keyAttributes: ['Secteur: AI Operating System', 'Voix: Exécutif']
    }
  },
  {
    id: 'node-doc-tarifs',
    label: 'Catalogue_Produits_et_Tarifs_2026.pdf',
    category: 'document',
    type: 'Fichier PDF Ingestion',
    connections: ['node-company', 'node-contact-diallo', 'node-action-devis'],
    details: {
      description: 'Document ingéré via le Smart Ingestion Center. Grille tarifaire de 12 produits B2B.',
      impactScore: 92,
      lastUpdated: 'Il y a 2h',
      keyAttributes: ['Format: PDF', 'Taille: 2.4 MB', 'Extraits: 12 Prix']
    }
  },
  {
    id: 'node-doc-whatsapp',
    label: 'Export_WhatsApp_Business_Clients.txt',
    category: 'document',
    type: 'Flux de Communication',
    connections: ['node-customer', 'node-contact-benali', 'node-contact-mensah'],
    details: {
      description: 'Analyses de 45 discussions WhatsApp réelles avec les prospects PME.',
      impactScore: 89,
      lastUpdated: 'Hier',
      keyAttributes: ['Format: WhatsApp Text', 'Objections extraites: 3']
    }
  },
  {
    id: 'node-doc-charte',
    label: 'Charte_Marque_et_Vision_Fondateur.docx',
    category: 'document',
    type: 'Document Strategique',
    connections: ['node-founder', 'node-company'],
    details: {
      description: 'Plaquette définissant le ton de marque et le manifeste de l\'AI Business OS.',
      impactScore: 90,
      lastUpdated: 'Il y a 3j',
      keyAttributes: ['Format: DOCX', 'Extraits: Ton & Vision']
    }
  },
  {
    id: 'node-customer',
    label: 'Customer Brain™ (Clients PME)',
    category: 'brain',
    type: 'Mémoire Clientèle',
    connections: ['node-doc-whatsapp', 'node-contact-diallo', 'node-contact-benali'],
    details: {
      description: 'Agrégation des personas PME et des comportements d\'achat de la région.',
      impactScore: 94,
      lastUpdated: 'Il y a 1h',
      keyAttributes: ['Segment: PME Afrique', 'Objection majeure: Délais']
    }
  },
  {
    id: 'node-contact-diallo',
    label: 'Prospect: Amadou Diallo (Groupe Diallo)',
    category: 'contact',
    type: 'Fiche CRM PME',
    connections: ['node-doc-tarifs', 'node-customer', 'node-action-devis'],
    details: {
      description: 'Décideur PME Agro-alimentaire & Distribution. Budget estimé : $18,000.',
      impactScore: 94,
      lastUpdated: 'Hier',
      keyAttributes: ['Budget: $18,000', 'Statut: Qualifié IA']
    }
  },
  {
    id: 'node-contact-benali',
    label: 'Prospect: Sarah Benali (InnovTech)',
    category: 'contact',
    type: 'Fiche CRM PME',
    connections: ['node-doc-whatsapp', 'node-customer'],
    details: {
      description: 'PME IT & Consulting. Contrat de $32,000 en cours de validation par le CFO Agent.',
      impactScore: 88,
      lastUpdated: 'Aujourd\'hui',
      keyAttributes: ['Budget: $32,000', 'Statut: Proposition']
    }
  },
  {
    id: 'node-contact-mensah',
    label: 'Prospect: Koffi Mensah (Logistics Hub)',
    category: 'contact',
    type: 'Fiche CRM PME',
    connections: ['node-doc-whatsapp'],
    details: {
      description: 'PME Transport & Logistique. Formulaire soumis et qualifié par l\'IA à 78%.',
      impactScore: 78,
      lastUpdated: 'À l\'instant',
      keyAttributes: ['Budget: $12,000', 'Statut: Nouveau']
    }
  },
  {
    id: 'node-action-devis',
    label: 'Action IA: Proposition Sur-Mesure Diallo',
    category: 'mission',
    type: 'Action IA Générée',
    connections: ['node-contact-diallo', 'node-doc-tarifs', 'node-mission-01'],
    details: {
      description: 'Proposition commerciale générée à partir des tarifs PDF pour le Groupe Diallo.',
      impactScore: 96,
      lastUpdated: 'À l\'instant',
      keyAttributes: ['Généré par: Sales Agent', 'Montant: $18,000']
    }
  },
  {
    id: 'node-mission-01',
    label: 'Mission™: Lancement Afrique de l\'Ouest',
    category: 'mission',
    type: 'Mission Stratégique 6-Couches',
    connections: ['node-founder', 'node-action-devis', 'node-signal-384'],
    details: {
      description: 'Mission active d\'implantation sur 3 marchés clés avec 200 PME pionnières.',
      impactScore: 91,
      lastUpdated: 'Il y a 2h',
      keyAttributes: ['Budget: $25,000', 'Progression: 42%']
    }
  },
  {
    id: 'node-signal-384',
    label: 'Signal MAATFEED #384 (Mobile Money)',
    category: 'signal',
    type: 'Signal Culturel MAATFEED',
    connections: ['node-mission-01'],
    details: {
      description: 'Forte hausse d\'intérêt (+140%) pour les paiements locaux Mobile Money.',
      impactScore: 95,
      lastUpdated: 'Aujourd\'hui',
      keyAttributes: ['Croissance: +140%', 'Sentiment: Positif']
    }
  }
];

export const KnowledgeGraphExplorer: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const handleLoadDemoGraph = () => {
    setNodes(SAMPLE_GRAPH_NODES);
    setSelectedNode(SAMPLE_GRAPH_NODES[0]);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [graphRagQuery, setGraphRagQuery] = useState('');
  const [ragResult, setRagResult] = useState<string | null>(null);
  const [isSearchingRag, setIsSearchingRag] = useState(false);

  const filteredNodes = nodes.filter((n) => {
    const matchesSearch = n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || n.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGraphRagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!graphRagQuery) return;

    setIsSearchingRag(true);
    setTimeout(() => {
      setRagResult(`RÉPONSE DÉDUITE PAR GRAPHRAG (Score Confiance: 96%) :

D'après le graphe des connaissances interconnectées :
• Le document 'Catalogue_Produits_et_Tarifs_2026.pdf' (12 Prix) est relié à la fiche CRM d'Amadou Diallo (Groupe Diallo & Co, Budget $18,000).
• L'action IA générée 'Proposition Sur-Mesure' relie ce tarif au jalon 1 de la Mission 'Lancement Afrique de l'Ouest'.
• L'objection extraite de l'export WhatsApp montre que le canal mobile money (Signal MAATFEED #384) réduira les frictions de paiement.`);
      setIsSearchingRag(false);
    }, 1200);
  };

  const getCategoryBadgeColor = (cat: GraphNode['category']) => {
    switch (cat) {
      case 'brain': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'document': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'contact': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'mission': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'signal': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono-code font-bold mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>ENTERPRISE KNOWLEDGE GRAPH™ & GRAPHRAG EXPLORER</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Cartographie Interactive des Connaissances PME</h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualisez les relations logiques en direct entre vos documents, prospects CRM, missions et cerveaux d'entreprise.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-code text-emerald-400 font-bold flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>{nodes.length} Nœuds Connectés • GraphDB</span>
          </div>

          {nodes.length === 0 && (
            <button
              onClick={handleLoadDemoGraph}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Charger la Démo GraphRAG</span>
            </button>
          )}
        </div>
      </div>

      {/* GraphRAG Natural Language Query Engine */}
      <form onSubmit={handleGraphRagSearch} className="glass-panel p-6 rounded-3xl space-y-4 border border-amber-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono-code">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interroger le Knowledge Graph via GraphRAG</span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono-code">Déduction multi-nœuds & RAG Graphe</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={graphRagQuery}
              onChange={(e) => setGraphRagQuery(e.target.value)}
              placeholder="Posez une question transversale (ex: 'Quel lien entre le devis PDF et Amadou Diallo ?')"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSearchingRag}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 shrink-0 shadow-lg disabled:opacity-50"
          >
            {isSearchingRag ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Interrogation du Graphe...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Recherche GraphRAG</span>
              </>
            )}
          </button>
        </div>

        {ragResult && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs font-mono-code text-slate-200 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-300">
            {ragResult}
          </div>
        )}
      </form>

      {/* Main Interactive Graph Canvas & Inspector Grid */}
      {nodes.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center space-y-4 flex flex-col items-center justify-center min-h-[350px] border border-dashed border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400">
            <Network className="w-8 h-8 text-amber-400" />
          </div>

          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold text-white">Enterprise Knowledge Graph en Attente de Données</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              La toile de connaissances de votre entreprise se tissera automatiquement dès que vous ingérerez vos premiers documents ou ajouterez vos prospects dans le Sales OS.
            </p>
          </div>

          <button
            onClick={handleLoadDemoGraph}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:brightness-110 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Charger les 12 Nœuds d'Exemple pour Démo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Canvas / Node Matrix (Left 2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-5">
            {/* Controls & Category Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'Tous les Nœuds' },
                  { id: 'brain', label: 'Cerveaux' },
                  { id: 'document', label: 'Documents Ingestion' },
                  { id: 'contact', label: 'Prospects CRM' },
                  { id: 'mission', label: 'Missions & Actions' },
                  { id: 'signal', label: 'Signaux Culturels' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      activeCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrer un nœud..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Visual Interactive Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[420px] overflow-y-auto max-h-[550px] pr-1">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const badgeStyle = getCategoryBadgeColor(node.category);

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {node.category === 'brain' && <Brain className="w-4 h-4 text-amber-400 shrink-0" />}
                        {node.category === 'document' && <FileText className="w-4 h-4 text-blue-400 shrink-0" />}
                        {node.category === 'contact' && <Users className="w-4 h-4 text-cyan-400 shrink-0" />}
                        {node.category === 'mission' && <Target className="w-4 h-4 text-purple-400 shrink-0" />}
                        {node.category === 'signal' && <Globe className="w-4 h-4 text-emerald-400 shrink-0" />}

                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                          {node.label}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold border ${badgeStyle}`}>
                        {node.type}
                      </span>

                      <span className="text-slate-400 font-mono-code text-[10px]">
                        {node.connections.length} Connexion{node.connections.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Inspector Panel (Right Col) */}
          {selectedNode && (
            <div className="glass-panel p-6 rounded-3xl space-y-5 border border-amber-500/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono-code font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Inspecteur de Nœud</span>
                  </span>

                  <span className="text-[10px] font-mono-code text-slate-400">ID: {selectedNode.id}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{selectedNode.label}</h3>
                  <span className={`inline-block text-[10px] font-mono-code font-bold px-2.5 py-0.5 rounded-full mt-1 border ${getCategoryBadgeColor(selectedNode.category)}`}>
                    {selectedNode.type}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-900">
                  {selectedNode.details.description}
                </p>

                {/* Key Attributes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attributs Extraits</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.details.keyAttributes.map((attr, idx) => (
                      <span key={idx} className="text-[11px] font-mono-code px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-medium">
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connected Nodes List */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connexions Graphe ({selectedNode.connections.length})</h4>
                  <div className="space-y-1.5">
                    {selectedNode.connections.map((connId) => {
                      const connNode = nodes.find(n => n.id === connId);
                      return (
                        <div 
                          key={connId}
                          onClick={() => connNode && setSelectedNode(connNode)}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between text-xs text-slate-300 group"
                        >
                          <span className="group-hover:text-amber-400 font-medium truncate">{connNode?.label || connId}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono-code flex items-center justify-between">
                <span>Score d'Impact Système :</span>
                <strong className="text-amber-400 font-bold">{selectedNode.details.impactScore}%</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
