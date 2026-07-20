from typing import List, Dict, Any

class EnterpriseKnowledgeGraph:
    """
    Graphe de connaissances d'entreprise (Enterprise Knowledge Graph™)
    Cartographie les relations entre Founder Brain, Missions, Produits, Segments Clients et Signaux MAATFEED.
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

    def get_all_nodes() -> List[Dict[str, Any]]:
        return self.nodes

    def query_graph(self, node_id: str) -> Dict[str, Any]:
        node = next((n for n in self.nodes if n["id"] == node_id), None)
        if not node:
            return {"error": "Node not found"}
        
        connected_nodes = [n for n in self.nodes if n["id"] in node["connections"]]
        return {
            "node": node,
            "connectedNodes": connected_nodes
        }

knowledge_graph_db = EnterpriseKnowledgeGraph()
