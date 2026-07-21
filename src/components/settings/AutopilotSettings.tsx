import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShieldCheck,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Lock,
  Unlock,
  Coins
} from 'lucide-react';
import { BackendService } from '../../services/backendService';

interface AutopilotSettingsProps {
  onToggle: (enabled: boolean) => void;
}

export const AutopilotSettings: React.FC<AutopilotSettingsProps> = ({ onToggle }) => {
  const [enabled, setEnabled] = useState(false);
  const [minConfidence, setMinConfidence] = useState(95);
  const [maxBudget, setMaxBudget] = useState(50000);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/autopilot/settings`, {
          headers: { 'X-User-Id': 'user-maat-001' }
      });
      const settings = await response.json();

      if (settings) {
        setEnabled(settings.enabled || false);
        setMinConfidence(settings.min_confidence || 95);
        setMaxBudget(settings.max_budget_xof || 50000);
      }
    } catch (e) {
      console.error("Failed to load autopilot settings", e);
    }

    try {
      const activityResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/autopilot/activity`, {
          headers: { 'X-User-Id': 'user-maat-001' }
      });
      const activityData = await activityResponse.json();
      if (activityData) setActivity(activityData);
    } catch (e) {
      console.error("Failed to load activity", e);
    }

    setIsLoading(false);
  };

  const handleSave = async (newEnabled?: boolean) => {
    setIsSaving(true);
    const targetEnabled = newEnabled !== undefined ? newEnabled : enabled;

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/autopilot/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'user-maat-001' },
        body: JSON.stringify({
          enabled: targetEnabled,
          min_confidence: minConfidence,
          max_budget_xof: maxBudget,
          currency: 'XOF'
        })
      });

      if (newEnabled !== undefined) {
        onToggle(newEnabled);
      }
    } catch (e) {
      console.error("Failed to save autopilot settings", e);
    }

    setIsSaving(false);
  };

  const toggleAutopilot = () => {
    const nextState = !enabled;
    setEnabled(nextState);
    handleSave(nextState);
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-mono-code">Initialisation du Moteur Autonome...</div>;

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl transition-all duration-500 ${enabled ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
            {enabled ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono-code font-bold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>ORCHESTRATION AUTONOME • MODE AUTOPILOTE</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-white">Pilotage Automatique du Business</h1>
            <p className="text-xs text-slate-400 mt-1">
              Laissez l'IA gérer les tâches répétitives et les leads qualifiés selon vos propres règles de sécurité.
            </p>
          </div>
        </div>

        <button
          onClick={toggleAutopilot}
          disabled={isSaving}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
            enabled
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20'
              : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
          }`}
        >
          {isSaving ? 'Synchro...' : (enabled ? 'Désactiver l\'Autopilote' : 'Activer l\'Autopilote')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Thresholds Configuration */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-slate-800 space-y-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Garde-fous & Seuils de Sécurité (Trust-Builder™)</span>
            </h3>

            <div className="space-y-6">
              {/* Confidence Threshold */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Confiance Minimale Requise</label>
                  <span className="text-lg font-mono-code font-bold text-amber-400">{minConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="99"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <p className="text-[10px] text-slate-500 italic">
                  L'IA n'agira seule que si le score de confiance des agents dépasse ce seuil.
                </p>
              </div>

              {/* Budget Threshold */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Plafond Automatique (XOF)</label>
                  <span className="text-lg font-mono-code font-bold text-emerald-400">{(maxBudget || 0).toLocaleString()} XOF</span>
                </div>
                <div className="relative">
                  <Coins className="w-5 h-5 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  Toute action impliquant un montant supérieur à ce seuil sera bloquée pour validation humaine.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Enregistrer les Garde-fous</span>
              </button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Activité Récente de l'Autopilote</span>
            </h3>

            {activity.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500">
                Aucune action autonome enregistrée.
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{item.title}</div>
                        <div className="text-[10px] text-slate-500">{item.timestamp} • {item.impact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
              <AlertCircle className="w-4 h-4" />
              <span>Comment fonctionne la confiance ?</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Le <strong>Trust-Builder™</strong> est conçu pour les PME. Commencez avec un seuil budgétaire bas (ex: 50.000 XOF).
              Au fur et à mesure que vous validez les propositions de l'IA, le système apprend vos critères et vous propose d'augmenter son autonomie.
            </p>
            <ul className="space-y-2 pt-2">
              <li className="flex items-start gap-2 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Réponse instantanée aux nouveaux prospects.</span>
              </li>
              <li className="flex items-start gap-2 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Relances WhatsApp automatiques basées sur la Product Bible.</span>
              </li>
              <li className="flex items-start gap-2 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Zéro risque : Blocage immédiat si anomalie détectée.</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score d'Autonomie Actuel</div>
            <div className="text-4xl font-extrabold text-white font-mono-code">Lv. 1</div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[20%]" />
            </div>
            <p className="text-[10px] text-slate-400">Encore 8 validations manuelles requises pour passer au Niveau 2.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
