/**
 * Fleet Intelligence Smart AI - Mobile Driver Pre-Trip Inspection Experience
 * Native responsive step-by-step checklist, offline auto-save, camera capture, and sticky actions.
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  ShieldAlert, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Wifi, 
  WifiOff, 
  Check, 
  CarFront, 
  Truck, 
  MapPin, 
  Gauge 
} from 'lucide-react';
import { useFleet } from '../../../context/FleetContext';
import { inspectionService } from '../services/inspectionService';
import { ItemConditionResult, VehicleInspection } from '../types/inspection';

interface MobileInspectionModeProps {
  onExitMobile: () => void;
  onCompleted: (inspection: VehicleInspection) => void;
}

export const MobileInspectionMode: React.FC<MobileInspectionModeProps> = ({
  onExitMobile,
  onCompleted,
}) => {
  const { vehicles, currentUser } = useFleet();
  const selectedVehicle = vehicles[0] || { id: 'V-001', plateNumber: 'B 9234 KMN', brand: 'Isuzu', model: 'Giga FVR', odometerKm: 89450 };

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local_saved'>('synced');
  const [signatureSigned, setSignatureSigned] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Progressive steps list
  const steps = [
    {
      id: 'step_veh',
      title: 'Informasi Unit',
      category: 'VEHICLE',
      description: 'Periksa plat nomor dan odometer awal',
    },
    {
      id: 'step_tire',
      title: 'Pemeriksaan Ban',
      category: 'TIRE',
      description: 'Kondisi 4 roda utama & ban serep',
    },
    {
      id: 'step_brake',
      title: 'Sistem Rem',
      category: 'BRAKE',
      description: 'Pedal rem, tekanan angin & handbrake',
    },
    {
      id: 'step_light',
      title: 'Lampu & Sinyal',
      category: 'LIGHT',
      description: 'Headlight, sein belok & lampu rem',
    },
    {
      id: 'step_fluids',
      title: 'Oli & Radiator',
      category: 'OIL',
      description: 'Volume pelumas mesin & air radiator',
    },
    {
      id: 'step_safety',
      title: 'APAR & K3 Safety',
      category: 'SAFETY_EQUIPMENT',
      description: 'Tabung pemadam APAR & segitiga pengaman',
    },
    {
      id: 'step_sign',
      title: 'Tanda Tangan & Selesai',
      category: 'SIGNATURE',
      description: 'Deklarasi kebenaran data & submit',
    },
  ];

  // Mobile checklist answer states
  const [mobileAnswers, setMobileAnswers] = useState<Record<string, { result: ItemConditionResult; notes: string; photoUrl?: string }>>({
    TIRE: { result: 'PASS', notes: '' },
    BRAKE: { result: 'PASS', notes: '' },
    LIGHT: { result: 'PASS', notes: '' },
    OIL: { result: 'PASS', notes: '' },
    SAFETY_EQUIPMENT: { result: 'PASS', notes: '' },
  });

  const handleSetAnswer = (cat: string, result: ItemConditionResult) => {
    setMobileAnswers(prev => ({
      ...prev,
      [cat]: { ...prev[cat], result },
    }));
    setSyncStatus('local_saved');
    setTimeout(() => setSyncStatus('synced'), 600);
  };

  const handleSetNotes = (cat: string, notes: string) => {
    setMobileAnswers(prev => ({
      ...prev,
      [cat]: { ...prev[cat], notes },
    }));
  };

  const handleCapturePhoto = (cat: string) => {
    setMobileAnswers(prev => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        photoUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      },
    }));
  };

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmitMobile = () => {
    setIsSubmitting(true);
    const convertedItems = Object.entries(mobileAnswers).map(([cat, val], idx) => ({
      id: `ITM-MOB-${idx}`,
      inspectionId: '',
      category: cat as any,
      itemCode: `${cat}_CHECK`,
      itemName: `Pemeriksaan ${cat}`,
      required: true,
      result: val.result,
      severity: val.result === 'FAIL' ? 'HIGH' : 'LOW',
      groundingTrigger: cat === 'BRAKE' || cat === 'SAFETY_EQUIPMENT',
      photoRequired: false,
      photos: val.photoUrl ? [{
        id: `PH-MOB-${idx}`,
        inspectionId: '',
        fileUrl: val.photoUrl,
        category: cat as any,
        timestamp: new Date().toISOString(),
        uploadedBy: 'driver',
        uploaderName: currentUser?.name || 'Driver',
        createdAt: new Date().toISOString(),
      }] : [],
      notes: val.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const inspection = inspectionService.submitInspection({
      vehicleId: selectedVehicle.id || 'V-001',
      vehiclePlate: selectedVehicle.plateNumber,
      vehicleModel: `${selectedVehicle.brand || 'Isuzu'} ${selectedVehicle.model || 'Giga'}`,
      vehicleType: 'truck_box',
      driverId: currentUser?.id || 'D-001',
      driverName: currentUser?.name || 'Budi Hartono',
      tripId: 'TRIP-MOB-01',
      tripRoute: 'Jakarta -> Bandung Ekspres',
      type: 'PRE_TRIP',
      odometer: selectedVehicle.odometerKm,
      previousOdometer: selectedVehicle.odometerKm,
      locationName: 'Depot Pool Pengemudi',
      items: convertedItems as any,
      photos: [],
      templateId: 'TMPL-TRUCK-STD',
      signature: {
        signatureUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiPjxwYXRoIGQ9Ik0xMCwyMCBRNDAsMTAgNjAsMjUgVDkwLDE1IiBzdHJva2U9IiMwNmI2ZDRCIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
        signedAt: new Date().toISOString(),
        signedBy: currentUser?.name || 'Driver',
        declarationAccepted: true,
      },
    });

    setIsSubmitting(false);
    onCompleted(inspection);
  };

  return (
    <div className="max-w-md mx-auto min-h-[85vh] flex flex-col justify-between rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 pb-4">
      {/* Mobile Top Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onExitMobile}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-xs font-bold text-white">Pre-Trip Pengemudi</div>
          <div className="text-[10px] text-cyan-400 font-mono">
            Langkah {currentStepIndex + 1} dari {steps.length}
          </div>
        </div>

        {/* Sync Indicator */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          {syncStatus === 'synced' ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <Wifi className="w-3.5 h-3.5" />
              Tersinkron
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400">
              <Save className="w-3.5 h-3.5 animate-pulse" />
              Tersimpan Lokal
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5">
        <div
          className="bg-cyan-500 h-full transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Content Area */}
      <div className="p-5 flex-1 space-y-4 overflow-y-auto">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">{currentStep.title}</h2>
          <p className="text-xs text-slate-400">{currentStep.description}</p>
        </div>

        {/* STEP 1: Vehicle Card */}
        {currentStep.category === 'VEHICLE' && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-white">{selectedVehicle.plateNumber}</div>
                <div className="text-xs text-slate-400">{selectedVehicle.brand} {selectedVehicle.model}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950">
                <div className="text-[10px] text-slate-500">Tugas Hari Ini</div>
                <div className="font-semibold text-slate-200">Jakarta → Bandung</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950">
                <div className="text-[10px] text-slate-500">Odometer Terkini</div>
                <div className="font-semibold text-slate-200">{selectedVehicle.odometerKm.toLocaleString()} KM</div>
              </div>
            </div>
          </div>
        )}

        {/* INTERMEDIATE CHECKLIST STEPS */}
        {['TIRE', 'BRAKE', 'LIGHT', 'OIL', 'SAFETY_EQUIPMENT'].includes(currentStep.category) && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="text-xs font-semibold text-slate-300">Pilih Kondisi Komponen:</div>

            {/* Large 3-Way Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSetAnswer(currentStep.category, 'PASS')}
                className={`py-3.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  mobileAnswers[currentStep.category]?.result === 'PASS'
                    ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                BAIK / PASS
              </button>

              <button
                type="button"
                onClick={() => handleSetAnswer(currentStep.category, 'ATTENTION')}
                className={`py-3.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  mobileAnswers[currentStep.category]?.result === 'ATTENTION'
                    ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-400'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                PERHATIAN
              </button>

              <button
                type="button"
                onClick={() => handleSetAnswer(currentStep.category, 'FAIL')}
                className={`py-3.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  mobileAnswers[currentStep.category]?.result === 'FAIL'
                    ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                <XCircle className="w-5 h-5" />
                RUSAK / FAIL
              </button>
            </div>

            {/* If Fail or Attention -> Input Notes & Camera */}
            {mobileAnswers[currentStep.category]?.result !== 'PASS' && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Jelaskan kondisi kerusakan..."
                  value={mobileAnswers[currentStep.category]?.notes || ''}
                  onChange={(e) => handleSetNotes(currentStep.category, e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => handleCapturePhoto(currentStep.category)}
                  className="w-full py-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {mobileAnswers[currentStep.category]?.photoUrl ? 'Foto Terlampir (Ulangi)' : 'Ambil Foto Bukti'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP: SIGNATURE & FINISH */}
        {currentStep.category === 'SIGNATURE' && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300 leading-relaxed">
              Saya mengonfirmasi bahwa seluruh informasi pemeriksaan di atas akurat sesuai pengamatan fisik langsung.
            </div>

            <div className="text-center space-y-2">
              {signatureSigned ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Tanda Tangan Pengemudi Terekam
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSignatureSigned(true)}
                  className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  Tap untuk Bubuhkan Tanda Tangan
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="p-4 border-t border-slate-900 bg-slate-950 flex items-center gap-3">
        {currentStepIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors"
          >
            Sebelumnya
          </button>
        )}

        {!isLastStep ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95"
          >
            Selanjutnya
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!signatureSigned || isSubmitting}
            onClick={handleSubmitMobile}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Mengirim...' : 'KIRIM INSPEKSI PRE-TRIP'}
          </button>
        )}
      </div>
    </div>
  );
};
