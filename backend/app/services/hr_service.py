import uuid
from typing import List, Dict, Any
from app.db.user_store import user_store

class HRService:
    """
    Service d'Expansion RH & Onboarding.
    Gère la rédaction de fiches de poste, le tri de CV et les plans d'accueil.
    """

    def generate_job_description(self, user_id: str, role_title: str) -> Dict[str, Any]:
        """
        Génère une fiche de poste alignée sur le Founder Brain.
        """
        user_data = user_store.get_or_create_user_data(user_id)
        fb = user_data.get("founder_brain", {})
        cb = user_data.get("company_brain", {})

        vision = fb.get("visionStatement", "Innovation et Excellence")
        values = ", ".join(fb.get("coreValues", ["Qualité", "Engagement"]))
        company = cb.get("companyName", "Notre PME")

        description = f"""
# OFFRE D'EMPLOI : {role_title} chez {company}

### NOTRE VISION
{vision}

### POURQUOI NOUS REJOINDRE ?
Nous ne cherchons pas seulement des compétences, mais des personnalités qui résonnent avec nos valeurs : {values}.

### MISSIONS
En tant que {role_title}, vous serez au cœur de notre moteur de croissance. Vos responsabilités incluront l'alignement stratégique et l'excellence opérationnelle quotidienne.

### PROFIL RECHERCHÉ
- Orienté résultat et culture PME.
- Capacité à évoluer dans un environnement augmenté par l'IA.
- Adhésion totale à notre culture : {values}.
        """

        job_id = f"job-{uuid.uuid4().hex[:6]}"
        job = {
            "id": job_id,
            "title": role_title,
            "description": description,
            "status": "publié",
            "createdAt": "À l'instant"
        }

        hr_data = user_data.get("hr_data", {"jobs": [], "candidates": [], "onboarding_plans": []})
        hr_data["jobs"].insert(0, job)
        user_store.save_user_field(user_id, "hr_data", hr_data)

        return job

    def generate_onboarding_plan(self, user_id: str, candidate_name: str, role: str) -> Dict[str, Any]:
        """
        Crée un plan d'onboarding culturel de 24h.
        """
        user_data = user_store.get_or_create_user_data(user_id)
        fb = user_data.get("founder_brain", {})

        plan = {
            "candidateName": candidate_name,
            "role": role,
            "schedule": [
                {"time": "09:00", "activity": "Accueil par le CEO Agent & Petit-déjeuner d'équipe"},
                {"time": "10:30", "activity": f"Immersion Vision : Comprendre pourquoi {fb.get('founderName')} a créé cette PME"},
                {"time": "12:00", "activity": "Déjeuner avec les Directeurs IA du Conseil"},
                {"time": "14:00", "activity": "Configuration du poste de travail augmenté"},
                {"time": "16:00", "activity": "Première Mission™ d'observation"},
                {"time": "18:00", "activity": "Débriefing de fin de J1"}
            ]
        }

        hr_data = user_data.get("hr_data", {"jobs": [], "candidates": [], "onboarding_plans": []})
        hr_data["onboarding_plans"].insert(0, plan)
        user_store.save_user_field(user_id, "hr_data", hr_data)

        return plan

hr_service = HRService()
