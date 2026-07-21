import os
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "maat_studio.db")

class UserStore:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_data (
                    user_id TEXT PRIMARY KEY,
                    founder_brain TEXT NOT NULL,
                    company_brain TEXT NOT NULL,
                    system_health TEXT NOT NULL,
                    agents TEXT NOT NULL,
                    missions TEXT NOT NULL,
                    decision_logs TEXT NOT NULL,
                    simulations TEXT NOT NULL,
                    crm_contacts TEXT DEFAULT '[]',
                    public_forms TEXT DEFAULT '[]',
                    document_knowledge TEXT DEFAULT '[]',
                    ingested_sources TEXT DEFAULT '[]',
                    autopilot_settings TEXT DEFAULT '{}',
                    autopilot_activity TEXT DEFAULT '[]',
                    finance_stats TEXT DEFAULT '{"total_cost": 0, "total_revenue": 0, "events": []}',
                    market_signals TEXT DEFAULT '[]',
                    hr_data TEXT DEFAULT '{"jobs": [], "candidates": [], "onboarding_plans": []}',
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            # Check and add columns if table existed without them
            cursor.execute("PRAGMA table_info(user_data)")
            columns = [column[1] for column in cursor.fetchall()]
            if "crm_contacts" not in columns:
                cursor.execute("ALTER TABLE user_data ADD COLUMN crm_contacts TEXT DEFAULT '[]'")
            if "public_forms" not in columns:
                cursor.execute("ALTER TABLE user_data ADD COLUMN public_forms TEXT DEFAULT '[]'")
            if "document_knowledge" not in columns:
                cursor.execute("ALTER TABLE user_data ADD COLUMN document_knowledge TEXT DEFAULT '[]'")
            if "ingested_sources" not in columns:
                cursor.execute("ALTER TABLE user_data ADD COLUMN ingested_sources TEXT DEFAULT '[]'")
            if "autopilot_settings" not in columns:
                cursor.execute("ALTER TABLE user_data ADD COLUMN autopilot_settings TEXT DEFAULT '{}'")
            if "autopilot_activity" not in columns:
                cursor.execute("ALTER TABLE user_data ADD COLUMN autopilot_activity TEXT DEFAULT '[]'")
            if "finance_stats" not in columns:
                cursor.execute("ALTER TABLE user_data ADD COLUMN finance_stats TEXT DEFAULT '{\"total_cost\": 0, \"total_revenue\": 0, \"events\": []}'")
            if "market_signals" not in columns:
                cursor.execute("ALTER TABLE user_data ADD COLUMN market_signals TEXT DEFAULT '[]'")
            if "hr_data" not in columns:
                cursor.execute("ALTER TABLE user_data ADD COLUMN hr_data TEXT DEFAULT '{\"jobs\": [], \"candidates\": [], \"onboarding_plans\": []}'")
            conn.commit()

    def get_or_create_user_data(self, user_id: str) -> Dict[str, Any]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM user_data WHERE user_id = ?", (user_id,))
            row = cursor.fetchone()
            if row:
                return {
                    "user_id": row["user_id"],
                    "founder_brain": json.loads(row["founder_brain"]),
                    "company_brain": json.loads(row["company_brain"]),
                    "system_health": json.loads(row["system_health"]),
                    "agents": json.loads(row["agents"]),
                    "missions": json.loads(row["missions"]),
                    "decision_logs": json.loads(row["decision_logs"]),
                    "simulations": json.loads(row["simulations"]),
                    "crm_contacts": json.loads(row["crm_contacts"]) if "crm_contacts" in row.keys() and row["crm_contacts"] else [],
                    "public_forms": json.loads(row["public_forms"]) if "public_forms" in row.keys() and row["public_forms"] else [],
                    "document_knowledge": json.loads(row["document_knowledge"]) if "document_knowledge" in row.keys() and row["document_knowledge"] else [],
                    "ingested_sources": json.loads(row["ingested_sources"]) if "ingested_sources" in row.keys() and row["ingested_sources"] else [],
                    "autopilot_settings": json.loads(row["autopilot_settings"]) if "autopilot_settings" in row.keys() and row["autopilot_settings"] else {},
                    "autopilot_activity": json.loads(row["autopilot_activity"]) if "autopilot_activity" in row.keys() and row["autopilot_activity"] else [],
                    "finance_stats": json.loads(row["finance_stats"]) if "finance_stats" in row.keys() and row["finance_stats"] else {"total_cost": 0, "total_revenue": 0, "events": []},
                    "market_signals": json.loads(row["market_signals"]) if "market_signals" in row.keys() and row["market_signals"] else [],
                    "hr_data": json.loads(row["hr_data"]) if "hr_data" in row.keys() and row["hr_data"] else {"jobs": [], "candidates": [], "onboarding_plans": []},
                }

            # Create initial default data for new user
            default_data = self._generate_default_user_data(user_id)
            cursor.execute(
                """
                INSERT INTO user_data (user_id, founder_brain, company_brain, system_health, agents, missions, decision_logs, simulations)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user_id,
                    json.dumps(default_data["founder_brain"]),
                    json.dumps(default_data["company_brain"]),
                    json.dumps(default_data["system_health"]),
                    json.dumps(default_data["agents"]),
                    json.dumps(default_data["missions"]),
                    json.dumps(default_data["decision_logs"]),
                    json.dumps(default_data["simulations"]),
                )
            )
            conn.commit()
            return default_data

    def _generate_default_user_data(self, user_id: str) -> Dict[str, Any]:
        # Demo account explicit for presentations
        if user_id == "user-maat-001":
            return {
                "user_id": user_id,
                "founder_brain": {
                    "founderName": "Franck",
                    "visionStatement": "Transformer les PME et entreprises en organisations augmentées grâce à un Conseil d'Administration IA.",
                    "riskTolerance": "Audacieux",
                    "coreValues": [
                        "Zéro UI Morte (Logic-First + Pixel-Perfect)",
                        "Rigueur absolue et Fiabilité des données",
                        "Simplicité d'action centrée sur le résultat (Missions)",
                        "Écosystème souverain et interconnecté (MAATFEED et Studio)"
                    ],
                    "strategicStyle": "Axé sur la valeur produit réelle, le ROI démontrable et la rapidité d'apprentissage.",
                    "nonNegotiables": [
                        "Aucun faux bouton ou donnée de démonstration statique trompeuse",
                        "Explicabilité totale des décisions IA avec indice de confiance"
                    ]
                },
                "company_brain": {
                    "companyName": "MAAT Studio AI",
                    "industry": "AI Company Operating System / B2B Enterprise Software",
                    "valueProposition": "Le premier système d'exploitation d'entreprise qui orchestre vos missions métiers grâce à un Conseil d'Administration IA.",
                    "mainProducts": [
                        "MAAT Studio AI (Business OS)",
                        "Moteur de Missions Cognitives",
                        "MAATFEED (Human Intelligence Layer)"
                    ],
                    "brandVoice": "Visionnaire, Exécutif, Élégant et Axé sur les résultats"
                },
                "system_health": {
                    "overallHealth": 84,
                    "strategicScore": 92,
                    "contentScore": 88,
                    "seoScore": 63,
                    "conversionScore": 41,
                    "automationScore": 95,
                    "brandConsistency": 72
                },
                "agents": [
                    {
                        "id": "ceo-agent",
                        "name": "CEO Agent",
                        "role": "Directeur Exécutif Numérique",
                        "department": "c_suite",
                        "avatar": "🎯",
                        "status": "analyzing",
                        "confidence": 96,
                        "bio": "Synthétise la vision du fondateur et oriente le Conseil d'Administration IA.",
                        "responsibilities": ["Arbitrage des priorités", "Coordination du Conseil IA", "Allocation des ressources"],
                        "currentMission": "Lancement Filiale Afrique de l'Ouest",
                        "lastQuote": "Priorité de la semaine : Améliorer le taux de conversion du segment PME."
                    },
                    {
                        "id": "chief-of-staff",
                        "name": "Chief of Staff",
                        "role": "Bras Droit Organisationnel",
                        "department": "c_suite",
                        "avatar": "📋",
                        "status": "active",
                        "confidence": 94,
                        "bio": "Transforme les décisions stratégiques en roadmaps exécutables.",
                        "responsibilities": ["Suivi des jalons", "Gestion des dépendances inter-agents", "Journaux de bord"],
                        "currentMission": "Lancement Filiale Afrique de l'Ouest",
                        "lastQuote": "Les 6 couches de la Mission 01 sont opérationnelles."
                    },
                    {
                        "id": "cmo-agent",
                        "name": "Marketing Director",
                        "role": "Directeur Marketing & Récits",
                        "department": "marketing",
                        "avatar": "🚀",
                        "status": "debating",
                        "confidence": 91,
                        "bio": "Pilote les campagnes, l'acquisition et le positionnement de marque.",
                        "responsibilities": ["Stratégie de contenu", "Distribution multi-canaux", "Hooks & Storytelling"],
                        "currentMission": "Optimisation Tunnel de Conversion",
                        "lastQuote": "Le signal culturel extrait de MAATFEED montre une forte hausse d'intérêt."
                    },
                    {
                        "id": "cfo-agent",
                        "name": "Finance Director (CFO)",
                        "role": "Directeur Financier & ROI",
                        "department": "finance",
                        "avatar": "💎",
                        "status": "active",
                        "confidence": 95,
                        "bio": "Garant du rendement du capital et de la simulation des risques financiers.",
                        "responsibilities": ["CAC / LTV Analysis", "Forecast budgétaire", "Mode Simulation ROI"],
                        "currentMission": "Optimisation Tunnel de Conversion",
                        "lastQuote": "Le coût d'acquisition est maîtrisé sous condition de ROI à 60 jours."
                    },
                    {
                        "id": "risk-agent",
                        "name": "Risk & Governance Lead",
                        "role": "Gardien de la Conformité & Image",
                        "department": "governance",
                        "avatar": "🛡️",
                        "status": "idle",
                        "confidence": 98,
                        "bio": "Vérifie la conformité juridique et la cohérence de marque.",
                        "responsibilities": ["Compliance juridique", "Protection de la marque", "Audit des allégations"],
                        "lastQuote": "Conformité vérifiée avec les critères du Founder Brain."
                    }
                ],
                "missions": [
                    {
                        "id": "mission-demo-01",
                        "title": "Lancement Filiale Afrique de l'Ouest",
                        "category": "strategy",
                        "status": "active",
                        "healthScore": 89,
                        "target": "Implanter la solution sur 3 marchés clés et signer 200 PME pionnières.",
                        "budget": 25000,
                        "spentBudget": 8400,
                        "timeline": "90 Jours",
                        "progress": 42,
                        "confidenceScore": 91,
                        "createdAt": "2026-07-01",
                        "description": "Mission d'expansion géographique combinant acquisition réseau et partenariats locaux.",
                        "activeAgents": ["ceo-agent", "chief-of-staff", "cmo-agent", "cfo-agent"],
                        "objective": "Établir une présence dominante sur le segment des PME avec le compte unique MAAT.",
                        "constraints": [
                            "Budget plafonné à $25k",
                            "Paiements mobiles locaux obligatoires",
                            "Temps de réponse support < 5 minutes"
                        ],
                        "resources": [
                            "Product Bible V2",
                            "Accès API MAATFEED Intelligence Layer",
                            "Partenariats technologiques locaux"
                        ],
                        "planSteps": [
                            {"id": "s1", "department": "Stratégie", "action": "Étude d'impact & signaux culturels MAATFEED", "status": "completed", "assignedAgent": "CEO Agent"},
                            {"id": "s2", "department": "Marketing", "action": "Création des kits de contenu & landing pages adaptées", "status": "in_progress", "assignedAgent": "Marketing Director"},
                            {"id": "s3", "department": "Finance", "action": "Intégration du système de facturation multi-devises", "status": "in_progress", "assignedAgent": "Finance Director (CFO)"},
                            {"id": "s4", "department": "Sales", "action": "Campagne d'outreach ciblée sur 500 décideurs PME", "status": "pending", "assignedAgent": "Chief of Staff"}
                        ],
                        "learnings": [
                            "Le canal WhatsApp Business obtient un taux d'ouverture de 94% dans la région.",
                            "Les webinaires interactifs convertissent 2.5x mieux."
                        ]
                    },
                    {
                        "id": "mission-demo-02",
                        "title": "Optimisation Tunnel de Conversion PME",
                        "category": "marketing",
                        "status": "active",
                        "healthScore": 72,
                        "target": "Faire passer le taux de conversion global de 2.1% à 4.5%.",
                        "budget": 12000,
                        "spentBudget": 5100,
                        "timeline": "45 Jours",
                        "progress": 60,
                        "confidenceScore": 84,
                        "createdAt": "2026-07-10",
                        "description": "Restructuration du parcours d'onboarding et suppression des frictions.",
                        "activeAgents": ["cmo-agent", "cfo-agent"],
                        "objective": "Éliminer l'abandon lors du premier accès et guider le dirigeant en < 3 minutes.",
                        "constraints": [
                            "Zéro friction formulaire",
                            "Guide pas-à-pas interactif obligatoire"
                        ],
                        "resources": [
                            "Données de sessions Customer Brain",
                            "Scripts d'onboarding Founder Brain"
                        ],
                        "planSteps": [
                            {"id": "s21", "department": "Produit", "action": "Audit de la goutte de conversion sur l'onboarding", "status": "completed", "assignedAgent": "Marketing Director"},
                            {"id": "s22", "department": "Création", "action": "Refonte des visuels de preuve sociale", "status": "in_progress", "assignedAgent": "Marketing Director"},
                            {"id": "s23", "department": "Finance", "action": "Mise en place de la garantie satisfait 30j", "status": "pending", "assignedAgent": "Finance Director (CFO)"}
                        ],
                        "learnings": [
                            "L'ajout d'une simulation ROI augmente la rétention de +38%."
                        ]
                    }
                ],
                "decision_logs": [
                    {
                        "id": "dec-demo-101",
                        "timestamp": "11:42 UTC",
                        "title": "Réallocation de 20% du budget publicitaire vers les canaux éducatifs",
                        "agentId": "cfo-agent",
                        "agentName": "Finance Director (CFO)",
                        "category": "Finance & ROI",
                        "confidenceScore": 92,
                        "reasoning": "Analyse comparative : Les contenus éducatifs apportent des leads qualifiés avec un coût d'acquisition inférieur de 41%.",
                        "status": "approved",
                        "impacts": ["Économie estimée : $3,400", "Hausse estimée de la qualité des leads : +28%"]
                    },
                    {
                        "id": "dec-demo-102",
                        "timestamp": "09:15 UTC",
                        "title": "Validation de la ligne éditoriale 'L'Entreprise Augmentée'",
                        "agentId": "cmo-agent",
                        "agentName": "Marketing Director",
                        "category": "Branding",
                        "confidenceScore": 95,
                        "reasoning": "Alignement avec le Founder Brain. Adoption du concept AI Company OS.",
                        "status": "completed",
                        "impacts": ["Cohérence de marque renforcée", "Différenciation nette"]
                    }
                ],
                "simulations": [
                    {
                        "id": "sim-demo-01",
                        "title": "Augmentation du budget marketing de 50% sur l'Afrique de l'Ouest",
                        "description": "Simulation de l'impact d'un doublement des investissements ciblés à Abidjan et Dakar.",
                        "variable": "Budget Marketing (+50%)",
                        "changeValue": "+$12,500",
                        "estimatedROI": 3.4,
                        "riskLevel": "Faible",
                        "confidenceScore": 89,
                        "recommendation": "Recommandé : Activer progressivement sur 30 jours.",
                        "projections": {
                            "revenueIncrease": "+$42,500 / trimestre",
                            "customerAcquisition": "+140 PME clientes",
                            "timeline": "2.5 Mois pour ROI positif"
                        }
                    }
                ]
            }

        # For Guest or ANY NEW Real User account: FRESH WORKSPACE FOR THEIR PME
        display_name = "Invité" if user_id == "user-guest" else user_id.replace("user-", "").capitalize()

        return {
            "user_id": user_id,
            "founder_brain": {
                "founderName": display_name if user_id != "user-guest" else "",
                "visionStatement": "",
                "riskTolerance": "Équilibré",
                "coreValues": [],
                "strategicStyle": "",
                "nonNegotiables": []
            },
            "company_brain": {
                "companyName": f"Mon Entreprise ({display_name})" if user_id != "user-guest" else "",
                "industry": "",
                "valueProposition": "",
                "mainProducts": [],
                "brandVoice": ""
            },
            "system_health": {
                "overallHealth": 100,
                "strategicScore": 100,
                "contentScore": 100,
                "seoScore": 100,
                "conversionScore": 100,
                "automationScore": 100,
                "brandConsistency": 100
            },
            "agents": [
                {
                    "id": "ceo-agent",
                    "name": "CEO Agent",
                    "role": "Directeur Exécutif Numérique",
                    "department": "c_suite",
                    "avatar": "🎯",
                    "status": "idle",
                    "confidence": 100,
                    "bio": "Orchestre le Conseil d'Administration IA et aligne la stratégie avec vos objectifs.",
                    "responsibilities": ["Arbitrage des priorités", "Coordination du Conseil IA", "Allocation des ressources"],
                    "lastQuote": "Prêt à configurer votre entreprise et lancer votre première Mission."
                },
                {
                    "id": "chief-of-staff",
                    "name": "Chief of Staff",
                    "role": "Bras Droit Organisationnel",
                    "department": "c_suite",
                    "avatar": "📋",
                    "status": "idle",
                    "confidence": 100,
                    "bio": "Transforme les décisions stratégiques en roadmaps exécutables.",
                    "responsibilities": ["Suivi des jalons", "Gestion des dépendances", "Journaux de bord"],
                    "lastQuote": "En attente de la première Mission de votre organisation."
                },
                {
                    "id": "cmo-agent",
                    "name": "Marketing Director",
                    "role": "Directeur Marketing & Récits",
                    "department": "marketing",
                    "avatar": "🚀",
                    "status": "idle",
                    "confidence": 100,
                    "bio": "Pilote les campagnes, l'acquisition et le positionnement de marque.",
                    "responsibilities": ["Stratégie de contenu", "Acquisition PME", "Storytelling"],
                    "lastQuote": "Prêt à lancer vos campagnes marketing."
                },
                {
                    "id": "cfo-agent",
                    "name": "Finance Director (CFO)",
                    "role": "Directeur Financier & ROI",
                    "department": "finance",
                    "avatar": "💎",
                    "status": "idle",
                    "confidence": 100,
                    "bio": "Garant du rendement du capital et des simulations financières.",
                    "responsibilities": ["Analyse CAC / LTV", "Budget", "Simulations ROI"],
                    "lastQuote": "Prêt à analyser le ROI de vos investissements."
                },
                {
                    "id": "risk-agent",
                    "name": "Risk & Governance Lead",
                    "role": "Gardien de la Conformité & Image",
                    "department": "governance",
                    "avatar": "🛡️",
                    "status": "idle",
                    "confidence": 100,
                    "bio": "Vérifie la conformité juridique et la cohérence de marque.",
                    "responsibilities": ["Compliance", "Protection de marque", "Audit"],
                    "lastQuote": "Prêt à auditer vos propositions stratégiques."
                }
            ],
            "missions": [],
            "decision_logs": [],
            "simulations": []
        }

    def save_user_field(self, user_id: str, field_name: str, data: Any):
        current = self.get_or_create_user_data(user_id)
        current[field_name] = data
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                f"UPDATE user_data SET {field_name} = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
                (json.dumps(data), user_id)
            )
            conn.commit()

    def update_missions(self, user_id: str, missions: List[Dict[str, Any]]):
        self.save_user_field(user_id, "missions", missions)

    def update_decision_logs(self, user_id: str, logs: List[Dict[str, Any]]):
        self.save_user_field(user_id, "decision_logs", logs)

    def update_simulations(self, user_id: str, simulations: List[Dict[str, Any]]):
        self.save_user_field(user_id, "simulations", simulations)

    def update_founder_brain(self, user_id: str, config: Dict[str, Any]):
        self.save_user_field(user_id, "founder_brain", config)

    def update_company_brain(self, user_id: str, config: Dict[str, Any]):
        self.save_user_field(user_id, "company_brain", config)

    def update_crm_contacts(self, user_id: str, contacts: List[Dict[str, Any]]):
        self.save_user_field(user_id, "crm_contacts", contacts)

    def add_finance_event(self, user_id: str, event_type: str, title: str, amount: float, is_cost: bool):
        stats = self.get_or_create_user_data(user_id).get("finance_stats", {"total_cost": 0, "total_revenue": 0, "events": []})

        event = {
            "id": f"fin-{uuid.uuid4().hex[:6]}",
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            "type": event_type,
            "title": title,
            "amount": amount,
            "is_cost": is_cost
        }

        if is_cost:
            stats["total_cost"] += amount
        else:
            stats["total_revenue"] += amount

        stats["events"].insert(0, event)
        stats["events"] = stats["events"][:50] # Keep last 50 events

        self.save_user_field(user_id, "finance_stats", stats)

user_store = UserStore()
