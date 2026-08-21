import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  Bot,
  Compass,
  MapPin,
  TrendingUp,
  CloudRain,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { taxiService } from '../../../modules/taxi/services/taxiService';

export const TaxiAiCopilotTab: React.FC = () => {
  const [briefing, setBriefing] = useState<string>(taxiService.generateAiDailyTaxiBriefing());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Halo! Saya AI Taxi Operations Radar Copilot. Saya menganalisis pola lalu lintas real-time, cuaca hujan, histori data penerbangan Bandara Soetta, dan penyeimbangan antrean armada taksi Anda.',
    },
  ]);

  const handleRefreshBriefing = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setBriefing(taxiService.generateAiDailyTaxiBriefing());
      setIsRefreshing(false);
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery;
    const newChat = [...chatLog, { sender: 'user' as const, text: query }];
    setChatLog(newChat);
    setUserQuery('');

    setTimeout(() => {
      let aiResponse = 'Berdasarkan data telemetri live, efisiensi rute dan utilisasi jarak berada pada level optimal 84%.';
      if (query.toLowerCase().includes('hujan') || query.toLowerCase().includes('scbd') || query.toLowerCase().includes('macet')) {
        aiResponse = 'Rekomendasi AI: Prediksi hujan lebat di kawasan SCBD & Sudirman pukul 17:30. Disarankan mengarahkan 8 armada taksi standby di pangkalan Senayan & Mampang untuk standby di sekitar lobby mall & stasiun MRT.';
      } else if (query.toLowerCase().includes('bandara') || query.toLowerCase().includes('soetta')) {
        aiResponse = 'Bandara Soetta T3 mengalami lonjakan 12 antrean penumpang dengan waktu tunggu 4 menit. Disarankan relokasi 5 unit kosong dari koridor Daan Mogot.';
      } else if (query.toLowerCase().includes('ev') || query.toLowerCase().includes('listrik')) {
        aiResponse = 'Armada taksi listrik (BYD e6 & Ioniq 5) menghasilkan efisiensi biaya energi tertinggi (Rp 340/KM), menghemat 65% pengeluaran dibanding armada bensin konvensional.';
      }

      setChatLog([...newChat, { sender: 'ai', text: aiResponse }]);
    }, 500);
  };

  return (
    <div id="taxi-ai-copilot-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>AI Taxi Operations Copilot & Demand Hotspot Prediction</span>
          </h2>
          <p className="text-xs text-slate-400">Prediksi lonjakan permintaan berbasis cuaca, penerbangan kedatangan, dan optimasi relokasi armada kosong</p>
        </div>

        <button
          onClick={handleRefreshBriefing}
          disabled={isRefreshing}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors border border-slate-700 flex items-center space-x-1.5"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{isRefreshing ? 'Memproses...' : 'Regenerate AI Briefing'}</span>
        </button>
      </div>

      {/* Briefing Output Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Bot className="w-4 h-4 text-amber-400" />
          <span>Executive Daily Hauling & Dispatching AI Summary</span>
        </h3>
        <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
          {briefing}
        </pre>
      </div>

      {/* Interactive AI Chat Assistant */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Tanya Jawab Analisis Armada & Dispatching AI</span>
        </h3>

        <div className="h-48 overflow-y-auto space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {chatLog.map((c, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-xl ${
                c.sender === 'user'
                  ? 'ml-auto bg-amber-500/20 text-amber-200 border border-amber-500/30'
                  : 'mr-auto bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <div className="font-bold text-[10px] text-slate-400 mb-1">
                {c.sender === 'user' ? 'Operator Taxi Dispatch' : 'Gemini Taxi Intelligence AI'}
              </div>
              <p>{c.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Tanyakan rekomendasi relokasi armada saat hujan, prediksi antrean bandara, atau efisiensi EV..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="flex-1 p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};
