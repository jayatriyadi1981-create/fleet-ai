import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  HardHat, 
  Truck, 
  Clock, 
  Calendar, 
  FileText, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';
import { P2HInspection, HeavyEquipmentAsset, P2HResult } from '../../../modules/heavy-equipment/types';

interface Props {
  p2hList: P2HInspection[];
  equipments: HeavyEquipmentAsset[];
  onSubmitP2h: (p2h: Partial<P2HInspection>) => void;
}

export const HeavyP2hInspectionTab: React.FC<Props> = ({
  p2hList,
  equipments,
  onSubmitP2h
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState(equipments[0]?.id || '');
  const [operatorName, setOperatorName] = useState('Agus Sudarsono');
  const [shift, setShift] = useState<'SHIFT_1_DAY' | 'SHIFT_2_NIGHT'>('SHIFT_1_DAY');
  const [hourMeter, setHourMeter] = useState(3420.5);

  // Check items state
  const [items, setItems] = useState({
    engineOilLevel: true,
    hydraulicOilLevel: true,
    radiatorCoolant: true,
    fuelWaterSeparator: true,
    trackTireTension: true,
    hydraulicCylinderLeak: true,
    brakeSystem: true,
    hornAndReverseAlarm: true,
    aparFireExtinguisher: true,
    safetyBelt: true,
    rotaryLampLighting: true,
    mirrorsAndGlass: true
  });

  const [notes, setNotes] = useState('');

  const toggleItem = (key: keyof typeof items) => {
    setItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine result automatically
  const failedCount = Object.values(items).filter(v => !v).length;
  const computedResult: P2HResult = 
    failedCount === 0 ? 'FIT_TO_WORK' :
    failedCount <= 2 ? 'FIT_WITH_NOTE' : 'DO_NOT_OPERATE';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eq = equipments.find(e => e.id === selectedEqId);
    onSubmitP2h({
      equipmentId: selectedEqId,
      equipmentCode: eq?.code || 'EXC-201',
      operatorName,
      shift,
      hourMeter: Number(hourMeter),
      items,
      result: computedResult,
      criticalDefectNotes: notes || undefined,
      operatorSignature: `${operatorName.replace(/\s+/g, '_')}_P2H_Verified`
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            P2H (Pemeriksaan Harian Alat Berat) & K3 Tambang / Konstruksi
          </h3>
          <p className="text-xs text-slate-500">
            Standar kepatuhan Golden Safety Rules Kemenaker & ESDM: Cek oli, hidrolik, rem, APAR, alarm mundur, dan rotary lamp sebelum start engine.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Form P2H Shift Baru
        </button>
      </div>

      {/* Compliance Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">
              {p2hList.filter(p => p.result === 'FIT_TO_WORK').length} Unit Fit to Work
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Siap Operasi Penuh Tanpa Defect</div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-amber-700 dark:text-amber-300">
              {p2hList.filter(p => p.result === 'FIT_WITH_NOTE').length} Unit Fit dengan Catatan
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400">Monitoring Khusus Pengawas K3</div>
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-rose-700 dark:text-rose-300">
              {p2hList.filter(p => p.result === 'DO_NOT_OPERATE').length} Unit STOP / Tag-Out
            </div>
            <div className="text-xs text-rose-600 dark:text-rose-400">Dilarang Operasi (Critical Breakdown)</div>
          </div>
        </div>
      </div>

      {/* P2H Inspection Records */}
      <div className="space-y-3">
        {p2hList.map((p2h) => (
          <div 
            key={p2h.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {p2h.equipmentCode}
                </span>
                <span className="text-xs text-slate-500">• {p2h.inspectionNumber}</span>
                <span className="text-xs text-slate-500">• 🕒 {p2h.date} ({p2h.time} WIB)</span>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                p2h.result === 'FIT_TO_WORK'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : p2h.result === 'FIT_WITH_NOTE'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
              }`}>
                {p2h.result === 'FIT_TO_WORK' ? '✅ FIT TO WORK (SIAP OPERASI)' :
                 p2h.result === 'FIT_WITH_NOTE' ? '⚠️ FIT DENGAN CATATAN' : '⛔ DO NOT OPERATE (TAG OUT)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div>Operator: <strong className="text-slate-900 dark:text-white">{p2h.operatorName}</strong></div>
              <div>Shift: <strong className="text-slate-900 dark:text-white">{p2h.shift === 'SHIFT_1_DAY' ? 'Shift Siang' : 'Shift Malam'}</strong></div>
              <div>Hour Meter: <strong className="font-mono text-slate-900 dark:text-white">{p2h.hourMeter} HM</strong></div>
              <div>Tanda Tangan: <strong className="font-mono text-emerald-600">{p2h.operatorSignature}</strong></div>
            </div>

            {/* Checklist items pills */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
              {Object.entries(p2h.items).map(([k, ok]) => (
                <span 
                  key={k} 
                  className={`px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                    ok 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' 
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 font-bold border border-rose-300 dark:border-rose-800'
                  }`}
                >
                  {ok ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-rose-500" />}
                  {k.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              ))}
            </div>

            {p2h.criticalDefectNotes && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Temuan Inspeksi & Catatan Mekanik:</strong> {p2h.criticalDefectNotes}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal P2H Interactive Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                Form Checklist P2H Harian Operator
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Pilih Alat Berat *</label>
                  <select 
                    value={selectedEqId}
                    onChange={e => {
                      setSelectedEqId(e.target.value);
                      const eq = equipments.find(x => x.id === e.target.value);
                      if (eq) setHourMeter(eq.hourMeter);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  >
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.code} - {eq.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Hour Meter Saat Ini</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={hourMeter}
                    onChange={e => setHourMeter(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Checklist Grid */}
              <div className="space-y-2">
                <label className="block text-slate-900 dark:text-white font-bold text-xs">
                  12 Poin Item Pemeriksaan Fisik & Fungsi (Centang bila Normal):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  {Object.entries(items).map(([k, val]) => (
                    <label 
                      key={k} 
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-amber-500 transition-all"
                    >
                      <input 
                        type="checkbox" 
                        checked={val} 
                        onChange={() => toggleItem(k as any)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <span className="text-slate-800 dark:text-slate-200 font-medium capitalize text-[11px]">
                        {k.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Catatan Kerusakan / Temuan Khusus</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Isi jika ada kebocoran hidrolik, baut kendor, atau lampu mati..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Hasil Evaluasi Otomatis:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {computedResult === 'FIT_TO_WORK' ? '✅ FIT TO WORK (Siap Bekerja)' :
                     computedResult === 'FIT_WITH_NOTE' ? '⚠️ FIT DENGAN CATATAN' : '⛔ DO NOT OPERATE (Tag Out Merah)'}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                  {failedCount} Defect Terdeteksi
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-all"
                >
                  Simpan & Tandatangani P2H
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
