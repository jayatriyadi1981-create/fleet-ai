/**
 * Fleet Intelligence Smart AI - Vehicle Profile Detail Component
 * PROMPT 9 - Comprehensive 10-Tab Vehicle Profile (/app/fleet/vehicles/:id)
 */

import React, { useState, useEffect } from 'react';
import { 
  VehicleExtended, 
  VehicleDocument, 
  VehicleActivityLog, 
  VehicleAIInsightDetail,
  VehicleTripRecord,
  VehicleFuelRecord,
  VehicleMaintenanceRecord,
  VehicleAlertRecord,
  VehicleLifecycleStatus
} from '../../types/vehicle';
import { vehicleService } from '../../services/vehicleService';
import { useFleet } from '../../context/FleetContext';
import { useToast } from '../ui/Toast';
import { AssignDriverModal, AssignGpsModal } from './AssignModals';
import { TripsTab } from './tabs/TripsTab';
import { FuelTab } from './tabs/FuelTab';
import { MaintenanceTab } from './tabs/MaintenanceTab';
import { SafetyTab } from './tabs/SafetyTab';
import { AiHealthTab } from './tabs/AiHealthTab';
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  User, 
  Radio, 
  Navigation, 
  Fuel, 
  Wrench, 
  ShieldAlert, 
  FileText, 
  History, 
  Sparkles, 
  Edit, 
  Archive, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Gauge,
  Calendar,
  Building2,
  Download,
  Plus,
  Zap,
  Activity,
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';

