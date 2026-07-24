from fastapi import FastAPI, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid
from typing import Optional, List

from app.schemas.models import (
    MissionCreateRequest, 
    MissionResponse, 
    PlanStepSchema,
    DebateRequest, 
    DebateResponse, 
    SimulationRequest, 
    SimulationResponse,
    FounderBrainSchema,
    CompanyBrainSchema,
    ToggleStepRequest,
    DecisionLogSchema,
    CRMContactSchema
)
from app.agents.board import AIBoardEngine, ExecutionAgent
from app.db.user_store import user_store
from app.services.form_service import form_service
from app.services.rag_service import rag_service
from app.services.maatfeed_service import maatfeed_service
from app.services.workflow_service import workflow_engine

app = FastAPI(
    title="MAAT OS - Backend Agent Core API",
    version="2.5.0",
    description="API Moteur Cognitif & Conseil d'Administration IA pour MAAT OS"
)

# CORS configuration for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

board_engine = AIBoardEngine()

def get_user_id(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)) -> str:
    return x_user_id or user_id or "user-guest"

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "MAAT OS Backend Core",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.5.0"
    }

@app.post("/api/auth/google/callback")
async def google_auth_callback(request: dict):
    """
    Exchange authorization code for access and refresh tokens.
    In a real implementation, this would use google-auth-oauthlib.
    """
    code = request.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Code missing")

    # Simulation of token exchange
    print(f"Received Google Auth Code: {code}")

    return {
        "status": "success",
        "message": "Tokens exchanged and stored successfully",
        "scopes": ["drive.readonly", "gmail.readonly"]
    }

