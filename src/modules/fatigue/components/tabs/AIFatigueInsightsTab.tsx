/**
 * Fleet Intelligence Smart AI - AI Fatigue Insights & Copilot Tab
 * PROMPT 23 - AI Fatigue Intelligence (/app/fatigue/ai-insights)
 */

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, CheckCircle2, AlertTriangle, ShieldAlert, ArrowUpRight, MessageSquare } from 'lucide-react';
import { DriverFatigueProfile, FatigueAlert } from '../../types';
import { generateFatigueExecutiveSummary, askFatigueAiCopilot } from '../../services/aiFatigueService';

interface AIFatigueInsightsTabProps {
  profiles: DriverFatigueProfile[];
  alerts: FatigueAlert[];
  onOpenDriverModal: (profile: DriverFatigueProfile) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  confidence?: string;
  factors?: string[];
}

export const AIFatigueInsightsTab: React.FC<AIFatigueInsightsTabProps> = ({
  profiles,
  alerts,
  onOpenDriverModal,
}) => {
  const summary = generateFatigueExecutiveSummary(profiles, alerts);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Halo! Saya AI Fatigue Intelligence Copilot. Saya siap menjawab pertanyaan seputar risiko kelelahan pengemudi, paparan mengemudi malam, kepatuhan jam istirahat, dan statistik shift armada Anda.',
    },
  ]);

  const handleSendQuery = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Process via Copilot Engine
    setTimeout(() => {
      const res = askFatigueAiCopilot(q, profiles, alerts, 'fleet_manager');
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        confidence: res.confidence,
        factors: res.factors,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  const samplePrompts = [
    'Driver mana yang memiliki risiko fatigue tertinggi hari ini?',
    'Berapa driver yang melewati batas driving hours?',
    'Bagaimana kondisi fatigue shift malam?',
    'Tampilkan driver dengan rest compliance rendah.',
  ];

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Ringkasan Eksekutif AI Fatigue Intelligence</h3>
            <p className="text-xs text-slate-400">Analisis Otomatis 30 Hari Terakhir</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{summary.executiveSummary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Key Risk Patterns */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Key Risk Patterns Terdeteksi</h4>
            <div className="space-y-2">
              {summary.keyRiskPatterns.map((pattern, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span>{pattern.title}</span>
                    <span className="text-cyan-400 font-semibold">{pattern.confidence} Confidence</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{pattern.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Recommendations */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Rekomendasi Operasional AI</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {summary.operationalRecommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ask Fatigue AI Copilot Interactive Chat Drawer */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Ask Fatigue AI Copilot</h3>
        </div>

        {/* Prompt Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Rekomendasi Pertanyaan:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(prompt)}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs rounded-full transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Chat Box Area */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl min-h-[220px] max-h-[360px] overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 text-xs ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-xl max-w-[80%] space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                {msg.confidence && (
                  <div className="pt-1.5 border-t border-slate-800 text-[10px] text-cyan-400 font-medium">
                    AI Confidence: {msg.confidence} • Factors: {msg.factors?.join(', ')}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="p-2 bg-slate-800 rounded-lg text-slate-300 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            placeholder="Tanyakan analisis fatigue, driver risikologis, atau aturan shift..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSendQuery()}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Send className="w-4 h-4" />
            Tanya AI
          </button>
        </div>
      </div>
    </div>
  );
};
