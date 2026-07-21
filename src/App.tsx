import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Mission, DecisionLog, SimulationScenario, FounderBrainConfig, CompanyBrainConfig, SystemHealth, Agent, CRMContact, CRMContactStatus, FinanceStats, MarketSignal, Competitor, HRData } from './types';
import { MAATAuthService, isRealName } from './services/maatAuthService';

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
import { SalesOSModule } from './components/crm/SalesOSModule';
import { ActionGeneratorModule } from './components/actions/ActionGeneratorModule';
import { HealthAuditModule } from './components/audit/HealthAuditModule';
import { ExportCenter } from './components/export/ExportCenter';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DeepRAGChat } from './components/brain/DeepRAGChat';
import { KnowledgeGraphExplorer } from './components/graph/KnowledgeGraphExplorer';
import { ConnectorSettings } from './components/settings/ConnectorSettings';
import { AutopilotSettings } from './components/settings/AutopilotSettings';
import { FinanceOSModule } from './components/finance/FinanceOSModule';
import { MarketBrainModule } from './components/market/MarketBrainModule';
import { HROSModule } from './components/hr/HROSModule';

import { BackendService } from './services/backendService';
import { INITIAL_AGENTS, INITIAL_CRM_CONTACTS, DEMO_DATASET } from './data/mockData';

const DEFAULT_GUEST_HEALTH: SystemHealth = {
  overallHealth: 100,
  strategicScore: 100,
  contentScore: 100,
  seoScore: 100,
  conversionScore: 100,
  automationScore: 100,
  brandConsistency: 100,
};

// Build a founder default seeded with Google identity only when a real name is available
function buildDefaultFounder(): FounderBrainConfig {
  const googleUser = MAATAuthService.getInstance().getCurrentUser();
  const name = googleUser?.displayName || '';
  return {
    founderName:     isRealName(name) ? name : '',
    visionStatement: '',
    riskTolerance:   'Equilibre' as any,
    coreValues:      [],
    strategicStyle:  '',
    nonNegotiables:  [],
  };
}

