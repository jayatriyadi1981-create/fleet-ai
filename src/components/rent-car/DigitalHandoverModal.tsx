/**
 * Fleet Intelligence Smart AI - Digital Handover & 360° Damage Inspection Modal
 * Features interactive car body damage pinning, checklist inspection, 
 * side-by-side Check-Out vs Check-In comparison, and automated deposit settlement.
 */

import React, { useState } from 'react';
import { RentalBooking, DamagePin, HandoverInspection } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  X, 
  CheckCircle2, 
  Car, 
  Fuel, 
  Gauge, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  MapPin, 
  DollarSign, 
  FileText, 
  Sparkles,
  ClipboardCheck,
  Check,
  Camera,
  PenTool
} from 'lucide-react';

interface DigitalHandoverModalProps {
  booking: RentalBooking;
  type: 'check_out' | 'check_in';
  onClose: () => void;
  onSuccess: () => void;
}

export const DigitalHandoverModal: React.FC<DigitalHandoverModalProps> = ({
  booking,
  type,
  onClose,
  onSuccess
}) => {
  const isCheckIn = type === 'check_in';
  const checkout = booking.checkOutInspection;

  // Inspector & Basic Readings
  const [inspectorName, setInspectorName] = useState('Fajar Nugraha (Dispatcher Fleet)');
  const [odometer, setOdometer] = useState<number>(
    isCheckIn ? (checkout?.odometerReadingKm || 18000) + 420 : (checkout?.odometerReadingKm || 18000)
  );
  const [fuelPercent, setFuelPercent] = useState<number>(isCheckIn ? 75 : 100);
  const [exteriorCleanliness, setExteriorCleanliness] = useState<'clean' | 'moderate' | 'dirty'>('clean');
  const [interiorCleanliness, setInteriorCleanliness] = useState<'clean' | 'moderate' | 'dirty'>('clean');

  // Checklist Items
  const [checklist, setChecklist] = useState<HandoverInspection['checklist']>({
    stnkOriginal: true,
    spareTire: true,
    jackAndTools: true,
    firstAidKit: true,
    warningTriangle: true,
    keyChain: true,
    dashcamActive: true,
    acCold: true,
    headlightsWorking: true,
    taillightsWorking: true,
    infotainmentWorking: true,
    carMatsComplete: true
  });

  // Damage Pins State
  const [damagePins, setDamagePins] = useState<DamagePin[]>(
    isCheckIn && checkout ? [...checkout.damagePins] : []
  );
  const [selectedView, setSelectedView] = useState<'top' | 'front' | 'rear' | 'left' | 'right'>('top');
  
  // New Pin Draft State
  const [activePinDraft, setActivePinDraft] = useState<{
    x: number;
    y: number;
    partName: string;
    damageType: DamagePin['damageType'];
    severity: DamagePin['severity'];
    estimatedCost: number;
    notes: string;
  } | null>(null);

  // Signatures & Notes
  const [inspectorNotes, setInspectorNotes] = useState(
    isCheckIn 
      ? 'Pengecekan unit saat kembali. Kondisi mesin normal, interior rapi.' 
      : 'Kendaraan diserahterimakan dalam kondisi bersih dan siap jalan.'
  );
  const [customerSignName, setCustomerSignName] = useState(booking.customerName);
  const [hasSigned, setHasSigned] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Settlement Deductions for Check-In
  const initialDeposit = booking.financials.securityDepositAmount || 1500000;
  const initialFuel = checkout ? checkout.fuelLevelPercent : 100;
  const fuelShortagePercent = Math.max(0, initialFuel - fuelPercent);
  const missingLiters = (fuelShortagePercent / 100) * 55;
  const fuelShortageFee = Math.round(missingLiters * 16500);

  // Calculate new damage costs
  const checkOutPinIds = checkout ? checkout.damagePins.map((p) => p.id) : [];
  const newDamagePins = damagePins.filter((p) => !checkOutPinIds.includes(p.id));
  const newDamageTotalCost = newDamagePins.reduce((sum, p) => sum + p.estimatedCost, 0);

  const cleaningFee = interiorCleanliness === 'dirty' ? 100000 : 0;
  const overdueHours = isCheckIn && booking.status === 'overdue' ? 4 : 0;
  const overdueFee = overdueHours * 85000;
  const totalDeductions = fuelShortageFee + newDamageTotalCost + cleaningFee + overdueFee;
  const calculatedRefund = Math.max(0, initialDeposit - totalDeductions);
  const customerExtraBill = totalDeductions > initialDeposit ? totalDeductions - initialDeposit : 0;

  // Handle Diagram Click to Drop Pin
  const handleDiagramClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPercent = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const defaultPartNames: Record<string, string> = {
      top: 'Kap Mesin / Atap / Bagasi',
      front: 'Bumper Depan / Grille',
      rear: 'Bumper Belakang / Kaca Belakang',
      left: 'Pintu Samping Kiri / Spion Kiri',
      right: 'Pintu Samping Kanan / Spion Kanan'
    };

    setActivePinDraft({
      x: xPercent,
      y: yPercent,
      partName: defaultPartNames[selectedView] || 'Bodi Mobil',
      damageType: 'scratch',
      severity: 'minor',
      estimatedCost: 250000,
      notes: 'Baret / dent baru ditemukan saat inspeksi'
    });
  };

  const handleSavePinDraft = () => {
    if (!activePinDraft) return;
    const newPin: DamagePin = {
      id: `dmg-${Date.now()}`,
      xPercent: activePinDraft.x,
      yPercent: activePinDraft.y,
      view: selectedView,
      partName: activePinDraft.partName,
      damageType: activePinDraft.damageType,
      severity: activePinDraft.severity,
      estimatedCost: activePinDraft.estimatedCost,
      notes: activePinDraft.notes
    };
    setDamagePins([...damagePins, newPin]);
    setActivePinDraft(null);
  };

  const handleRemovePin = (id: string) => {
    setDamagePins(damagePins.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (isCheckIn) {
        rentCarService.processCheckIn(booking.id, {
          inspectorName,
          odometerReadingKm: odometer,
          fuelLevelPercent: fuelPercent,
          exteriorCleanliness,
          interiorCleanliness,
          checklist,
          damagePins,
          inspectorNotes,
          customerSignatureName: customerSignName
        });
      } else {
        rentCarService.processCheckOut(booking.id, {
          inspectorName,
          odometerReadingKm: odometer,
          fuelLevelPercent: fuelPercent,
          exteriorCleanliness,
          interiorCleanliness,
          checklist,
          damagePins,
          inspectorNotes,
          customerSignatureName: customerSignName
        });
      }
      setIsSubmitting(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isCheckIn ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isCheckIn ? 'Inspeksi Pengembalian Unit (Check-In)' : 'Serah Terima Kendaraan (Check-Out)'}</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-cyan-300">
                  {booking.bookingNumber}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Unit: <strong className="text-slate-200">{booking.vehicleBrand} {booking.vehicleModel} ({booking.vehiclePlate})</strong> • Penyewa: <strong className="text-slate-200">{booking.customerName}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Row 1: Telematics & Odometer Readings */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            {/* Odometer */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Odometer (KM)
              </label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold focus:border-cyan-500 focus:outline-none"
              />
              {isCheckIn && checkout && (
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Awal Check-Out: {checkout.odometerReadingKm.toLocaleString()} km (Total: {odometer - checkout.odometerReadingKm} km)
                </span>
              )}
            </div>

            {/* Fuel Level */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-amber-400" /> Level BBM (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={fuelPercent}
                  onChange={(e) => setFuelPercent(Number(e.target.value))}
                  className="flex-1 accent-amber-400"
                />
                <span className="text-sm font-mono font-bold text-amber-400 w-12 text-right">{fuelPercent}%</span>
              </div>
              {isCheckIn && fuelShortagePercent > 0 && (
                <span className="text-[10px] text-rose-400 mt-1 block">
                  Kurang {fuelShortagePercent}% (~Rp {fuelShortageFee.toLocaleString('id-ID')})
                </span>
              )}
            </div>

            {/* Exterior Cleanliness */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Kebersihan Eksterior
              </label>
              <select
                value={exteriorCleanliness}
                onChange={(e) => setExteriorCleanliness(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="clean">Bersih & Mulus (Clean)</option>
                <option value="moderate">Wajar Berdebu (Moderate)</option>
                <option value="dirty">Sangat Kotor / Berlumpur (Dirty)</option>
              </select>
            </div>

            {/* Interior Cleanliness */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Kebersihan Interior
              </label>
              <select
                value={interiorCleanliness}
                onChange={(e) => setInteriorCleanliness(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="clean">Bersih & Wangi (Clean)</option>
                <option value="moderate">Wajar (Moderate)</option>
                <option value="dirty">Kotor Noda / Bau Asap (Denda Cuci)</option>
              </select>
            </div>
          </div>

          {/* Row 2: 360° Car Body Damage Inspection Diagram */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Car className="w-4 h-4 text-cyan-400" />
                  <span>Diagram Kerusakan Bodi Mobil (Klik pada diagram untuk tandai)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tandai baret (scratch), penyok (dent), atau retak kaca dengan pin koordinat.
                </p>
              </div>

              {/* View Selector Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                {(['top', 'front', 'rear', 'left', 'right'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold uppercase transition-all ${
                      selectedView === view 
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Blueprint Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Diagram Canvas Box */}
              <div className="lg:col-span-2 relative h-[260px] rounded-xl bg-slate-900/90 border border-slate-700 overflow-hidden flex items-center justify-center cursor-crosshair">
                <div 
                  onClick={handleDiagramClick} 
                  className="relative w-full h-full flex items-center justify-center p-4"
                >
                  {/* Stylized Vector Car Blueprint by View */}
                  <svg className="w-full h-full max-h-[220px] stroke-cyan-500/60 fill-slate-950/60" viewBox="0 0 400 200">
                    {selectedView === 'top' && (
                      <g strokeWidth="2">
                        {/* Car Silhouette Top */}
                        <path d="M 80 40 Q 200 25, 320 40 Q 360 40, 370 70 L 370 130 Q 360 160, 320 160 Q 200 175, 80 160 Q 40 160, 30 130 L 30 70 Q 40 40, 80 40 Z" />
                        {/* Windshield & Rear Window */}
                        <path d="M 120 50 Q 200 45, 280 50 L 270 75 Q 200 70, 130 75 Z" fill="#0284c7" fillOpacity="0.2" />
                        <path d="M 120 150 Q 200 155, 280 150 L 270 125 Q 200 130, 130 125 Z" fill="#0284c7" fillOpacity="0.2" />
                        {/* Roof Outline */}
                        <rect x="135" y="65" width="130" height="70" rx="8" />
                        {/* Hood & Trunk Lines */}
                        <line x1="80" y1="40" x2="80" y2="160" strokeDasharray="4 2" />
                        <line x1="320" y1="40" x2="320" y2="160" strokeDasharray="4 2" />
                      </g>
                    )}

                    {selectedView === 'front' && (
                      <g strokeWidth="2">
                        {/* Front Bumper & Headlights */}
                        <path d="M 60 140 Q 200 160, 340 140 L 320 80 Q 200 65, 80 80 Z" />
                        <rect x="75" y="90" width="40" height="25" rx="5" fill="#38bdf8" fillOpacity="0.3" />
                        <rect x="285" y="90" width="40" height="25" rx="5" fill="#38bdf8" fillOpacity="0.3" />
                        <rect x="140" y="105" width="120" height="30" rx="4" strokeDasharray="3 3" />
                      </g>
                    )}

                    {selectedView === 'rear' && (
                      <g strokeWidth="2">
                        {/* Rear Bumper & Taillights */}
                        <path d="M 60 140 Q 200 160, 340 140 L 320 80 Q 200 65, 80 80 Z" />
                        <rect x="75" y="90" width="40" height="25" rx="5" fill="#ef4444" fillOpacity="0.4" />
                        <rect x="285" y="90" width="40" height="25" rx="5" fill="#ef4444" fillOpacity="0.4" />
                        <rect x="150" y="110" width="100" height="25" rx="3" stroke="#e2e8f0" />
                      </g>
                    )}

                    {(selectedView === 'left' || selectedView === 'right') && (
                      <g strokeWidth="2">
                        {/* Side Profile */}
                        <path d="M 30 130 L 60 130 Q 80 80, 110 80 L 290 80 Q 320 80, 340 130 L 370 130 Q 370 150, 350 150 L 330 150 Q 310 120, 270 120 Q 230 120, 210 150 L 170 150 Q 150 120, 110 120 Q 70 120, 50 150 L 30 150 Z" />
                        {/* Side Windows */}
                        <polygon points="120,85 190,85 190,115 110,115" fill="#0284c7" fillOpacity="0.2" />
                        <polygon points="200,85 280,85 270,115 200,115" fill="#0284c7" fillOpacity="0.2" />
                      </g>
                    )}
                  </svg>

                  {/* Render Pins for Current View */}
                  {damagePins
                    .filter((p) => p.view === selectedView)
                    .map((pin, pIdx) => {
                      const isNewInCheckin = isCheckIn && !checkOutPinIds.includes(pin.id);

                      return (
                        <div
                          key={pin.id}
                          style={{ top: `${pin.yPercent}%`, left: `${pin.xPercent}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg border-2 z-20 cursor-pointer ${
                            isNewInCheckin
                              ? 'bg-rose-500 text-white border-white animate-bounce'
                              : 'bg-amber-500 text-slate-950 border-amber-200'
                          }`}
                          title={`${pin.partName}: ${pin.damageType} (${pin.severity})`}
                        >
                          {pIdx + 1}
                        </div>
                      );
                    })}

                  {/* Render Draft Pin if user just clicked */}
                  {activePinDraft && (
                    <div
                      style={{ top: `${activePinDraft.y}%`, left: `${activePinDraft.x}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-cyan-400 text-slate-950 font-bold border-2 border-white flex items-center justify-center text-xs animate-ping z-30"
                    >
                      ✦
                    </div>
                  )}
                </div>

                <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  Tampilan: <strong className="text-cyan-400 uppercase">{selectedView} view</strong> • Klik untuk tambah pin
                </div>
              </div>

              {/* Pin Form / List Box */}
              <div className="space-y-3 flex flex-col justify-between">
                {activePinDraft ? (
                  <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/50 space-y-2 text-xs">
                    <div className="font-bold text-cyan-300 flex items-center justify-between">
                      <span>Input Detail Kerusakan</span>
                      <button onClick={() => setActivePinDraft(null)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block">Bagian Bodi</label>
                      <input
                        type="text"
                        value={activePinDraft.partName}
                        onChange={(e) => setActivePinDraft({ ...activePinDraft, partName: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block">Tipe Kerusakan</label>
                        <select
                          value={activePinDraft.damageType}
                          onChange={(e) => setActivePinDraft({ ...activePinDraft, damageType: e.target.value as any })}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs"
                        >
                          <option value="scratch">Baret (Scratch)</option>
                          <option value="dent">Penyok (Dent)</option>
                          <option value="crack">Retak Kaca</option>
                          <option value="paint_chip">Cat Terkelupas</option>
                          <option value="missing">Hilang / Copot</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">Tingkat Keparahan</label>
                        <select
                          value={activePinDraft.severity}
                          onChange={(e) => setActivePinDraft({ ...activePinDraft, severity: e.target.value as any })}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs"
                        >
                          <option value="minor">Ringan (Minor)</option>
                          <option value="moderate">Sedang (Moderate)</option>
                          <option value="severe">Parah (Severe)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block">Estimasi Biaya Perbaikan (Rp)</label>
                      <input
                        type="number"
                        step="50000"
                        value={activePinDraft.estimatedCost}
                        onChange={(e) => setActivePinDraft({ ...activePinDraft, estimatedCost: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-emerald-400 font-mono text-xs font-bold"
                      />
                    </div>

                    <button
                      onClick={handleSavePinDraft}
                      className="w-full py-1.5 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors text-xs"
                    >
                      Simpan Pin Kerusakan
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] pr-1">
                    <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                      <span>Daftar Kerusakan ({damagePins.length} Titik)</span>
                    </div>

                    {damagePins.length === 0 ? (
                      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                        Belum ada kerusakan tercatat (Kondisi mulus).
                      </div>
                    ) : (
                      damagePins.map((pin, i) => {
                        const isNew = isCheckIn && !checkOutPinIds.includes(pin.id);

                        return (
                          <div
                            key={pin.id}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                              isNew ? 'bg-rose-950/20 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div>
                              <div className="font-semibold flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 text-[10px] flex items-center justify-center font-mono">
                                  {i + 1}
                                </span>
                                <span>{pin.partName}</span>
                                {isNew && (
                                  <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white text-[9px] font-bold">
                                    BARU
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {pin.damageType} ({pin.severity}) • Rp {pin.estimatedCost.toLocaleString('id-ID')}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemovePin(pin.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Standard Checklist Grid */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Kelengkapan & Dokumen Kendaraan</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
              {[
                { key: 'stnkOriginal', label: 'STNK Asli Berlaku' },
                { key: 'spareTire', label: 'Ban Cadangan Ready' },
                { key: 'jackAndTools', label: 'Dongkrak & Kunci Roda' },
                { key: 'firstAidKit', label: 'Kotak P3K Lengkap' },
                { key: 'warningTriangle', label: 'Segitiga Pengaman' },
                { key: 'keyChain', label: 'Kunci Serep / Keychain' },
                { key: 'dashcamActive', label: 'Dashcam 24/7 Aktif' },
                { key: 'acCold', label: 'AC Dingin Normal' },
                { key: 'headlightsWorking', label: 'Lampu Utama Normal' },
                { key: 'taillightsWorking', label: 'Lampu Rem & Sein' },
                { key: 'infotainmentWorking', label: 'Audio & Bluetooth' },
                { key: 'carMatsComplete', label: 'Karpet Mobil Lengkap' }
              ].map((item) => {
                const isChecked = (checklist as any)[item.key];

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setChecklist({ ...checklist, [item.key]: !isChecked })}
                    className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[11px] font-medium">{item.label}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${isChecked ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'}`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4 (For Check-In Only): Automated Deposit Settlement Calculation */}
          {isCheckIn && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Rekonsiliasi Pengembalian Deposit Keamanan (Escrow Settlement)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                  Deposit Awal: Rp {initialDeposit.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Denda Terlambat ({overdueHours} Jam)</span>
                  <span className={`font-mono font-bold ${overdueFee > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                    - Rp {overdueFee.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Kekurangan BBM ({fuelShortagePercent}%)</span>
                  <span className={`font-mono font-bold ${fuelShortageFee > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                    - Rp {fuelShortageFee.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Kerusakan Bodi Baru ({newDamagePins.length} Pin)</span>
                  <span className={`font-mono font-bold ${newDamageTotalCost > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                    - Rp {newDamageTotalCost.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Biaya Cuci Khusus</span>
                  <span className={`font-mono font-bold ${cleaningFee > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                    - Rp {cleaningFee.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Total Settlement Result */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="text-slate-400">Total Potongan Biaya: </span>
                  <strong className="text-rose-400 font-mono">Rp {totalDeductions.toLocaleString('id-ID')}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">Dana Dikembalikan ke Pelanggan:</span>
                  <span className="text-base font-bold font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
                    Rp {calculatedRefund.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Row 5: Notes & Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Catatan Petugas Inspeksi
              </label>
              <textarea
                rows={3}
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>Tanda Tangan Digital Penyewa</span>
                <span className="text-emerald-400 font-normal">Tervalidasi Digital e-Sign</span>
              </label>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{customerSignName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{new Date().toLocaleString('id-ID')}</div>
                </div>
                <div className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SIGNED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
              isCheckIn 
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-950' 
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-950'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Memproses...' : isCheckIn ? 'Selesaikan Check-In & Refund Deposit' : 'Konfirmasi & Rilis Kendaraan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
