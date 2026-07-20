import { Agent, Mission, DecisionLog, SimulationScenario, FounderBrainConfig, CompanyBrainConfig, SystemHealth } from '../types';

export const INITIAL_SYSTEM_HEALTH: SystemHealth = {
  overallHealth: 84,
  strategicScore: 92,
  contentScore: 88,
  seoScore: 63,
  conversionScore: 41,
  automationScore: 95,
  brandConsistency: 72,
};

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'ceo-agent',
    name: 'CEO Agent™',
    role: 'Directeur Exécutif Numérique',
    department: 'c_suite',
    avatar: '🎯',
    status: 'analyzing',
    confidence: 96,
    bio: 'Synthétise la vision du fondateur et oriente le Conseil d\'Administration IA vers les priorités à haut ROI.',
    responsibilities: ['Arbitrage des priorités', 'Coordination du Conseil IA', 'Allocation des ressources'],
    currentMission: 'Lancement Filiale Afrique de l\'Ouest',
    lastQuote: 'Priorité de la semaine : Améliorer le taux de conversion du segment PME avant d\'accélérer les dépenses publicitaires.'
  },
  {
    id: 'chief-of-staff',
    name: 'Chief of Staff™',
    role: 'Bras Droit Organisationnel',
    department: 'c_suite',
    avatar: '📋',
    status: 'active',
    confidence: 94,
    bio: 'Transforme les décisions stratégiques en roadmaps exécutables et surveille la livraison des Missions.',
    responsibilities: ['Suivi des jalons', 'Gestion des dépendances inter-agents', 'Journaux de bord'],
    currentMission: 'Lancement Filiale Afrique de l\'Ouest',
    lastQuote: 'Les 6 couches de la Mission 01 sont opérationnelles. Prochaine étape : validation financière du budget Meta.'
  },
  {
    id: 'cmo-agent',
    name: 'Marketing Director™',
    role: 'Directeur Marketing & Récits',
    department: 'marketing',
    avatar: '🚀',
    status: 'debating',
    confidence: 91,
    bio: 'Pilote les campagnes, l\'acquisition, le positionnement de marque et l\'alignement avec MAATFEED.',
    responsibilities: ['Stratégie de contenu', 'Distribution multi-canaux', 'Hooks & Storytelling'],
    currentMission: 'Campagne Acquisition Fin d\'Année',
    lastQuote: 'Le signal culturel extrait de MAATFEED montre une forte hausse d\'intérêt pour les outils d\'automatisation éthiques.'
  },
  {
    id: 'cfo-agent',
    name: 'Finance Director (CFO)™',
    role: 'Directeur Financier & ROI',
    department: 'finance',
    avatar: '💎',
    status: 'active',
    confidence: 95,
    bio: 'Garant du rendement du capital, de la rentabilité unitaire et de la simulation des risques financiers.',
    responsibilities: ['CAC / LTV Analysis', 'Forecast budgétaire', 'Mode Simulation ROI'],
    currentMission: 'Optimisation Tunnel de Conversion',
    lastQuote: 'Attention au coût d\'acquisition sur Instagram (+14%). Je recommande une réallocation de 20% vers le canal éducatif.'
  },
  {
    id: 'creative-agent',
    name: 'Creative Director™',
    role: 'Directeur de Création',
    department: 'marketing',
    avatar: '🎨',
    status: 'active',
    confidence: 89,
    bio: 'Conçoit les concepts visuels, les scripts vidéos, l\'identité visuelle et la ligne éditoriale.',
    responsibilities: ['Directives visuelles', 'Concepts créatifs', 'Storyboarding vidéo'],
    currentMission: 'Campagne Acquisition Fin d\'Année',
    lastQuote: '3 nouveaux formats vidéo courts testés. Le format "Démonstration Sans Filtre" obtient 3.8x plus d\'engagements.'
  },
  {
    id: 'risk-agent',
    name: 'Risk & Governance Lead™',
    role: 'Gardien de la Conformité & Image',
    department: 'governance',
    avatar: '🛡️',
    status: 'idle',
    confidence: 98,
    bio: 'Vérifie la propriété intellectuelle, le respect des normes juridiques et la cohérence de marque.',
    responsibilities: ['Compliance juridique', 'Protection de la marque', 'Audit des allégations'],
    lastQuote: 'Toutes les allégations de la campagne actuelle sont conformes aux règles de transparence.'
  },
  {
    id: 'sales-agent',
    name: 'Chief Sales Agent™',
    role: 'Directeur des Ventes (Sales OS)',
    department: 'sales',
    avatar: '💼',
    status: 'active',
    confidence: 93,
    bio: 'Supervise la prospection, la qualification des leads PME et l\'optimisation du pipeline commercial.',
    responsibilities: ['Scoring des Leads', 'Outreach automatique', 'Pipeline Conversion'],
    currentMission: 'Lancement Filiale Afrique de l\'Ouest',
    lastQuote: '42 nouveaux comptes PME qualifiés cette semaine. Le taux d\'acceptation des appels de démo s\'élève à 64%.'
  },
  {
    id: 'hr-agent',
    name: 'People & HR Agent™',
    role: 'Directeur des Ressources Humaines (HR OS)',
    department: 'hr',
    avatar: '👥',
    status: 'idle',
    confidence: 96,
    bio: 'Gère le recrutement des talents clés, l\'onboarding et l\'alignement avec la culture d\'entreprise.',
    responsibilities: ['Recrutement Augmenté', 'Onboarding Talents', 'Culture & Valeurs'],
    lastQuote: 'Fiche de poste générée pour le profil Growth & Community Lead local à Abidjan.'
  },
  {
    id: 'product-agent',
    name: 'Chief Product Agent™',
    role: 'Directeur Produit (Product OS)',
    department: 'product',
    avatar: '⚡',
    status: 'analyzing',
    confidence: 94,
    bio: 'Transforme les retours d\'expérience des utilisateurs et les signaux MAATFEED en fonctionnalités de la roadmap.',
    responsibilities: ['Roadmap Produit', 'Feedback Intelligence', 'User Research'],
    lastQuote: 'Priorisation de la fonctionnalité "Export PDF des Rapports de Simulation ROI" pour le sprint actuel.'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission-01',
    title: 'Lancement Filiale Afrique de l\'Ouest',
    category: 'strategy',
    status: 'active',
    healthScore: 89,
    target: 'Implanter la solution sur 3 marchés clés (Côte d\'Ivoire, Sénégal, Cameroun) et signer 200 PME pionnières.',
    budget: 25000,
    spentBudget: 8400,
    timeline: '90 Jours',
    progress: 42,
    confidenceScore: 91,
    createdAt: '2026-07-01',
    description: 'Mission globale d\'expansion géographique combinant acquisition réseau, événements hybrides et partenariats locaux.',
    activeAgents: ['ceo-agent', 'chief-of-staff', 'cmo-agent', 'cfo-agent'],
    objective: 'Établir une présence dominante sur le segment des PME africaines avec le compte unique MAAT.',
    constraints: [
      'Budget plafonné à $25k',
      'Paiements mobiles locaux (Mobile Money, Wave) obligatoires',
      'Temps de réponse support < 5 minutes'
    ],
    resources: [
      'Product Bible V2',
      'Accès API MAATFEED Intelligence Layer',
      'Partenariats technologiques locaux'
    ],
    planSteps: [
      { id: 's1', department: 'Stratégie', action: 'Étude d\'impact & signaux culturels MAATFEED', status: 'completed', assignedAgent: 'CEO Agent™' },
      { id: 's2', department: 'Marketing', action: 'Création des kits de contenu & landing pages adaptées', status: 'in_progress', assignedAgent: 'Marketing Director™' },
      { id: 's3', department: 'Finance', action: 'Intégration du système de facturation multi-devises (XOF/XAF)', status: 'in_progress', assignedAgent: 'Finance Director (CFO)™' },
      { id: 's4', department: 'Sales', action: 'Campagne d\'outreach ciblée sur 500 décideurs PME', status: 'pending', assignedAgent: 'Chief of Staff™' }
    ],
    learnings: [
      'Le canal WhatsApp Business obtient un taux d\'ouverture de 94% dans la région.',
      'Les webinaires interactifs en direct convertissent 2.5x mieux que les démos enregistrées.'
    ]
  },
  {
    id: 'mission-02',
    title: 'Optimisation Tunnel de Conversion & Rétention PME',
    category: 'marketing',
    status: 'active',
    healthScore: 68,
    target: 'Faire passer le taux de conversion global de 2.1% à 4.5% et réduire le churn initial.',
    budget: 12000,
    spentBudget: 5100,
    timeline: '45 Jours',
    progress: 60,
    confidenceScore: 84,
    createdAt: '2026-07-10',
    description: 'Restructuration complète du parcours d\'onboarding et suppression des frictions d\'activation.',
    activeAgents: ['cmo-agent', 'creative-agent', 'cfo-agent'],
    objective: 'Éliminer l\'abandon lors du premier accès et guider le dirigeant vers sa première Mission™ en < 3 minutes.',
    constraints: [
      'Zéro friction formulaire',
      'Guide pas-à-pas interactif obligatoire'
    ],
    resources: [
      'Données de sessions Customer Brain',
      'Scripts d\'onboarding Founder Brain'
    ],
    planSteps: [
      { id: 's21', department: 'Produit', action: 'Audit de la goutte de conversion sur l\'onboarding', status: 'completed', assignedAgent: 'Marketing Director™' },
      { id: 's22', department: 'Création', action: 'Refonte des visuels de preuve sociale et témoignages', status: 'in_progress', assignedAgent: 'Creative Director™' },
      { id: 's23', department: 'Finance', action: 'Mise en place de la garantie satisfait ou remboursé 30j', status: 'pending', assignedAgent: 'Finance Director (CFO)™' }
    ],
    learnings: [
      'L\'ajout d\'une simulation ROI immédiate augmente la rétention Jour 1 de +38%.'
    ]
  }
];

