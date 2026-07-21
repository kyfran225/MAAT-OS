import React, { useState } from 'react';
import {
  FounderBrainConfig,
  CompanyBrainConfig,
  MissionCategory
} from '../../types';
import { MAATAuthService, isRealName } from '../../services/maatAuthService';
import {
  Sparkles,
  Brain,
  Building2,
  Target,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Rocket,
  ShieldCheck,
  Bot,
  Lightbulb,
  Zap,
  ArrowRight
} from 'lucide-react';

interface OnboardingWizardProps {
  founderConfig: FounderBrainConfig;
  companyConfig: CompanyBrainConfig;
  onComplete: (
    founder: FounderBrainConfig,
    company: CompanyBrainConfig,
    firstMission: {
      title: string;
      category: MissionCategory;
      target: string;
      budget: number;
      timeline: string;
      objective: string;
      constraints: string[];
    } | null
  ) => void;
  onSkip: () => void;
}

const STEPS = [
  { id: 1, label: 'Bienvenue',      icon: Sparkles,   color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  { id: 2, label: 'Fondateur',      icon: Brain,      color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 3, label: 'Entreprise',     icon: Building2,  color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30' },
  { id: 4, label: '1ere Mission',   icon: Target,     color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
  { id: 5, label: 'Confirmation',   icon: CheckCircle2,color:'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
];

const AI_QUOTES: Record<number, { agent: string; avatar: string; text: string }> = {
  1: { agent: 'CEO Agent', avatar: '🎯', text: 'Bienvenue dans MAAT Studio AI. Je suis votre CEO Agent. Configurez votre espace en moins de 5 minutes et lancez votre premiere Mission.' },
  2: { agent: 'Chief of Staff', avatar: '📋', text: 'Le Founder Brain impregne chaque decision de votre modele cognitif. Plus vous etes precis, plus nos recommandations seront pertinentes.' },
  3: { agent: 'Marketing Director', avatar: '🚀', text: 'L\'ADN de votre entreprise nourrit notre Knowledge Graph. Chaque signal MAATFEED sera filtre a travers votre identite de marque.' },
  4: { agent: 'Finance Director (CFO)', avatar: '💎', text: 'Une premiere Mission bien definie declenche le Moteur Cognitif 6-Couches. Je superviserai le ROI et la rentabilite a chaque jalon.' },
  5: { agent: 'CEO Agent', avatar: '🎯', text: 'Configuration validee. Le Conseil d\'Administration IA est operationnel. Toutes les decisions seront desormais alignees sur votre vision.' },
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  founderConfig,
  companyConfig,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(1);

  // Pull Google identity data - only use if they pass the real-name guard
  const googleUser        = MAATAuthService.getInstance().getCurrentUser();
  const rawDisplayName    = googleUser?.displayName || '';
  const rawFirstName      = googleUser?.firstName   || '';
  const googleDisplayName = isRealName(rawDisplayName) ? rawDisplayName : '';
  const googleFirstName   = isRealName(rawFirstName)   ? rawFirstName   : '';
  const googleAvatarUrl   = googleUser?.avatarUrl && googleUser.avatarUrl.startsWith('http')
                              ? googleUser.avatarUrl
                              : null;

  // Step 2 - Founder Brain
  // Pre-fill founderName with real Google name only; fall back to whatever was saved in founderConfig.
  const [founderName, setFounderName] = useState(
    founderConfig.founderName || googleDisplayName
  );
  const [visionStatement, setVisionStatement]   = useState(founderConfig.visionStatement || '');
  const [riskTolerance, setRiskTolerance]       = useState<FounderBrainConfig['riskTolerance']>(founderConfig.riskTolerance || 'Equilibre' as any);
  const [strategicStyle, setStrategicStyle]     = useState(founderConfig.strategicStyle || '');
  const [coreValueInput, setCoreValueInput]     = useState('');
  const [coreValues, setCoreValues]             = useState<string[]>(founderConfig.coreValues || []);
  const [nonNegInput, setNonNegInput]           = useState('');
  const [nonNegotiables, setNonNegotiables]     = useState<string[]>(founderConfig.nonNegotiables || []);

  // Step 3 - Company Brain
  const [companyName, setCompanyName]           = useState(companyConfig.companyName || '');
  const [industry, setIndustry]                 = useState(companyConfig.industry || '');
  const [valueProposition, setValueProposition] = useState(companyConfig.valueProposition || '');
  const [brandVoice, setBrandVoice]             = useState(companyConfig.brandVoice || '');
  const [productInput, setProductInput]         = useState('');
  const [mainProducts, setMainProducts]         = useState<string[]>(companyConfig.mainProducts || []);

  // Step 4 - First Mission
  const [skipMission, setSkipMission]           = useState(false);
  const [missionTitle, setMissionTitle]         = useState('');
  const [missionCategory, setMissionCategory]   = useState<MissionCategory>('strategy');
  const [missionTarget, setMissionTarget]       = useState('');
  const [missionBudget, setMissionBudget]       = useState(10000);
  const [missionTimeline, setMissionTimeline]   = useState('30 Jours');
  const [missionObjective, setMissionObjective] = useState('');

  const totalSteps = STEPS.length;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;
  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;
  const aiQuote = AI_QUOTES[step];

  const canGoNext = () => {
    if (step === 2) return founderName.trim().length > 0 && visionStatement.trim().length > 0;
    if (step === 3) return companyName.trim().length > 0 && industry.trim().length > 0;
    if (step === 4) return skipMission || (missionTitle.trim().length > 0 && missionTarget.trim().length > 0 && missionObjective.trim().length > 0);
    return true;
  };

  const handleAddTag = (value: string, list: string[], setter: (v: string[]) => void, inputSetter: (v: string) => void) => {
    if (value.trim() && !list.includes(value.trim())) {
      setter([...list, value.trim()]);
    }
    inputSetter('');
  };

  const handleRemoveTag = (tag: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.filter(t => t !== tag));
  };

  const handleFinish = () => {
    const newFounder: FounderBrainConfig = {
      founderName,
      visionStatement,
      riskTolerance,
      coreValues,
      strategicStyle,
      nonNegotiables,
    };
    const newCompany: CompanyBrainConfig = {
      companyName,
      industry,
      valueProposition,
      mainProducts,
      brandVoice,
    };
    const firstMission = (!skipMission && missionTitle && missionTarget && missionObjective)
      ? {
          title: missionTitle,
          category: missionCategory,
          target: missionTarget,
          budget: missionBudget,
          timeline: missionTimeline,
          objective: missionObjective,
          constraints: ['Validation du Founder Brain obligatoire', 'Respect du budget alloue'],
        }
      : null;

    onComplete(newFounder, newCompany, firstMission);
  };

  // ── Shared input class ────────────────────────────────────────────────────
  const inputCls = 'w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 placeholder-slate-600 transition-colors';
  const labelCls = 'block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="glass-panel border border-amber-500/20 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 flex flex-col max-h-[96vh]">

        {/* ── Top Progress Bar ─────────────────────────────────────────────── */}
        <div className="relative h-1.5 bg-slate-900 shrink-0">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Step Indicators ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800 shrink-0">
          {STEPS.map((s) => {
            const SIcon = s.icon;
            const isActive = s.id === step;
            const isDone   = s.id < step;
            return (
              <div key={s.id} className="flex flex-col items-center gap-1 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  isDone   ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                  isActive ? `${s.bg} ${s.border} ${s.color}` :
                             'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {isDone
                    ? <CheckCircle2 className="w-4 h-4" />
                    : <SIcon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] font-bold hidden sm:block transition-colors ${isActive ? s.color : isDone ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Scrollable Content ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* AI Agent Quote - with Google user avatar on step 1 */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            {step === 1 && googleAvatarUrl ? (
              <img
                src={googleAvatarUrl}
                alt={googleDisplayName}
                className="w-9 h-9 rounded-xl object-cover border border-amber-500/30 shrink-0"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                {aiQuote.avatar}
              </div>
            )}
            <div>
              <div className="text-[10px] font-mono-code font-bold text-amber-400 mb-1">{aiQuote.agent}</div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{aiQuote.text}"</p>
            </div>
          </div>

          {/* Step Header */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${currentStep.bg} border ${currentStep.border}`}>
              <StepIcon className={`w-5 h-5 ${currentStep.color}`} />
            </div>
            <div>
              <div className={`text-[10px] font-mono-code font-bold uppercase tracking-wider ${currentStep.color}`}>
                Etape {step} / {totalSteps}
              </div>
              <h2 className="text-xl font-bold font-heading text-white">
                {step === 1 && (googleFirstName ? `Bienvenue ${googleFirstName} dans MAAT Studio AI` : 'Bienvenue dans MAAT Studio AI')}
                {step === 2 && 'Configurez votre Founder Brain™'}
                {step === 3 && 'Identite de l\'Entreprise'}
                {step === 4 && 'Lancez votre 1ere Mission™'}
                {step === 5 && 'Tout est pret !'}
              </h2>
            </div>
          </div>

          {/* ── STEP 1: Welcome ─────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                MAAT Studio AI est votre <strong className="text-white">systeme d'exploitation d'entreprise</strong>. Ce wizard va configurer votre espace en 5 etapes et activer votre Conseil d'Administration IA.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Brain,    color: 'text-purple-400', bg: 'bg-purple-500/10', title: 'Founder Brain™',    desc: 'Votre modele cognitif personnel impregne chaque decision.' },
                  { icon: Building2,color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   title: 'Company Brain™',   desc: 'L\'ADN de votre entreprise nourrit le Knowledge Graph.' },
                  { icon: Bot,      color: 'text-amber-400',  bg: 'bg-amber-500/10',  title: 'Conseil IA',       desc: '5 Directeurs IA specialises orchestres par le CEO Agent.' },
                  { icon: Zap,      color: 'text-emerald-400',bg: 'bg-emerald-500/10',title: 'Missions Cognitives',desc: 'Plans d\'action 6-couches generes automatiquement.' },
                ].map((f) => {
                  const FIcon = f.icon;
                  return (
                    <div key={f.title} className={`p-4 rounded-2xl ${f.bg} border border-slate-800 flex items-start gap-3`}>
                      <FIcon className={`w-5 h-5 ${f.color} shrink-0 mt-0.5`} />
                      <div>
                        <div className="text-xs font-bold text-white">{f.title}</div>
                        <div className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{f.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 shrink-0" />
                <span>Duree estimee : <strong>moins de 5 minutes</strong>. Vous pourrez modifier tous les parametres a tout moment depuis le Multi-Brain.</span>
              </div>
            </div>
          )}

          {/* ── STEP 2: Founder Brain ───────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Votre Nom *</label>
                  <input className={inputCls} value={founderName} onChange={e => setFounderName(e.target.value)} placeholder="ex: Franck Mensah" required />
                </div>
                <div>
                  <label className={labelCls}>Style Strategique</label>
                  <input className={inputCls} value={strategicStyle} onChange={e => setStrategicStyle(e.target.value)} placeholder="ex: Axe sur la valeur produit et le ROI" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Vision (Declaration d'intention) *</label>
                <textarea rows={3} className={inputCls} value={visionStatement} onChange={e => setVisionStatement(e.target.value)} placeholder="ex: Transformer les PME africaines en organisations augmentees grace a l'IA..." />
              </div>

              <div>
                <label className={labelCls}>Tolerance au Risque</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Prudent', 'Equilibre', 'Audacieux'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRiskTolerance(r as any)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        (riskTolerance as string) === r
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {r === 'Prudent' ? '🛡 Prudent' : r === 'Equilibre' ? '⚖ Equilibre' : '🚀 Audacieux'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Valeurs Fondamentales</label>
                <div className="flex gap-2 mb-2">
                  <input className={`${inputCls} flex-1`} value={coreValueInput} onChange={e => setCoreValueInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag(coreValueInput, coreValues, setCoreValues, setCoreValueInput))}
                    placeholder="ex: Excellence, Rigueur... puis Entree" />
                  <button type="button" onClick={() => handleAddTag(coreValueInput, coreValues, setCoreValues, setCoreValueInput)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-amber-400 font-bold text-xs hover:bg-slate-700">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {coreValues.map(v => (
                    <span key={v} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      {v}
                      <button onClick={() => handleRemoveTag(v, coreValues, setCoreValues)}><X className="w-3 h-3 text-purple-400 hover:text-white" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Non-Negociables (lignes rouges)</label>
                <div className="flex gap-2 mb-2">
                  <input className={`${inputCls} flex-1`} value={nonNegInput} onChange={e => setNonNegInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag(nonNegInput, nonNegotiables, setNonNegotiables, setNonNegInput))}
                    placeholder="ex: Aucune dette non planifiee..." />
                  <button type="button" onClick={() => handleAddTag(nonNegInput, nonNegotiables, setNonNegotiables, setNonNegInput)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-amber-400 font-bold text-xs hover:bg-slate-700">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nonNegotiables.map(n => (
                    <span key={n} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      {n}
                      <button onClick={() => handleRemoveTag(n, nonNegotiables, setNonNegotiables)}><X className="w-3 h-3 text-rose-400 hover:text-white" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Company Brain ───────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nom de l'Entreprise *</label>
                  <input className={inputCls} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="ex: MAAT Studio AI" required />
                </div>
                <div>
                  <label className={labelCls}>Secteur d'Activite *</label>
                  <input className={inputCls} value={industry} onChange={e => setIndustry(e.target.value)} placeholder="ex: AI SaaS B2B / Agro-industrie" required />
                </div>
              </div>

              <div>
                <label className={labelCls}>Proposition de Valeur Unique</label>
                <textarea rows={2} className={inputCls} value={valueProposition} onChange={e => setValueProposition(e.target.value)} placeholder="Ce que vous apportez que personne d'autre n'apporte..." />
              </div>

              <div>
                <label className={labelCls}>Voix de Marque (Tone of Voice)</label>
                <input className={inputCls} value={brandVoice} onChange={e => setBrandVoice(e.target.value)} placeholder="ex: Visionnaire, Exigeant, Chaleureux et Direct" />
              </div>

              <div>
                <label className={labelCls}>Produits & Services Principaux</label>
                <div className="flex gap-2 mb-2">
                  <input className={`${inputCls} flex-1`} value={productInput} onChange={e => setProductInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag(productInput, mainProducts, setMainProducts, setProductInput))}
                    placeholder="ex: Abonnement SaaS PME..." />
                  <button type="button" onClick={() => handleAddTag(productInput, mainProducts, setMainProducts, setProductInput)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-cyan-400 font-bold text-xs hover:bg-slate-700">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mainProducts.map(p => (
                    <span key={p} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      {p}
                      <button onClick={() => handleRemoveTag(p, mainProducts, setMainProducts)}><X className="w-3 h-3 text-cyan-400 hover:text-white" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: First Mission ───────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={skipMission}
                  onChange={e => setSkipMission(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span className="text-xs text-slate-400">Passer cette etape - Je creerai ma premiere Mission plus tard</span>
              </label>

              {!skipMission && (
                <>
                  <div>
                    <label className={labelCls}>Titre de la Mission *</label>
                    <input className={inputCls} value={missionTitle} onChange={e => setMissionTitle(e.target.value)} placeholder="ex: Lancement Offre PME Abidjan Q3 2026" required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Categorie Metier</label>
                      <select className={inputCls} value={missionCategory} onChange={e => setMissionCategory(e.target.value as MissionCategory)}>
                        <option value="strategy">Strategie Globale</option>
                        <option value="marketing">Marketing & Acquisition</option>
                        <option value="sales">Ventes & Pipeline</option>
                        <option value="finance">Finance & ROI</option>
                        <option value="product">Produit & Features</option>
                        <option value="hr">RH & Recrutement</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Horizon Temporel</label>
                      <select className={inputCls} value={missionTimeline} onChange={e => setMissionTimeline(e.target.value)}>
                        <option>7 Jours</option>
                        <option>14 Jours</option>
                        <option>30 Jours</option>
                        <option>60 Jours</option>
                        <option>90 Jours</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Resultat Vise *</label>
                    <textarea rows={2} className={inputCls} value={missionTarget} onChange={e => setMissionTarget(e.target.value)} placeholder="ex: Signer 50 PME pilotes avec un CAC inferieur a $50" />
                  </div>

                  <div>
                    <label className={labelCls}>Objectif Strategique *</label>
                    <textarea rows={2} className={inputCls} value={missionObjective} onChange={e => setMissionObjective(e.target.value)} placeholder="Pourquoi cette mission est strategiquement prioritaire ?" />
                  </div>

                  <div>
                    <label className={labelCls}>Budget Alloue ($ USD)</label>
                    <input type="number" className={inputCls + ' font-mono-code'} value={missionBudget} onChange={e => setMissionBudget(Number(e.target.value))} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── STEP 5: Confirmation ────────────────────────────────────────── */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Configuration Validee</h3>
                <p className="text-xs text-slate-400">Votre Conseil d'Administration IA est desormais aligne sur votre vision.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/20 space-y-1">
                  <div className="font-bold text-purple-400 flex items-center gap-1.5"><Brain className="w-4 h-4" /> Founder Brain</div>
                  <div className="text-slate-300">{founderName || '-'}</div>
                  <div className="text-slate-500 text-[11px] line-clamp-2">{visionStatement || '-'}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/20 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Company Brain</div>
                  <div className="text-slate-300">{companyName || '-'}</div>
                  <div className="text-slate-500 text-[11px]">{industry || '-'}</div>
                </div>
                {!skipMission && missionTitle && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-1 sm:col-span-2">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5"><Target className="w-4 h-4" /> 1ere Mission</div>
                    <div className="text-slate-300">{missionTitle}</div>
                    <div className="text-slate-500 text-[11px]">Budget : ${missionBudget.toLocaleString()} - Horizon : {missionTimeline}</div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Toutes les decisions du Conseil IA seront desormais filtrees a travers votre Founder Brain et l'identite de {companyName || 'votre entreprise'}.</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer Navigation ────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onSkip}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Ignorer l'onboarding
          </button>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:border-slate-600 flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
            )}

            {step < totalSteps ? (
              <button
                disabled={!canGoNext()}
                onClick={() => setStep(s => s + 1)}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg ${
                  canGoNext()
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Continuer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 hover:brightness-110 shadow-lg shadow-amber-500/30 transition-all"
              >
                <Rocket className="w-4 h-4" />
                <span>Lancer MAAT Studio AI</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
