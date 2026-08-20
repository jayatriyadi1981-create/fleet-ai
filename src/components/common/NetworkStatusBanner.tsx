import React, { useState, useEffect } from 'react';
import { WifiOff, Radio, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

export const NetworkStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const { isGpsSimRunning } = useFleet();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Internet Offline Banner
  if (!isOnline) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="bg-amber-500/90 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md transition-all duration-200 z-40"
      >
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <WifiOff className="h-4 w-4 shrink-0 text-slate-950 animate-pulse" />
          <span>
            Mode Offline: Koneksi internet perangkat terputus. Sistem tetap menampilkan cache data lokal.
          </span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="ml-3 inline-flex items-center gap-1 bg-slate-950/20 hover:bg-slate-950/30 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-950 transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Coba Hubungkan</span>
        </button>
      </div>
    );
  }

  // Reconnected Toast Banner
  if (showReconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-emerald-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between shadow-md transition-all duration-200 z-40"
      >
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-950" />
          <span>Koneksi internet kembali aktif. Sinkronisasi telemetri real-time dipulihkan.</span>
        </div>
        <button
          onClick={() => setShowReconnected(false)}
          className="text-slate-950/70 hover:text-slate-950 p-1"
          aria-label="Tutup"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // GPS Disconnected Notice (if specifically disconnected while internet is fine)
  if (!isGpsSimRunning) {
    return (
      <div
        role="alert"
        className="bg-slate-900 border-b border-amber-500/30 text-amber-300 px-4 py-1.5 text-xs font-medium flex items-center justify-between"
      >
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Radio className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>
            Simulasi Telemetri GPS Lokal sedang dijeda. Data posisi armada tidak diperbarui secara otomatis.
          </span>
        </div>
      </div>
    );
  }

  return null;
};