export const INITIAL_DECISION_LOGS: DecisionLog[] = [
  {
    id: 'dec-101',
    timestamp: '11:42 UTC',
    title: 'Réallocation de 20% du budget publicitaire vers les canaux éducatifs',
    agentId: 'cfo-agent',
    agentName: 'Finance Director (CFO)™',
    category: 'Finance & ROI',
    confidenceScore: 92,
    reasoning: 'L\'analyse comparative sur les 3 dernières semaines démontre que les contenus éducatifs apportent des leads qualifiés avec un coût d\'acquisition inférieur de 41% par rapport aux publicités directes.',
    status: 'approved',
    impacts: ['Économie estimée : $3,400', 'Hausse estimée de la qualité des leads : +28%']
  },
  {
    id: 'dec-102',
    timestamp: '09:15 UTC',
    title: 'Validation de la ligne éditoriale "L\'Entreprise Augmentée"',
    agentId: 'cmo-agent',
    agentName: 'Marketing Director™',
    category: 'Branding',
    confidenceScore: 95,
    reasoning: 'Alignement parfait avec le Founder Brain™. Rejet des termes génériques "AI Tool" au profit de "AI Company OS™".',
    status: 'completed',
    impacts: ['Cohérence de marque renforcée', 'Différenciation nette face à la concurrence']
  },
  {
    id: 'dec-103',
    timestamp: 'Hier',
    title: 'Intégration du signal d\'intelligence collective MAATFEED #384',
    agentId: 'ceo-agent',
    agentName: 'CEO Agent™',
    category: 'Stratégie',
    confidenceScore: 88,
    reasoning: 'Détection d\'une hausse de 140% des conversations autour de l\'onboarding automatique des équipes.',
    status: 'executing',
    impacts: ['Création de la Mission 02 d\'optimisation']
  }
];

