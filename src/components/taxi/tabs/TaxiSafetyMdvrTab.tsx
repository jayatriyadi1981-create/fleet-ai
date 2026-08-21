import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Video,
  Radio,
  Eye,
  CheckCircle2,
  Lock,
  Volume2,
  Compass
} from 'lucide-react';

export const TaxiSafetyMdvrTab: React.FC = () => {
  return (
    <div id="taxi-safety-mdvr-tab" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Kamera MDVR Kabin, Tombol Panic SOS & Keamanan Penumpang</span>
          </h2>
          <p className="text-xs text-slate-400">Monitoring video kabin 2-arah (jalan & kabin), deteksi argo bypass (penumpang tanpa argo), dan respon darurat 24 Jam</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Emergency Command Center: Online & Siaga
          </span>
        </div>
      </div>

      {/* Safety Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Tombol Darurat SOS Pengemudi</h3>
          <p className="text-xs text-slate-400">
            Tombol tersembunyi di bawah setir dan aplikasi terhubung langsung ke operator Command Center taksi 24/7 & kepolisian saat terjadi tindak kejahatan/pembegalan.
          </p>
          <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>0 Kasus Darurat (Semua Unit Aman)</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">MDVR Dual-Lens AI Camera</h3>
          <p className="text-xs text-slate-400">
            Kamera perekam definisi tinggi menghadap jalan raya (Road Facing) dan kabin penumpang (Cabin Facing) dengan enkripsi data rekaman privasi.
          </p>
          <div className="text-xs text-cyan-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Armada Terpasang MDVR Aktif</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Deteksi Argo Bypass (Penumpang Liar)</h3>
          <p className="text-xs text-slate-400">
            Sensor bobot kursi belakang & AI kabin mendeteksi keberadaan penumpang di dalam taksi saat status argometer mati (mencegah transaksi gelap di luar sistem).
          </p>
          <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Sensor Interlock Argo Terintegrasi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
