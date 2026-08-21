import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Droplets,
  Layers,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const TankerAiCopilotTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Halo! Saya AI Tanker Operations & Hazmat Safety Copilot. Saya memantau telemetri bejana tangki (volume, temperatur, densitas), deteksi anomali susut transit (losses), peringatan rollover tikungan ekstrem, serta panduan SOP tanggap darurat B3 secara real-time. Ada yang bisa saya bantu hari ini?',
      timestamp: '07:30'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');

    setTimeout(() => {
      let replyText =
        'Berdasarkan telemetri tangki dan regulasi keselamatan B3 KLHK, seluruh parameter armada saat ini dalam kondisi optimal dan aman (Zero-Spill).';

      if (query.includes('susut') || query.includes('losses') || query.includes('kencing')) {
        replyText =
          'Deteksi Anomali Susut: Analisis sensor kompartemen TANK-BBM-2401 menunjukkan variansi susut 0.05% (-12 Liter) yang diakibatkan oleh ekspansi termal normal (suhu muat 30.2°C vs ambien 31°C). Tidak terdeteksi pembukaan katup bawah atau penghentian di Zona Merah (Red Zone).';
      } else if (query.includes('rollover') || query.includes('tikungan') || query.includes('sloshing')) {
        replyText =
          'Rekomendasi Stabilitas Dinamika Cairan: Untuk muatan kompartemen tidak penuh (<80%), disarankan kecepatan maksimal saat memasuki tikungan tajam Pantura & Cadas Pangeran adalah 35 km/h untuk menjaga Lateral G-Force < 0.25 G guna mencegah risiko guling.';
      } else if (query.includes('cuci') || query.includes('cleaning') || query.includes('cpo')) {
        replyText =
          'SOP Pergantian Muatan (Previous Cargo): Truk CPO-TAN-3208 yang beralih dari CPO ke Minyak Goreng Curah (RPO) WAJIB menjalani Steam Wash 85°C + Caustic Wash 2% dan pengeringan gas Nitrogen (N2 Purging) hingga hasil uji VOC 0 PPM sebelum muat baru.';
      }

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 800);
  };

  return (
    <div id="tanker-ai-copilot-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>AI Tanker Operations Copilot & Anomaly Detector</span>
          </h2>
          <p className="text-xs text-slate-400">
            Asisten cerdas pendeteksi anomali densitas/suhu volume cairan, rekomendasi rute koridor bebas zona rawan, dan audit kepatuhan B3 otomatis.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
            GEMINI TANKER INTELLIGENCE ACTIVE
          </span>
        </div>
      </div>

      {/* Main Interactive Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Chat Window */}
        <div className="lg:col-span-8 flex flex-col h-[520px] bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex-1 overflow-y-auto space-y-3 p-2 no-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start space-x-2.5 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`text-[9px] block mt-1 font-mono ${
                      m.sender === 'user' ? 'text-slate-900/70 text-right' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Tanyakan analisis susut losses, rute aman hazmat, atau SOP pencucian..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1 shadow-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim</span>
            </button>
          </form>
        </div>

        {/* Right: Quick Prompts & AI Insights */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Prompt Cepat Operasional</span>
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() =>
                  setInputText('Bagaimana analisis susut muatan BBM TANK-BBM-2401 hari ini?')
                }
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all block"
              >
                📊 Analisis Susut (Losses) & Toleransi Suhu
              </button>
              <button
                onClick={() =>
                  setInputText('Apa SOP kecepatan dan stabilitas rollover saat tangki terisi 50%?')
                }
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all block"
              >
                ⚠️ Peringatan Rollover & Sloshing Baffle
              </button>
              <button
                onClick={() =>
                  setInputText('Bagaimana SOP pencucian tangki dari CPO ke Minyak Goreng Olein?')
                }
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all block"
              >
                🧼 Rekomendasi Pencucian & Uji VOC Bebas Kontaminasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
