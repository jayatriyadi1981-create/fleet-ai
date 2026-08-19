/**
 * Fleet Intelligence Smart AI - Manual Refueling Modal
 * PROMPT 24 - Refueling Input Form + Photo Upload + Offline Queue Simulation
 */

import React, { useState } from 'react';
import { X, Fuel, Camera, Upload, CheckCircle2, Wifi, WifiOff, Send } from 'lucide-react';
import { RefuelingEvent, FuelType } from '../../types';
import { ReceiptOcrScanner } from '../widgets/ReceiptOcrScanner';

interface ManualRefuelingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (refueling: Partial<RefuelingEvent>) => void;
}

export const ManualRefuelingModal: React.FC<ManualRefuelingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [vehiclePlate, setVehiclePlate] = useState('B 9876 XYZ');
  const [driverName, setDriverName] = useState('Budi Santoso');
  const [fuelType, setFuelType] = useState<FuelType>('BIODIESEL');
  const [volume, setVolume] = useState('180');
  const [pricePerLiter, setPricePerLiter] = useState('6800');
  const [totalCost, setTotalCost] = useState('1224000');
  const [odometer, setOdometer] = useState('142610');
  const [stationName, setStationName] = useState('SPBU Pertamina 31.10201 Cikarang Utama');
  const [receiptNumber, setReceiptNumber] = useState('INV/SPBU/20260815/982');
  const [isOffline, setIsOffline] = useState(false);
  const [queuedItems, setQueuedItems] = useState<number>(0);

  if (!isOpen) return null;

  const handleOcrComplete = (data: {
    stationName: string;
    volume: number;
    pricePerLiter: number;
    totalCost: number;
    receiptNumber: string;
    fuelType: string;
  }) => {
    setStationName(data.stationName);
    setVolume(data.volume.toString());
    setPricePerLiter(data.pricePerLiter.toString());
    setTotalCost(data.totalCost.toString());
    setReceiptNumber(data.receiptNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isOffline) {
      setQueuedItems((prev) => prev + 1);
      alert('Koneksi offline detected! Transaksi pengisian disimpan di antrean lokal (Local Storage) dan akan otomatis disinkronisasi saat sinyal kembali.');
      onClose();
      return;
    }

    onSubmit({
      vehiclePlate,
      driverName,
      fuelType,
      volume: parseFloat(volume),
      pricePerLiter: parseFloat(pricePerLiter),
      totalCost: parseFloat(totalCost),
      odometer: parseInt(odometer, 10),
      stationName,
      receiptNumber,
      paymentMethod: 'FUEL_CARD',
      source: 'MANUAL_ENTRY',
      status: 'VERIFIED',
      verified: true,
      timestamp: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 border border-cyan-800/50 text-cyan-400 rounded-xl">
              <Fuel className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Pencatatan Pengisian BBM (Driver/Admin)</h2>
              <p className="text-xs text-slate-400">Input struk manual, pemindaian OCR, dan sinkronisasi antrean offline.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Offline Toggle Simulation */}
        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            {isOffline ? <WifiOff className="h-4 w-4 text-amber-400" /> : <Wifi className="h-4 w-4 text-emerald-400" />}
            <span className="font-semibold text-white">
              Status Jaringan: {isOffline ? 'MODUS OFFLINE (Sinyal Lemah)' : 'TERHUBUNG (Online Sync)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px]"
          >
            Simulasi Mode: {isOffline ? 'Switch Online' : 'Switch Offline'}
          </button>
        </div>

        <ReceiptOcrScanner onScanComplete={handleOcrComplete} />

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Plat Kendaraan</label>
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Nama Pengemudi</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Nama SPBU / Stasiun</label>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Jenis Bahan Bakar</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="BIODIESEL">BIODIESEL (B35)</option>
                <option value="SOLAR">SOLAR PERTAMINA</option>
                <option value="PERTALITE">PERTALITE</option>
                <option value="PERTAMAX">PERTAMAX</option>
                <option value="DIESEL">SHELL DIESEL</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Volume (Liter)</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Harga per Liter (IDR)</label>
              <input
                type="number"
                value={pricePerLiter}
                onChange={(e) => setPricePerLiter(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Total Biaya (IDR)</label>
              <input
                type="number"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-bold text-emerald-400 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Odometer Saat Pengisian (KM)</label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/30"
            >
              <Send className="h-4 w-4" />
              {isOffline ? 'Simpan ke Antrean Local Offline' : 'Kirim Struk Transaksi BBM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
