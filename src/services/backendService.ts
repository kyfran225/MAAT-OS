import { Mission, SimulationScenario, SystemHealth, DecisionLog, FounderBrainConfig, CompanyBrainConfig, Agent, CRMContact } from '../types';
import { MAATAuthService } from './maatAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface BackendDebateTurn {
  agent: string;
  message: string;
  confidence: number;
}

export interface BackendDebateResponse {
  topic: string;
  turns: BackendDebateTurn[];
  finalDecision: string;
  confidenceScore: number;
}

export interface BackendCulturalSignal {
  id: string;
  topic: string;
  volumeGrowth: string;
  sentiment: string;
  relevanceScore: number;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: string;
  department: string;
}

export interface UserAllData {
  user_id: string;
  founder_brain: FounderBrainConfig;
  company_brain: CompanyBrainConfig;
  system_health: SystemHealth;
  agents: Agent[];
  missions: Mission[];
  decision_logs: DecisionLog[];
  simulations: SimulationScenario[];
  crm_contacts?: CRMContact[];
  finance_stats?: any;
}

export class BackendService {
  private static instance: BackendService;

  private constructor() {}

  public static getInstance(): BackendService {
    if (!BackendService.instance) {
      BackendService.instance = new BackendService();
    }
    return BackendService.instance;
  }

  private getHeaders(): Record<string, string> {
    const user = MAATAuthService.getInstance().getCurrentUser();
    const userId = user ? user.userId : 'user-maat-001';
    return {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    };
  }

  /**
   * Récupère l'intégralité des données persistées pour l'utilisateur actuellement connecté
   */
  public async getUserData(): Promise<UserAllData | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/user-data`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Health Check & Metrics
   */
  public async getHealth(): Promise<SystemHealth | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Missions
   */
  public async getMissions(): Promise<Mission[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/missions`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Création de Mission via Moteur Cognitif Python Backend
   */
  public async createMission(reqData: {
    title: string;
    category: string;
    target: string;
    budget: number;
    timeline: string;
    objective: string;
    constraints: string[];
  }): Promise<Mission | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/missions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(reqData),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data as Mission;
    } catch {
      return null;
    }
  }

  /**
   * Validation d'une étape de plan de mission
   */
  public async toggleMissionStep(missionId: string, stepId: string): Promise<Mission | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/missions/${missionId}/step`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ missionId, stepId }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Journal de bord / Decision Logs
   */
  public async getLogs(): Promise<DecisionLog[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/logs`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Simulations
   */
  public async getSimulations(): Promise<SimulationScenario[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/simulations`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Simulation ROI What-If Engine
   */
  public async runSimulation(reqData: {
    title: string;
    variable: string;
    changeValue: string;
  }): Promise<SimulationScenario | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/simulation`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(reqData),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        variable: data.variable,
        changeValue: data.changeValue,
        estimatedROI: data.estimatedROI,
        riskLevel: data.riskLevel as 'Faible' | 'Modéré' | 'Élevé',
        confidenceScore: data.confidenceScore,
        recommendation: data.recommendation,
        projections: {
          revenueIncrease: data.projections?.revenueIncrease || '+$24,000 / trimestre',
          customerAcquisition: data.projections?.customerAcquisition || '+85 Clients',
          timeline: data.projections?.timeline || '2 Mois',
        },
      };
    } catch {
      return null;
    }
  }

  /**
   * Founder Brain Configuration
   */
  public async getFounderBrain(): Promise<FounderBrainConfig | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/brain/founder`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async saveFounderBrain(config: FounderBrainConfig): Promise<FounderBrainConfig | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/brain/founder`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(config),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Company Brain Configuration
   */
  public async getCompanyBrain(): Promise<CompanyBrainConfig | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/brain/company`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async saveCompanyBrain(config: CompanyBrainConfig): Promise<CompanyBrainConfig | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/brain/company`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(config),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Agents
   */
  public async getAgents(): Promise<Agent[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/agents`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Session de Débat Inter-Agents du Conseil d'Administration IA
   */
  public async runBoardDebate(topic: string): Promise<BackendDebateResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/debate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Signaux d'Intelligence Culturelle MAATFEED
   */
  public async getCulturalSignals(): Promise<any[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/maatfeed/signals`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.signals;
    } catch {
      return null;
    }
  }

  public async analyzeSignal(signalId: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/maatfeed/analyze/${signalId}`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Knowledge Graph Nœuds & Relations
   */
  public async getKnowledgeGraphNodes(): Promise<KnowledgeGraphNode[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/graph/nodes`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.nodes;
    } catch {
      return null;
    }
  }

  /**
   * Sales OS & CRM Contacts PME
   */
  public async getCRMContacts(): Promise<CRMContact[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crm/contacts`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async createCRMContact(contact: CRMContact): Promise<CRMContact | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crm/contacts`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(contact),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async updateCRMContactStatus(contactId: string, newStatus: string): Promise<CRMContact | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crm/contacts/${contactId}/status?new_status=${newStatus}`, {
        method: 'PUT',
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * RAG & Document Ingestion
   */
  public async ingestDocument(fileName: string, content: string, brainType: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/ingest`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ file_name: fileName, content, brain_type: brainType }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async getKnowledgeSources(): Promise<any[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/knowledge`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Finance OS Stats
   */
  public async getFinanceStats(): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/finance/stats`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}
