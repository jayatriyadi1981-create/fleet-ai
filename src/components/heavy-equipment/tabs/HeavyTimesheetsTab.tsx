import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Calendar, 
  Fuel, 
  HardHat, 
  Truck, 
  Check, 
  X,
  Filter
} from 'lucide-react';
import { DailyTimesheet, HeavyEquipmentAsset, ConstructionProject } from '../../../modules/heavy-equipment/types';

interface Props {
  timesheets: DailyTimesheet[];
  equipments: HeavyEquipmentAsset[];
  projects: ConstructionProject[];
  onSubmitTimesheet: (ts: Partial<DailyTimesheet>) => void;
}

export const HeavyTimesheetsTab: React.FC<Props> = ({
  timesheets,
  equipments,
  projects,
  onSubmitTimesheet
}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterProject, setFilterProject] = useState<string>('ALL');

  // Form State
  const [selectedEqId, setSelectedEqId] = useState(equipments[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [operatorName, setOperatorName] = useState('Agus Sudarsono');
  const [shift, setShift] = useState<'SHIFT_1_DAY' | 'SHIFT_2_NIGHT'>('SHIFT_1_DAY');
  const [startHM, setStartHM] = useState(3420.5);
  const [endHM, setEndHM] = useState(3430.5);
  const [operatingHours, setOperatingHours] = useState(8.5);
  const [idleHours, setIdleHours] = useState(0.8);
  const [standbyRainHours, setStandbyRainHours] = useState(0.5);
  const [breakdownHours, setBreakdownHours] = useState(0);
  const [fuelConsumed, setFuelConsumed] = useState(150);
  const [workDescription, setWorkDescription] = useState('Galian cut & fill loading ke dump truck');
  const [activityType, setActivityType] = useState<'EXCAVATION' | 'HAULING' | 'DOZING' | 'COMPACTING' | 'GRADING' | 'LIFTING'>('EXCAVATION');

  const selectedEq = equipments.find(e => e.id === selectedEqId);
  const selectedPrj = projects.find(p => p.id === selectedProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitTimesheet({
      equipmentId: selectedEqId,
      equipmentCode: selectedEq?.code || 'EXC-201',
      equipmentName: selectedEq?.name || 'Komatsu PC200-8MO',
      projectId: selectedProjectId,
      projectName: selectedPrj?.name || 'Proyek Tol IKN Seksi 3B',
      operatorId: 'op-01',
      operatorName: operatorName,
      shift: shift,
      startHM: Number(startHM),
      endHM: Number(endHM),
      totalHM: Number(endHM) - Number(startHM),
      operatingHours: Number(operatingHours),
      idleHours: Number(idleHours),
      standbyRainHours: Number(standbyRainHours),
      standbyQueueHours: 0,
      breakdownHours: Number(breakdownHours),
      fuelConsumedLiters: Number(fuelConsumed),
      workDescription: workDescription,
      activityType: activityType
    });
    setShowModal(false);
  };

  const filteredTimesheets = timesheets.filter(ts => {
    if (filterProject === 'ALL') return true;
    return ts.projectId === filterProject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Daily Timesheet & Rekapitulasi Hour Meter (HM)
          </h3>
          <p className="text-xs text-slate-500">
            Pencatatan jam kerja alat berat, jam produksi efektif, standby hujan/antrian, jam breakdown, dan audit konsumsi solar.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Input Timesheet Harian
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-semibold">Filter Proyek:</span>
        <button
          onClick={() => setFilterProject('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            filterProject === 'ALL'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Semua Proyek ({timesheets.length})
        </button>
        {projects.map(p => (
          <button
            key={p.id}
            onClick={() => setFilterProject(p.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterProject === p.id
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {p.code}
          </button>
        ))}
      </div>

      {/* Timesheet List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th className="py-3 px-4">No. Timesheet & Tanggal</th>
                <th className="py-3 px-4">Unit Alat</th>
                <th className="py-3 px-4">Operator & Shift</th>
                <th className="py-3 px-4">HM Awal ➔ Akhir</th>
                <th className="py-3 px-4">Total HM</th>
                <th className="py-3 px-4">Jam Efektif / Idle</th>
                <th className="py-3 px-4">Solar (Liter)</th>
                <th className="py-3 px-4">Status & Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTimesheets.map((ts) => (
                <tr key={ts.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">{ts.timesheetNumber}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {ts.date}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-amber-600 dark:text-amber-400 font-mono">{ts.equipmentCode}</div>
                    <div className="text-slate-500 text-[11px] truncate max-w-[150px]">{ts.equipmentName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5 text-blue-500" /> {ts.operatorName}
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      {ts.shift === 'SHIFT_1_DAY' ? '☀️ Shift 1 (Siang)' : '🌙 Shift 2 (Malam)'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-slate-700 dark:text-slate-300">
                      {ts.startHM.toFixed(1)} ➔ <strong>{ts.endHM.toFixed(1)}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400">Selisih: +{(ts.endHM - ts.startHM).toFixed(1)} HM</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {ts.totalHM.toFixed(1)} Jam
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Produksi: {ts.operatingHours.toFixed(1)} Jam
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      Idle: {ts.idleHours}j • Hujan: {ts.standbyRainHours}j • BD: {ts.breakdownHours}j
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-slate-900 dark:text-white font-bold flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-500" /> {ts.fuelConsumedLiters} L
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Burn: {(ts.fuelConsumedLiters / (ts.totalHM || 1)).toFixed(1)} L/HM
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                      ts.status === 'APPROVED'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    }`}>
                      {ts.status === 'APPROVED' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {ts.status === 'APPROVED' ? 'DISETUJUI PM' : 'MENUNGGU APPROVAL'}
                    </span>
                    {ts.approvedBy && (
                      <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[130px]">
                        By: {ts.approvedBy.split('(')[0]}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Timesheet */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Input Timesheet Harian Operator
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Pilih Unit Alat Berat *</label>
                  <select 
                    value={selectedEqId}
                    onChange={e => {
                      setSelectedEqId(e.target.value);
                      const eq = equipments.find(x => x.id === e.target.value);
                      if (eq) {
                        setStartHM(eq.hourMeter);
                        setEndHM(Number((eq.hourMeter + 8.5).toFixed(1)));
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  >
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.id}>
                        {eq.code} - {eq.name} (HM: {eq.hourMeter})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Job Site / Proyek *</label>
                  <select 
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Nama Operator</label>
                  <input 
                    type="text" 
                    value={operatorName}
                    onChange={e => setOperatorName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Shift Operasional</label>
                  <select 
                    value={shift}
                    onChange={e => setShift(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="SHIFT_1_DAY">Shift 1 (Siang: 07:00 - 17:00)</option>
                    <option value="SHIFT_2_NIGHT">Shift 2 (Malam: 19:00 - 05:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-2xl border border-amber-200/40 dark:border-amber-800/30">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">HM Awal Shift</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={startHM}
                    onChange={e => setStartHM(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">HM Akhir Shift</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={endHM}
                    onChange={e => setEndHM(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 text-[10px]">Produksi (Jam)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={operatingHours}
                    onChange={e => setOperatingHours(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 text-[10px]">Idle (Jam)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={idleHours}
                    onChange={e => setIdleHours(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 text-[10px]">Hujan (Jam)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={standbyRainHours}
                    onChange={e => setStandbyRainHours(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 text-[10px]">Solar (Liter)</label>
                  <input 
                    type="number" 
                    value={fuelConsumed}
                    onChange={e => setFuelConsumed(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono font-bold text-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">Uraian Pekerjaan / Lokasi Pit STA</label>
                <textarea 
                  rows={2}
                  value={workDescription}
                  onChange={e => setWorkDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-all"
                >
                  Simpan & Submit Timesheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
