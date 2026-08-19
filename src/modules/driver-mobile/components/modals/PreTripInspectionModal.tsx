import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  X,
  ShieldCheck,
  Upload,
  Gauge,
} from 'lucide-react';
import { InspectionCheckItem, PreTripInspectionRecord } from '../../types/driverMobileTypes';
import { driverSessionService } from '../../services/driverSessionService';
import { ItemConditionResult } from '../../../inspection/types/inspection';

interface PreTripInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (record: PreTripInspectionRecord) => void;
}

const INITIAL_CHECKLIST: InspectionCheckItem[] = [
  {
    id: 'chk-tire',
    category: 'TIRE',
    label: 'Kondisi & Tekanan Ban',
    description: 'Ketebalan alur ban > 2mm, tekanan angin sesuai standar (110-120 PSI), tidak ada sobekan / benjolan.',
    status: 'PASS',
  },
  {
    id: 'chk-brake',
    category: 'BRAKE',
    label: 'Sistem Pengereman (Rem Kaki & Parkir)',
    description: 'Pedal rem padat, angin rem terisi penuh (> 8 bar), handbrake mencengkeram kuat.',
    status: 'PASS',
  },
  {
    id: 'chk-light',
    category: 'LIGHT',
    label: 'Lampu Utama, Sein & Hazard',
    description: 'Headlamp jauh-dekat, lampu mundur, lampu rem dan sein berkedip normal.',
    status: 'PASS',
  },
  {
    id: 'chk-oil',
    category: 'OIL',
    label: 'Level Oli Mesin & Radiator Coolant',
    description: 'Dipstick oli di batas garis aman, air radiator penuh dan tidak bocor.',
    status: 'PASS',
  },
  {
    id: 'chk-battery',
    category: 'BATTERY',
    label: 'Aki & Tegangan Listrik (24V)',
    description: 'Terminal aki bersih kencang, alternator mengisi normal (indikator voltase 24-28V).',
    status: 'PASS',
  },
  {
    id: 'chk-body',
    category: 'BODY',
    label: 'Bodi, Kaca Spion & Wiper',
    description: 'Kaca bersih tanpa retak, wiper dan washer berfungsi membersihkan pandangan.',
    status: 'PASS',
  },
  {
    id: 'chk-safety',
    category: 'SAFETY_EQUIPMENT',
    label: 'Peralatan Keselamatan (APAR & Segitiga)',
    description: 'APAR tekanan hijau, dongkrak, kunci roda, rompi reflektor dan segitiga pengaman lengkap.',
    status: 'PASS',
  },
];

export const PreTripInspectionModal: React.FC<PreTripInspectionModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [items, setItems] = useState<InspectionCheckItem[]>(INITIAL_CHECKLIST);
  const [odometer, setOdometer] = useState<number>(48920);
  const [issuesNotes, setIssuesNotes] = useState('');
  const [photosCount, setPhotosCount] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (id: string, status: ItemConditionResult) => {
    setItems(items.map(item => (item.id === id ? { ...item, status } : item)));
  };

  const hasFailures = items.some(i => i.status === 'FAIL');

  const handleSubmit = () => {
    setIsSubmitting(true);
    const overallStatus: 'PASS' | 'FAIL' = hasFailures ? 'FAIL' : 'PASS';

    const record = driverSessionService.submitPreTripInspection({
      vehicleId: 'veh-01',
      odometerKm: odometer,
      items,
      photos: [
        {
          type: 'FRONT',
          url: 'https://images.unsplash.com/photo-1586191582152-70b54e3cbba3?w=500&auto=format&fit=crop',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'DASHBOARD',
          url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop',
          timestamp: new Date().toISOString(),
        },
      ],
      overallStatus,
      issueReported: hasFailures,
      issuesNotes: hasFailures ? issuesNotes || 'Terdeteksi item inspeksi yang tidak lolos standar.' : undefined,
    });

    setIsSubmitting(false);
    onCompleted(record);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-2xl flex flex-col space-y-4 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Pre-Trip Vehicle Inspection</h2>
              <p className="text-[11px] text-slate-400">Armada Isuzu Giga FVR (B 9128 UXT)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Odometer Input */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>Odometer Saat Ini (KM):</span>
            </div>
            <input
              type="number"
              value={odometer}
              onChange={e => setOdometer(Number(e.target.value))}
              className="w-28 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 font-mono font-bold text-cyan-300 text-right outline-none focus:border-cyan-500"
            />
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              7 Poin Keselamatan Wajib (Mandatory)
            </span>

            {items.map(item => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition space-y-2 ${
                  item.status === 'PASS'
                    ? 'bg-slate-950/70 border-slate-800'
                    : item.status === 'FAIL'
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                    : 'bg-slate-950 border-slate-800 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-xs">{item.label}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* PASS / FAIL / NA Buttons */}
                <div className="flex items-center gap-1.5 pt-1">
                  {(['PASS', 'FAIL', 'NOT_APPLICABLE'] as ItemConditionResult[]).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(item.id, status)}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] transition border ${
                        item.status === status
                          ? status === 'PASS'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : status === 'FAIL'
                            ? 'bg-rose-600 text-white border-rose-500'
                            : 'bg-slate-700 text-slate-200 border-slate-600'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {status === 'PASS' ? '✓ PASS' : status === 'FAIL' ? '✕ FAIL' : 'N/A'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Photo Evidence Section */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Foto Bukti Fisik Kendaraan</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">{photosCount}/4 Foto Terlampir</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Foto bagian depan, ban, bodi, dan panel odometer dengan stempel GPS otomatis.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPhotosCount(prev => Math.min(prev + 1, 4))}
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ambil Foto Tambahan</span>
              </button>
            </div>
          </div>

          {/* Issues Notes if Fail */}
          {hasFailures && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-[11px] font-bold text-rose-400">
                Catatan Kerusakan / Kendala Fisik:
              </label>
              <textarea
                value={issuesNotes}
                onChange={e => setIssuesNotes(e.target.value)}
                placeholder="Contoh: Ban depan kiri tekanan kurang (90 PSI), lampu sein kanan mati..."
                rows={2}
                className="w-full bg-slate-950 border border-rose-500/50 rounded-xl p-3 text-xs text-rose-200 placeholder-rose-500/50 outline-none focus:border-rose-400"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 pt-3 shrink-0 space-y-2">
          {hasFailures ? (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Ada item FAIL. Laporan akan otomatis diteruskan ke Fleet Manager & Workshop.</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Semua item lolos inspeksi. Kendaraan siap berangkat (Vehicle Ready).</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              Batal
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs transition shadow-lg flex items-center justify-center gap-1.5 ${
                hasFailures
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Submit Hasil Inspeksi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
