import React from 'react';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Bus, 
  AlertCircle, 
  Zap, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export const BusAiDispatcherTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" /> AI PO Bus Demand Forecasting & Smart Dispatcher
          </div>
          <h3 className="text-xl font-black">AI Copilot Manajemen Trayek & Lonjakan Penumpang</h3>
          <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
            Menganalisis pola pemesanan tiket online, tren kalender libur nasional, cuaca jalan tol, dan ketersediaan armada cadangan untuk memaksimalkan okupansi dan ketepatan waktu.
          </p>
        </div>

        <button 
          onClick={() => alert('Analisis AI Prediksi Penumpang dimutakhirkan dengan data real-time OTA dan Loket!')}
          className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-md flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-300" /> Refresh Prediksi AI
        </button>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insight 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Prediksi Lonjakan Mudik & Akhir Pekan Panjang</h4>
                <span className="text-[11px] text-slate-400">Koridor: Jakarta ➔ Yogyakarta & Solo</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded text-[10px] font-bold">
              AKURASI 94%
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Pencarian tiket rute Jakarta - Solo meningkat <strong>+42%</strong> untuk keberangkatan Jumat sore. Kursi Sleeper Suites dan Double Decker telah terisi <strong>92%</strong> 48 jam sebelum jadwal.
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1.5">
            <strong className="text-slate-900 dark:text-white">Rekomendasi AI Dispatcher:</strong>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
              <li>Luncurkan 2 unit Bus Bantuan (Ritase Sapu Jagat) dari Pool Cakung pukul 19:30.</li>
              <li>Terapkan tarif batas atas resmi untuk memaksimalkan yield margin hingga +Rp 22.400.000.</li>
            </ul>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Peringatan Kepadatan Tol Cipali KM 86</h4>
                <span className="text-[11px] text-slate-400">Mitigasi Delay & Kepatuhan Waktu Tiba</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 rounded text-[10px] font-bold">
              TRAFFIC RADAR
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Terdeteksi perlambatan laju lalu lintas di Tol Cipali KM 86 arah Cirebon akibat perbaikan jalan. Potensi keterlambatan bus sekitar 25-35 menit.
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1.5">
            <strong className="text-slate-900 dark:text-white">Rekomendasi AI Rerouting:</strong>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
              <li>Kirimkan notifikasi push SMS/WA otomatis kepada penumpang mengenai estimasi waktu tiba (ETA).</li>
              <li>Arahkan driver untuk transit istirahat makan lebih awal di RM Subang KM 102.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
