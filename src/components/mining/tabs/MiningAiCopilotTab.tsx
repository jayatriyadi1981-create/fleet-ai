import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  RotateCw,
  Layers,
  Fuel,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { miningService } from '../../../modules/mining/services/miningService';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const MiningAiCopilotTab: React.FC = () => {
  const [executiveBriefing, setExecutiveBriefing] = useState<string>(miningService.generateAiDailyBriefing());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Halo Pak KTT / Mining Superintendent! Saya adalah **AI Mining Operations Copilot**. Saya dapat membantu analisis antrean Shovel-Truck (Match Factor), optimasi konsumsi BBM Solar B35, pemantauan lereng Pit Highwall, dan kepatuhan K3 SMKP ESDM. Ada yang ingin dianalisis?',
      timestamp: '07:30'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Match factor interactive calculator state
  const [mfShovels, setMfShovels] = useState<number>(3);
  const [mfTrucks, setMfTrucks] = useState<number>(14);
  const [mfLoadingTime, setMfLoadingTime] = useState<number>(3.2);
  const [mfCycleTime, setMfCycleTime] = useState<number>(28.5);

  const calculatedMf = ((mfTrucks * mfLoadingTime) / (mfShovels * mfCycleTime));
  const mfStatus = calculatedMf < 0.9 ? 'UNDER_TRUCKING (Shovel Menganggur)' :
                   calculatedMf > 1.1 ? 'OVER_TRUCKING (Antrean Truk Menumpuk di Front)' :
                   'OPTIMAL (Sinkronisasi Seimbang)';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentQuery = inputQuery;
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      const lower = currentQuery.toLowerCase();

      if (lower.includes('match factor') || lower.includes('antre') || lower.includes('antrian') || lower.includes('shovel')) {
        aiResponseText = `**Rekomendasi AI Match Factor Optimization:**\n- Saat ini Match Factor armada Pit Hatari adalah **0.98** (Sangat Efisien).\n- Shovel **EX-1201 (PC1250)** didukung 4 unit HD785 dengan loading time rata-rata **3.1 menit**.\n- Tidak ditemukan *truck queue bottleneck* di loading area maupun ROM Stockpile. Kapasitas shovel terserap 98.4%.`;
      } else if (lower.includes('solar') || lower.includes('bbm') || lower.includes('fuel')) {
        aiResponseText = `**Analisis Konsumsi Bahan Bakar (Fuel Intelligence):**\n- Konsumsi shift berjalan: **28,450 Liter Solar B35** (98.2% dari budget RKAB).\n- Rasio BBM adalah **0.63 Liter/Ton batubara** dan **0.12 L/BCM Overburden**.\n- Unit **DT-785-02** mencatat burn rate sedikit lebih tinggi (68.4 L/HM vs rata-rata 64.2 L/HM). Disarankan pengecekan turbocharger dan injector saat servis PS 250 berikutnya.`;
      } else if (lower.includes('k3') || lower.includes('smkp') || lower.includes('fatigue') || lower.includes('kantuk')) {
        aiResponseText = `**Laporan K3 & Safety Intelligence:**\n- Jam kerja aman tambang saat ini: **1,842,500 LTI-Free Manhours** (Zero Fatality).\n- Kamera Fatigue DSS AI mendeteksi 1 peringatan mata mengantuk (micro-sleep) pada operator Budi Santoso pukul 14:15. Telah diarahkan istirahat 30 menit di Pos P3K dan digantikan driver cadangan.\n- Kepatuhan P2H pre-shift 100% disiplin.`;
      } else if (lower.includes('produksi') || lower.includes('target') || lower.includes('bcm') || lower.includes('ton')) {
        aiResponseText = `**Rekapitulasi Produksi Hari Ini:**\n- Batubara (Coal Hauling): **42,850 Ton** (102% target harian).\n- Overburden (OB Removal): **126,400 BCM** (99.5% target harian).\n- Stripping Ratio aktual tercapai: **2.95 : 1** (Sesuai rencana tambang jangka pendek).`;
      } else {
        aiResponseText = `**AI Insight Operasional Tambang:**\nBerdasarkan telematika armada dan data dispatch real-time, operasional berada dalam status **OPTIMAL**.\n- Physical Availability (PA): **94.8%**\n- Utilization Availability (UA): **86.2%**\n- Rekomendasi: Lakukan grading jalan hauling segmen KM 4-5 di Pit Hatari North untuk menjaga rata-rata kecepatan hauler di atas 32 km/jam.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleChipClick = (promptText: string) => {
    setInputQuery(promptText);
  };

  return (
    <div className="space-y-6" id="mining-ai-copilot-container">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Mining Operations Copilot
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Asisten AI Pintar untuk KTT, Superintendent & Dispatcher
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Executive Daily Briefing otomatis, simulator antrean Shovel Match Factor, optimasi efisiensi Solar B35, & analisis prediktif lereng tambang.
          </p>
        </div>

        <button
          onClick={() => setExecutiveBriefing(miningService.generateAiDailyBriefing())}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
        >
          <RotateCw className="w-4 h-4" />
          Perbarui Briefing AI
        </button>
      </div>

      {/* AI Daily Executive Briefing */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-slate-50 p-6 rounded-2xl border border-amber-200/80 shadow-sm">
        <div className="flex items-center gap-2 font-black text-slate-900 text-base mb-3">
          <Brain className="w-5 h-5 text-amber-600" />
          Executive Daily Briefing KTT (Kepala Teknik Tambang)
        </div>
        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white/80 p-5 rounded-xl border border-slate-200 font-sans">
          {executiveBriefing}
        </div>
      </div>

      {/* Match Factor Calculator Tool */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-500" />
              Simulator AI Match Factor (Shovel-Truck Synchronization)
            </h2>
            <p className="text-xs text-slate-500">Rumus: (Jumlah Truk x Waktu Muat) / (Jumlah Shovel x Waktu Siklus Total)</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
            calculatedMf >= 0.9 && calculatedMf <= 1.1 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            Match Factor: {calculatedMf.toFixed(2)} ({mfStatus})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Jumlah Shovel Excavator</label>
            <input
              type="number"
              value={mfShovels}
              onChange={(e) => setMfShovels(Math.max(1, Number(e.target.value)))}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Jumlah Dump Truck</label>
            <input
              type="number"
              value={mfTrucks}
              onChange={(e) => setMfTrucks(Math.max(1, Number(e.target.value)))}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Waktu Muat Shovel (Menit)</label>
            <input
              type="number"
              step="0.1"
              value={mfLoadingTime}
              onChange={(e) => setMfLoadingTime(Number(e.target.value))}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Waktu Siklus Hauler (Menit)</label>
            <input
              type="number"
              step="0.5"
              value={mfCycleTime}
              onChange={(e) => setMfCycleTime(Number(e.target.value))}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
            />
          </div>
        </div>
      </div>

      {/* Interactive AI Chat Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Konsultasi AI Operasional Tambang & Dispatcher</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Model Aktif
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-slate-900/60' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>AI sedang menganalisis telematika armada...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 text-[10px] whitespace-nowrap">Pertanyaan Cepat:</span>
          {[
            'Berapa Match Factor armada saat ini?',
            'Analisis konsumsi Solar B35 shift ini',
            'Status K3 & Fatigue DSS Camera',
            'Ringkasan pencapaian produksi harian'
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-900 text-slate-700 whitespace-nowrap transition-colors border border-slate-200/80"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ketik pertanyaan operasional tambang, kendala shovel, analisis ban, atau K3..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Kirim</span>
          </button>
        </form>
      </div>
    </div>
  );
};
