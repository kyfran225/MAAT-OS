import React, { useState } from 'react';
import {
  Users, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Search, 
  CheckCircle2, 
  Bot, 
  ChevronRight, 
  Building2, 
  Mail, 
  Phone, 
  X,
  FileText,
  Copy,
  Check,
  Zap,
  Layout
} from 'lucide-react';
import { CRMContact, CRMContactStatus, CRMPipelineStage, PublicForm } from '../../types';

interface SalesOSModuleProps {
  contacts: CRMContact[];
  onAddContact: (contact: CRMContact) => void;
  onUpdateContactStatus: (id: string, newStatus: CRMContactStatus) => void;
}

const STAGES: CRMPipelineStage[] = [
  { id: 'nouveau', label: 'Nouveaux Leads', count: 0, totalValue: 0, color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { id: 'qualifie', label: 'Qualifiés IA', count: 0, totalValue: 0, color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'proposition', label: 'Propositions En Cours', count: 0, totalValue: 0, color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { id: 'client', label: 'Clients Gagnés', count: 0, totalValue: 0, color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' }
];

const SAMPLE_FORMS: PublicForm[] = [
  {
    id: 'form-001',
    title: 'Demande de Devis PME Express',
    active: true,
    submissionCount: 12,
    fields: [
      { id: 'f1', label: 'Nom complet', type: 'text', required: true },
      { id: 'f2', label: 'Email Pro', type: 'email', required: true },
      { id: 'f3', label: 'Budget estimé', type: 'number', required: false }
    ]
  }
];

export const SalesOSModule: React.FC<SalesOSModuleProps> = ({
  contacts,
  onAddContact,
  onUpdateContactStatus
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'list' | 'forms'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [forms, setForms] = useState<PublicForm[]>(SAMPLE_FORMS);
  const [copiedFormId, setCopiedFormId] = useState<string | null>(null);

  // New Lead Form state
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newIndustry, setNewIndustry] = useState('Services & Consulting');
  const [newBudget, setNewBudget] = useState(15000);
  const [newNotes, setNewNotes] = useState('');

  // Form Builder state
  const [formTitle, setFormTitle] = useState('');

  const filteredContacts = contacts.filter((c) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateStageStats = (stageId: CRMContactStatus) => {
    const stageContacts = contacts.filter((c) => c.status === stageId);
    const count = stageContacts.length;
    const totalValue = stageContacts.reduce((acc, curr) => acc + curr.estimatedBudget, 0);
    return { count, totalValue };
  };

  const totalPipelineValue = contacts.reduce((acc, curr) => acc + curr.estimatedBudget, 0);
  const qualifiedCount = contacts.filter((c) => c.status === 'qualifie' || c.status === 'proposition' || c.status === 'client').length;
  const conversionRate = contacts.length > 0 ? Math.round((contacts.filter(c => c.status === 'client').length / contacts.length) * 100) : 0;

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCompany) return;

    const newContact: CRMContact = {
      id: `crm-${Date.now()}`,
      name: newName,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@${newCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: newPhone || '+225 01 02 03 04',
      company: newCompany,
      industry: newIndustry,
      status: 'nouveau',
      estimatedBudget: Number(newBudget),
      tags: ['Inbound Sales OS', 'Lead PME'],
      createdAt: new Date().toISOString().split('T')[0],
      lastContactDate: new Date().toISOString().split('T')[0],
      notes: newNotes,
      aiAnalysis: {
        qualificationScore: 85,
        buyerIntentScore: 80,
        recommendedAgent: 'Sales Director Agent™',
        nextAction: 'Lancer l\'analyse cognitive et l\'onboarding automatique.',
        keyInsights: [
          'Prospect ajouté directement via le formulaire Sales OS PME.',
          'Alignement estimé fort avec la proposition de valeur.'
        ]
      }
    };

    onAddContact(newContact);
    setShowAddModal(false);

    // Reset form
    setNewName('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
  };

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    const newForm: PublicForm = {
      id: `form-${Math.random().toString(36).substr(2, 9)}`,
      title: formTitle,
      active: true,
      submissionCount: 0,
      fields: [
        { id: 'f1', label: 'Nom complet', type: 'text', required: true },
        { id: 'f2', label: 'Email', type: 'email', required: true }
      ]
    };
    setForms([...forms, newForm]);
    setShowFormBuilder(false);
    setFormTitle('');
  };

  const handleCopyLink = (id: string) => {
    const url = `https://maat-studio.ai/p/form/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedFormId(id);
    setTimeout(() => setCopiedFormId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono-code font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>SALES OS & CRM PME • CUSTOMER BRAIN™</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Pipeline Commercial & Collecte de Leads PME</h1>
          <p className="text-xs text-slate-400 mt-1">
            Chaque prospect alimente le Customer Brain™ pour qualifier et accélérer les conversions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFormBuilder(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-2 shrink-0 shadow-lg"
          >
            <Layout className="w-4 h-4 text-purple-400" />
            <span>Créer Formulaire</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Lead PME</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Total Contacts PME</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">{contacts.length}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono-code">
            <TrendingUp className="w-3 h-3" />
            <span>Base synchronisée avec le Knowledge Graph</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Valeur du Pipeline</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono-code">
            ${totalPipelineValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-mono-code">Budget estimé sous gestion</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Leads Qualifiés IA</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 font-mono-code">{qualifiedCount}</div>
          <div className="text-[11px] text-purple-400 font-mono-code">Score de conversion &gt; 75%</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Taux de Conversion</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono-code">{conversionRate}%</div>
          <div className="text-[11px] text-emerald-400 font-mono-code">{forms.filter(f => f.active).length} formulaires actifs</div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-full sm:w-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'pipeline' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vue Pipeline
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'list' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Liste Contacts
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'forms' ? 'bg-purple-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Capture de Leads
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher prospect, PME..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* TAB 1: PIPELINE KANBAN */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map((stage) => {
            const stageContacts = filteredContacts.filter((c) => c.status === stage.id);
            const { totalValue } = calculateStageStats(stage.id);

            return (
              <div key={stage.id} className="glass-panel p-4 rounded-2xl space-y-4 flex flex-col min-h-[450px]">
                {/* Stage Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className={`text-xs font-bold font-mono-code px-2.5 py-1 rounded-full border ${stage.color}`}>
                      {stage.label}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1.5 font-mono-code">
                      ${totalValue.toLocaleString()} • {stageContacts.length} prospect{stageContacts.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Stage Contacts */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {stageContacts.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs italic">
                      Aucun prospect dans cette étape
                    </div>
                  ) : (
                    stageContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer space-y-3 shadow-md group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {contact.name}
                            </h4>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              <span>{contact.company}</span>
                            </div>
                          </div>

                          <span className="text-xs font-mono-code font-bold text-emerald-400">
                            ${contact.estimatedBudget.toLocaleString()}
                          </span>
                        </div>

                        {/* AI Score Badge */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                          <div className="flex items-center gap-1.5 text-[11px] text-purple-300 font-mono-code">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>IA Score: {contact.aiAnalysis.qualificationScore}%</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-cyan-400 font-bold">
                            <span>Fiche</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: FORMS VIEW */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <div key={form.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-purple-500/30 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${form.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    {form.active ? 'Actif' : 'Inactif'}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{form.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{form.fields.length} champs • {form.submissionCount} soumissions</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleCopyLink(form.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white transition-all"
                  >
                    {copiedFormId === form.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormId === form.id ? 'Copié' : 'Copier le lien'}</span>
                  </button>

                  <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowFormBuilder(true)}
              className="glass-panel p-6 rounded-3xl border border-dashed border-slate-800 flex flex-col items-center justify-center space-y-3 hover:bg-slate-900/40 transition-all group"
            >
              <div className="p-3 rounded-full bg-slate-900 border border-slate-800 group-hover:border-purple-500/50 transition-all">
                <Plus className="w-6 h-6 text-slate-500 group-hover:text-purple-400" />
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-white">Nouveau Formulaire de Capture</span>
            </button>
          </div>
        </div>
      )}

      {/* FORM BUILDER MODAL */}
      {showFormBuilder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateForm} className="glass-panel w-full max-w-lg rounded-3xl p-6 lg:p-8 space-y-6 border border-purple-500/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-purple-400" />
                <span>Configurateur de Formulaire Public</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowFormBuilder(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Titre du Formulaire</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="ex: Inscription Newsletter ou Demande de Devis"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-3">
                <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Champs par défaut (Automatiques)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Nom complet</span>
                    <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">Requis</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>E-mail</span>
                    <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">Requis</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  L'IA de MAAT Studio analysera chaque soumission pour qualifier automatiquement le lead dans votre Sales OS.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Générer le Formulaire Public</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: LIST VIEW */}
      {activeTab === 'list' && (
        <div className="glass-panel p-6 rounded-3xl overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono-code uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Prospect & Entreprise</th>
                <th className="pb-3 px-3">Secteur</th>
                <th className="pb-3 px-3">Statut</th>
                <th className="pb-3 px-3">Budget Estimé</th>
                <th className="pb-3 px-3">Score IA</th>
                <th className="pb-3 px-3">Action IA Recommandée</th>
                <th className="pb-3 px-3 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredContacts.map((contact) => (
                <tr 
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{contact.name}</div>
                    <div className="text-[11px] text-slate-400">{contact.company}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">{contact.industry}</td>
                  <td className="py-3.5 px-3">
                    <span className="capitalize font-mono-code text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                      {contact.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono-code font-bold text-amber-400">
                    ${contact.estimatedBudget.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono-code font-bold text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      {contact.aiAnalysis.qualificationScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">
                    {contact.aiAnalysis.nextAction}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-300 text-[11px] font-bold">
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTACT DETAIL MODAL */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 lg:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-cyan-500/30">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-heading text-white">{selectedContact.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono-code text-xs font-bold border border-cyan-500/30">
                    {selectedContact.company}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-4">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {selectedContact.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> {selectedContact.phone}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Sales Qualification Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>Analyse Cognitive par l'Agent Sales OS</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-400">
                    Intent: <span className="font-bold text-emerald-400 font-mono-code">{selectedContact.aiAnalysis.buyerIntentScore}%</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Score: <span className="font-bold text-purple-400 font-mono-code">{selectedContact.aiAnalysis.qualificationScore}/100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-300 font-bold">Prochaine action recommandée :</div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-purple-200">
                  {selectedContact.aiAnalysis.nextAction}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-300 font-bold">Key Insights Customer Brain :</div>
                <ul className="space-y-1">
                  {selectedContact.aiAnalysis.keyInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Change Status */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Déplacer le Prospect dans le Pipeline
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STAGES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onUpdateContactStatus(selectedContact.id, st.id);
                      setSelectedContact({ ...selectedContact, status: st.id });
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedContact.status === st.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW LEAD FORM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateContact} className="glass-panel w-full max-w-lg rounded-3xl p-6 lg:p-8 space-y-5 border border-cyan-500/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-white">Nouveau Lead PME (Formulaire Sales OS)</h3>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nom du Contact *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ex: Jean Koffi"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nom de la PME / Entreprise *</label>
              <input
                type="text"
                required
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="ex: West Africa Logistics"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">E-mail</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="contact@pme.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Téléphone / WhatsApp</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+225 07 00 00 00"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Secteur</label>
                <input
                  type="text"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Budget Estimé ($)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Notes & Demande du prospect</label>
              <textarea
                rows={2}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Description du besoin ou message du formulaire..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter & Qualifier via l'IA</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
