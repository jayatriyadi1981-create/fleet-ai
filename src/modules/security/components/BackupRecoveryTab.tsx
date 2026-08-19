/**
 * Fleet Intelligence Smart AI - Backup, Snapshot & Disaster Recovery Tab
 * PROMPT 50 - Automated Snapshots, AES-256 Encryption, RTO/RPO & DR Rehearsal
 */

import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  RotateCw,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Server,
  Key,
  HardDrive,
  FileCheck,
} from 'lucide-react';
import { backupService } from '../services/backupService';
import { RestoreRehearsalModal } from './RestoreRehearsalModal';
import { BackupRecord, DisasterRecoveryStatus } from '../types/securityTypes';

export const BackupRecoveryTab: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>(() =>
    backupService.getBackups()
  );
  const [drStatus, setDrStatus] = useState<DisasterRecoveryStatus>(() =>
    backupService.getDisasterRecoveryStatus()
  );
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRehearsalModalOpen, setIsRehearsalModalOpen] = useState(false);

  const handleRefresh = () => {
    setBackups(backupService.getBackups());
    setDrStatus(backupService.getDisasterRecoveryStatus());
  };

  const handleCreateSnapshot = async (type: 'DATABASE' | 'FILES' | 'FULL') => {
    setIsCreatingBackup(true);
    await backupService.createBackup(type, 'GLOBAL_PLATFORM', 90);
    setIsCreatingBackup(false);
    handleRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <h3 className="font-semibold text-white text-lg">Continuous Backup & Disaster Recovery Architecture</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Automated Point-in-Time recovery (PITR) with AES-256 GCM encrypted immutable snapshots and cross-region replication.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={isCreatingBackup}
            onClick={() => handleCreateSnapshot('FULL')}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition shadow-sm"
          >
            {isCreatingBackup ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                Snapshotting...
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Create Encrypted Snapshot
              </>
            )}
          </button>
          <button
            onClick={() => setIsRehearsalModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Run DR Rehearsal
          </button>
        </div>
      </div>

      {/* RTO / RPO Performance Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recovery Point (RPO)</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{drStatus.actualRpoMinutes} min</span>
            <span className="text-xs text-slate-500">/ max {drStatus.targetRpoMinutes} min</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Live WAL stream ({drStatus.replicationLagSeconds}s lag)
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recovery Time (RTO)</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{drStatus.actualRtoMinutes} min</span>
            <span className="text-xs text-slate-500">/ max {drStatus.targetRtoMinutes} min</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Automated hot standby failover
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">DR Readiness Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">
              {drStatus.drReadinessScorePercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Last rehearsal: {new Date(drStatus.lastDrRehearsalAt).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Encryption Standard</span>
            <Key className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white tracking-tight">AES-256-GCM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Envelope keys rotated quarterly
          </p>
        </div>
      </div>

      {/* Backup Snapshots Repository Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-white">Verified Snapshot Archives & Checksums</h4>
          </div>
          <span className="text-xs text-slate-400">{backups.length} Snapshots Available</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Snapshot ID & Type</th>
                <th className="pb-3 font-semibold">Size</th>
                <th className="pb-3 font-semibold">Records</th>
                <th className="pb-3 font-semibold">SHA-256 Checksum</th>
                <th className="pb-3 font-semibold">Created Timestamp</th>
                <th className="pb-3 font-semibold">Retention</th>
                <th className="pb-3 font-semibold text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-slate-950/40 transition">
                  <td className="py-3.5 pr-3">
                    <div className="font-medium text-white font-mono">{b.id}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {b.backupType}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-300 font-mono">
                    {(b.sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </td>
                  <td className="py-3.5 pr-3 text-slate-300 font-mono">
                    {b.recordCount.toLocaleString()}
                  </td>
                  <td className="py-3.5 pr-3 text-slate-400 font-mono text-[11px]">
                    {b.checksumSha256 ? `${b.checksumSha256.substring(0, 16)}...` : 'Pending'}
                  </td>
                  <td className="py-3.5 pr-3 text-slate-400">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 pr-3 text-slate-400">
                    {b.retentionDays} Days
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full font-medium text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RestoreRehearsalModal
        isOpen={isRehearsalModalOpen}
        onClose={() => setIsRehearsalModalOpen(false)}
        onCompleted={handleRefresh}
      />
    </div>
  );
};
