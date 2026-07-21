import { Agent, Mission, DecisionLog, SimulationScenario, FounderBrainConfig, CompanyBrainConfig, SystemHealth } from '../types';

export const INITIAL_SYSTEM_HEALTH: SystemHealth = {
  overallHealth: 100,
  strategicScore: 100,
  contentScore: 100,
  seoScore: 100,
  conversionScore: 100,
  automationScore: 100,
  brandConsistency: 100,
};

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'ceo-agent',
    name: 'CEO Agent™',
    role: 'Directeur Exécutif Numérique',
    department: 'c_suite',
    avatar: '🎯',
    status: 'idle',
    confidence: 100,
    bio: 'Orchestre le Conseil d\'Administration IA et aligne la stratégie avec vos objectifs.',
    responsibilities: ['Arbitrage des priorités', 'Coordination du Conseil IA', 'Allocation des ressources'],
    lastQuote: 'Prêt à configurer votre entreprise et lancer votre première Mission.'
  },
  {
    id: 'chief-of-staff',
    name: 'Chief of Staff™',
    role: 'Bras Droit Organisationnel',
    department: 'c_suite',
    avatar: '📋',
    status: 'idle',
    confidence: 100,
    bio: 'Transforme les décisions stratégiques en roadmaps exécutables.',
    responsibilities: ['Suivi des jalons', 'Gestion des dépendances', 'Journaux de bord'],
    lastQuote: 'En attente de la première Mission de votre organisation.'
  },
  {
    id: 'cmo-agent',
    name: 'Marketing Director™',
    role: 'Directeur Marketing & Récits',
    department: 'marketing',
    avatar: '🚀',
    status: 'idle',
    confidence: 100,
    bio: 'Pilote les campagnes, l\'acquisition et le positionnement de marque.',
    responsibilities: ['Stratégie de contenu', 'Acquisition PME', 'Storytelling'],
    lastQuote: 'Prêt à lancer vos campagnes marketing.'
  },
  {
    id: 'cfo-agent',
    name: 'Finance Director (CFO)™',
    role: 'Directeur Financier & ROI',
    department: 'finance',
    avatar: '💎',
    status: 'idle',
    confidence: 100,
    bio: 'Garant du rendement du capital et des simulations financières.',
    responsibilities: ['Analyse CAC / LTV', 'Budget', 'Simulations ROI'],
    lastQuote: 'Prêt à analyser le ROI de vos investissements.'
  },
  {
    id: 'risk-agent',
    name: 'Risk & Governance Lead™',
    role: 'Gardien de la Conformité & Image',
    department: 'governance',
    avatar: '🛡️',
    status: 'idle',
    confidence: 100,
    bio: 'Vérifie la conformité juridique et la cohérence de marque.',
    responsibilities: ['Compliance', 'Protection de marque', 'Audit'],
    lastQuote: 'Prêt à auditer vos propositions stratégiques.'
  }
];

export const INITIAL_MISSIONS: Mission[] = [];

export const INITIAL_DECISION_LOGS: DecisionLog[] = [];

export const INITIAL_SIMULATIONS: SimulationScenario[] = [];

export const INITIAL_FOUNDER_BRAIN: FounderBrainConfig = {
  founderName: '',
  visionStatement: '',
  riskTolerance: 'Équilibré',
  coreValues: [],
  strategicStyle: '',
  nonNegotiables: []
};

export const INITIAL_COMPANY_BRAIN: CompanyBrainConfig = {
  companyName: '',
  industry: '',
  valueProposition: '',
  mainProducts: [],
  brandVoice: ''
};

export const INITIAL_CRM_CONTACTS = [];

