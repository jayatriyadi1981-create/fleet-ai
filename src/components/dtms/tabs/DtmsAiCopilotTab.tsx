import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  RefreshCw,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { dtmsService } from '../../../modules/dtms/services/dtmsService';

export const DtmsAiCopilotTab: React.FC = () => {
  const [briefing, setBriefing] = useState<string>(dtmsService.generateAiDailyDtmsBriefing());
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Halo! Saya AI DTMS Operations Copilot. Saya memantau 102 dump truck, match factor shovel, kecepatan jalan hauling, dan kepatuhan payload secara real-time. Ada yang bisa saya analisiskan?'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('match factor') || lower.includes('shovel') || lower.includes('antre')) {
        reply = 'Berdasarkan telemetri saat ini, Excavator EX-101 (Hitachi EX1200) di Pit Central Bench 14 mengalami Match Factor rendah (0.62) yang menyebabkan Shovel sering menunggu. Direkomendasikan memindahkan 2 unit OHT dari Pit North (yang saat ini memiliki antrean padat MF 1.10) ke EX-101 agar ritase meningkat ~18%.';
      } else if (lower.includes('solar') || lower.includes('bbm') || lower.includes('fuel')) {
        reply = 'Rasio konsumsi solar armada Dump Truck hari ini berada di angka 0.38 Liter/Ton, 15.5% lebih hemat dibanding baseline standar (0.45 L/Ton). Unit dengan burn rate terendah adalah Hino FM260JD (1.1 L/KM) di rute datar Jetty.';
      } else if (lower.includes('overload') || lower.includes('timbang')) {
        reply = 'Tercatat 2 unit terdeteksi Overload di atas toleransi 105%, yaitu DT-102 (+6.8 Ton). Sistem telah mengirimkan peringatan auto-limit pass ke operator Shovel untuk mencegah penambahan bucket kelima.';
      } else {
        reply = `Analisis AI untuk "${userText}": Seluruh armada Dump Truck beroperasi dalam parameter stabil dengan Physical Availability (PA) 92.5% dan OTD Ritase 94%. Rekomendasi utama: pertahankan penyiraman jalan di Segmen HR-01 untuk menekan debu.`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div id="dtms-ai-copilot-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>AI Dump Truck Fleet Operations Copilot (Gemini Decision Radar)</span>
          </h2>
          <p className="text-xs text-slate-400">Asisten kecerdasan buatan untuk optimasi siklus hauling, rekayasa match factor shovel & mitigasi bottleneck</p>
        </div>

        <button
          onClick={() => setBriefing(dtmsService.generateAiDailyDtmsBriefing())}
          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh AI Daily Briefing</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Executive Daily Briefing */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>Executive Daily Hauling Briefing (Auto-Generated)</span>
          </div>
          <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {briefing}
          </div>
        </div>

        {/* Interactive AI Chat Assistant */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col h-[520px]">
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4" />
            <span>Tanya AI Dispatch & Fleet Advisor</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 py-4 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-slate-950 border border-slate-800 text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-400 flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Gemini AI sedang menganalisis data telemetri...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-[11px]">
            <button
              onClick={() => setInputQuery('Bagaimana kondisi Match Factor shovel saat ini?')}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 whitespace-nowrap"
            >
              Cek Match Factor Shovel
            </button>
            <button
              onClick={() => setInputQuery('Analisis efisiensi konsumsi solar')}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 whitespace-nowrap"
            >
              Efisiensi Solar
            </button>
            <button
              onClick={() => setInputQuery('Apakah ada insiden overload hari ini?')}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 whitespace-nowrap"
            >
              Cek Overload
            </button>
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Ketik pertanyaan untuk AI Fleet Copilot..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isGenerating}
              className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
