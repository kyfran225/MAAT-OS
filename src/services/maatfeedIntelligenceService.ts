export interface CulturalSignal {
  id: string;
  topic: string;
  category: string;
  volumeGrowth: string;
  sentiment: string;
  relevanceScore: number;
  samplePostSnippet: string;
  recommendedMissionAction: string;
  timestamp: string;
}

export class MAATFEEDIntelligenceService {
  private static instance: MAATFEEDIntelligenceService;

  private constructor() {}

  public static getInstance(): MAATFEEDIntelligenceService {
    if (!MAATFEEDIntelligenceService.instance) {
      MAATFEEDIntelligenceService.instance = new MAATFEEDIntelligenceService();
    }
    return MAATFEEDIntelligenceService.instance;
  }

  public getLiveCulturalSignals(): CulturalSignal[] {
    return [
      {
        id: 'sig-384',
        topic: 'Automatisation Éthique & Onboarding Rapide PME',
        category: 'Tech & Entreprise',
        volumeGrowth: '+140%',
        sentiment: 'Fortement Enjoué',
        relevanceScore: 96,
        samplePostSnippet: '"Marre des logiciels qui demandent 3 jours d\'apprentissage. On veut un outil qui comprend direct nos objectifs !"',
        recommendedMissionAction: 'Lancer une mission d\'optimisation de l\'expérience et du parcours utilisateur.',
        timestamp: 'Il y a 12 min'
      },
      {
        id: 'sig-385',
        topic: 'Intégration des Paiements Locaux & Mobile Money',
        category: 'Finance & Commerce',
        volumeGrowth: '+88%',
        sentiment: 'Incontournable',
        relevanceScore: 93,
        samplePostSnippet: '"Si une app pro ne prend pas Wave ou Mobile Money à Abidjan ou Dakar, les PME abandonnent à la caisse."',
        recommendedMissionAction: 'Intégrer les passerelles de paiement locales (Wave, Mobile Money) pour maximiser les conversions.',
        timestamp: 'Il y a 35 min'
      },
      {
        id: 'sig-386',
        topic: 'Démonstrations Produit en Direct vs Spots Pubs',
        category: 'Marketing & Transparence',
        volumeGrowth: '+115%',
        sentiment: 'Préféré par 82%',
        relevanceScore: 90,
        samplePostSnippet: '"Montrez-nous le vrai fonctionnement en direct, pas des vidéos parfaites faites en studio."',
        recommendedMissionAction: 'Concevoir une campagne marketing basée sur la démonstration vidéo réelle et sans filtre.',
        timestamp: 'Il y a 1h'
      }
    ];
  }
}
