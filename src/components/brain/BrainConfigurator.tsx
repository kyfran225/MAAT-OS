import React, { useState } from 'react';
import { FounderBrainConfig, CompanyBrainConfig } from '../../types';
import { Brain, Network, CheckCircle2, Save } from 'lucide-react';

interface BrainConfiguratorProps {
  founderConfig: FounderBrainConfig;
  companyConfig: CompanyBrainConfig;
  onSaveFounderConfig: (config: FounderBrainConfig) => void;
  onSaveCompanyConfig: (config: CompanyBrainConfig) => void;
}

export const BrainConfigurator: React.FC<BrainConfiguratorProps> = ({
  founderConfig,
  companyConfig,
  onSaveFounderConfig,
  onSaveCompanyConfig
}) => {
  const [activeTab, setActiveTab] = useState<'founder' | 'company' | 'graph'>('founder');

  const [founderState, setFounderState] = useState<FounderBrainConfig>(founderConfig);
  const [companyState, setCompanyState] = useState<CompanyBrainConfig>(companyConfig);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSaveFounder = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveFounderConfig(founderState);
    triggerFeedback();
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCompanyConfig(companyState);
    triggerFeedback();
  };

  const triggerFeedback = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono-code font-bold mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>MULTI-BRAIN SYSTEM™ & KNOWLEDGE GRAPH</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Cerveau du Fondateur & Identité d'Entreprise</h1>
          <p className="text-xs text-slate-400 mt-1">
            Imprégnez le système du modèle cognitif du fondateur et de l'ADN de l'organisation.
          </p>
        </div>

        {savedFeedback && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changements Synchronisés dans le Multi-Brain System™</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit text-xs font-bold">
        <button
          onClick={() => setActiveTab('founder')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'founder' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Founder Brain™ (Digital Twin)
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'company' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Company Brain™ (Identité)
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'graph' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Enterprise Knowledge Graph™
        </button>
      </div>

      {/* Tab 1: Founder Brain */}
      {activeTab === 'founder' && (
        <form onSubmit={handleSaveFounder} className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">Founder Brain™ Configurator</h2>
              <p className="text-xs text-slate-400">Définit vos convictions, votre niveau de risque et vos valeurs non négociables.</p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder Founder Brain</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nom du Fondateur / Dirigeant
              </label>
              <input
                type="text"
                value={founderState.founderName}
                onChange={(e) => setFounderState({ ...founderState, founderName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Tolérance au Risque Strategic
              </label>
              <select
                value={founderState.riskTolerance}
                onChange={(e) => setFounderState({ ...founderState, riskTolerance: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Prudent">Prudent (Préservation du capital)</option>
                <option value="Équilibré">Équilibré (Croissance maîtrisée)</option>
                <option value="Audacieux">Audacieux (Innovation rapide & Expansion)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Déclaration de Vision Globale
            </label>
            <textarea
              rows={3}
              value={founderState.visionStatement}
              onChange={(e) => setFounderState({ ...founderState, visionStatement: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Style Stratégique & Décisionnel
            </label>
            <textarea
              rows={2}
              value={founderState.strategicStyle}
              onChange={(e) => setFounderState({ ...founderState, strategicStyle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Valeurs Fondamentales & Règles d'Or
            </label>
            <div className="space-y-2">
              {founderState.coreValues.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Company Brain */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">Company Brain™ Configurator</h2>
              <p className="text-xs text-slate-400">Définit l'identité officielle, la voix de marque et le portefeuille de produits.</p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder Company Brain</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nom de l'Entreprise
              </label>
              <input
                type="text"
                value={companyState.companyName}
                onChange={(e) => setCompanyState({ ...companyState, companyName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Secteur d'Activité
              </label>
              <input
                type="text"
                value={companyState.industry}
                onChange={(e) => setCompanyState({ ...companyState, industry: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Proposition de Valeur Unique (UVP)
            </label>
            <textarea
              rows={2}
              value={companyState.valueProposition}
              onChange={(e) => setCompanyState({ ...companyState, valueProposition: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Ton & Voix de Marque
            </label>
            <input
              type="text"
              value={companyState.brandVoice}
              onChange={(e) => setCompanyState({ ...companyState, brandVoice: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </form>
      )}

      {/* Tab 3: Knowledge Graph Visualizer */}
      {activeTab === 'graph' && (
        <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-amber-400" />
                <span>Enterprise Knowledge Graph™ (Visualiseur de Nœuds)</span>
              </h2>
              <p className="text-xs text-slate-400">Cartographie vivante des relations entre produits, campagnes, clients et décisions.</p>
            </div>

            <span className="text-xs font-mono-code font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              1,420 Nœuds Connectés
            </span>
          </div>

          {/* Interactive Visual Representation of Graph Nodes */}
          <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 relative overflow-hidden min-h-[350px] flex flex-col justify-center items-center text-center">
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl relative z-10">
              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-mono-code font-bold shadow-lg">
                Founder Brain™
                <div className="text-[10px] text-slate-400 font-normal mt-1">Nœud Racine • Vision</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code font-bold shadow-lg">
                Mission 01 (Afrique)
                <div className="text-[10px] text-slate-400 font-normal mt-1">Nœud Action • Stratégie</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code font-bold shadow-lg">
                Segment PME Abidjan
                <div className="text-[10px] text-slate-400 font-normal mt-1">Customer Brain • Persona</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 text-indigo-400 text-xs font-mono-code font-bold shadow-lg">
                Signal MAATFEED #384
                <div className="text-[10px] text-slate-400 font-normal mt-1">Cultural Brain • Tendance</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-lg relative z-10 mt-4 leading-relaxed">
              Le Knowledge Graph garantit qu'aucune décision ne reste isolée. Une modification dans l'ADN du Founder Brain met à jour la logique de toutes les Missions en cours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
