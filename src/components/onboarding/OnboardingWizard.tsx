import React, { useState } from 'react';
import {
  FounderBrainConfig,
  CompanyBrainConfig
} from '../../types';
import {
  Sparkles,
  Brain,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Rocket,
  ShieldCheck,
  Bot,
  Palette,
  Zap,
  Layers,
  Layout
} from 'lucide-react';

interface OnboardingWizardProps {
  founderConfig?: FounderBrainConfig;
  companyConfig?: CompanyBrainConfig;
  onComplete: (founder: FounderBrainConfig, company: CompanyBrainConfig, firstMission: any | null) => void;
  onSkip?: () => void;
}

const STEPS = [
  { id: 1, label: 'Bienvenue',      icon: Sparkles,   color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
  { id: 2, label: 'Vision Fondateur', icon: Brain,      color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 3, label: 'Identité Visuelle', icon: Palette,    color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30' },
  { id: 4, label: 'Règles d\'Or',    icon: ShieldCheck, color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
  { id: 5, label: 'Activation OS',   icon: CheckCircle2,color:'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30' },
];

const AI_QUOTES: Record<number, { agent: string; avatar: string; text: string }> = {
  1: { agent: 'CEO Agent', avatar: '🎯', text: 'Bienvenue dans MAAT Studio AI. Je suis votre CEO Agent. Personnalisons votre OS pour qu\'il devienne votre extension digitale.' },
  2: { agent: 'Founder Twin™', avatar: '🧠', text: 'Votre vision est le code source de l\'IA. Définissez vos ambitions pour que chaque agent agisse comme vous le feriez.' },
  3: { agent: 'Creative Director', avatar: '🎨', text: 'L\'interface doit refléter votre puissance de marque. Choisissez une ambiance qui inspire la confiance.' },
  4: { agent: 'Compliance Agent', avatar: '⚖️', text: 'Les "Non-Négociables" sont les garde-fous de l\'OS. Ils garantissent que l\'IA ne déviera jamais de votre éthique.' },
  5: { agent: 'System Admin', avatar: '⚙️', text: 'Prêt pour le déploiement. Votre Founder Brain est désormais synchronisé avec le Moteur Cognitif.' },
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);

  // Form State
  const [founderName, setFounderName] = useState('Franck Maat');
  const [vision, setVision] = useState('');
  const [strategicStyle, setStrategicStyle] = useState('Audacieux');
  const [themeColor, setThemeColor] = useState('amber');
  const [nonNegotiables, setNonNegotiables] = useState<string[]>(['Qualité Premium', 'Éthique IA', 'ROI Focalisé']);
  const [newNonNeg, setNewNonNeg] = useState('');

  const addNonNeg = () => {
    if (newNonNeg.trim()) {
      setNonNegotiables([...nonNegotiables, newNonNeg.trim()]);
      setNewNonNeg('');
    }
  };

  const removeNonNeg = (index: number) => {
    setNonNegotiables(nonNegotiables.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else finishOnboarding();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const finishOnboarding = () => {
    setIsFinishing(true);
    setTimeout(() => {
      onComplete(
        {
          founderName,
          visionStatement: vision,
          riskTolerance: strategicStyle as any,
          strategicStyle: strategicStyle,
          coreValues: ['Innovation', 'Excellence'],
          nonNegotiables,
          preferredCommunication: 'Direct'
        } as any,
        {
          companyName: `${founderName} Enterprise`,
          industry: 'Services',
          valueProposition: vision,
          mainProducts: [],
          brandVoice: 'Professional'
        } as any,
        null
      );
    }, 2000);
  };

  const currentStepData = STEPS.find(s => s.id === step)!;
  const aiQuote = AI_QUOTES[step];

  return (
    <div className="min-h-[600px] flex flex-col space-y-8 max-w-4xl mx-auto py-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between px-2">
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 flex-1 relative">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 z-10 ${
              step >= s.id ? `${s.bg} ${s.border} ${s.color} scale-110 shadow-lg` : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-tighter transition-colors duration-300 ${
              step >= s.id ? 'text-white' : 'text-slate-600'
            }`}>{s.label}</span>
            {s.id < 5 && (
              <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 transition-colors duration-500 ${
                step > s.id ? 'bg-amber-500/50' : 'bg-slate-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Content */}
        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl space-y-8 border border-slate-800 min-h-[450px] flex flex-col justify-between relative overflow-hidden">
          {isFinishing && (
            <div className="absolute inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
              <Rocket className="w-12 h-12 text-amber-500 animate-bounce" />
              <h3 className="text-xl font-bold text-white">Initialisation du Système...</h3>
              <p className="text-xs text-slate-400 font-mono-code">Synchronisation des 6 couches cognitives</p>
              <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 animate-progress" />
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${currentStepData.bg} ${currentStepData.color}`}>
                <currentStepData.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentStepData.label}</h2>
                <p className="text-xs text-slate-400">Étape {step} sur 5 • Configuration MAAT Studio AI</p>
              </div>
            </div>

            <div className="animate-in slide-in-from-right-4 duration-300">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Prêt pour le décollage ?
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      MAAT Studio AI n'est pas un simple logiciel. C'est une extension de votre cerveau de fondateur.
                      Prenez 2 minutes pour lui donner votre ADN stratégique.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Identité Fondateur</label>
                    <input
                      type="text"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                      placeholder="Nom complet du fondateur"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Vision Stratégique</label>
                    <textarea
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-colors resize-none"
                      placeholder="Où voyez-vous votre entreprise dans 3 ans ? Quelle est votre 'North Star' ?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Audacieux', 'Prudent', 'Analytique', 'Vitesse Max'].map(style => (
                      <button
                        key={style}
                        onClick={() => setStrategicStyle(style)}
                        className={`p-3 rounded-xl border text-[11px] font-bold transition-all ${
                          strategicStyle === style ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Style : {style}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Ambiance de l'OS (Branding)</label>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { id: 'amber', color: 'bg-amber-500' },
                        { id: 'cyan', color: 'bg-cyan-500' },
                        { id: 'emerald', color: 'bg-emerald-500' },
                        { id: 'purple', color: 'bg-purple-500' }
                      ].map(c => (
                        <button
                          key={c.id}
                          onClick={() => setThemeColor(c.id)}
                          className={`aspect-square rounded-2xl border-4 flex items-center justify-center transition-all ${
                            themeColor === c.id ? 'border-white scale-110 shadow-xl' : 'border-transparent opacity-50 grayscale hover:opacity-100'
                          }`}
                        >
                          <div className={`w-full h-full rounded-xl ${c.color}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                    <Layout className="w-8 h-8 text-cyan-400" />
                    <p className="text-[11px] text-slate-400 leading-tight">
                      MAAT Studio adaptera dynamiquement ses composants visuels à votre code couleur pour une immersion totale.
                    </p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Les Non-Négociables (Règles d'Or)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNonNeg}
                      onChange={(e) => setNewNonNeg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNonNeg())}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:border-emerald-500 outline-none"
                      placeholder="Ajouter une règle (ex: Zéro retard client)"
                    />
                    <button onClick={addNonNeg} className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {nonNegotiables.map((rule, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold animate-in zoom-in duration-200">
                        <span>{rule}</span>
                        <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => removeNonNeg(i)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="text-center space-y-6 py-4">
                  <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500/30 animate-pulse">
                    <CheckCircle2 className="w-10 h-10 text-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-white">Tout est prêt, {founderName.split(' ')[0]} !</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Votre Conseil d'Administration IA a été configuré avec succès.
                      Prêt à transformer votre vision en exécution ?
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-white disabled:opacity-0 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-xs shadow-lg transition-all transform hover:scale-105 ${
                step === 5 ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              <span>{step === 5 ? 'Activer mon OS' : 'Suivant'}</span>
              {step === 5 ? <Rocket className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* AI Sidebar Support */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shadow-inner">
                {aiQuote.avatar}
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-400 font-mono-code uppercase">{aiQuote.agent}</div>
                <div className="text-xs font-bold text-white">Accompagnement IA</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{aiQuote.text}"
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Layers className="w-12 h-12 text-amber-400" />
            </div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Auto-Génération de Profil</span>
            </h4>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(step/5)*100}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 font-mono-code">Complétion de l'ADN Digital : {Math.round((step/5)*100)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
