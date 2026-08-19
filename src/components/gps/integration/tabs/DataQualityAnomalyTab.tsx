/**
 * Fleet Intelligence Smart AI - GPS Integration: Data Quality & Anomaly Engine Tab
 * PROMPT 43: Telemetry Quality Scoring, Anomaly Detection Rules, GPS Jumps & Impossible Speeds
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Activity,
  Gauge,
  TrendingUp,
  Filter,
  Info,
  Clock
} from 'lucide-react';
import { GPSDataQualityMetric, AnomalyType } from '../../../../types/gpsIntegration';
import { MOCK_QUALITY_METRICS } from '../../../../constants/gpsIntegrationData';

export const DataQualityAnomalyTab: React.FC = () => {
  const [metrics] = useState<GPSDataQualityMetric[]>(MOCK_QUALITY_METRICS);
  const [activeAnomalyFilter, setActiveAnomalyFilter] = useState<string>('ALL');

  const anomalyRules = [
    {
      type: 'IMPOSSIBLE_SPEED',
      name: 'Impossible Speed Threshold (> 180 km/h)',
      desc: 'Mendeteksi lonjakan kecepatan abnormal yang melebihi batas fisik kendaraan komersial.',
      severity: 'CRITICAL',
      action: 'Flagged as INVALID, dropped from trip distance calculation'
    },
    {
      type: 'GPS_JUMP',
      name: 'GPS Teleportation / Coordinate Jump',
      desc: 'Mendeteksi pergeseran koordinat drastis (> 10 km dalam < 10 detik) akibat multipath reflection.',
      severity: 'WARNING',
      action: 'Coordinate smoothed using Kalman filter algorithm'
    },
    {
      type: 'DUPLICATE_POSITION',
      name: 'Duplicate Coordinate Packet',
      desc: 'Mendeteksi pengiriman paket berulang dengan timestamp dan koordinat identik.',
      severity: 'INFO',
      action: 'Deduplicated in pipeline buffer, single entry stored'
    },
    {
      type: 'STALE_TIMESTAMP',
      name: 'Stale / Outdated Hardware Clock',
      desc: 'Mendeteksi paket dengan timestamp perangkat yang lebih tua dari 180 hari.',
      severity: 'CRITICAL',
      action: 'Sent to Dead Letter Queue (DLQ) for clock recalibration'
    },
    {
      type: 'SIGNAL_LOSS_SPIKE',
      name: 'HDOP Degradation & Low Satellites (< 4 sats)',
      desc: 'Mendeteksi akurasi GNSS rendah di area terowongan / basement gedung.',
      severity: 'WARNING',
      action: 'Quality downgraded to POOR, accuracy radius expanded'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Quality Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Platform Fleet Data Quality Score</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-emerald-400">97.8%</span>
            <span className="text-xs font-medium text-emerald-500 font-mono">GRADE A (EXCELLENT)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            99.2% paket data lolos validasi tanpa anomali koordinat.
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Anomali Terdeteksi (24 Jam)</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-amber-400">362</span>
            <span className="text-xs font-medium text-slate-400">dari 17,280 paket</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Mayoritas adalah GPS Jumps minor di area gedung bertingkat.
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Kalman Filter Auto-Smoothing</span>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-cyan-400">100%</span>
            <span className="text-xs font-medium text-cyan-500 font-mono">ACTIVE</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Mencegah lonjakan jarak (odometer inflation) secara otomatis.
          </div>
        </div>
      </div>

      {/* Anomaly Detection Rules Engine */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" /> Aturan Mesin Deteksi Anomali &amp; Sanitasi Koordinat
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pipeline memvalidasi integritas fisika dan waktu setiap titik GPS sebelum disuplai ke modul bisnis.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            5 Active Rules
          </span>
        </div>

        <div className="space-y-3">
          {anomalyRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{rule.name}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      rule.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : rule.severity === 'WARNING'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {rule.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{rule.desc}</p>
              </div>

              <div className="text-left md:text-right font-mono text-[11px]">
                <span className="text-slate-500 block text-[10px]">Pipeline Sanitization Action:</span>
                <span className="text-cyan-300 font-semibold">{rule.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
