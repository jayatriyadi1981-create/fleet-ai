import React, { useState } from 'react';
import { 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  AlertTriangle, 
  ShieldCheck, 
  Camera, 
  User, 
  Truck, 
  Layers, 
  MapPin,
  Send,
  AlertCircle
} from 'lucide-react';
import { 
  HeavyEquipmentAsset, 
  HeavyOperatorProfile, 
  ConstructionProject, 
  DailyTimesheet,
  P2HInspection,
  HeavyFuelLog,
  EquipmentBreakdownRecord
} from '../../../modules/heavy-equipment/types';

interface Props {
  equipments: HeavyEquipmentAsset[];
  operators: HeavyOperatorProfile[];
  projects: ConstructionProject[];
  onSubmitP2H: (p2h: Partial<P2HInspection>) => P2HInspection;
  onSubmitTimesheet: (ts: Partial<DailyTimesheet>) => DailyTimesheet;
  onAddFuelLog: (fl: Partial<HeavyFuelLog>) => HeavyFuelLog;
  onReportBreakdown: (bd: Partial<EquipmentBreakdownRecord>) => EquipmentBreakdownRecord;
}

export const HeavyMobileOperatorTab: React.FC<Props> = ({
  equipments,
  operators,
  projects,
  onSubmitP2H,
  onSubmitTimesheet,
  onAddFuelLog,
  onReportBreakdown
}) => {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>(operators[0]?.id || '');
  const [activeMobileView, setActiveMobileView] = useState<'DASHBOARD' | 'P2H' | 'TIMESHEET' | 'FUEL' | 'SOS'>('DASHBOARD');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const currentOp = operators.find(o => o.id === selectedOperatorId) || operators[0];
  const assignedEq = equipments.find(e => e.code === currentOp?.assignedEquipmentCode) || equipments[0];
  const assignedPrj = projects.find(p => p.name === currentOp?.currentProject) || projects[0];

  // P2H quick state
  const [p2hItems, setP2hItems] = useState({
    engineOil: true,
    hydraulicOil: true,
    radiatorCoolant: true,
    brakeSystem: true,
    hornAlarm: true,
    apar: true,
    belts: true
  });
  const [p2hNotes, setP2hNotes] = useState('');

  // Timesheet quick state
  const [startHM, setStartHM] = useState(assignedEq?.hourMeter || 3420);
  const [endHM, setEndHM] = useState((assignedEq?.hourMeter || 3420) + 8.5);
  const [workDesc, setWorkDesc] = useState('Galian tanah dan perataan badan jalan');

  // Fuel quick state
  const [fuelLiters, setFuelLiters] = useState(180);
  const [bowserName, setBowserName] = useState('BOWSER-01 (Hino 500 Pitstop 10kL)');

  // SOS quick state
  const [sosReason, setSosReason] = useState('Hydraulic leak detected');

  const handleP2HSubmit = () => {
    const isAllPass = Object.values(p2hItems).every(v => v === true);
    onSubmitP2H({
      equipmentId: assignedEq.id,
      equipmentCode: assignedEq.code,
      equipmentCategory: assignedEq.category,
      operatorName: currentOp.name,
      shift: 'SHIFT_1_DAY',
      hourMeter: assignedEq.hourMeter,
      result: isAllPass ? 'FIT_TO_WORK' : 'DO_NOT_OPERATE',
      criticalDefectNotes: isAllPass ? undefined : p2hNotes || 'Defect terdeteksi pada pemeriksaan fisik'
    });
    setFeedbackMessage('Checklist P2H berhasil diunggah dengan status ' + (isAllPass ? 'FIT TO WORK ✓' : 'DO NOT OPERATE (Tag-Out) ⚠️'));
    setActiveMobileView('DASHBOARD');
  };

  const handleTimesheetSubmit = () => {
    onSubmitTimesheet({
      equipmentId: assignedEq.id,
      equipmentCode: assignedEq.code,
      equipmentName: assignedEq.name,
      operatorId: currentOp.id,
      operatorName: currentOp.name,
      projectId: assignedPrj.id,
      projectName: assignedPrj.name,
      startHM: Number(startHM),
      endHM: Number(endHM),
      totalHM: Number(endHM) - Number(startHM),
      operatingHours: Number(endHM) - Number(startHM) - 0.5,
      idleHours: 0.5,
      workDescription: workDesc,
      activityType: 'EXCAVATION'
    });
    setFeedbackMessage('Timesheet harian ' + (Number(endHM) - Number(startHM)).toFixed(1) + ' HM berhasil dikirim ke Pengawas.');
    setActiveMobileView('DASHBOARD');
  };

  const handleFuelSubmit = () => {
    onAddFuelLog({
      equipmentId: assignedEq.id,
      equipmentCode: assignedEq.code,
      equipmentName: assignedEq.name,
      projectId: assignedPrj.id,
      projectName: assignedPrj.name,
      currentHM: assignedEq.hourMeter,
      litersFilled: Number(fuelLiters),
      fuelBowserTruck: bowserName,
      dispenserOperator: 'Fuelman Site',
      unitCostPerLiter: 14500
    });
    setFeedbackMessage(`Pengisian ${fuelLiters} Liter solar berhasil dicatat.`);
    setActiveMobileView('DASHBOARD');
  };

  const handleSosSubmit = () => {
    onReportBreakdown({
      equipmentId: assignedEq.id,
      equipmentCode: assignedEq.code,
      equipmentName: assignedEq.name,
      projectId: assignedPrj.id,
      projectName: assignedPrj.name,
      siteName: currentOp.currentSite,
      operatorId: currentOp.id,
      operatorName: currentOp.name,
      location: currentOp.currentSite,
      severity: 'CRITICAL',
      rootCause: sosReason,
      failureCategory: 'HYDRAULIC',
      status: 'REPORTED'
    });
    setFeedbackMessage('🚨 Tanda Darurat Breakdown / SOS berhasil disiarkan ke Tim Mekanik & HSE!');
    setActiveMobileView('DASHBOARD');
  };

  return (
    <div className="space-y-6">
      {/* Top Selector: Pilih Profil Operator untuk Simulasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-500" />
            Simulator Aplikasi Lapangan: Operator & Mandor Lapangan (Mobile Field App)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengalaman antarmuka mobile touchscreen khusus operator alat berat di kabin: Checklist P2H Pre-Shift, Form Timesheet, Log BBM Bowser, dan Tombol Darurat SOS.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-semibold">Ganti Operator:</span>
          <select
            value={selectedOperatorId}
            onChange={(e) => setSelectedOperatorId(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
          >
            {operators.map(op => (
              <option key={op.id} value={op.id}>
                {op.name} ({op.assignedEquipmentCode || 'Belum ditugaskan'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg">
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="underline text-[11px]">Tutup</button>
        </div>
      )}

      {/* Centered Mobile Device Frame Mockup */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm bg-slate-950 rounded-[40px] border-4 border-slate-800 p-3 shadow-2xl relative overflow-hidden">
          {/* Top Speaker & Camera Notch */}
          <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
            <div className="w-10 h-1 rounded-full bg-slate-900" />
          </div>

          {/* Screen Content */}
          <div className="bg-slate-900 rounded-[30px] p-4 text-white min-h-[580px] flex flex-col justify-between border border-slate-800">
            {/* Header Kabin */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
                  {assignedEq.code}
                </div>
                <div>
                  <span className="text-xs font-bold block">{currentOp.name}</span>
                  <span className="text-[10px] text-slate-400 block">{assignedPrj.name}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ONLINE
              </span>
            </div>

            {/* Mobile View: DASHBOARD */}
            {activeMobileView === 'DASHBOARD' && (
              <div className="space-y-3.5 my-3 flex-1">
                {/* Equipment Status Card */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Hour Meter Unit</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">{assignedEq.hourMeter} HM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Level Solar B35</span>
                    <span className="font-bold text-emerald-400">{assignedEq.fuelLevelPct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Status P2H Hari Ini</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {assignedEq.lastP2hResult}
                    </span>
                  </div>
                </div>

                {/* Big Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setActiveMobileView('P2H')}
                    className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-center"
                  >
                    <ShieldCheck className="w-6 h-6" />
                    <span className="text-xs leading-tight">1. Checklist P2H Pre-Shift</span>
                  </button>

                  <button
                    onClick={() => setActiveMobileView('TIMESHEET')}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex flex-col items-center justify-center gap-1.5 border border-slate-700 transition-all active:scale-95 text-center"
                  >
                    <Clock className="w-6 h-6 text-amber-400" />
                    <span className="text-xs leading-tight">2. Input Timesheet HM</span>
                  </button>

                  <button
                    onClick={() => setActiveMobileView('FUEL')}
                    className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex flex-col items-center justify-center gap-1.5 border border-slate-700 transition-all active:scale-95 text-center"
                  >
                    <Fuel className="w-6 h-6 text-blue-400" />
                    <span className="text-xs leading-tight">3. Log Isi Solar Bowser</span>
                  </button>

                  <button
                    onClick={() => setActiveMobileView('SOS')}
                    className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-center"
                  >
                    <AlertTriangle className="w-6 h-6" />
                    <span className="text-xs leading-tight">4. SOS / Lapor Breakdown</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile View: P2H Checklist */}
            {activeMobileView === 'P2H' && (
              <div className="space-y-3 my-2 flex-1 text-xs">
                <span className="font-bold text-amber-400 block border-b border-slate-800 pb-1">
                  Pemeriksaan Fisik Pre-Shift P2H
                </span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {Object.entries(p2hItems).map(([key, val]) => (
                    <label key={key} className="flex items-center justify-between p-2 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => setP2hItems({ ...p2hItems, [key]: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                      />
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setActiveMobileView('DASHBOARD')} className="flex-1 p-2 rounded-xl bg-slate-800 font-bold">Batal</button>
                  <button onClick={handleP2HSubmit} className="flex-1 p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">Kirim P2H ✓</button>
                </div>
              </div>
            )}

            {/* Mobile View: Timesheet HM */}
            {activeMobileView === 'TIMESHEET' && (
              <div className="space-y-3 my-2 flex-1 text-xs">
                <span className="font-bold text-amber-400 block border-b border-slate-800 pb-1">
                  Input Timesheet Harian Operator
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Start HM (Awal Shift)</label>
                    <input
                      type="number"
                      value={startHM}
                      onChange={(e) => setStartHM(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">End HM (Akhir Shift)</label>
                    <input
                      type="number"
                      value={endHM}
                      onChange={(e) => setEndHM(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Uraian Pekerjaan</label>
                    <input
                      type="text"
                      value={workDesc}
                      onChange={(e) => setWorkDesc(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setActiveMobileView('DASHBOARD')} className="flex-1 p-2 rounded-xl bg-slate-800 font-bold">Batal</button>
                  <button onClick={handleTimesheetSubmit} className="flex-1 p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">Kirim Timesheet</button>
                </div>
              </div>
            )}

            {/* Mobile View: Fuel Log */}
            {activeMobileView === 'FUEL' && (
              <div className="space-y-3 my-2 flex-1 text-xs">
                <span className="font-bold text-blue-400 block border-b border-slate-800 pb-1">
                  Pencatatan Refueling Fuel Bowser
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Jumlah Liter Solar B35</label>
                    <input
                      type="number"
                      value={fuelLiters}
                      onChange={(e) => setFuelLiters(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Truk Fuel Bowser Pengisi</label>
                    <input
                      type="text"
                      value={bowserName}
                      onChange={(e) => setBowserName(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setActiveMobileView('DASHBOARD')} className="flex-1 p-2 rounded-xl bg-slate-800 font-bold">Batal</button>
                  <button onClick={handleFuelSubmit} className="flex-1 p-2 rounded-xl bg-blue-600 font-bold">Simpan Log Solar</button>
                </div>
              </div>
            )}

            {/* Mobile View: SOS Breakdown */}
            {activeMobileView === 'SOS' && (
              <div className="space-y-3 my-2 flex-1 text-xs">
                <span className="font-bold text-rose-400 block border-b border-slate-800 pb-1">
                  🚨 Lapor Kerusakan Darurat / SOS
                </span>
                <div>
                  <label className="text-slate-400 block mb-0.5">Jelaskan Kerusakan Singkat</label>
                  <textarea
                    rows={3}
                    value={sosReason}
                    onChange={(e) => setSosReason(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setActiveMobileView('DASHBOARD')} className="flex-1 p-2 rounded-xl bg-slate-800 font-bold">Batal</button>
                  <button onClick={handleSosSubmit} className="flex-1 p-2 rounded-xl bg-rose-600 font-bold">Kirim SOS 🚨</button>
                </div>
              </div>
            )}

            {/* Bottom Nav */}
            <div className="pt-2 border-t border-slate-800 flex justify-around text-center text-[10px] text-slate-400">
              <button onClick={() => setActiveMobileView('DASHBOARD')} className="p-1 hover:text-amber-400">
                Dashboard
              </button>
              <button onClick={() => setActiveMobileView('P2H')} className="p-1 hover:text-amber-400">
                P2H
              </button>
              <button onClick={() => setActiveMobileView('TIMESHEET')} className="p-1 hover:text-amber-400">
                Timesheet
              </button>
              <button onClick={() => setActiveMobileView('FUEL')} className="p-1 hover:text-amber-400">
                BBM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
