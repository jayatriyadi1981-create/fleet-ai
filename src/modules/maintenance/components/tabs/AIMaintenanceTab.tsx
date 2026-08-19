/**
 * Fleet Intelligence Smart AI - AI Predictive Maintenance Hub Tab
 * PROMPT 25 - Deep Predictive Machine Learning, Anomaly Detection & AI Copilot
 */

import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Brain,
  Zap,
  TrendingUp,
  Package,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Truck,
  Activity,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { MOCK_AI_INSIGHTS, MOCK_VEHICLE_HEALTH } from '../../data/mockMaintenanceData';
import { AIMaintenanceService, CopilotMessage } from '../../services/aiMaintenanceService';

export const AIMaintenanceTab: React.FC = () => {
  const insights = MOCK_AI_INSIGHTS;
  const partForecasts = AIMaintenanceService.getPartDemandForecast();

  // AI Copilot state
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Halo! Saya adalah **AI Fleet Maintenance Copilot**. Saya memonitor data telematika sensor, histori perbaikan, dan korelasi konsumsi BBM armada Anda 24/7. Ada yang ingin Anda tanyakan seputar kondisi armada atau proyeksi suku cadang?',
      timestamp: 'Baru saja',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = AIMaintenanceService.askCopilot(q, MOCK_VEHICLE_HEALTH);
      const aiMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            AI Predictive Maintenance & Anomaly Detection Hub
          </h2>
          <p className="text-xs text-slate-400">
            Deteksi dini kegagalan komponen mekanis & kelistrikan sebelum breakdown di jalan menggunakan model prediksi telematika dan korelasi multivariat.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold flex items-center gap-1.5 shrink-0">
          <Brain className="h-3.5 w-3.5" />
          <span>Model AI: FleetGen-v3.8 (Active)</span>
        </span>
      </div>

      {/* Top Predictive Risk Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-400" />
          Peringatan Prediksi Kerusakan Kritis (Predictive Risk Warnings)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="p-5 rounded-2xl border border-cyan-800/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20 shadow-xl space-y-4"
            >
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-400">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{ins.vehiclePlate}</h4>
                    <span className="text-[10px] text-cyan-300 font-mono">Tingkat Risiko: {ins.riskLevel}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-rose-950 text-rose-300 border border-rose-800/50 px-2.5 py-0.5 rounded-full text-xs font-bold block">
                    Skor Risiko: {ins.riskScore}/100
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold mt-0.5 block">
                    Prediksi Rusak: {ins.failureWindowDays || '7-14 hari'}
                  </span>
                </div>
              </div>

              {/* Finding & Evidence */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-200 leading-relaxed font-medium">
                  {ins.finding}
                </p>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Bukti Telemetri & Histori Sensor:</span>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                    {ins.evidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-800/40 flex items-start gap-2 text-xs">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-cyan-200">
                  <strong className="text-cyan-300 block">Rekomendasi AI:</strong>
                  {ins.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Parts Demand Forecasting */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-cyan-400" />
              AI Parts Demand Forecast & Rekomendasi Restock (30 Hari ke Depan)
            </h3>
            <p className="text-xs text-slate-400">
              Prediksi kebutuhan suku cadang gudang berdasarkan pola servis jatuh tempo dan potensi kegagalan komponen armada.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partForecasts.map((f, idx) => (
            <div key={idx} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-white">{f.partName}</h4>
                  <span className="text-[10px] text-slate-400">Stok Saat Ini: <strong>{f.currentStock} unit</strong></span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  f.urgency === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                }`}>
                  {f.urgency} URGENCY
                </span>
              </div>

              <p className="text-xs text-slate-300">{f.reason}</p>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80">
                <span className="text-slate-400">Estimasi Kebutuhan: <strong className="text-white">{f.forecastedDemand30Days} unit</strong></span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-bold">
                  Saran Order: +{f.recommendedOrderQty} unit
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AI Maintenance Copilot */}
      <div className="rounded-2xl border border-cyan-800/40 bg-slate-900/90 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ask AI Maintenance Copilot</h3>
              <p className="text-xs text-slate-400">Asisten cerdas tanya-jawab kondisi pemeliharaan armada secara interaktif.</p>
            </div>
          </div>
        </div>

        {/* Preset Prompt Chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleSendMessage('Kendaraan mana yang paling berisiko breakdown dalam 7 hari ke depan?')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-[11px] font-medium transition-all"
          >
            ⚠️ Unit paling berisiko?
          </button>
          <button
            onClick={() => handleSendMessage('Kendaraan mana dengan biaya maintenance tertinggi?')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-[11px] font-medium transition-all"
          >
            💰 Biaya servis tertinggi?
          </button>
          <button
            onClick={() => handleSendMessage('Spare part apa saja yang stoknya kritis atau habis?')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-[11px] font-medium transition-all"
          >
            📦 Stok spare part kritis?
          </button>
          <button
            onClick={() => handleSendMessage('Apakah ada korelasi antara konsumsi BBM boros dengan masalah rem?')}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-[11px] font-medium transition-all"
          >
            ⛽ Korelasi BBM & Kerusakan?
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="h-64 overflow-y-auto space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-slate-950 font-semibold'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                <span className="text-[9px] opacity-60 block mt-1 text-right">{m.timestamp}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 text-xs flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>AI sedang menganalisis telemetri armada...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tanyakan analisis pemeliharaan armada Anda..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-600/30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
