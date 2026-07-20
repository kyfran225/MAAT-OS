import React, { useState } from 'react';
import { MissionCategory } from '../../types';
import { X, Target, ShieldAlert } from 'lucide-react';

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (missionData: {
    title: string;
    category: MissionCategory;
    target: string;
    budget: number;
    timeline: string;
    objective: string;
    constraints: string[];
  }) => void;
}

export const CreateMissionModal: React.FC<CreateMissionModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MissionCategory>('marketing');
  const [target, setTarget] = useState('');
  const [budget, setBudget] = useState(10000);
  const [timeline, setTimeline] = useState('30 Jours');
  const [objective, setObjective] = useState('');
  const [constraintInput, setConstraintInput] = useState('');
  const [constraints, setConstraints] = useState<string[]>([
    'Budget à ne pas dépasser',
    'Validation du Founder Brain obligatoire'
  ]);

  if (!isOpen) return null;

  const handleAddConstraint = () => {
    if (constraintInput.trim()) {
      setConstraints([...constraints, constraintInput.trim()]);
      setConstraintInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target || !objective) return;

    onCreate({
      title,
      category,
      target,
      budget,
      timeline,
      objective,
      constraints
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel border-amber-500/30 w-full max-w-2xl rounded-3xl p-6 lg:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Lancer une Nouvelle Mission™</h2>
              <p className="text-xs text-slate-400">Définissez l'objectif métier. Le Moteur Cognitif construira le plan d'action.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Titre de la Mission
            </label>
            <input
              type="text"
              required
              placeholder="ex: Lancement Offre Black Friday ou Entrée Marché Sénégal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Catégorie Métier
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MissionCategory)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="marketing">Marketing & Acquisition</option>
                <option value="sales">Ventes & Pipeline</option>
                <option value="product">Produit & Features</option>
                <option value="finance">Finance & Optimisation</option>
                <option value="hr">RH & Recrutement</option>
                <option value="strategy">Stratégie Globale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Délai Estimé
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Target / Result */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Résultat Vise (Target)
            </label>
            <textarea
              required
              rows={2}
              placeholder="ex: Obtenir 200 clients qualifiés avec un coût d'acquisition < $35"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Objective */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Raison d'être & Contexte (Objectif Couche 1)
            </label>
            <textarea
              required
              rows={2}
              placeholder="Pourquoi faisons-nous cette mission ? Quel est l'enjeu stratégique ?"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Budget Alloué ($ USD)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono-code focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Constraints */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Contraintes (Couche 2)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ajouter une contrainte..."
                value={constraintInput}
                onChange={(e) => setConstraintInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddConstraint}
                className="px-4 py-2 rounded-xl bg-slate-800 text-amber-400 font-bold text-xs hover:bg-slate-700"
              >
                + Ajouter
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {constraints.map((c, idx) => (
                <li key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs font-bold hover:text-white"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20"
            >
              🚀 Générer le Plan Cognitif
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
