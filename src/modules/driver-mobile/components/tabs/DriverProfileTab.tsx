import React, { useState } from 'react';
import {
  User,
  Phone,
  CreditCard,
  Building2,
  Calendar,
  Award,
  Smartphone,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DriverSessionState, DriverActivityLogItem } from '../../types/driverMobileTypes';
import { mobileSyncService } from '../../services/mobileSyncService';
import { driverSessionService } from '../../services/driverSessionService';

interface DriverProfileTabProps {
  session: DriverSessionState;
  onRefresh: () => void;
}

export const DriverProfileTab: React.FC<DriverProfileTabProps> = ({ session, onRefresh }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const isOnline = mobileSyncService.getNetworkStatus();
  const pendingQueue = mobileSyncService.getPendingQueue();
  const photoQueue = mobileSyncService.getPhotoQueue();
  const activities = driverSessionService.getActivityLogs();

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await mobileSyncService.triggerSync();
      setSyncResult(`Sinkronisasi berhasil: ${res.syncedCount} item terkirim ke server.`);
      onRefresh();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleOfflineSimulation = () => {
    mobileSyncService.toggleNetworkSimulation();
    onRefresh();
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">{session.driverName}</h2>
              <div className="text-xs text-slate-400 font-mono">{session.employeeId}</div>
              <div className="text-[11px] text-cyan-300 font-bold mt-0.5">{session.simType} &bull; {session.simNumber}</div>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
            Active Driver
          </span>
        </div>

        {/* Company & Contact Details */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Perusahaan (Tenant)</span>
            <div className="font-bold text-white font-sans text-[11px] line-clamp-1">{session.tenantName}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Cabang / Depo</span>
            <div className="font-bold text-white font-sans text-[11px] line-clamp-1">{session.branchName}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">No. Handphone</span>
            <div className="font-bold text-cyan-300">{session.phone}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Jam Shift Hari Ini</span>
            <div className="font-bold text-emerald-400">{session.shift.start} - {session.shift.end}</div>
          </div>
        </div>
      </div>

      {/* Offline Sync Center Card (PROMPT 46 Core Architecture) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-rose-400" />}
            <div>
              <h3 className="text-xs font-bold text-white">Mobile Sync Engine & Offline Queue</h3>
              <p className="text-[11px] text-slate-400">
                {isOnline ? 'Status: Online (Auto Sync Realtime)' : 'Status: Mode Offline (Data Tersimpan Lokal)'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleOfflineSimulation}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${
              isOnline
                ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {isOnline ? 'Simulasi Offline' : 'Kembali Online'}
          </button>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Aksi Pending</span>
            <div className="font-bold text-white">
              {pendingQueue.filter(i => i.status === 'PENDING').length} Antrean
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-sans">Antrean Foto / POD</span>
            <div className="font-bold text-cyan-300">
              {photoQueue.filter(p => p.status === 'PENDING').length} Foto
            </div>
          </div>
        </div>

        {syncResult && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{syncResult}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            disabled={isSyncing || !isOnline}
            onClick={handleManualSync}
            className="flex-1 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
          </button>

          <button
            onClick={() => {
              mobileSyncService.clearSynced();
              onRefresh();
            }}
            className="px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition"
          >
            Bersihkan Cache
          </button>
        </div>
      </div>

      {/* Activity Timeline (PROMPT 46) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Aktivitas & Kronologi Hari Ini:</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">{activities.length} Peristiwa</span>
        </div>

        <div className="space-y-3 pl-2 border-l-2 border-slate-800 ml-2">
          {activities.map(act => (
            <div key={act.id} className="relative pl-4 space-y-1 text-xs">
              <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-slate-900" />
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-white">{act.title}</span>
                <span className="text-[10px] font-mono text-slate-400">{act.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{act.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gamification / Performance Badges */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Prestasi & Lencana Pengemudi:</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center font-bold">
              🏆
            </div>
            <div className="font-bold text-white text-[11px]">Top Safety 2026</div>
            <div className="text-[9px] text-slate-400">Skor 90+ 30 Hari</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center font-bold">
              🌿
            </div>
            <div className="font-bold text-white text-[11px]">Eco Champion</div>
            <div className="text-[9px] text-slate-400">Hemat BBM &gt;12%</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center font-bold">
              🎯
            </div>
            <div className="font-bold text-white text-[11px]">Zero Incident</div>
            <div className="text-[9px] text-slate-400">100 Hari Aman</div>
          </div>
        </div>
      </div>

      {/* Device & Technical Metadata */}
      <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>Perangkat / OS:</span>
          <span className="text-white">{session.deviceInfo.osVersion}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Versi Aplikasi:</span>
          <span className="text-cyan-300">{session.deviceInfo.appVersion}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Baterai HP:</span>
          <span className="text-emerald-400 font-bold">{session.deviceInfo.batteryLevel}% (Aman)</span>
        </div>
      </div>
    </div>
  );
};
