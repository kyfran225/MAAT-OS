import uuid
from typing import List, Dict, Any
from app.db.user_store import user_store

class MAATFEEDService:
    """
    Service de liaison avec l'Intelligence MAATFEED (Radar de Marché).
    Simule la captation de signaux mondiaux et leur injection dans l'OS PME.
    """

    def get_global_signals(self) -> List[Dict[str, Any]]:
        """
        Simule la récupération de signaux depuis le radar MAATFEED.
        """
        return [
            {
                "id": "sig-btp-001",
                "topic": "Explosion du BTP à Abidjan",
                "region": "Côte d'Ivoire",
                "sector": "BTP / Construction",
                "content": "Forte demande pour des solutions de gestion de chantier et réduction des coûts énergétiques.",
                "relevance_score": 95,
                "volume_growth": "+220%",
                "sentiment": "Urgent / Opportunité"
            },
            {
                "id": "sig-agri-002",
                "topic": "Transformation Digitale Agricole",
                "region": "Sénégal / Mali",
                "sector": "Agriculture",
                "content": "Les coopératives cherchent des outils de traçabilité blockchain et paiement mobile money.",
                "relevance_score": 88,
                "volume_growth": "+115%",
                "sentiment": "Croissant"
            },
            {
                "id": "sig-fin-003",
                "topic": "Réglementation Fintech UEMOA",
                "region": "Afrique de l'Ouest",
                "sector": "Finance",
                "content": "Nouvelles directives sur le KYC digital. Besoin massif de mise en conformité IA.",
                "relevance_score": 92,
                "volume_growth": "+85%",
                "sentiment": "Critique"
            }
        ]

    def analyze_opportunity(self, user_id: str, signal_id: str) -> Dict[str, Any]:
        """
        Analyse la pertinence d'un signal par rapport au Company Brain de l'utilisateur.
        """
        signals = self.get_global_signals()
        signal = next((s for s in signals if s["id"] == signal_id), None)

        if not signal:
            return {"error": "Signal non trouvé"}

        user_data = user_store.get_or_create_user_data(user_id)
        company_name = user_data["company_brain"].get("companyName", "Votre PME")

        # Simulation d'analyse stratégique du CEO Agent
        return {
            "signal": signal,
            "ceo_analysis": f"Analyse pour {company_name} : Ce signal '{signal['topic']}' présente une opportunité de croissance forte. "
                           f"Bien que notre secteur principal soit différent, nos capacités d'automatisation IA peuvent être adaptées "
                           f"pour répondre au besoin de '{signal['content']}'.",
            "recommended_mission": {
                "title": f"Offensive Stratégique : {signal['topic']}",
                "objective": f"Adapter notre offre pour capturer l'opportunité détectée par MAATFEED dans le secteur {signal['sector']}.",
                "target": f"Signer 5 premiers clients pilotes dans la région {signal['region']}.",
                "budget": 20000,
                "timeline": "60 Jours"
            }
        }

    def get_competitor_signals(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Génère des signaux basés sur les concurrents configurés dans le Company Brain.
        """
        user_data = user_store.get_or_create_user_data(user_id)
        competitors = user_data["company_brain"].get("competitors", [])

        if not competitors:
            return []

        signals = []
        for comp in competitors:
            # Simulation de détection de mouvement concurrent
            name = comp.get("name", "Concurrent")
            signals.append({
                "id": f"comp-sig-{uuid.uuid4().hex[:6]}",
                "competitorName": name,
                "title": f"Mouvement Stratégique : {name}",
                "content": f"Le concurrent {name} a été détecté en train de lancer une nouvelle offre agressive sur le segment {user_data['company_brain'].get('industry')}.",
                "timestamp": "Il y a 2h",
                "impactLevel": "Alerte" if comp.get("threatLevel") == "Élevé" else "Info",
                "suggestedMission": f"Riposte Stratégique contre {name}"
            })

        return signals

maatfeed_service = MAATFEEDService()
