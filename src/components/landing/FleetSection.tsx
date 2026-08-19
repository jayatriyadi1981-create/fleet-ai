import React from 'react';
import { Truck, Users, Radio, Navigation, FileText, Building2, CheckCircle2 } from 'lucide-react';

export const FleetSection: React.FC = () => {
  const items = [
    { title: 'Vehicle Management', desc: 'Kelola spesifikasi truk, kubikasi muatan, nomor mesin, dan plat nomor.' },
    { title: 'Driver Management', desc: 'Database SIM driver, sertifikat K3, dan riwayat tugas pengemudi.' },
    { title: 'GPS IoT Device Registry', desc: 'Pendaftaran nomor SIM card GPS, tipe IMEI, dan status koneksi gateway.' },
    { title: 'Fleet & Branch Grouping', desc: 'Pengelompokan armada berdasarkan cabang kota (Jakarta, Surabaya, Medan, dll).' },
    { title: 'Legal & Doc Manager', desc: 'Pengingat masa berlaku STNK, KIR, asuransi, dan izin trayek.' },
    { title: 'Operational History', desc: 'Rekap lengkap perjalanan harian, jarak tempuh, dan catatan servis.' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-950 border-b border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-bold text-blue-300 mb-4">
            <Truck className="h-3.5 w-3.5 text-blue-400" />
            <span>Manajemen Aset Komprehensif</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Kelola Seluruh Armada dalam Satu Platform.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Terintegrasi dari manajemen unit kendaraan, pengemudi, pendaftaran device GPS, hingga perizinan dokumen STNK & KIR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-2.5 hover:border-blue-500/40 transition-all shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{it.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
