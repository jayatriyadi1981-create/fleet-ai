/**
 * Fleet Intelligence Smart AI - 8-Step Interactive Route Creation Wizard Modal
 * PROMPT 16 — Guided Wizard for Route Planning, Optimization, Waypoints & Restrictions
 */

import React, { useState } from 'react';
import {
  Route,
  RouteType,
  RoutePriority,
  RouteWaypoint,
  OptimizationObjective,
  VehicleRestrictionConfig,
  RouteRestriction,
  AlternativeRoute,
} from '../../modules/routes/routeTypes';
import { LocationPoint } from '../../modules/trips/plannedTripTypes';
import { routeCalculationService } from '../../modules/routes/services/routeCalculationService';
import { routeOptimizationService } from '../../modules/routes/services/routeOptimizationService';
import { routeManagementService } from '../../modules/routes/services/routeManagementService';
import { RouteMapComponent } from './RouteMapComponent';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Waypoints,
  MapPin,
  Sparkles,
  ShieldAlert,
  Sliders,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Route as RouteIcon,
  Zap,
} from 'lucide-react';

interface CreateRouteWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRoute: (newRoute: Route) => void;
  initialRouteToEdit?: Route | null;
}

const PRESET_CITIES: LocationPoint[] = [
  {
    name: 'Depo Utama Cikarang (Jakarta)',
    address: 'Kawasan Industri Jababeka V, Cikarang, Jawa Barat',
    latitude: -6.3152,
    longitude: 107.1452,
    contactPerson: 'Budi Santoso',
    contactPhone: '0812-9988-7766',
  },
  {
    name: 'Warehouse Logistik Gedebage (Bandung)',
    address: 'Jl. Soekarno-Hatta No. 788, Gedebage, Bandung',
    latitude: -6.9458,
    longitude: 107.6845,
    contactPerson: 'Agus Setiawan',
    contactPhone: '0813-1122-3344',
  },
  {
    name: 'Hub Logistik Semarang Terboyo',
    address: 'Kawasan Industri Terboyo, Semarang',
    latitude: -6.9582,
    longitude: 110.4589,
    contactPerson: 'Hendra Gunawan',
  },
  {
    name: 'Depo Petikemas Tanjung Perak (Surabaya)',
    address: 'Jl. Alun-Alun Priok No. 5, Surabaya, Jawa Timur',
    latitude: -7.2012,
    longitude: 112.7354,
    contactPerson: 'Siti Aminah',
  },
  {
    name: 'Terminal Belawan Logistics (Medan)',
    address: 'Jl. Pelabuhan Belawan, Medan, Sumut',
    latitude: 3.7845,
    longitude: 98.6812,
  },
  {
    name: 'Hub Trans Sulawesi (Makassar)',
    address: 'Kawasan Industri Makassar (KIMA), Makassar',
    latitude: -5.1124,
    longitude: 119.4678,
  },
];

