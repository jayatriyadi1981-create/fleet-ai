/**
 * AI Safety Copilot & Intelligence Insights Tab
 * PROMPT 22 Section 111 - 113
 */

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Lightbulb, ShieldAlert, Cpu } from 'lucide-react';
import { AISafetyService } from '../../services/aiSafetyService';
import { Accident, Incident, NearMiss, CorrectiveAction } from '../../types';

interface AISafetyInsightsTabProps {
  accidents: Accident[];
  incidents: Incident[];
  nearMisses: NearMiss[];
  capas: CorrectiveAction[];
  userRole?: string;
}

export const AISafetyInsightsTab: React.FC<AISafetyInsightsTabProps> = ({
  accidents,
  incidents,
  nearMisses,
  capas,
  userRole = 'COMPANY_ADMIN'
}) => {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; message: string; dataPoints?: any[] }[]>([
    {
      sender: 'ai',
      message: AISafetyService.generateSafetyExecutiveSummary(accidents, incidents, nearMisses, capas),
      dataPoints: [
        { label: 'Skor Safety Armada', value: '87 / 100' },
        { label: 'Top Risk Driver', value: 'Budi Santoso' },
        { label: 'Hotspot Teratas', value: 'Tol Cikampek KM 26A' },
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSendPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt;
    setPrompt('');
    setChatHistory((prev) => [...prev, { sender: 'user', message: userMsg }]);
    setLoading(true);

    const result = await AISafetyService.askSafetyCopilot(userMsg, userRole, accidents, incidents, nearMisses, capas);

    setLoading(false);
    setChatHistory((prev) => [
      ...prev,
      {
        sender: 'ai',
        message: result.reply,
        dataPoints: result.dataPoints,
      },
    ]);
  };

  const sampleQueries = [
    'Apa penyebab utama incident bulan ini?',
    'Driver mana yang membutuhkan coaching?',
    'Tampilkan corrective action yang overdue.',
    'Kenapa safety score cabang Cikarang turun?',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5 backdrop-blur-md flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Safety Copilot & Assistant Intelligence</h3>
            <p className="text-xs text-slate-400">Asisten kecerdasan buatan terenkripsi RBAC untuk analisis keselamatan armada</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
          PERAN SAAT INI: {userRole}
        </span>
      </div>

      {/* Suggested Quick Queries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {sampleQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(q);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-cyan-500/50 text-slate-300 text-xs font-medium whitespace-nowrap transition-colors shrink-0"
          >
            💡 "{q}"
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto">
        {chatHistory.map((item, index) => (
          <div
            key={index}
            className={`flex gap-3 text-xs leading-relaxed ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {item.sender === 'ai' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 space-y-2 ${
                item.sender === 'user'
                  ? 'bg-cyan-600 text-white font-medium self-end rounded-tr-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{item.message}</p>

              {item.dataPoints && item.dataPoints.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  {item.dataPoints.map((dp, dIdx) => (
                    <div key={dIdx} className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{dp.label}</p>
                      <p className="font-bold text-white mt-0.5">{dp.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {item.sender === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 font-bold">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold p-2">
            <Sparkles className="h-4 w-4 animate-spin" /> AI Copilot sedang memproses data telemetri keselamatan...
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendPrompt} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Tanyakan sesuatu tentang keselamatan armada Anda..."
          className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-950"
        >
          <Send className="h-4 w-4" />
          <span>Kirim</span>
        </button>
      </form>
    </div>
  );
};
