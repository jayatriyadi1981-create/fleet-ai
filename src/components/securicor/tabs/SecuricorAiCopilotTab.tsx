import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Navigation,
  Send,
  Bot,
  User,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

export const SecuricorAiCopilotTab: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Salam komando! Saya AI Tactical Securicor & CIT Threat Copilot. Saya menganalisis intelijen risiko rute konvoi lapis baja, pola titik rawan penyergapan (ambush hazard score), kepatuhan dual-key vault, serta estimasi mitigasi darurat POLRI secara real-time. Ada rute atau misi yang ingin dievaluasi?',
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const samplePrompts = [
    'Evaluasi risiko konvoi Rp 45 Miliar Khazanah BI menuju Simatupang',
    'Rekomendasikan rute alternatif anti-kemacetan & blind-spot SCBD',
    'Cek kepatuhan masa berlaku izin senjata api khusus (IKH) personil',
    'Simulasikan skenario tombol panik silent duress pada ARMOR-CIT-01'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsThinking(true);

    setTimeout(() => {
      let aiReply = '';
      const lower = query.toLowerCase();

      if (lower.includes('bi') || lower.includes('45 miliar') || lower.includes('khazanah')) {
        aiReply = `[HASIL ANALISIS TAKTIS AI CIT RISK SCORE: LEVEL RENDAH - 14/100]
1. Armada: Disarankan tetap menggunakan ARMOR-CIT-02 (Level Balistik CEN B7 Armor-Piercing) + Escort Brimob 2 Personil.
2. Analisis Rute: Hindari Jl. Rasuna Said karena kepadatan konstruksi (kecepatan rata-rata <12 km/jam).
3. Rekomendasi Koridor: Jalur VVIP Thamrin -> Sudirman -> Flyover Antasari -> TB Simatupang. Waktu tempuh 34 menit.
4. Status Keamanan: Solenoid airlock cabin & sensor seismic brankas 100% armed.`;
      } else if (lower.includes('scbd') || lower.includes('rute alternatif')) {
        aiReply = `[OPTIMASI RUTE ANTI-PENYERGAPAN SCBD]
1. Jalur Utama: Masuk via SCBD Gate 8 (Lobby Pasific Place) memiliki visibility 94% dengan 18 CCTV terhubung ke server.
2. Titik Rawan: Hindari berhenti di Underpass Senayan lebih dari 60 detik karena degradasi sinyal GPS satelit.
3. Status Pengawalan: Mobil pengawal taktis VR9 disarankan mendahului 20 meter di depan armada pengangkut kas.`;
      } else if (lower.includes('ikh') || lower.includes('senjata')) {
        aiReply = `[AUDIT KEPATUHAN IZIN SENPI KHUSUS (IKH) POLRI]
1. Total Personil Bersenjata Aktif: 12 Petugas Pengawal Resmi.
2. Status Izin IKH: 100% VALID. Seluruh personil memiliki KTA Polri & masa berlaku izin terdekat adalah Agustus 2027.
3. Nilai Menembak: Seluruh personil berkualifikasi Master/Expert Marksmanship (Pindad G2 Combat & SS2-V5).`;
      } else {
        aiReply = `[EVALUASI TAKTIS AI SECURICOR]
Misi operasional terverifikasi aman. Telemetri 5 unit armada lapis baja menunjukkan seluruh sistem interlocking door terkunci sempurna, ban run-flat 100% optimal, dan konektivitas darurat SPKT Polda Metro Jaya dalam kondisi siaga aktif.`;
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiReply }]);
      setIsThinking(false);
    }, 900);
  };

  return (
    <div id="securicor-ai-copilot-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">AI SECURICOR & TACTICAL THREAT ADVISOR</span>
          </div>
          <h3 className="text-lg font-bold text-white">Asisten Kecerdasan Buatan Mitigasi Risiko Konvoi Lapis Baja</h3>
          <p className="text-xs text-slate-300">Prediksi risiko rute konvoi kas, audit dual-custody vault, kalkulasi jarak aman konvoi, dan kepatuhan regulasi Bank Indonesia.</p>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all text-left flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            {p}
          </button>
        ))}
      </div>

      {/* Chat Box */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[480px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                m.sender === 'user' ? 'bg-slate-900 text-amber-400' : 'bg-amber-500 text-slate-950 font-bold'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-xl text-xs space-y-1 shadow-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-sans whitespace-pre-line'
              }`}>
                <div className="font-bold text-[10px] text-slate-400 font-mono mb-1">
                  {m.sender === 'user' ? 'OPERATOR KOMANDO' : 'AI TACTICAL COPILOT'}
                </div>
                <div>{m.text}</div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                Menganalisis intelijen rute & telemetri balistik armada...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tanyakan analisis ancaman rute konvoi, protokol anti-ambush, atau kepatuhan kas..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-amber-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
          >
            <Send className="w-3.5 h-3.5" /> Kirim
          </button>
        </div>
      </div>
    </div>
  );
};
