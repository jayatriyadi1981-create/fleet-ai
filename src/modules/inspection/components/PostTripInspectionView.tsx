/**
 * Fleet Intelligence Smart AI - Post-Trip Inspection Console
 * Inspects vehicle upon return: final odometer, fuel level, cargo condition, handbrake, and safety lock.
 */

import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  Fuel, 
  MapPin, 
  FileCheck2, 
  Check 
} from 'lucide-react';
import { useFleet } from '../../../context/FleetContext';
import { inspectionService } from '../services/inspectionService';
import { VehicleInspection, ItemConditionResult } from '../types/inspection';

interface PostTripInspectionViewProps {
  onCompleted: (inspection: VehicleInspection) => void;
}

export const PostTripInspectionView: React.FC<PostTripInspectionViewProps> = ({
  onCompleted,
}) => {
  const { vehicles, currentUser } = useFleet();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const [finalOdometer, setFinalOdometer] = useState<number>((selectedVehicle?.odometerKm || 89450) + 120);
  const [remainingFuel, setRemainingFuel] = useState<number>(65);
  const [locationName, setLocationName] = useState<string>('Depot Logistik Cakung, Jakarta');
  const [notes, setNotes] = useState<string>('');
  const [signatureSigned, setSignatureSigned] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Post-trip specific items
  const [postItems, setPostItems] = useState([
    {
      id: 'PT-01',
      category: 'BODY',
      itemCode: 'CARGO_BAY_CLEAN',
      itemName: 'Kebersihan & Kerapian Bak Muatan (Cargo Bay)',
      description: 'Muatan telah dibongkar tuntas, tidak ada sampah/cairan tersisa di dalam box.',
      result: 'PASS' as ItemConditionResult,
      notes: '',
    },
    {
      id: 'PT-02',
      category: 'BRAKE',
      itemCode: 'PARKING_BRAKE_LOCK',
      itemName: 'Rem Parkir Terkunci & Wheel Chock Terpasang',
      description: 'Handbrake aktif maksimal dan ganjal ban dipasang di pool.',
      result: 'PASS' as ItemConditionResult,
      notes: '',
    },
    {
      id: 'PT-03',
      category: 'BATTERY',
      itemCode: 'BATTERY_MASTER_SWITCH',
      itemName: 'Kelistrikan / Sakelar Utama Aki Dimatikan',
      description: 'Lampu kabin padam, AC off, master switch aki off.',
      result: 'PASS' as ItemConditionResult,
      notes: '',
    },
    {
      id: 'PT-04',
      category: 'BODY',
      itemCode: 'BODY_DAMAGE_CHECK',
      itemName: 'Pemeriksaan Bodi Pasca Perjalanan (No New Dents)',
      description: 'Tidak ada goresan baru atau benturan selama rute hari ini.',
      result: 'PASS' as ItemConditionResult,
      notes: '',
    },
  ]);

  const handleResultChange = (id: string, res: ItemConditionResult) => {
    setPostItems(prev => prev.map(it => it.id === id ? { ...it, result: res } : it));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const convertedItems = postItems.map(p => ({
      id: p.id,
      inspectionId: '',
      category: p.category as any,
      itemCode: p.itemCode,
      itemName: p.itemName,
      required: true,
      result: p.result,
      photoRequired: false,
      photos: [],
      notes: p.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const inspection = inspectionService.submitInspection({
      vehicleId: selectedVehicle.id,
      vehiclePlate: selectedVehicle.plateNumber,
      vehicleModel: `${selectedVehicle.brand} ${selectedVehicle.model}`,
      vehicleType: selectedVehicle.type,
      driverId: currentUser?.id || 'D-001',
      driverName: currentUser?.name || 'Driver Pengemudi',
      tripId: 'TRIP-RETURN-01',
      tripRoute: 'Rute Selesai -> Kembali ke Pool Cakung',
      type: 'POST_TRIP',
      odometer: finalOdometer,
      previousOdometer: selectedVehicle.odometerKm,
      locationName,
      notes,
      items: convertedItems,
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
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              Formulir Post-Trip
            </span>
            <span className="text-xs text-slate-400">Pemeriksaan Pasca Tugas Selesai</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white mt-1">Serah Terima Kendaraan Kembali ke Pool</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Catat odometer akhir, sisa BBM, dan pastikan unit diparkir dengan aman sesuai SOP.
          </p>
        </div>
      </div>

      {/* Vehicle & Fuel telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Pilih Kendaraan Kembali</label>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
          >
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.plateNumber} — {v.brand} {v.model}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Odometer Akhir Perjalanan (KM)</label>
          <input
            type="number"
            value={finalOdometer}
            onChange={(e) => setFinalOdometer(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Sisa BBM Tangki (%)</label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={100}
              value={remainingFuel}
              onChange={(e) => setRemainingFuel(Number(e.target.value))}
              className="w-full p-2.5 pl-8 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
            />
            <Fuel className="w-4 h-4 text-amber-400 absolute left-2.5 top-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Lokasi Pool Parkir</label>
          <div className="relative">
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full p-2.5 pl-8 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
            />
            <MapPin className="w-4 h-4 text-cyan-400 absolute left-2.5 top-3" />
          </div>
        </div>
      </div>

      {/* Post Items Checklist */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
        <h2 className="text-sm font-bold text-white">Daftar Pengecekan Parkir Akhir</h2>
        
        <div className="space-y-3">
          {postItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <span className="text-sm font-semibold text-white">{item.itemName}</span>
                <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResultChange(item.id, 'PASS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    item.result === 'PASS' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PASS
                </button>
                <button
                  type="button"
                  onClick={() => handleResultChange(item.id, 'FAIL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    item.result === 'FAIL' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  FAIL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signature & Submit */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {signatureSigned ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Check className="w-4 h-4" />
              Tanda Tangan Tervalidasi
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSignatureSigned(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Tanda Tangan Serah Terima
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={isSubmitting || !signatureSigned}
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Menyimpan...' : 'Submit Post-Trip'}
        </button>
      </div>
    </div>
  );
};
