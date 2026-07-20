from pydantic import BaseModel, Field
from typing import List, Optional

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
    revenueIncrease: str
    customerAcquisition: str
    timeline: str
