import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  FileText,
  Search,
  Sparkles,
  Brain,
  Database,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { knowledgeGraphService } from '../../services/knowledgeGraphService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}

export const DeepRAGChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Bonjour ! Je suis le Deep RAG Chat™ de MAAT Studio. Je peux répondre à vos questions complexes en analysant tous les documents, emails et conversations WhatsApp que vous avez ingérés. Que souhaitez-vous savoir ?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to new sources to know what we can "chat" with
    const unsubscribe = knowledgeGraphService.subscribe((newNode) => {
      if (newNode.category === 'document') {
        setAvailableSources(prev => [...new Set([newNode.label, ...prev])]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate RAG Logic (Semantic Search + LLM Response)
    setTimeout(() => {
      let responseContent = "D'après les documents ingérés dans votre Multi-Brain System, je n'ai pas trouvé d'information spécifique sur ce sujet. Pouvez-vous préciser votre demande ?";
      let detectedSources: string[] = [];

      // Simple keyword matching for demo logic
      if (input.toLowerCase().includes('contrat') || input.toLowerCase().includes('garantie')) {
        responseContent = "J'ai analysé le fichier 'Dossier_Nouveaux_Devis_et_Contrats.zip'. Les clauses de garantie standard prévoient une couverture de 30 jours pour tout défaut de conformité technique. Il n'y a pas de mention de prolongation pour les PME hors zone EMEA.";
        detectedSources = ['Dossier_Nouveaux_Devis_et_Contrats.zip'];
      } else if (input.toLowerCase().includes('whatsapp') || input.toLowerCase().includes('client')) {
        responseContent = "L'analyse des flux WhatsApp Business Live montre que 84% des prospects PME s'interrogent sur les délais d'implémentation. Le sentiment global est positif (8.4/10), mais une objection récurrente sur le prix de l'offre Premium a été détectée.";
        detectedSources = ['Flux_WhatsApp_Business_Live.stream'];
      } else if (input.toLowerCase().includes('marge') || input.toLowerCase().includes('budget')) {
        responseContent = "D'après vos fichiers comptables 2025, votre marge brute moyenne est de 68%. Le seuil de rentabilité mensuel est fixé à $14,500. Le budget marketing actuel de $5,000 permettrait d'atteindre ce seuil en 4 mois d'après les dernières simulations.";
        detectedSources = ['Bilan_Comptable_et_Budget_2025.xlsx'];
      } else {
        responseContent = `J'ai exploré vos ${availableSources.length} sources actives. Cette thématique semble transverse : je vous recommande de créer une mission d'exploration pour que le Conseil d'Administration approfondisse l'analyse.`;
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        sources: detectedSources.length > 0 ? detectedSources : undefined,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[500px] space-y-4">
      {/* Header */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Deep RAG Chat™
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-code uppercase">Live Semantic Search</span>
            </h2>
            <p className="text-[10px] text-slate-400">Interrogez votre base de connaissances en langage naturel.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono-code text-slate-400">
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>{availableSources.length} Sources Indexées</span>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 glass-panel rounded-3xl p-4 lg:p-6 overflow-hidden flex flex-col relative border border-slate-800">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                <div className={`flex items-center gap-2 mb-1`}>
                  {msg.role === 'assistant' && <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><Bot className="w-3.5 h-3.5" /></div>}
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono-code">
                    {msg.role === 'user' ? 'Vous' : 'MAAT Intelligence'} • {msg.timestamp}
                  </span>
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}>
                  {msg.content}
                </div>

                {msg.sources && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.sources.map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
                        <FileText className="w-3 h-3 text-blue-400" />
                        <span>Source : {s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] font-mono-code text-slate-500">Exploration du Knowledge Graph...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-6 border-t border-slate-800 pt-4">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: 'Quelles sont les objections récurrentes sur WhatsApp ?'"
              className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500/50 placeholder-slate-600 shadow-inner"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:brightness-110 disabled:opacity-50 shadow-lg shadow-purple-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="flex items-center justify-center gap-6 mt-3 text-[10px] text-slate-500 font-mono-code">
            <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /><span>Données Chiffrées</span></div>
            <div className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-500" /><span>Analyse RAG 6-Couches</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
