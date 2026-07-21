import uuid
from typing import List, Dict, Any, Optional
from app.db.user_store import user_store
from app.agents.board import ExecutionAgent

class WorkflowEngine:
    """
    Moteur de Workflows Autonomes (Mode Autopilote).
    Gère les déclenchements automatiques basés sur les seuils de confiance et de budget.
    """

    def __init__(self):
        self.execution_agent = ExecutionAgent()

    def process_event(self, user_id: str, event_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Traite un événement (ex: nouveau lead) et décide si une action automatique doit être lancée.
        """
        # Récupération des réglages Autopilote de l'utilisateur
        user_data = user_store.get_or_create_user_data(user_id)
        settings = user_data.get("autopilot_settings", {
            "enabled": False,
            "min_confidence": 95,
            "max_budget_xof": 50000, # ~75-80 EUR / 100 USD (Prudent)
            "trust_level": 0
        })

        if not settings.get("enabled", False):
            return {"status": "manual", "message": "Autopilote désactivé."}

        if event_type == "LEAD_SUBMITTED":
            return self._handle_lead_workflow(user_id, settings, data)

        return {"status": "ignored", "message": f"Événement {event_type} non géré."}

    def _handle_lead_workflow(self, user_id: str, settings: Dict[str, Any], lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """Logique de traitement automatique d'un nouveau lead."""
        confidence = lead_data.get("confidence_score", 0)
        estimated_budget = lead_data.get("estimated_budget_xof", 0)

        # Vérification des garde-fous
        if confidence < settings["min_confidence"]:
            return {
                "status": "held",
                "reason": f"Confiance trop basse ({confidence}% < {settings['min_confidence']}%)"
            }

        if estimated_budget > settings["max_budget_xof"]:
            return {
                "status": "held",
                "reason": f"Budget dépasse le seuil ({estimated_budget} XOF > {settings['max_budget_xof']} XOF)"
            }

        # Déclenchement automatique
        action_payload = {
            "to": lead_data.get("email") or lead_data.get("phone"),
            "text": f"Bonjour {lead_data.get('name')}, MAAT Studio AI a bien reçu votre demande pour {lead_data.get('company')}. "
                    "Un conseiller vous recontactera avec une proposition personnalisée."
        }

        result = self.execution_agent.execute_action(
            action_id=f"auto-{uuid.uuid4().hex[:6]}",
            action_type="whatsapp" if lead_data.get("phone") else "email",
            payload=action_payload
        )

        # Log de l'activité autonome
        self._log_activity(user_id, {
            "type": "AUTONOMOUS_OUTREACH",
            "title": f"Relance auto envoyée à {lead_data.get('name')}",
            "status": "success",
            "impact": f"Contact établi (Confiance {confidence}%)"
        })

        return {"status": "executed", "result": result}

    def _log_activity(self, user_id: str, entry: Dict[str, Any]):
        user_data = user_store.get_or_create_user_data(user_id)
        activity = user_data.get("autopilot_activity", [])
        entry["timestamp"] = "À l'instant"
        activity.insert(0, entry)
        user_store.save_user_field(user_id, "autopilot_activity", activity[:20])

workflow_engine = WorkflowEngine()
