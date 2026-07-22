import React, { useState } from 'react';
import {
  Settings,
  Database,
  MessageSquare,
  Mail,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Key,
  RefreshCw,
  Link2
} from 'lucide-react';

export const ConnectorSettings: React.FC = () => {
  const [hubspotKey, setHubspotKey] = useState('************************');
  const [whatsappKey, setWhatsappKey] = useState('************************');
  const [sendgridKey, setSendgridKey] = useState('************************');

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 text-xs font-mono-code font-bold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>CONFIGURATION SYSTÈME • CONNECTEURS CRM</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Centre d'Intégration & API</h1>
          <p className="text-xs text-slate-400 mt-1">
            Connectez votre "Cerveau de l'OS" aux outils du marché pour automatiser vos actions réelles.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" /> : <RefreshCw className="w-4 h-4" />}
          <span>{isSyncing ? 'Synchronisation...' : 'Tout Synchroniser'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Settings Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* HubSpot Connector */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">HubSpot CRM</h3>
                  <p className="text-[11px] text-slate-500">Synchronisation des contacts et du pipeline commercial.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connecté</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Clé API / Token d'accès privé</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={hubspotKey}
                    onChange={(e) => setHubspotKey(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-orange-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400">Sync Contacts: ON</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400">Sync Deals: ON</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400">Auto-Qualification: IA</span>
              </div>
            </div>
          </div>

          {/* WhatsApp / Meta Connector */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">WhatsApp Business API</h3>
                  <p className="text-[11px] text-slate-500">Envoi de relances et capture de leads via chat.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-500 text-[10px] font-bold">
                <Link2 className="w-3.5 h-3.5" />
                <span>Non Configuré</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Identifiant de numéro de téléphone (Phone ID)</label>
                <input
                  type="text"
                  value={whatsappKey}
                  onChange={(e) => setWhatsappKey(e.target.value)}
                  placeholder="ID Meta Business..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>
              <button className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400 transition-all">
                Lancer le couplage Meta
              </button>
            </div>
          </div>

          {/* Email / SendGrid Connector */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Email Outreach (SendGrid/Postmark)</h3>
                <p className="text-[11px] text-slate-500">Passerelle d'envoi pour les propositions et audits.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Clé API SendGrid</label>
              <input
                type="password"
                value={sendgridKey}
                onChange={(e) => setSendgridKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="text-xs text-slate-300 font-mono-code">Status: Mode Simulation Actif {syncStatus === 'success' ? '(Synchro Réussie)' : ''}</span>
              </div>
              <button className="text-[10px] font-bold text-cyan-400 uppercase hover:underline">Activer Real-Mode</button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
              <Zap className="w-4 h-4" />
              <span>Note sur la Sécurité</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vos clés API sont chiffrées au repos et ne sont jamais transmises aux agents IA sous forme de texte clair.
              Le "Cerveau de l'OS" utilise des jetons éphémères pour exécuter les missions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logs de Synchronisation</h4>
            <div className="space-y-3">
              {[
                { time: 'Il y a 2h', msg: 'Sync HubSpot : 4 contacts qualifiés.', status: 'success' },
                { time: 'Il y a 5h', msg: 'Echec Webhook WhatsApp : Invalid Token.', status: 'error' },
                { time: 'Hier', msg: 'Importation des deals HubSpot terminée.', status: 'success' }
              ].map((log, i) => (
                <div key={i} className="flex gap-3">
                  {log.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                  <div>
                    <div className="text-[11px] text-slate-300">{log.msg}</div>
                    <div className="text-[9px] text-slate-500 font-mono-code">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
