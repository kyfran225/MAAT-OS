import React, { useState } from 'react';
import { AppView, Mission, DecisionLog, SimulationScenario, FounderBrainConfig, CompanyBrainConfig, SystemHealth } from './types';
import { 
  INITIAL_SYSTEM_HEALTH, 
  INITIAL_AGENTS, 
  INITIAL_MISSIONS, 
  INITIAL_DECISION_LOGS, 
  INITIAL_SIMULATIONS, 
  INITIAL_FOUNDER_BRAIN, 
  INITIAL_COMPANY_BRAIN 
} from './data/mockData';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

import { HQDashboard } from './components/dashboard/HQDashboard';
import { MissionsView } from './components/missions/MissionsView';
import { CreateMissionModal } from './components/missions/CreateMissionModal';
import { BoardView } from './components/agents/BoardView';
import { BrainConfigurator } from './components/brain/BrainConfigurator';
import { SimulationView } from './components/simulation/SimulationView';
import { JournalBoard } from './components/logs/JournalBoard';

import { BackendService } from './services/backendService';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  // Application States
  const [systemHealth] = useState<SystemHealth>(INITIAL_SYSTEM_HEALTH);
  const [agents] = useState(INITIAL_AGENTS);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [decisionLogs, setDecisionLogs] = useState<DecisionLog[]>(INITIAL_DECISION_LOGS);
  const [simulations, setSimulations] = useState<SimulationScenario[]>(INITIAL_SIMULATIONS);
  const [founderConfig, setFounderConfig] = useState<FounderBrainConfig>(INITIAL_FOUNDER_BRAIN);
  const [companyConfig, setCompanyConfig] = useState<CompanyBrainConfig>(INITIAL_COMPANY_BRAIN);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Actions
  const handleCreateMission = async (newMissionData: {
    title: string;
    category: any;
    target: string;
    budget: number;
    timeline: string;
    objective: string;
    constraints: string[];
  }) => {
    // Attempt live creation via Python FastAPI Backend Engine
    const backendMission = await BackendService.getInstance().createMission(newMissionData);

    const createdMission: Mission = backendMission || {
      id: `mission-${Date.now()}`,
      title: newMissionData.title,
      category: newMissionData.category,
      status: 'active',
      healthScore: 92,
      target: newMissionData.target,
      budget: newMissionData.budget,
      spentBudget: 0,
      timeline: newMissionData.timeline,
      progress: 10,
      confidenceScore: 94,
      createdAt: new Date().toISOString().split('T')[0],
      description: newMissionData.objective,
      activeAgents: ['ceo-agent', 'chief-of-staff', 'cmo-agent'],
      objective: newMissionData.objective,
      constraints: newMissionData.constraints,
      resources: ['Product Bible V2', 'Knowledge Graph'],
      planSteps: [
        { id: 'step-1', department: 'Stratégie', action: 'Analyse initiale du contexte par le CEO Agent', status: 'completed', assignedAgent: 'CEO Agent™' },
        { id: 'step-2', department: 'Marketing', action: 'Génération du plan de contenu & Hooks', status: 'in_progress', assignedAgent: 'Marketing Director™' },
        { id: 'step-3', department: 'Finance', action: 'Validation des seuils de ROI & budget', status: 'pending', assignedAgent: 'Finance Director (CFO)™' }
      ],
      learnings: ['Mission initialisée avec le Moteur Cognitif 6-Couches.']
    };

    setMissions([createdMission, ...missions]);

    // Add a decision log entry
    const newLog: DecisionLog = {
      id: `dec-${Date.now()}`,
      timestamp: 'À l\'instant',
      title: `Création de la Mission : "${newMissionData.title}"`,
      agentId: 'ceo-agent',
      agentName: 'CEO Agent™',
      category: newMissionData.category,
      confidenceScore: createdMission.confidenceScore || 94,
      reasoning: `Nouvelle Mission™ générée par le Moteur Cognitif (Founder Brain: ${founderConfig.founderName}).`,
      status: 'executing',
      impacts: [`Budget alloué : $${newMissionData.budget}`, `Délai : ${newMissionData.timeline}`]
    };

    setDecisionLogs([newLog, ...decisionLogs]);
    setCurrentView('missions');
  };

  const handleTogglePlanStep = (missionId: string, stepId: string) => {
    setMissions(missions.map(m => {
      if (m.id !== missionId) return m;
      const updatedSteps = m.planSteps.map(s => {
        if (s.id !== stepId) return s;
        return {
          ...s,
          status: (s.status === 'completed' ? 'in_progress' : 'completed') as any
        };
      });

      const completedCount = updatedSteps.filter(s => s.status === 'completed').length;
      const newProgress = Math.round((completedCount / updatedSteps.length) * 100);

      return {
        ...m,
        planSteps: updatedSteps,
        progress: newProgress
      };
    }));
  };

  const handleRunNewSimulation = async (title: string, variable: string, budgetChange: string) => {
    const backendSim = await BackendService.getInstance().runSimulation({
      title,
      variable,
      changeValue: budgetChange
    });

    const newScen: SimulationScenario = backendSim || {
      id: `sim-${Date.now()}`,
      title,
      description: `Simulation personnalisée déclenchée le ${new Date().toLocaleDateString()}`,
      variable,
      changeValue: budgetChange,
      estimatedROI: 3.1,
      riskLevel: 'Faible',
      confidenceScore: 91,
      recommendation: 'Recommandé par le Decision Engine. Risque limité et retour positif sous 60 jours.',
      projections: {
        revenueIncrease: '+$24,000 / trimestre',
        customerAcquisition: '+85 Clients',
        timeline: '2 Mois'
      }
    };

    setSimulations([newScen, ...simulations]);
  };

  const handleExecuteRecommendation = (recommendationTitle: string) => {
    handleCreateMission({
      title: `Mission Recommandée : ${recommendationTitle}`,
      category: 'strategy',
      target: 'Résoudre les frictions de conversion PME et augmenter la rétention',
      budget: 15000,
      timeline: '30 Jours',
      objective: 'Optimiser le parcours de première expérience pour transformer l\'activation en abonnement permanent.',
      constraints: ['Respect du Founder Brain', 'Zéro friction UI']
    });
  };

  const activeMissionsCount = missions.filter(m => m.status === 'active').length;

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        systemHealth={systemHealth}
        founderConfig={founderConfig}
        activeMissionsCount={activeMissionsCount}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex w-full max-w-[1800px] mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          activeMissionsCount={activeMissionsCount}
          unresolvedDecisionsCount={decisionLogs.length}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentView === 'dashboard' && (
            <HQDashboard
              systemHealth={systemHealth}
              missions={missions}
              decisionLogs={decisionLogs}
              agents={agents}
              onOpenCreateMission={() => setIsCreateModalOpen(true)}
              setCurrentView={setCurrentView}
              onExecuteRecommendation={handleExecuteRecommendation}
            />
          )}

          {currentView === 'missions' && (
            <MissionsView
              missions={missions}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onTogglePlanStep={handleTogglePlanStep}
            />
          )}

          {currentView === 'agents' && (
            <BoardView
              agents={agents}
              onTriggerDebate={(topic) => console.log('Debate on:', topic)}
            />
          )}

          {currentView === 'brains' && (
            <BrainConfigurator
              founderConfig={founderConfig}
              companyConfig={companyConfig}
              onSaveFounderConfig={setFounderConfig}
              onSaveCompanyConfig={setCompanyConfig}
            />
          )}

          {currentView === 'simulation' && (
            <SimulationView
              scenarios={simulations}
              onRunNewSimulation={handleRunNewSimulation}
            />
          )}

          {currentView === 'journal' && (
            <JournalBoard logs={decisionLogs} />
          )}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeMissionsCount={activeMissionsCount}
      />

      {/* Create Mission Modal */}
      <CreateMissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateMission}
      />
    </div>
  );
};
