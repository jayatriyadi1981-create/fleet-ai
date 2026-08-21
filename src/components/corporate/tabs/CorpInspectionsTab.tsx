import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Car,
  FileText,
  Fuel,
  CreditCard,
  Plus,
  ShieldCheck,
  Search
} from 'lucide-react';

export const CorpInspectionsTab: React.FC = () => {
  const [inspections, setInspections] = useState([
    {
      id: 'insp-01',
      plate: 'B 2145 SHP',
      model: 'Toyota Innova Zenix',
      type: 'POST_TRIP_RETURN',
      inspector: 'Siti Aminah & GA Inspector',
      inspectionTime: '2026-08-20 17:35',
      fuelLevelPercent: 65,
      eTollBalanceIdr: 320000,
      cabinCleanliness: 'BERSIH_RAPI',
      bodyCondition: 'MULUS_TANPA_BARET_BARU',
      status: 'PASSED_CLEARED',
      notes: 'Kabin bersih, karpet rapi, sisa saldo tol tercatat Rp 320.000.',
    },
    {
      id: 'insp-02',
      plate: 'B 1876 SZK',
      model: 'Hyundai Ioniq 5 EV',
      type: 'PRE_TRIP_DISPATCH',
      inspector: 'Bambang Irawan (Driver Pool)',
      inspectionTime: '2026-08-21 08:40',
      fuelLevelPercent: 92,
      eTollBalanceIdr: 450000,
      cabinCleanliness: 'SANGAT_BERSIH',
      bodyCondition: 'MULUS_100%',
      status: 'PASSED_CLEARED',
      notes: 'Tekanan ban 4 roda normal 36 PSI, kabel charger EV & dongkrak lengkap.',
    },
    {
      id: 'insp-03',
      plate: 'B 2990 TZQ',
      model: 'Toyota Avanza 1.5 G',
      type: 'PERIODIC_WEEKLY_CHECK',
      inspector: 'Hendro Wijaya (GA Fleet Lead)',
      inspectionTime: '2026-08-19 16:00',
      fuelLevelPercent: 40,
      eTollBalanceIdr: 150000,
      cabinCleanliness: 'PERLU_CUCI_STEAM',
      bodyCondition: 'BARET_RINGAN_BUMPER_KIRI',
      status: 'NEEDS_ATTENTION',
      notes: 'Terdapat baret halus di sudut bumper depan kiri akibat parkir sempit. Dijadwalkan poles/compound.',
    }
  ]);

  return (
    <div id="corp-inspections-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
            DIGITAL WALKAROUND INSPECTION & DAMAGE HANDOVER
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Inspeksi Digital Pra & Pasca Pakai, Checklist Baret Body & Kebersihan
          </h3>
          <p className="text-xs text-slate-400">
            Formulir digital serah terima kendaraan, foto kondisi 360°, verifikasi tekanan angin ban, level BBM awal/akhir, dan e-Toll card.
          </p>
        </div>

        <button
          onClick={() => alert('Mulai Formulir Walkaround Digital Inspection Baru')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Buat Laporan Inspeksi Baru
        </button>
      </div>

      {/* Inspections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {inspections.map(insp => (
          <div key={insp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-xs">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm font-mono">{insp.plate}</h4>
                  <p className="text-[11px] text-slate-500">{insp.model}</p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                insp.status === 'PASSED_CLEARED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {insp.status === 'PASSED_CLEARED' ? 'LOLOS CHECKLIST' : 'PERLU ATENSI'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tipe Inspeksi:</span>
                <span className="font-bold text-slate-800">{insp.type.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pemeriksa:</span>
                <span className="font-semibold text-slate-900">{insp.inspector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Inspeksi:</span>
                <span className="font-mono text-slate-800">{insp.inspectionTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kebersihan Kabin:</span>
                <span className="font-semibold text-slate-800">{insp.cabinCleanliness.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kondisi Body Eksterior:</span>
                <span className="font-semibold text-slate-800">{insp.bodyCondition.replace(/_/g, ' ')}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 mt-2">
                <span className="font-bold text-slate-900">Catatan Temuan:</span> {insp.notes}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Galeri Foto 360° & Bukti Kondisi Fisik untuk ${insp.plate}`)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-blue-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow"
              >
                <Camera className="w-3.5 h-3.5" /> Foto Kerusakan & Bukti
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