const DEFAULT_GUEST_COMPANY: CompanyBrainConfig = {
  companyName: '',
  industry: '',
  valueProposition: '',
  mainProducts: [],
  brandVoice: '',
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  const [activeUserId, setActiveUserId] = useState<string>(
    MAATAuthService.getInstance().getCurrentUser()?.userId || 'user-guest'
  );

  // Application States
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(DEFAULT_GUEST_HEALTH);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [decisionLogs, setDecisionLogs] = useState<DecisionLog[]>([]);
  const [simulations, setSimulations] = useState<SimulationScenario[]>([]);
  const [founderConfig, setFounderConfig] = useState<FounderBrainConfig>(buildDefaultFounder());
  const [companyConfig, setCompanyConfig] = useState<CompanyBrainConfig>(DEFAULT_GUEST_COMPANY);
  const [crmContacts, setCrmContacts] = useState<CRMContact[]>(INITIAL_CRM_CONTACTS);
  const [isAutopilotEnabled, setIsAutopilotEnabled] = useState(false);
  const [financeStats, setFinanceStats] = useState<FinanceStats>({ total_cost: 0, total_revenue: 0, events: [] });
  const [hrData, setHrData] = useState<HRData>({ jobs: [], candidates: [], onboarding_plans: [] });

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding wizard for authenticated users who haven't configured their brain yet
  useEffect(() => {
    const currentUser = MAATAuthService.getInstance().getCurrentUser();
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (currentUser && currentUser.userId !== 'user-demo') {
      const hasSeenOnboarding = localStorage.getItem(`maat_onboarding_done_${currentUser.userId}`);
      if (!hasSeenOnboarding) {
        timer = setTimeout(() => setShowOnboarding(true), 800);
      }
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [activeUserId]);

  // Load User Data from Backend Engine
  const loadUserData = useCallback(async () => {
    const currentUser = MAATAuthService.getInstance().getCurrentUser();

    // STRICT GUEST MODE CHECK: If not authenticated, force 100% empty workspace
    if (!currentUser) {
      setSystemHealth(DEFAULT_GUEST_HEALTH);
      setMissions([]);
      setDecisionLogs([]);
      setSimulations([]);
      setFounderConfig(buildDefaultFounder());
      setCompanyConfig(DEFAULT_GUEST_COMPANY);
      setCrmContacts([]);
      return;
    }

    if (currentUser.userId === 'user-demo') {
      setCrmContacts(DEMO_DATASET.crmContacts);
    }

    const backendService = BackendService.getInstance();
    const data = await backendService.getUserData();
    if (data) {
      if (data.system_health) setSystemHealth(data.system_health);
      if (data.agents && data.agents.length > 0) setAgents(data.agents);
      setMissions(data.missions || []);
      setDecisionLogs(data.decision_logs || []);
      setSimulations(data.simulations || []);
      if (data.founder_brain) {
        // Sanitize the founderName: if the backend stored a token/garbage, use the
        // real Google display name instead (or leave empty for the user to fill in).
        const googleName = MAATAuthService.getInstance().getCurrentUser()?.displayName || '';
        const backendName = data.founder_brain.founderName || '';
        const cleanName = isRealName(backendName)
          ? backendName
          : isRealName(googleName) ? googleName : '';
        setFounderConfig({ ...data.founder_brain, founderName: cleanName });
      }
      if (data.company_brain) setCompanyConfig(data.company_brain);
      if (data.crm_contacts) setCrmContacts(data.crm_contacts);
      if (data.autopilot_settings) setIsAutopilotEnabled(data.autopilot_settings.enabled || false);
      if (data.finance_stats) setFinanceStats(data.finance_stats);
      if (data.hr_data) setHrData(data.hr_data);
    } else if (currentUser.userId !== 'user-demo') {
      setSystemHealth(DEFAULT_GUEST_HEALTH);
      setMissions([]);
      setDecisionLogs([]);
      setSimulations([]);
      setFounderConfig(buildDefaultFounder());
      setCompanyConfig(DEFAULT_GUEST_COMPANY);
      setCrmContacts([]);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData, activeUserId]);

  // Check periodically for SSO / Auth user changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentUser = MAATAuthService.getInstance().getCurrentUser();
      const currentUserId = currentUser ? currentUser.userId : 'user-guest';
      if (currentUserId !== activeUserId) {
        setActiveUserId(currentUserId);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [activeUserId]);

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
    const backendMission = await BackendService.getInstance().createMission(newMissionData);

    if (backendMission) {
      await loadUserData();
    } else {
      const createdMission: Mission = {
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
          { id: 'step-1', department: 'Stratégie', action: 'Analyse initiale du contexte par le CEO Agent', status: 'completed', assignedAgent: 'CEO Agent' },
          { id: 'step-2', department: 'Marketing', action: 'Génération du plan de contenu et Hooks', status: 'in_progress', assignedAgent: 'Marketing Director' },
          { id: 'step-3', department: 'Finance', action: 'Validation des seuils de ROI et budget', status: 'pending', assignedAgent: 'Finance Director (CFO)' }
        ],
        learnings: ['Mission initialisée avec le Moteur Cognitif 6-Couches.']
      };

      setMissions([createdMission, ...missions]);

      const newLog: DecisionLog = {
        id: `dec-${Date.now()}`,
        timestamp: 'À l\'instant',
        title: `Création de la Mission : "${newMissionData.title}"`,
        agentId: 'ceo-agent',
        agentName: 'CEO Agent',
        category: newMissionData.category,
        confidenceScore: createdMission.confidenceScore || 94,
        reasoning: `Nouvelle Mission générée par le Moteur Cognitif (Founder Brain: ${founderConfig.founderName || 'Dirigeant'}).`,
        status: 'executing',
        impacts: [`Budget alloué : $${newMissionData.budget}`, `Délai : ${newMissionData.timeline}`]
      };

      setDecisionLogs([newLog, ...decisionLogs]);
    }
    setCurrentView('missions');
  };

  const handleTogglePlanStep = async (missionId: string, stepId: string) => {
    const updatedMission = await BackendService.getInstance().toggleMissionStep(missionId, stepId);
    if (updatedMission) {
      setMissions(missions.map(m => m.id === missionId ? updatedMission : m));
    } else {
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
    }
  };

  const handleRunNewSimulation = async (title: string, variable: string, budgetChange: string) => {
    const backendSim = await BackendService.getInstance().runSimulation({
      title,
      variable,
      changeValue: budgetChange
    });

    if (backendSim) {
      setSimulations([backendSim, ...simulations]);
    } else {
      const newScen: SimulationScenario = {
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
    }
  };

  const handleSaveFounderConfig = async (newConfig: FounderBrainConfig) => {
    setFounderConfig(newConfig);
    await BackendService.getInstance().saveFounderBrain(newConfig);
  };

  const handleSaveCompanyConfig = async (newConfig: CompanyBrainConfig) => {
    setCompanyConfig(newConfig);
    await BackendService.getInstance().saveCompanyBrain(newConfig);
  };

  const handleBoardDebateTriggered = async (_topic: string) => {
    await loadUserData();
    // Refresh finance stats after a debate (cost incurred)
    const stats = await BackendService.getInstance().getFinanceStats();
    if (stats) setFinanceStats(stats);
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

  const handleAddContact = (contact: CRMContact) => {
    setCrmContacts([contact, ...crmContacts]);
  };

  const handleUpdateContactStatus = async (id: string, newStatus: CRMContactStatus) => {
    const updated = await BackendService.getInstance().updateCRMContactStatus(id, newStatus);
    if (updated) {
      setCrmContacts(crmContacts.map(c => c.id === id ? updated : c));
      // Refresh finance stats if status changed to client
      if (newStatus === 'client') {
        const stats = await BackendService.getInstance().getFinanceStats();
        if (stats) setFinanceStats(stats);
      }
    } else {
      setCrmContacts(crmContacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
    }
  };

  const activeMissionsCount = missions.filter(m => m.status === 'active').length;

  const handleOnboardingComplete = async (
    founder: FounderBrainConfig,
    company: CompanyBrainConfig,
    firstMission: { title: string; category: any; target: string; budget: number; timeline: string; objective: string; constraints: string[] } | null
  ) => {
    setShowOnboarding(false);
    await handleSaveFounderConfig(founder);
    await handleSaveCompanyConfig(company);
    if (firstMission) {
      await handleCreateMission(firstMission);
    }
    const currentUser = MAATAuthService.getInstance().getCurrentUser();
    if (currentUser) {
      localStorage.setItem(`maat_onboarding_done_${currentUser.userId}`, '1');
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    const currentUser = MAATAuthService.getInstance().getCurrentUser();
    if (currentUser) {
      localStorage.setItem(`maat_onboarding_done_${currentUser.userId}`, '1');
    }
  };

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
          isAutopilotEnabled={isAutopilotEnabled}
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
              financeStats={financeStats}
            />
          )}

          {currentView === 'audit' && (
            <HealthAuditModule
              onAddMissionFromAudit={(title, category, target, budget, objective) => handleCreateMission({
                title,
                category: category as any,
                target,
                budget,
                timeline: '30 Jours',
                objective,
                constraints: ['Budget plafonné', 'Exécution urgente par l\'IA']
              })}
            />
          )}

          {currentView === 'missions' && (
            <MissionsView
              missions={missions}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onTogglePlanStep={handleTogglePlanStep}
            />
          )}

          {currentView === 'actions' && (
            <ActionGeneratorModule
              contacts={crmContacts}
              onAddMissionFromAction={(title, desc) => handleCreateMission({
                title,
                category: 'sales',
                target: title,
                budget: 15000,
                timeline: '30 Jours',
                objective: desc,
                constraints: ['Budget maîtrisé', 'Respect du Founder Brain']
              })}
            />
          )}

          {currentView === 'agents' && (
            <BoardView
              agents={agents}
              onTriggerDebate={handleBoardDebateTriggered}
            />
          )}

          {currentView === 'sales_os' && (
            <SalesOSModule
              contacts={crmContacts}
              onAddContact={handleAddContact}
              onUpdateContactStatus={handleUpdateContactStatus}
            />
          )}

          {currentView === 'brains' && (
            <BrainConfigurator
              founderConfig={founderConfig}
              companyConfig={companyConfig}
              onSaveFounderConfig={handleSaveFounderConfig}
              onSaveCompanyConfig={handleSaveCompanyConfig}
            />
          )}

          {currentView === 'simulation' && (
            <SimulationView
              scenarios={simulations}
              onRunNewSimulation={handleRunNewSimulation}
              onExecuteRecommendation={handleExecuteRecommendation}
            />
          )}

          {currentView === 'journal' && (
            <JournalBoard logs={decisionLogs} />
          )}

          {currentView === 'export_center' && (
            <ExportCenter
              missions={missions}
              systemHealth={systemHealth}
              founderConfig={founderConfig}
              companyConfig={companyConfig}
              crmContacts={crmContacts}
              simulations={simulations}
              decisionLogs={decisionLogs}
              agents={agents}
            />
          )}

          {currentView === 'rag_chat' && (
            <DeepRAGChat />
          )}

          {currentView === 'onboarding' && (
            <OnboardingWizard
              onComplete={(config) => {
                handleSaveFounderConfig(config);
                setCurrentView('dashboard');
              }}
            />
          )}

          {currentView === 'graph' && (
            <KnowledgeGraphExplorer />
          )}

          {currentView === 'settings' && (
            <ConnectorSettings />
          )}

          {currentView === 'autopilot' && (
            <AutopilotSettings onToggle={(enabled) => setIsAutopilotEnabled(enabled)} />
          )}

          {currentView === 'finance_os' && (
            <FinanceOSModule stats={financeStats} />
          )}

          {currentView === 'market_brain' && (
            <MarketBrainModule
              companyConfig={companyConfig}
              onAddMission={(title, objective) => handleCreateMission({
                title,
                category: 'strategy',
                target: `Réponse offensive à ${title}`,
                budget: 10000,
                timeline: '30 Jours',
                objective,
                constraints: ['Budget limité', 'Alignement Founder Brain']
              })}
            />
          )}

          {currentView === 'hr_os' && (
            <HROSModule
              hrData={hrData}
              founderConfig={founderConfig}
              onCreateJob={async (title) => {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/hr/jobs`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'X-User-Id': activeUserId },
                  body: JSON.stringify({ role_title: title })
                });
                if (res.ok) loadUserData();
              }}
              onScreenCandidates={(jobId) => {
                // Simulate screening
                setHrData({
                  ...hrData,
                  candidates: [
                    { id: 'c1', name: 'Moussa Diallo', role: 'Fullstack Dev', matchScore: 92, status: 'entretien' },
                    { id: 'c2', name: 'Sarah Koné', role: 'Fullstack Dev', matchScore: 78, status: 'nouveau' },
                    { id: 'c3', name: 'Jean-Marc Kouassi', role: 'Fullstack Dev', matchScore: 85, status: 'nouveau' },
                  ]
                });
              }}
              onGenerateOnboarding={async (name, role) => {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/hr/onboarding`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'X-User-Id': activeUserId },
                  body: JSON.stringify({ candidate_name: name, role })
                });
                if (res.ok) loadUserData();
              }}
            />
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

      {/* Onboarding Wizard - shown automatically for new authenticated users */}
      {showOnboarding && (
        <OnboardingWizard
          founderConfig={founderConfig}
          companyConfig={companyConfig}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  );
};
