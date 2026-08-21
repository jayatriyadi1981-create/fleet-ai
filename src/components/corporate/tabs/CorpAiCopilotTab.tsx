import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Car,
  DollarSign,
  Zap,
  Building
} from 'lucide-react';

export const CorpAiCopilotTab: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Halo! Saya AI Corporate Fleet Optimizer Copilot. Saya membantu General Affairs (GA) dan Procurement dalam menganalisis utilisasi mobil dinas pool, optimasi komparasi Sewa (Lease) vs Beli (CapEx), kalkulasi penghematan armada listrik (EV Transition), dan efisiensi konsumsi BBM. Apa yang ingin Anda analisis hari ini?',
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const samplePrompts = [
    'Analisis utilisasi armada pool sharing & identifikasi mobil yang jarang dipakai (idle)',
    'Komparasi kelayakan sewa (Leasing TRAC/MPM) vs beli putus untuk 5 unit Avanza',
    'Hitung potensi penghematan biaya operasional jika beralih ke armada EV (Hyundai Ioniq 5 / BYD)',
    'Evaluasi pola lembur supir pool kantor bulan ini & rekomendasi efisiensi shift'
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

      if (lower.includes('idle') || lower.includes('utilisasi')) {
        aiReply = `[ANALISIS UTILISASI ARMADA POOL PERUSAHAAN]
1. Tingkat Utilisasi Rata-Rata Pool: 76.4% (Kategori Sangat Sehat).
2. Temuan Unit Idle: Mobil CORP-POOL-03 (Toyota Avanza B 2990 TZQ) memiliki tingkat utilisasi hanya 38% dalam 30 hari terakhir.
3. Rekomendasi GA:
   - Alokasikan CORP-POOL-03 untuk rotasi shuttle tim sales antar-cabang Karawang.
   - Atau tidak memperpanjang kontrak sewa (non-renewal) saat jatuh tempo 30 September 2026 untuk menghemat Rp 6.800.000/bulan.`;
      } else if (lower.includes('sewa') || lower.includes('leasing') || lower.includes('beli') || lower.includes('avanza')) {
        aiReply = `[STUDI KELAYAKAN TCO: BUY (CAPEX) VS OPERATING LEASE (OPEX)]
Untuk pengadaan 5 Unit Kendaraan Operasional MPV (3 Tahun):
1. Opsi Operating Lease (TRAC/MPM/ASSA):
   - Biaya Bulanan: Rp 6.800.000 x 5 unit = Rp 34.000.000/bulan.
   - Keuntungan: Tanpa uang muka CapEx, bebas risiko depresiasi resale value, termasuk asuransi All-Risk, free servis berkala, dan unit pengganti 24 jam.
2. Opsi Beli Putus (Company Owned):
   - Total CapEx Awal: Rp 1.4 Miliar + beban depresiasi 20%/tahun + biaya admin STNK/servis mandiri.
3. Kesimpulan AI: Model **Operating Lease** 24% lebih efisien secara cashflow dan membebaskan beban administrasi tim GA.`;
      } else if (lower.includes('ev') || lower.includes('listrik') || lower.includes('ioniq')) {
        aiReply = `[SIMULASI EFISIENSI TRANSISI GREEN FLEET EV]
1. Biaya Energi:
   - Mobil BBM (Bensin 12 km/L @ Rp 13.000/L) = Rp 1.083 / KM.
   - Mobil EV (Ioniq 5 @ Rp 2.466 / kWh untuk 6.5 km/kWh) = Rp 379 / KM.
2. Penghematan Langsung: **65% lebih hemat biaya energi per kilometer**.
3. Manfaat Regulasi: Bebas aturan Ganjil-Genap Jakarta 100% setiap hari kerja, pajak PKB tahunan hanya ~Rp 800.000, serta berkontribusi langsung pada laporan ESG Scope 1 GHG Reduction (emisi nol knalpot).`;
      } else {
        aiReply = `[REKOMENDASI OPTIMASI FLEET GENERAL AFFAIRS]
Data telematika 6 unit mobil operasional kantor menunjukkan efisiensi operasional berjalan optimal. Seluruh permohonan booking kendaraan memiliki rasio kepatuhan jam kerja 96.2%, saldo e-Toll mencukupi, dan jadwal servis berkala berada dalam batas toleransi aman.`;
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiReply }]);
      setIsThinking(false);
    }, 850);
  };

  return (
    <div id="corp-ai-copilot-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              AI CORPORATE FLEET ADVISOR & TCO OPTIMIZER
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">Asisten AI General Affairs & Efisiensi Mobil Dinas</h3>
          <p className="text-xs text-slate-300">
            Analisis utilisasi armada sharing pool, perbandingan Buy vs Lease, prediksi penghematan EV, dan audit lembur supir kantor.
          </p>
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
            <Lightbulb className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            {p}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[480px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                m.sender === 'user' ? 'bg-slate-900 text-blue-400' : 'bg-blue-600 text-white font-bold'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-xl text-xs space-y-1 shadow-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-sans whitespace-pre-line'
              }`}>
                <div className="font-bold text-[10px] text-slate-400 font-mono mb-1">
                  {m.sender === 'user' ? 'GA FLEET MANAGER' : 'AI FLEET OPTIMIZER'}
                </div>
                <div>{m.text}</div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                Menganalisis data telematika, biaya leasing, dan rasio konsumsi bahan bakar...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tanyakan analisis efisiensi mobil dinas, peremajaan sewa, atau perbandingan EV..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-blue-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
          >
            <Send className="w-3.5 h-3.5" /> Kirim
          </button>
        </div>
      </div>
    </div>
  );
};
