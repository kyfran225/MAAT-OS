import React, { useState } from 'react';
import { SimulationScenario } from '../../types';
import { 
  Cpu, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Bot, 
  Sparkles,
  Save,
  LineChart
} from 'lucide-react';

// Specialized calculator for SaaS/B2B Metrics
const calculateAdvancedMetrics = (budget: number, price: number, conv: number, agents: number) => {
  const leads = Math.round(budget / 45); // Avg cost per lead
  const customers = Math.round(leads * (conv / 100));
  const mrr = customers * price;
  const churnRate = 0.05; // 5% monthly churn
  const ltv = price / churnRate;
  const cac = customers > 0 ? Math.round(budget / customers) : budget;
  const ltvCacRatio = cac > 0 ? (ltv / cac).toFixed(1) : '0';

  // Payback period (months)
  const payback = price > 0 ? Math.ceil(cac / price) : 0;

  // 12 Month Growth Projection
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    // Simple growth model: monthly new customers added to total, with churn applied to cumulative
    const totalCustomers = Math.round(customers * month * (1 - churnRate * i));
    const revenue = totalCustomers * price;
    const costs = budget + (agents * 1200);
    return { month, revenue, profit: revenue - costs };
  });

  return { customers, mrr, ltv, cac, ltvCacRatio, payback, monthlyData };
};