export const CreateRouteWizardModal: React.FC<CreateRouteWizardModalProps> = ({
  isOpen,
  onClose,
  onSaveRoute,
  initialRouteToEdit,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [name, setName] = useState<string>(initialRouteToEdit?.name || '');
  const [routeCode, setRouteCode] = useState<string>(
    initialRouteToEdit?.routeCode || routeManagementService.generateRouteCode()
  );
  const [description, setDescription] = useState<string>(initialRouteToEdit?.description || '');
  const [routeType, setRouteType] = useState<RouteType>(initialRouteToEdit?.routeType || 'ONE_WAY');
  const [priority, setPriority] = useState<RoutePriority>(initialRouteToEdit?.priority || 'NORMAL');

  // Locations
  const [origin, setOrigin] = useState<LocationPoint>(
    initialRouteToEdit?.origin || PRESET_CITIES[0]
  );
  const [destination, setDestination] = useState<LocationPoint>(
    initialRouteToEdit?.destination || PRESET_CITIES[1]
  );

  // Waypoints
  const [waypoints, setWaypoints] = useState<RouteWaypoint[]>(
    initialRouteToEdit?.waypoints || []
  );

  // Calculation & Optimization
  const [distanceKm, setDistanceKm] = useState<number>(initialRouteToEdit?.distanceKm || 153.4);
  const [durationMinutes, setDurationMinutes] = useState<number>(
    initialRouteToEdit?.estimatedDurationMinutes || 208
  );
  const [polyline, setPolyline] = useState<Array<[number, number]>>(
    initialRouteToEdit?.plannedPolyline || []
  );
  const [alternativeRoutes, setAlternativeRoutes] = useState<AlternativeRoute[]>(
    initialRouteToEdit?.alternativeRoutes || []
  );

  // Optimization options
  const [objective, setObjective] = useState<OptimizationObjective>('Balanced');
  const [allowTolls, setAllowTolls] = useState<boolean>(true);
  const [allowHighways, setAllowHighways] = useState<boolean>(true);
  const [allowFerries, setAllowFerries] = useState<boolean>(true);
  const [maxWeightTon, setMaxWeightTon] = useState<number>(24);
  const [maxHeightMeters, setMaxHeightMeters] = useState<number>(4.2);

  // Restrictions
  const [restrictions, setRestrictions] = useState<RouteRestriction[]>(
    initialRouteToEdit?.restrictions || [
      {
        id: 'res-w1',
        name: 'Pembatasan Tonase Jembatan Timbang Cibaragalan',
        type: 'WEIGHT_LIMIT',
        description: 'Batas MST 10 Ton',
        latitude: -6.52,
        longitude: 107.42,
        active: true,
        limitValue: 10,
        unit: 'Ton',
      },
    ]
  );

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [optimizationWarnings, setOptimizationWarnings] = useState<string[]>([]);

  if (!isOpen) return null;

  // Recalculate route calculation
  const handleRecalculateRoute = async () => {
    setIsCalculating(true);
    try {
      const calc = await routeCalculationService.calculateRoute(origin, destination, waypoints);
      const alts = await routeCalculationService.calculateAlternatives(origin, destination, waypoints);
      setDistanceKm(calc.distanceKm);
      setDurationMinutes(calc.estimatedDurationMinutes);
      setPolyline(calc.polyline);
      setAlternativeRoutes(alts);
    } finally {
      setIsCalculating(false);
    }
  };

  // Run AI Route Optimization
  const handleRunOptimization = async () => {
    setIsCalculating(true);
    try {
      const vehicleConfig: VehicleRestrictionConfig = {
        maxWeightTon,
        maxHeightMeters,
        allowTolls,
        allowHighways,
        allowFerries,
      };

      const optResult = await routeOptimizationService.optimizeRoute(
        origin,
        destination,
        waypoints,
        objective,
        vehicleConfig,
        restrictions
      );

      setWaypoints(optResult.optimizedWaypoints);
      setPolyline(optResult.polyline);
      setDistanceKm(optResult.distanceKm);
      setDurationMinutes(optResult.estimatedDurationMinutes);
      setOptimizationWarnings(optResult.warnings);
    } finally {
      setIsCalculating(false);
    }
  };

  // Add waypoint
  const handleAddWaypoint = () => {
    const newWp: RouteWaypoint = {
      id: `wp-new-${Date.now()}`,
      routeId: 'temp',
      sequence: waypoints.length + 1,
      name: `Waypoint Stop #${waypoints.length + 1}`,
      address: 'Lokasi Singgah Baru',
      latitude: (origin.latitude + destination.latitude) / 2 + (Math.random() - 0.5) * 0.1,
      longitude: (origin.longitude + destination.longitude) / 2 + (Math.random() - 0.5) * 0.1,
      type: 'DELIVERY',
      stopDurationMinutes: 15,
    };
    setWaypoints([...waypoints, newWp]);
  };

  // Move waypoint up/down
  const handleMoveWaypoint = (index: number, direction: 'up' | 'down') => {
    const newWaypoints = [...waypoints];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= waypoints.length) return;

    const temp = newWaypoints[index];
    newWaypoints[index] = newWaypoints[targetIndex];
    newWaypoints[targetIndex] = temp;

    // Re-sequence
    const resequenced = newWaypoints.map((wp, i) => ({ ...wp, sequence: i + 1 }));
    setWaypoints(resequenced);
  };

  // Remove waypoint
  const handleRemoveWaypoint = (id: string) => {
    const filtered = waypoints.filter((w) => w.id !== id);
    const resequenced = filtered.map((wp, i) => ({ ...wp, sequence: i + 1 }));
    setWaypoints(resequenced);
  };

  // Final Save Action
  const handleFinalSubmit = async (isDraft = false) => {
    const routePayload: Partial<Route> = {
      routeCode,
      name: name.trim() || `Rute ${origin.name} → ${destination.name}`,
      description,
      origin,
      destination,
      waypoints,
      plannedPolyline: polyline.length > 0 ? polyline : [[origin.latitude, origin.longitude], [destination.latitude, destination.longitude]],
      alternativeRoutes,
      distanceKm,
      estimatedDurationMinutes: durationMinutes,
      routeType,
      priority,
      restrictions,
      status: isDraft ? 'DRAFT' : 'ACTIVE',
      optimizationStatus: 'OPTIMIZED',
      vehicleRestrictions: {
        maxWeightTon,
        maxHeightMeters,
        allowTolls,
        allowHighways,
        allowFerries,
      },
    };

    let saved: Route;
    if (initialRouteToEdit) {
      saved = (await routeManagementService.updateRoute(initialRouteToEdit.id, routePayload))!;
    } else {
      saved = await routeManagementService.createRoute(routePayload, isDraft);
    }

    onSaveRoute(saved);
    onClose();
  };

  const tempRouteForMap: Route = {
    id: 'preview',
    tenantId: 'tenant-001',
    routeCode,
    name,
    description,
    origin,
    destination,
    waypoints,
    plannedPolyline: polyline,
    alternativeRoutes,
    distanceKm,
    estimatedDurationMinutes: durationMinutes,
    status: 'ACTIVE',
    optimizationStatus: 'OPTIMIZED',
    routeType,
    priority,
    restrictions,
    currentVersion: 1,
    createdBy: 'User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Waypoints className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {initialRouteToEdit ? 'Edit Master Rute' : 'Wizard Perencanaan Rute Master (8 Langkah)'}
              </h2>
              <p className="text-xs text-slate-400">
                Langkah {currentStep} dari 8 — Optimasi Multi-Objective & Pembatasan Jalan Enterprise
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-50 border-b border-gray-200 px-6 py-2 flex items-center justify-between text-[11px] font-bold text-gray-500 overflow-x-auto shrink-0">
          {[
            '1. Informasi',
            '2. Asal/Tujuan',
            '3. Waypoints',
            '4. Kalkulasi',
            '5. Optimasi AI',
            '6. Restriksi',
            '7. Komparasi',
            '8. Simpan',
          ].map((label, idx) => {
            const stepNum = idx + 1;
            const isCurrent = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <div
                key={label}
                onClick={() => setCurrentStep(stepNum)}
                className={`flex items-center gap-1.5 cursor-pointer whitespace-nowrap py-1 px-2 rounded-lg transition-colors ${
                  isCurrent
                    ? 'text-blue-700 bg-blue-100/80 font-extrabold'
                    : isCompleted
                    ? 'text-emerald-700'
                    : 'text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 text-[9px] flex items-center justify-center font-bold">
                    {stepNum}
                  </span>
                )}
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: ROUTE INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Langkah 1: Informasi Dasar Rute Master
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kode Rute Master</label>
                  <input
                    type="text"
                    value={routeCode}
                    onChange={(e) => setRouteCode(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono font-bold text-blue-700 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tipe Rute</label>
                  <select
                    value={routeType}
                    onChange={(e) => setRouteType(e.target.value as RouteType)}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="ONE_WAY">ONE_WAY (Satu Arah Direct)</option>
                    <option value="ROUND_TRIP">ROUND_TRIP (Bolak-Balik Depo)</option>
                    <option value="MULTI_STOP">MULTI_STOP (Multi-Waypoint Dropping)</option>
                    <option value="RECURRING">RECURRING (Rutin Rutin Harian)</option>
                    <option value="CUSTOM">CUSTOM (Kustom Perjalanan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Rute Master *</label>
                <input
                  type="text"
                  placeholder="e.g. Jakarta (Cikarang Depo) → Bandung (Gedebage Warehouse)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Rute & Catatan Operasional</label>
                <textarea
                  rows={3}
                  placeholder="Catatan standar operasional, arahan pintu gerbang tol, instruksi bongkar muat..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Prioritas Rute</label>
                <div className="flex items-center gap-3">
                  {(['LOW', 'NORMAL', 'HIGH', 'URGENT'] as RoutePriority[]).map((p) => (
                    <label
                      key={p}
                      className={`flex-1 text-center py-2 text-xs font-bold rounded-xl border cursor-pointer transition-colors ${
                        priority === p
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        checked={priority === p}
                        onChange={() => setPriority(p)}
                        className="sr-only"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ORIGIN & DESTINATION */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Langkah 2: Titik Asal (Origin) & Titik Tujuan (Destination)
              </h3>

              {/* Origin Section */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Titik Asal (Origin - A)
                  </span>
                  <select
                    onChange={(e) => {
                      const sel = PRESET_CITIES[Number(e.target.value)];
                      if (sel) setOrigin(sel);
                    }}
                    className="text-xs border border-emerald-300 rounded-lg px-2 py-1 text-emerald-900 font-semibold bg-white"
                  >
                    <option value="">-- Pilih Kota/Depo Preset --</option>
                    {PRESET_CITIES.map((c, i) => (
                      <option key={i} value={i}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Nama Lokasi Asal</label>
                    <input
                      type="text"
                      value={origin.name}
                      onChange={(e) => setOrigin({ ...origin, name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={origin.address}
                      onChange={(e) => setOrigin({ ...origin, address: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={origin.latitude}
                      onChange={(e) => setOrigin({ ...origin, latitude: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={origin.longitude}
                      onChange={(e) => setOrigin({ ...origin, longitude: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Destination Section */}
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-800 uppercase flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    Titik Tujuan (Destination - B)
                  </span>
                  <select
                    onChange={(e) => {
                      const sel = PRESET_CITIES[Number(e.target.value)];
                      if (sel) setDestination(sel);
                    }}
                    className="text-xs border border-rose-300 rounded-lg px-2 py-1 text-rose-900 font-semibold bg-white"
                  >
                    <option value="">-- Pilih Kota/Depo Preset --</option>
                    {PRESET_CITIES.map((c, i) => (
                      <option key={i} value={i}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Nama Lokasi Tujuan</label>
                    <input
                      type="text"
                      value={destination.name}
                      onChange={(e) => setDestination({ ...destination, name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      value={destination.address}
                      onChange={(e) => setDestination({ ...destination, address: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={destination.latitude}
                      onChange={(e) => setDestination({ ...destination, latitude: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={destination.longitude}
                      onChange={(e) => setDestination({ ...destination, longitude: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: WAYPOINTS */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Langkah 3: Manajamen Waypoints & Titik Singgah (Stops)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tambahkan titik bongkar/muat, pengisian BBM, rest area, atau pos checkpoint.
                  </p>
                </div>
                <button
                  onClick={handleAddWaypoint}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Waypoint
                </button>
              </div>

              {waypoints.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300 space-y-2">
                  <Waypoints className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500">Belum ada waypoint. Rute bersifat langsung (Point to Point).</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {waypoints.map((wp, idx) => (
                    <div
                      key={wp.id}
                      className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-indigo-700 text-xs flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                            {wp.sequence}
                          </span>
                          Waypoint #{wp.sequence}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveWaypoint(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveWaypoint(idx, 'down')}
                            disabled={idx === waypoints.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveWaypoint(wp.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Nama Waypoint</label>
                          <input
                            type="text"
                            value={wp.name}
                            onChange={(e) => {
                              const updated = [...waypoints];
                              updated[idx].name = e.target.value;
                              setWaypoints(updated);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Tipe Stop</label>
                          <select
                            value={wp.type}
                            onChange={(e) => {
                              const updated = [...waypoints];
                              updated[idx].type = e.target.value as any;
                              setWaypoints(updated);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                          >
                            <option value="DELIVERY">DELIVERY (Drop Barang)</option>
                            <option value="PICKUP">PICKUP (Ambil Barang)</option>
                            <option value="REST">REST (Istirahat Driver)</option>
                            <option value="FUEL">FUEL (Pengisian BBM)</option>
                            <option value="CHECKPOINT">CHECKPOINT (Pemeriksaan Segel)</option>
                            <option value="DEPOT">DEPOT (Depo Transit)</option>
                            <option value="CUSTOMER">CUSTOMER (Situs Pelanggan)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">
                            Durasi Stop (Menit)
                          </label>
                          <input
                            type="number"
                            value={wp.stopDurationMinutes}
                            onChange={(e) => {
                              const updated = [...waypoints];
                              updated[idx].stopDurationMinutes = parseInt(e.target.value) || 0;
                              setWaypoints(updated);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg font-bold text-indigo-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: ROUTE CALCULATION */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Langkah 4: Kalkulasi Jarak & Durasi Rute Polyline
                  </h3>
                  <p className="text-xs text-gray-500">
                    Kalkulasi otomatis geometri polyline, jarak tempuh (KM), dan durasi perjalanan.
                  </p>
                </div>
                <button
                  onClick={handleRecalculateRoute}
                  disabled={isCalculating}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  <Zap className="w-4 h-4" />
                  {isCalculating ? 'Kalkulasi...' : 'Kalkulasi Ulang Polyline'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                  <span className="text-[10px] text-blue-600 font-bold uppercase">Total Jarak Tempuh</span>
                  <div className="text-2xl font-extrabold text-blue-900 mt-1">{distanceKm} KM</div>
                  <p className="text-[11px] text-blue-700 mt-0.5">Termasuk faktor kelengkungan jalan 24%</p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase">Estimasi Waktu Tempuh</span>
                  <div className="text-2xl font-extrabold text-indigo-900 mt-1">
                    {Math.floor(durationMinutes / 60)}j {durationMinutes % 60}m
                  </div>
                  <p className="text-[11px] text-indigo-700 mt-0.5">Termasuk akumulasi waktu stop waypoints</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                  <span className="text-[10px] text-purple-600 font-bold uppercase">Polyline Geometry</span>
                  <div className="text-2xl font-extrabold text-purple-900 mt-1">
                    {polyline.length} Koordinat
                  </div>
                  <p className="text-[11px] text-purple-700 mt-0.5">Peta rute telematika siap diputar</p>
                </div>
              </div>

              {/* Map Preview */}
              <RouteMapComponent route={tempRouteForMap} className="h-72 w-full rounded-2xl border border-gray-200 shadow-inner" />
            </div>
          )}

          {/* STEP 5: OPTIMIZATION AI */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Langkah 5: Optimasi AI Multi-Objective & Opsi Rute
                  </h3>
                  <p className="text-xs text-gray-500">
                    Pilih objektif optimasi dan preferensi jalur tol/jalan bebas hambatan.
                  </p>
                </div>

                <button
                  onClick={handleRunOptimization}
                  disabled={isCalculating}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  {isCalculating ? 'Mengoptimasi...' : 'Jalankan Optimasi AI'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Objektif Utama Optimasi</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    'Shortest Distance',
                    'Fastest Time',
                    'Lowest Fuel Consumption',
                    'Lowest Cost',
                    'Balanced',
                  ].map((obj) => (
                    <label
                      key={obj}
                      className={`p-3 text-xs font-bold rounded-xl border cursor-pointer text-center transition-colors ${
                        objective === obj
                          ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="objective"
                        checked={objective === obj}
                        onChange={() => setObjective(obj as any)}
                        className="sr-only"
                      />
                      {obj}
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <span className="text-xs font-bold text-gray-800 uppercase">Preferensi & Aturan Jalan</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={allowTolls}
                      onChange={(e) => setAllowTolls(e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    Izinkan Jalan Tol
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={allowHighways}
                      onChange={(e) => setAllowHighways(e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    Izinkan Jalur Utama Arteri
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={allowFerries}
                      onChange={(e) => setAllowFerries(e.target.checked)}
                      className="rounded text-purple-600"
                    />
                    Izinkan Penyeberangan Feri
                  </label>
                </div>
              </div>

              {optimizationWarnings.length > 0 && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Catatan Optimasi Ulang AI
                  </span>
                  <ul className="text-xs text-amber-700 list-disc pl-5 space-y-1">
                    {optimizationWarnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: RESTRICTIONS */}
          {currentStep === 6 && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Langkah 6: Pembatasan Jalan & Spesifikasi Kendaraan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-gray-800 uppercase">Batas Spesifikasi Armada</span>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Max Beban Kendaraan (Ton)</label>
                    <input
                      type="number"
                      value={maxWeightTon}
                      onChange={(e) => setMaxWeightTon(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Max Tinggi Kendaraan (Meter)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={maxHeightMeters}
                      onChange={(e) => setMaxHeightMeters(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-gray-800 uppercase">Pembatasan Terdaftar</span>
                  {restrictions.map((res) => (
                    <div key={res.id} className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs">
                      <div className="font-bold text-rose-900">{res.name}</div>
                      <div className="text-[11px] text-rose-700 mt-0.5">{res.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW & COMPARISON */}
          {currentStep === 7 && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Langkah 7: Komparasi Rute Utama vs Rute Alternatif
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary */}
                <div className="bg-blue-50/60 p-5 rounded-2xl border-2 border-blue-500 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-900 uppercase">Rute Rekomendasi Utama</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-blue-600 rounded">
                      UTAMA
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-gray-900">{name}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 pt-2 border-t border-blue-200">
                    <div>Jarak: <b>{distanceKm} KM</b></div>
                    <div>Durasi: <b>{Math.floor(durationMinutes / 60)}j {durationMinutes % 60}m</b></div>
                    <div>Biaya Tol: <b>Rp 125.000</b></div>
                    <div>Risk: <b className="text-emerald-600">Low Risk</b></div>
                  </div>
                </div>

                {/* Alternative A */}
                {alternativeRoutes.length > 0 && (
                  <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-purple-900 uppercase">
                        {alternativeRoutes[0].name}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold text-purple-700 bg-purple-200 rounded">
                        ALTERNATIF
                      </span>
                    </div>
                    <div className="text-xs text-purple-800 font-semibold">{alternativeRoutes[0].keyDiff}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 pt-2 border-t border-purple-200">
                      <div>Jarak: <b>{alternativeRoutes[0].distanceKm} KM</b></div>
                      <div>Durasi: <b>{alternativeRoutes[0].estimatedDurationMinutes} mnt</b></div>
                      <div>Biaya Tol: <b>Rp {alternativeRoutes[0].tollCostIdr.toLocaleString('id-ID')}</b></div>
                      <div>Score: <b>{alternativeRoutes[0].score}/100</b></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 8: SAVE & PUBLISH */}
          {currentStep === 8 && (
            <div className="space-y-6 max-w-xl mx-auto text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Rute Master Siap Dipublikasikan!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Rute <b>{routeCode}</b> — {name} dengan total jarak <b>{distanceKm} KM</b> siap disimpan ke Master Data Rute Fleet Intelligence.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => handleFinalSubmit(true)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Simpan Sebagai DRAFT
                </button>
                <button
                  onClick={() => handleFinalSubmit(false)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Publikasikan Rute Master (v1)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          {currentStep < 8 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(8, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              Lanjut
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
