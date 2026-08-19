/**
 * Fleet Intelligence Smart AI - AI Route Advisor Tab
 * Interactive AI recommendations, evidence verification, trade-offs,
 * decision approval/rejection, and natural language Copilot chat capabilities.
 */

import React, { useState } from 'react';
import { AIRouteRecommendation } from '../../types';
import { aiRouteAdvisorEngine } from '../../engines/AIRouteAdvisorEngine';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Send, 
  Bot, 
  User, 
  Layers, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface AIRouteAdvisorTabProps {
  onExplainAI: (rec: AIRouteRecommendation) => void;
}

export const AIRouteAdvisorTab: React.FC<AIRouteAdvisorTabProps> = ({ onExplainAI }) => {
  const [recommendations, setRecommendations] = useState<AIRouteRecommendation[]>(
    aiRouteAdvisorEngine.getAllRecommendations()
  );
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string; time: string }>>([
    {
      role: 'ai',
      text: 'Halo Dispatcher! Saya AI Route Advisor. Saya memantau 42 perjalanan aktif, mendeteksi kemacetan ruas tol Cikunir, dan siap membantu optimasi rute serta alokasi armada.',
      time: '08:30 WIB',
    },
  ]);

  const handleUpdateStatus = (id: string, status: 'APPROVED' | 'REJECTED' | 'APPLIED') => {
    aiRouteAdvisorEngine.updateRecommendationStatus(id, status);
    setRecommendations([...aiRouteAdvisorEngine.getAllRecommendations()]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userText, time: new Date().toLocaleTimeString().slice(0, 5) + ' WIB' },
    ]);
    setChatInput('');

    setTimeout(() => {
      let reply = 'Berdasarkan data telematika live dan model prediksi ETA, jalur alternatif melalui Tol Elevated MBZ direkomendasikan dengan estimasi efisiensi waktu 18 menit vs Tol Bawah.';
      if (userText.toLowerCase().includes('solar') || userText.toLowerCase().includes('bbm') || userText.toLowerCase().includes('fuel')) {
        reply = 'Konsumsi BBM diperkirakan hemat 3.4 liter per rit jika armada diberangkatkan sebelum pukul 06:00 pagi untuk menghindari kemacetan stop-and-go di ruas Cikunir.';
      } else if (userText.toLowerCase().includes('radiator') || userText.toLowerCase().includes('maintenance')) {
        reply = 'Unit B 9012 GH terindikasi memiliki risiko panas radiator pada sistem CAN-bus. Disarankan tidak dialokasikan ke tanjakan Cipularang hari ini.';
      }

      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: reply, time: new Date().toLocaleTimeString().slice(0, 5) + ' WIB' },
      ]);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Recommendations Cards (8 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Rekomendasi Rute & Reroute Otomatis AI
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {recommendations.filter((r) => r.status === 'PENDING_REVIEW').length} Perlu Review
          </span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => {
            const isPending = rec.status === 'PENDING_REVIEW';
            const isApproved = rec.status === 'APPROVED' || rec.status === 'APPLIED';

            return (
              <div
                key={rec.id}
                className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3"
              >
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {rec.category}
                      </span>
                      {rec.plateNumber && (
                        <span className="text-xs font-mono font-bold text-white">{rec.plateNumber}</span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1 leading-snug">{rec.title}</h4>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    isApproved ? 'bg-emerald-500/20 text-emerald-300' :
                    rec.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {rec.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rec.why}</p>

                {/* Evidence snippet */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="text-[11px] font-bold text-cyan-400">Bukti Telemetri Pendukung:</div>
                  {rec.evidence.slice(0, 2).map((ev, i) => (
                    <div key={i} className="text-slate-400 text-[11px] flex items-start gap-1">
                      <span>•</span> <span>{ev}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400">
                  <strong>Trade-off: </strong> {rec.tradeOffs}
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onExplainAI(rec)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Detail Transparansi AI <ArrowRight className="h-3 w-3" />
                  </button>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(rec.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(rec.id, 'APPROVED')}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg transition-all"
                      >
                        Setujui & Terapkan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: AI Dispatcher Copilot Chat (5 cols) */}
      <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[650px] overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2">
          <Bot className="h-5 w-5 text-cyan-400" />
          <div>
            <h4 className="text-sm font-bold text-white">AI Route Advisor Copilot</h4>
            <span className="text-[10px] text-emerald-400 font-semibold">● Online • Siap Menjawab Pertanyaan Rute</span>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
              }`}>
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-cyan-500 text-slate-950 font-medium'
                  : 'bg-slate-950 border border-slate-800 text-slate-200'
              }`}>
                <p>{m.text}</p>
                <span className={`text-[9px] block mt-1 ${m.role === 'user' ? 'text-slate-900' : 'text-slate-500'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tanyakan analisis rute, delay, penghematan BBM..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