// Reserved Presentation Dataset for Explicit Demo Mode Only
export const DEMO_DATASET = {
  founder: {
    founderName: 'Franck',
    visionStatement: 'Transformer les PME et entreprises en organisations augmentées grâce à un Conseil d\'Administration IA.',
    riskTolerance: 'Audacieux' as const,
    coreValues: [
      'Zéro UI Morte (Logic-First + Pixel-Perfect)',
      'Rigueur absolue & Fiabilité des données',
      'Simplicité d\'action centrée sur le résultat (Missions™)',
      'Écosystème souverain et interconnecté (MAATFEED & Studio)'
    ],
    strategicStyle: 'Axé sur la valeur produit réelle, le ROI démontrable et la rapidité d\'apprentissage.',
    nonNegotiables: [
      'Aucun faux bouton ou donnée de démonstration statique trompeuse',
      'Explicabilité totale des décisions IA avec indice de confiance'
    ]
  },
  company: {
    companyName: 'MAAT Studio AI',
    industry: 'AI Company Operating System / B2B Enterprise Software',
    valueProposition: 'Le premier système d\'exploitation d\'entreprise qui orchestre vos missions métiers.',
    mainProducts: [
      'MAAT Studio AI (Business OS)',
      'Moteur de Missions Cognitives™',
      'MAATFEED (Human Intelligence Layer™)'
    ],
    brandVoice: 'Visionnaire, Exécutif, Élégant et Axé sur les résultats'
  },
  health: {
    overallHealth: 84,
    strategicScore: 92,
    contentScore: 88,
    seoScore: 63,
    conversionScore: 41,
    automationScore: 95,
    brandConsistency: 72,
  },
  crmContacts: [
    {
      id: 'crm-01',
      name: 'Amadou Diallo',
      email: 'a.diallo@diallogroup.com',
      phone: '+225 07 89 12 34',
      company: 'Groupe Diallo & Co',
      industry: 'Agro-alimentaire & Distribution',
      status: 'qualifie' as const,
      estimatedBudget: 18000,
      tags: ['PME Pionnière', 'WhatsApp Leads', 'Decision Maker'],
      createdAt: '2026-07-15',
      lastContactDate: '2026-07-20',
      notes: 'Intéressé par l\'automatisation de la chaîne de distribution via WhatsApp et le Sales OS.',
      aiAnalysis: {
        qualificationScore: 94,
        buyerIntentScore: 91,
        recommendedAgent: 'Sales Director Agent™',
        nextAction: 'Envoyer la proposition de démonstration sur-mesure pour la distribution.',
        keyInsights: [
          'Décideur direct avec budget validé pour T3 2026.',
          'Besoin fort de prévisions de stocks par l\'IA.'
        ]
      }
    },
    {
      id: 'crm-02',
      name: 'Sarah Benali',
      email: 'sarah@innovtech.ma',
      phone: '+212 6 61 23 45 67',
      company: 'InnovTech Solutions',
      industry: 'Services IT & Consulting',
      status: 'proposition' as const,
      estimatedBudget: 32000,
      tags: ['High Value', 'SaaS Upgrade'],
      createdAt: '2026-07-10',
      lastContactDate: '2026-07-19',
      notes: 'Demande de contrat personnalisé pour 15 utilisateurs et connexion API MAATFEED.',
      aiAnalysis: {
        qualificationScore: 89,
        buyerIntentScore: 88,
        recommendedAgent: 'Finance Director (CFO)™',
        nextAction: 'Finaliser l\'avenant tarifaire et la simulation de ROI à 12 mois.',
        keyInsights: [
          'Le CFO Agent doit valider la remise de 10% sur l\'abonnement annuel.',
          'Rétention estimée supérieure à 24 mois.'
        ]
      }
    },
    {
      id: 'crm-03',
      name: 'Koffi Mensah',
      email: 'koffi@logisticshub.ci',
      phone: '+225 05 44 33 22',
      company: 'Logistics Hub West Africa',
      industry: 'Transport & Logistique',
      status: 'nouveau' as const,
      estimatedBudget: 12000,
      tags: ['Inbound Lead', 'Formulaire Web'],
      createdAt: '2026-07-21',
      lastContactDate: '2026-07-21',
      notes: 'Formulaire de contact soumis sur la landing page expansion.',
      aiAnalysis: {
        qualificationScore: 78,
        buyerIntentScore: 82,
        recommendedAgent: 'Marketing Director™',
        nextAction: 'Programmer un appel d\'onboarding cognitif automatisé.',
        keyInsights: [
          'Besoin urgent de réduction des coûts opérationnels.',
          'Correspond parfaitement au persona PME en croissance.'
        ]
      }
    },
    {
      id: 'crm-04',
      name: 'Elena Vance',
      email: 'e.vance@cloudcorp.com',
      phone: '+33 1 42 68 55 00',
      company: 'CloudCorp Enterprise',
      industry: 'Logiciels B2B',
      status: 'client' as const,
      estimatedBudget: 50000,
      tags: ['Compte Clé', 'Enterprise OS'],
      createdAt: '2026-06-01',
      lastContactDate: '2026-07-18',
      notes: 'Contrat signé. Utilise actuellement Founder Brain et le Moteur de Missions.',
      aiAnalysis: {
        qualificationScore: 98,
        buyerIntentScore: 95,
        recommendedAgent: 'CEO Agent™',
        nextAction: 'Organiser le point trimestriel de gouvernance IA.',
        keyInsights: [
          'Nps élevé (9/10). Candidat idéal pour témoignage vidéo et étude de cas.'
        ]
      }
    }
  ],
  missions: [
    {
      id: 'mission-demo-01',
      title: 'Lancement Filiale Afrique de l\'Ouest',
      category: 'strategy' as const,
      status: 'active' as const,
      healthScore: 89,
      target: 'Implanter la solution sur 3 marchés clés et signer 200 PME pionnières.',
      budget: 25000,
      spentBudget: 8400,
      timeline: '90 Jours',
      progress: 42,
      confidenceScore: 91,
      createdAt: '2026-07-01',
      description: 'Mission d\'expansion géographique combinant acquisition réseau et partenariats locaux.',
      activeAgents: ['ceo-agent', 'chief-of-staff', 'cmo-agent', 'cfo-agent'],
      objective: 'Établir une présence dominante sur le segment des PME avec le compte unique MAAT.',
      constraints: [
        'Budget plafonné à $25k',
        'Paiements mobiles locaux obligatoires',
        'Temps de réponse support < 5 minutes'
      ],
      resources: [
        'Product Bible V2',
        'Accès API MAATFEED Intelligence Layer™',
        'Partenariats technologiques locaux'
      ],
      planSteps: [
        { id: 's1', department: 'Stratégie', action: 'Étude d\'impact & signaux culturels MAATFEED', status: 'completed' as const, assignedAgent: 'CEO Agent™' },
        { id: 's2', department: 'Marketing', action: 'Création des kits de contenu & landing pages adaptées', status: 'in_progress' as const, assignedAgent: 'Marketing Director™' },
        { id: 's3', department: 'Finance', action: 'Intégration du système de facturation multi-devises', status: 'in_progress' as const, assignedAgent: 'Finance Director (CFO)™' },
        { id: 's4', department: 'Sales', action: 'Campagne d\'outreach ciblée sur 500 décideurs PME', status: 'pending' as const, assignedAgent: 'Chief of Staff™' }
      ],
      learnings: [
        'Le canal WhatsApp Business obtient un taux d\'ouverture de 94% dans la région.',
        'Les webinaires interactifs convertissent 2.5x mieux.'
      ]
    }
  ]
};

