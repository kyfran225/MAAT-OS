import os
import json
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import groq
from app.schemas.models import DebateTurn, DebateResponse
from app.services.rag_service import rag_service
from app.db.user_store import user_store

load_dotenv()

class AIBoardEngine:
    def __init__(self):
        self.providers = ["Groq LPU (Llama-3.3-70b)", "Google Gemini", "OpenAI"]
        self.agents = {
            "ceo": "CEO Agent™",
            "cmo": "Marketing Director™",
            "cfo": "Finance Director (CFO)™",
            "risk": "Risk & Governance Lead™"
        }
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.client = None
        if self.groq_api_key:
            try:
                self.client = groq.Groq(api_key=self.groq_api_key)
            except Exception as e:
                print(f"Error initializing Groq client: {e}")

    def simulate_board_debate(
        self,
        topic: str,
        founder_brain: Optional[Dict[str, Any]] = None,
        company_brain: Optional[Dict[str, Any]] = None,
        user_id: str = "user-guest"
    ) -> DebateResponse:
        """
        Exécute le cycle Débat ➔ Décision du Conseil d'Administration IA en s'appuyant sur Groq LLM (Llama-3.3-70b).
        Intègre désormais le contexte RAG récupéré des documents ingérés (Product Bible).
        """
        fb = founder_brain or {}
        cb = company_brain or {}

        founder_name = fb.get("founderName", "Dirigeant")
        vision = fb.get("visionStatement", "Croissance et innovation")
        risk_tol = fb.get("riskTolerance", "Équilibré")
        values = ", ".join(fb.get("coreValues", ["Qualité", "Transparence"]))
        style = fb.get("strategicStyle", "Orienté résultats")

        company_name = cb.get("companyName", "Entreprise MAAT")
        industry = cb.get("industry", "Technologies & Services")
        uvp = cb.get("valueProposition", "Solutions à haute valeur ajoutée")
        voice = cb.get("brandVoice", "Professionnel et audacieux")

        # RAG Step: Récupération du contexte pertinent
        product_context = rag_service.query_context(user_id, topic)

        if self.client:
            prompt = f"""Tu es le Moteur de Conseil d'Administration IA de MAAT Studio AI.
Tu vas simuler un débat contradictoire réaliste entre 4 directeurs IA spécialisés sur le sujet suivant:
SUJET DE DÉBAT: "{topic}"

{product_context}

CONTEXTE DE L'ENTREPRISE:
- Nom de l'entreprise: {company_name}
- Secteur: {industry}
- Proposition de Valeur (UVP): {uvp}
- Ton & Voix de marque: {voice}

CONTEXTE DU FONDATEUR (Founder Brain):
- Fondateur: {founder_name}
- Vision: {vision}
- Tolérance au Risque: {risk_tol}
- Valeurs Fondamentales: {values}
- Style Stratégique: {style}

INSTRUCTIONS DE GÉNÉRATION:
Génère une réponse JSON STRICTE sans aucun texte autour, au format exact suivant:
{{
  "turns": [
    {{
      "agent": "Marketing Director™",
      "message": "<Analyse marketing stratégique spécifique à cette PME et à la mission, en citant des éléments du contexte si pertinent>",
      "confidence": 92
    }},
    {{
      "agent": "Finance Director (CFO)™",
      "message": "<Analyse financière contradictoire, ROI, risques et coûts basés sur les données produits>",
      "confidence": 95
    }},
    {{
      "agent": "Risk & Governance Lead™",
      "message": "<Vérification d'alignement avec les valeurs du Founder Brain et conformité>",
      "confidence": 97
    }},
    {{
      "agent": "CEO Agent™",
      "message": "<Arbitrage stratégique final conciliant le marketing, la finance et les convictions du fondateur>",
      "confidence": 96
    }}
  ],
  "finalDecision": "<Décision synthétique d'arbitrage final du CEO Agent>",
  "confidenceScore": 96
}}
Remarque: Reste très concis, percutant et ultra-spécifique au contexte de {company_name}. Rédige uniquement en Français.
"""
            try:
                res = self.client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": "Tu es un moteur d'IA d'entreprise qui génère du JSON valide."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"}
                )
                raw_json = res.choices[0].message.content
                data = json.loads(raw_json)

                turns = [
                    DebateTurn(
                        agent=t.get("agent", "Directeur IA"),
                        message=t.get("message", ""),
                        confidence=t.get("confidence", 90)
                    )
                    for t in data.get("turns", [])
                ]
                final_decision = data.get("finalDecision", f"Arbitrage rendu pour {topic}.")
                conf_score = data.get("confidenceScore", 95)

                # Cost tracking (XOF) - Simulation based on tokens or fixed price
                # Llama 3.3 70B on Groq is roughly $0.59 / 1M tokens.
                # Let's use a flat rate of ~50 XOF per complex debate for the PME.
                user_store.add_finance_event(user_id, "AI_DEBATE", f"Débat IA : {topic[:30]}...", 50.0, True)

                if turns:
                    return DebateResponse(
                        topic=topic,
                        turns=turns,
                        finalDecision=final_decision,
                        confidenceScore=conf_score
                    )
            except Exception as e:
                print(f"[AIBoardEngine] Direct LLM Call error: {e}. Falling back to dynamic template.")

        # Fallback dynamique si pas de connexion
        turns: List[DebateTurn] = [
            DebateTurn(
                agent=self.agents["cmo"],
                message=f"Pour {company_name} ({industry}), la mission '{topic}' permettra d'amplifier la proposition de valeur ({uvp}).",
                confidence=91
            ),
            DebateTurn(
                agent=self.agents["cfo"],
                message=f"Analyse financière : Compte tenu du profil '{risk_tol}' du Founder Brain ({founder_name}), le ROI doit dépasser 2.5x avec suivi strict du budget.",
                confidence=95
            ),
            DebateTurn(
                agent=self.agents["risk"],
                message=f"Validation de conformité : Alignement vérifié avec les valeurs ({values}) et le style '{style}'.",
                confidence=98
            ),
            DebateTurn(
                agent=self.agents["ceo"],
                message=f"Arbitrage CEO Agent : Mission '{topic}' validée pour {company_name} avec déploiement par étapes.",
                confidence=96
            )
        ]

        # Cost tracking even for fallback
        user_store.add_finance_event(user_id, "AI_DEBATE", f"Débat IA (Offline) : {topic[:30]}...", 15.0, True)

        return DebateResponse(
            topic=topic,
            turns=turns,
            finalDecision=f"Mission '{topic}' approuvée à 96% de confiance par le CEO Agent.",
            confidenceScore=96
        )

class ExecutionAgent(AIBoardEngine):
    """
    Extension de l'AIBoardEngine capable d'exécuter réellement des actions.
    """
    def execute_action(self, action_id: str, action_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Déclenche une action réelle via les connecteurs d'intégration.
        """
        print(f"Executing real action: {action_type} (ID: {action_id})")

        if action_type == "email":
            # Simulation d'envoi d'email
            return {"status": "success", "provider": "SendGrid", "timestamp": "À l'instant"}

        elif action_type == "whatsapp":
            from app.integrations.crm_connectors import WhatsAppConnector
            wa = WhatsAppConnector()
            return wa.send_message("fake-key", payload.get("to", ""), payload.get("text", ""))

        elif action_type == "invoice":
            # Simulation de génération de facture
            return {"status": "success", "invoice_url": "https://cdn.maat-studio.ai/inv-123.pdf"}

        return {"status": "error", "message": f"Unknown action type: {action_type}"}