interface VehicleProfileDetailProps {
  vehicleId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export const VehicleProfileDetail: React.FC<VehicleProfileDetailProps> = ({
  vehicleId,
  onBack,
  onEdit,
}) => {
  const { setActiveView, setSelectedVehicleId } = useFleet();
  const { addToast } = useToast();

  const [vehicle, setVehicle] = useState<VehicleExtended | null>(null);
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [activityLogs, setActivityLogs] = useState<VehicleActivityLog[]>([]);
  const [aiInsight, setAiInsight] = useState<VehicleAIInsightDetail | null>(null);
  const [trips, setTrips] = useState<VehicleTripRecord[]>([]);
  const [fuelRecords, setFuelRecords] = useState<VehicleFuelRecord[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<VehicleMaintenanceRecord[]>([]);
  const [alerts, setAlerts] = useState<VehicleAlertRecord[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'gps' | 'driver' | 'trips' | 'fuel' | 'maintenance' | 'safety' | 'documents' | 'activity' | 'ai'
  >('overview');

  // Modals
  const [isAssignDriverOpen, setIsAssignDriverOpen] = useState(false);
  const [isAssignGpsOpen, setIsAssignGpsOpen] = useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [isLifecycleModalOpen, setIsLifecycleModalOpen] = useState(false);
  const [selectedLifecycle, setSelectedLifecycle] = useState<VehicleLifecycleStatus>('active');
  const [lifecycleReason, setLifecycleReason] = useState('');

  // Document Modal Form State
  const [newDocData, setNewDocData] = useState({
    title: '',
    type: 'stnk' as any,
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const veh = await vehicleService.getVehicleById(vehicleId);
      if (!veh) {
        addToast({ type: 'error', title: 'Error', message: 'Kendaraan tidak ditemukan' });
        onBack();
        return;
      }
      setVehicle(veh);
      setSelectedLifecycle(veh.lifecycleStatus || 'active');

      const [docs, logs, ai, trps, fuel, maint, alrts] = await Promise.all([
        vehicleService.getVehicleDocuments(vehicleId),
        vehicleService.getVehicleActivityLogs(vehicleId),
        vehicleService.getVehicleAIInsight(vehicleId),
        vehicleService.getVehicleTrips(vehicleId),
        vehicleService.getVehicleFuelRecords(vehicleId),
        vehicleService.getVehicleMaintenanceRecords(vehicleId),
        vehicleService.getVehicleAlerts(vehicleId),
      ]);

      setDocuments(docs);
      setActivityLogs(logs);
      setAiInsight(ai);
      setTrips(trps);
      setFuelRecords(fuel);
      setMaintenanceRecords(maint);
      setAlerts(alrts);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.message || 'Gagal memuat profil' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [vehicleId]);

  const handleTrackLive = () => {
    if (vehicle) {
      setSelectedVehicleId(vehicle.id);
      setActiveView('live_tracking');
    }
  };

  const handleArchive = async () => {
    if (!vehicle) return;
    if (window.confirm(`Apakah Anda yakin ingin mengarsipkan kendaraan ${vehicle.licensePlate}?`)) {
      try {
        await vehicleService.archiveVehicle(vehicle.id);
        addToast({ type: 'success', title: 'Diarsipkan', message: 'Kendaraan berhasil diarsipkan.' });
        onBack();
      } catch (err: any) {
        addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal mengarsipkan' });
      }
    }
  };

  const handleLifecycleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    try {
      await vehicleService.updateVehicleLifecycle(vehicle.id, selectedLifecycle, lifecycleReason);
      addToast({
        type: 'success',
        title: 'Status Lifecycle Diperbarui',
        message: `Status unit berhasil diubah menjadi "${selectedLifecycle.toUpperCase()}".`,
      });
      setIsLifecycleModalOpen(false);
      setLifecycleReason('');
      loadData();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal mengubah status lifecycle' });
    }
  };

  const handleAddFuelRecord = async (data: any) => {
    try {
      await vehicleService.addVehicleFuelRecord(vehicleId, data);
      addToast({ type: 'success', title: 'BBM Dicatat', message: 'Pencatatan pengisian bahan bakar berhasil disimpan.' });
      loadData();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal mencatat BBM' });
    }
  };

  const handleAddMaintenanceRecord = async (data: any) => {
    try {
      await vehicleService.addVehicleMaintenanceRecord(vehicleId, data);
      addToast({ type: 'success', title: 'Work Order Dibuat', message: 'Work order pemeliharaan berhasil disimpan.' });
      loadData();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal membuat work order' });
    }
  };

  const handleResolveAlert = async (alertId: string, note: string) => {
    try {
      await vehicleService.resolveVehicleAlert(alertId, vehicleId, note);
      addToast({ type: 'success', title: 'Peringatan Diselesaikan', message: 'Status peringatan diperbarui menjadi resolved.' });
      loadData();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal menyelesaikan alert' });
    }
  };

  const handleAddDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocData.title || !newDocData.documentNumber || !newDocData.expiryDate) {
      addToast({ type: 'warning', title: 'Form Tidak Lengkap', message: 'Lengkapi semua field dokumen' });
      return;
    }

    try {
      const today = new Date();
      const exp = new Date(newDocData.expiryDate);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
      const status = diffDays < 0 ? 'expired' : diffDays <= 30 ? 'expiring_soon' : 'valid';

      await vehicleService.addVehicleDocument(vehicleId, {
        vehicleId,
        tenantId: vehicle?.tenantId || 'tenant-tln-01',
        type: newDocData.type,
        title: newDocData.title,
        documentNumber: newDocData.documentNumber,
        issueDate: newDocData.issueDate || new Date().toISOString().split('T')[0],
        expiryDate: newDocData.expiryDate,
        status,
        fileName: `${newDocData.type.toUpperCase()}_${vehicle?.licensePlate}.pdf`,
        fileSizeMb: 1.5,
      });

      addToast({ type: 'success', title: 'Dokumen Ditambahkan', message: 'Dokumen kendaraan berhasil diunggah.' });
      setIsAddDocOpen(false);
      setNewDocData({ title: '', type: 'stnk', documentNumber: '', issueDate: '', expiryDate: '' });
      loadData();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Gagal menambahkan dokumen' });
    }
  };

  if (isLoading || !vehicle) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-xs text-slate-400">Memuat Profil Kendaraan & Telematika...</p>
        </div>
      </div>
    );
  }

  const getLifecycleBadge = (status: VehicleLifecycleStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'inactive':
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
      case 'maintenance':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'rental':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'sold':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'retired':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Subtle Background Accent Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            <button
              onClick={onBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-mono font-bold text-cyan-300">
                  {vehicle.licensePlate}
                </span>
                <span className="rounded-lg bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-semibold text-slate-300">
                  {vehicle.vehicleCode}
                </span>
                <span className="rounded-lg bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300 capitalize">
                  {vehicle.type.replace('_', ' ')}
                </span>
                <button
                  onClick={() => setIsLifecycleModalOpen(true)}
                  className={`rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all hover:brightness-125 ${getLifecycleBadge(
                    vehicle.lifecycleStatus || 'active'
                  )}`}
                  title="Klik untuk mengubah status siklus hidup armada"
                >
                  <span>● LIFECYCLE: {vehicle.lifecycleStatus || 'active'}</span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </button>
              </div>

              <h1 className="text-2xl font-black text-white tracking-tight">{vehicle.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                  {vehicle.branchName} ({vehicle.region || 'Jabodetabek & Banten'})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-purple-400" />
                  {vehicle.groupName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  Driver: <strong className="text-white">{vehicle.primaryDriverName || 'Belum Ditugaskan'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleTrackLive}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-950/50"
            >
              <Navigation className="h-4 w-4" />
              Lacak Live GPS
            </button>
            <button
              onClick={() => setIsAssignDriverOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              <User className="h-4 w-4 text-cyan-400" />
              Tugaskan Driver
            </button>
            <button
              onClick={() => onEdit(vehicle.id)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              <Edit className="h-4 w-4 text-amber-400" />
              Edit Profil
            </button>
            <button
              onClick={handleArchive}
              className="flex items-center gap-2 rounded-xl border border-rose-900/50 bg-rose-950/30 px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-900/50"
              title="Arsipkan Kendaraan"
            >
              <Archive className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 10 Enterprise Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Ringkasan', icon: Truck },
          { id: 'gps', label: 'Telematika GPS', icon: Navigation },
          { id: 'driver', label: 'Pengemudi', icon: User },
          { id: 'trips', label: `Perjalanan (${trips.length})`, icon: MapPin },
          { id: 'fuel', label: `BBM & Efisiensi (${fuelRecords.length})`, icon: Fuel },
          { id: 'maintenance', label: `Pemeliharaan (${maintenanceRecords.length})`, icon: Wrench },
          { id: 'safety', label: `Keselamatan (${alerts.length})`, icon: ShieldAlert },
          { id: 'documents', label: `Dokumen Legal (${documents.length})`, icon: FileText },
          { id: 'activity', label: `Audit Log (${activityLogs.length})`, icon: History },
          { id: 'ai', label: 'AI Health & Diagnostic', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Odometer</p>
              <p className="text-lg font-mono font-bold text-white">{vehicle.odometerKm.toLocaleString('id-ID')} KM</p>
              <p className="text-[10px] text-cyan-400">Total Jarak Tempuh</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Hours</p>
              <p className="text-lg font-mono font-bold text-white">{vehicle.engineHours.toLocaleString('id-ID')} Jam</p>
              <p className="text-[10px] text-purple-400">Jam Kerja Mesin</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BBM Tangki</p>
              <p className="text-lg font-mono font-bold text-emerald-400">
                {vehicle.latestTelemetry?.fuelLevelPercent || 78}%
              </p>
              <p className="text-[10px] text-slate-400">{vehicle.fuelCapacityLiters} Liter Max</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kecepatan</p>
              <p className="text-lg font-mono font-bold text-cyan-400">
                {vehicle.latestTelemetry?.location.speed || 0} KM/H
              </p>
              <p className="text-[10px] text-slate-400">Real-time Telemetry</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kesehatan AI</p>
              <p className="text-lg font-mono font-bold text-cyan-300">{vehicle.healthScore || 88}/100</p>
              <p className="text-[10px] text-emerald-400">Kondisi Baik</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sertifikasi Legal</p>
              <p className="text-lg font-mono font-bold text-emerald-400">BERLAKU</p>
              <p className="text-[10px] text-slate-400">STNK & Uji KIR Valid</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Technical Specs Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Spesifikasi Teknis & Pabrikan</span>
                <Truck className="h-4 w-4 text-cyan-400" />
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Merek / Brand</span>
                  <span className="font-semibold text-white">{vehicle.brand}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Model / Seri</span>
                  <span className="font-semibold text-white">{vehicle.model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Tahun Pembuatan</span>
                  <span className="font-semibold text-white">{vehicle.year}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Nomor VIN</span>
                  <span className="font-mono text-cyan-300">{vehicle.vin}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Nomor Rangka</span>
                  <span className="font-mono text-slate-200">{vehicle.chassisNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Nomor Mesin</span>
                  <span className="font-mono text-slate-200">{vehicle.engineNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Kapasitas Muatan</span>
                  <span className="font-semibold text-white">
                    {vehicle.capacity?.formatted || `${vehicle.payloadKg || 12000} Kg Payload`}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Bahan Bakar</span>
                  <span className="font-semibold text-emerald-400 uppercase">{vehicle.fuelType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Status Kepemilikan</span>
                  <span className="font-semibold text-slate-200 capitalize">{vehicle.ownership.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Legal Status & Expiry Alerts */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Legalitas & Masa Berlaku Surat</span>
                <FileText className="h-4 w-4 text-emerald-400" />
              </h3>

              <div className="space-y-3">
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">STNK Kendaraan</p>
                    <p className="text-[11px] font-mono text-slate-400">Expiry: {vehicle.stnkExpiry || '2027-08-20'}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    VALID
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Uji Berkala KIR Dishub</p>
                    <p className="text-[11px] font-mono text-slate-400">Expiry: {vehicle.kirExpiry || '2026-12-10'}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    VALID
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Polis Asuransi All Risk</p>
                    <p className="text-[11px] font-mono text-slate-400">Expiry: {vehicle.insuranceExpiry || '2027-03-15'}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    VALID
                  </span>
                </div>
              </div>
            </div>

            {/* AI Diagnostics Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Rekomendasi AI Intelligence</span>
                <Sparkles className="h-4 w-4 text-purple-400" />
              </h3>

              <div className="space-y-3">
                <div className="rounded-xl bg-purple-950/20 border border-purple-500/30 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-400 shrink-0" />
                    <p className="text-xs font-bold text-purple-200">Optimalisasi Efisiensi BBM</p>
                  </div>
                  <p className="text-[11px] text-purple-300 leading-relaxed">
                    Performa mesin sangat sehat. Disarankan mempertahankan penggunaan Biodiesel B35 dan kalibrasi sensor RPM secara berkala.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('ai')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  Buka Diagnostic Lengkap AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GPS TELEMATICS TAB */}
      {activeTab === 'gps' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Navigation className="h-5 w-5 text-cyan-400" />
                Telematika Sensor IoT & GPS Live Stream
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Device ID: <span className="font-mono text-cyan-300 font-bold">{vehicle.gpsDeviceId}</span> • IMEI: {vehicle.gpsImei}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAssignGpsOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                <Radio className="h-4 w-4 text-cyan-400" />
                Ganti Perangkat GPS
              </button>
              <button
                onClick={handleTrackLive}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                <ExternalLink className="h-4 w-4" />
                Buka Peta Tracking Penuh
              </button>
            </div>
          </div>

          {/* Telemetry Gauges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status Kontak (Ignition)</span>
              <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> ENGINE ON
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Engine RPM</span>
              <p className="text-lg font-mono font-bold text-white">{vehicle.latestTelemetry?.engineRpm || 1850} RPM</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Suhu Mesin</span>
              <p className="text-lg font-mono font-bold text-cyan-300">{vehicle.latestTelemetry?.engineTempCelsius || 86} °C</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tegangan Aki</span>
              <p className="text-lg font-mono font-bold text-white">{vehicle.latestTelemetry?.batteryVoltage || 24.2} V</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <p className="text-xs font-bold text-slate-300">Lokasi Terakhir Terdeteksi GPS:</p>
            <p className="text-xs text-cyan-300 font-semibold">{vehicle.latestTelemetry?.location.address || 'Tol Jakarta-Cikampek KM 18, Bekasi'}</p>
            <p className="text-[11px] font-mono text-slate-500">
              Lat: {vehicle.latestTelemetry?.location.lat || -6.2297}, Lng: {vehicle.latestTelemetry?.location.lng || 106.9275}
            </p>
          </div>
        </div>
      )}

      {/* 3. DRIVER TAB */}
      {activeTab === 'driver' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-400" />
                Profil Driver Utama Unit Kendaraan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Sopir resmi yang memegang tanggung jawab membawa unit ini.</p>
            </div>

            <button
              onClick={() => setIsAssignDriverOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
            >
              <User className="h-4 w-4" />
              Ganti / Tugaskan Driver
            </button>
          </div>

          {vehicle.primaryDriverName ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xl font-bold">
                  {vehicle.primaryDriverName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{vehicle.primaryDriverName}</h4>
                  <p className="text-xs text-slate-400">SIM B2 Umum • Terdaftar Resmi</p>
                  <p className="text-xs text-cyan-400 font-mono mt-1">NIK: 3175081203850001</p>
                </div>
              </div>

              <div className="text-right border-l border-slate-800 pl-6 hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Skor Keselamatan (Safety Score)</p>
                <p className="text-2xl font-mono font-bold text-emerald-400">94 / 100</p>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">EXCELLENT DRIVER</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-3">
              <User className="mx-auto h-8 w-8 text-slate-500" />
              <p className="text-xs text-slate-400">Kendaraan ini saat ini belum ditugaskan ke driver manapun.</p>
            </div>
          )}
        </div>
      )}

      {/* 4. TRIPS TAB */}
      {activeTab === 'trips' && <TripsTab trips={trips} />}

      {/* 5. FUEL TAB */}
      {activeTab === 'fuel' && (
        <FuelTab
          vehicleId={vehicle.id}
          fuelRecords={fuelRecords}
          onAddFuelRecord={handleAddFuelRecord}
        />
      )}

      {/* 6. MAINTENANCE TAB */}
      {activeTab === 'maintenance' && (
        <MaintenanceTab
          vehicleId={vehicle.id}
          maintenanceRecords={maintenanceRecords}
          onAddMaintenanceRecord={handleAddMaintenanceRecord}
        />
      )}

      {/* 7. SAFETY TAB */}
      {activeTab === 'safety' && (
        <SafetyTab
          vehicleId={vehicle.id}
          alerts={alerts}
          onResolveAlert={handleResolveAlert}
        />
      )}

      {/* 8. DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-400" />
              Berkas Dokumen STNK, KIR & Polis Asuransi
            </h3>

            <button
              onClick={() => setIsAddDocOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
            >
              <Plus className="h-4 w-4" />
              Unggah Dokumen
            </button>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white">{doc.title}</p>
                    <span className="font-mono text-[11px] text-cyan-300">({doc.documentNumber})</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Berlaku: {doc.issueDate} s/d <strong className="text-white">{doc.expiryDate}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      doc.status === 'valid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : doc.status === 'expiring_soon'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {doc.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. ACTIVITY TIMELINE TAB */}
      {activeTab === 'activity' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <History className="h-5 w-5 text-cyan-400" />
            Audit Log Histori & Jejak Aktivitas Unit
          </h3>

          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="relative pl-6 border-l border-slate-800 space-y-1">
                <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-cyan-400 border border-slate-900" />
                <p className="text-xs font-bold text-white">{log.title}</p>
                <p className="text-xs text-slate-400">{log.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                  <span>{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                  <span>•</span>
                  <span>Oleh: {log.performedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. AI INTELLIGENCE TAB */}
      {activeTab === 'ai' && <AiHealthTab aiInsight={aiInsight} />}

      {/* Modals */}
      <AssignDriverModal
        isOpen={isAssignDriverOpen}
        onClose={() => setIsAssignDriverOpen(false)}
        vehicleId={vehicle.id}
        vehiclePlate={vehicle.licensePlate}
        currentDriverId={vehicle.primaryDriverId}
        onSuccess={loadData}
      />

      <AssignGpsModal
        isOpen={isAssignGpsOpen}
        onClose={() => setIsAssignGpsOpen(false)}
        vehicleId={vehicle.id}
        vehiclePlate={vehicle.licensePlate}
        currentGpsId={vehicle.gpsDeviceId}
        onSuccess={loadData}
      />

      {/* Lifecycle Status Change Modal */}
      {isLifecycleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              Ubah Status Siklus Hidup Kendaraan
            </h3>

            <form onSubmit={handleLifecycleChangeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status Siklus Hidup (Lifecycle)</label>
                <select
                  value={selectedLifecycle}
                  onChange={(e) => setSelectedLifecycle(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="active">Active (Aktif Beroperasi)</option>
                  <option value="inactive">Inactive (Standby / Tidak Aktif)</option>
                  <option value="maintenance">Maintenance (Perbaikan Bengkel)</option>
                  <option value="rental">Rental (Disewakan / Kontrak)</option>
                  <option value="sold">Sold (Dijual ke Pihak Luar)</option>
                  <option value="retired">Retired (Afkir / Decommissioned)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alasan / Catatan Perubahan</label>
                <textarea
                  rows={3}
                  value={lifecycleReason}
                  onChange={(e) => setLifecycleReason(e.target.value)}
                  placeholder="e.g. Unit dijadwalkan overhaul mesin 100.000 KM di workshop pusat."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLifecycleModalOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                >
                  Simpan Perubahan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {isAddDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Unggah Dokumen Legalitas</h3>
            <form onSubmit={handleAddDocumentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Dokumen</label>
                <input
                  type="text"
                  value={newDocData.title}
                  onChange={(e) => setNewDocData({ ...newDocData, title: e.target.value })}
                  placeholder="e.g. STNK Perpanjangan 2026"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Jenis Dokumen</label>
                <select
                  value={newDocData.type}
                  onChange={(e) => setNewDocData({ ...newDocData, type: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="stnk">STNK</option>
                  <option value="kir">Uji KIR Dishub</option>
                  <option value="insurance">Asuransi</option>
                  <option value="bpkb">BPKB</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Dokumen</label>
                <input
                  type="text"
                  value={newDocData.documentNumber}
                  onChange={(e) => setNewDocData({ ...newDocData, documentNumber: e.target.value })}
                  placeholder="e.g. STNK-0912384-X"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Masa Berlaku Expiry</label>
                <input
                  type="date"
                  value={newDocData.expiryDate}
                  onChange={(e) => setNewDocData({ ...newDocData, expiryDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddDocOpen(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