@app.get("/api/v1/user-data")
def get_all_user_data(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    return user_store.get_or_create_user_data(uid)

@app.get("/api/v1/health")
def get_system_health(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data["system_health"]

@app.get("/api/v1/missions")
def get_missions(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data["missions"]

@app.post("/api/v1/missions", response_model=MissionResponse)
def create_mission(
    req: MissionCreateRequest,
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None)
):
    uid = get_user_id(x_user_id, user_id)
    user_data = user_store.get_or_create_user_data(uid)
    founder_name = user_data["founder_brain"].get("founderName", "Dirigeant")

    mission_id = f"mission-{uid}-{uuid.uuid4().hex[:6]}"
    
    plan_steps = [
        PlanStepSchema(
            id="step-1",
            department="Stratégie",
            action=f"Analyse contextuelle pour '{req.title}' par le CEO Agent",
            status="completed",
            assignedAgent="CEO Agent"
        ),
        PlanStepSchema(
            id="step-2",
            department="Marketing",
            action="Conception des Hooks et messages de marque",
            status="in_progress",
            assignedAgent="Marketing Director"
        ),
        PlanStepSchema(
            id="step-3",
            department="Finance",
            action="Contrôle du budget et prévision du CAC",
            status="pending",
            assignedAgent="Finance Director (CFO)"
        )
    ]

    new_mission = {
        "id": mission_id,
        "title": req.title,
        "category": req.category,
        "status": "active",
        "healthScore": 92,
        "target": req.target,
        "budget": req.budget,
        "spentBudget": 0.0,
        "timeline": req.timeline,
        "progress": 15,
        "confidenceScore": 94,
        "createdAt": datetime.utcnow().strftime("%Y-%m-%d"),
        "description": req.objective,
        "activeAgents": ["ceo-agent", "chief-of-staff", "cmo-agent", "cfo-agent"],
        "objective": req.objective,
        "constraints": req.constraints,
        "resources": ["Product Bible V2", "Knowledge Graph", "Passerelle MAATFEED"],
        "planSteps": [step.dict() for step in plan_steps],
        "learnings": ["Mission générée par le Moteur Cognitif 6-Couches."]
    }

    current_missions = user_data["missions"]
    current_missions.insert(0, new_mission)
    user_store.update_missions(uid, current_missions)

    # Add log entry
    new_log = {
        "id": f"dec-{uuid.uuid4().hex[:6]}",
        "timestamp": datetime.utcnow().strftime("%H:%M UTC"),
        "title": f"Création de la Mission : '{req.title}'",
        "agentId": "ceo-agent",
        "agentName": "CEO Agent",
        "category": req.category,
        "confidenceScore": 94,
        "reasoning": f"Mission générée par le Moteur Cognitif pour le Founder Brain ({founder_name}).",
        "status": "executing",
        "impacts": [f"Budget alloué : ${req.budget}", f"Délai : {req.timeline}"]
    }
    current_logs = user_data["decision_logs"]
    current_logs.insert(0, new_log)
    user_store.update_decision_logs(uid, current_logs)

    return new_mission

@app.get("/api/v1/logs")
def get_decision_logs(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data["decision_logs"]

@app.get("/api/v1/simulations")
def get_simulations(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data["simulations"]

@app.post("/api/v1/simulation", response_model=SimulationResponse)
def run_roi_simulation(
    req: SimulationRequest,
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None)
):
    uid = get_user_id(x_user_id, user_id)
    user_data = user_store.get_or_create_user_data(uid)

    sim_id = f"sim-{uuid.uuid4().hex[:6]}"
    new_sim = {
        "id": sim_id,
        "title": req.title,
        "description": f"Simulation de l'impact de la variable '{req.variable}'",
        "variable": req.variable,
        "changeValue": req.changeValue,
        "estimatedROI": 3.4,
        "riskLevel": "Faible",
        "confidenceScore": 89,
        "recommendation": "Recommandé : Exécution par jalons budgétaires de 30 jours.",
        "projections": {
            "revenueIncrease": "+$32,000 / trimestre",
            "customerAcquisition": "+110 Clients",
            "timeline": "2 Mois"
        }
    }

    current_sims = user_data["simulations"]
    current_sims.insert(0, new_sim)
    user_store.update_simulations(uid, current_sims)

    return new_sim

@app.get("/api/v1/brain/founder")
def get_founder_brain(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data["founder_brain"]

@app.put("/api/v1/brain/founder")
def update_founder_brain(
    config: FounderBrainSchema,
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None)
):
    uid = get_user_id(x_user_id, user_id)
    user_store.update_founder_brain(uid, config.dict())
    return config

@app.get("/api/v1/brain/company")
def get_company_brain(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data["company_brain"]

@app.put("/api/v1/brain/company")
def update_company_brain(
    config: CompanyBrainSchema,
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None)
):
    uid = get_user_id(x_user_id, user_id)
    user_store.update_company_brain(uid, config.dict())
    return config

@app.get("/api/v1/agents")
def get_agents(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data["agents"]

@app.post("/api/v1/debate", response_model=DebateResponse)
def run_board_debate(
    req: DebateRequest,
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None)
):
    uid = get_user_id(x_user_id, user_id)
    user_data = user_store.get_or_create_user_data(uid)
    
    debate_res = board_engine.simulate_board_debate(
        req.topic,
        founder_brain=user_data.get("founder_brain"),
        company_brain=user_data.get("company_brain"),
        user_id=uid
    )

    # Save decision log to user store
    new_log = {
        "id": f"dec-{uuid.uuid4().hex[:6]}",
        "timestamp": datetime.utcnow().strftime("%H:%M UTC"),
        "title": f"Arbitrage Conseil IA : '{req.topic}'",
        "agentId": "ceo-agent",
        "agentName": "CEO Agent",
        "category": "Arbitrage Conseil",
        "confidenceScore": debate_res.confidenceScore,
        "reasoning": debate_res.finalDecision,
        "status": "approved",
        "impacts": [f"Décision validée à {debate_res.confidenceScore}% de confiance"]
    }
    current_logs = user_data["decision_logs"]
    current_logs.insert(0, new_log)
    user_store.update_decision_logs(uid, current_logs)

    return debate_res

@app.get("/api/v1/maatfeed/signals")
def get_cultural_signals():
    signals = maatfeed_service.get_global_signals()
    return {"signals": signals}

@app.get("/api/v1/maatfeed/analyze/{signal_id}")
def analyze_market_signal(signal_id: str, x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    return maatfeed_service.analyze_opportunity(uid, signal_id)

@app.get("/api/v1/graph/nodes")
def get_knowledge_graph_nodes():
    from app.db.knowledge_graph import knowledge_graph_db
    return {
        "nodesCount": len(knowledge_graph_db.nodes),
        "nodes": knowledge_graph_db.nodes
    }

@app.get("/api/v1/departments")
def get_enterprise_departments():
    return {
        "departments": [
            {"id": "dept-marketing", "name": "Marketing OS", "leadAgent": "Marketing Director", "activeMissions": 3},
            {"id": "dept-sales", "name": "Sales OS", "leadAgent": "Chief Sales Agent", "activeMissions": 2},
            {"id": "dept-product", "name": "Product OS", "leadAgent": "Chief Product Agent", "activeMissions": 4},
            {"id": "dept-finance", "name": "Finance OS", "leadAgent": "Finance Director (CFO)", "activeMissions": 2},
            {"id": "dept-hr", "name": "HR & People OS", "leadAgent": "People & Recruitment Agent", "activeMissions": 1},
            {"id": "dept-legal", "name": "Legal & Governance OS", "leadAgent": "Risk & Governance Lead", "activeMissions": 1}
        ]
    }

@app.get("/api/v1/crm/contacts")
def get_crm_contacts(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data.get("crm_contacts", [])

@app.post("/api/v1/crm/contacts", response_model=CRMContactSchema)
def create_crm_contact(
    contact: CRMContactSchema,
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None)
):
    uid = get_user_id(x_user_id, user_id)
    user_data = user_store.get_or_create_user_data(uid)
    current_contacts = user_data.get("crm_contacts", [])
    current_contacts.insert(0, contact.dict())
    user_store.update_crm_contacts(uid, current_contacts)

    # --- Autopilot Trigger ---
    # On transmet l'événement au moteur de workflow pour analyse et exécution automatique
    workflow_engine.process_event(uid, "LEAD_SUBMITTED", {
        "name": contact.name,
        "company": contact.company,
        "email": contact.email,
        "phone": contact.phone,
        "estimated_budget_xof": contact.estimatedBudget,
        "confidence_score": contact.aiAnalysis.qualificationScore
    })

    return contact

@app.put("/api/v1/crm/contacts/{contact_id}/status")
def update_crm_contact_status(
    contact_id: str,
    new_status: str,
    x_user_id: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None)
):
    uid = get_user_id(x_user_id, user_id)
    user_data = user_store.get_or_create_user_data(uid)
    contacts = user_data.get("crm_contacts", [])
    updated = None
    for c in contacts:
        if c["id"] == contact_id:
            c["status"] = new_status
            updated = c
            break

    if not updated:
        raise HTTPException(status_code=404, detail="Contact CRM introuvable")

    # --- Finance OS Revenue Trigger ---
    if new_status == "client":
        # On enregistre le revenu dans le Finance OS
        amount = updated.get("estimatedBudget", 0)
        user_store.add_finance_event(uid, "CRM_CONVERSION", f"Conversion Client : {updated.get('name')}", float(amount), False)

    user_store.update_crm_contacts(uid, contacts)
    return updated

# --- New Roadmap Endpoints ---

execution_agent = ExecutionAgent()

@app.post("/api/execute-action")
async def execute_action(request: dict):
    action_id = request.get("action_id")
    action_type = request.get("action_type")
    payload = request.get("payload", {})

    result = execution_agent.execute_action(action_id, action_type, payload)
    return result

@app.post("/api/v1/forms")
async def create_form(request: dict, x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    title = request.get("title", "Nouveau Formulaire")
    fields = request.get("fields", [])
    form_id = form_service.create_form_schema(uid, title, fields)
    return {"form_id": form_id}

@app.get("/api/v1/forms")
async def get_forms(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data.get("public_forms", [])

@app.post("/api/v1/ingest")
async def ingest_document(request: dict, x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    file_name = request.get("file_name", "document.txt")
    content = request.get("content", "")
    brain_type = request.get("brain_type", "Company Brain")

    doc_id = rag_service.ingest_document(uid, file_name, content, brain_type)
    return {"doc_id": doc_id, "status": "indexed"}

@app.get("/api/v1/knowledge")
def get_knowledge_sources(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data.get("ingested_sources", [])

# --- Autopilot Endpoints ---

@app.get("/api/v1/autopilot/settings")
def get_autopilot_settings(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data.get("autopilot_settings", {
        "enabled": False,
        "min_confidence": 95,
        "max_budget_xof": 50000,
        "currency": "XOF",
        "trust_level": 0
    })

@app.put("/api/v1/autopilot/settings")
def update_autopilot_settings(settings: dict, x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    user_store.save_user_field(uid, "autopilot_settings", settings)
    return settings

@app.get("/api/v1/autopilot/activity")
def get_autopilot_activity(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data.get("autopilot_activity", [])

# --- Finance OS Endpoints ---

@app.get("/api/v1/finance/stats")
def get_finance_stats(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data.get("finance_stats", {"total_cost": 0, "total_revenue": 0, "events": []})

# --- Market Brain Endpoints ---

@app.get("/api/v1/market/competitors/signals")
def get_competitor_signals(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    return maatfeed_service.get_competitor_signals(uid)

# --- HR Expansion Endpoints ---

@app.post("/api/v1/hr/jobs")
def create_job_posting(request: dict, x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    role_title = request.get("role_title", "Nouveau Poste")
    from app.services.hr_service import hr_service
    return hr_service.generate_job_description(uid, role_title)

@app.get("/api/v1/hr/data")
def get_hr_data(x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    data = user_store.get_or_create_user_data(uid)
    return data.get("hr_data", {"jobs": [], "candidates": [], "onboarding_plans": []})

@app.post("/api/v1/hr/onboarding")
def create_onboarding(request: dict, x_user_id: Optional[str] = Header(None), user_id: Optional[str] = Query(None)):
    uid = get_user_id(x_user_id, user_id)
    candidate_name = request.get("candidate_name", "Recrue")
    role = request.get("role", "Collaborateur")
    from app.services.hr_service import hr_service
    return hr_service.generate_onboarding_plan(uid, candidate_name, role)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
