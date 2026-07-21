from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PlanStepSchema(BaseModel):
    id: str
    department: str
    action: str
    status: str
    assignedAgent: str

class MissionCreateRequest(BaseModel):
    title: str
    category: str
    target: str
    budget: float
    timeline: str
    objective: str
    constraints: List[str]

class MissionResponse(BaseModel):
    id: str
    title: str
    category: str
    status: str
    healthScore: int
    target: str
    budget: float
    spentBudget: float
    timeline: str
    progress: int
    confidenceScore: int
    createdAt: str
    description: str
    activeAgents: List[str]
    objective: str
    constraints: List[str]
    resources: List[str]
    planSteps: List[PlanStepSchema]
    learnings: List[str]

class ToggleStepRequest(BaseModel):
    missionId: str
    stepId: str

class DebateRequest(BaseModel):
    topic: str
    involvedAgents: Optional[List[str]] = None

class DebateTurn(BaseModel):
    agent: str
    message: str
    confidence: int

class DebateResponse(BaseModel):
    topic: str
    turns: List[DebateTurn]
    finalDecision: str
    confidenceScore: int

class SimulationRequest(BaseModel):
    title: str
    variable: str
    changeValue: str

class SimulationResponse(BaseModel):
    id: str
    title: str
    description: str
    variable: str
    changeValue: str
    estimatedROI: float
    riskLevel: str
    confidenceScore: int
    recommendation: str
    projections: Dict[str, str]

class FounderBrainSchema(BaseModel):
    founderName: str
    visionStatement: str
    riskTolerance: str
    coreValues: List[str]
    strategicStyle: str
    nonNegotiables: List[str]

class CompanyBrainSchema(BaseModel):
    companyName: str
    industry: str
    valueProposition: str
    mainProducts: List[str]
    brandVoice: str

class DecisionLogSchema(BaseModel):
    id: str
    timestamp: str
    title: str
    agentId: str
    agentName: str
    category: str
    confidenceScore: int
    reasoning: str
    status: str
    impacts: List[str]

class CRMContactAIAnalysisSchema(BaseModel):
    qualificationScore: int
    buyerIntentScore: int
    recommendedAgent: str
    nextAction: str
    keyInsights: List[str]

class CRMContactSchema(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    company: str
    industry: str
    status: str
    estimatedBudget: float
    tags: List[str]
    createdAt: str
    lastContactDate: str
    notes: str
    aiAnalysis: CRMContactAIAnalysisSchema

