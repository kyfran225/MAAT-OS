from typing import List, Dict, Any, Optional
from abc import ABC, abstractmethod

class GraphStore(ABC):
    @abstractmethod
    def get_nodes(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def query(self, node_id: str) -> Dict[str, Any]:
        pass

class SQLiteGraphStore(GraphStore):
    """
    Implémentation actuelle utilisant une structure en mémoire ou SQLite.
    """
    def __init__(self):
        self.nodes = [
            {"id": "n-founder", "type": "FounderBrain", "label": "Franck (Vision & Valeurs)", "connections": ["n-company", "n-mission-01", "n-mission-02"]},
            {"id": "n-company", "type": "CompanyBrain", "label": "MAAT Studio AI (Business OS)", "connections": ["n-product-01", "n-product-02"]},
            {"id": "n-product-01", "type": "Product", "label": "Moteur de Missions 6-Couches", "connections": ["n-segment-pme"]},
            {"id": "n-product-02", "type": "Product", "label": "Conseil d'Administration IA", "connections": ["n-segment-startup"]},
            {"id": "n-mission-01", "type": "Mission", "label": "Lancement Filiale Afrique de l'Ouest", "connections": ["n-signal-385", "n-dept-sales"]},
            {"id": "n-mission-02", "type": "Mission", "label": "Optimisation Tunnel PME", "connections": ["n-signal-384", "n-dept-hr"]},
            {"id": "n-signal-384", "type": "CulturalSignal", "label": "Signal MAATFEED #384 (Onboarding Rapide)", "connections": ["n-mission-02"]},
            {"id": "n-signal-385", "type": "CulturalSignal", "label": "Signal MAATFEED #385 (Mobile Money)", "connections": ["n-mission-01"]},
            {"id": "n-dept-sales", "type": "Department", "label": "Sales OS (Outreach & Pipeline)", "connections": ["n-segment-pme"]},
            {"id": "n-dept-hr", "type": "Department", "label": "HR OS (Recrutement & Culture)", "connections": ["n-segment-pme"]},
        ]

    def get_nodes(self) -> List[Dict[str, Any]]:
        return self.nodes

    def query(self, node_id: str) -> Dict[str, Any]:
        node = next((n for n in self.nodes if n["id"] == node_id), None)
        if not node:
            return {"error": "Node not found"}
        
        connected_nodes = [n for n in self.nodes if n["id"] in node["connections"]]
        return {
            "node": node,
            "connectedNodes": connected_nodes
        }

class EnterpriseKnowledgeGraph:
    """
    Graphe de connaissances d'entreprise (Enterprise Knowledge Graph™).
    Utilise un driver (GraphStore) pour le stockage.
    """
    def __init__(self, store: Optional[GraphStore] = None):
        self.store = store or SQLiteGraphStore()

    def get_all_nodes(self) -> List[Dict[str, Any]]:
        return self.store.get_nodes()

    def query_graph(self, node_id: str) -> Dict[str, Any]:
        return self.store.query(node_id)

# Instance par défaut
knowledge_graph_db = EnterpriseKnowledgeGraph()
