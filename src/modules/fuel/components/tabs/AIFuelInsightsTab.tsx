/**
 * Fleet Intelligence Smart AI - AI Fuel Insights & Copilot Tab
 * PROMPT 24 - Neutral Observational Terms, Executive Summary & Interactive AI Copilot
 */

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { generateFuelExecutiveSummary, askFuelAiCopilot } from '../../services/aiFuelService';
import { FuelAnomaly, RefuelingEvent, FuelConsumption } from '../../types';

interface AIFuelInsightsTabProps {
  anomalies: FuelAnomaly[];
  refuelings: RefuelingEvent[];
  consumptions: FuelConsumption[];
}

export const AIFuelInsightsTab: React.FC<AIFuelInsightsTabProps> = ({
  anomalies,
  refuelings,
  consumptions,
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'USER' | 'AI'; text: string }>>([
    {
      sender: 'AI',
      text: 'Halo! Saya Fuel AI Copilot. Saya siap membantu Anda menganalisis konsumsi BBM, melacak indikasi fuel drain, atau memberikan saran efisiensi rute.',
    },
  ]);

  const summary = generateFuelExecutiveSummary(anomalies, refuelings, consumptions);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const userText = userQuery;
    setUserQuery('');

    setChatLog((prev) => [...prev, { sender: 'USER', text: userText }]);

    setTimeout(() => {
      const aiReply = askFuelAiCopilot(userText, consumptions, anomalies, refuelings);
      setChatLog((prev) => [...prev, { sender: 'AI', text: aiReply }]);
    }, 600);
  };

  const handleQuickPrompt = (prompt: string) => {
    setUserQuery(prompt);
  };

  return (
    <div className="space-y-6">
      {/* AI Executive Summary Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-cyan-800/40 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-cyan-300">Rangkuman Eksekutif AI Telematics BBM</h3>
        </div>

        <p className="text-xs text-white font-semibold leading-relaxed">{summary.headline}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400">Temuan Efisiensi Utama</h4>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              {summary.keyInsights.map((ins, i) => (
                <li key={i}>{ins}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400">Observasi Anomali Lapangan</h4>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              {summary.anomaliesObserved.map((obs, i) => (
                <li key={i}>{obs}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Ask Fuel AI Copilot Chat */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Ask Fuel AI Copilot (Tanya AI Real-Time)</h3>
          </div>
          <span className="text-[11px] text-slate-400">Gunakan Bahasa Indonesia atau Inggris</span>
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleQuickPrompt('Kendaraan mana yang paling boros minggu ini?')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 transition-all"
          >
            "Kendaraan mana paling boros minggu ini?"
          </button>
          <button
            onClick={() => handleQuickPrompt('Berapa total biaya BBM bulan ini?')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 transition-all"
          >
            "Berapa total biaya BBM bulan ini?"
          </button>
          <button
            onClick={() => handleQuickPrompt('Ada indikasi fuel drain hari ini?')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-rose-300 transition-all"
          >
            "Ada indikasi fuel drain hari ini?"
          </button>
        </div>

        {/* Chat Log Window */}
        <div className="h-64 overflow-y-auto space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-2xl space-y-1 ${
                msg.sender === 'USER'
                  ? 'ml-auto bg-cyan-950 text-cyan-100 border border-cyan-800/60'
                  : 'bg-slate-900 text-slate-200 border border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                {msg.sender === 'USER' ? 'Pengguna Ops' : 'Fuel AI Copilot'}
              </div>
              <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ketik pertanyaan seputar konsumsi BBM, biaya, atau anomali..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
          >
            <Send className="h-4 w-4" /> Kirim
          </button>
        </form>
      </div>
    </div>
  );
};
