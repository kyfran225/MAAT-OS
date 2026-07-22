import { GraphNode } from '../components/graph/KnowledgeGraphExplorer';

// Simple pub-sub for knowledge graph updates since we are not using a global state manager like Redux/Zustand yet.
type GraphUpdateListener = (node: GraphNode) => void;
const listeners: GraphUpdateListener[] = [];

export const knowledgeGraphService = {
  subscribe: (listener: GraphUpdateListener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },

  addNodeFromSource: (source: { id: string; name: string; type: string; extractedBrain: string; extractedInsights?: string[] }) => {
    const newNode: GraphNode = {
      id: `node-${source.id}`,
      label: source.name,
      category: 'document',
      type: `${source.type.toUpperCase()} Ingestion`,
      connections: [
        source.extractedBrain === 'Customer Brain' ? 'node-customer' : 'node-company'
      ],
      details: {
        description: `Document ingéré via le Smart Ingestion Center. Analyse sémantique rattachée au ${source.extractedBrain}.`,
        impactScore: 85 + Math.floor(Math.random() * 10),
        lastUpdated: 'À l\'instant',
        keyAttributes: source.extractedInsights || []
      }
    };

    listeners.forEach(listener => listener(newNode));
  }
};
