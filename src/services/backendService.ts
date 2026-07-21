import { Mission, SimulationScenario, SystemHealth } from '../types';

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

export class BackendService {
  private static instance: BackendService;

  private constructor() {}

  public static getInstance(): BackendService {
    if (!BackendService.instance) {
      BackendService.instance = new BackendService();
    }
    return BackendService.instance;
  }

  /**
   * Health Check & Metrics
   */
  public async getHealth(): Promise<SystemHealth | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/health`);
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
        headers: { 'Content-Type': 'application/json' },
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
   * Session de Débat Inter-Agents du Conseil d'Administration IA
   */
  public async runBoardDebate(topic: string): Promise<BackendDebateResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/debate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
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
        headers: { 'Content-Type': 'application/json' },
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
          revenueIncrease: data.revenueIncrease,
          customerAcquisition: data.customerAcquisition,
          timeline: data.timeline,
        },
      };
    } catch {
      return null;
    }
  }

  /**
   * Signaux d'Intelligence Culturelle MAATFEED
   */
  public async getCulturalSignals(): Promise<BackendCulturalSignal[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/maatfeed/signals`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.signals;
    } catch {
      return null;
    }
  }

  /**
   * Knowledge Graph Nœuds & Relations
   */
  public async getKnowledgeGraphNodes(): Promise<KnowledgeGraphNode[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/graph/nodes`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.nodes;
    } catch {
      return null;
    }
  }
}
