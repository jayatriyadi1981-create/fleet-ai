import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Brain,
  Send,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers
} from 'lucide-react';
import { pudService } from '../../../modules/pud/services/pudService';

export const PudAiCopilotTab: React.FC = () => {
  const [briefing, setBriefing] = useState<string>(pudService.generateAiDailyPudBriefing());
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Halo! Saya AI PUD Operations Copilot. Saya dapat membantu menganalisis kemacetan lalu lintas rute, prediksi risiko keterlambatan SLA, rekomendasi re-balancing kurir, serta rekonsiliasi kas COD.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQ = query;
    setChatLog(prev => [...prev, { sender: 'user', text: userQ }]);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = '';
      const lower = userQ.toLowerCase();
      if (lower.includes('macet') || lower.includes('traffic') || lower.includes('rute')) {
        responseText = 'Berdasarkan data radar telematika dan Google Traffic API, terdeteksi antrean kendaraan di simpang Kuningan (Jl. Rasuna Said). Disarankan sistem membelokkan rute kurir Van B 9044 SXR ke jalur alternatif Jl. Denpasar Selatan untuk menjaga SLA Same-Day tetap di bawah 4 jam.';
      } else if (lower.includes('cod') || lower.includes('kasir') || lower.includes('setor')) {
        responseText = 'Rekapitulasi kasir mencatat Rp 18.450.000 total tagihan COD hari ini, dengan Rp 14.200.000 telah disetor fisik ke Hub Kuningan. Sisa Rp 4.250.000 berada di 2 kurir on-duty yang dijadwalkan tutup buku pukul 16:30 WIB tanpa terdeteksi selisih (zero discrepancy).';
      } else if (lower.includes('kurir') || lower.includes('beban') || lower.includes('rebalancing')) {
        responseText = 'Analisis beban menunjukkan Hub Tangerang BSD mengalami lonjakan permintaan paket +40%. Disarankan mengirim 2 kurir cadangan dari Hub Jakarta Barat untuk membantu pengantaran shift siang.';
      } else {
        responseText = `Analisis AI untuk "${userQ}": Semua parameter operasional PUD berjalan dalam batas SLA normal (97.4% OTD, 96.2% FADR). Tidak terdeteksi anomali kritis pada sistem dispatching saat ini.`;
      }

      setChatLog(prev => [...prev, { sender: 'ai', text: responseText }]);
      setIsTyping(false);
    }, 600);
  };

  const handleRegenerate = () => {
    setBriefing(pudService.generateAiDailyPudBriefing());
  };

  return (
    <div className="space-y-6" id="pud-ai-copilot-tab">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
              Gemini 2.5 Multi-Modal Dispatching
            </span>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Neural Traffic & Capacity Predictor
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            AI PUD Operations Copilot & Decision Radar
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Asisten cerdas pendukung dispatcher untuk mendeteksi potensi breach SLA, rekomendasi re-routing, dan optimasi utilisasi kurir.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          <span>Generate Ulang Briefing</span>
        </button>
      </div>

      {/* Grid: Daily Executive Briefing vs Interactive Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Generated Briefing Document */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              Executive Daily Briefing (AI Generated)
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Live Auto-Generated</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono whitespace-pre-line text-slate-800 leading-relaxed max-h-[440px] overflow-y-auto">
            {briefing}
          </div>
        </div>

        {/* Right: Interactive AI Chat */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                Tanya AI Dispatcher (Interactive Assistant)
              </h3>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleAsk} className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Tanyakan status kemacetan, audit COD, atau alokasi kurir..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={!query.trim() || isTyping}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
