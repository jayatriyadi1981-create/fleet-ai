/**
 * Fleet Intelligence Smart AI - Create Rental Booking Wizard Modal
 */

import React, { useState } from 'react';
import { RentalVehicle, RentalCustomer, RentalPackageType } from '../../modules/rent-car/types';
import { rentCarService } from '../../modules/rent-car/services/rentCarService';
import { 
  X, 
  Car, 
  User, 
  Calendar, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  MapPin, 
  Sparkles,
  Users,
  Plus
} from 'lucide-react';

interface CreateBookingModalProps {
  vehicles: RentalVehicle[];
  customers: RentalCustomer[];
  initialVehicle?: RentalVehicle;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  vehicles,
  customers,
  initialVehicle,
  onClose,
  onSuccess
}) => {
  const availableVehicles = vehicles.filter((v) => v.status === 'available' || v.id === initialVehicle?.id);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicle?.id || availableVehicles[0]?.id || '');
  const [packageType, setPackageType] = useState<RentalPackageType>('self_drive');
  const [assignedDriverId, setAssignedDriverId] = useState<string>('drv-01');
  const [assignedDriverName, setAssignedDriverName] = useState<string>('Bambang Supriyanto');

  const [startDateTime, setStartDateTime] = useState<string>(
    new Date(Date.now() + 3600000).toISOString().slice(0, 16)
  );
  const [durationDays, setDurationDays] = useState<number>(3);
  const [pickupType, setPickupType] = useState<'pool_hq' | 'airport' | 'hotel' | 'customer_address'>('pool_hq');
  const [pickupAddress, setPickupAddress] = useState<string>('Pool Pusat Bandara Soekarno-Hatta Jakarta');
  const [returnType, setReturnType] = useState<'pool_hq' | 'airport' | 'hotel' | 'customer_address'>('pool_hq');
  const [returnAddress, setReturnAddress] = useState<string>('Pool Pusat Bandara Soekarno-Hatta Jakarta');

  const [addons, setAddons] = useState([
    { id: 'add-1', name: 'E-Toll Preloaded Saldo Rp 100.000', pricePerDay: 25000, selected: false },
    { id: 'add-2', name: 'Collision Damage Waiver (CDW)', pricePerDay: 75000, selected: true },
    { id: 'add-3', name: 'Child Safety Car Seat ISOFIX', pricePerDay: 50000, selected: false }
  ]);

  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Selected Object Lookups
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // Calculate Price Estimates
  const baseRate = selectedVehicle?.pricing.dailyRate || 0;
  const rentalSubtotal = baseRate * durationDays;

  let driverFee = 0;
  if (packageType === 'with_driver') {
    driverFee = ((selectedVehicle?.pricing.withDriverDailyRate || baseRate + 300000) - baseRate) * durationDays;
  } else if (packageType === 'all_in') {
    driverFee = ((selectedVehicle?.pricing.allInDailyRate || baseRate + 600000) - baseRate) * durationDays;
  }

  const deliveryFee = pickupType === 'pool_hq' ? 0 : 150000;
  const addonsTotal = addons.filter((a) => a.selected).reduce((sum, a) => sum + (a.pricePerDay * durationDays), 0);
  const subtotal = rentalSubtotal + driverFee + deliveryFee + addonsTotal - discountAmount;
  const ppn11 = Math.round(subtotal * 0.11);
  const grandTotal = subtotal + ppn11;
  const depositAmount = selectedVehicle?.pricing.depositAmount || 0;

  // Calculate Return Date Time
  const calculatedEndDateTime = new Date(new Date(startDateTime).getTime() + durationDays * 24 * 3600000).toISOString();

  const handleToggleAddon = (id: string) => {
    setAddons(addons.map((a) => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const handleCreateBooking = () => {
    if (!selectedCustomerId) {
      setErrorMessage('Silakan pilih data pelanggan penyewa.');
      return;
    }
    if (!selectedVehicleId) {
      setErrorMessage('Silakan pilih unit kendaraan yang tersedia.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const result = rentCarService.createBooking({
        customerId: selectedCustomerId,
        vehicleId: selectedVehicleId,
        packageType,
        driverId: packageType !== 'self_drive' ? assignedDriverId : undefined,
        driverName: packageType !== 'self_drive' ? assignedDriverName : undefined,
        startDateTime: new Date(startDateTime).toISOString(),
        endDateTime: calculatedEndDateTime,
        durationDays,
        pickupLocationType: pickupType,
        pickupAddress,
        returnLocationType: returnType,
        returnAddress,
        addons,
        discountAmount,
        notes
      });

      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.message);
      } else {
        onSuccess();
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Buat Reservasi Rental Mobil Baru</h2>
              <p className="text-xs text-slate-400">Pilih penyewa, unit armada, paket pengemudi, dan hitung estimasi biaya.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Selection & Anti-Fraud Radar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>1. Data Pelanggan & Verifikasi KYC</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Pilih Pelanggan Terdaftar
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type === 'corporate' ? 'Korporat' : 'Individu'}) - KYC: {c.kycStatus.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer KYC Card Preview */}
              {selectedCustomer && (
                <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  selectedCustomer.kycStatus === 'blacklisted'
                    ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                    : selectedCustomer.kycStatus === 'verified'
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                }`}>
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{selectedCustomer.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        NIK: {selectedCustomer.nik.slice(0, 8)}****
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Telp: {selectedCustomer.phone} • Riwayat: {selectedCustomer.completedBookings}x sewa
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold block">Risk Score</span>
                    <span className={`text-sm font-mono font-bold ${selectedCustomer.riskScore > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {selectedCustomer.riskScore}/100
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Vehicle & Package Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>2. Pilih Unit Kendaraan & Paket Rental</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Unit Kendaraan (Ready di Pool)
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                >
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.plateNumber}) - Rp {v.pricing.dailyRate.toLocaleString('id-ID')}/hari
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Paket Layanan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'self_drive', label: 'Lepas Kunci' },
                    { id: 'with_driver', label: 'Dengan Sopir' },
                    { id: 'all_in', label: 'All-In (BBM+Tol)' }
                  ].map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setPackageType(pkg.id as any)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all text-center ${
                        packageType === pkg.id
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pkg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Driver Assignment if With Driver */}
            {packageType !== 'self_drive' && (
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-cyan-300 font-semibold block mb-1">
                    Pilih Pengemudi Berpengalaman (SIM B1/A Umum)
                  </label>
                  <select
                    value={assignedDriverId}
                    onChange={(e) => {
                      setAssignedDriverId(e.target.value);
                      if (e.target.value === 'drv-01') setAssignedDriverName('Bambang Supriyanto');
                      else setAssignedDriverName('Agus Purnomo (VIP Chauffeur)');
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="drv-01">Bambang Supriyanto (Rating 4.9 • Pengalaman 8 Thn)</option>
                    <option value="drv-02">Agus Purnomo (VIP Chauffeur • Sertifikasi Safety)</option>
                  </select>
                </div>

                <div className="flex items-center text-slate-300 text-[11px] leading-relaxed">
                  Driver bertugas maksimal 12 jam per hari kerja, termasuk seragam resmi dan sertifikasi defensive driving.
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Dates & Locations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>3. Jadwal Sewa & Lokasi Serah Terima</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Waktu Mulai Sewa
                </label>
                <input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Durasi Sewa (Hari)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">Hari</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Estimasi Jadwal Kembali
                </label>
                <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs font-bold">
                  {new Date(calculatedEndDateTime).toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Lokasi Pengambilan (Pick-up)
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  placeholder="Contoh: Terminal 3 Bandara Soetta / Hotel Kempinski"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Lokasi Pengembalian (Drop-off)
                </label>
                <input
                  type="text"
                  value={returnAddress}
                  onChange={(e) => setReturnAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  placeholder="Contoh: Pool Pusat Soetta"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Addons */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Layanan Tambahan (Add-ons)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {addons.map((addon) => (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => handleToggleAddon(addon.id)}
                  className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                    addon.selected
                      ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{addon.name}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      +Rp {addon.pricePerDay.toLocaleString('id-ID')}/hari
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded flex items-center justify-center ${addon.selected ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-700'}`}>
                    {addon.selected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Financial Summary Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Rincian Biaya & Deposit Escrow</span>
              </span>
              <span className="text-xs text-slate-400">Durasi: {durationDays} Hari</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Sewa Mobil ({durationDays} hari x Rp {baseRate.toLocaleString('id-ID')})</span>
                <span className="font-mono">Rp {rentalSubtotal.toLocaleString('id-ID')}</span>
              </div>

              {driverFee > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Jasa Driver / Paket ({durationDays} hari)</span>
                  <span className="font-mono">Rp {driverFee.toLocaleString('id-ID')}</span>
                </div>
              )}

              {deliveryFee > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Biaya Antar/Jemput Luar Pool</span>
                  <span className="font-mono">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                </div>
              )}

              {addonsTotal > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Layanan Tambahan (Add-ons)</span>
                  <span className="font-mono">Rp {addonsTotal.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>PPN 11%</span>
                <span className="font-mono">Rp {ppn11.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-slate-700">
                <span>Total Tagihan Sewa (Grand Total)</span>
                <span className="text-emerald-400 font-mono text-base">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 mt-2">
                <span>Jaminan Security Deposit (Ditahan):</span>
                <span className="font-mono font-bold">
                  Rp {depositAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>

          <button
            onClick={handleCreateBooking}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-950 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Membuat Reservasi...' : 'Konfirmasi Reservasi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
