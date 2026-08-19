/**
 * Fleet Intelligence Smart AI - 8-Step Geofence Wizard Modal
 * Step 1: Basic Info | Step 2: Draw Area | Step 3: Event Rules | Step 4: Assignment
 * Step 5: Schedule | Step 6: Notifications | Step 7: Review | Step 8: Save
 */

import React, { useState } from 'react';
import { Geofence, GeofenceType, GeofenceCategory, GeofencePriority, GeofenceStatus } from '../geofenceTypes';
import { GeofenceMapComponent } from './GeofenceMapComponent';
import { geofenceGeometryService } from '../services/geofenceGeometryService';
import { Location } from '../../../types';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Circle,
  Hexagon,
  Bell,
  Clock,
  ShieldAlert,
  Truck,
  Users,
  Calendar,
  Layers,
  Save,
  AlertTriangle
} from 'lucide-react';

interface CreateGeofenceWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (geofenceData: Omit<Geofence, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => void;
  existingGeofence?: Geofence;
}

export const CreateGeofenceWizardModal: React.FC<CreateGeofenceWizardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingGeofence
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>(existingGeofence?.name || '');
  const [description, setDescription] = useState<string>(existingGeofence?.description || '');
  const [category, setCategory] = useState<GeofenceCategory>(existingGeofence?.category || 'DEPOT');
  const [priority, setPriority] = useState<GeofencePriority>(existingGeofence?.priority || 'NORMAL');
  const [status, setStatus] = useState<GeofenceStatus>(existingGeofence?.status || 'ACTIVE');
  const [color, setColor] = useState<string>(existingGeofence?.color || '#3B82F6');

  // Geometry State
  const [type, setType] = useState<GeofenceType>(existingGeofence?.type || 'CIRCLE');
  const [center, setCenter] = useState<Location>(existingGeofence?.center || { lat: -6.2088, lng: 106.8456 });
  const [radiusMeters, setRadiusMeters] = useState<number>(existingGeofence?.radiusMeters || 500);
  const [polygonCoordinates, setPolygonCoordinates] = useState<Location[]>(
    existingGeofence?.polygonCoordinates || [
      { lat: -6.2088, lng: 106.8400 },
      { lat: -6.2088, lng: 106.8500 },
      { lat: -6.2188, lng: 106.8500 },
      { lat: -6.2188, lng: 106.8400 },
    ]
  );
  const [validationError, setValidationError] = useState<string | undefined>();

  // Event Rules State
  const [entryEnabled, setEntryEnabled] = useState<boolean>(existingGeofence?.entryEnabled ?? true);
  const [exitEnabled, setExitEnabled] = useState<boolean>(existingGeofence?.exitEnabled ?? true);
  const [dwellEnabled, setDwellEnabled] = useState<boolean>(existingGeofence?.dwellEnabled ?? true);
  const [dwellThresholdMinutes, setDwellThresholdMinutes] = useState<number>(
    existingGeofence?.dwellThresholdMinutes || 30
  );

  // Assignment State
  const [assignmentType, setAssignmentType] = useState<'ALL' | 'VEHICLE_GROUP' | 'SPECIFIC_VEHICLE'>(
    existingGeofence?.assignment?.assignmentType || 'ALL'
  );
  const [selectedGroup, setSelectedGroup] = useState<string>('Armada Jabodetabek');

  // Schedule State
  const [scheduleType, setScheduleType] = useState<'ALWAYS' | 'BUSINESS_HOURS' | 'CUSTOM'>('ALWAYS');
  const [timezone, setTimezone] = useState<string>('Asia/Jakarta');

  // Notifications State
  const [cooldownMinutes, setCooldownMinutes] = useState<number>(15);

  if (!isOpen) return null;

  const handleNextStep = () => {
    // Step Validation
    if (currentStep === 1) {
      if (!name.trim()) {
        alert('Silakan masukkan nama Geofence.');
        return;
      }
    } else if (currentStep === 2) {
      const validation = geofenceGeometryService.validateGeometry(type, center, radiusMeters, polygonCoordinates);
      if (!validation.isValid) {
        setValidationError(validation.error);
        return;
      } else {
        setValidationError(undefined);
      }
    }

    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinalSave = () => {
    const finalGeofenceData: Omit<Geofence, 'id' | 'code' | 'createdAt' | 'updatedAt'> = {
      tenantId: 'tenant-tln-01',
      name,
      description,
      type,
      center,
      radiusMeters,
      polygonCoordinates,
      status,
      category,
      priority,
      color,
      active: status === 'ACTIVE',
      dwellThresholdMinutes,
      entryEnabled,
      exitEnabled,
      dwellEnabled,
      assignment: {
        id: `asg-${Date.now()}`,
        geofenceId: '',
        assignmentType,
        vehicleGroupNames: assignmentType === 'VEHICLE_GROUP' ? [selectedGroup] : undefined,
      },
      schedule: {
        id: `sch-${Date.now()}`,
        geofenceId: '',
        timezone,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        startTime: '00:00',
        endTime: '23:59',
        enabled: true,
        scheduleType,
      },
      alertRules: [
        {
          id: `alt-${Date.now()}`,
          geofenceId: '',
          eventType: 'ENTER',
          enabled: entryEnabled,
          severity: priority,
          notificationChannels: ['IN_APP', 'PUSH', 'WHATSAPP'],
          cooldownMinutes,
          recipients: ['operations@translogistik.co.id'],
        },
      ],
      createdBy: 'Budi Santoso (Admin)',
      address: 'Koordinat lokasi terdaftar',
    };

    onSave(finalGeofenceData);
    onClose();
  };

  const stepsList = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Draw Area' },
    { num: 3, title: 'Event Rules' },
    { num: 4, title: 'Assignment' },
    { num: 5, title: 'Schedule' },
    { num: 6, title: 'Notifications' },
    { num: 7, title: 'Review' },
    { num: 8, title: 'Save' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {existingGeofence ? 'Edit Geofence' : 'Buat Geofence Baru (8-Step Wizard)'}
              </h2>
              <p className="text-xs text-slate-400">
                Langkah {currentStep} dari 8: {stepsList[currentStep - 1].title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px]">
            {stepsList.map((step) => {
              const isPassed = step.num < currentStep;
              const isCurrent = step.num === currentStep;
              return (
                <div key={step.num} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400/50'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      isCurrent ? 'text-blue-400' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  {step.num < 8 && <ChevronRight className="w-3 h-3 text-slate-700" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Geofence <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Depo Cikarang Utama Gate 1"
                  className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Deskripsi & Catatan</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan fungsi area, aksesibilitas truk, atau instruksi pengemudi..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kategori Geofence</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GeofenceCategory)}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="DEPOT">DEPOT - Depo Utama Armada</option>
                    <option value="WAREHOUSE">WAREHOUSE - Gudang / Logistics Hub</option>
                    <option value="PORT">PORT - Pelabuhan / Terminal Cargo</option>
                    <option value="CUSTOMER">CUSTOMER - Lokasi Bongkar/Muat Customer</option>
                    <option value="PROJECT_SITE">PROJECT_SITE - Proyek Lapangan</option>
                    <option value="PARKING">PARKING - Area Parkir & Rest Area</option>
                    <option value="FUEL_STATION">FUEL_STATION - Stasiun BBM / SPBU</option>
                    <option value="RESTRICTED_AREA">RESTRICTED_AREA - Area Terlarang (Militer)</option>
                    <option value="OFFICE">OFFICE - Kantor Cabang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tingkat Prioritas (Priority)</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as GeofencePriority)}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="LOW">LOW - Monitoring Rendah</option>
                    <option value="NORMAL">NORMAL - Standar Operasional</option>
                    <option value="HIGH">HIGH - Pengawasan Ketat</option>
                    <option value="CRITICAL">CRITICAL - Alert Kritis & Respon Cepat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status Geofence</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as GeofenceStatus)}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">ACTIVE - Aktif Memantau GPS</option>
                    <option value="INACTIVE">INACTIVE - Non-aktif Sementara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Warna Peta (Color Overlay)</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer p-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DRAW AREA */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300">Pilih Tipe Bentuk Geometri:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setType('CIRCLE')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        type === 'CIRCLE'
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Circle className="w-3.5 h-3.5" />
                      <span>Circle (Lingkaran)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setType('POLYGON')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        type === 'POLYGON'
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Hexagon className="w-3.5 h-3.5" />
                      <span>Polygon (Banyak Sisi)</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  {type === 'CIRCLE'
                    ? 'Klik pada peta untuk menetapkan koordinat pusat'
                    : 'Klik beberapa titik pada peta untuk membentuk polygon'}
                </p>
              </div>

              {/* Map Canvas */}
              <div className="h-[360px] rounded-xl overflow-hidden border border-slate-800">
                <GeofenceMapComponent
                  geofences={[]}
                  isDrawingMode={true}
                  drawingType={type}
                  drawingCenter={center}
                  drawingRadius={radiusMeters}
                  drawingPolygon={polygonCoordinates}
                  onDrawingCenterChange={setCenter}
                  onDrawingRadiusChange={setRadiusMeters}
                  onDrawingPolygonChange={setPolygonCoordinates}
                  validationError={validationError}
                />
              </div>
            </div>
          )}

          {/* STEP 3: EVENT RULES */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Aturan Event Pemicu (Trigger Rules)
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block">☑ Event Masuk (ENTER)</span>
                    <span className="text-[11px] text-slate-400">
                      Deteksi saat kendaraan bergerak dari LUAR KAWASAN ke DALAM KAWASAN
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={entryEnabled}
                    onChange={(e) => setEntryEnabled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                  <div>
                    <span className="text-xs font-bold text-amber-400 block">☑ Event Keluar (EXIT)</span>
                    <span className="text-[11px] text-slate-400">
                      Deteksi saat kendaraan bergerak dari DALAM KAWASAN ke LUAR KAWASAN
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={exitEnabled}
                    onChange={(e) => setExitEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
                  <div>
                    <span className="text-xs font-bold text-purple-400 block">☑ Event Overstay (DWELL)</span>
                    <span className="text-[11px] text-slate-400">
                      Picu alert jika kendaraan berada di dalam kawasan melebihi durasi batas aman
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dwellEnabled}
                    onChange={(e) => setDwellEnabled(e.target.checked)}
                    className="w-4 h-4 accent-purple-500"
                  />
                </label>
              </div>

              {dwellEnabled && (
                <div className="p-4 bg-purple-950/30 border border-purple-800/50 rounded-xl space-y-2 mt-2">
                  <label className="block text-xs font-bold text-purple-300">
                    Batas Toleransi Waktu Dwell (Threshold)
                  </label>
                  <select
                    value={dwellThresholdMinutes}
                    onChange={(e) => setDwellThresholdMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-purple-800 px-3 py-2 text-xs text-white rounded-xl focus:outline-none"
                  >
                    <option value={5}>5 Menit (Cepat - Restriked Area)</option>
                    <option value={10}>10 Menit</option>
                    <option value={15}>15 Menit</option>
                    <option value={30}>30 Menit (Standar Bongkar Muat)</option>
                    <option value={60}>60 Menit (1 Jam)</option>
                    <option value={120}>120 Menit (2 Jam)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: VEHICLE ASSIGNMENT */}
          {currentStep === 4 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Penugasan Armada (Vehicle Assignment)
              </h3>

              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="asgType"
                    checked={assignmentType === 'ALL'}
                    onChange={() => setAssignmentType('ALL')}
                    className="accent-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Berlaku untuk Semua Armada (All Vehicles)</span>
                    <span className="text-[11px] text-slate-400">Seluruh kendaraan di bawah tenant ini akan dipantau</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="asgType"
                    checked={assignmentType === 'VEHICLE_GROUP'}
                    onChange={() => setAssignmentType('VEHICLE_GROUP')}
                    className="accent-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Berdasarkan Grup Armada Terdaftar</span>
                    <span className="text-[11px] text-slate-400">Pilih grup kendaraan tertentu</span>
                  </div>
                </label>
              </div>

              {assignmentType === 'VEHICLE_GROUP' && (
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-slate-300">Pilih Grup Armada:</label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white rounded-xl"
                  >
                    <option value="Armada Trans-Jawa">Armada Trans-Jawa</option>
                    <option value="Container Port-Cikarang">Container Port-Cikarang</option>
                    <option value="Armada Jabodetabek">Armada Jabodetabek</option>
                    <option value="Tangki BBM & Kimia">Tangki BBM & Kimia</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: SCHEDULE */}
          {currentStep === 5 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Jadwal Operasional Monitoring (Schedule)
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleType('ALWAYS')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    scheduleType === 'ALWAYS'
                      ? 'bg-blue-950/80 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs block">Selalu Aktif (24/7)</span>
                  <span className="text-[11px] text-slate-400">Memantau terus menerus tanpa henti</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScheduleType('BUSINESS_HOURS')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    scheduleType === 'BUSINESS_HOURS'
                      ? 'bg-blue-950/80 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs block">Jam Kerja (Business Hours)</span>
                  <span className="text-[11px] text-slate-400">Senin - Sabtu (08:00 - 18:00)</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Zona Waktu (Timezone Tenant)</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white rounded-xl"
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB - UTC+7)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA - UTC+8)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT - UTC+9)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 6: NOTIFICATIONS */}
          {currentStep === 6 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Saluran Notifikasi & Cooldown Rules
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>In-App Dashboard</span>
                  <span className="text-emerald-400 font-bold">AKTIFF</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>Mobile Push Notification</span>
                  <span className="text-emerald-400 font-bold">AKTIFF</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>WhatsApp Gateway</span>
                  <span className="text-emerald-400 font-bold">AKTIFF</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>Email Dispatcher</span>
                  <span className="text-emerald-400 font-bold">AKTIFF</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Waktu Henti Alert Spam (Cooldown Period)
                </label>
                <select
                  value={cooldownMinutes}
                  onChange={(e) => setCooldownMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white rounded-xl"
                >
                  <option value={0}>Tanpa Cooldown (Kirim Setiap Event)</option>
                  <option value={15}>15 Menit</option>
                  <option value={30}>30 Menit</option>
                  <option value={60}>60 Menit (1 Jam)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW */}
          {currentStep === 7 && (
            <div className="space-y-4 max-w-xl mx-auto text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Ringkasan Konfigurasi Geofence
              </h3>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Geofence:</span>
                  <span className="font-bold text-white">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tipe Geometri:</span>
                  <span className="font-bold text-blue-400">{type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kategori & Prioritas:</span>
                  <span className="font-bold text-emerald-400">{category} • {priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Aturan Pemicu:</span>
                  <span className="font-bold text-purple-300">
                    {entryEnabled ? 'ENTER ' : ''}
                    {exitEnabled ? 'EXIT ' : ''}
                    {dwellEnabled ? `DWELL (${dwellThresholdMinutes}m)` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Penugasan Armada:</span>
                  <span className="font-bold text-white">{assignmentType}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: SAVE */}
          {currentStep === 8 && (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Save className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Geofence Siap Disimpan</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Klik tombol di bawah ini untuk menyimpan dan mengaktifkan deteksi telemetry otomatis.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Nav */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            disabled={currentStep === 1}
            onClick={handlePrevStep}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          {currentStep < 8 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-950"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSave}
              className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-950"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Aktifkan Geofence</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
