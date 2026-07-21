import json
import uuid
from typing import List, Dict, Any, Optional
from app.db.user_store import user_store

class FormService:
    """
    Service pour la gestion des formulaires publics dynamiques.
    Permet à une PME de générer des formulaires de capture de leads.
    """

    def create_form_schema(self, user_id: str, title: str, fields: List[Dict[str, Any]]) -> str:
        """
        Crée un nouveau schéma de formulaire pour un utilisateur.
        """
        form_id = f"form-{uuid.uuid4().hex[:8]}"
        schema = {
            "id": form_id,
            "title": title,
            "fields": fields,
            "active": True
        }

        # Récupère les formulaires existants ou initialise
        user_data = user_store.get_or_create_user_data(user_id)
        public_forms = user_data.get("public_forms", [])
        public_forms.append(schema)

        user_store.save_user_field(user_id, "public_forms", public_forms)
        return form_id

    def get_form_schema(self, user_id: str, form_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère un schéma de formulaire spécifique.
        """
        user_data = user_store.get_or_create_user_data(user_id)
        public_forms = user_data.get("public_forms", [])
        for form in public_forms:
            if form["id"] == form_id:
                return form
        return None

    def submit_lead(self, user_id: str, form_id: str, data: Dict[str, Any]) -> str:
        """
        Enregistre une soumission de formulaire (Lead).
        """
        submission_id = f"sub-{uuid.uuid4().hex[:8]}"
        submission = {
            "id": submission_id,
            "form_id": form_id,
            "data": data,
            "timestamp": "À l'instant", # Dans une version réelle, utiliser datetime.now()
            "status": "new"
        }

        # Mise à jour des contacts CRM avec le nouveau lead
        contacts = user_store.get_or_create_user_data(user_id).get("crm_contacts", [])

        # Transformation simple de la soumission en contact CRM
        new_contact = {
            "id": f"cnt-{uuid.uuid4().hex[:8]}",
            "name": data.get("name", "Anonyme"),
            "email": data.get("email", ""),
            "company": data.get("company", "PME Prospect"),
            "estimatedBudget": int(data.get("budget", 0)),
            "status": "lead",
            "lastInteraction": "Soumission Formulaire"
        }
        contacts.append(new_contact)
        user_store.update_crm_contacts(user_id, contacts)

        return submission_id

form_service = FormService()
