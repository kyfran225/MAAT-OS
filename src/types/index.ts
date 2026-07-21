export type AppView = 'dashboard' | 'missions' | 'agents' | 'brains' | 'simulation' | 'journal' | 'sales_os' | 'actions' | 'audit' | 'export_center';

export type MissionCategory = 'marketing' | 'sales' | 'product' | 'finance' | 'hr' | 'strategy';
export type MissionStatus = 'active' | 'debating' | 'simulating' | 'paused' | 'completed';

export interface MissionLayerPlanStep {
  id: string;
  department: string;
  action: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedAgent: string;
}

export interface Mission {
  id: string;
  title: string;
  category: MissionCategory;
  status: MissionStatus;
  healthScore: number;
  target: string;
  budget: number;
  spentBudget: number;
  timeline: string;
  progress: number;
  confidenceScore: number;
  createdAt: string;
  description: string;
  activeAgents: string[];
  objective: string;
  constraints: string[];
  resources: string[];
  planSteps: MissionLayerPlanStep[];
  learnings: string[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: 'c_suite' | 'marketing' | 'sales' | 'product' | 'finance' | 'governance' | 'hr';
  avatar: string;
  status: 'active' | 'analyzing' | 'debating' | 'idle';
  confidence: number;
  bio: string;
  responsibilities: string[];
  currentMission?: string;
  lastQuote: string;
}

export interface DecisionLog {
  id: string;
  timestamp: string;
  title: string;
  agentId: string;
  agentName: string;
  category: string;
  confidenceScore: number;
  reasoning: string;
  status: 'approved' | 'debating' | 'executing' | 'completed';
  impacts: string[];
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  variable: string;
  changeValue: string;
  estimatedROI: number;
  riskLevel: 'Faible' | 'Modéré' | 'Élevé';
  confidenceScore: number;
  recommendation: string;
  projections: {
    revenueIncrease: string;
    customerAcquisition: string;
    timeline: string;
  };
}

export interface FounderBrainConfig {
  founderName: string;
  visionStatement: string;
  riskTolerance: 'Prudent' | 'Équilibré' | 'Audacieux';
  coreValues: string[];
  strategicStyle: string;
  nonNegotiables: string[];
}

export interface CompanyBrainConfig {
  companyName: string;
  industry: string;
  valueProposition: string;
  mainProducts: string[];
  brandVoice: string;
}

export interface SystemHealth {
  overallHealth: number;
  strategicScore: number;
  contentScore: number;
  seoScore: number;
  conversionScore: number;
  automationScore: number;
  brandConsistency: number;
}

export type CRMContactStatus = 'nouveau' | 'qualifie' | 'proposition' | 'client' | 'inactif';

export interface CRMContactAIAnalysis {
  qualificationScore: number;
  buyerIntentScore: number;
  recommendedAgent: string;
  nextAction: string;
  keyInsights: string[];
}

export interface CRMContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: CRMContactStatus;
  estimatedBudget: number;
  tags: string[];
  createdAt: string;
  lastContactDate: string;
  notes: string;
  aiAnalysis: CRMContactAIAnalysis;
}

export interface CRMPipelineStage {
  id: CRMContactStatus;
  label: string;
  count: number;
  totalValue: number;
  color: string;
}

export type GeneratedActionType = 'devis_proposition' | 'relance_whatsapp' | 'email_prospection' | 'synthese_mission';

export interface GeneratedAction {
  id: string;
  type: GeneratedActionType;
  title: string;
  targetContactName?: string;
  targetCompany?: string;
  assignedAgent: string;
  content: string;
  metadata: {
    estimatedAmount?: number;
    recommendedChannel?: string;
    confidenceScore: number;
    sourceDocument?: string;
  };
  createdAt: string;
  status: 'draft' | 'approved' | 'sent';
}

export interface ExecutiveAuditReport {
  id: string;
  generatedAt: string;
  overallScore: number;
  scores: {
    strategicAlignment: number;
    commercialConversion: number;
    financialEfficiency: number;
    governanceRisk: number;
  };
  agentDiagnostics: {
    agentName: string;
    role: string;
    quote: string;
    status: 'optimal' | 'warning' | 'critical';
  }[];
  bottlenecks: {
    issue: string;
    severity: 'Faible' | 'Modéré' | 'Élevé';
    impact: string;
  }[];
  actionPlan: {
    title: string;
    targetDepartment: string;
    estimatedROI: string;
    priority: 'Haute' | 'Moyenne' | 'Urgent';
  }[];
}



