/**
 * AI Safety Advisor Tab
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Flame,
  UserCheck,
  Truck
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  evidencePoints?: string[];
  recommendation?: string;
}

export const AISafetyAdvisorTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'AI',
      text: 'Halo! Saya AI Safety Advisor armada Anda. Saya siap membantu menganalisis akar masalah insiden, mengidentifikasi faktor risiko pengemudi, menemukan hotspot rawan kecelakaan, atau merumuskan program coaching keselamatan.',
      timestamp: '09:00',
    },
  ]);

  const presetQueries = [
    'Kenapa safety score fleet turun pada periode ini?',
    'Driver mana yang paling membutuhkan coaching keselamatan?',
    'Area mana yang menjadi hotspot paling berisiko?',
    'Apa rekomendasi tindakan keselamatan minggu ini?',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      text: q,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate Evidence-Backed AI Response
    setTimeout(() => {
      let reply = '';
      let evidence: string[] = [];
      let rec = '';

      const queryLower = q.toLowerCase();

      if (queryLower.includes('score') || queryLower.includes('turun') || queryLower.includes('fleet')) {
        reply = 'Skor keselamatan armada saat ini berada di angka 87/100 (+4.8% membaik). Faktor risiko yang masih menahan peningkatan skor meliputi 18 kejadian overspeed pada rute malam hari dan 1 unit kendaraan berat dengan jarak henti pengereman yang memanjang.';
        evidence = [
          'Log telemetri 30 hari: 3 kecelakaan, 8 insiden minor, 14 near-miss',
          'Rasio kejadian pada shift malam (22:00 - 04:00) mencapai 68%',
        ];
        rec = 'Prioritaskan rest stop wajib di KM 207/KM 379 dan lakukan inspeksi kampas rem pada armada B 9811 ULM.';
      } else if (queryLower.includes('driver') || queryLower.includes('coaching') || queryLower.includes('supir')) {
        reply = 'Berdasarkan data telemetri 30 hari terakhir, pengemudi Rudi Hartono (Cabang Semarang) dan Budi Santoso (Cabang Jakarta) memiliki risiko tertinggi dan direkomendasikan untuk program coaching.';
        evidence = [
          'Rudi Hartono: 26 kejadian overspeed, 19 pengereman mendadak, skor keselamatan 68/100',
          'Budi Santoso: Terlibat 1 insiden deselerasi licin di Tol Cipularang, skor 76/100',
        ];
        rec = 'Tugaskan modul coaching "Defensive Driving & Safe Following Distance" dengan HSE Lead.';
      } else if (queryLower.includes('hotspot') || queryLower.includes('area') || queryLower.includes('lokasi') || queryLower.includes('rute')) {
        reply = 'Hotspot dengan tingkat risiko tertinggi berada di Tol Cipularang KM 90 - 93 (turunan curam & tikungan licin) dengan 9 insiden dan 16 kejadian near-miss tercatat.';
        evidence = [
          'Klaster GPS mencatat rata-rata kecepatan armada melampaui 75 km/h di turunan',
          '62% insiden terjadi saat hujan dengan koefisien gesek aspal rendah',
        ];
        rec = 'Aktivasi geofence limit 50 km/h dengan peringatan audio otomatis di kabin driver.';
      } else {
        reply = `Berdasarkan analisis telemetri dan data investigasi keselamatan aktif, sistem mendeteksi tren keselamatan armada stabil dengan kepatuhan inspeksi pra-jalan mencapai 90%. Tidak ditemukan anomali mekanis kritis di luar daftar WO pemeliharaan aktif.`;
        evidence = ['Log telemetri terverifikasi', 'Audit kepatuhan inspeksi harian (P26)'];
        rec = 'Lanjutkan pemantauan real-time dan tinjau kemajuan penyelesaian 3 CAPA terbuka.';
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        text: reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        evidencePoints: evidence,
        recommendation: rec,
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      
      {/* Top Advisor Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              AI Safety Copilot & Advisory Assistant
            </h3>
            <p className="text-xs text-slate-400">
              Didukung oleh Safety Data Layer, Telemetri GPS 10Hz, dan Aturan RBAC Multi-Tenant.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset Percakapan"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Query Chips */}
      <div className="flex flex-wrap gap-2">
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition-colors text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 min-h-[420px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'USER' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.sender === 'USER' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {msg.sender === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl space-y-2 text-xs leading-relaxed p-3.5 rounded-xl ${
              msg.sender === 'USER'
                ? 'bg-indigo-950/60 border border-indigo-500/30 text-slate-100 rounded-tr-none'
                : 'bg-slate-800/80 border border-slate-700/80 text-slate-200 rounded-tl-none'
            }`}>
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="font-bold text-[11px] text-slate-400 font-mono">
                  {msg.sender === 'USER' ? 'Anda' : 'AI Safety Advisor'}
                </span>
                <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
              </div>

              <p>{msg.text}</p>

              {msg.evidencePoints && msg.evidencePoints.length > 0 && (
                <div className="pt-2 mt-2 border-t border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Bukti Telemetri Pendukung:</span>
                  <ul className="space-y-0.5 text-[11px] text-slate-300">
                    {msg.evidencePoints.map((ev, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span> {ev}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {msg.recommendation && (
                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300">
                  <strong>Rekomendasi Tindakan:</strong> {msg.recommendation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Tanyakan hal seputar keselamatan, insiden, kepatuhan fatigue, atau risiko rute..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
        />
        <button
          onClick={() => handleSend()}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
          Kirim
        </button>
      </div>

    </div>
  );
};
