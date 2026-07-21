from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid

from app.schemas.models import (
    MissionCreateRequest, 
    MissionResponse, 
    PlanStepSchema,
    DebateRequest, 
    DebateResponse, 
    SimulationRequest, 
    SimulationResponse
)
from app.agents.board import AIBoardEngine

app = FastAPI(
    title="MAAT Studio AI™ - Backend Agent Core API",
    version="2.4.0",
    description="API Moteur Cognitif & Conseil d'Administration IA pour MAAT Studio AI"
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

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "MAAT Studio AI™ Backend Core",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.4.0"
    }

@app.get("/api/v1/health")
def get_system_health():
    return {
        "overallHealth": 84,
        "strategicScore": 92,
        "contentScore": 88,
        "seoScore": 63,
        "conversionScore": 41,
        "automationScore": 95,
        "brandConsistency": 72
    }

@app.post("/api/v1/missions", response_model=MissionResponse)
def create_mission(req: MissionCreateRequest):
    """
    Génère une nouvelle Mission Métier découpée en 6 couches fonctionnelles.
    """
    mission_id = f"mission-{uuid.uuid4().hex[:8]}"
    
    plan_steps = [
        PlanStepSchema(
            id=f"step-1",
            department="Stratégie",
            action=f"Analyse contextuelle pour '{req.title}'",
            status="completed",
            assignedAgent="CEO Agent™"
        ),
        PlanStepSchema(
            id=f"step-2",
            department="Marketing",
            action="Conception des Hooks et messages de marque",
            status="in_progress",
            assignedAgent="Marketing Director™"
        ),
        PlanStepSchema(
            id=f"step-3",
            department="Finance",
            action="Contrôle du budget et prévision du CAC",
            status="pending",
            assignedAgent="Finance Director (CFO)™"
        )
    ]

    return MissionResponse(
        id=mission_id,
        title=req.title,
        category=req.category,
        status="active",
        healthScore=91,
        target=req.target,
        budget=req.budget,
        spentBudget=0.0,
        timeline=req.timeline,
        progress=15,
        confidenceScore=94,
        createdAt=datetime.utcnow().strftime("%Y-%m-%d"),
        description=req.objective,
        activeAgents=["ceo-agent", "chief-of-staff", "cmo-agent", "cfo-agent"],
        objective=req.objective,
        constraints=req.constraints,
        resources=["Product Bible V2", "Knowledge Graph", "Passerelle MAATFEED"],
        planSteps=plan_steps,
        learnings=["Mission générée avec succès par le Moteur Cognitif."]
    )

@app.post("/api/v1/debate", response_model=DebateResponse)
def run_board_debate(req: DebateRequest):
    """
    Exécute une session de débat inter-agents du Conseil d'Administration IA.
    """
    return board_engine.simulate_board_debate(req.topic)

@app.post("/api/v1/simulation", response_model=SimulationResponse)
def run_roi_simulation(req: SimulationRequest):
    """
    Calcule la simulation ROI What-If pour une décision stratégique.
    """
    sim_id = f"sim-{uuid.uuid4().hex[:6]}"
    return SimulationResponse(
        id=sim_id,
        title=req.title,
        description=f"Simulation de l'impact de la variable '{req.variable}'",
        variable=req.variable,
        changeValue=req.changeValue,
        estimatedROI=3.4,
        riskLevel="Faible",
        confidenceScore=89,
        recommendation="Recommandé : Exécution par jalons budgétaires de 30 jours.",
        revenueIncrease="+$32,000 / trimestre",
        customerAcquisition="+110 Clients",
        timeline="2 Mois"
    )

@app.get("/api/v1/maatfeed/signals")
def get_cultural_signals():
    """
    Récupère les signaux d'intelligence culturelle transmis par MAATFEED.
    """
    return {
        "signals": [
            {
                "id": "sig-384",
                "topic": "Automatisation Éthique & Onboarding Rapide",
                "volumeGrowth": "+140%",
                "sentiment": "Fortement Positif",
                "relevanceScore": 95
            },
            {
                "id": "sig-385",
                "topic": "Mobile Money & Paiements Locaux Afrique de l'Ouest",
                "volumeGrowth": "+88%",
                "sentiment": "Essentiel",
                "relevanceScore": 92
            }
        ]
    }

@app.get("/api/v1/graph/nodes")
def get_knowledge_graph_nodes():
    """
    Retourne l'ensemble des nœuds interconnectés du Knowledge Graph d'Entreprise.
    """
    from app.db.knowledge_graph import knowledge_graph_db
    return {
        "nodesCount": len(knowledge_graph_db.nodes),
        "nodes": knowledge_graph_db.nodes
    }

@app.get("/api/v1/departments")
def get_enterprise_departments():
    """
    Retourne la liste des départements d'entreprise gérés par l'AI Board.
    """
    return {
        "departments": [
            {"id": "dept-marketing", "name": "Marketing OS", "leadAgent": "Marketing Director™", "activeMissions": 3},
            {"id": "dept-sales", "name": "Sales OS", "leadAgent": "Chief Sales Agent™", "activeMissions": 2},
            {"id": "dept-product", "name": "Product OS", "leadAgent": "Chief Product Agent™", "activeMissions": 4},
            {"id": "dept-finance", "name": "Finance OS", "leadAgent": "Finance Director (CFO)™", "activeMissions": 2},
            {"id": "dept-hr", "name": "HR & People OS", "leadAgent": "People & Recruitment Agent™", "activeMissions": 1},
            {"id": "dept-legal", "name": "Legal & Governance OS", "leadAgent": "Risk & Governance Lead™", "activeMissions": 1}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
