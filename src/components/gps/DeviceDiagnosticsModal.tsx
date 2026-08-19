/**
 * Fleet Intelligence Smart AI - Device Diagnostics Modal Component
 * PROMPT 10 - Real-time Diagnostic Runner & Health Audit Analysis
 */

import React, { useState, useEffect } from 'react';
import { GPSDeviceExtended, DeviceDiagnosticResult } from '../../types/gps';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import {
  X,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ShieldCheck,
  Cpu,
  Radio,
  Zap,
  Wifi,
  HardDrive
} from 'lucide-react';

interface DeviceDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: GPSDeviceExtended;
  performedBy: string;
}

export const DeviceDiagnosticsModal: React.FC<DeviceDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  device,
  performedBy
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [result, setResult] = useState<DeviceDiagnosticResult | null>(null);

  const startDiagnostics = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setResult(null);

    // Simulate multi-step diagnostic process
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 6) {
          clearInterval(timer);
          const diagResult = gpsDeviceService.runDiagnostics(device.id, performedBy);
          setResult(diagResult);
          setIsRunning(false);
          return 7;
        }
        return prev + 1;
      });
    }, 400);
  };

  useEffect(() => {
    if (isOpen) {
      startDiagnostics();
    }
  }, [isOpen, device.id]);

  if (!isOpen) return null;

  const categories = [
    { label: 'Pemeriksaan Format IMEI', icon: Cpu },
    { label: 'Status Registrasi SIM', icon: Radio },
    { label: 'Konektivitas Jaringan Seluler', icon: Wifi },
    { label: 'Gateway Handshake TCP', icon: HardDrive },
    { label: 'Sinyal Satelit GPS', icon: Activity },
    { label: 'Tegangan Sumber Daya (Aki)', icon: Zap },
    { label: 'Pemeriksaan Versi Firmware', icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Diagnostik Perangkat GPS
                <span className="text-xs font-normal text-slate-400 font-mono">({device.deviceCode})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Unit {device.vehiclePlate || 'Unassigned'} • IMEI {device.imei}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Progress Animation */}
          {isRunning && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                  Menjalankan Diagnostik Otomatis...
                </span>
                <span>{Math.round((currentStep / 7) * 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${(currentStep / 7) * 100}%` }}
                />
              </div>

              <div className="space-y-2 pt-2">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  const isDone = currentStep > idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-all ${
                        isDone
                          ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
                          : isCurrent
                          ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                          : 'border-slate-800 bg-slate-950/40 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        <span>{cat.label}</span>
                      </div>
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                      ) : (
                        <span className="text-[10px] uppercase font-mono text-slate-600">Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result View */}
          {!isRunning && result && (
            <div className="space-y-6">
              {/* Overall Summary Card */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  result.overallStatus === 'pass'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : result.overallStatus === 'warn'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}
              >
                {result.overallStatus === 'pass' ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : result.overallStatus === 'warn' ? (
                  <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold capitalize">
                    Hasil Diagnostik:{' '}
                    {result.overallStatus === 'pass'
                      ? 'SEHAT & OPTIMAL (PASS)'
                      : result.overallStatus === 'warn'
                      ? 'PERINGATAN KINERJA (WARNING)'
                      : 'PERHATIAN KRITIS (CRITICAL)'}
                  </h3>
                  <p className="text-xs opacity-90">{result.findings[0]}</p>
                </div>
              </div>

              {/* Detailed Checks */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Rincian Hasil Inspeksi Component
                </h4>
                <div className="space-y-2">
                  {result.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="flex items-start justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/60 text-xs gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          <span>{chk.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {chk.category}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{chk.message}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] shrink-0 ${
                          chk.status === 'pass'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : chk.status === 'warn'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {chk.status === 'pass' && <CheckCircle2 className="h-3 w-3" />}
                        {chk.status === 'warn' && <AlertTriangle className="h-3 w-3" />}
                        {chk.status === 'fail' && <XCircle className="h-3 w-3" />}
                        {chk.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800 pt-3">
                <span>Inspektur: {result.performedBy}</span>
                <span>Waktu Audit: {new Date(result.timestamp).toLocaleTimeString('id-ID')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4 bg-slate-950/50">
          <button
            onClick={startDiagnostics}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            Ulangi Diagnostik
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
