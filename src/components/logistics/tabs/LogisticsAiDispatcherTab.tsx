import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Send, 
  Cpu, 
  Zap, 
  Truck, 
  MapPin, 
  Boxes, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { LogisticsOrder, LogisticsHub } from '../../../modules/logistics/types';

interface Props {
  orders: LogisticsOrder[];
  hubs: LogisticsHub[];
}

export const LogisticsAiDispatcherTab: React.FC<Props> = ({ orders, hubs }) => {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Halo Dispatcher! Saya AI Logistics Copilot. Saya memantau 4 Hub aktif, 42 armada linehaul, dan 380 order kargo hari ini. Ada yang bisa saya bantu optimalkan? (Contoh: "Rekomendasikan armada untuk muatan 12 Ton rute JKT-SBY", "Cek resi yang berisiko terlambat", "Hitung estimasi konsumsi solar")'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userText = prompt;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      let aiResponse = '';
      const lower = userText.toLowerCase();

      if (lower.includes('sby') || lower.includes('surabaya') || lower.includes('muatan') || lower.includes('ton')) {
        aiResponse = '🤖 Rekomendasi AI Dispatch: Untuk muatan 12 Ton Jakarta-Surabaya, disarankan menggunakan Armada CDD Long Chassis (Plat B 9481 UXT) di Hub Cakung dengan load factor 92.5%. Berangkat via Tol Trans Jawa pukul 20:00 WIB untuk menghindari kepadatan Cikampek. Estimasi ETA tiba di Hub Surabaya Rungkut pukul 08:30 WIB besok.';
      } else if (lower.includes('terlambat') || lower.includes('sla') || lower.includes('risiko')) {
        aiResponse = '⚠️ Analisis Risiko Keterlambatan: Terdapat 1 resi (JKT-BDG-882110) yang berpotensi SLA breached karena penerima belum merespons telepon kurir. Saya sarankan mengirimkan WhatsApp notifikasi otomatis ke penerima.';
      } else {
        aiResponse = `🤖 Analisis Logistik AI: Berdasarkan data telematika terkini, seluruh rute linehaul beroperasi dengan efisiensi tinggi (SLA 98.6%). Utilisasi kapasitas ruang muat mencapai 89.2% dengan penghematan BBM rata-rata 14% menggunakan dynamic routing.`;
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsThinking(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI Logistics Dispatcher & Autonomous Fleet Copilot
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Asisten cerdas untuk dynamic auto-dispatching, prediksi ETA cuaca, rekomendasi penggabungan muatan (load consolidation), dan anomali detection.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[520px]">
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {chatHistory.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div 
                className={`p-4 rounded-2xl max-w-xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span>AI Dispatcher sedang menghitung parameter telematika...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSend} className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input 
            type="text"
            placeholder="Tanyakan rekomendasi rute, kapasitas muatan, atau status kendala logistik..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <button 
            type="submit"
            className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/30 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Kirim
          </button>
        </form>
      </div>
    </div>
  );
};
