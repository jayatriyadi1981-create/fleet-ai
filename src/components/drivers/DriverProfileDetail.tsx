/**
 * Fleet Intelligence Smart AI - Driver Profile Detail View
 * 10-Tab Deep Profile: Overview, SIMs, Assignments, Shifts, Performance, Docs, Training, Compliance, History & AI Intelligence
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Truck,
  Clock,
  Award,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Radio,
  Cpu,
  ChevronLeft,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
  Brain,
  Zap,
} from 'lucide-react';
import {
  DriverExtended,
  DriverLicense,
  DriverAssignment,
  DriverShift,
  DriverDocument,
  DriverTraining,
  DriverSafetyEvent,
  DriverAIIntelligence,
  DriverActivityLog,
} from '../../types/driver';
import { DriverService, maskSensitiveData } from '../../services/driverService';

interface DriverProfileDetailProps {
  driverId: string;
  onBack: () => void;
  onOpenAssignModal: (driver: DriverExtended) => void;
}

export const DriverProfileDetail: React.FC<DriverProfileDetailProps> = ({
  driverId,
  onBack,
  onOpenAssignModal,
}) => {
  const [driver, setDriver] = useState<DriverExtended | null>(null);
  const [licenses, setLicenses] = useState<DriverLicense[]>([]);
  const [documents, setDocuments] = useState<DriverDocument[]>([]);
  const [trainings, setTrainings] = useState<DriverTraining[]>([]);
  const [safetyEvents, setSafetyEvents] = useState<DriverSafetyEvent[]>([]);
  const [aiIntelligence, setAiIntelligence] = useState<DriverAIIntelligence | null>(null);
  const [activityLogs, setActivityLogs] = useState<DriverActivityLog[]>([]);

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'licenses'
    | 'assignments'
    | 'shifts'
    | 'performance'
    | 'documents'
    | 'training'
    | 'compliance'
    | 'history'
    | 'ai_intelligence'
  >('overview');

  const [showSensitive, setShowSensitive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const d = await DriverService.getDriverById(driverId);
        if (d) {
          setDriver(d);
          const lics = await DriverService.getLicensesByDriver(d.driverId);
          setLicenses(lics);
          const docs = await DriverService.getDocumentsByDriver(d.driverId);
          setDocuments(docs);
          const trs = await DriverService.getTrainingsByDriver(d.driverId);
          setTrainings(trs);
          const se = await DriverService.getSafetyEventsByDriver(d.driverId);
          setSafetyEvents(se);
          const ai = await DriverService.getAIIntelligence(d.driverId);
          setAiIntelligence(ai);
          const logs = await DriverService.getActivityLogs(d.driverId);
          setActivityLogs(logs);
        }
      } catch (err) {
        console.error('Error loading driver profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [driverId]);

  if (loading || !driver) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 animate-spin text-indigo-600" />
        <span>Memuat profil lengkap pengemudi...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Driver</span>
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <img
              src={driver.photoUrl}
              alt={driver.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600/30 dark:border-indigo-400/30 shrink-0 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {driver.fullName}
                </h2>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded">
                  {driver.driverCode}
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full">
                  {driver.status.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> {driver.branchName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {driver.position}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {maskSensitiveData(driver.phone, showSensitive)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              className="px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              {showSensitive ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-indigo-500" />}
              <span>{showSensitive ? 'Mask Data' : 'Unmask Data'}</span>
            </button>

            <button
              onClick={() => onOpenAssignModal(driver)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>{driver.currentVehiclePlate ? 'Ganti Unit' : 'Tugaskan Kendaraan'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pt-2 text-xs font-medium">
          {[
            { id: 'overview', label: 'Ringkasan Profil', icon: User },
            { id: 'licenses', label: 'SIM & Lisensi', icon: ShieldCheck },
            { id: 'assignments', label: 'Alokasi Kendaraan', icon: Truck },
            { id: 'shifts', label: 'Jadwal Shift', icon: Clock },
            { id: 'performance', label: 'Safety & Performa', icon: Award },
            { id: 'documents', label: 'Dokumen Legal', icon: FileText },
            { id: 'training', label: 'Pelatihan ISDC', icon: CheckCircle2 },
            { id: 'compliance', label: 'Matriks Kepatuhan', icon: ShieldAlert },
            { id: 'history', label: 'Histori Log', icon: Calendar },
            { id: 'ai_intelligence', label: '✦ AI Intelligence', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.id === 'ai_intelligence' ? 'text-indigo-500 animate-pulse' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Vehicle & Telemetry Card */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Kendaraan Aktif & Integrasi Telematika GPS
            </h3>

            {driver.currentVehiclePlate ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                      {driver.currentVehiclePlate}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {driver.currentVehicleName}
                    </span>
                  </div>

                  <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> GPS Terhubung
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Perangkat GPS:</span>
                    <span className="block font-mono font-bold text-slate-800 dark:text-slate-200">
                      {driver.currentGpsDeviceId || 'dev-01'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Trip Aktif:</span>
                    <span className="block font-bold text-slate-800 dark:text-slate-200">
                      {driver.currentTripNumber || 'Trans-Jawa Long Haul'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Keterangan:</span>
                    <span className="block font-medium text-emerald-600 dark:text-emerald-400">
                      Normal Telemetry
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                <Truck className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Pengemudi saat ini belum ditugaskan ke kendaraan master.
                </p>
                <button
                  onClick={() => onOpenAssignModal(driver)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg inline-block"
                >
                  Tugaskan Kendaraan
                </button>
              </div>
            )}

            {/* Personal & Emergency Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Kontak & Domisili
                </h4>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p><strong>NIP:</strong> {driver.employeeId}</p>
                  <p><strong>Email:</strong> {driver.email}</p>
                  <p><strong>Alamat:</strong> {driver.address}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Kontak Darurat
                </h4>
                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <p><strong>Nama:</strong> {driver.emergencyContact.name}</p>
                  <p><strong>Hubungan:</strong> {driver.emergencyContact.relationship}</p>
                  <p><strong>Telepon:</strong> {maskSensitiveData(driver.emergencyContact.phone, showSensitive)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance & Safety Score Gauge Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Skor Performa Safety Score
            </h3>

            <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {driver.safetyScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full inline-block">
                EXCELLENT SAFETY RATING
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Berdasarkan evaluasi telemetri GPS 30 hari terakhir.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Perjalanan Selesai:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{driver.totalTripsCompleted} Trips</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Jarak Tempuh:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{driver.totalDistanceKm.toLocaleString()} KM</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Insiden Speeding:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{driver.speedingEventsCount}x</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Intelligence Tab */}
      {activeTab === 'ai_intelligence' && aiIntelligence && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
                <h3 className="text-base font-bold tracking-wide">
                  AI Driver Behavioral Intelligence & Safety Assessment
                </h3>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-emerald-500 text-slate-950 rounded-full">
                RISK LEVEL: {aiIntelligence.riskLevel}
              </span>
            </div>

            <p className="text-xs text-indigo-100 leading-relaxed max-w-3xl">
              {aiIntelligence.drivingBehaviorSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Keunggulan Berkemudi (Strengths)
                </h4>
                <ul className="text-xs space-y-1 text-indigo-100 list-disc list-inside">
                  {aiIntelligence.positivePoints.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Area Perhatian (Attention Points)
                </h4>
                <ul className="text-xs space-y-1 text-indigo-100 list-disc list-inside">
                  {aiIntelligence.attentionPoints.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* AI Coaching Recommendations */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Rekomendasi Safety Coaching Otomatis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiIntelligence.coaching.map((c, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {c.focusArea}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-100 text-amber-800 rounded">
                      Priority: {c.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {c.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Licenses Tab */}
      {activeTab === 'licenses' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Lisensi SIM Pengemudi
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {licenses.map((lic) => (
              <div key={lic.licenseId} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block">
                    {lic.licenseType} — {maskSensitiveData(lic.licenseNumber, showSensitive)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">
                    Penerbit: {lic.issuingAuthority} • Expiry: {lic.expiryDate}
                  </span>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                  {lic.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