interface SimulationViewProps {
  scenarios: SimulationScenario[];
  onRunNewSimulation: (title: string, variable: string, budgetChange: string) => void;
  onExecuteRecommendation: (title: string) => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  scenarios,
  onRunNewSimulation,
  onExecuteRecommendation
}) => {
  // Interactive Slider State
  const [marketingBudget, setMarketingBudget] = useState<number>(5000);
  const [productPrice, setProductPrice] = useState<number>(250);
  const [targetConversion, setTargetConversion] = useState<number>(15);
  const [aiAgentsCount, setAiAgentsCount] = useState<number>(4);
  const [scenarioTitle, setScenarioTitle] = useState<string>('Stratégie Croissance Accélérée PME 2026');

  const [savedScenarios, setSavedScenarios] = useState<SimulationScenario[]>(scenarios);
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(scenarios[0] || null);

  // Dynamic Financial Calculations using Advanced Engine
  const metrics = calculateAdvancedMetrics(marketingBudget, productPrice, targetConversion, aiAgentsCount);

  const estimatedAnnualCost = (marketingBudget * 12) + (aiAgentsCount * 1200);
  const projected12MonthRevenue = metrics.monthlyData.reduce((acc, curr) => acc + curr.revenue, 0);
  const projectedNetProfit = projected12MonthRevenue - estimatedAnnualCost;
  const calculatedROI = estimatedAnnualCost > 0 ? (projected12MonthRevenue / estimatedAnnualCost).toFixed(1) : '1.0';

  const riskLevel = Number(calculatedROI) >= 3.0 ? 'Faible' : Number(calculatedROI) >= 1.8 ? 'Modéré' : 'Élevé';
  const confidenceScore = Math.min(98, Math.max(70, 75 + Math.round(Number(calculatedROI) * 5)));

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    const newScenario: SimulationScenario = {
      id: `sim-${Date.now()}`,
      title: scenarioTitle || `Simulation $${marketingBudget.toLocaleString()} Budget`,
      description: `Scénario calculé avec $${marketingBudget.toLocaleString()} de budget marketing, tarif $${productPrice}/unité et ${aiAgentsCount} agents IA.`,
      variable: `Budget $${marketingBudget.toLocaleString()} / Prix $${productPrice}`,
      changeValue: `+$${marketingBudget.toLocaleString()}`,
      estimatedROI: Number(calculatedROI),
      riskLevel: riskLevel,
      confidenceScore: confidenceScore,
      recommendation: `Le CFO Agent recommande ce scénario (ROI ${calculatedROI}x) avec un investissement annuel de $${estimatedAnnualCost.toLocaleString()} pour un profit net estimé à $${projectedNetProfit.toLocaleString()}.`,
      projections: {
        revenueIncrease: `+$${metrics.mrr.toLocaleString()} / mois`,
        customerAcquisition: `+${metrics.customers} clients / mois`,
        timeline: '30 à 90 Jours'
      }
    };

    setSavedScenarios([newScenario, ...savedScenarios]);
    setSelectedScenario(newScenario);
    onRunNewSimulation(newScenario.title, newScenario.variable, newScenario.changeValue);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono-code font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>MODE SIMULATION • WHAT-IF ENGINE™</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Simulateur de Scénarios ROI & Prévisions Financières</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ajustez dynamiquement les curseurs budgétaires pour simuler le ROI et l'impact sur vos revenus récurrents.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-code text-cyan-400 font-bold flex items-center gap-2 shrink-0">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Moteur ROI Temps Réel Active</span>
        </div>
      </div>

      {/* Main Grid: Calculator Controls vs Live Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Calculator Sliders (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 lg:p-8 rounded-3xl space-y-6 border border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Curseurs d'Ajustement Stratégique</span>
            </h2>
            <span className="text-[11px] font-mono-code text-slate-400">Modélisation Temps Réel</span>
          </div>

          <form onSubmit={handleSaveScenario} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Titre de la Simulation *
              </label>
              <input
                type="text"
                value={scenarioTitle}
                onChange={(e) => setScenarioTitle(e.target.value)}
                placeholder="ex: Stratégie Croissance Accélérée PME 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            {/* Slider 1: Marketing Budget */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Budget Mensuel Marketing & Outreach</span>
                </span>
                <span className="font-mono-code font-bold text-amber-400 text-sm">
                  ${marketingBudget.toLocaleString()} / mois
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={25000}
                step={500}
                value={marketingBudget}
                onChange={(e) => setMarketingBudget(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono-code">
                <span>$1,000</span>
                <span>$12,500</span>
                <span>$25,000</span>
              </div>
            </div>

            {/* Slider 2: Product / Offering Price */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Tarif Moyen des Offres PME</span>
                </span>
                <span className="font-mono-code font-bold text-emerald-400 text-sm">
                  ${productPrice} / unité
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={1500}
                step={25}
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono-code">
                <span>$50</span>
                <span>$750</span>
                <span>$1,500</span>
              </div>
            </div>

            {/* Slider 3: Target Conversion Rate */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-cyan-400" />
                  <span>Taux de Conversion Ciblé (%)</span>
                </span>
                <span className="font-mono-code font-bold text-cyan-400 text-sm">
                  {targetConversion}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={targetConversion}
                onChange={(e) => setTargetConversion(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono-code">
                <span>5%</span>
                <span>20%</span>
                <span>40%</span>
              </div>
            </div>

            {/* Slider 4: AI Agents Count */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Directeurs IA Assignés</span>
                </span>
                <span className="font-mono-code font-bold text-purple-400 text-sm">
                  {aiAgentsCount} Agents
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={1}
                value={aiAgentsCount}
                onChange={(e) => setAiAgentsCount(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono-code">
                <span>1 Agent</span>
                <span>3 Agents</span>
                <span>6 Agents</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer la Simulation dans le Système</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Calculated Results & Scenario Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Output KPI Cards */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-emerald-500/30">
            <h3 className="text-xs font-mono-code font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Projections Financières Calculées (12 Mois)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono-code">Nouveaux Clients/Mois</span>
                <div className="text-lg font-bold font-mono-code text-cyan-400">+{metrics.customers}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono-code">MRR Projeté</span>
                <div className="text-lg font-bold font-mono-code text-emerald-400">+${metrics.mrr.toLocaleString()}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono-code">LTV/CAC Ratio</span>
                <div className="text-lg font-bold font-mono-code text-amber-400">{metrics.ltvCacRatio}x</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono-code">ROI Global</span>
                <div className="text-lg font-bold font-mono-code text-purple-400">{calculatedROI}x</div>
              </div>
            </div>

            {/* Payback & Profit Block */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">Profit Net Estimé (1 an) :</span>
                <span className="text-base font-extrabold font-mono-code text-emerald-400">
                  +${projectedNetProfit.toLocaleString()}
                </span>
              </div>

              {/* Payback Period Visual */}
              <div className="space-y-1.5 pt-1 border-t border-slate-900">
                <div className="flex justify-between text-[10px] font-mono-code">
                  <span className="text-slate-500">Période de Rentabilité (Payback)</span>
                  <span className="text-cyan-400 font-bold">{metrics.payback} mois</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden flex">
                  <div
                    className="h-full bg-rose-500/50"
                    style={{ width: `${(metrics.payback / 12) * 100}%` }}
                  />
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${(1 - metrics.payback / 12) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
                <span>Niveau de Risque : <strong className={riskLevel === 'Faible' ? 'text-emerald-400' : 'text-amber-400'}>{riskLevel}</strong></span>
                <span>Confiance : <strong>{confidenceScore}%</strong></span>
              </div>
            </div>

            {/* Monthly Growth Chart Simulation */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <LineChart className="w-3 h-3 text-cyan-400" />
                  <span>Courbe de Croissance (12m)</span>
                </h4>
                <div className="flex gap-2">
                   <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span className="text-[8px] text-slate-500">Revenus</span></div>
                   <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div><span className="text-[8px] text-slate-500">Coûts</span></div>
                </div>
              </div>

              <div className="h-24 flex items-end justify-between gap-1 px-1">
                {metrics.monthlyData.map((d, i) => {
                  const maxRev = Math.max(...metrics.monthlyData.map(m => m.revenue));
                  const height = maxRev > 0 ? (d.revenue / maxRev) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 group relative">
                      <div
                        className="w-full bg-emerald-500/30 group-hover:bg-emerald-500 transition-all rounded-t-sm"
                        style={{ height: `${height}%` }}
                      />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-[8px] text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ${Math.round(d.revenue/1000)}k
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[8px] text-slate-600 font-mono-code uppercase px-1">
                <span>M01</span>
                <span>M06</span>
                <span>M12</span>
              </div>
            </div>

            {/* CFO Recommendation */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-cyan-400 font-mono-code flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Avis du CFO Agent :</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                "Pour un investissement annuel de ${estimatedAnnualCost.toLocaleString()}, ce scénario génère ${projected12MonthRevenue.toLocaleString()} de chiffre d'affaires. Le ratio ROI de {calculatedROI}x est très favorable."
              </p>
            </div>

            <button
              onClick={() => onExecuteRecommendation(scenarioTitle)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Convertir ce Scénario en Mission Active</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* List of Saved Scenarios */}
          {savedScenarios.length > 0 && (
            <div className="glass-panel p-5 rounded-3xl space-y-3">
              <h4 className="text-xs font-mono-code font-bold text-slate-400 uppercase tracking-wider">
                Scénarios Enregistrés dans l'OS ({savedScenarios.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {savedScenarios.map((scen) => (
                  <div
                    key={scen.id}
                    onClick={() => setSelectedScenario(scen)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      selectedScenario?.id === scen.id
                        ? 'bg-slate-900 border-cyan-500 text-white'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="font-bold truncate">{scen.title}</span>
                    <span className="font-mono-code font-bold text-emerald-400 shrink-0">ROI {scen.estimatedROI}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