export const INITIAL_SIMULATIONS: SimulationScenario[] = [
  {
    id: 'sim-01',
    title: 'Augmentation du budget marketing de 50% sur l\'Afrique de l\'Ouest',
    description: 'Simulation de l\'impact d\'un doublement des investissements en publicité ciblée et évènements physiques à Abidjan & Dakar.',
    variable: 'Budget Marketing (+50%)',
    changeValue: '+$12,500',
    estimatedROI: 3.4,
    riskLevel: 'Faible',
    confidenceScore: 89,
    recommendation: 'Recommandé avec réserve : Activer progressivement sur 30 jours au lieu d\'un versement unique.',
    projections: {
      revenueIncrease: '+$42,500 / trimestre',
      customerAcquisition: '+140 PME clientes',
      timeline: '2.5 Mois pour ROI positif'
    }
  },
  {
    id: 'sim-02',
    title: 'Lancement d\'une offre "Studio Freemium" pour créateurs',
    description: 'Accès limité au Moteur de Missions pour les créateurs de contenu indépendants afin de créer un canal d\'acquisition virale vers MAATFEED.',
    variable: 'Freemium Tier (0$)',
    changeValue: 'Nouveaux inscrits',
    estimatedROI: 2.1,
    riskLevel: 'Modéré',
    confidenceScore: 78,
    recommendation: 'À tester en cohortes réduites de 100 utilisateurs.',
    projections: {
      revenueIncrease: '+$18,000 / an (Conversion Upsell)',
      customerAcquisition: '+1,200 Créateurs inscrits',
      timeline: '4 Mois'
    }
  }
];

export const INITIAL_FOUNDER_BRAIN: FounderBrainConfig = {
  founderName: 'Franck',
  visionStatement: 'Transformer les PME et entreprises en organisations augmentées capables de rivaliser avec des multinationales grâce à une intelligence d\'entreprise vivante et un Conseil d\'Administration IA.',
  riskTolerance: 'Audacieux',
  coreValues: [
    'Zéro UI Morte (Logic-First + Pixel-Perfect)',
    'Rigueur absolue & Fiabilité des données',
    'Simplicité d\'action centrée sur le résultat (Missions™)',
    'Écosystème souverain et interconnecté (MAATFEED & Studio)'
  ],
  strategicStyle: 'Axé sur la valeur produit réelle, le ROI démontrable et la rapidité d\'apprentissage de l\'organisation.',
  nonNegotiables: [
    'Aucun faux bouton ou donnée de démonstration statique trompeuse',
    'Explicabilité totale des décisions IA avec indice de confiance'
  ]
};

export const INITIAL_COMPANY_BRAIN: CompanyBrainConfig = {
  companyName: 'MAAT Studio AI',
  industry: 'AI Company Operating System / B2B Enterprise Software',
  valueProposition: 'Le premier système d\'exploitation d\'entreprise qui orchestre vos missions métiers grâce à un Conseil d\'Administration IA et un Multi-Brain System.',
  mainProducts: [
    'MAAT Studio AI (Business OS)',
    'Moteur de Missions Cognitives™',
    'MAATFEED (Human Intelligence Layer™)'
  ],
  brandVoice: 'Visionnaire, Rigolet, Exécutif, Élégant et Axé sur les résultats'
};
