/**
 * Fleet Intelligence Smart AI - Create & Edit Trip Multi-Step Wizard Modal
 * PROMPT 15 — 5-Step Operational Trip Creation Wizard with Conflict Validation & Route Preview
 */

import React, { useState, useEffect } from 'react';
import {
  PlannedTrip,
  TripWaypoint,
  TripPriority,
  TripConflict,
  LocationPoint,
} from '../../modules/trips/plannedTripTypes';
import { TripConflictService } from '../../modules/trips/services/tripConflictService';
import { RoutePlanningService } from '../../modules/trips/services/routePlanningService';
import { EtaService } from '../../modules/trips/services/etaService';
import { tripManagementService } from '../../modules/trips/services/tripManagementService';
import { Vehicle, Driver } from '../../types';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Truck,
  User,
  MapPin,
  Clock,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface CreateTripWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: Partial<PlannedTrip>, isDraft: boolean) => void;
  editingTrip: PlannedTrip | null;
  vehicles: Vehicle[];
  drivers: Driver[];
  existingTrips: PlannedTrip[];
}

export const CreateTripWizardModal: React.FC<CreateTripWizardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTrip,
  vehicles,
  drivers,
  existingTrips,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [cargoDescription, setCargoDescription] = useState<string>('');
  const [cargoWeightKg, setCargoWeightKg] = useState<number>(5000);
  const [priority, setPriority] = useState<TripPriority>('NORMAL');
  const [notes, setNotes] = useState<string>('');

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const [origin, setOrigin] = useState<LocationPoint>({
    name: 'Gudang Pusat Jakarta DC',
    address: 'Kawasan Industri Pulogadung, Jakarta Timur',
    latitude: -6.182,
    longitude: 106.912,
  });

  const [destination, setDestination] = useState<LocationPoint>({
    name: 'Depo Distribusi Bandung',
    address: 'Jl. Soekarno Hatta No. 450, Bandung',
    latitude: -6.938,
    longitude: 107.655,
  });

  const [waypoints, setWaypoints] = useState<TripWaypoint[]>([]);

  const [plannedEtd, setPlannedEtd] = useState<string>(
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [plannedEta, setPlannedEta] = useState<string>('');
  const [manualEtaOverride, setManualEtaOverride] = useState<boolean>(false);

  // Calculated route info
  const [calculatedDistance, setCalculatedDistance] = useState<number>(0);
  const [calculatedDuration, setCalculatedDuration] = useState<number>(0);

  // Conflicts
  const [conflicts, setConflicts] = useState<TripConflict[]>([]);

  // Initialize or reset form
  useEffect(() => {
    if (isOpen) {
      if (editingTrip) {
        setScheduledDate(editingTrip.scheduledDate);
        setReferenceNumber(editingTrip.referenceNumber || '');
        setCustomerName(editingTrip.customerName || '');
        setCargoDescription(editingTrip.cargoDescription || '');
        setCargoWeightKg(editingTrip.cargoWeightKg || 5000);
        setPriority(editingTrip.priority);
        setNotes(editingTrip.notes || '');
        setSelectedVehicleId(editingTrip.vehicleId || '');
        setSelectedDriverId(editingTrip.driverId || '');
        setOrigin(editingTrip.origin);
        setDestination(editingTrip.destination);
        setWaypoints(editingTrip.waypoints || []);
        setPlannedEtd(
          editingTrip.plannedEtd
            ? editingTrip.plannedEtd.slice(0, 16)
            : new Date().toISOString().slice(0, 16)
        );
        setPlannedEta(
          editingTrip.plannedEta
            ? editingTrip.plannedEta.slice(0, 16)
            : new Date().toISOString().slice(0, 16)
        );
        setManualEtaOverride(!!editingTrip.manualEtaOverride);
      } else {
        setStep(1);
        setScheduledDate(new Date().toISOString().split('T')[0]);
        setReferenceNumber(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
        setCustomerName('');
        setCargoDescription('');
        setCargoWeightKg(5000);
        setPriority('NORMAL');
        setNotes('');
        setSelectedVehicleId('');
        setSelectedDriverId('');
        setWaypoints([]);
        setPlannedEtd(new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
        setManualEtaOverride(false);
      }
    }
  }, [isOpen, editingTrip]);

  // Recalculate Route upon location/waypoints change
  useEffect(() => {
    if (origin && destination) {
      const route = RoutePlanningService.calculatePlannedRoute(origin, destination, waypoints);
      setCalculatedDistance(route.distanceKm);
      setCalculatedDuration(route.estimatedDurationMinutes);

      if (!manualEtaOverride && plannedEtd) {
        const isoEtd = new Date(plannedEtd).toISOString();
        const autoEtaIso = EtaService.calculatePlannedEta(isoEtd, route.estimatedDurationMinutes);
        setPlannedEta(autoEtaIso.slice(0, 16));
      }
    }
  }, [origin, destination, waypoints, plannedEtd, manualEtaOverride]);

  // Check Conflicts
  useEffect(() => {
    const confls = TripConflictService.checkConflicts(
      selectedVehicleId,
      selectedDriverId,
      scheduledDate,
      existingTrips,
      editingTrip?.id,
      vehicles,
      drivers
    );
    setConflicts(confls);
  }, [selectedVehicleId, selectedDriverId, scheduledDate, existingTrips, editingTrip]);

  if (!isOpen) return null;

  const handleAddWaypoint = () => {
    const newWp: TripWaypoint = {
      id: `wp-${Date.now()}`,
      tripId: editingTrip?.id || 'new',
      sequence: waypoints.length + 1,
      name: `Waypoint Transit ${waypoints.length + 1}`,
      address: 'Kawasan Transit Logistik',
      latitude: -6.32 + waypoints.length * 0.1,
      longitude: 107.12 + waypoints.length * 0.1,
      status: 'PENDING',
    };
    setWaypoints([...waypoints, newWp]);
  };

  const handleRemoveWaypoint = (idx: number) => {
    const updated = waypoints.filter((_, i) => i !== idx);
    setWaypoints(RoutePlanningService.resequenceWaypoints(updated));
  };

  const handleMoveWaypoint = (idx: number, direction: 'UP' | 'DOWN') => {
    const targetIdx = direction === 'UP' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= waypoints.length) return;

    const copy = [...waypoints];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;

    setWaypoints(RoutePlanningService.resequenceWaypoints(copy));
  };

  const selectedVehicleObj = vehicles.find((v) => v.id === selectedVehicleId);
  const selectedDriverObj = drivers.find((d) => d.id === selectedDriverId);

  const handleSubmitFinal = (isDraft: boolean) => {
    const isoEtd = new Date(plannedEtd).toISOString();
    const isoEta = new Date(plannedEta).toISOString();

    const tripData: Partial<PlannedTrip> = {
      scheduledDate,
      referenceNumber,
      customerName,
      cargoDescription,
      cargoWeightKg,
      priority,
      notes,
      vehicleId: selectedVehicleId,
      vehiclePlate: selectedVehicleObj?.plateNumber || '',
      vehicleName: (selectedVehicleObj as any)?.name || (selectedVehicleObj ? `${selectedVehicleObj.brand} ${selectedVehicleObj.model}` : ''),
      driverId: selectedDriverId,
      driverName: selectedDriverObj?.name || '',
      driverPhone: (selectedDriverObj as any)?.phone || (selectedDriverObj as any)?.phoneNumber || '',
      origin,
      destination,
      waypoints,
      plannedEtd: isoEtd,
      plannedEta: isoEta,
      currentEta: isoEta,
      etaSource: manualEtaOverride ? 'MANUAL' : 'CALCULATED',
      manualEtaOverride,
    };

    onSubmit(tripData, isDraft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Wizard Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 border border-blue-400/30">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {editingTrip ? 'Edit Trip Operasional' : 'Buat Planned Trip Baru'}
              </h2>
              <p className="text-xs text-blue-200">
                {editingTrip ? editingTrip.tripNumber : 'Perencanaan Rute & Penugasan Armada'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {[
              { num: 1, label: 'Informasi' },
              { num: 2, label: 'Armada & Driver' },
              { num: 3, label: 'Rute & Waypoint' },
              { num: 4, label: 'Jadwal & ETA' },
              { num: 5, label: 'Review' },
            ].map((st) => (
              <div
                key={st.num}
                onClick={() => setStep(st.num)}
                className="flex items-center gap-1.5 cursor-pointer group"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === st.num
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : step > st.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }`}
                >
                  {step > st.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : st.num}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    step === st.num ? 'text-blue-600 font-bold' : 'text-gray-500'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* STEP 1: Trip Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tanggal Keberangkatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Prioritas Perjalanan
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TripPriority)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-semibold"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Tinggi (High)</option>
                    <option value="URGENT">Urgent (Mendesak)</option>
                    <option value="LOW">Rendah (Low)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    No Referensi / DO / Surat Jalan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: DO-2026-9921 / PO-88210"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nama Pelanggan / Client
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Indofood Sukses Makmur"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Deskripsi Muatan / Cargo
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: FMCG / Makanan Kemasan / Bahan Industri"
                    value={cargoDescription}
                    onChange={(e) => setCargoDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Estimasi Berat (KG)
                  </label>
                  <input
                    type="number"
                    value={cargoWeightKg}
                    onChange={(e) => setCargoWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Catatan Instruksi Operasional
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan penanganan muatan, toleransi jam tiba, atau instruksi supir..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle & Driver Assignment */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Conflicts Banner */}
              {conflicts.length > 0 && (
                <div className="space-y-2">
                  {conflicts.map((conf, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                        conf.severity === 'CRITICAL'
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">{conf.title}</span>
                        <span>{conf.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vehicle Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Pilih Kendaraan Armada</span>
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-semibold"
                >
                  <option value="">-- Belum Ditunjuk (Unassigned) --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} - {(v as any).name || `${v.brand} ${v.model}`} ({v.type}) [{v.status}]
                    </option>
                  ))}
                </select>

                {selectedVehicleObj && (
                  <div className="mt-2 p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{selectedVehicleObj.plateNumber}</span> -{' '}
                      <span className="text-gray-600">{(selectedVehicleObj as any).name || `${selectedVehicleObj.brand} ${selectedVehicleObj.model}`}</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Tipe: {selectedVehicleObj.type} | Kapasitas: {((selectedVehicleObj as any).payloadKg || selectedVehicleObj.fuelCapacityLiters * 10 || 10000).toLocaleString()} KG
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedVehicleObj.status === 'moving' || selectedVehicleObj.status === 'idle'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedVehicleObj.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Driver Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Pilih Pengemudi (Driver)</span>
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-semibold"
                >
                  <option value="">-- Belum Ditunjuk (Unassigned) --</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} (ID: {(d as any).employeeId || d.id}) [{d.status}]
                    </option>
                  ))}
                </select>

                {selectedDriverObj && (
                  <div className="mt-2 p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{selectedDriverObj.name}</span> -{' '}
                      <span className="text-gray-600">{(selectedDriverObj as any).phone || (selectedDriverObj as any).phoneNumber || '-'}</span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Lisensi SIM: {(selectedDriverObj as any).primaryLicenseNumber || (selectedDriverObj as any).licenseNumber || 'SIM B2 Umum'} | Rating: {(selectedDriverObj as any).safetyScore || '4.9'}/100
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800">
                      {selectedDriverObj.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Route & Waypoints */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Origin */}
              <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Titik Keberangkatan (Origin / Titik A)</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Titik Asal"
                    value={origin.name}
                    onChange={(e) => setOrigin({ ...origin, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white font-semibold text-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="Alamat Lengkap"
                    value={origin.address}
                    onChange={(e) => setOrigin({ ...origin, address: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white text-gray-700"
                  />
                </div>
              </div>

              {/* Waypoints List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Waypoint Singgah ({waypoints.length})
                  </span>
                  <button
                    onClick={handleAddWaypoint}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Waypoint</span>
                  </button>
                </div>

                {waypoints.map((wp, idx) => (
                  <div
                    key={wp.id}
                    className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">
                        Waypoint #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveWaypoint(idx, 'UP')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveWaypoint(idx, 'DOWN')}
                          disabled={idx === waypoints.length - 1}
                          className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveWaypoint(idx)}
                          className="p-1 hover:bg-rose-100 text-rose-600 rounded ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nama Waypoint"
                        value={wp.name}
                        onChange={(e) => {
                          const copy = [...waypoints];
                          copy[idx].name = e.target.value;
                          setWaypoints(copy);
                        }}
                        className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Alamat Waypoint"
                        value={wp.address}
                        onChange={(e) => {
                          const copy = [...waypoints];
                          copy[idx].address = e.target.value;
                          setWaypoints(copy);
                        }}
                        className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Destination */}
              <div className="bg-rose-50/60 border border-rose-200 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>Titik Tujuan (Destination / Titik B)</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Titik Tujuan"
                    value={destination.name}
                    onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-rose-300 rounded-lg bg-white font-semibold text-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="Alamat Lengkap Tujuan"
                    value={destination.address}
                    onChange={(e) => setDestination({ ...destination, address: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-rose-300 rounded-lg bg-white text-gray-700"
                  />
                </div>
              </div>

              {/* Calculated Metrics Box */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-xl flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-[11px] text-blue-200 uppercase font-semibold">Total Jarak Tempuh</div>
                  <div className="text-2xl font-extrabold">{calculatedDistance} KM</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-blue-200 uppercase font-semibold">Estimasi Waktu Tempuh</div>
                  <div className="text-2xl font-extrabold text-amber-300">
                    {Math.floor(calculatedDuration / 60)}j {calculatedDuration % 60}m
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Schedule & ETA */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Estimasi Jam Keberangkatan (ETD)
                  </label>
                  <input
                    type="datetime-local"
                    value={plannedEtd}
                    onChange={(e) => setPlannedEtd(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-semibold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Estimasi Jam Tiba (ETA)
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-[11px] text-blue-600 font-bold">
                      <input
                        type="checkbox"
                        checked={manualEtaOverride}
                        onChange={(e) => setManualEtaOverride(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Override Manual</span>
                    </label>
                  </div>
                  <input
                    type="datetime-local"
                    disabled={!manualEtaOverride}
                    value={plannedEta}
                    onChange={(e) => setPlannedEta(e.target.value)}
                    className={`w-full px-3 py-2 text-xs border rounded-lg font-semibold ${
                      manualEtaOverride
                        ? 'border-blue-500 bg-white text-blue-900'
                        : 'border-gray-300 bg-gray-100 text-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Informasi Kalkulasi Otomatis ETA</span>
                </div>
                <p className="text-blue-950 leading-relaxed">
                  ETA dihitung secara presisi berdasarkan jarak tempuh ({calculatedDistance} KM) dengan kecepatan rata-rata 48 KM/Jam ditambah alokasi 15 menit untuk setiap waypoint singgah.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Confirmation */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs font-bold text-gray-900 uppercase">Ringkasan Perencanaan Trip</span>
                  <span className="text-xs font-bold text-blue-600">{scheduledDate}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-semibold">Kendaraan:</span>
                    <span className="font-bold text-gray-900">
                      {selectedVehicleObj ? `${selectedVehicleObj.plateNumber} (${(selectedVehicleObj as any).name || `${selectedVehicleObj.brand} ${selectedVehicleObj.model}`})` : 'Belum Ditunjuk'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase font-semibold">Pengemudi:</span>
                    <span className="font-bold text-gray-900">{selectedDriverObj?.name || 'Belum Ditunjuk'}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Asal (Origin):</span>
                    <span className="font-semibold text-gray-900">{origin.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Tujuan (Destination):</span>
                    <span className="font-semibold text-gray-900">{destination.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Jarak & Durasi:</span>
                    <span className="font-bold text-blue-600">
                      {calculatedDistance} KM (~{Math.floor(calculatedDuration / 60)}j {calculatedDuration % 60}m)
                    </span>
                  </div>
                </div>
              </div>

              {conflicts.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  ⚠ Terdapat {conflicts.length} peringatan konflik jadwal, namun Anda tetap dapat membuat trip ini sebagai Draft atau Planned.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSubmitFinal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 shadow-2xs"
            >
              Simpan Sebagai Draft
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmitFinal(false)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Buat Trip Operasional</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
