import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Zap,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Trash2,
  MapPin,
  CheckCircle2,
  Scale
} from 'lucide-react';

interface AiInsight {
  id: string;
  type: 'ROUTE_OPTIMIZATION' | 'OVERFLOW_PREDICTION' | 'FESTRONIK_AUDIT';
  title: string;
  description: string;
  actionLabel: string;
  confidence: number;
}

export const WasteAiCopilotTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Halo! Saya AI Waste Operations Copilot. Saya siap membantu menganalisis pola timbulan sampah, mengoptimasi rute penjemputan TPS secara efisien bahan bakar, dan mengaudit kepatuhan manifest Festronik B3.'
    }
  ]);

  const insights: AiInsight[] = [
    {
      id: 'ai-01',
      type: 'OVERFLOW_PREDICTION',
      title: 'Prediksi Lonjakan Sampah di Kawasan Kuliner Sabang & Menteng',
      description:
        'Berdasarkan histori data hari Jumat malam, volume sampah di TPS Kuliner Sabang diprediksi melonjak +45% pada pukul 21:00 WIB. Disarankan menambah 1 ritase truk compactor cadangan.',
      actionLabel: 'Jadwalkan Ritase Tambahan',
      confidence: 96
    },
    {
      id: 'ai-02',
      type: 'ROUTE_OPTIMIZATION',
      title: 'Optimasi Klaster Penjemputan TPS Jakarta Pusat',
      description:
        'Dengan membalikkan urutan penjemputan dari RSCM -> Salemba -> Senen, truk MED-B3-COLD-01 dapat menghemat waktu tempuh 28 menit dan memotong jarak 4.2 KM.',
      actionLabel: 'Terapkan Rute AI Teroptimasi',
      confidence: 94
    },
    {
      id: 'ai-03',
      type: 'FESTRONIK_AUDIT',
      title: 'Verifikasi Kode Limbah B3 PT Toyota MM2100',
      description:
        'Manifest FES-KLHK-2026-IND-4421 telah diverifikasi 100% cocok dengan karakteristik sludge IPAL B351-1 dan izin angkut pengemudi Mulyadi Pratama.',
      actionLabel: 'Lihat Detail Festronik',
      confidence: 99
    }
  ];

  const handleSend = () => {
    if (!query.trim()) return;
    const userText = query;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setQuery('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `[Analisis AI Smart Waste]: Berdasarkan telemetri armada real-time dan sensor ultrasonik IoT di 12 TPS, saat ini seluruh armada beroperasi dengan tingkat efisiensi rute 94.2%. Katup pembuangan air lindi (leachate) di semua truk tertutup rapat dan berat muatan di jembatan timbang memenuhi standar batas muat.`
        }
      ]);
    }, 600);
  };

  return (
    <div id="waste-ai-copilot-tab" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>AI Waste Operations & Route Optimizer Copilot</span>
          </h2>
          <p className="text-xs text-slate-400">
            Asisten kecerdasan buatan untuk prediksi timbulan sampah, efisiensi konsumsi BBM rute pengumpulan, dan audit otomatis limbah B3 KLHK.
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-xl flex items-center space-x-1.5">
          <Zap className="w-4 h-4" />
          <span>Gemini AI Engine Active</span>
        </span>
      </div>

      {/* AI Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                  {item.type.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">{item.confidence}% Akurasi</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>

            <button
              onClick={() => alert(`Aksi "${item.actionLabel}" berhasil dijalankan oleh AI Copilot!`)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-bold transition-all border border-slate-700 hover:border-emerald-500"
            >
              {item.actionLabel}
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Chat Console */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Bot className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">Konsultasi Interaktif AI Smart Waste</h3>
        </div>

        {/* Message Logs */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                m.sender === 'user'
                  ? 'ml-auto bg-emerald-600 text-white'
                  : 'bg-slate-950 border border-slate-800 text-slate-200'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            placeholder="Tanyakan analisis muatan truk, prediksi sampah, atau validasi Festronik..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSend}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
